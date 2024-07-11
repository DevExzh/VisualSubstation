import {Color} from "three";

export class Atmosphere {
    private data: any = {
        rayleighMultiplier: 1.0,
        mieMultiplier: 1.0,
        brightness: 1.0,
        contrast: 1.0,
        directionality: 0.5,
        haziness: 0.5,
        fogginess: 0,
    };

    /**
     * 大气散射色
     * @prop
     * @default 白色
     */
    public scatteringColor: Color = new Color(Color.NAMES.white);

    /**
     * 大气 Rayleigh 散射的强度值
     * @description（简而言之，表示静态散射的强度）散射波长与入射波长相同；散射光强与波长的四次方成反比；散射光强按空间方向成哑铃形角分布。
     * @see https://zhuanlan.zhihu.com/p/560705804
     * @prop
     * @default 1.0
     */
    get rayleighMultiplier(): number {
        return this.data.rayleighMultiplier;
    }
    set rayleighMultiplier(value: number) {
        if(value >= 0 && value <= Infinity) {
            this.data.rayleighMultiplier = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 大气 Mie 散射的强度值
     * @description （简而言之，表示角散射的强度）散射后看不出具体颜色，仅仅是黑白灰（反映光强大小）。
     * 是大气中粒子的直径与辐射的波长相当时发生的散射。
     * 这种散射主要由大气中的微粒，如烟、尘埃、小水滴及气溶胶等引起。
     * 米氏散射的散射强度与频率的二次方成正比，并且散射在光线向前方向比向后方向更强，方向性比较明显。
     * @see https://zhuanlan.zhihu.com/p/560705804
     * @prop
     * @default 1.0
     */
    get mieMultiplier(): number {
        return this.data.mieMultiplier;
    }
    set mieMultiplier(value: number) {
        if(value >= 0 && value <= Infinity) {
            this.data.rayleighMultiplier = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 大气亮度
     * @description 渲染输出的颜色值都会被乘以这个因子，如果要保持默认亮度，请设为 1
     * @prop
     * @default 1.0
     */
    get brightness(): number {
        return this.data.brightness;
    }
    set brightness(value: number) {
        if(value >= 0 && value <= Infinity) {
            this.data.brightness = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 大气对比度
     * @description 作为渲染输出颜色值的幂，如果要保持默认对比度，请设为 1
     * @prop
     * @default 1.0
     */
    get contrast(): number {
        return this.data.contrast;
    }
    set contrast(value: number) {
        if(value >= 0 && value <= Infinity) {
            this.data.contrast = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 方向因子
     * @description 决定光源周围光晕的大小和清晰度
     * @prop
     * @default 0.5
     */
    get directionality(): number {
        return this.data.directionality;
    }
    set directionality(value: number) {
        if(value >= 0 && value <= 1) {
            this.data.directionality = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 地平线处雾强度
     * @prop
     * @default 0.5
     */
    get haziness(): number {
        return this.data.haziness;
    }
    set haziness(value: number) {
        if(value >= 0 && value <= 1) {
            this.data.haziness = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 雾浓度
     * @prop
     * @default 0
     */
    get fogginess(): number {
        return this.data.fogginess;
    }
    set fogginess(value: number) {
        if(value >= 0 && value <= 1) {
            this.data.fogginess = value;
        } else {
            throw new Error('Invalid value range');
        }
    }
}