// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  hooks: {
    "vite:extendConfig": extendViteConfig,
  },

  runtimeConfig: {
    private: {
      supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    },
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    },
  },

  supabase: {
    redirectOptions: {
      login: "/auth/signin",
      callback: "/auth/callback",
      include: ["auth/pending"],
      saveRedirectToCookie: false,
    },
  },

  css: ["~/assets/css/main.css"],

  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/ui",
    "@nuxtjs/supabase",
  ],
});
function extendViteConfig(config: import("vite").UserConfig) {
  const plugin = config.plugins?.find((plugin) =>
    isPlugin(plugin, "nuxt:environments")
  );
  if (plugin) plugin.enforce = "pre";
}

function isPlugin(
  plugin: unknown,
  name: string
): plugin is import("vite").Plugin {
  return !!(
    plugin &&
    typeof plugin === "object" &&
    "name" in plugin &&
    plugin.name === name
  );
}
