import * as THREE from 'three';
import Color4 from "three/examples/jsm/renderers/common/Color4.js";
import {ConvexGeometry} from "three/examples/jsm/geometries/ConvexGeometry.js";
import {Cycle, MoonPositionType} from "../../sky/Cycle.ts";
import {Atmosphere} from "../../sky/Atmosphere.ts";
import Day from "../../sky/Day.ts";
import Night from "../../sky/Night.ts";
import Star from "../../sky/Star.ts";
import Cloud from "../../sky/Cloud.ts";
import World from "../../sky/World.ts";
//import {SunShafts} from "./SunShafts.ts";
import LightSource from "../../sky/LightSource.ts";
import {
    clamp,
    clamp01,
    Deg2Rad, eulerFormVector,
    inverseVector,
    lerp, lerpColor, lerpColor4,
    localCoordsFromSpherical,
    powRgba,
    Rad2Deg,
    scaleVectors, vectorFromEuler
} from "../../common/Helper.ts";
import CloudAnimation from "../../sky/CloudAnimation.ts";

// ----- 着色器 -------
import AtmosphereFragShader from '../../sky/shaders/Atmosphere.frag';
import AtmosphereVertShader from '../../sky/shaders/Atmosphere.vert';
import BumpedCloudLayersFragShader from '../../sky/shaders/BumpedCloudLayers.frag';
import BumpedCloudLayersVertShader from '../../sky/shaders/BumpedCloudLayers.vert';
import ClearAlphaFragShader from '../../sky/shaders/ClearAlpha.frag';
import ClearAlphaVertShader from '../../sky/shaders/ClearAlpha.vert';
//import CloudShadows1FragShader from './shaders/CloudShadows1.frag';
//import CloudShadows1VertShader from './shaders/CloudShadows1.vert';
//import CloudShadows2FragShader from './shaders/CloudShadows2.frag';
//import CloudShadows2VertShader from './shaders/CloudShadows2.vert';
import DensityCloudLayersFragShader from '../../sky/shaders/DensityCloudLayers.frag';
import DensityCloudLayersVertShader from '../../sky/shaders/DensityCloudLayers.vert';
import FastestCloudLayersFragShader from '../../sky/shaders/FastestCloudLayers.frag';
import FastestCloudLayersVertShader from '../../sky/shaders/FastestCloudLayers.vert';
import MoonFragShader from '../../sky/shaders/Moon.frag';
import MoonVertShader from '../../sky/shaders/Moon.vert';
//import ScreenClearFragShader from './shaders/ScreenClear.frag';
//import ScreenClearVertShader from './shaders/ScreenClear.vert';
import SpaceFragShader from '../../sky/shaders/Space.frag';
import SpaceVertShader from '../../sky/shaders/Space.vert';
import SunFragShader from '../../sky/shaders/Sun.frag';
import SunVertShader from '../../sky/shaders/Sun.vert';
//import SunNoAnimationFragShader from './shaders/SunNoAnimation.frag';
//import SunNoAnimationVertShader from './shaders/SunNoAnimation.vert';
//import SunShaftsFragShader from './shaders/SunShafts.frag';
//import SunShaftsVertShader from './shaders/SunShafts.vert';

import {TextureLoader} from "../../loaders/TextureLoader.ts";
import {vector4FromColor4} from "../../common/Types.ts";
import {Time} from "../../sky/Time.ts";
import {Weather} from "../../sky/Weather.ts";
import {CanvasRenderer} from "../CanvasRenderer.ts";
import {PerspectiveCamera, Scene, WebGLRenderer} from "three";

const textureLoader = new TextureLoader();

export enum ColorSpaceDetection {
    Auto, Linear, Gamma
}

export enum CloudQualityType {
    Fastest, Density, Bumped
}

export enum MeshQualityType {
    Low, Medium, High
}

interface SkyVariables {
    lerpValue: number;

    sunZenith: number;
    moonZenith: number;
    sunShaftColor: Color4;
    sunColor: Color4;
    moonColor: Color4;
    moonHaloColor: Color4;
    cloudColor: Color4;
    fogColor: Color4;
    additiveColor: Color4;
    ambientColor: THREE.Color;

    colorSpace: ColorSpaceDetection;
    cloudQuality: CloudQualityType;
    meshQuality: MeshQualityType;

    globalUniforms: {[key: string]: THREE.IUniform};

    vectors: {
        opticalDepth: THREE.Vector2;
        oneOverBeta: THREE.Vector3;
        betaRayleigh: THREE.Vector3;
        betaRayleighTheta: THREE.Vector3;
        betaMie: THREE.Vector3;
        betaMieTheta: THREE.Vector3;
        betaMiePhase: THREE.Vector2;
        betaNight: THREE.Vector3;
    };
    objects: {
        sun: THREE.Object3D,
        moon: THREE.Object3D,
    };
    geometries: {
        space: THREE.BufferGeometry;
        atmosphere: THREE.BufferGeometry;
        clear: THREE.BufferGeometry;
        cloud: THREE.BufferGeometry;
        sun: THREE.BufferGeometry;
        moon: THREE.BufferGeometry;
    };
    materials: {
        space: THREE.ShaderMaterial;
        atmosphere: THREE.ShaderMaterial;
        clear: THREE.ShaderMaterial;
        cloud: THREE.ShaderMaterial;
        sun: THREE.ShaderMaterial;
        moon: THREE.ShaderMaterial;
    };
    textures: {
        cloudsNormal: THREE.Texture | undefined,
        cloudsTexture: THREE.Texture | undefined,
        noiseTextureDark: THREE.Texture | undefined,
        noiseTextureLight: THREE.Texture | undefined,
        noiseNormalsDark: THREE.Texture | undefined,
        noiseNormalsLight: THREE.Texture | undefined,
        whiteNoise: THREE.Texture | undefined,
        moon: THREE.Texture | undefined,
        sun: THREE.Texture | undefined,
        stars: THREE.Texture | undefined
    }
}

export class SkyRenderer extends CanvasRenderer {

