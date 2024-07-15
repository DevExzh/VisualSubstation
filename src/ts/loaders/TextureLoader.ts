import {CanvasTexture, ImageBitmapLoader, Texture, Cache} from "three";

// 启用缓存
Cache.enabled = true;

/**
 * 材质加载器
 * @description 建议使用该类替换 THREE.TextureLoader，因为 Three.js 自带的 TextureLoader 内部使用了 ImageLoader 这个依赖
 * DOM 操作的类
 */
export class TextureLoader {
    private bitmapLoader: ImageBitmapLoader = new ImageBitmapLoader();

    constructor() {
        this.bitmapLoader.setOptions( { imageOrientation: 'flipY', resizeQuality: 'high' } );
    }

    async loadAsync(url: string): Promise<Texture> {
        return new Promise<Texture>((resolve, reject) => {
            this.bitmapLoader.load(url, (data: ImageBitmap) => {
                resolve(new CanvasTexture(data));
            }, undefined, () => {
                reject();
            });
        });
    }
}