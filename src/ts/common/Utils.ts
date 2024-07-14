import {DateRange} from "./Types.ts";

/**
 * 内存复制，类似于 C/C++ 语言标准库中的同名函数
 * @param src 源数组
 * @param srcOffset 偏移量
 * @param dst 目标数组
 * @param dstOffset 目标偏移量
 * @param length 长度
 */
export function memcpy(
    src: Float32Array,
    srcOffset: number,
    dst: Float32Array,
    dstOffset: number,
    length: number
): Float32Array {
    src = src.subarray ? src.subarray(srcOffset, length && srcOffset + length) : src.slice(srcOffset, length && srcOffset + length);
    if (dst.set) {
        dst.set(src, dstOffset);
    } else {
        for (let i = 0; i < src.length; i++) {
            dst[i + dstOffset] = src[i];
        }
    }
    return dst;
}

/**
 * 深度复制一个对象
 * @param target 需要被复制的对象
 * @param ignored 需要忽略的键名（也就是这些属性不会被带入复制后的对象内）
 * @param base 基对象，被复制对象的所有键值对都会被添加到该对象上
 * @param depth 最大复制深度（这对于循环引用和大型复杂对象的复制非常有用）
 * @description 原生方法 `structuredClone` 的替代品。与其不同的是，该复制会去除该对象下的所有成员函数，以使得跨线程通信时这些成员函数
 * 不会被传输（通常来说这会引起报错）。使用此函数而不是使用 `JSON.stringify` 和 `JSON.parse` 的一大优势是你不需要序列化和反序列化。
 * 如果你确信将要传输的对象不包含任何成员函数，请使用 `structuredClone`。
 * @see structuredClone
 */
export function deepClone(target: any, ignored: string[] = [], base: any = {}, depth: number = 5): any {
    if(depth === 0) return {};
    try {
        for (const key in target) {
            if(ignored.includes(key)) continue;
            const value = target[key as keyof Event];
            switch (typeof value) {
                case "function":
                default: continue;
                case "object": {
                    if(Array.isArray(value)) {
                        const array: any[] = new Array(value.length);
                        deepClone(value, [], array, depth - 1);
                        base[key] = array;
                    } else {
                        base[key] = deepClone(value, [], {}, depth - 1);
                    }
                    break;
                }
                case "undefined":
                case "string":
                case "boolean":
                case "number":
                case "bigint": {
                    base[key] = value;
                    break;
                }
            }
        }
    } catch (e) {
        console.error('Error when trying to clone', e);
    }
    return base;
}

/**
 * 格式化时间
 * @param time 任意类型
 */
export function parseTime(time: any): (string | undefined) {
    console.log(time);
    if (arguments.length === 0 || !time) {
        return undefined;
    }
    let date: Date;
    if (typeof time === 'object') {
        date = time;
    } else {
        if(typeof time === 'string') {
            if (/^[0-9]+$/.test(time)) {
                time = parseInt(time);
            } else {
                time = time.replace(new RegExp(/-/gm), '/')
                    .replace('T', ' ')
                    .replace(new RegExp(/\.\d{3}/gm), '');
            }
            if (time.toString().length === 10) {
                time = time * 1000;
            }
        }
        date = new Date(time);
    }
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

/**
 * 将任意对象转为 URI 请求的参数字符串
 * @param params 任意对象
 */
export function stringifyParams(params: any): string {
    let result: string = '';
    for (const propName in params) {
        const value = params[propName as keyof typeof params];
        const part: string = encodeURIComponent(propName) + "=";
        if (value !== null && value !== "" && typeof (value) !== "undefined") {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
                        let params = propName + '[' + key + ']';
                        const subPart = encodeURIComponent(params) + "=";
                        result += subPart + encodeURIComponent(value[key]) + "&";
                    }
                }
            } else {
                result += part + encodeURIComponent(value) + "&";
            }
        }
    }
    return result
}

