import {CanvasScene} from "./CanvasScene.ts";

/**
 * 协调多个离屏 `<canvas>` 的相机工作的中介类
 * @description 必须指定一个渲染器为主渲染器，其余添加的渲染器皆为从渲染器。当主渲染器的相机发生变化时，所有从渲染器的相机都会同步更新。
 * @author Ryker Zhu <ryker.zhu@nuist.edu.cn>
 * @since 27 June, 2024
 */
export class CameraMediator extends EventTarget implements Disposable {
    protected _main: CanvasScene;
    protected _scenes: CanvasScene[];

    constructor(main: CanvasScene, ...scenes: CanvasScene[]) {
        super();
        this._main = main;
        this._scenes = scenes;
    }

    [Symbol.dispose](): any {
    }
}