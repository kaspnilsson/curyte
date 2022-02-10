import create from '@kodingdotninja/use-tailwind-breakpoint'
import resolveConfig from 'tailwindcss/resolveConfig'
import { TailwindConfig } from 'tailwindcss/tailwind-config'

import tailwindConfig from '../tailwind.config.js'

const config = resolveConfig(tailwindConfig as TailwindConfig)

export const { useBreakpoint } = create(
  config.theme.screens as Record<string, string>
)
