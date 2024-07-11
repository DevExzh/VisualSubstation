import {Color, Euler, Vector3} from "three";
import Color4 from "three/examples/jsm/renderers/common/Color4.js";

export const Deg2Rad = Math.PI / 180;
export const Rad2Deg = 180 / Math.PI;

/**
 * 线性插值
 * @param a 初值
 * @param b 终值
 * @param t 时间，应当是 [0, 1] 区间内的数
 */
export function lerp(a: number, b: number, t: number): number {
    return ( 1 - t ) * a + t * b;
}

export function deltaTime(): number {
    return 1 / 60;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

export function clamp01(value: number): number {
    return Math.min(Math.max(value, 0), 1);
}

export function powRgb(color: Color, pow: number): Color {
    return new Color(Math.pow(color.r, pow), Math.pow(color.g, pow), Math.pow(color.b, pow));
}

export function powRgb4(color: Color4, pow: number): Color4 {
    return new Color4(Math.pow(color.r, pow), Math.pow(color.g, pow), Math.pow(color.b, pow), color.a);
}

export function powRgba(color: Color4, pow: number): Color4 {
    return new Color4(Math.pow(color.r, pow), Math.pow(color.g, pow), Math.pow(color.b, pow), Math.pow(color.a, pow));
}

/**
 * 求向量的逆
 * @description 每个分量取倒数
 * @param fromVector 源向量
 */
export function inverseVector(fromVector: Vector3): Vector3 {
    return new Vector3(1 / fromVector.x, 1 / fromVector.y, 1 / fromVector.z);
}

export function scaleVectors(vectorA: Vector3, vectorB: Vector3): Vector3 {
    return new Vector3(
        vectorA.x * vectorB.x,
        vectorA.y * vectorB.y,
        vectorA.z * vectorB.z
    );
}

/**
 * 将球面坐标转换成局部笛卡尔坐标
 * @param theta 方位角
 * @param phi 仰角
 */
export function localCoordsFromSpherical(theta: number, phi: number): Vector3 {
    const sinTheta: number = Math.sin(theta);
    return new Vector3(
         sinTheta * Math.cos(phi),
        Math.cos(theta),
        sinTheta * Math.sin(phi)
    );
}

export function vectorFromEuler(euler: Euler): Vector3 {
    return new Vector3(Rad2Deg * euler.x, Rad2Deg * euler.y, Rad2Deg * euler.z);
}

export function eulerFormVector(vector: Vector3): Euler {
    return new Euler(Deg2Rad * vector.x, Deg2Rad * vector.y, Deg2Rad * vector.z);
}

export function lerpColor(colorA: Color, colorB: Color, t: number): Color {
    t = clamp01(t);
    const result = new Color();
    result.r = lerp(colorA.r, colorB.r, t);
    result.g = lerp(colorA.g, colorB.b, t);
    result.b = lerp(colorA.b, colorB.b, t);
    return result;
}

export function lerpColor4(colorA: Color4, colorB: Color4, t: number): Color4 {
    const result = lerpColor(colorA, colorB, t) as Color4;
    result.a = lerp(colorA.a, colorB.a, t);
    return result;
}