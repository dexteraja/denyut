import { getUserProfile } from "@/lib/mock-data";
import { ProfileView } from "@/components/profile-view";
import { notFound } from "next/navigation";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = getUserProfile(username);
  if (!profile) return notFound();

  return <ProfileView profile={profile} isOwnProfile={false} />;
}
