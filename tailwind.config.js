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
        secondary: withOpacityValue('--color-secondary-rgb'),
        accent: withOpacityValue('--color-accent-rgb'),
        background: withOpacityValue('--color-background-rgb'),
        text: withOpacityValue('--color-text-rgb'),
        'text-secondary': withOpacityValue('--color-text-secondary-rgb'),
        border: withOpacityValue('--color-border-rgb'),
        error: withOpacityValue('--color-error-rgb'),
        success: withOpacityValue('--color-success-rgb'),
        warning: withOpacityValue('--color-warning-rgb')
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
