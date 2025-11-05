export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  if(user.value && to.path === '/auth/signin') {
    return navigateTo('/');
  }
  // if (!user?.value && to.path !== "/auth/signin") {
  //   return navigateTo("/auth/signin");
  // }
  // console.log({ toPath: to.path });
  // console.log({ user: user?.value });
  // console.log(
  //   ["/auth/signin", "/auth/confirm"].includes(to.path) && user?.value
  // );
  // if (user?.value && ["/auth/signin", "/auth/confirm"].includes(to.path)) {
  //   console.log("----------------------------");
  //   console.log({ user: user.value });

  //   return navigateTo("/");
  // }
  // return;
});
