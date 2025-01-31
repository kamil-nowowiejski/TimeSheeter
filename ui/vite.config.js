/** @type {import('vite').UserConfig} */
export default {
    appType: 'custom',
    root: "./src",
    server: {
        host: "localhost",
        port: 5174,
        strictPort: true,
        https: false
    },
    build: {
        outDir: '../../Server/wwwroot',
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: "./src/WeeklyTimeSheet.js"
        }
    }
}
