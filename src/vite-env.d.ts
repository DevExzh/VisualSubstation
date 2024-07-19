/// <reference types="vite-plugin-glsl/ext" />
/// <reference types="vite/client" />
declare module '*.vue' {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}