    public cycle: Cycle = new Cycle();
    public atmosphere: Atmosphere = new Atmosphere();
    public day: Day = new Day();
    public night: Night = new Night();
    public star: Star = new Star();
    public clouds: Cloud = new Cloud();
    public world: World = new World();
    public animation: CloudAnimation;
    public weather: Weather = new Weather(this);
    public time: Time = new Time(this);

    //public sunShafts: SunShafts;
    public lightSource: LightSource = new LightSource(new THREE.DirectionalLight);

    private data: SkyVariables;

    protected setGlobalUniform(name: string, val: any): void {
        this.data.globalUniforms[name] = {value: val};
    }

    protected updateGlobalParams(): void {
        this.setGlobalUniform('_Gamma', this.gamma);
        this.setGlobalUniform('_OneOverGamma', 1 / this.gamma);
        this.setGlobalUniform("_LightColor", this.lightColor);
        this.setGlobalUniform("_CloudColor", vector4FromColor4(this.cloudColor));
        this.setGlobalUniform("_SunColor", vector4FromColor4(this.sunColor));
        this.setGlobalUniform("_MoonColor", vector4FromColor4(this.moonColor));
        this.setGlobalUniform("_AdditiveColor", vector4FromColor4(this.additiveColor));
        this.setGlobalUniform("_MoonHaloColor", vector4FromColor4(this.moonHaloColor));
        this.setGlobalUniform("_SunDirection", this.sunDirection);
        this.setGlobalUniform("_MoonDirection", this.moonDirection);
        this.setGlobalUniform("_LightDirection", this.lightDirection);
    }

    /**
     * 从天穹采样大气颜色
     * @param direction 世界空间下的视图向量
     * @param clampAlpha 是否对 Alpha 通道进行 [0, 1] 限缩
     */
    public sampleAtmosphere(direction: THREE.Vector3, clampAlpha: boolean = true): Color4 {
        // 世界坐标转局部坐标
        direction = this._context.scene.worldToLocal(direction);
        // 最后返回的颜色
        let color: Color4 = new Color4(THREE.Color.NAMES.black);
        // 太阳与法线夹角的余弦值
        const cosTheta: number = Math.max(0, -direction.dot(this.sunDirection));
        // 参数值
        const h: number = clamp(direction.y + this.world.horizonOffset, 0.001, 1);
        const f: number = Math.pow(h, this.atmosphere.haziness);
        // 光深度积分估计
        const opticalDepth: THREE.Vector2 = this.data.vectors.opticalDepth;
        const sh: number = (1 - f) * 190000;
        const sr: number = sh + f * (opticalDepth.x - sh);
        const sm: number = sh + f * (opticalDepth.y - sh);
        // 入射光角度
        const angular: number = 1 + cosTheta * cosTheta;
        // Rayleigh 和 Mie 散射的因子
        const beta = this.data.vectors.betaRayleigh.multiplyScalar(sr)
            .add(this.data.vectors.betaMie.multiplyScalar(sm));
        const betaTheta = this.data.vectors.betaRayleighTheta
            .add(this.data.vectors.betaMieTheta)
            .divideScalar(
                Math.pow(this.data.vectors.betaMiePhase.x
                    - this.data.vectors.betaMiePhase.y * cosTheta,
                    1.5)
            );
        // 散射光颜色
        color.r = (1 - Math.exp(-beta.x)) // 1 - T_r
            * (this.sunColor.r // E_sun
                * (angular * betaTheta.x * this.data.vectors.oneOverBeta.x) // L_sun
            ) + (
                this.moonColor.r // E_moon
                * this.data.vectors.betaNight.x // L_moon
            )
        ;
        color.g = (1 - Math.exp(-beta.y)) // 1 - T_g
            * (this.sunColor.g // E_sun
                * (angular * betaTheta.y * this.data.vectors.oneOverBeta.y) // L_sun
            ) + (
                this.moonColor.g // E_moon
                * this.data.vectors.betaNight.y // L_moon
            )
        ;
        color.b = (1 - Math.exp(-beta.z)) // 1 - T_g
            * (this.sunColor.b // E_sun
                * (angular * betaTheta.z * this.data.vectors.oneOverBeta.z) // L_sun
            ) + (
                this.moonColor.b // E_moon
                * this.data.vectors.betaNight.z // L_moon
            )
        ;
        color.a = Math.max(color.r, color.g, color.b) * 10; // 取三相中最大的一相
        // 添加月晕色
        color.add(this.moonColor.multiplyScalar(
            Math.pow(
                Math.max(0, -this.moonDirection.dot(direction)),
                10
            )
        ));
        // 添加相加色
        color.add(this.additiveColor);
        // 添加雾色
        const fogginess: number = this.atmosphere.fogginess;
        color.r = lerp(color.r, this.cloudColor.r, fogginess);
        color.g = lerp(color.g, this.cloudColor.g, fogginess);
        color.b = lerp(color.b, this.cloudColor.b, fogginess);
        color.a += fogginess;
        if(clampAlpha) color.a = clamp01(color.a);
        // 根据 gamma 值调节输出颜色
        color = powRgba(color, this.atmosphere.contrast * (1.0 / 2.2));
        return color;
    }

