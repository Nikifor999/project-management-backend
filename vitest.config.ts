// vitest.config.ts
import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc'
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        passWithNoTests: true,
        include: ['src/**/*.spec.ts'],
        clearMocks: true,
        restoreMocks: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            reportsDirectory: './coverage',
            exclude: [
                '**/*.module.ts',
                '**/*.entity.ts',
                '**/*.dto.ts',
                '**/main.ts',
            ],
        },
    },
    plugins: [
        swc.vite(),
        tsconfigPaths(),
    ],
})


