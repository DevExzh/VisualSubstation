import {defineStore} from "pinia";
import Api from "../common/Api.ts";
import {RouteRecordRaw} from "vue-router";
import router, {DynamicRoute} from "../../routes.ts";
import auth from "../common/Auth.ts";

const modules = import.meta.glob('./../../components/**/*.vue');

const constantRoutes: RouteRecordRaw[] = [];
const dynamicRoutes: DynamicRoute[] = [];

const usePermissionStore = defineStore('permission', {
    state: (): {
        routes: RouteRecordRaw[],
        addRoutes: RouteRecordRaw[],
        defaultRoutes: RouteRecordRaw[],
        sidebarRouters: RouteRecordRaw[]
    } => ({
        routes: [],
        addRoutes: [],
        defaultRoutes: [],
        sidebarRouters: []
    }),
    actions: {
        setRoutes(routes: RouteRecordRaw[]): void {
            this.addRoutes = routes;
            this.routes = constantRoutes.concat(routes);
        },
        setDefaultRoutes(routes: RouteRecordRaw[]) {
            this.defaultRoutes = constantRoutes.concat(routes)
        },
        setSidebarRouters(routes: RouteRecordRaw[]) {
            this.sidebarRouters = routes
        },
        async generateRoutes() {
            return new Promise(resolve => {
                // 向后端请求路由数据
                Api.getRouters().then(_ => {
                    const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
                    asyncRoutes.forEach(route => { router.addRoute(route) });
                    resolve(asyncRoutes);
                });
            })
        }
    }
});

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes: DynamicRoute[]): DynamicRoute[] {
    const res: DynamicRoute[] = [];
    routes.forEach(route => {
        if (route.permissions) {
            if (auth.hasPermissionOr(route.permissions)) {
                res.push(route);
            }
        } else if (route.roles) {
            if (auth.hasRoleOr(route.roles)) {
                res.push(route);
            }
        }
    })
    return res;
}

export const loadView = (view: string) => {
    for (const path in modules) {
        if (path.split('views/')[1].split('.vue')[0] === view) {
            return () => modules[path]();
        }
    }
    return undefined;
};

export default usePermissionStore;
