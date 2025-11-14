import { serverSupabaseSession } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const session = await serverSupabaseSession(event);
  if (!session) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      })
    );
  }
});
