import * as THREE from "three";
import {KeyBinds, KeyBindsEvent} from "./KeyBinds.ts";
import {RenderObject} from "../common/RenderObject.ts";
import {HalfPi, TwoPi} from "../common/Constants.ts";
import {clamp, Deg2Rad} from "../common/Helper.ts";
import {VirtualElement} from "../virtual-element/VirtualElement.ts";
import {Player} from "../physical/Player.ts";
import {ExtendedTriangle} from "three-mesh-bvh";

// 复用需要反复修改的对象，避免每次都需要新建对象带来的开销
const _vec1: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
const _vec2: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
const _vectorTo: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
const _offset: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
const _quaternion: THREE.Quaternion = new THREE.Quaternion(0, 0, 0, 1);
const _ray: THREE.Ray = new THREE.Ray();
const _plane: THREE.Plane = new THREE.Plane();
const TILT_LIMIT: number = Math.cos(70 * Deg2Rad);
const _changeEvent: Event = new Event('change');
const _savedState: Record<string, any> = {};
const _box: THREE.Box3 = new THREE.Box3();
const _mat4: THREE.Matrix4 = new THREE.Matrix4();
const _line3: THREE.Line3 = new THREE.Line3();

/**
 * 鼠标按键绑定的功能
 * @description **注意！设置鼠标按键绑定仅会在视角类型为上帝视角时生效。**
 */
export interface MouseButtons {
    left: THREE.MOUSE;
    right: THREE.MOUSE;
    middle: THREE.MOUSE;
}

/**
 * 相机视角类型
 * @enum
 */
export enum CameraViewType {
    FirstPerson = 0,
    ThirdPerson = 1,
    Spectator = 2,
}

/**
 * 相机视角类型变化事件
 * @see CameraViewType
 */
export class CameraViewTypeChangeEvent extends Event {
    public readonly viewType: CameraViewType;
    public constructor(viewType: CameraViewType) {
        super('camera-view-type');
        this.viewType = viewType;
    }
}

/**
 * 相机控制器，响应鼠标与键盘事件
 * @description 支持在第一人称、第三人称和上帝视角间切换（通过设置 `CameraViewType`）。
 * 更改按键绑定与查看默认按键绑定，请参阅 `KeyBinds` 类。<br/><br/>
 * Fork 自 Three.js 的 OrbitControls 类，去除了冗余代码并添加、修改了部分功能<br/>
 * **注意！该控制器不支持触控事件，在移动端上不受支持。**
 * @author Ryker Zhu <ryker.zhu@nuist.edu.cn>
 * @since 4th July, 2024
 * @see CameraViewType
 * @see KeyBinds
 */
export class CameraControls extends RenderObject implements Disposable {
    protected _camera: THREE.PerspectiveCamera;
    protected _eventEmitter: HTMLElement | VirtualElement;
    protected _cameraType: CameraViewType = CameraViewType.Spectator;
    protected _cameraTypeChanged: boolean = false;
    protected _enabled: boolean = false;
    protected _state = {
        forwards: 0,
        backwards: 0,
        left: 0,
        right: 0,
        operation: -1,
    };
    // @ts-ignore
    protected _keyBinds: KeyBinds;

    public minPolarAngle: number = 0;
    public maxPolarAngle: number = Math.PI;

    protected _player?: Player;
    public set player(value: Player) {
        this._player = value;
        if(this._cameraType === CameraViewType.Spectator) {
            this._player.visible = false;
        }
        this.animatePlayerAnimation();
    }

    public isPlayerGrounded: boolean = false;
    public collider?: THREE.Mesh;

    public readonly target: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    public readonly cursor: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    public readonly mouseButtons: MouseButtons = {
        left: THREE.MOUSE.PAN,
        middle: THREE.MOUSE.DOLLY,
        right: THREE.MOUSE.ROTATE,
    };
    public keyPanSpeed: number = 0.5;
    public panSpeed: number = 1;
    public zoomSpeed: number = 1;
    public rotateSpeed: number = 1;
    public minAzimuthAngle: number = -Infinity; // radians
    public maxAzimuthAngle: number = Infinity; // radians
    public minDistance: number = 0;
    public maxDistance: number = Infinity;
    public minTargetRadius: number = 0;
    public maxTargetRadius: number = Infinity;

