import * as THREE from "three";
import {pathOf, FilePath} from "../common/PathHelper.ts";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader.js";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader.js";
import {ThreeContext, LoadedModel} from "../common/Types.ts";

export interface ModelManifest {
    type: string,
    prefix: string,
    models: string[],
    exclusions: string[],
    positions: Record<string, [number, number, number]>,
}

export interface LoadedObject extends THREE.Object3D {
    userData: {
        isLoadedModel: boolean;
        originalName: string;
        initialPosition: [number, number, number];
    }
}

export class ModelObjectLoadEvent extends Event {
    public readonly object: LoadedObject
    public readonly name: string;

    constructor(object: LoadedObject, name: string) {
        super('model-object-loaded');
        this.object = object;
        this.name = name;
    }
}

/**
 * 3D 模型加载器
 * @class
 * @author Ryker Zhu <ryker.zhu@nuist.edu.cn>
 */
export class ModelLoader extends EventTarget implements Disposable {
    private modelPromises: Promise<void>[] = [];
    private readonly castShadow: boolean = true;
    private readonly receiveShadow: boolean = true;
    private dracoLoader: DRACOLoader | null = null;
    private context: ThreeContext;
    public exclusions: string[] = [];
    public initialPositions: ModelManifest['positions'] = {};
    public readonly models: THREE.Object3D[] = [];

    /**
     * 模型加载器构造函数
     * @constructor
     * @param context 渲染上下文，包括 WebGL 渲染器、相机、场景
     * @param castShadow 是否投影
     * @param receiveShadow 接收投影
     */
    constructor(context: ThreeContext, castShadow: boolean = true, receiveShadow: boolean = true) {
        super();
        this.context = context;
        this.castShadow = castShadow;
        this.receiveShadow = receiveShadow;
    }

    /**
     * 根据文件拓展名返回对应的 Three.js 模型加载器
     * @function
     * @param extension 文件扩展名，包括开头的点（如 .fbx, .gltf）
     */
    loaderFromExtension(extension: string): THREE.Loader {
        switch (extension) {
            default:
            case '.glb':
            case '.gltf': {
                const loader = new GLTFLoader();
                if(!this.dracoLoader) {
                    const dracoLoader = new DRACOLoader();
                    dracoLoader.setDecoderPath('/decoder/');
                    dracoLoader.setDecoderConfig({type: 'wasm'});
                    dracoLoader.preload();
                    this.dracoLoader = dracoLoader;
                }
                return loader;
            }
            case '.fbx': return new FBXLoader();
            case '.obj': return new OBJLoader();
        }
    }

    /**
     * 加载在清单上的所有模型
     * @function
     */
    async loadAll(manifestPath: string): Promise<void> {
        if(this.modelPromises.length === 0) {
            const response: Response = await fetch(manifestPath);
            const modelConfig: ModelManifest = await response.json();
            this.exclusions = modelConfig.exclusions;
            this.initialPositions = modelConfig.positions;
            for(let i = 0; i < modelConfig.models.length; ++i) {
                const modelPath = (modelConfig.prefix ?? '/') + modelConfig.models[i];
                this.modelPromises.push(this.loadSingle3DModel(modelPath, true));
            }
        }
        // 并发加载并编译着色器
        await Promise.all(this.modelPromises);
        this.dispatchEvent(new Event('complete'));
    }

    /**
     * 加载单个 3D 模型
     * @async
     * @function
     * @param modelPath 模型路径，字符串的第一个路径分隔符表示 /public/
     * @param draco 是否启用 Draco 网格压缩（仅 GLTF 模型）
     */
    async loadSingle3DModel(modelPath: string, draco: boolean = false): Promise<void> {
        const path: FilePath | null = pathOf(modelPath);
        if(!path) return;
        let loader: THREE.Loader = this.loaderFromExtension(path.extension);
        loader.setPath(path.folder);
        if(draco
            && loader instanceof GLTFLoader
            && this.dracoLoader instanceof DRACOLoader
        ) {
            loader.setDRACOLoader(this.dracoLoader);
        }
        try {
            const model = await loader.loadAsync(path.fullFileName);
            if((model as LoadedModel)?.scene !== undefined && typeof (model as LoadedModel)?.scene === "object") {
                const obj = (model as LoadedModel).scene;
                obj.userData['isLoadedModel'] = true;
                obj.userData['originalName'] = path.nameWithoutExt;
                obj.userData['initialPosition'] = this.initialPositions?.[path.fullFileName] ?? [];
                if(!!obj.traverse) {
                    obj.traverse((o) => {
                        if(o.type === 'Mesh') {
                            o.receiveShadow = this.receiveShadow;
                            o.castShadow = this.castShadow;
                        }
                    });
                } else {
                    obj.receiveShadow = this.receiveShadow;
                    obj.castShadow = this.castShadow;
                }
                this.models.push(obj);
                this.context.scene.add(obj);
                this.dispatchEvent(new ModelObjectLoadEvent(obj as unknown as LoadedObject, path.nameWithoutExt));
            }
        } catch (e) {
            console.error(`Error occurred on model: ${path.fullFileName}`);
            console.error(e);
        }
    }

    [Symbol.dispose] () {
        this.dracoLoader?.dispose();
        this.dracoLoader = null;
    }
}