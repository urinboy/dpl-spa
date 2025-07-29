// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src', // `src/` papkasini asosiy ildiz sifatida belgilaydi
  build: {
    outDir: '../dist' // Build natijasi `dpl-spa/dist/` ga chiqadi
  }
});