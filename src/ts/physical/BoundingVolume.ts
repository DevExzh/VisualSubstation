import {CanvasRenderer} from "../renderers/CanvasRenderer.ts";
/**
 * 包围盒检测
 * @author Ryker Zhu <ryker.zhu@nuist.edu.cn>
 * @since 7 July 2024
 */
export class BoundingVolume extends EventTarget implements Disposable {
    public constructor(renderer: CanvasRenderer) {
        super();
        renderer.addEventListener('load', () => {

        });
    }

    public [Symbol.dispose](): void {
    }
}