    /**
     * 计算 Rayleigh 和 Mie 散射值
     * @async
     * @protected
     */
    protected async updateScattering(): Promise<void> {
        const rayScaleConstant = 1.0, rayScaleTheta = 20.0, mieScaleConstant = 0.1, mieScaleTheta = 2.0;
        // ------ 计算 Rayleigh 散射 ------
        // 颜色因子
        let multiplierR: number = 0.001 + this.atmosphere.rayleighMultiplier * this.atmosphere.scatteringColor.r,
            multiplierG: number = 0.001 + this.atmosphere.rayleighMultiplier * this.atmosphere.scatteringColor.g,
            multiplierB: number = 0.001 + this.atmosphere.rayleighMultiplier * this.atmosphere.scatteringColor.b;
        // 散射因子
        const betaR = 5.8e-6, betaG = 13.5e-6, betaB = 33.1e-6;
        this.data.vectors.betaRayleigh.x = rayScaleConstant * betaR * multiplierR;
        this.data.vectors.betaRayleigh.y = rayScaleConstant * betaG * multiplierG;
        this.data.vectors.betaRayleigh.z = rayScaleConstant * betaB * multiplierB;
        // 日/月相
        let phase = 3 / (16 * Math.PI);
        this.data.vectors.betaRayleighTheta.x = rayScaleTheta * betaR * multiplierR * phase;
        this.data.vectors.betaRayleighTheta.y = rayScaleTheta * betaG * multiplierG * phase;
        this.data.vectors.betaRayleighTheta.z = rayScaleTheta * betaB * multiplierB * phase;
        this.data.vectors.opticalDepth.x = 8000 * Math.exp(-this.world.viewerHeight * 50000 / 8000);
        // -------- 计算 Mie 散射 --------
        // 颜色因子
        multiplierR = 0.001 + this.atmosphere.mieMultiplier * this.atmosphere.scatteringColor.r;
        multiplierG = 0.001 + this.atmosphere.mieMultiplier * this.atmosphere.scatteringColor.g;
        multiplierB = 0.001 + this.atmosphere.mieMultiplier * this.atmosphere.scatteringColor.b;
        let beta = 2e-5;
        this.data.vectors.betaMie.x = mieScaleConstant * beta * multiplierR;
        this.data.vectors.betaMie.y = mieScaleConstant * beta * multiplierG;
        this.data.vectors.betaMie.z = mieScaleConstant * beta * multiplierB;
        let g = this.atmosphere.directionality;
        phase = 3 / (4 * Math.PI) * (1 - g * g) / (2 + g * g);
        this.data.vectors.betaMieTheta.x = mieScaleTheta * beta * multiplierR * phase;
        this.data.vectors.betaMieTheta.y = mieScaleTheta * beta * multiplierG * phase;
        this.data.vectors.betaMieTheta.z = mieScaleTheta * beta * multiplierB * phase;
        this.data.vectors.betaMiePhase.x = 1 + g * g;
        this.data.vectors.betaMiePhase.y = g << 1;
        this.data.vectors.opticalDepth.y = 1200 * Math.exp(-this.world.viewerHeight * 50000 / 1200);
        this.data.vectors.oneOverBeta = inverseVector(this.data.vectors.betaMie.add(this.data.vectors.betaRayleigh));
        this.data.vectors.betaNight = scaleVectors(
            this.data.vectors.betaRayleighTheta
                .add(
                    this.data.vectors.betaMieTheta
                        .divideScalar(
                            Math.pow(this.data.vectors.betaMiePhase.x, 1.5)
                        )
                ),
            this.data.vectors.oneOverBeta
        );
    }

    protected async updateLightSource(
        sunTheta: number, sunPhi: number, moonTheta: number, moonPhi: number
    ): Promise<void> {
        // 相对光学质量（用球壳近似的空气质量系数）
        // http://en.wikipedia.org/wiki/Air_mass_(solar_energy)
        let c: number = Math.cos( // Zenith 角
            Math.pow(sunTheta / (2 * Math.PI), 2 - this.lightSource.falloff) * 2 * Math.PI
        ),
            m: number = Math.sqrt(708 * 708 * c * c + 2 * 708 + 1) - 708 * c,
            // 波长（单位：m）
            lambdaR: number = 680.0,
            lambdaG: number = 550.0,
            lambdaB: number = 440.0,
            // 透射的太阳光颜色
            r: number = this.day.sunLightColor.r,
            g: number = this.day.sunLightColor.g,
            b: number = this.day.sunLightColor.b,
            a: number = this.lightSource.light.intensity /
                Math.max(this.day.sunLightIntensity, this.night.moonLightIntensity),
            // 由 Rayleigh 散射引起的透射
            rayleighBeta: number = 0.008735,
            rayleighAlpha: number = 4.08;
        r *= Math.exp(-rayleighBeta * Math.pow(lambdaR, -rayleighAlpha * m));
        g *= Math.exp(-rayleighBeta * Math.pow(lambdaG, -rayleighAlpha * m));
        b *= Math.exp(-rayleighBeta * Math.pow(lambdaB, -rayleighAlpha * m));
        this.data.lerpValue = clamp01(1.1 * Math.max(r, g, b));

        this.ambientColor = lerpColor(
            // 夜晚
            new THREE.Color(
                this.night.ambientColor.r * this.night.ambientColor.a,
                this.night.ambientColor.g * this.night.ambientColor.a,
                this.night.ambientColor.b * this.night.ambientColor.a
            ),
            // 白天
            new THREE.Color(
                this.day.ambientColor.r * this.day.ambientColor.a * lerp(1, r, this.lightSource.ambientColoring),
                this.day.ambientColor.g * this.day.ambientColor.a * lerp(1, g, this.lightSource.ambientColoring),
                this.day.ambientColor.b * this.day.ambientColor.a * lerp(1, b, this.lightSource.ambientColoring)
            ),
            this.data.lerpValue
        );

        this.sunShaftsColor = new Color4(
            this.day.sunShaftColor.r * this.day.sunShaftColor.a * lerp(1, r, this.lightSource.shaftColoring),
            this.day.sunShaftColor.g * this.day.sunShaftColor.a * lerp(1, g, this.lightSource.shaftColoring),
            this.day.sunShaftColor.b * this.day.sunShaftColor.a * lerp(1, b, this.lightSource.shaftColoring),
            a
        );

        const sunColor: Color4 = lerpColor4(
            this.day.sunLightColor.multiplyScalar(this.data.lerpValue),
            new Color4(r, g, b, a), this.lightSource.skyColoring
        ).multiplyScalar(
            lerp(1, 0.1, Math.sqrt(this.sunZenith / 90) - 0.25)
        ).multiplyScalar(
            this.day.skyMultiplier
        ).multiplyScalar(
            this.atmosphere.brightness
        );
        sunColor.a = this.data.lerpValue;
        this.sunColor = sunColor;

        const moonColor: Color4 = this.night.moonLightColor.multiplyScalar(
            this.night.skyMultiplier
        ).multiplyScalar(
            this.atmosphere.brightness
        ).multiplyScalar(
            (1 - this.data.lerpValue) / 2
        );
        moonColor.a = 1 - this.data.lerpValue;
        this.moonColor = moonColor;
        const haloColor = this.night.moonHaloColor.multiplyScalar(
            (1 - this.data.lerpValue) * (1 - Math.abs(this.cycle.moonPhase))
        ).multiplyScalar(
            this.atmosphere.brightness
        );
        haloColor.r *= haloColor.r;
        haloColor.g *= haloColor.g;
        haloColor.b *= haloColor.b;
        haloColor.a = Math.max(moonColor.r, moonColor.g, moonColor.b);
        this.moonHaloColor = haloColor;

        let cloudColor: Color4 = lerpColor4(
            this.moonColor,
            this.sunColor,
            this.data.lerpValue
        );
        const cloudColorAvg: number = (cloudColor.r + cloudColor.g * cloudColor.b) / 3;
        const cloudColorAlpha: number = lerp(this.night.cloudMultiplier, this.day.cloudMultiplier, this.data.lerpValue);
        cloudColor = lerpColor4(
            new Color4(cloudColorAvg, cloudColorAvg, cloudColorAvg, 1),
            cloudColor,
            this.lightSource.cloudColoring
        ).multiplyScalar(
            this.clouds.brightness
        ).multiplyScalar(
            cloudColorAlpha * 1.25
        );
        cloudColor.a = cloudColorAlpha;
        this.cloudColor = cloudColor;

        const additiveColor: Color4 = lerpColor4(
            this.night.additiveColor,
            this.day.additiveColor,
            this.data.lerpValue
        );
        additiveColor.r *= additiveColor.r;
        additiveColor.g *= additiveColor.g;
        additiveColor.b *= additiveColor.b;
        additiveColor.a = Math.max(additiveColor.r, additiveColor.g, additiveColor.b);
        this.additiveColor = additiveColor;

        let intensity: number;//, shadowStrength: number;
        let pos: THREE.Vector3;
        const threshold: number = 0.2;

        if(this.data.lerpValue > threshold) {
            intensity = lerp(0, this.day.sunLightIntensity, (this.data.lerpValue - threshold) / (1 - threshold));
            //shadowStrength = this.day.shadowStrength;
            pos = localCoordsFromSpherical(
                Math.min(sunTheta, (1 - this.lightSource.minimumHeight) * Math.PI / 2),
                sunPhi
            );
        } else {
            intensity = lerp(
                0,
                this.night.moonLightIntensity * (1 - Math.abs(this.cycle.moonPhase)),
                (threshold - this.data.lerpValue) / threshold
            );
            //shadowStrength = this.night.shadowStrength;
            pos = localCoordsFromSpherical(
                Math.min(moonTheta, (1 - this.lightSource.minimumHeight) * Math.PI / 2),
                moonPhi
            );
        }
        this.lightSource.intensity = intensity;
        this.lightSource.position = pos;
        this.lightSource.light.lookAt(this._context.scene.position);
    }

