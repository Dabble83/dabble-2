import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-24 font-sans dark:bg-zinc-950">
      <main className="flex w-full max-w-lg flex-col gap-8 text-center sm:text-left">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Phase 0 shell
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dabble 2.0
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Try something new, wherever you are — prototype scaffold. No auth,
          maps, or external APIs wired yet.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/api/health"
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Check API health
          </Link>
          <a
            href="https://nextjs.org/docs"
            className="text-sm font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js docs
          </a>
        </div>
      </main>
    </div>
  );
}
