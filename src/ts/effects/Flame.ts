import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry, Clock,
    Color,
    Object3D, Points,
    RepeatWrapping,
    ShaderMaterial
} from "three";

import {ThreeContext} from "../common/Types.ts";
import {TextureLoader} from "../loaders/TextureLoader.ts";
import FlameVertShader from './shaders/Flame.vert';
import FlameFragShader from './shaders/Flame.frag';
import {Deg2Rad} from "../common/Helper.ts";

export class Flame extends Object3D {
    override readonly type: string | 'Flame' = 'Flame';

    protected _context: ThreeContext;
    protected _radius: number;
    protected _height: number;
    protected _pos: Float32Array;
    protected _random: Float32Array;
    protected _sprite: Float32Array;

    constructor(
        context: ThreeContext,
        radius: number = 0.25,
        height: number = 3,
        particleCount: number = 1024,
    ) {
        super();
        this._context = context;
        this._radius = radius;
        this._height = height;
        this.name = 'flame';
        this._pos = new Float32Array(particleCount * 3);
        this._random = new Float32Array(particleCount);
        this._sprite = new Float32Array(particleCount);

        new TextureLoader().loadAsync('/textures/fire.png').then(texture => {
            const clock = new Clock();
            texture.wrapS = texture.wrapT = RepeatWrapping;
            const uniforms = {
                color: { value: new Color(0xff2200) },
                size: { value: 6 },
                map: { value: texture },
                time: { value: 0 },
                heightOfNearPlane: {
                    value: Math.abs(height / (2 * Math.tan(Deg2Rad * context.camera.fov * 0.5)))
                }
            };
            // Material
            const material = new ShaderMaterial({
                uniforms,
                vertexShader: FlameVertShader,
                fragmentShader: FlameFragShader,
                blending: AdditiveBlending,
                depthTest: true,
                //depthWrite: false,
                transparent: true,
            });
            // Geometry
            const geometry = new BufferGeometry();
            const halfHeight = height * 0.5;
            this._pos[0] = this._pos[1] = this._pos[2] = 0;
            for(let i = 1; i < particleCount; i++) {
                const r = Math.sqrt(Math.random()) * radius;
                const angle = Math.random() * 2 * Math.PI;
                this._pos[ 3 * i ] = Math.cos(angle) * r;
                this._pos[ 3 * i + 1 ] = (radius - r) / radius * halfHeight + halfHeight;
                this._pos[ 3 * i + 2 ] = Math.sin(angle) * r;
                this._random[i] = Math.random();
            }
            geometry.setAttribute('position', new BufferAttribute(this._pos, 3));
            geometry.setAttribute('random', new BufferAttribute(this._random, 1));
            // Point
            const mesh = new Points(geometry, material);
            mesh.position.set(0,0,0);
            this.add(mesh);
            const animate = () => {
                const delta = clock.getDelta();
                material.uniforms.time.value = ( material.uniforms.time.value + delta ) % 1;
                material.needsUpdate = true;
                this._context.renderer.render(this._context.scene, this._context.camera);
                requestAnimationFrame(animate);
            };
            animate.bind(this);
            animate();
        });
    }
}