const conversionFactors: { [unit: string]: number } = {
    'px': 1,
    'pt': 1.333333,  // 1pt = 4/3px
    'in': 96,        // 1in = 96px
    'cm': 37.7952755906, // 1cm = 37.7952755906px
    'mm': 3.77952755906, // 1mm = 3.77952755906px
    'pc': 16,        // 1pc = 16px (1 pica = 12 points = 16px)
    'rem': 16,       // 1rem = 16px (假设根元素的字体大小是 16px)
    'em': 16         // 1em = 16px (假设元素的字体大小是 16px)
};

function convertToPixels(value: string): number {
    const regex = /^([+-]?[\d.]+)(\w+)$/;
    const match = value.match(regex);
    if (!match) {
        throw new Error(`Invalid input: ${value}`);
    }
    const num = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    if (!(unit in conversionFactors)) {
        throw new Error(`Unsupported unit: ${unit}`);
    }
    const factor = conversionFactors[unit];
    return num * factor;
}

/**
 * 将任意表示长度的字符串转换为像素大小
 * @since 14th July 2024
 * @param length 表示长度的字符串，如 `'14pt'`, `'5rem'` 等
 */
export function pixels(length: number | string): number {
    if(typeof length === 'number') {
        return length;
    } else try {
        return convertToPixels(length);
    } catch (e) {
        console.error(e);
        return 100;
    }
}


// 添加日期范围
export function addDateRange(params: Record<string, any>, dateRange: DateRange, propName?: string) {
    const search: Record<string, any> = params;
    search.params = typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
    const range: ([Date, Date] | [string, string] | []) = Array.isArray(dateRange) ? dateRange : [];
    if (typeof (propName) === 'undefined') {
        search.params['beginTime'] = range[0];
        search.params['endTime'] = range[1];
    } else {
        search.params['begin' + propName] = range[0];
        search.params['end' + propName] = range[1];
    }
    return search;
}

// 回显数据字典
export function selectDictLabel(data: Record<string, any>, value: any) {
    if (value === undefined) {
        return "";
    }
    const actions = [];
    Object.keys(data).some(key => {
        if (data[key].value == ('' + value)) {
            actions.push(data[key].label);
            return true;
        }
    })
    if (actions.length === 0) {
        actions.push(value);
    }
    return actions.join('');
}

// 回显数据字典（字符串数组）
export function selectDictLabels(data: Record<string, any>, value: any, separator: string): string {
    if (value === undefined || value.length === 0) {
        return "";
    }
    if (Array.isArray(value)) {
        value = value.join(",");
    }
    const actions: string[] = [];
    const currentSeparator: string = undefined === separator ? "," : separator;
    const temp = value.split(currentSeparator);
    Object.keys(value.split(currentSeparator)).some((val) => {
        let match: boolean = false;
        Object.keys(data).some((key) => {
            if (data[key].value == ('' + temp[val])) {
                actions.push(data[key].label + currentSeparator);
                match = true;
            }
        })
        if (!match) {
            actions.push(temp[val] + currentSeparator);
        }
    })
    return actions.join('').substring(0, actions.join('').length - 1);
}

function easeInOutQuad(t: number, b: number, c: number, d: number): number {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

export function scrollTo(to: number, duration?: number, callback?: Function) {
    const start: number = document.documentElement.scrollTop || document.body.scrollTop;
    const change: number = to - start;
    const increment: number = 20;
    let currentTime: number = 0;
    duration = (typeof (duration) === 'undefined') ? 500 : duration
    const animateScroll = () => {
        // 时间自增
        currentTime += increment
        // 使用二次进出缓和函数计算值
        const val: number = easeInOutQuad(currentTime, start, change, duration);
        // 移动 document body
        document.documentElement.scrollTop = val;
        document.body.scrollTop = val;
        if (currentTime < duration) {
            requestAnimationFrame(animateScroll);
        } else {
            callback?.();
        }
    }
    animateScroll();
}