import * as THREE from 'three';
import {RenderObject} from "../common/RenderObject.ts";

// Post Effects Base Class
export abstract class PostEffectsBase extends RenderObject {
    protected isSupported: boolean = true;
    protected camera: THREE.Camera;
    protected renderer: THREE.WebGLRenderer;

    protected constructor(camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
        super();
        this.camera = camera;
        this.renderer = renderer;
        this.onEnable();
        this.checkResources();
    }

    protected abstract checkResources(): boolean;

    protected checkShaderAndCreateMaterial(
        shader: THREE.ShaderLibShader,
        material: THREE.ShaderMaterial | null
    ): THREE.ShaderMaterial | null {
        if (!shader) {
            console.error("Missing shader in " + this.toString());
            this.isSupported = false;
            return null;
        }

        if (shader && material && material.uniforms
            && material.vertexShader === shader.vertexShader
            && material.fragmentShader === shader.fragmentShader) {
            return material;
        }

        material = new THREE.ShaderMaterial({
            uniforms: shader.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
        });

        if (!material) {
            this.notSupported();
            console.error("The shader " + shader.toString() + " on effect " + this.toString() + " is not supported on this platform!");
            return null;
        }

        return material;
    }

    protected createMaterial(shader: THREE.ShaderLibShader, material: THREE.ShaderMaterial | null): THREE.ShaderMaterial | null {
        if (!shader) {
            console.error("Missing shader in " + this.toString());
            return null;
        }

        if (material && material.uniforms && material.vertexShader === shader.vertexShader && material.fragmentShader === shader.fragmentShader) {
            return material;
        }

        material = new THREE.ShaderMaterial({
            uniforms: shader.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
        });

        if (!material) {
            return null;
        }

        return material;
    }

    onEnable() {
        this.isSupported = true;
    }

    protected checkSupport(needDepth: boolean): boolean {
        this.isSupported = true;

        // Check for WebGL support
        if (!this.renderer.capabilities.isWebGL2) {
            this.notSupported();
            return false;
        }

        if (needDepth && !this.renderer.capabilities.isWebGL2) {
            this.notSupported();
            return false;
        }

        return true;
    }

    protected reportAutoDisable() {
        console.warn("The image effect " + this.toString() + " has been disabled as it's not supported on the current platform.");
    }

    protected notSupported() {
        this.isSupported = false;
        return;
    }

    protected drawBorder(_dest: THREE.WebGLRenderTarget, _material: THREE.ShaderMaterial) {
        // Implement the border drawing logic here
    }
}