import {ModelRenderer} from "./ModelRenderer.ts";
import {CanvasScene} from "../CanvasScene.ts";
import {
    CameraChangeEvent,
    LoadEvent, ObjectSelectionEvent,
    SceneObjectChangeEvent
} from "../../events/SceneEvents.ts";
import {CanvasRenderer} from "../CanvasRenderer.ts";
import {EventObject} from "../../events/AnyEvent.ts";

/**
 * 模型渲染场景
 * @class
 */
export class ModelScene extends CanvasScene {
    protected override initWorker(): Worker {
        // 移动到 Web Worker 中进行渲染
        return new Worker(
            new URL('./ModelRenderWorker.ts', import.meta.url),
            {type: 'module'}
        );
    }

    protected override async eventHandler(event: EventObject): Promise<boolean> {
        const handled = await super.eventHandler(event);
        if(!handled) {
            switch (event.type) {
                case 'scene-object-change': {
                    const converted = event as SceneObjectChangeEvent;
                    this.dispatchEvent(new SceneObjectChangeEvent(converted.eventType, ...converted.objects));
                    break;
                }
                // 相机位置/视角发生变化，对于协调多个组件共同渲染非常重要
                case 'camera-change': {
                    const converted = event as CameraChangeEvent;
                    this.dispatchEvent(new CameraChangeEvent(converted.camera));
                    break;
                }
                case 'load': {
                    const converted = event as LoadEvent;
                    this.dispatchEvent(new LoadEvent(converted.state));
                    break;
                }
                case 'object-selection': {
                    const converted = event as ObjectSelectionEvent;
                    this.dispatchEvent(
                        new ObjectSelectionEvent(converted.selected, converted.camera, ...converted.objects)
                    );
                    break;
                }
                default: break;
            }
        }
        return true;
    }

    protected override initRenderer(): CanvasRenderer {
        // 在主线程中渲染
        return new ModelRenderer(
            this._canvas,
            document.body,
            true
        );
    }

    /**
     * 加载并渲染模型
     * @async
     * @function
     */
    public async loadModels(manifestPath: string): Promise<void> {
        try {
            await this.call('loadModels', true, false, manifestPath);
        } catch (error) {
            console.error(error);
        }
    }
}