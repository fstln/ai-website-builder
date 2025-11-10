/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './templates/**/*.liquid',
    './src/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        // 语义化颜色，映射到 CSS 变量
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        border: 'var(--color-border)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)'
      },
      fontFamily: {
        // 字体家族
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
      }
      // 使用 Tailwind 原生 fontSize, fontWeight, lineHeight 等
      // 通过 visual_spec.md 规范使用规则，无需自定义类
    }
  },
  plugins: []
};

