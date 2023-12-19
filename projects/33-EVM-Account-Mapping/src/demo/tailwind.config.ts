import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['DejaVu Sans', 'sans-serif'],
      serif: ['DejaVu Serif', 'serif'],
      mono: ['DejaVu Mono', 'monospace'],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
