import Color4 from "three/examples/jsm/renderers/common/Color4.js";

export default class Day {
    private data: any = {
        additiveColor: new Color4(Color4.NAMES.black),
        ambientColor: new Color4(1, 243/255, 234/255, 200/255),
        sunLightColor: new Color4(1, 243/255, 234/255, 1),
        sunMeshColor: new Color4(1, 233/255, 180/255, 1),
        sunShaftColor: new Color4(1, 243/255, 234/255, 1),
        sunMeshSize: 1.0,
        sunLightIntensity: 0.75,
        shadowStrength: 1.0,
        skyMultiplier: 1.0,
        cloudMultiplier: 1.0,
    };

    /**
     * 白天时颜色的增值
     * @prop
     */
    get additiveColor(): Color4 {
        return this.data.additiveColor;
    }
    set additiveColor(value: Color4) {
        this.data.additiveColor = value;
    }

    /**
     * 白天环境光的颜色
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
     * 太阳发出的光的颜色
     * @prop
     */
    get sunLightColor(): Color4 {
        return this.data.sunLightColor;
    }
    set sunLightColor(value: Color4) {
        this.data.sunLightColor = value;
    }

    /**
     * 太阳材质的颜色
     * @prop
     */
    get sunMeshColor(): Color4 {
        return this.data.sunMeshColor;
    }
    set sunMeshColor(value: Color4) {
        this.data.sunMeshColor = value;
    }

    /**
     * 太阳光线投射的颜色
     * @prop
     */
    get sunShaftColor(): Color4 {
        return this.data.sunShaftColor;
    }
    set sunShaftColor(value: Color4) {
        this.data.sunShaftColor = value;
    }

    /**
     * 太阳材质的大小（度）
     * @prop
     * @default 1.0
     */
    get sunMeshSize(): number {
        return this.data.sunMeshSize;
    }
    set sunMeshSize(value: number) {
        if (value >= 0 && value <= Infinity) {
            this.data.sunMeshSize = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 太阳光源的强度
     * @prop
     * @default 0.75
     */
    get sunLightIntensity(): number {
        return this.data.sunLightIntensity;
    }
    set sunLightIntensity(value: number) {
        if (value >= 0 && value <= Infinity) {
            this.data.sunLightIntensity = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 太阳光源投射的阴影强度
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
     * 白天天空的不透明度乘数
     * @prop
     * @default 1.0
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
     * 白天云层色调乘数
     * @prop
     * @default 1.0
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