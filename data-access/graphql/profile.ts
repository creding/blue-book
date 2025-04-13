import { GET_PROFILE, GetProfileResponse, ProfileRecord } from "./queries/profile";
import { UPDATE_PROFILE, UpdateProfileResponse } from "./mutations/profile";
import { createApolloClient } from "@/lib/apollo";
import { createClient } from "@/lib/supabaseServerClient";
import { Profile } from "@/types/profile";

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const client = createApolloClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    session!.access_token
  );

  try {
    const { data } = await client.query<GetProfileResponse>({
      query: GET_PROFILE,
      variables: {
        userId,
      },
    });

    const profile = data.profilesCollection.edges[0]?.node;
    if (!profile) return null;

    return {
      ...profile,
      id: profile.id,
    };
  } catch (error) {
    console.error("Error getting profile:", error);
    return null;
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const client = createApolloClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    session!.access_token
  );

  try {
    const { data } = await client.mutate<UpdateProfileResponse>({
      mutation: UPDATE_PROFILE,
      variables: {
        userId,
        username: updates.username,
        fullName: updates.full_name,
        avatarUrl: updates.avatar_url,
      },
    });

    const profile = data?.updateprofilesCollection.records[0];
    if (!profile) return null;

    return {
      ...profile,
      id: profile.id,
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return null;
  }
}
