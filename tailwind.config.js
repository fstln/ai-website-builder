const withOpacityValue = (variable) => {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}) / 1)`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
};

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
        // 语义化颜色，映射到 CSS 变量，可响应透明度
        primary: withOpacityValue('--color-primary-rgb'),
        'primary-foreground': withOpacityValue('--color-primary-foreground-rgb'),
        'primary-soft': withOpacityValue('--color-primary-soft-rgb'),
        accent: withOpacityValue('--color-accent-rgb'),
        background: withOpacityValue('--color-background-rgb'),
        surface: withOpacityValue('--color-surface-rgb'),
        'surface-muted': withOpacityValue('--color-surface-muted-rgb'),
        text: withOpacityValue('--color-text-rgb'),
        'text-secondary': withOpacityValue('--color-text-secondary-rgb'),
        foreground: withOpacityValue('--color-foreground-rgb'),
        muted: withOpacityValue('--color-muted-rgb'),
        border: withOpacityValue('--color-border-rgb'),
        inverse: withOpacityValue('--color-inverse-background-rgb'),
        'inverse-foreground': withOpacityValue('--color-inverse-foreground-rgb'),
        'inverse-surface': withOpacityValue('--color-inverse-surface-rgb'),
        decorative: withOpacityValue('--color-decorative-rgb'),
        error: withOpacityValue('--color-error-rgb'),
        success: withOpacityValue('--color-success-rgb'),
        warning: withOpacityValue('--color-warning-rgb'),
        input: withOpacityValue('--color-input-background-rgb'),
        'input-border': withOpacityValue('--color-input-border-rgb'),
        'input-foreground': withOpacityValue('--color-input-foreground-rgb')
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
