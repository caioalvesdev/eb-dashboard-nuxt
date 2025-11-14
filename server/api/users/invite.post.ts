import { serverSupabaseServiceRole } from "#supabase/server";
import * as z from "zod";
import sendZodError from "../utils/send-zod-error";

const Schema = z.object({
  email: z.email(),
  metadata: z.object().optional(),
  redirectTo: z.url().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const input = await readValidatedBody(event, Schema.safeParse);

    if (!input.success) {
      return sendZodError(event, input.error);
    }

    const supabaseAdmin = serverSupabaseServiceRole(event);
    const { email, metadata, redirectTo } = input.data;

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: metadata || {},
        redirectTo: redirectTo || `${config.public.supabaseUrl}/confirm`,
      }
    );

    if (error) {
      throw createError({
        statusCode: 400,
        message: error.message,
      });
    }

    return { user: data.user };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao convidar usuário",
    });
  }
});
