export default defineNuxtPlugin({
  enforce: "post",
  setup() {
    const appConfig = useAppConfig();

    if (import.meta.client) {
      function updateColor(type: "primary" | "neutral") {
        const color = JSON.parse(
          localStorage.getItem("ui-preferences") || "{}"
        );
        const theme = color.theme[type];
        console.log({ color });
        if (theme) {
          appConfig.ui.colors[type] = theme;
        }
      }

      function updateRadius() {
        const radius = localStorage.getItem("nuxt-ui-radius");
        if (radius) {
          appConfig.theme.radius = Number.parseFloat(radius);
        }
      }

      function updateBlackAsPrimary() {
        const blackAsPrimary = localStorage.getItem("nuxt-ui-black-as-primary");
        if (blackAsPrimary) {
          appConfig.theme.blackAsPrimary = blackAsPrimary === "true";
        }
      }

      updateColor("primary");
      updateColor("neutral");
      updateRadius();
      updateBlackAsPrimary();
    }

    if (import.meta.server) {
      useHead({
        script: [
          {
            innerHTML: `
            let html = document.querySelector('style#nuxt-ui-colors').innerHTML;

            if (localStorage.getItem('ui-preferences')) {
              const primaryColor = localStorage.getItem('ui-preferences') ? JSON.parse(localStorage.getItem('ui-preferences')).theme.primary : null;
              if (primaryColor !== 'black') {
                html = html.replace(
                  /(--ui-color-primary-\\d{2,3}:\\s*var\\(--color-)${appConfig.ui.colors.primary}(-\\d{2,3}.*?\\))/g,
                  \`$1\${primaryColor}$2\`
                );
              }
            }
            if (localStorage.getItem('ui-preferences')) {
              let neutralColor = localStorage.getItem('ui-preferences') ? JSON.parse(localStorage.getItem('ui-preferences')).theme.neutral : null;
              html = html.replace(
                /(--ui-color-neutral-\\d{2,3}:\\s*var\\(--color-)${appConfig.ui.colors.neutral}(-\\d{2,3}.*?\\))/g,
                \`$1\${neutralColor === 'neutral' ? 'old-neutral' : neutralColor}$2\`
              );
            }

            document.querySelector('style#nuxt-ui-colors').innerHTML = html;
            `.replace(/\s+/g, " "),
            type: "text/javascript",
            tagPriority: -1,
          },
          {
            innerHTML: `
            if (localStorage.getItem('nuxt-ui-radius')) {
              document.querySelector('style#nuxt-ui-radius').innerHTML = ':root { --ui-radius: ' + localStorage.getItem('nuxt-ui-radius') + 'rem; }';
            }
          `.replace(/\s+/g, " "),
            type: "text/javascript",
            tagPriority: -1,
          },
          {
            innerHTML: `
            if (localStorage.getItem('nuxt-ui-black-as-primary') === 'true') {
              document.querySelector('style#nuxt-ui-black-as-primary').innerHTML = ':root { --ui-primary: black; } .dark { --ui-primary: white; }';
            } else {
              document.querySelector('style#nuxt-ui-black-as-primary').innerHTML = '';
            }
          `.replace(/\s+/g, " "),
          },
        ],
      });
    }
  },
});
