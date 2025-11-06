export default defineNuxtPlugin({
  enforce: "post",
  setup() {
    const appConfig = useAppConfig();

    if (import.meta.client) {
      function updateColor(type: "primary" | "neutral") {
        const preferences = JSON.parse(
          localStorage.getItem("ui-preferences") || "{}"
        );
        const color = preferences?.theme?.[type];
        if (color) {
          appConfig.ui.colors[type] = color;
        }
      }

      function updateRadius() {
        const preferences = JSON.parse(
          localStorage.getItem("ui-preferences") || "{}"
        );
        const radius = preferences.theme.radius;

        if (radius !== undefined && radius !== null) {
          appConfig.theme.radius = Number.parseFloat(radius);
        }
      }

      function updateBlackAsPrimary() {
        const preferences = JSON.parse(
          localStorage.getItem("ui-preferences") || "{}"
        );
        const blackAsPrimary = preferences.theme.blackAsPrimary;
        console.log({ blackAsPrimary });
        if (blackAsPrimary) {
          appConfig.theme.blackAsPrimary = blackAsPrimary;
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
            if (localStorage.getItem('ui-preferences')) {
              document.querySelector('style#nuxt-ui-radius').innerHTML = ':root { --ui-radius: ' + JSON.parse(localStorage.getItem('ui-preferences')).theme.radius + 'rem; }';
            }
          `.replace(/\s+/g, " "),
            type: "text/javascript",
            tagPriority: -1,
          },
          {
            innerHTML: `
            if (localStorage.getItem('ui-preferences') && JSON.parse(localStorage.getItem('ui-preferences')).theme.blackAsPrimary) {
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
