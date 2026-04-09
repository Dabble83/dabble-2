import Link from "next/link";
import { Card } from "@/app/components/ui";

export default function ProfilePage() {
  return (
    <div className="py-16">
      <section className="ui-container max-w-2xl">
        <Card title="Profile">
          <p className="text-base leading-7 text-[var(--text-secondary)]">
            Profile routing is in place. Auth-aware redirect behavior will be
            wired when Supabase session handling lands in the next phase.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 font-sans text-sm">
            <Link href="/profile/setup" className="underline-offset-4 hover:underline">
              Go to profile setup
            </Link>
            <Link href="/profile/demo-user" className="underline-offset-4 hover:underline">
              View a sample public profile
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
