import {PostEffectsBase} from "./PostEffectsBase.ts";
import {SkyRenderer} from "../renderers/sky/SkyRenderer.ts";
import * as THREE from 'three';

export enum SunShaftsResolution {
    Low,
    Normal,
    High
}

export enum SunShaftsBlendMode {
    Screen,
    Add,
}

export class SunShafts extends PostEffectsBase {
    sky: SkyRenderer;
    Resolution: SunShaftsResolution = SunShaftsResolution.Normal;
    BlendMode: SunShaftsBlendMode = SunShaftsBlendMode.Screen;
    RadialBlurIterations: number = 2;
    SunShaftBlurRadius: number = 2;
    SunShaftIntensity: number = 1;
    MaxRadius: number = 1;
    UseDepthTexture: boolean = true;
    SunShaftsShader: THREE.ShaderLibShader | null = null;
    ScreenClearShader: THREE.ShaderLibShader | null = null;

    private sunShaftsMaterial: THREE.ShaderMaterial | null = null;
    private screenClearMaterial: THREE.ShaderMaterial | null = null;
    private readonly scene: THREE.Scene;

    constructor(
        camera: THREE.Camera,
        renderer: THREE.WebGLRenderer,
        scene: THREE.Scene,
        sky: SkyRenderer,
        sunShaftsShader: THREE.ShaderLibShader,
        screenClearShader: THREE.ShaderLibShader
    ) {
        super(camera, renderer);
        this.scene = scene;
        this.sky = sky;
        this.SunShaftsShader = sunShaftsShader;
        this.ScreenClearShader = screenClearShader;
    }

    update() {
        this.RadialBlurIterations = Math.max(1, Math.min(this.RadialBlurIterations, 4));
        this.SunShaftBlurRadius = Math.max(this.SunShaftBlurRadius, 0);
        this.SunShaftIntensity = Math.max(this.SunShaftIntensity, 0);
        this.MaxRadius = Math.max(this.MaxRadius, 0);
    }

    onDisable() {
        if (this.sunShaftsMaterial) {
            this.sunShaftsMaterial.dispose();
            this.sunShaftsMaterial = null;
        }
        if (this.screenClearMaterial) {
            this.screenClearMaterial.dispose();
            this.screenClearMaterial = null;
        }
    }

    protected checkResources(): boolean {
        this.checkSupport(this.UseDepthTexture);

        this.sunShaftsMaterial = this.checkShaderAndCreateMaterial(this.SunShaftsShader!, this.sunShaftsMaterial);
        this.screenClearMaterial = this.checkShaderAndCreateMaterial(this.ScreenClearShader!, this.screenClearMaterial);

        if (!this.isSupported) this.reportAutoDisable();
        return this.isSupported;
    }

    onRenderImage(source: THREE.WebGLRenderTarget, destination: THREE.WebGLRenderTarget) {
        if (!this.checkResources() || !this.sky) {
            this.renderer.setRenderTarget(destination);
            this.renderer.clear();
            this.renderer.setRenderTarget(null);
            return;
        }

        // Let the sky dome know we are here
        //this.sky.sunShafts = this;

        // Selected resolution
        let width: number, height: number;
        if (this.Resolution === SunShaftsResolution.High) {
            width = source.width;
            height = source.height;
        } else if (this.Resolution === SunShaftsResolution.Normal) {
            width = source.width / 2;
            height = source.height / 2;
        } else {
            width = source.width / 4;
            height = source.height / 4;
        }

        // Sun position
        const v = new THREE.Vector3();
        this.camera.updateMatrixWorld();
        //v.setFromMatrixPosition(this.sky.sun.matrixWorld);
        v.project(this.camera);

        this.sunShaftsMaterial!.uniforms['_BlurRadius4'].value = new THREE.Vector4(1.0, 1.0, 0.0, 0.0).multiplyScalar(this.SunShaftBlurRadius);
        this.sunShaftsMaterial!.uniforms['_SunPosition'].value = new THREE.Vector4(v.x, v.y, v.z, this.MaxRadius);

        const buffer1 = new THREE.WebGLRenderTarget(width, height);
        const buffer2 = new THREE.WebGLRenderTarget(width, height);

        // Create blocker mask
        if (this.UseDepthTexture) {
            this.renderer.setRenderTarget(buffer1);
            this.renderer.render(this.scene, this.camera);
        } else {
            this.renderer.setRenderTarget(buffer1);
            this.renderer.render(this.scene, this.camera);
        }

        // Paint a small black small border to get rid of clamping problems
        this.drawBorder(buffer1, this.screenClearMaterial!);

        // Radial blur
        let ofs = this.SunShaftBlurRadius * (1.0 / 768.0);

        this.sunShaftsMaterial!.uniforms['_BlurRadius4'].value = new THREE.Vector4(ofs, ofs, 0.0, 0.0);
        this.sunShaftsMaterial!.uniforms['_SunPosition'].value = new THREE.Vector4(v.x, v.y, v.z, this.MaxRadius);

        for (let it2 = 0; it2 < this.RadialBlurIterations; it2++) {
            this.renderer.setRenderTarget(buffer2);
            this.renderer.render(this.scene, this.camera);
            ofs = this.SunShaftBlurRadius * (((it2 * 2.0 + 1.0) * 6.0) / 768.0);
            this.sunShaftsMaterial!.uniforms['_BlurRadius4'].value = new THREE.Vector4(ofs, ofs, 0.0, 0.0);

            this.renderer.setRenderTarget(buffer1);
            this.renderer.render(this.scene, this.camera);
            ofs = this.SunShaftBlurRadius * (((it2 * 2.0 + 2.0) * 6.0) / 768.0);
            this.sunShaftsMaterial!.uniforms['_BlurRadius4'].value = new THREE.Vector4(ofs, ofs, 0.0, 0.0);
        }

        // Blend together
        const shaftsColor = this.sky.sunShaftsColor;
        const color = (v.z >= 0.0)
            ? new THREE.Vector4().fromArray(
                [shaftsColor.r, shaftsColor.g, shaftsColor.b, shaftsColor.a]
            ).multiplyScalar(this.SunShaftIntensity * (1 - this.sky.atmosphere.fogginess))
            : new THREE.Vector4(0, 0, 0, 0); // No back projection!
        this.sunShaftsMaterial!.uniforms['_SunColor'].value = color;
        this.sunShaftsMaterial!.uniforms['_ColorBuffer'].value = buffer1.texture;

        if (this.BlendMode === SunShaftsBlendMode.Screen) {
            this.renderer.setRenderTarget(destination);
            this.renderer.render(this.scene, this.camera);
        } else {
            this.renderer.setRenderTarget(destination);
            this.renderer.render(this.scene, this.camera);
        }

        buffer1.dispose();
        buffer2.dispose();
        this.renderer.setRenderTarget(null);
    }

    drawBorder(_dest: THREE.WebGLRenderTarget, _material: THREE.ShaderMaterial) {
        // Implement the border drawing logic here
    }
}