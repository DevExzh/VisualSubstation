import {Light, Vector3} from "three";
export default class LightSource {
    private data: any = {
        minimumHeight: 0.0,
        falloff: 0.7,
        coloring: 0.7,
        skyColoring: 0.5,
        cloudColoring: 0.9,
        shaftColoring: 0.9,
        ambientColoring: 0.5,
    };

    public light: Light;

    constructor(light: Light) {
        this.light = light;
    }

    /**
     * 控制光源最低高度
     * @description = -1 光源可以无限制地低；= 0 光源不会低于地平线；= +1 光源不会离开天顶
     * @prop
     * @default 0.0
     */
    get minimumHeight(): number {
        return this.data.minimumHeight;
    }
    set minimumHeight(value: number) {
        if (value >= -1 && value <= 1) {
            this.data.minimumHeight = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 控制太阳颜色的衰减速度
     * @description 尤其在日出和日落时可见
     * @prop
     * @default 0.7
     */
    get falloff(): number {
        return this.data.falloff;
    }
    set falloff(value: number) {
        if (value >= 0 && value <= 1) {
            this.data.falloff = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 控制光颜色受日出和日落影响的强度
     * @prop
     * @default 0.7
     */
    get coloring(): number {
        return this.data.coloring;
    }
    set coloring(value: number) {
        if (value >= 0 && value <= 1) {
            this.data.coloring = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 控制太阳颜色影响大气颜色的强度
     * @description 尤其在日出和日落时可见
     * @prop
     * @default 0.5
     */
    get skyColoring(): number {
        return this.data.skyColoring;
    }
    set skyColoring(value: number) {
        if (value >= 0 && value <= 1) {
            this.data.skyColoring = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 控制太阳颜色影响云颜色的强度
     * @description 尤其在日出和日落时可见
     * @prop
     * @default 0.9
     */
    get cloudColoring(): number {
        return this.data.cloudColoring;
    }
    set cloudColoring(value: number) {
        if (value >= 0 && value <= 1) {
            this.data.cloudColoring = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 控制太阳光轴颜色受日出和日落影响的强度
     * @prop
     * @default 0.9
     */
    get shaftColoring(): number {
        return this.data.shaftColoring;
    }
    set shaftColoring(value: number) {
        if (value >= 0 && value <= 1) {
            this.data.shaftColoring = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 控制环境颜色受日出和日落影响的强度
     * @prop
     * @default 0.5
     */
    get ambientColoring(): number {
        return this.data.ambientColoring;
    }
    set ambientColoring(value: number) {
        if (value >= 0 && value <= 1) {
            this.data.ambientColoring = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    get intensity(): number {
        return this.light.intensity;
    }
    set intensity(value: number) {
        this.light.intensity = value;
    }

    get position(): Vector3 {
        return this.light.position;
    }
    set position(value: Vector3) {
        this.light.position.set(value.x, value.y, value.z);
    }
}