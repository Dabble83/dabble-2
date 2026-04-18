export default function AboutPage() {
  return (
    <div className="py-16">
      <section className="ui-container max-w-3xl space-y-8">
        <header className="space-y-3">
          <p className="ui-label">About Dabble</p>
          <h1 className="ui-heading text-5xl">Learn and share with neighbors</h1>
        </header>

        <p className="text-lg leading-8 text-[var(--text-primary)]">
          Dabble is a calm, anti-hustle platform for in-person skills exchange.
          People join as peers: everyone can share what they know and explore
          what they want to learn.
        </p>

        <div className="ui-card space-y-4 p-6">
          <h2 className="ui-heading text-2xl">How it works</h2>
          <ul className="list-disc space-y-2 pl-6 text-[var(--text-secondary)]">
            <li>Create a profile with your offers and learning goals.</li>
            <li>Discover nearby dabblers by neighborhood.</li>
            <li>Arrange simple in-person swaps and keep it human.</li>
          </ul>
        </div>

        <p className="text-base leading-7 text-[var(--text-secondary)]">
          We avoid marketplace pressure, urgency tactics, and gamification. The
          goal is quality local connection.
        </p>
      </section>
    </div>
  );
}