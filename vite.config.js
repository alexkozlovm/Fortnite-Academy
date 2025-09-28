import { resolve } from 'path';
import { defineConfig } from 'vite';
import customMarkdownPlugin from './vite-plugin-custom-markdown.js';

// This function finds all your HTML and Markdown files
// so we can tell Vite to build each one as a separate page.
const entryPoints = {
  ...Object.fromEntries(
    require('glob').sync('./*.html').map(file => [
      file.slice(0, file.length - '.html'.length),
      resolve(__dirname, file)
    ])
  ),
  ...Object.fromEntries(
    require('glob').sync('./blog/*.md').map(file => [
      `blog/${file.slice('./blog/'.length, file.length - '.md'.length)}`,
      resolve(__dirname, file)
    ])
  )
};

export default defineConfig({
  // This is a crucial fix. It tells Vite to treat your 'assets'
  // folder as a public directory, which means it will be copied
  // directly to the final build output. This will fix your broken images.
  publicDir: 'assets',

  plugins: [
    customMarkdownPlugin(),
  ],

  build: {
    rollupOptions: {
      // This tells Vite to build every page, not just index.html.
      // This will fix the 404 error for your free-coaching page.
      input: entryPoints,
    },
  },
});

