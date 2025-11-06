export default defineEventHandler(async (event) => {
  // const client = await serverSupabaseServiceRole(event);
  // const user = await serverSupabaseUser(event);

  // if (!user) {
  //   throw createError({
  //     statusCode: 401,
  //     message: "Não autorizado",
  //   });
  // }

  // try {
  //   await client.from("profiles").delete().eq("id", user.id);

  //   const { error } = await client.auth.admin.deleteUser(user.id);

  //   if (error) throw error;

  //   return { success: true, message: "Conta excluída com sucesso" };
  // } catch (error: any) {
  //   throw createError({
  //     statusCode: 500,
  //     message: error.message || "Erro ao excluir conta",
  //   });
  // }
});
