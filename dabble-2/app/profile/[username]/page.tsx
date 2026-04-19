import PublicProfilePage from "@/app/profile/[username]/PublicProfileClient";

export const dynamicParams = true;

export function generateStaticParams() {
  return [{ username: "demo-user" }];
}

export default function PublicProfileRoutePage() {
  return <PublicProfilePage />;
}