    /**
     * 计算日月的位置
     * @protected
     * @async
     * @see http://www.stjarnhimlen.se/comp/ppcomp.html
     */
    protected async updateSunAndMoon(): Promise<void> {
        // 当地纬度
        let latRad: number = Deg2Rad * this.cycle.latitude,
            latSin: number = Math.sin(latRad),
            latCos: number = Math.sin(latRad),
        // 当地经度
            lonDeg: number = this.cycle.longitude,
        // 当地时间
            d: number = 367 * this.cycle.year - 7 * (this.cycle.year + (this.cycle.month + 9) / 12) / 4
            + 275 * this.cycle.month / 9 + this.cycle.day - 730530, // 天数
            t: number = this.cycle.hour - this.cycle.timeZone, // UTC 小时
            ecl: number = 23.4393 - 3.563e-7 * d,
            eclRad: number = Deg2Rad * ecl,
            eclSin: number = Math.sin(eclRad),
            eclCos: number = Math.cos(eclRad),
        // -------- 计算太阳位置 --------
            w: number = 282.9404 + 4.70935e-5 * d, // 近心点幅角
            e: number = 0.016709 - 1.151e-9 * d, // 离心率，0 为圆、(0,1) 为椭圆、1 为抛物线
            M: number = 356.0470 + 0.9856002585 * d, // 平近点角，在近心点时为 0，随时间均匀增加
            MRad: number = Deg2Rad * M,
            MSin: number = Math.sin(MRad),
            MCos: number = Math.cos(MRad),
            EDeg: number = M + e * Rad2Deg * MSin * (1 + e * MCos), // 偏近点角
            ERad: number = Deg2Rad * EDeg,
            ESin: number = Math.sin(ERad),
            ECos: number = Math.cos(ERad),
            xv: number = ECos - e, // 真近点角的水平分量
            yv: number = ESin * Math.sqrt(1 - e * e), // 真近点角的垂直分量
            v: number = Rad2Deg * Math.atan2(yv, xv), // 真近点角
            r: number = Math.sqrt(xv * xv + yv * yv), // 离太阳的距离
            l: number = v + w, // 太阳的真黄经
            lRad: number = Deg2Rad * l,
            lSin: number = Math.sin(lRad),
            lCos: number = Math.cos(lRad),
            xs: number = r * lCos, // 把真黄径转成黄道平面坐标系坐标
            ys: number = r * lSin, // 因为太阳始终处于黄道平面上，所以 zs = 0
            xe: number = xs, // 赤道
            ye: number = ys * eclCos, // 直角
            ze: number = ys * eclSin, // 地心
            rascRad: number = Math.atan2(ye, ze), // 太阳的赤经（Right Ascension, RA）
            rascDeg: number = Rad2Deg * rascRad,
            declRad: number = Math.atan2(ze, Math.sqrt(xe * xe + ye * ye)), // 太阳的赤纬（Declination）
            declSin: number = Math.sin(declRad),
            declCos: number = Math.cos(declRad),
            GMST0Deg: number = v + w + 180, // 格林尼治平恒星时（Greenwich Mean Sidereal Time, GMST）
            GMSTDeg: number = GMST0Deg + t * 15,
            LSTDeg: number = GMSTDeg + lonDeg, // 当地恒星时（Local Sidereal Time, LST）
            HADeg: number = LSTDeg - rascDeg, // 时角
            HARad: number = Deg2Rad * HADeg,
            HASin: number = Math.sin(HARad),
            HACos: number = Math.cos(HARad),
            x: number = HACos * declCos,
            y: number = HASin * declCos,
            z: number = declSin,
            xhor: number = x * latSin - z * latCos,
            yhor: number = y,
            zhor: number = x * latCos + z * latSin,
            azimuth = Math.atan2(yhor, xhor) + Math.PI, // 方位角，0 为正北方、90 为正东方、180 为正南方、270 为正西方
            altitude: number = // 高度，0 为地平线、90 为天顶、负值就是在地平线以下
                Math.atan2(zhor, Math.sqrt(xhor * xhor + yhor * yhor)),
            sunTheta: number = Math.PI / 2 - altitude,
            sunPhi: number = azimuth,
        // 已知太阳的 theta 和 phi 简单粗暴计算月亮的
            moonTheta: number = sunTheta - Math.PI,
            moonPhi: number = sunPhi;
        if(this.cycle.moonPosition === MoonPositionType.Realistic) {
            // 计算符合现实世界的参数
            let N: number = 125.1228 - 0.0529538083 * d, // 升交点经度
                NRad: number = Deg2Rad * N,
                NSin: number = Math.sin(NRad),
                NCos: number = Math.cos(NRad),
                i: number = 5.1454, // 黄道倾角
                iRad: number = Deg2Rad * i,
                iSin: number = Math.sin(iRad),
                iCos: number = Math.cos(iRad),
                a: number = 60.2666; // 半长轴，即与太阳的平均距离
            w = 318.0634 + 0.1643573223 * d; // 近心点幅角
            e = 0.054900; // 离心率
            xv = a * (ECos - e); // 真近点角的水平分量
            yv = a * ESin * Math.sqrt(1 - e * e); // 真近点角的垂直分量
            v = Rad2Deg * Math.atan2(yv, xv); // 真近点角
            r = Math.sqrt(xv * xv + yv * yv); // 离太阳的距离
            l = v + w; // 月球的真黄经
            lRad = Deg2Rad * l;
            lSin = Math.sin(lRad);
            lCos = Math.cos(lRad);
            // 计算月球在三维空间中的坐标（以地球为中心）
            let xh: number = r * (NCos * lCos - NSin * lSin * iCos),
                yh: number = r * (NSin * lCos + NCos * lSin * iCos),
                zh: number = r * (lSin * iSin);
            ye = yh * eclCos - zh * eclSin;
            ze = zh * eclSin + zh * eclCos;
            declRad = Math.atan2(ze, Math.sqrt(xh * xh + ye * ye)); // 月球的赤纬
            declSin = Math.sin(declRad);
            declCos = Math.cos(declRad);
            x = HACos * declCos;
            y = HASin * declCos;
            z = declSin;
            xhor = x * latSin - z * latCos;
            yhor = y;
            zhor = x * latCos + z * latSin;
            azimuth = Math.atan2(yhor, xhor) + Math.PI;
            altitude = Math.atan2(zhor, Math.sqrt(xhor * xhor + yhor * yhor));
            moonTheta = Math.PI / 2 - altitude;
            moonPhi = azimuth;
        }
        // 更新太阳的位置
        const sunPos: THREE.Vector3 = localCoordsFromSpherical(sunTheta, sunPhi).multiplyScalar(100);
        this.data.objects.sun.position.set(sunPos.x, sunPos.y, sunPos.z);
        this.data.objects.sun.lookAt(this._context.scene.position);
        const cameraRotation: THREE.Vector3 = vectorFromEuler(this._context.camera.rotation);
        const sunRotation: THREE.Vector3 = vectorFromEuler(this.data.objects.sun.rotation);
        sunRotation.z = 2 * Date.now()
            + Math.abs(cameraRotation.x) + Math.abs(cameraRotation.y) + Math.abs(cameraRotation.z);
        this.data.objects.sun.setRotationFromEuler(eulerFormVector(sunRotation));
        // 更新太阳的大小
        const sunScaleConstant = 8 * Math.tan(Deg2Rad / 2 * this.day.sunMeshSize);
        this.data.objects.sun.scale.set(sunScaleConstant, sunScaleConstant, sunScaleConstant);
        // 更新月球的位置
        const moonPos: THREE.Vector3 = localCoordsFromSpherical(moonTheta, moonPhi).multiplyScalar(100);
        this.data.objects.moon.position.set(moonPos.x, moonPos.y, moonPos.z);
        this.data.objects.moon.lookAt(this._context.scene.position);
        // 更新月球的大小
        const moonScaleConstant = 8 * Math.tan(Deg2Rad / 2 * this.night.moonMeshSize);
        this.data.objects.moon.scale.set(moonScaleConstant, moonScaleConstant, moonScaleConstant);
        // 更新天顶属性
        this.data.sunZenith = Rad2Deg * sunTheta;
        this.data.moonZenith = Rad2Deg * moonTheta;
        await this.updateLightSource(sunTheta, sunPhi, moonTheta, moonPhi);
    }

