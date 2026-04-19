-- RFC 002 — Credits ledger + materialized balances.
-- Do NOT apply automatically; see dabble-2/TODO.md. Apply in Supabase SQL Editor or CLI when ready.

-- ---------------------------------------------------------------------------
-- 1) credit_ledger — append-only (mutations blocked for non-owner roles via RLS + no policies)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.credit_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  delta integer NOT NULL,
  currency text NOT NULL DEFAULT 'CREDIT',
  reason text NOT NULL,
  session_id uuid NULL,
  counterparty_user_id uuid NULL REFERENCES auth.users (id) ON DELETE SET NULL,
  idempotency_key text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT credit_ledger_idempotency_key_unique UNIQUE (idempotency_key),
  CONSTRAINT credit_ledger_currency_credit CHECK (currency = 'CREDIT'),
  CONSTRAINT credit_ledger_delta_nonzero CHECK (delta <> 0)
);

CREATE INDEX IF NOT EXISTS credit_ledger_user_created_idx
  ON public.credit_ledger (user_id, created_at DESC);

COMMENT ON TABLE public.credit_ledger IS 'Append-only credit movements; writes only via service role / SECURITY DEFINER paths.';

-- ---------------------------------------------------------------------------
-- 2) credit_balances — maintained by trigger from ledger (held_credits reserved for session_holds RFC)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.credit_balances (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  available_credits integer NOT NULL DEFAULT 0,
  held_credits integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT credit_balances_available_non_negative CHECK (available_credits >= 0),
  CONSTRAINT credit_balances_held_non_negative CHECK (held_credits >= 0)
);

COMMENT ON TABLE public.credit_balances IS 'Derived from credit_ledger for available_credits; held_credits for future session holds.';

-- ---------------------------------------------------------------------------
-- 3) Trigger: apply ledger delta to balance; reject if available would go negative
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.credit_ledger_after_insert_apply_balance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_available integer;
BEGIN
  INSERT INTO public.credit_balances (user_id, available_credits, held_credits, updated_at)
  VALUES (NEW.user_id, NEW.delta, 0, now())
  ON CONFLICT (user_id) DO UPDATE SET
    available_credits = public.credit_balances.available_credits + EXCLUDED.available_credits,
    updated_at = now();

  SELECT available_credits INTO v_available
  FROM public.credit_balances
  WHERE user_id = NEW.user_id;

  IF v_available IS NULL OR v_available < 0 THEN
    RAISE EXCEPTION 'insufficient credits for user %', NEW.user_id
      USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS credit_ledger_apply_balance ON public.credit_ledger;
CREATE TRIGGER credit_ledger_apply_balance
  AFTER INSERT ON public.credit_ledger
  FOR EACH ROW
  EXECUTE PROCEDURE public.credit_ledger_after_insert_apply_balance();

-- ---------------------------------------------------------------------------
-- 4) RLS — authenticated users read only their own rows; no client INSERT/UPDATE/DELETE
--    (service_role bypasses RLS for server routes using SUPABASE_SERVICE_ROLE_KEY)
-- ---------------------------------------------------------------------------

ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_balances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "credit_ledger_select_own" ON public.credit_ledger;
CREATE POLICY "credit_ledger_select_own"
  ON public.credit_ledger
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "credit_balances_select_own" ON public.credit_balances;
CREATE POLICY "credit_balances_select_own"
  ON public.credit_balances
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Optional: allow anon to read nothing (default deny)

GRANT SELECT ON public.credit_ledger TO authenticated;
GRANT SELECT ON public.credit_balances TO authenticated;

-- Server (PostgREST with service role JWT) writes ledger; clients never insert directly.
GRANT INSERT ON public.credit_ledger TO service_role;
GRANT SELECT ON public.credit_ledger TO service_role;
GRANT SELECT ON public.credit_balances TO service_role;
