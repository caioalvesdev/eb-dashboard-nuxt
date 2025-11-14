import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event);
    const query = getQuery(event);

    const page = parseInt(query.page as string) || 1;
    const perPage = parseInt(query.perPage as string) || 50;

    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw createError({
        statusCode: 400,
        message: error.message,
      });
    }

    const userIds = data.users.map((user) => user.id);

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds);

    if (profilesError) console.error("Erro ao buscar profiles:", profilesError);

    const usersWithProfiles = data.users.map((user) => {
      const profile = profiles?.find((p) => p.id === user.id);
      return { ...user, profile: profile || null };
    });

    return {
      users: usersWithProfiles,
      total: data.users.length,
      page,
      perPage,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao listar usuários",
    });
  }
});