    constructor(
        canvas: HTMLCanvasElement | OffscreenCanvas,
        bodyElement: unknown,
        shadows: boolean = true
    ) {
        const camera = new PerspectiveCamera();
        camera.near = 0.3;
        camera.far = 1000;
        camera.fov = 60;
        camera.aspect = canvas.width / canvas.height;
        camera.position.set(0,100,0);
        camera.lookAt(-Math.PI, 0, Math.PI);
        camera.updateProjectionMatrix();
        super(canvas, bodyElement, shadows, {
            renderer: new WebGLRenderer({
                antialias: true,
                canvas,
                alpha: true
            }),
            scene: new Scene(),
            camera
        });
        //this.sunShafts = new SunShafts(camera, renderer, scene, this, null, null);
        this.data = {
            textures: {
                moon: undefined,
                noiseNormalsDark: undefined,
                noiseNormalsLight: undefined,
                noiseTextureDark: undefined,
                noiseTextureLight: undefined,
                stars: undefined,
                sun: undefined,
                cloudsTexture: undefined,
                cloudsNormal: undefined,
                whiteNoise: undefined,
            },
            cloudQuality: CloudQualityType.Bumped,
            colorSpace: ColorSpaceDetection.Auto,
            meshQuality: MeshQualityType.High,
            additiveColor: this.day.additiveColor,
            ambientColor: this.day.ambientColor,
            cloudColor: new Color4(Color4.NAMES.white),
            fogColor: new Color4(Color4.NAMES.gray),
            globalUniforms: {},
            lerpValue: 0,
            materials: {
                space: new THREE.ShaderMaterial({
                    uniforms: {},
                    vertexShader: SpaceVertShader,
                    fragmentShader: SpaceFragShader,
                    transparent: true,
                    depthWrite: false,
                    depthTest: true
                }),
                atmosphere: new THREE.ShaderMaterial({
                    uniforms: {},
                    vertexShader: AtmosphereVertShader,
                    fragmentShader: AtmosphereFragShader,
                    transparent: true
                }),
                clear: new THREE.ShaderMaterial({
                    uniforms: {},
                    vertexShader: ClearAlphaVertShader,
                    fragmentShader: ClearAlphaFragShader,
                    transparent: true,
                    depthWrite: false,
                    depthTest: true
                }),
                cloud: new THREE.ShaderMaterial({
                    uniforms: {},
                    vertexShader: BumpedCloudLayersVertShader,
                    fragmentShader: BumpedCloudLayersFragShader,
                    transparent: true
                }),
                sun: new THREE.ShaderMaterial({
                    uniforms: {},
                    vertexShader: SunVertShader,
                    fragmentShader: SunFragShader,
                    transparent: true,
                    blending: THREE.CustomBlending,
                    blendEquation: THREE.AddEquation,
                    blendSrc: THREE.OneMinusDstColorFactor,
                    blendDst: THREE.OneFactor,
                    depthWrite: false,
                    depthTest: true,
                    depthFunc: THREE.LessEqualDepth
                }),
                moon: new THREE.ShaderMaterial({
                    uniforms: {},
                    vertexShader: MoonVertShader,
                    fragmentShader: MoonFragShader,
                    transparent: true
                }),
            },
            geometries: {
                space: new THREE.IcosahedronGeometry(100, 10),
                atmosphere: new THREE.IcosahedronGeometry(100, 10),
                clear: new THREE.IcosahedronGeometry(100, 10),
                cloud: new THREE.SphereGeometry(100, 48, 48,
                    0, Math.PI * 2, 0, Math.PI / 2),
                sun: new ConvexGeometry([
                    new THREE.Vector3(100, -100, 0),
                    new THREE.Vector3(-100, -100, 0),
                    new THREE.Vector3(100, 100, 0),
                    new THREE.Vector3(-100, 100, 0)
                ]),
                moon: new THREE.SphereGeometry(100)
            },
            moonColor: new Color4(181/255, 204/255, 1, 1),
            moonHaloColor: new Color4(Color4.NAMES.lightgray),
            moonZenith: 0,
            objects: {
                sun: new THREE.Mesh,
                moon: new THREE.Mesh,
            },
            sunColor: new Color4(1, 243/255, 234/255, 1),
            sunShaftColor: new Color4(Color4.NAMES.lightyellow),
            sunZenith: 0,
            vectors: {
                opticalDepth: new THREE.Vector2,
                oneOverBeta: new THREE.Vector3,
                betaRayleigh: new THREE.Vector3,
                betaRayleighTheta: new THREE.Vector3,
                betaMie: new THREE.Vector3,
                betaMieTheta: new THREE.Vector3,
                betaMiePhase: new THREE.Vector2,
                betaNight: new THREE.Vector3
            }
        };
        textureLoader.loadAsync('/textures/moon_texture.png')
            .then(texture => {
                this.data.textures.moon = texture;
            });
        textureLoader.loadAsync('/textures/sun_texture.png')
            .then(texture => {
                this.data.textures.sun = texture;
            });
        textureLoader.loadAsync('/textures/stars_texture.png')
            .then(texture => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                this.data.textures.stars = texture;
            });
        textureLoader.loadAsync('/textures/clouds_dark_normal.png')
            .then(texture => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                this.data.textures.noiseNormalsDark = texture;
            });
        textureLoader.loadAsync('/textures/clouds_dark_texture.png')
            .then(texture => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                this.data.textures.noiseTextureDark = texture;
            });
        textureLoader.loadAsync('/textures/clouds_light_normal.png')
            .then(texture => {
                this.data.textures.noiseNormalsLight = texture;
            });
        textureLoader.loadAsync('/textures/clouds_light_texture.png')
            .then(texture => {
                this.data.textures.noiseTextureLight = texture;
            });
        textureLoader.loadAsync('/textures/clouds_normal.png')
            .then(texture => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                this.data.textures.cloudsNormal = texture;
            });
        textureLoader.loadAsync('/textures/clouds_texture.png')
            .then(texture => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                this.data.textures.cloudsTexture = texture;
            });
        const atmosphere: THREE.Mesh = new THREE.Mesh(this.data.geometries.atmosphere, this.data.materials.atmosphere);
        const clouds: THREE.Mesh = new THREE.Mesh(this.data.geometries.cloud, this.data.materials.cloud);
        const space: THREE.Mesh = new THREE.Mesh(this.data.geometries.space, this.data.materials.space);
        const clear: THREE.Mesh = new THREE.Mesh(this.data.geometries.clear, this.data.materials.clear);
        space.renderOrder = 2510;
        this.data.objects.moon.renderOrder = 2520;
        atmosphere.renderOrder = 2530;
        this.data.objects.sun.renderOrder = 2540;
        clear.renderOrder = 2545;
        clouds.renderOrder = 2550;

        this.animation = new CloudAnimation(this, this._context.scene);
        this.data.materials.atmosphere.side = THREE.BackSide;
        (this.data.objects.sun as THREE.Mesh).geometry = this.data.geometries.sun;
        (this.data.objects.sun as THREE.Mesh).material = this.data.materials.sun;
        (this.data.objects.moon as THREE.Mesh).geometry = this.data.geometries.moon;
        (this.data.objects.moon as THREE.Mesh).material = this.data.materials.moon;
        this._context.scene.add(
            this.data.objects.moon,
            //this.data.objects.sun,
            atmosphere,
            clouds,
            space,
            clear,
            // this.lightSource.light
        );
        this.compile().then(_ => this.render());
        this.render();
    }

    get colorSpace(): ColorSpaceDetection {
        return this.data.colorSpace;
    }

    get meshQuality(): MeshQualityType {
        return this.data.meshQuality;
    }

    get cloudQuality(): CloudQualityType {
        return this.data.cloudQuality;
    }
    set cloudQuality(value: CloudQualityType) {
        switch (value) {
            case CloudQualityType.Fastest: {
                this.data.materials.cloud.vertexShader = FastestCloudLayersVertShader;
                this.data.materials.cloud.fragmentShader = FastestCloudLayersFragShader;
                break;
            }
            case CloudQualityType.Density: {
                this.data.materials.cloud.vertexShader = DensityCloudLayersVertShader;
                this.data.materials.cloud.fragmentShader = DensityCloudLayersFragShader;
                break;
            }
            case CloudQualityType.Bumped: {
                this.data.materials.cloud.vertexShader = BumpedCloudLayersVertShader;
                this.data.materials.cloud.fragmentShader = BumpedCloudLayersFragShader;
                break;
            }
        }
        this.data.cloudQuality = value;
    }

    /**
     * 检查是否为白天。
     */
    get isDay(): boolean {
        return this.data.lerpValue > 0;
    }

    /**
     * 检查是否为夜晚。
     */
    get isNight(): boolean {
        return this.data.lerpValue === 0;
    }

    /**
     * 天空穹顶的半径。
     */
    get radius(): number {
        // 实现Radius逻辑
        return 0; // 占位符
    }

    /**
     * 着色器中使用的伽马值。
     */
    get gamma(): number {
        switch (this.colorSpace) {
            case ColorSpaceDetection.Auto:
            case ColorSpaceDetection.Linear:
                return 1.0;
            case ColorSpaceDetection.Gamma:
                return 2.2;
        }
    }

    /**
     * 太阳的天顶角度（度数）。
     * @description = 0：上中天；= 180：在地平线以下。
     */
    get sunZenith(): number {
        return this.data.sunZenith;
    }

    /**
     * 月亮的天顶角度（度数）。
     * @description = 0：上中天；= 180：在地平线以下。
     */
    get moonZenith(): number {
        return this.data.moonZenith;
    }

    /**
     * 当前活动光源（太阳/月亮）的天顶角度（度数）。
     * @description = 0：当前活动光源正上中天；= 90：当前活动光源正处在地平线上。
     */
    get lightZenith(): number {
        return Math.min(this.sunZenith, this.moonZenith);
    }

    /**
     * 当前光照强度。
     * @see THREE.Light.intensity
     */
    get lightIntensity(): number {
        return this.lightSource.light.intensity;
    }

    /**
     * 月亮的世界空间方向向量。
     * @see THREE.Vector3.getWorldDirection
     */
    get moonDirection(): THREE.Vector3 {
        const result = new THREE.Vector3();
        this.data.objects.moon.getWorldDirection(result);
        return result;
    }

    /**
     * 太阳的世界空间方向向量。
     * @see THREE.Vector3.getWorldDirection
     */
    get sunDirection(): THREE.Vector3 {
        const result = new THREE.Vector3();
        this.data.objects.sun.getWorldDirection(result);
        return result;
    }

    /**
     * 当前方向光的世界空间方向向量。
     * @description 在黄昏和黎明时在 SunDirection 和 MoonDirection 之间插值。
     * @see @see THREE.Vector3.getWorldDirection
     */
    get lightDirection(): THREE.Vector3 {
        return this.moonDirection.lerp(this.sunDirection, this.data.lerpValue * this.data.lerpValue);
    }

    /**
     * 当前光的颜色。
     */
    get lightColor(): THREE.Color {
        return this.lightSource.light.color;
    }

    /**
     * 从物理模型中采样的雾颜色。
     * @description 依赖于摄像机的视角方向。
     */
    get fogColor(): Color4 {
        return this.data.fogColor;
    }

    /**
     * 光线颜色
     */
    get sunShaftsColor(): Color4 {
        return this.data.sunShaftColor;
    }
    private set sunShaftsColor(value: Color4) {
        this.data.sunShaftColor = value;
    }

    /**
     * 太阳颜色
     */
    get sunColor(): Color4 {
        return this.data.sunColor;
    }
    private set sunColor(value: Color4) {
        this.data.sunColor = value;
    }

    /**
     * 月亮颜色
     */
    get moonColor(): Color4 {
        return this.data.moonColor;
    }
    private set moonColor(value: Color4) {
        this.data.moonColor = value;
    }

    /**
     * 月晕颜色
     */
    get moonHaloColor(): Color4 {
        return this.data.moonHaloColor;
    }
    private set moonHaloColor(value: Color4) {
        this.data.moonHaloColor = value;
    }

    /**
     * 云层颜色
     */
    get cloudColor(): Color4 {
        return this.data.cloudColor;
    }
    private set cloudColor(value: Color4) {
        this.data.cloudColor = value;
    }

    /**
     * 相加色
     */
    get additiveColor(): Color4 {
        return this.data.additiveColor;
    }
    private set additiveColor(value: Color4) {
        this.data.additiveColor = value;
    }

    /**
     * 环境色
     */
    get ambientColor(): THREE.Color {
        return this.data.ambientColor;
    }
    private set ambientColor(value: THREE.Color) {
        this.data.ambientColor = value;
    }

    /**
     * 渲染当前帧
     */
    public override render(): void {
        this.update().then(() => {
            this._context.renderer.render(this._context.scene, this._context.camera);
            requestAnimationFrame(this.render.bind(this));
        });
    }

    /**
     * 当前场景发生变化时，调用该函数来刷新参数
     * @override
     */
    async update(): Promise<void> {
        this.time.update();
        this.animation.update();
        this.weather.update();
        this.updateGlobalParams();
        // 更新日月位置
        await this.updateSunAndMoon();
        // 更新 Mie 和 Rayleigh 散射值
        await this.updateScattering();
        // 更新大气对象的 uniforms
        for(const key in this.data.globalUniforms) {
            const value = this.data.globalUniforms[key];
            this.data.materials.atmosphere.uniforms[key] = value;
            this.data.materials.cloud.uniforms[key] = value;
            this.data.materials.space.uniforms[key] = value;
            this.data.materials.moon.uniforms[key] = value;
        }
        this.data.materials.atmosphere.uniforms['_Contrast'] = { value: this.atmosphere.contrast / this.gamma };
        this.data.materials.atmosphere.uniforms['_Haziness'] = { value: this.atmosphere.haziness };
        this.data.materials.atmosphere.uniforms['_Fogginess'] = { value: this.atmosphere.fogginess };
        this.data.materials.atmosphere.uniforms['_Horizon'] = { value: this.world.horizonOffset };
        this.data.materials.atmosphere.uniforms['_OpticalDepth'] = { value: this.data.vectors.opticalDepth };
        this.data.materials.atmosphere.uniforms['_OneOverBeta'] = { value: this.data.vectors.oneOverBeta };
        this.data.materials.atmosphere.uniforms['_BetaRayleigh'] = { value: this.data.vectors.betaRayleigh };
        this.data.materials.atmosphere.uniforms['_BetaRayleighTheta'] = { value: this.data.vectors.betaRayleighTheta };
        this.data.materials.atmosphere.uniforms['_BetaMie'] = { value: this.data.vectors.betaMie };
        this.data.materials.atmosphere.uniforms['_BetaMieTheta'] = { value: this.data.vectors.betaMieTheta };
        this.data.materials.atmosphere.uniforms['_BetaMiePhase'] = { value: this.data.vectors.betaMiePhase };
        this.data.materials.atmosphere.uniforms['_BetaNight'] = { value: this.data.vectors.betaNight };
        // 更新云层的 uniforms
        const cloudUV: THREE.Vector4 = this.animation.cloudUV.add(this.animation.offsetUV);
        this.data.materials.cloud.uniforms['_SunGlow'] = { value: (1 - this.atmosphere.fogginess) * this.data.lerpValue };
        this.data.materials.cloud.uniforms['_MoonGlow'] = { value: (1 - this.atmosphere.fogginess) * 0.6 * (1 - Math.abs(this.cycle.moonPhase)) };
        this.data.materials.cloud.uniforms['_CloudDensity'] = { value: this.clouds.density };
        this.data.materials.cloud.uniforms['_CloudSharpness'] = { value: this.clouds.sharpness };
        this.data.materials.cloud.uniforms['_CloudScale1'] = { value: this.clouds.scale1 };
        this.data.materials.cloud.uniforms['_CloudScale2'] = { value: this.clouds.scale2 };
        this.data.materials.cloud.uniforms['_CloudUV'] = { value: cloudUV };
        this.data.materials.cloud.uniforms['_LocalSunDirection'] = { value: this._context.scene.worldToLocal(this.sunDirection) };
        this.data.materials.cloud.uniforms['_LocalMoonDirection'] = { value: this._context.scene.worldToLocal(this.moonDirection) };
        this.data.materials.cloud.uniforms['_LocalLightDirection'] = { value: this._context.scene.worldToLocal(this.lightDirection) };
        switch (this.cloudQuality) {
            case CloudQualityType.Fastest: {
                this.data.materials.cloud.uniforms['_NoiseTexture'] = { value: this.data.textures.cloudsTexture };
                break;
            }
            case CloudQualityType.Density:
            case CloudQualityType.Bumped:{
                this.data.materials.cloud.uniforms['_NoiseTexture1'] = { value: this.data.textures.cloudsTexture };
                this.data.materials.cloud.uniforms['_NoiseTexture2'] = { value: this.data.textures.noiseTextureDark };
                this.data.materials.cloud.uniforms['_NoiseNormals1'] = { value: this.data.textures.cloudsNormal };
                this.data.materials.cloud.uniforms['_NoiseNormals2'] = { value: this.data.textures.noiseNormalsDark };
                break;
            }
        }
        // 更新天空的 uniforms
        this.data.materials.space.uniforms['_Subtract'] = { value: 1 - Math.pow(this.star.density, 0.1) };
        this.data.materials.space.uniforms['_MainTex'] = { value: this.data.textures.stars };
        this.data.materials.space.uniforms['_MainTex_ST'] = { value: new THREE.Vector4(2, 2, 0, 0) };
        // 更新太阳的 uniforms
        this.data.materials.sun.uniforms = this.data.globalUniforms;
        this.data.materials.sun.uniforms['_Color'] = {
            value: vector4FromColor4(
                this.day.sunMeshColor.multiplyScalar(this.data.lerpValue * (1 - this.atmosphere.fogginess))
            ),
        };
        this.data.materials.sun.uniforms['_MainTex'] = { value: this.data.textures.sun };
        this.data.materials.sun.uniforms['_MainTex_ST'] = { value: new THREE.Vector4(1, 1, 0, 0) };
        this.data.materials.sun.uniforms['_SinTime'] = { value: Math.sin(Date.now()) / 2 };
        // 更新月亮的 uniforms
        this.data.materials.moon.uniforms['_Contrast'] = { value: this.atmosphere.contrast / this.gamma };
        this.data.materials.moon.uniforms['_Color'] = { value: vector4FromColor4(this.night.moonMeshColor) };
        this.data.materials.moon.uniforms['_Phase'] = { value: this.cycle.moonPhase };
        this.data.materials.moon.uniforms['_MainTex'] = { value: this.data.textures.moon };
        this.data.materials.moon.uniforms['_MainTex_ST'] = { value: new THREE.Vector4(1, 1, 0, 0) };
        const cameraPos = new THREE.Vector3;
        this._context.camera.getWorldPosition(cameraPos);
        this.data.materials.moon.uniforms['_WorldSpaceCameraPos'] = { value: cameraPos };
    }
}