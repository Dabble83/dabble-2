"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/app/components/ui";

interface TermsModalProps {
  termsAccepted: boolean;
  onAccept: () => void;
}

export function TermsModal({ termsAccepted, onAccept }: TermsModalProps) {
  const [checked, setChecked] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (termsAccepted) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [termsAccepted]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    if (atBottom) setScrolledToBottom(true);
  };

  if (termsAccepted) return null;

  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(28,36,36,0.55)] px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
    >
      <div className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-[0_32px_80px_-24px_rgba(42,61,44,0.35)]">
        <div className="border-b border-[var(--border)] px-6 py-5">
          <p className="ui-label mb-1">Before you continue</p>
          <h2 id="terms-modal-title" className="ui-heading text-xl text-[var(--text-primary)]">
            Terms of Use &amp; Disclaimer
          </h2>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overscroll-contain px-6 py-5 font-sans text-sm leading-relaxed text-[var(--text-secondary)]"
        >
          <p className="mb-4 text-xs text-[var(--text-tertiary)]">Last updated: {today}</p>
          <p className="mb-4">
            Welcome to Dabble. Before creating an account, please read the following carefully.
          </p>

          <h3 className="mb-2 font-semibold text-[var(--text-primary)]">1. What Dabble Is</h3>
          <p className="mb-4">
            Dabble is a community platform that helps curious people share skills, knowledge, and
            time with one another on a casual, non-commercial basis. All exchanges use Dabble
            credits — not money. Dabble is not a marketplace, staffing agency, professional
            services platform, or licensed instruction service.
          </p>

          <h3 className="mb-2 font-semibold text-[var(--text-primary)]">
            2. You Use Dabble at Your Own Risk
          </h3>
          <p className="mb-2">
            By creating an account, you acknowledge and agree that:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-5">
            <li>
              All interactions, meetups, exchanges, and communications that occur through or as a
              result of using Dabble are entirely at your own risk.
            </li>
            <li>
              Dabble.it.com, its founders, operators, employees, contractors, and affiliates
              (collectively, &ldquo;Dabble&rdquo;) are not responsible for — and you expressly
              release Dabble from all liability for — any injury, loss, damage, harm, or outcome of
              any kind that arises from your use of the platform or your interactions with other
              users, whether online or in person.
            </li>
            <li>
              Dabble does not screen, verify, license, or certify its users, their skills, their
              qualifications, or their identities. You are responsible for exercising your own
              judgment before meeting or engaging with anyone you find through Dabble.
            </li>
          </ul>

          <h3 className="mb-2 font-semibold text-[var(--text-primary)]">3. No Safety Guarantee</h3>
          <p className="mb-4">
            Dabble does not provide safety monitoring, emergency services, or any guarantee of user
            safety. Any safety resources, tips, or guidelines published on this site are provided
            for informational purposes only and do not constitute a duty of care or a promise of
            protection.
          </p>

          <h3 className="mb-2 font-semibold text-[var(--text-primary)]">4. Your Responsibilities</h3>
          <p className="mb-2">You agree to:</p>
          <ul className="mb-4 list-disc space-y-2 pl-5">
            <li>
              Be at least 18 years old (or have verifiable parental consent if younger).
            </li>
            <li>
              Interact with other users honestly, respectfully, and in good faith.
            </li>
            <li>Meet in public places and take reasonable personal safety precautions.</li>
            <li>
              Not use Dabble for commercial transactions, solicitation, or any illegal purpose.
            </li>
            <li>
              Report users who violate community guidelines using the in-app reporting tools.
            </li>
          </ul>

          <h3 className="mb-2 font-semibold text-[var(--text-primary)]">
            5. Limitation of Liability
          </h3>
          <p className="mb-4">
            To the fullest extent permitted by applicable law, Dabble&rsquo;s total liability to
            you for any claim arising from use of the platform is zero dollars ($0). In no event
            shall Dabble be liable for any indirect, incidental, special, consequential, or
            punitive damages.
          </p>

          <h3 className="mb-2 font-semibold text-[var(--text-primary)]">6. Governing Law</h3>
          <p className="mb-4">
            These terms are governed by the laws of the State of Oregon, without regard to conflict
            of law principles.
          </p>

          <h3 className="mb-2 font-semibold text-[var(--text-primary)]">
            7. Changes to These Terms
          </h3>
          <p className="mb-4">
            Dabble may update these terms at any time. Continued use of the platform after changes
            are posted constitutes acceptance of the revised terms.
          </p>

          <p className="font-medium text-[var(--text-primary)]">
            If you do not agree to these terms, do not create an account.
          </p>
        </div>

        {!scrolledToBottom ? (
          <p className="border-t border-[var(--border)] px-6 py-2 text-center font-sans text-xs text-[var(--text-tertiary)]">
            Scroll to read all terms before agreeing
          </p>
        ) : null}

        <div className="border-t border-[var(--border)] px-6 py-5 space-y-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              disabled={!scrolledToBottom}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand)]"
            />
            <span className="font-sans text-sm text-[var(--text-secondary)]">
              I have read and agree to the Terms of Use and Disclaimer
            </span>
          </label>
          <Button
            type="button"
            className="w-full py-3 text-base"
            disabled={!checked}
            onClick={onAccept}
          >
            Agree &amp; Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
