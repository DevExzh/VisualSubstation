export default class Star {
    private data: any = {
        tiling: 2,
        density: 0.5,
    };

    /**
     * 星空纹理的平铺系数
     * @description 该系数决定了纹理在天空中被平铺的频率，从而决定了星星的大小
     * @prop
     * @default 2
     */
    get tiling(): number {
        return this.data.tiling;
    }
    set tiling(value: number) {
        if(value >= 0 && value <= Infinity) {
            this.data.tiling = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 星空中星星的密度
     * @prop
     * @default 0.5
     */
    get density(): number {
        return this.data.density;
    }
    set density(value: number) {
        if(value >= 0 && value <= 1) {
            this.data.density = value;
        } else {
            throw new Error('Invalid value range');
        }
    }
}