import Link from "next/link";
import { Button, Card, Input } from "@/app/components/ui";

export default function SignInPage() {
  return (
    <div className="py-16">
      <section className="ui-container max-w-xl">
        <Card title="Sign in">
          <form className="space-y-4">
            <label className="block space-y-2">
              <span className="ui-label">Email</span>
              <Input type="email" placeholder="you@example.com" />
            </label>
            <label className="block space-y-2">
              <span className="ui-label">Password</span>
              <Input type="password" placeholder="Your password" />
            </label>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
          <p className="mt-4 font-sans text-sm text-[var(--text-secondary)]">
            New here?{" "}
            <Link href="/dabble/signup" className="underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </Card>
      </section>
    </div>
  );
}
