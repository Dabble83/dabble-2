import Link from "next/link";
import { Button, Card, Input } from "@/app/components/ui";

export default function SignUpPage() {
  return (
    <div className="py-16">
      <section className="ui-container max-w-xl">
        <Card title="Create your Dabble profile">
          <form className="space-y-4">
            <label className="block space-y-2">
              <span className="ui-label">Display name</span>
              <Input placeholder="How neighbors will know you" />
            </label>
            <label className="block space-y-2">
              <span className="ui-label">Email</span>
              <Input type="email" placeholder="you@example.com" />
            </label>
            <label className="block space-y-2">
              <span className="ui-label">Password</span>
              <Input type="password" placeholder="Create a password" />
            </label>
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>
          <p className="mt-4 font-sans text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link href="/dabble/signin" className="underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </section>
    </div>
  );
}
