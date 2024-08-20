import {AmbientLight, Box3, GridHelper, Vector3} from "three";
import {CanvasRenderer} from "../CanvasRenderer.ts";
import {Player} from "../../physical/Player.ts";
import {loadAsync} from "../../loaders/ModelLoader.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

export class SafetyIllustrationRenderer extends CanvasRenderer {
    protected lastTime: number = 0;
    protected _transformerAABB: Box3 = new Box3();
    protected _playerAABB: Box3 = new Box3();
    public calculateDistance(): number {
        this._playerAABB.setFromObject(this._player, true);
        let distance = 0;
        for (let i = 0; i < 3; i++) {
            const min1 = this._playerAABB.min.getComponent(i);
            const max1 = this._playerAABB.max.getComponent(i);
            const min2 = this._transformerAABB.min.getComponent(i);
            const max2 = this._transformerAABB.max.getComponent(i);
            if (min1 > max2) {
                distance += Math.pow(min1 - max2, 2);
            } else if (min2 > max1) {
                distance += Math.pow(min2 - max1, 2);
            }
        }
        return Math.sqrt(distance);
    }
    public replay(radius: number = 6) {
        this._player.quaternion.setFromAxisAngle(new Vector3(0, 1, 0), 0);
        this._player.position.set(
            radius * Math.cos(-Math.PI / 4),
            0,
            radius * Math.sin(-Math.PI / 4),
        );
    }
    protected _isAnimating: boolean = false;
    public moveTowardsPlayer() {
        if(this._isAnimating) return;
        const tangent = new Vector3().copy(this._player.position);
        const center = new Vector3();
        this._transformerAABB.getCenter(center);
        tangent.sub(center);
        tangent.y = 0;
        tangent.normalize();
        console.log(tangent);
        const moveVec = new Vector3().copy(tangent).multiplyScalar(-0.01);
        this._player.playAnimation('walk');
        this._player.quaternion.setFromAxisAngle(
            new Vector3(0, 1, 0),
            Math.PI / -4
        );
        const move = () => {
            if(this.calculateDistance() < 0.1) {
                this._isAnimating = false;
                this._player.playAnimation('idle');
                return;
            }
            this._player.position.add(moveVec);
            requestAnimationFrame(move);
        };
        move();
    }
    public constructor(
        canvas: HTMLElement | OffscreenCanvas,
        bodyElement: unknown,
    ) {
        super(canvas, bodyElement);
        this.replay();
        loadAsync('/transformer.glb').then((obj) => {
            if(!obj) return;
            this._transformerAABB.setFromObject(obj, true);
            this.add(obj);
        });
        this.camera.position.set(10, 10, 10);
        const controls = new OrbitControls(this.camera, bodyElement as unknown as HTMLElement);
        controls.maxDistance = 20;
        controls.minDistance = 8;
        controls.update();
        this.add(
            new AmbientLight(),
            new GridHelper(100, 100, 0x888888, 0x444444 )
        );
        const animate = (time?: number) => {
            if(time) {
                const delta: number = 0.001 * (time - this.lastTime);
                this.lastTime = time;
                this._player.update(delta);
                this.render();
            }
            requestAnimationFrame(animate);
        };
        this.add(this._player);
        animate();
    }
    protected _player: Player = new Player('/player.glb');
}