import { serverSupabaseClient } from "#supabase/server";
import { z } from "zod";

type EventType = Parameters<typeof sendError>[0];
type ErrorType = Parameters<typeof createError>[0];

const validationSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2100),
});

function throwError(event: EventType, error: ErrorType): void {
  return sendError(event, createError(error));
}

export default defineEventHandler(async (event) => {
  const input = await getValidatedQuery(event, validationSchema.safeParse);

  if (!input.success) {
    return throwError(event, { statusCode: 400, message: input.error.message });
  }

  const client = await serverSupabaseClient(event);

  const { month, year } = input.data;
  const { data, error } = await client.rpc("soma_carteira_mba_por_semana", {
    filter_month: month,
    filter_year: year,
  });

  if (error) {
    return throwError(event, { statusCode: 500, message: error.message });
  }

  return { data };
});
