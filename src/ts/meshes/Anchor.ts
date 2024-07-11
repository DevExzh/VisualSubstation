import * as THREE from 'three';
import {createLinearGradientBitmap, createTextImageBitmap, GradientDirection} from "../common/ImageUtils.ts";
import {TextureLoader} from "../loaders/TextureLoader.ts";

const textureLoader = new TextureLoader();

export class Anchor extends THREE.Object3D {
    private _border: THREE.Mesh = new THREE.Mesh(
        new THREE.PlaneGeometry,
        new THREE.MeshStandardMaterial({
            transparent: true
        })
    );
    private _radius: number = 0.5;
    private _lightSprite: THREE.Sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        sizeAttenuation: false
    }));
    private _textSprite: THREE.Sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        sizeAttenuation: false
    }));
    private _lightHeight: number = 4;
    private _text: string = '';
    private _textColor: string = '';

    public set lightHeight(value: number) {
        this._lightHeight = value;
        createLinearGradientBitmap(
            this._radius * 128,
            this._lightHeight * 128,
            GradientDirection.BottomToTop,
            [
                {offset: 0, color: 'rgba(100%, 100%, 100%, 0%)'},
                {offset: 0.5, color: 'rgba(100%, 100%, 100%, 60%)'},
            ]
        ).then(img => {
            this._lightSprite.material.map = new THREE.CanvasTexture(img);
            this._lightSprite.scale.set(1/32, 1/8, 1);
            this._lightSprite.center.set(0.5, 0);
            this._lightSprite.rotation.set(1, 1, 1);
            this._lightSprite.position.set(
                this._border.position.x,
                this._border.position.y,
                this._border.position.z,
            );
        });
    }
    public get lightHeight(): number {
        return this._lightHeight;
    }
    public set radius(value: number) {
        this._radius = value;
        this._border.geometry = new THREE.PlaneGeometry(this._radius * 2, this._radius * 2);
    }
    public get radius(): number {
        return this._radius;
    }
    public set text(value: string) {
        this._text = value;
        this.updateText();
    }
    public get text(): string {
        return this._text;
    }
    public set textColor(value: string) {
        this._textColor = value;
        this.updateText();
    }
    public get textColor(): string {
        return this._textColor;
    }
    constructor(
        text: string,
        textColor: string = 'white',
        radius: number = 0.75,
        lightHeight: number = 10,
    ) {
        super();
        this._border.rotateX(-Math.PI / 2);
        this.text = text;
        this.radius = radius;
        this.lightHeight = lightHeight;
        this.textColor = textColor;
        this.add(this._border, this._lightSprite);
        textureLoader.loadAsync('/images/futuristic-digital-border.png')
            .then(texture => {
                (this._border.material as THREE.MeshStandardMaterial).map = texture;
            });
    }

    protected updateText() {
        const width = this._radius * 128, height = this._lightHeight * 256;
        createTextImageBitmap(
            this._text, width, height,
            'horizontal',
            'Courier New',
            'white'
        )
            .then(img => new THREE.CanvasTexture(img))
            .then(texture => {
                this._textSprite.material.map = texture;
                this._textSprite.position.set(
                    this._border.position.x,
                    this._border.position.y,
                    this._border.position.z,
                );
            });
    }
}