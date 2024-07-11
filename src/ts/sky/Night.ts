import Color4 from "three/examples/jsm/renderers/common/Color4.js";

export default class Night {
    private data: any = {
        additiveColor: new Color4(Color4.NAMES.black),
        ambientColor: new Color4(181/255, 204/255, 1, 50/255),
        moonLightColor: new Color4(181/255, 204/255, 1, 1),
        moonMeshColor: new Color4(1, 1, 1, 1),
        moonHaloColor: new Color4(81/255, 104/255, 155/255, 1),
        moonMeshSize: 1.0,
        moonLightIntensity: 0.1,
        shadowStrength: 1.0,
        skyMultiplier: 0.1,
        cloudMultiplier: 0.2,
    };

    /**
     * 夜间添加颜色的艺术值
     * @prop
     */
    get additiveColor(): Color4 {
        return this.data.additiveColor;
    }
    set additiveColor(value: Color4) {
        this.data.additiveColor = value;
    }

    /**
     * 夜间环境光的颜色
     * @description 必须设置 TOD_WorldParameters.SetAmbientLight 这个属性才会生效
     * @prop
     */
    get ambientColor(): Color4 {
        return this.data.ambientColor;
    }
    set ambientColor(value: Color4) {
        this.data.ambientColor = value;
    }

    /**
     * 月亮发出的光的颜色
     * @prop
     */
    get moonLightColor(): Color4 {
        return this.data.moonLightColor;
    }
    set moonLightColor(value: Color4) {
        this.data.moonLightColor = value;
    }

    /**
     * 月亮材质的颜色
     * @prop
     */
    get moonMeshColor(): Color4 {
        return this.data.moonMeshColor;
    }
    set moonMeshColor(value: Color4) {
        this.data.moonMeshColor = value;
    }

    /**
     * 月亮光晕的颜色
     * @prop
     */
    get moonHaloColor(): Color4 {
        return this.data.moonHaloColor;
    }
    set moonHaloColor(value: Color4) {
        this.data.moonHaloColor = value;
    }

    /**
     * 月亮材质的大小（度）
     * @prop
     * @default 1.0
     */
    get moonMeshSize(): number {
        return this.data.moonMeshSize;
    }
    set moonMeshSize(value: number) {
        if (value >= 0 && value <= Infinity) {
            this.data.moonMeshSize = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 月亮光源的强度
     * @prop
     * @default 0.1
     */
    get moonLightIntensity(): number {
        return this.data.moonLightIntensity;
    }
    set moonLightIntensity(value: number) {
        if (value >= 0 && value <= Infinity) {
            this.data.moonLightIntensity = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 月亮光源投射的阴影强度
     * @prop
     * @default 1.0
     */
    get shadowStrength(): number {
        return this.data.shadowStrength;
    }
    set shadowStrength(value: number) {
        if (value >= 0 && value <= 1) {
            this.data.shadowStrength = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 夜间天空的不透明度乘数
     * @prop
     * @default 0.1
     */
    get skyMultiplier(): number {
        return this.data.skyMultiplier;
    }
    set skyMultiplier(value: number) {
        if (value >= 0 && value <= 1) {
            this.data.skyMultiplier = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 夜间云层色调乘数
     * @prop
     * @default 0.2
     */
    get cloudMultiplier(): number {
        return this.data.cloudMultiplier;
    }
    set cloudMultiplier(value: number) {
        if (value >= 0 && value <= 1) {
            this.data.cloudMultiplier = value;
        } else {
            throw new Error('Invalid value range');
        }
    }
}