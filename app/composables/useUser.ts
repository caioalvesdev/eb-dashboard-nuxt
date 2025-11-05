import type { PostgrestSingleResponse, User } from "@supabase/supabase-js";
import { ref } from "vue";
import type { Database } from "~/types/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type UserProfile = User & {
  profile: Profile | null;
};

const user = ref<UserProfile | null>(null);

export function useUser() {
  const setUser = (input: UserProfile): void => {
    const { profile, ...userInfo } = input;
    user.value = { ...userInfo, profile };
  };

  const updateProfile = async (
    profile: Partial<Profile>
  ): Promise<PostgrestSingleResponse<null>> => {
    try {
      const supabase = useSupabaseClient();
      if (!user.value || !user.value.id)
        throw new Error("No user is logged in.");

      return await supabase
        .from("profiles")
        .upsert({ ...profile, id: user.value.id })
        .throwOnError();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const uploadProfilePicture = async (file: File) => {
    if (!file) return null;

    const client = useSupabaseClient();
    const userId = user.value?.id;
    if (!userId) throw new Error("Usuário não autenticado");
    const ext = file.name.split(".").pop();
    const filePath = `avatars/${userId}.${ext}`;

    const { error } = await client.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const { publicUrl } = client.storage
      .from("avatars")
      .getPublicUrl(filePath).data;
    return { data: { publicUrl } };
  };

  return { user, setUser, updateProfile, uploadProfilePicture };
}
