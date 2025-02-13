import { defineConfig } from 'vite'
import deno from '@deno/vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [deno(), react()],
    appType: 'custom',
    server: {
        host: "localhost",
        port: 5174,
        strictPort: true,
    },
    build: {
        outDir: '../../Server/wwwroot',
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: "./src/main.tsx"
        }
    }
})
