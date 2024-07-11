import * as TWEEN from "@tweenjs/tween.js";
import {CanvasRenderer} from "../renderers/CanvasRenderer.ts";
import {v4} from "uuid";

export interface AnimatableObject {
    animation: TWEEN.Tween<any>;
    id?: string;
}

export class Animations {
    protected _animating: boolean = false;
    protected _animations: Record<string, TWEEN.Tween<any>> = {};
    protected _renderer?: CanvasRenderer;

    constructor(renderer?: CanvasRenderer) {
        this._renderer = renderer;
    }

    public start(...animations: AnimatableObject[]) {
        if(animations.length === 0) return;
        this._animating = true;
        animations.forEach(o => {
            this._animations[o.id ?? v4()] = o.animation;
        });
        this.animate();
    }

    public animationFromId(id: string): TWEEN.Tween<any> {
        if(id in this._animations) {
            return this._animations[id];
        } else {
            throw new Error('animation does not exist');
        }
    }

    protected animate(time?: number) {
        if(this._animating) {
            (async () => {
                let hasObjects: boolean = false;
                const updates: Promise<void>[] = [];
                for(const name in this._animations) {
                    updates.push((async (): Promise<void> => {
                        if(!this._animations[name].isPlaying() && !this._animations[name].isPaused()) {
                            delete this._animations[name];
                        } else {
                            this._animations[name].update(time);
                        }
                    })());
                    hasObjects = true;
                }
                if(!hasObjects) this._animating = false;
                await Promise.all(updates);
            })();
            this._renderer?.render();
            requestAnimationFrame(this.animate.bind(this));
        }
    }
}