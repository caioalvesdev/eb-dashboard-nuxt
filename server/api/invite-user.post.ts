import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  if (!body.email) {
    throw createError({
      statusCode: 400,
      message: "Email é obrigatório",
    });
  }

  try {
    const supabaseAdmin = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Convida o usuário usando a API admin
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      body.email,
      {
        data: body.metadata || {}, // Metadados opcionais
        redirectTo: body.redirectTo || `${config.public.supabaseUrl}/confirm`,
      }
    );

    if (error) {
      throw createError({
        statusCode: 400,
        message: error.message,
      });
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao convidar usuário",
    });
  }
});
