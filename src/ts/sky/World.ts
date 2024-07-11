export default class World {
    private data: any = {
        setAmbientLight: false,
        setFogColor: false,
        fogColorBias: 0.0,
        viewerHeight: 0.0,
        horizonOffset: 0.0,
    };

    /**
     * 自动调整渲染设置中的环境光颜色
     * @prop
     * @default false
     */
    get setAmbientLight(): boolean {
        return this.data.setAmbientLight;
    }
    set setAmbientLight(value: boolean) {
        this.data.setAmbientLight = value;
    }

    /**
     * 自动调整渲染设置中的雾颜色
     * @prop
     * @default false
     */
    get setFogColor(): boolean {
        return this.data.setFogColor;
    }
    set setFogColor(value: boolean) {
        this.data.setFogColor = value;
    }

    /**
     * 雾颜色采样高度
     * @description 必须设置 setFogColor 才会生效。= 0 雾是地平线处的大气颜色；= 1 雾是天顶处的大气颜色
     * @prop
     * @default 0.0
     */
    get fogColorBias(): number {
        return this.data.fogColorBias;
    }
    set fogColorBias(value: number) {
        if (value >= 0 && value <= 1) {
            this.data.fogColorBias = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 观众在大气层中的相对高度。
     * @description = 0 在地面上；= 1 在大气层的边界
     * @prop
     * @default 0.0
     */
    get viewerHeight(): number {
        return this.data.viewerHeight;
    }
    set viewerHeight(value: number) {
        if (value >= 0 && value <= 1) {
            this.data.viewerHeight = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 相对地平线偏移
     * @description = 0 地平线在天穹球体的中间；= 1 地平线在天穹球体的底部
     * @prop
     * @default 0.0
     */
    get horizonOffset(): number {
        return this.data.horizonOffset;
    }
    set horizonOffset(value: number) {
        if (value >= 0 && value <= 1) {
            this.data.horizonOffset = value;
        } else {
            throw new Error('Invalid value range');
        }
    }
}