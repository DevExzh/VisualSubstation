import {defineConfig, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import string from 'vite-plugin-string';
import glsl from 'vite-plugin-glsl';

export default defineConfig(({mode, command}) => {
    const env = loadEnv(mode, process.cwd());
    const { API_BASE } = env;
    return {
        build: {
            minify: 'terser',
            terserOptions: {
                keep_classnames: false,
                toplevel: true,
                mangle: true,
                compress: {
                    drop_console: true,
                    keep_fargs: false
                },
            },
        },
        plugins: [
            vue(),
            glsl(),
            string({
              include: [
                  '**/*.vert',
                  '**/*.frag'
              ]
            })
        ],
    };
})
