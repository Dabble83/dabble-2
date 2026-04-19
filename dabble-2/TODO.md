# TODO

- Apply migration 20260419120000_extend_profiles.sql in Supabase dashboard before merging.
- **Do not run** `supabase/migrations/20260420130000_credits.sql` until reviewed; it creates `credit_ledger`, `credit_balances`, RLS, and the balance trigger. After apply, reconcile legacy `profiles.credit_balance` with ledger if needed.
- **Do not run** `supabase/migrations/20260421140000_sessions.sql` until reviewed; apply **after** credits migration when using the optional `credit_ledger.session_id → sessions.id` FK. Creates `sessions`, `session_messages`, `session_ratings`.
