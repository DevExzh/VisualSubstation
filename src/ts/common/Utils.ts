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
 * @param pattern 格式
 */
export function parseTime(time: any, pattern?: string): (string | undefined) {
    if (arguments.length === 0 || !time) {
        return undefined;
    }
    const format: string = pattern ?? '{y}-{m}-{d} {h}:{i}:{s}';
    let date: Date;
    if (typeof time === 'object') {
        date = time;
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time);
        } else if (typeof time === 'string') {
            time = time.replace(new RegExp(/-/gm), '/')
                .replace('T', ' ')
                .replace(new RegExp(/\.[\d]{3}/gm), '');
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    return format.replace(/{([ymdhisa])+}/g, (result: string, key): string => {
        let value: number = formatObj[key as keyof typeof formatObj];
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        let returned: string | undefined;
        if (result.length > 0 && value < 10) {
            returned = '0' + value;
        }
        return returned ?? '0'
    })
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