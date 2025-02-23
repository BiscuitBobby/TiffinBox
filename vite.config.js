import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


export default defineConfig({

  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  clearScreen: false,
  server: {
    strictPort: true,
  },
  envPrefix: ['VITE_', 'TAURI_PLATFORM', 'TAURI_ARCH', 'TAURI_FAMILY', 'TAURI_PLATFORM_VERSION', 'TAURI_PLATFORM_TYPE', 'TAURI_DEBUG'],
  // build: {
  //   // Tauri uses Chromium on Windows and WebKit on macOS and Linux
  //   target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
  //   // don't minify for debug builds
  //   minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
  //   // produce sourcemaps for debug builds
  //   sourcemap: !!process.env.TAURI_DEBUG,
  // },

})
