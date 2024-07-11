export abstract class RenderObject extends EventTarget {
    private _prevTime: number = performance.now();
    protected timeDelta(): number {
        const now = performance.now();
        const delta = (now - this._prevTime) / 1000;
        this._prevTime = now;
        return delta;
    }
    public abstract update(deltaTime?: number): void;
    public onEnable(): void {}
    public onDisable(): void {}
}