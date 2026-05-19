import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        plugins: [react()],
        resolve: {
            tsconfigPaths: true,
        },
        server: {
            proxy: {
                '/api': {
                    target: env.HAFFA_BACKEND_URL || 'http://localhost:4000',
                    changeOrigin: true,
                },
            },
        },
        build: {
            outDir: 'build',
        },
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['src/setupTests.ts'],
        },
    }
})
