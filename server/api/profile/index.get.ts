import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  const { data: profile, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", user?.sub!)
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return {
    name: profile.full_name,
    email: profile.email,
    username: profile.username,
    avatar: profile.avatar_url,
    bio: profile.bio,
  };
});
