import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
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
