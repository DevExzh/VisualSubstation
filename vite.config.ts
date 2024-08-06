import {defineConfig, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import string from 'vite-plugin-string';
import glsl from 'vite-plugin-glsl';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

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
                format: {
                    comments: false,
                },
            },
            rollupOptions: {
                output: {
                    compact: true,
                    generatedCode: {
                        arrowFunctions: true,
                        constBindings: true,
                    },
                    manualChunks: {
                        loaders: [
                            "three/examples/jsm/loaders/DRACOLoader.js",
                            "three/examples/jsm/loaders/GLTFLoader.js",
                            "three/examples/jsm/loaders/FBXLoader.js",
                            "three/examples/jsm/loaders/OBJLoader.js",
                        ],
                        postprocessing: [
                            "three/examples/jsm/postprocessing/OutlinePass.js",
                            "three/examples/jsm/postprocessing/RenderPass.js",
                            "three/examples/jsm/postprocessing/OutputPass.js",
                            "three/examples/jsm/postprocessing/EffectComposer.js",
                        ],
                        three: ['three'],
                        worker_basic: [
                            "src/ts/renderers/CanvasRenderer.ts",
                            "src/ts/renderers/CanvasScene.ts",
                            "src/ts/renderers/CanvasWorker.ts",
                            "src/ts/virtual-element/ControlsProxy.ts",
                            "src/ts/virtual-element/ProxyMessages.ts",
                            "src/ts/virtual-element/VirtualElement.ts",
                            "src/ts/virtual-element/WorkerProxy.ts",
                        ],
                        charts: ['vue-echarts', 'echarts/charts'],
                        echarts: ['echarts'],
                        runtime: ['vue', 'vue-router', 'pinia', '@tweenjs/tween.js'],
                        element_plus: ['element-plus'],
                        icons: ['@element-plus/icons-vue'],
                    },
                    experimentalMinChunkSize: 1<<19
                },
            }
        },
        plugins: [
            vue(),
            glsl(),
            string({
              include: [
                  '**/*.vert',
                  '**/*.frag'
              ]
            }),
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ],
    };
})
