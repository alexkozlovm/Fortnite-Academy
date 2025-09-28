import { defineConfig } from 'vite';
import customMarkdownPlugin from './vite-plugin-custom-markdown.js';

export default defineConfig({
  plugins: [
    customMarkdownPlugin()
  ],
});

