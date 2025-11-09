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
    pageGrid: {
      base: "relative grid grid-cols-12 sm:grid-cols-6 lg:grid-cols-12 gap-8",
    },
    // container: {
    //   base: "flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-6xl mx-auto",
    // },
  },
});
