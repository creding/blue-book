import {
  GET_PROFILE,
  GetProfileResponse,
  ProfileRecord,
} from "./queries/profile";
import { UPDATE_PROFILE, UpdateProfileResponse } from "./mutations/profile";
import { createClient } from "@/lib/supabase";
import { Profile } from "@/types/profile";

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: accessToken
            ? `Bearer ${accessToken}`
            : `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          "X-Client-Info": "supabase-js/2.21.0",
        },
        body: JSON.stringify({
          query: GET_PROFILE.loc?.source.body,
          variables: {
            userId,
          },
        }),
        next: {
          revalidate: 0,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = (await response.json()) as { data: GetProfileResponse };
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
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: accessToken
            ? `Bearer ${accessToken}`
            : `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          "X-Client-Info": "supabase-js/2.21.0",
        },
        body: JSON.stringify({
          query: UPDATE_PROFILE.loc?.source.body,
          variables: {
            userId,
            username: updates.username,
            fullName: updates.full_name,
            avatarUrl: updates.avatar_url,
          },
        }),
        next: {
          revalidate: 0,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = (await response.json()) as { data: UpdateProfileResponse };
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
