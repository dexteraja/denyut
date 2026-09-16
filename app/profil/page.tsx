import { getUserProfile } from "@/lib/mock-data";
import { ProfileView } from "@/components/profile-view";
import { notFound } from "next/navigation";

export default function OwnProfilePage() {
  // Demo session: in production this resolves from the authenticated
  // NextAuth session instead of a hardcoded username.
  const profile = getUserProfile("komedi.receh");
  if (!profile) return notFound();

  return <ProfileView profile={profile} isOwnProfile />;
}
