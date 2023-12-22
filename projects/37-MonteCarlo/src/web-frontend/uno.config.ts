import { defineConfig, presetIcons, presetUno, presetWind, UserConfig } from 'unocss'

import { presetShadcn } from './preset.shadcn'

const config = {
  presets: [presetUno(), presetWind(), presetIcons(), presetShadcn()],
  shortcuts: [
    {
      'flex-center': 'flex justify-center items-center',
      'flex-col-center': 'flex flex-col justify-center items-center',
    },
  ],
  rules: [],
  preflights: [
    {
      getCSS: () => `
        :root {
          --radius: 0.5rem
        }
      `,
    },
  ],
  theme: {
    borderRadius: {
      lg: `var(--radius)`,
      md: `calc(var(--radius) - 2px)`,
      sm: 'calc(var(--radius) - 4px)',
    },
  },
}

export default defineConfig(config) as UserConfig<(typeof config)['theme']>
