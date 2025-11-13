export default defineNuxtRouteMiddleware(async (to, from) => {
  const supabase = useSupabaseClient();
  const { user, setUser } = useUser();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user && !user.value) {
    console.log({ session });
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    console.log({ profileData });

    if (error) {
      console.log("Error fetching profile:", error);
    } else {
      setUser({ ...session.user, profile: profileData });
    }
  }
});
