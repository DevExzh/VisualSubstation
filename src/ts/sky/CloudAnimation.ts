import {Object3D, Vector3, Vector4} from "three";
import {RenderObject} from "../common/RenderObject.ts";
import {Deg2Rad, deltaTime} from "../common/Helper.ts";
import {SkyRenderer} from "../renderers/sky/SkyRenderer.ts";

export default class CloudAnimation extends RenderObject {
    /**
     * 风向
     * @description = 0 正北；= 90 正东；= 180 正南；= 270 正西
     * @default 0
     * @prop
     */
    public windDegree: number = 0;

    /**
     * 作用于场景中云的风的大小
     * @default 3
     * @prop
     */
    public windSpeed: number = 3;

    /**
     * 当前云的 UV 坐标
     * @prop
     */
    public cloudUV: Vector4 = new Vector4();

    private sky: SkyRenderer;
    private dome: Object3D;

    constructor(sky: SkyRenderer, dome: Object3D) {
        super();
        this.sky = sky;
        this.dome = dome;
    }

    public get offsetUV(): Vector4 {
        const pos: Vector3 = this.dome.position;
        const scale: Vector3 = this.dome.scale;
        const offset: Vector3 = this.dome.localToWorld(new Vector3(
            pos.x / scale.x,
            0,
            pos.y / scale.y
        ));
        return new Vector4(
            - offset.x,
            - offset.z,
            - offset.x,
            - offset.z
        );
    }

    update(): void {
        this.cloudUV.add(
            new Vector4(
                Math.cos(Deg2Rad * (this.windDegree + 15)),
                Math.sin(Deg2Rad * (this.windDegree + 15)),
                Math.cos(Deg2Rad * (this.windDegree - 15)),
                Math.sin(Deg2Rad * (this.windDegree - 15))
            ).multiplyScalar(this.windSpeed / 100)
        ).multiplyScalar(
            deltaTime()
        ); // 模拟被风吹的效果
        this.cloudUV.set(
            this.cloudUV.x % this.sky.clouds.scale1.x,
            this.cloudUV.y % this.sky.clouds.scale1.y,
            this.cloudUV.x % this.sky.clouds.scale2.x,
            this.cloudUV.y % this.sky.clouds.scale2.y
        );
    }
}