    protected _zoomEnabled: boolean = true;
    protected _panEnabled: boolean = true;
    protected _rotateEnabled: boolean = true;
    protected _keyPanInProgress: boolean = false;
    protected _scale: number = 1;
    protected _mouse: THREE.Vector2 = new THREE.Vector2(0, 0);
    protected _dollyDirection: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    protected _panOffset: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    protected _start: THREE.Vector2 = new THREE.Vector2(0, 0);
    protected _end: THREE.Vector2 = new THREE.Vector2(0, 0);
    protected _delta: THREE.Vector2 = new THREE.Vector2(0, 0);
    protected _cursorZoom: boolean = false;
    protected _spherical: THREE.Spherical = new THREE.Spherical(0, 0, 0);
    protected _sphericalDelta: THREE.Spherical = new THREE.Spherical(0, 0, 0);
    protected _lastPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    protected _lastQuaternion: THREE.Quaternion = new THREE.Quaternion(0, 0, 0, 1);
    protected _lastTargetPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

    public set isZoomEnabled(value: boolean) {
        this._zoomEnabled = value;
    }
    public get isZoomEnabled(): boolean {
        return this._enabled && CameraViewType.Spectator === this._cameraType && this._zoomEnabled;
    }
    public set isPanEnabled(value: boolean) {
        this._panEnabled = value;
    }
    public get isPanEnabled(): boolean {
        return this._enabled && CameraViewType.Spectator === this._cameraType && this._panEnabled;
    }

