import { serverSupabaseSession } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const session = await serverSupabaseSession(event);
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
});
