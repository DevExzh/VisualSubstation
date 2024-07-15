import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import Cookies from 'js-cookie';
import { stringifyParams } from "./Utils.ts";
import useUserStore from "../store/UserStore.ts";
import router from "../../routes.ts";

// 是否显示重新登录
export const requiredToLogin = { show: false };

export const baseURL = import.meta.env['VITE_API_BASE'];
export const tokenKey = import.meta.env['VITE_TOKEN_KEY'];

const errorCodeMapping: Record<string, string> = {
    '401': '认证失败，无法访问系统资源',
    '403': '当前操作没有权限',
    '404': '访问资源不存在',
    'default': '系统未知错误，请反馈给管理员'
};

/**
 * 实现了原 RuoYi 前端部分的 Request API，使用原生 fetch API 而不是 Axios。
 * @description RuoYi 写的代码实在是太糟糕了，没有任何类型注解，也根本没注释
 * @since 10th July, 2024
 * @author Ryker Zhu <ryker.zhu@nuist.edu.cn>
 */
export default class HTTPService {
    /**
     * 带有超时处理的 fetch 请求
     * @param url 请求的 URL
     * @param options 请求配置
     * @param timeout 超时时间（毫秒）
     * @returns 返回一个 Promise 对象，resolve 表示请求成功，reject 表示请求失败或超时
     */
    private static fetchWithTimeout(
        url: string,
        options: RequestInit,
        timeout: number
    ): Promise<Response> {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error('Timeout'));
            }, timeout);
            fetch(url, Object.assign(options, {
                cache: 'default'
            }))
                .then(response => {
                    clearTimeout(timer);
                    resolve(response);
                })
                .catch(err => {
                    clearTimeout(timer);
                    reject(err);
                });
        });
    }

    /**
     * 处理 HTTP 请求
     * @param url 请求的 URL
     * @param options 请求配置
     * @param timeout 超时时间（毫秒）
     * @returns 返回一个 Promise 对象，resolve 表示请求成功，reject 表示请求失败或超时
     */
    private static async handleRequest(
        url: string,
        options: RequestInit,
        timeout: number
    ): Promise<any> {
        try {
            const response = await this.fetchWithTimeout(baseURL + url, options, timeout);
            const data = await response.json();

            // Handle the status codes
            const code = data.code || 200;
            const msg = errorCodeMapping[code] || data.msg || errorCodeMapping['default'];

            switch (code) {
                case 403:
                case 401: {
                    if (!requiredToLogin.show) {
                        requiredToLogin.show = true;
                        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                            confirmButtonText: '重新登录',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            requiredToLogin.show = false;
                            useUserStore().logOut().then(() => {
                                location.href = '/index';
                            });
                        }).catch(() => {
                            requiredToLogin.show = false;
                        });
                    }
                    return Promise.reject('无效的会话，或者会话已过期，请重新登录。');
                }
                case 500: {
                    ElMessage({message: msg, type: 'error'});
                    return Promise.reject(new Error(msg));
                }
                case 601: {
                    ElMessage({message: msg, type: 'warning'});
                    return Promise.reject(new Error(msg));
                }
                default: {
                    if (code !== 200) {
                        ElNotification.error({title: msg});
                        return Promise.reject('error');
                    } else {
                        return Promise.resolve(data);
                    }
                }
            }
        } catch (error) {
            let message = (error as Error).message;
            if (message === "Network Error") {
                message = "后端接口连接异常";
            } else if (message.includes("Timeout")) {
                message = "系统接口请求超时";
            } else if (message.includes("Request failed with status code")) {
                message = "系统接口" + message.substring(message.length - 3) + "异常";
            } else {
                await router.push({name: 'login', replace: true});
                return Promise.reject(error);
            }
            ElMessage({ message: message, type: 'error', duration: 5 * 1000 });
            return Promise.reject(error);
        }
    }

    /**
     * 创建 HTTP 请求头
     * @param isToken 是否需要携带 token
     * @param token token 字符串
     * @returns 返回一个 Headers 对象
     */
    private static createHeaders(
        isToken: boolean,
        token?: string
    ): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json;charset=utf-8'
        };
        if (token && isToken) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        return headers;
    }

    /**
     * 检查重复提交
     * @param url 请求的 URL
     * @param data 请求的数据
     * @returns 返回一个布尔值，true 表示可以提交，false 表示重复提交
     */
    private static checkDuplicateSubmit(
        url: string,
        data: any
    ): boolean {
        const requestObj = {
            url,
            data: JSON.stringify(data),
            time: new Date().getTime()
        };
        const requestSize = Object.keys(JSON.stringify(requestObj)).length; // 请求数据大小
        const limitSize = 5 * 1024 * 1024; // 限制存放数据5M
        if (requestSize >= limitSize) {
            console.warn(`[${url}]: 请求数据大小超出允许的5M限制，无法进行防重复提交验证。`);
            return true;
        }
        let sessionObj: any = sessionStorage.getItem('sessionObj');
        if (sessionObj) {
            sessionObj = JSON.parse(sessionObj);
            const s_url = sessionObj.url;                // 请求地址
            const s_data = sessionObj.data;              // 请求数据
            const s_time = sessionObj.time;              // 请求时间
            const interval: number = 1000;               // 间隔时间(ms)，小于此时间视为重复提交
            if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
                const message = '数据正在处理，请勿重复提交';
                console.warn(`[${s_url}]: ${message}`);
                return false;
            } else {
                sessionStorage.setItem('sessionObj', JSON.stringify(requestObj));
            }
        } else {
            sessionStorage.setItem('sessionObj', JSON.stringify(requestObj));
        }
        return true;
    }

    /**
     * 发送 GET 请求
     * @param url 请求的 URL
     * @param params 请求的参数
     * @param isToken 是否需要携带 token
     * @param timeout 超时时间（毫秒）
     * @returns 返回一个 Promise 对象，resolve 表示请求成功，reject 表示请求失败或超时
     */
    static get(
        url: string,
        params?: any,
        isToken: boolean = true,
        timeout: number = 10000
    ): Promise<any> {
        const token = Cookies.get(tokenKey);
        const headers = this.createHeaders(isToken, token);
        const finalUrl = params ? `${url}?${stringifyParams(params)}` : url;

        return this.handleRequest(finalUrl, { method: 'GET', headers }, timeout);
    }

    /**
     * 发送 POST 请求
     * @param url 请求的 URL
     * @param data 请求的数据
     * @param isToken 是否需要携带 token
     * @param isRepeatSubmit 是否需要防重复提交
     * @param timeout 超时时间（毫秒）
     * @returns 返回一个 Promise 对象，resolve 表示请求成功，reject 表示请求失败或超时
     */
    static post(
        url: string,
        data: any = {},
        isToken: boolean = true,
        isRepeatSubmit: boolean = true,
        timeout: number = 10000
    ): Promise<any> {
        const token = Cookies.get(tokenKey);
        const headers = this.createHeaders(isToken, token);
        if (!isRepeatSubmit && !this.checkDuplicateSubmit(url, data)) {
            return Promise.reject(new Error('数据正在处理，请勿重复提交'));
        }
        return this.handleRequest(url, { method: 'POST', headers, body: JSON.stringify(data) }, timeout);
    }

    /**
     * 发送 PUT 请求
     * @param url 请求的 URL
     * @param data 请求的数据
     * @param isToken 是否需要携带 token
     * @param isRepeatSubmit 是否需要防重复提交
     * @param timeout 超时时间（毫秒）
     * @returns 返回一个 Promise 对象，resolve 表示请求成功，reject 表示请求失败或超时
     */
    static put(
        url: string,
        data: any,
        isToken: boolean = true,
        isRepeatSubmit: boolean = true,
        timeout: number = 10000
    ): Promise<any> {
        const token = Cookies.get(tokenKey);
        const headers = this.createHeaders(isToken, token);
        if (!isRepeatSubmit && !this.checkDuplicateSubmit(url, data)) {
            return Promise.reject(new Error('数据正在处理，请勿重复提交'));
        }
        return this.handleRequest(url, { method: 'PUT', headers, body: JSON.stringify(data) }, timeout);
    }

    /**
     * 发送 DELETE 请求
     * @param url 请求的 URL
     * @param params 请求的参数
     * @param isToken 是否需要携带 token
     * @param timeout 超时时间（毫秒）
     * @returns 返回一个 Promise 对象，resolve 表示请求成功，reject 表示请求失败或超时
     */
    static delete(
        url: string,
        params?: any,
        isToken: boolean = true,
        timeout: number = 10000
    ): Promise<any> {
        const token = Cookies.get(tokenKey);
        const headers = this.createHeaders(isToken, token);
        const finalUrl = params ? `${url}?${stringifyParams(params)}` : url;
        return this.handleRequest(finalUrl, { method: 'DELETE', headers }, timeout);
    }
}