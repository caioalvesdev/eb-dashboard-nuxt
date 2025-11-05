// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    name: 'app/custom-rules',
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
   "vue/no-multiple-template-root": ["error", {
    "disallowComments": false
  }]
)
