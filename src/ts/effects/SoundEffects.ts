import * as THREE from 'three';

/**
 * 声音类型
 * @enum
 */
export enum SoundType {
    // 仅在需要时被播放
    OnlyOnce = 0,
    // 不断重复地被播放
    Repeating = 1,
}

export enum SoundLocation {
    // 环境音
    Ambient = 0,
    // 空间音
    Spatial = 1
}

export interface Sound {
    type?: SoundType;
    location?: SoundLocation;
    name: string;
    source: string;
    volume?: number;
    position?: THREE.Vector3;
}

class SoundObject {
    info: Sound;
    listener: THREE.AudioListener;
    audio: THREE.Audio<PannerNode> | THREE.PositionalAudio;

    constructor(sound: Sound, listener: THREE.AudioListener) {
        this.info = sound;
        this.listener = listener;
        if((sound.location ?? SoundLocation.Ambient) === SoundLocation.Spatial) {
            this.audio = new THREE.PositionalAudio(listener);
        } else {
            this.audio = new THREE.Audio(listener);
        }
    }

    bindTo(obj: THREE.Object3D) {
        obj.add(this.audio);
    }
}

/**
 * 音效
 * @class
 * @description 注意！该类使用了 Web Audio API，故不支持在 Web Worker 上下文中使用。
 */
export class SoundEffects {
    protected data: {
        context: AudioContext,
        camera?: THREE.Camera,
        sounds: Record<string, SoundObject>,
        loader: THREE.AudioLoader
    } = {
        context: new AudioContext(),
        sounds: {},
        loader: new THREE.AudioLoader()
    };

    /**
     * 向场景添加一个音效
     * @param sound 音效
     */
    addSound(...sound: Sound[]): void {
        sound.forEach(o => {
            this.data.loader.loadAsync(o.source).then((value: AudioBuffer) => {
                if(this.data.camera) {
                    const listener: THREE.AudioListener = new THREE.AudioListener;
                    const obj = new SoundObject(o, listener);
                    obj.audio.setBuffer(value);
                    obj.audio.setLoop((o.type ?? SoundType.OnlyOnce) === SoundType.Repeating);
                    obj.audio.setVolume(o.volume ?? 10);
                    this.data.sounds[o.name] = obj;
                    this.data.camera.add(listener);
                } else {
                    throw new Error('You cannot add a sound effect to a non-existing camera');
                }
            });
        });
    }

    removeSound(...name: string[]): void {
        name.forEach(value => {
            const obj: SoundObject = this.data.sounds[value];
            if(obj) {
                obj.audio.stop();
                this.data.camera?.remove(obj.listener);
                delete this.data.sounds[value];
            }
        });
    }

    constructor(camera: THREE.Camera) {
        this.data.camera = camera;
        this.addSound(
            ...['electricity', 'explosion', 'fire', 'rainfall', 'thunder', 'warning']
            .map<Sound>((value: string): Sound => ({
                name: value, source: `/audio/${value}.mp3`,
                location: SoundLocation.Spatial
            }))
        );
    }

    play(name: string, delay?: number): void {
        const audio =  this.data.sounds[name]?.audio;
        if(audio && !audio.isPlaying) audio.play(delay);
    }

    placeSoundAt(name: string, position: THREE.Vector3): void {
        const obj = this.data.sounds[name];
        if(obj) {
            obj.audio.position.set(position.x, position.y, position.z);
            obj.audio.updateMatrixWorld();
        }
    }

    setSoundType(name: string, type: SoundType): void {
        this.data.sounds[name]?.audio.setLoop(type === SoundType.Repeating);
    }

    bindToObject(name: string, ...obj: THREE.Object3D[]): void {
        obj.forEach(
            (value: THREE.Object3D) => this.data.sounds[name]?.bindTo(value)
        );
    }
}