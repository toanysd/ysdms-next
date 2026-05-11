import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mcs: {
          bg: 'var(--mcs-bg)',
          surface: {
            DEFAULT: 'var(--mcs-surface)',
            2: 'var(--mcs-surface-2)',
            3: 'var(--mcs-surface-3)',
            hover: 'var(--mcs-surface-hover)',
          },
          border: {
            DEFAULT: 'var(--mcs-border)',
            strong: 'var(--mcs-border-strong)',
          },
          divider: 'var(--mcs-divider)',
          text: {
            DEFAULT: 'var(--mcs-text)',
            secondary: 'var(--mcs-text-secondary)',
            muted: 'var(--mcs-text-muted)',
            inverse: 'var(--mcs-text-inverse)',
          },
          primary: {
            DEFAULT: 'var(--mcs-primary)',
            hover: 'var(--mcs-primary-hover)',
            active: 'var(--mcs-primary-active)',
            light: 'var(--mcs-primary-light)',
            mid: 'var(--mcs-primary-mid)',
          },
          success: {
            DEFAULT: 'var(--mcs-success)',
            hover: 'var(--mcs-success-hover)',
            light: 'var(--mcs-success-light)',
            text: 'var(--mcs-success-text)',
          },
          warning: {
            DEFAULT: 'var(--mcs-warning)',
            hover: 'var(--mcs-warning-hover)',
            light: 'var(--mcs-warning-light)',
            text: 'var(--mcs-warning-text)',
          },
          error: {
            DEFAULT: 'var(--mcs-error)',
            hover: 'var(--mcs-error-hover)',
            light: 'var(--mcs-error-light)',
            text: 'var(--mcs-error-text)',
          },
          info: {
            DEFAULT: 'var(--mcs-info)',
            hover: 'var(--mcs-info-hover)',
            light: 'var(--mcs-info-light)',
            text: 'var(--mcs-info-text)',
          },
          neutral: {
            DEFAULT: 'var(--mcs-neutral)',
            hover: 'var(--mcs-neutral-hover)',
            light: 'var(--mcs-neutral-light)',
            text: 'var(--mcs-neutral-text)',
          },
          returned: 'var(--mcs-returned)'
        }
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '10px',
        '4': '12px',
        '5': '16px',
        '6': '20px',
        '8': '24px',
        '12': '32px'
      },
      fontSize: {
        'xxs': '10px',
        'xs': '12px',
        'sm': '14px',
        'base': '16px'
      },
      fontFamily: {
        jp: 'var(--font-jp)',
        vi: 'var(--font-vi)'
      }
    },
  },
  plugins: [],
}
export default config
