import {FileLoader, ShaderMaterial} from "three";

export class ShaderLoader {
    private fileLoader: FileLoader = new FileLoader;

    /**
     * 加载着色语言文件
     * @description 注意，该加载器仅支持加载以 .vert 和 .frag 为扩展名的 GLSL 着色器
     * @param urlPrefix URL 前缀，比如说要加载 `/shader.vert` 和 `/shader.frag` 两个文件，只需要传入 `/shader` 就可以了。
     * 加载器会尝试加载这两个文件，如果失败并不会报错，但是会使对应的顶点或者片段着色器缺失。
     */
    async load(urlPrefix: string) {
        const [fragShader, vertShader] = await Promise.all([
            this.fileLoader.loadAsync(urlPrefix + '.frag'),
            this.fileLoader.loadAsync(urlPrefix + '.vert')
        ]);
        const shader = new ShaderMaterial;
        shader.fragmentShader = fragShader as string;
        shader.vertexShader = vertShader as string;
    }
}