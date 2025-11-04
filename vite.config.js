import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'assets',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        theme: resolve(__dirname, 'src/css/tailwind.css'),
        main: resolve(__dirname, 'src/js/main.js')
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  }
});

