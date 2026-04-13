import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: 'var(--border)',
        ring: 'var(--ring)',
        brand: {
          mustard: 'var(--brand-mustard)',
          'mustard-hover': 'var(--brand-mustard-hover)',
          'mustard-foreground': 'var(--brand-mustard-foreground)',
          sage: 'var(--brand-sage)',
          'sage-hover': 'var(--brand-sage-hover)',
          'sage-foreground': 'var(--brand-sage-foreground)',
          'sage-subtle': 'var(--brand-sage-subtle)',
          'sage-muted': 'var(--brand-sage-muted)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
