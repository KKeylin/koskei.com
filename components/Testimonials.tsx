'use client'

import { TestimonialsWidget, parseConfig } from 'config-driven-testimonials'
import configJson from '@/testimonials.config.json'

const raw = parseConfig(configJson)
const config = {
  ...raw,
  theme: {
    ...raw.theme,
    colorScheme: 'dark' as const,
    accentColor: '#63b3ed',
    showHeader: false,
  },
}

export default function Testimonials() {
  return <TestimonialsWidget config={config} />
}