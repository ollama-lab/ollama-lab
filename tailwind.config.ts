import { join } from 'path'
import type { Config } from 'tailwindcss'
import { skeleton } from '@skeletonlabs/tw-plugin'

const config: Config = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    join(
      require.resolve('@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}',
		),
  ],
  plugins: [
    skeleton({
      themes: { preset: [ "gold-nouveau" ] }
    }),
  ],
  darkMode: "media",
  theme: {
    extend: {},
  },
}

export default config