    protected updateMouse(x: number, y: number) {
        this._cursorZoom = true;
        const rect = this._eventEmitter.getBoundingClientRect();
        const dx: number = x - rect.left;
        const dy: number = y - rect.top;
        const w: number = rect.width;
        const h: number = rect.height;
        this._mouse.set((dx / w) * 2 - 1, -(dy / h) * 2 + 1);
        this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this._camera)
            .sub(this._camera.position).normalize();
    }

    private lastTime: number = 0;

    protected animatePan(time?: number) {
        if(this._keyPanInProgress) {
            if(time) {
                const delta: number = 0.001 * (time - this.lastTime);
                if(delta > 0) {
                    this.lastTime = time;
                    const factor: number = this.keyPanSpeed / delta;
                    this.pan(
                        factor * (this._state.left - this._state.right),
                        factor * (this._state.forwards - this._state.backwards),
                    );
                    this.update();
                }
            }
            requestAnimationFrame(this.animatePan.bind(this));
        } else {
            this._state.operation = -1;
        }
    }

    protected isInMovement(): boolean {
        return this._state.left > 0 || this._state.right > 0
            || this._state.backwards > 0 || this._state.forwards > 0;
    }

    public get keyBinds(): KeyBinds {
        return this._keyBinds;
    }

    public set keyBinds(keyBinds: KeyBinds) {
        this._keyBinds = keyBinds;
        this._keyBinds.addEventListener('key-binds', evt => {
            const event = (evt as KeyBindsEvent);
            switch(event.bindName) {
                default: return;
                case 'toggleCamera': {
                    this.toggleCamera();
                    return;
                }
                case 'strafeLeft': {
                    this._state.left = event.isDown ? 1 : 0;
                    if(this._player && this._cameraType !== CameraViewType.Spectator) {
                        if(event.isDown) {
                            this._player.playAnimation('walkLeft');
                        } else if(!this.isInMovement()) {
                            this._player.playAnimation('idle');
                        }
                    }
                    break;
                }
                case 'strafeRight': {
                    this._state.right = event.isDown ? 1 : 0;
                    if(this._player && this._cameraType !== CameraViewType.Spectator) {
                        if(event.isDown) {
                            this._player.playAnimation('walkRight');
                        } else if(!this.isInMovement()) {
                            this._player.playAnimation('idle');
                        }
                    }
                    break;
                }
                case 'walkForwards': {
                    this._state.forwards = event.isDown ? 1 : 0;
                    if(this._player && this._cameraType !== CameraViewType.Spectator) {
                        if(event.isDown) {
                            this._player.playAnimation('walk');
                        } else if(!this.isInMovement()) {
                            this._player.playAnimation('idle');
                        }
                    }
                    break;
                }
                case 'walkBackwards': {
                    this._state.backwards = event.isDown ? 1 : 0;
                    if(this._player && this._cameraType !== CameraViewType.Spectator) {
                        if(event.isDown) {
                            this._player.playAnimation('walk');
                        } else if(!this.isInMovement()) {
                            this._player.playAnimation('idle');
                        }
                    }
                    break;
                }
            }
            if(this._cameraType === CameraViewType.Spectator) {
                if(event.isDown) {
                    if((this._keyPanInProgress = this.isPanEnabled && this.isInMovement())) {
                        this._state.operation = THREE.MOUSE.PAN;
                        this.animatePan();
                    }
                } else if(!this.isInMovement()) {
                    this._keyPanInProgress = false;
                    this._state.operation = -1;
                }
            }
        });
    }
    public updatePlayer(delta: number): void {
        // 仅当存在玩家对象时更新玩家对象的位置
        if(!this._player || !this._player.visible) return;
        _vec1.set(
            this._state.right - this._state.left,
            0,
            this._state.backwards - this._state.forwards
        ).applyAxisAngle(_vectorTo, this._spherical.theta);
        this._player.position.addScaledVector(_vec1, this._player.speed * delta);
        this._player.updateMatrixWorld();
        // 如果指定了碰撞检测器则进行碰撞检测
        if(this.collider) {
            // 计算玩家对象的包围盒
            _box.makeEmpty();
            _mat4.copy(this.collider.matrixWorld).invert();
            _line3.copy(this._player.segment);
            _line3.start.applyMatrix4(this._player.matrixWorld).applyMatrix4(_mat4);
            _line3.end.applyMatrix4(this._player.matrixWorld).applyMatrix4(_mat4);
            _box.expandByPoint(_line3.start);
            _box.expandByPoint(_line3.end);
            const radius: number = this._player.radius;
            _box.min.addScalar(-radius);
            _box.max.addScalar(radius);
            // @ts-ignore
            this.collider.geometry.boundsTree?.shapecast({
                intersectsBounds: (box: THREE.Box3) => box.intersectsBox(_box),
                intersectsTriangle: (triangle: ExtendedTriangle) => {
                    const distance: number = triangle.closestPointToSegment(_line3, _vec1, _vec2);
                    if(distance < radius) {
                        const depth: number = radius - distance;
                        const direction: THREE.Vector3 = _vec2.sub(_vec1).normalize();
                        _line3.start.addScaledVector(direction, depth);
                        _line3.end.addScaledVector(direction, depth);
                    }
                },
            });
            _vec1.copy(_line3.start).applyMatrix4(this.collider.matrixWorld);
            _vec2.subVectors(_vec1, this._player.position);
            _vec2.y = 0;
            this.isPlayerGrounded = _vec2.y > Math.abs(delta * this._player.velocity.y * 0.25);
            const offset = Math.max(0, _vec2.length() - 1e-5);
            _vec2.normalize().multiplyScalar(offset);
            this._player.position.add(_vec2);
            if(this.isPlayerGrounded) {
                this._player.velocity.set(0, 0, 0);
            } else {
                _vec2.normalize();
                this._player.velocity.addScaledVector(_vec2, -_vec2.dot(this._player.velocity));
            }
        }
        this._camera.position.sub(this.target);
        _vec1.copy(this._player.position);
        if(this._cameraType === CameraViewType.FirstPerson) {
            _vec1.y += 1.7;
        } else if(this._cameraType === CameraViewType.ThirdPerson) {
            _vec2.set(0, 3, -3);
            _vec1.add(_vec2);
        }
        this.target.copy(_vec1);
        this._camera.position.add(this.target);
    }
    protected animatePlayerAnimation(time?: number): void {
        if(time && this._player && this._player.visible) {
            const delta: number = 0.001 * (time - this.lastTime);
            this.lastTime = time;
            if(delta > 0) {
                if(this.isInMovement()) {
                    this.updatePlayer(delta / this._player.step);
                }
                if(this._cameraTypeChanged) {
                    this._cameraTypeChanged = false;
                    this.updatePlayer(delta / this._player.step);
                }
                this._player.update(delta);
                this.dispatchEvent(_changeEvent);
            }
        }
        requestAnimationFrame(this.animatePlayerAnimation.bind(this));
    }
    public toggleCamera(): void {
        let type: CameraViewType;
        if(this._cameraType === CameraViewType.Spectator) {
            type = CameraViewType.FirstPerson;
        } else {
            type = this._cameraType + 1;
        }
        this.cameraViewType = type;
    }
    public pan(deltaX: number, deltaY: number): void {
        _offset.copy(this._camera.position).sub(this.target);
        const targetDistance = _offset.length() * Math.tan(this._camera.fov / 2 * Deg2Rad);
        const element = this._eventEmitter;
        const matrix: THREE.Matrix4 = this._camera.matrix;
        // Pan left
        if(deltaX !== 0) {
            this._panOffset.add(_vec1.setFromMatrixColumn(matrix, 0)
                .multiplyScalar(-2 * deltaX * targetDistance / element.clientHeight));
        }
        // Pan up
        if(deltaY !== 0) {
            this._panOffset.add(_vec1.setFromMatrixColumn(matrix, 0).crossVectors(this._camera.up, _vec1)
                .multiplyScalar(2 * deltaY * targetDistance / element.clientHeight)
            );
        }
    }

    public set cameraViewType(type: CameraViewType) {
        if(this._cameraType === type) return;
        if(type === CameraViewType.Spectator) {
            // 从第一或第三人称切换到上帝视角时，恢复状态
            this.maxPolarAngle = _savedState['maxPolarAngle'];
            delete _savedState['maxPolarAngle'];
            // 把相机移开
            this._camera.position.sub(this.target).normalize().multiplyScalar(50).add(this.target);
            // 不显示玩家对象
            if(this._player) {
                this._player.visible = false;
            }
        } else {
            this._cameraTypeChanged = true;
        }
        if(this._cameraType === CameraViewType.Spectator) {
            // 从上帝视角切换到第一或第三人称时，保存状态
            _savedState['maxPolarAngle'] = this.maxPolarAngle;
            this.maxPolarAngle = Math.PI;
            if(this._player) {
                this._player.visible = true;
                this._sphericalDelta.set(0, HalfPi, Math.PI);
                this.target.copy(this._player.position);
                this._camera.position.copy(this.target);
            }
        }
        this._cameraType = type;
        this.dispatchEvent(new CameraViewTypeChangeEvent(this._cameraType));
        this.update();
    }
    public get cameraViewType(): CameraViewType {
        return this._cameraType;
    }

    public constructor(camera: THREE.PerspectiveCamera, eventEmitter: HTMLElement | VirtualElement) {
        super();
        this._camera = camera;
        this._eventEmitter = eventEmitter;
        this.keyBinds = new KeyBinds();
        this.isEnabled = true;
    }

    protected keyUpEvent(event: KeyboardEvent): void {
        this._keyBinds.eventHandler(event);
    }
    protected keyDownEvent(event: KeyboardEvent): void {
        this._keyBinds.eventHandler(event);
    }
    protected handleDolly(deltaY: number): void {
        const zoomScale: number = Math.pow(0.95, this.zoomSpeed * Math.abs(deltaY * 0.01));
        if(deltaY < 0) {
            this._scale *= zoomScale;
        } else if (deltaY > 0) {
            this._scale /= zoomScale;
        }
    }
    protected wheelEvent(event: WheelEvent): void {
        if (!this.isZoomEnabled) return;
        let deltaY: number;
        switch (event.deltaMode) {
            case 1: {
                deltaY = event.deltaY * 16;
                break;
            }
            case 2: {
                deltaY = event.deltaY * 100;
                break;
            }
            default: {
                deltaY = event.deltaY;
                break;
            }
        }
        if(event.ctrlKey) {
            deltaY *= 10;
        }
        this.updateMouse(event.clientX, event.clientY);
        this.handleDolly(deltaY);
        this.update();
    }
    protected pointerMoveEvent(event: PointerEvent): void {
        if(!this._enabled) return;
        this._end.set(event.clientX, event.clientY);
        this._delta.subVectors(this._end, this._start);
        if(this._cameraType === CameraViewType.Spectator) {
            switch (this._state.operation) {
                default: return;
                case THREE.MOUSE.PAN: {
                    if(!this._panEnabled) return;
                    this._delta.multiplyScalar(this.panSpeed);
                    this.pan(this._delta.x, this._delta.y);
                    break;
                }
                case THREE.MOUSE.DOLLY: {
                    if(!this._zoomEnabled) return;
                    this.handleDolly(this._delta.y);
                    break;
                }
                case THREE.MOUSE.ROTATE: {
                    if(!this._rotateEnabled) return;
                    this._delta.multiplyScalar(this.rotateSpeed);
                    const height: number = this._eventEmitter.clientHeight;
                    this._sphericalDelta.theta -= TwoPi * this._delta.x / height;
                    this._sphericalDelta.phi -= TwoPi * this._delta.y / height;
                    break;
                }
            }
        } else {
            const height: number = this._eventEmitter.clientHeight;
            this._sphericalDelta.theta -= TwoPi * this._delta.x / height;
            this._sphericalDelta.phi -= TwoPi * this._delta.y / height;
        }
        this._start.copy(this._end);
        this.update();
    }
    protected pointerDownEvent(event: PointerEvent): void {
        if(!this._enabled && this._cameraType !== CameraViewType.Spectator) return;
        this._eventEmitter.setPointerCapture(event.pointerId);
        switch (event.button) {
            case 0:
                this._state.operation = this.mouseButtons.left;
                break;
            case 1:
                this._state.operation = this.mouseButtons.middle;
                break;
            case 2:
                this._state.operation = this.mouseButtons.right;
                break;
            default:
                this._state.operation = -1;
        }
        switch (this._state.operation) {
            case THREE.MOUSE.DOLLY: {
                if (!this._zoomEnabled) return;
                const val: number = event.clientX;
                this.updateMouse(val, val);
                break;
            }
            case THREE.MOUSE.ROTATE:
                if (event.ctrlKey || event.metaKey || event.shiftKey) {
                    if (!this._panEnabled) return;
                    this._state.operation = THREE.MOUSE.PAN;
                } else {
                    if (!this._rotateEnabled) return;
                    this._state.operation = THREE.MOUSE.ROTATE;
                }
                break;
            case THREE.MOUSE.PAN:
                if (event.ctrlKey || event.metaKey || event.shiftKey) {
                    if (!this._rotateEnabled) return;
                    this._state.operation = THREE.MOUSE.ROTATE;
                } else {
                    if (!this._panEnabled) return;
                    this._state.operation = THREE.MOUSE.PAN;
                }
                break;
            default:
                this._state.operation = -1;
        }
        this._start.set(event.clientX, event.clientY);
    }
    protected pointerUpEvent(event: PointerEvent): void {
        this._eventEmitter.releasePointerCapture(event.pointerId);
        this._state.operation = -1;
    }
    protected pointerLockChangeEvent(): void {
        if(document.pointerLockElement) {
            this.dispatchEvent(new Event('pointer-lock'));
        } else {
            this.dispatchEvent(new Event('pointer-unlock'));
        }
    }
    protected pointerLockErrorEvent(): void {
        console.warn('Error locking pointer');
    }
    protected contextMenuEvent(event: MouseEvent): void {
        event.preventDefault();
    }

    public set isEnabled(value: boolean) {
        if(value) {
            this.onEnable();
        } else {
            this.onDisable();
        }
        this._enabled = value;
    }
    public get isEnabled(): boolean {
        return this._enabled;
    }

    public onDisable(): void {
        const element = this._eventEmitter as HTMLElement;
        element.removeEventListener('keyup', this.keyUpEvent.bind(this));
        element.removeEventListener('keydown', this.keyDownEvent.bind(this));
        element.removeEventListener('wheel', this.wheelEvent.bind(this));
        element.removeEventListener('pointermove', this.pointerMoveEvent.bind(this));
        element.removeEventListener('pointerup', this.pointerUpEvent.bind(this));
        element.removeEventListener('pointerdown', this.pointerDownEvent.bind(this));
        element.removeEventListener('pointercancel', this.pointerUpEvent.bind(this));
        element.removeEventListener('pointerlockchange', this.pointerLockChangeEvent.bind(this));
        element.removeEventListener('pointerlockerror', this.pointerLockErrorEvent.bind(this));
        element.removeEventListener('contextmenu', this.contextMenuEvent.bind(this));
    }

    public onEnable(): void {
        const element = this._eventEmitter as HTMLElement;
        element.addEventListener('keyup', this.keyUpEvent.bind(this));
        element.addEventListener('keydown', this.keyDownEvent.bind(this));
        element.addEventListener('wheel', this.wheelEvent.bind(this));
        element.addEventListener('pointermove', this.pointerMoveEvent.bind(this));
        element.addEventListener('pointerup', this.pointerUpEvent.bind(this));
        element.addEventListener('pointerdown', this.pointerDownEvent.bind(this));
        element.addEventListener('pointercancel', this.pointerUpEvent.bind(this));
        element.addEventListener('pointerlockchange', this.pointerLockChangeEvent.bind(this));
        element.addEventListener('pointerlockerror', this.pointerLockErrorEvent.bind(this));
        element.addEventListener('contextmenu', this.contextMenuEvent.bind(this));
    }

    public override update(): void {
        _quaternion.setFromUnitVectors(this._camera.up, _vectorTo);
        _offset.copy(this._camera.position).sub(this.target);
        _offset.applyQuaternion(_quaternion);
        this._spherical.setFromVector3(_offset);
        this._spherical.theta += this._sphericalDelta.theta;
        this._spherical.phi += this._sphericalDelta.phi;
        let min: number = this.minAzimuthAngle;
        let max: number = this.maxAzimuthAngle;
        if (isFinite(min) && isFinite(max)) {
            if (min < -Math.PI) min += TwoPi; else if (min > Math.PI) min -= TwoPi;
            if (max < -Math.PI) max += TwoPi; else if (max > Math.PI) max -= TwoPi;
            const minTheta: number = Math.min(min, max);
            const maxTheta: number = Math.max(min, max);
            this._spherical.theta = clamp(this._spherical.theta, minTheta, maxTheta);
        }
        this._spherical.phi = clamp(this._spherical.phi, this.minPolarAngle, this.maxPolarAngle);
        this._spherical.makeSafe();
        this.target.add(this._panOffset)
            .sub(this.cursor).clampLength(this.minTargetRadius, this.maxTargetRadius).add(this.cursor);
        let zoomChanged: boolean = false;
        if(this._cameraType === CameraViewType.Spectator) {
            if(this._cursorZoom) {
                this._spherical.radius = clamp(this._spherical.radius, this.minDistance, this.maxDistance);
            } else {
                const prevRadius: number = this._spherical.radius;
                this._spherical.radius = clamp(this._spherical.radius * this._scale,
                    this.minDistance, this.maxDistance);
                zoomChanged = prevRadius !== this._spherical.radius;
            }
        } else {
            this._spherical.radius = 1e-4;
        }
        _offset.setFromSpherical(this._spherical);
        _offset.applyQuaternion(_quaternion.invert());
        this._camera.position.copy(this.target).add(_offset);
        this._camera.lookAt(this.target);
        this._sphericalDelta.set(0, 0, 0);
        this._panOffset.set(0, 0, 0);
        if(this._cursorZoom) {
            const prevRadius: number = _offset.length();
            const newRadius: number = clamp(prevRadius * this._scale, this.minDistance, this.maxDistance);
            const radiusDelta: number = prevRadius - newRadius;
            this._camera.position.addScaledVector(this._dollyDirection, radiusDelta);
            this._camera.updateMatrixWorld();
            zoomChanged = !!radiusDelta;
            if(this._cameraType === CameraViewType.Spectator) {
                _ray.origin.copy(this._camera.position);
                _ray.direction.set(0, 0, -1).transformDirection(this._camera.matrix);
                if(Math.abs(this._camera.up.dot(_ray.direction)) < TILT_LIMIT) {
                    this._camera.lookAt(this.target);
                } else {
                    _plane.setFromNormalAndCoplanarPoint(this._camera.up, this.target);
                    _ray.intersectPlane(_plane, this.target);
                }
            } else {
                this.target.set(0, 0, -1).transformDirection(this._camera.matrix)
                    .multiplyScalar(newRadius).add(this._camera.position);
            }
        }
        this._scale = 1;
        this._cursorZoom = false;
        if(zoomChanged ||
            this._lastPosition.distanceToSquared(this._camera.position) > 0.000001 ||
            8 * (1 - this._lastQuaternion.dot(this._camera.quaternion)) > 0.000001 ||
            this._lastTargetPosition.distanceToSquared(this.target) > 0.000001) {
            this.dispatchEvent(_changeEvent);
            this._lastPosition.copy(this._camera.position);
            this._lastQuaternion.copy(this._camera.quaternion);
            this._lastTargetPosition.copy(this.target);
        }
    }

    [Symbol.dispose](): any {
        this.onDisable();
    }
}