import {defineStore} from "pinia";
import Cookies from "js-cookie";
import {Api} from "../common/Api.ts";
import { UserInfoResponse } from "../common/ApiTypes.ts";
import {baseURL, tokenKey} from "../common/Request.ts";

const useUserStore = defineStore('user', {
    state: (): {
        token?: string;
        id: number;
        name: string;
        avatar: string;
        roles: string[];
        permissions: string[];
    } => ({
        token: Cookies.get(tokenKey),
        id: 0,
        name: '',
        avatar: '',
        roles: [],
        permissions: []
    }),
    actions: {
        // 登录
        async login(userInfo: {
            username: string,
            password: string,
            code: string,
            uuid: string
        }): Promise<void> {
            return new Promise((resolve, reject) => {
                Api.login(
                    userInfo.username.trim(), userInfo.password, userInfo.code, userInfo.uuid
                ).then(res => {
                    Cookies.set(tokenKey, res.token);
                    this.token = res.token;
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        },
        // 获取用户信息
        async getInfo(): Promise<UserInfoResponse> {
            return new Promise((resolve, reject) => {
                Api.getInfo().then(res => {
                    const user = res.user;
                    if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                        this.roles = res.roles;
                        this.permissions = res.permissions;
                    } else {
                        this.roles = ['ROLE_DEFAULT'];
                    }
                    this.id = user.userId;
                    this.name = user.userName;
                    this.avatar = user.avatar ? baseURL + user.avatar : '/images/default-avatar.jpg';
                    resolve(res);
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 退出系统
        async logOut(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                Api.logout().then(() => {
                    this.token = '';
                    this.roles = [];
                    this.permissions = [];
                    Cookies.remove(tokenKey);
                    resolve();
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
});

export default useUserStore;