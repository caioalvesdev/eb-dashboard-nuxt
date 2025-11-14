import type { H3Event } from "h3";
import { serverSupabaseSession } from "#supabase/server";

export default function defineAuthenticatedEventHandler<T>(
  handler: (event: H3Event) => T
) {
  return defineEventHandler(async (event) => {
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

    return handler(event);
  });
}
