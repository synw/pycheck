const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
    './node_modules/@snowind/**/*.{vue,js,ts}',
  ],
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/forms'),
    require('@snowind/plugin'),
    require('tailwindcss-semantic-colors')
  ],
  theme: {
    extend: {
      colors: {
        c50: colors.red[500],
        c69: colors.amber[500],
        c70: colors.emerald[200],
        c90: colors.green[400],
        c100: colors.green[600],
        
      },
      semanticColors: {
        format: {
          light: {
            bg: colors.black,
            txt: colors.white
          },
          dark: {
            bg: colors.black,
            txt: colors.white
          }
        },
        codestyle: {
          light: {
            bg: "#ed4c5c",
            txt: colors.white
          },
          dark: {
            bg: "#ed4c5c",
            txt: colors.white
          }
        },
        typing: {
          light: {
            bg: "#0071bc",
            txt: colors.white
          },
          dark: {
            bg: "#0071bc",
            txt: colors.white
          }
        },
        light: {
          light: {
            bg: colors.gray[500],
            txt: colors.white
          },
          dark: {
            bg: colors.gray[600],
            txt: colors.gray[800]
          }
        },
        lighter: {
          light: {
            bg: colors.slate[200],
            txt: colors.gray[800]
          },
          dark: {
            bg: colors.neutral[700],
            txt: colors.white
          }
        },
        semilight: {
          light: {
            bg: colors.slate[400],
            txt: colors.gray[800]
          },
          dark: {
            bg: colors.neutral[500],
            txt: colors.white
          }
        },
      }
    }
  }
}