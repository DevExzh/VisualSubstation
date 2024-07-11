import {Vector2} from "three";

export default class Cloud {
    private data: any = {
        density: 3.0,
        sharpness: 3.0,
        brightness: 1.0,
        shadowStrength: 0.0,
        scale1: new Vector2(3, 3),
        scale2: new Vector2(7, 7),
    };

    /**
     * 云层的密度乘数
     * @description = 0 无云；> 0 更厚的云层，透明度更低
     * @prop
     * @default 3.0
     */
    get density(): number {
        return this.data.density;
    }
    set density(value: number) {
        if (value >= 0 && value <= Infinity) {
            this.data.density = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 云层的清晰度乘数
     * @description = 0 一个巨大的云；> 0 多个较小的云
     * @prop
     * @default 3.0
     */
    get sharpness(): number {
        return this.data.sharpness;
    }
    set sharpness(value: number) {
        if (value >= 0 && value <= Infinity) {
            this.data.sharpness = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 云层的亮度乘数
     * @description = 0 黑云；> 0 更亮的云
     * @prop
     * @default 1.0
     */
    get brightness(): number {
        return this.data.brightness;
    }
    set brightness(value: number) {
        if (value >= 0 && value <= Infinity) {
            this.data.brightness = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 云层阴影的不透明度
     * @prop
     * @default 0.0
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
     * 第一层云的比例
     * @prop
     */
    get scale1(): Vector2 {
        return this.data.scale1;
    }
    set scale1(value: Vector2) {
        if (value.x >= 1 && value.y >= 1) {
            this.data.scale1 = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 第二层云的比例
     * @prop
     */
    get scale2(): Vector2 {
        return this.data.scale2;
    }
    set scale2(value: Vector2) {
        if (value.x >= 1 && value.y >= 1) {
            this.data.scale2 = value;
        } else {
            throw new Error('Invalid value range');
        }
    }
}