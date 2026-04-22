import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getSiteUrl } from "@/lib/site";

type Props = { children: ReactNode; params: Promise<{ username: string }> };

const notFoundDesc =
  "This Dabble profile link does not match anyone yet. Explore neighbors who are teaching and curious nearby.";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const safeUser = username?.trim() || "neighbor";
  const base = getSiteUrl();

  try {
    const res = await fetch(
      `${base}/api/profile/by-username?username=${encodeURIComponent(safeUser)}`,
      { next: { revalidate: 120 } },
    );
    if (!res.ok) {
      return {
        title: `@${safeUser}`,
        description: notFoundDesc,
        robots: res.status === 404 ? { index: false, follow: true } : undefined,
        alternates: { canonical: `/profile/${encodeURIComponent(safeUser)}` },
      };
    }
    const body = (await res.json()) as {
      profile?: {
        display_name?: string | null;
        bio?: string | null;
        avatar_url?: string | null;
        location_label?: string | null;
      };
    };
    const p = body.profile;
    const name = p?.display_name?.trim() || safeUser;
    const line = p?.location_label?.trim();
    const desc =
      p?.bio?.trim() ||
      (line
        ? `${name} teaches and learns on Dabble near ${line}. Browse what they offer, what they are curious about, and say hello at a walking pace.`
        : `${name} is on Dabble — a calm profile for neighbor skills and curiosity. See what they teach, what they want to try, and how to connect without marketplace pressure.`);

    return {
      title: `${name} (@${safeUser})`,
      description: desc,
      alternates: { canonical: `/profile/${encodeURIComponent(safeUser)}` },
      openGraph: {
        title: `${name} (@${safeUser})`,
        description: desc,
        type: "website",
        ...(p?.avatar_url
          ? {
              images: [{ url: p.avatar_url, alt: `${name} profile photo` }],
            }
          : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: `${name} (@${safeUser})`,
        description: desc,
        ...(p?.avatar_url ? { images: [p.avatar_url] } : {}),
      },
    };
  } catch {
    return {
      title: `@${safeUser}`,
      description: notFoundDesc,
      alternates: { canonical: `/profile/${encodeURIComponent(safeUser)}` },
    };
  }
}

export default function PublicProfileLayout({ children }: { children: ReactNode }) {
  return children;
}
