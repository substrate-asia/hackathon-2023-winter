import type { Config } from 'tailwindcss'
import withMT from "@material-tailwind/react/utils/withMT";

const config: Config = withMT({
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "../node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "../node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: '"Noto Sans SC Variable", sans-serif',
        mono: '"Fira Mono", monospace',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
}) as Config

export default config
