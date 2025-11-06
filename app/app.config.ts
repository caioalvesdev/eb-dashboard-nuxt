import { Colors } from "chart.js";

export default defineAppConfig({
  theme: {
    radius: 0.25,
    blackAsPrimary: false,
  },
  ui: {
    colors: {
      primary: "sky",
      neutral: "slate",
    },
    // container: {
    //   base: "flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-6xl mx-auto",
    // },
  },
});
