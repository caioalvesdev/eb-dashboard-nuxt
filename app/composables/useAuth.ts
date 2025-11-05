import type { AuthSession } from "@supabase/supabase-js";

export function useAuth() {
  const supabase = useSupabaseClient();
  const { setUser } = useUser();

  const loginWithMagicLink = async ({
    email,
  }: {
    email: string;
  }): Promise<void> => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, data: { role: "admin" } },
    });

    if (error) throw error;
  };

  const getSession = async (): Promise<AuthSession | null> => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;
    const profile = await getProfile(session?.user.id || "");

    if (session && session?.user) {
      setUser({ ...session.user, profile });
    }

    return session;
  };

  const getProfile = async (id: string): Promise<Profile> => {
    if (!id) return {} as Profile;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ?? ({} as Profile);
  };

  return { loginWithMagicLink, getSession, getProfile };
}
