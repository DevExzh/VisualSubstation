import {lerp} from "../common/Helper.ts";
import {SkyRenderer} from "../renderers/sky/SkyRenderer.ts";
import {RenderObject} from "../common/RenderObject.ts";

export enum CloudType {
    Custom,
    None,
    Few,
    Scattered,
    Broken,
    Overcast
}

export enum WeatherType {
    Custom,
    Clear,
    Storm,
    Dust,
    Fog
}

export class Weather extends RenderObject {
    fadeTime: number = 10;
    cloudType: CloudType = CloudType.Custom;
    weatherType: WeatherType = WeatherType.Custom;

    private readonly cloudBrightnessDefault: number;
    private readonly cloudDensityDefault: number;
    private readonly atmosphereFogDefault: number;

    private cloudBrightness: number;
    private cloudDensity: number;
    private atmosphereFog: number;
    private cloudSharpness: number;

    private sky: SkyRenderer;

    constructor(sky: SkyRenderer) {
        super();
        this.sky = sky;
        this.cloudBrightness = this.cloudBrightnessDefault = sky.clouds.brightness;
        this.cloudDensity = this.cloudDensityDefault = sky.clouds.density;
        this.atmosphereFog = this.atmosphereFogDefault = sky.atmosphere.fogginess;
        this.cloudSharpness = sky.clouds.sharpness;
    }

    update() {
        if (this.cloudType === CloudType.Custom && this.weatherType === WeatherType.Custom) return;

        switch (this.cloudType) {
            case CloudType.Custom:
                this.cloudDensity = this.sky.clouds.density;
                this.cloudSharpness = this.sky.clouds.sharpness;
                break;

            case CloudType.None:
                this.cloudDensity = 0.0;
                this.cloudSharpness = 1.0;
                break;

            case CloudType.Few:
                this.cloudDensity = this.cloudDensityDefault;
                this.cloudSharpness = 6.0;
                break;

            case CloudType.Scattered:
                this.cloudDensity = this.cloudDensityDefault;
                this.cloudSharpness = 3.0;
                break;

            case CloudType.Broken:
                this.cloudDensity = this.cloudDensityDefault;
                this.cloudSharpness = 1.0;
                break;

            case CloudType.Overcast:
                this.cloudDensity = this.cloudDensityDefault;
                this.cloudSharpness = 0.1;
                break;
        }

        switch (this.weatherType) {
            case WeatherType.Custom:
                this.cloudBrightness = this.sky.clouds.brightness;
                this.atmosphereFog = this.sky.atmosphere.fogginess;
                break;

            case WeatherType.Clear:
                this.cloudBrightness = this.cloudBrightnessDefault;
                this.atmosphereFog = this.atmosphereFogDefault;
                break;

            case WeatherType.Storm:
                this.cloudBrightness = 0.3;
                this.atmosphereFog = 1.0;
                break;

            case WeatherType.Dust:
                this.cloudBrightness = this.cloudBrightnessDefault;
                this.atmosphereFog = 0.5;
                break;

            case WeatherType.Fog:
                this.cloudBrightness = this.cloudBrightnessDefault;
                this.atmosphereFog = 1.0;
                break;
        }

        let t = this.sky.time.deltaTime / this.fadeTime;

        this.sky.clouds.brightness = lerp(this.sky.clouds.brightness, this.cloudBrightness, t);
        this.sky.clouds.density = lerp(this.sky.clouds.density, this.cloudDensity, t);
        this.sky.clouds.sharpness = lerp(this.sky.clouds.sharpness, this.cloudSharpness, t);
        this.sky.atmosphere.fogginess = lerp(this.sky.atmosphere.fogginess, this.atmosphereFog, t);
    }
}