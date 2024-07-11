import {createRouter, createWebHistory, RouteComponent} from "vue-router";
import Login from "./components/Login.vue";

export interface DynamicRoute {
    path: string;
    component: RouteComponent | (() => Promise<RouteComponent>);
    hidden: boolean;
    permissions?: string[];
    roles?: string[];
    meta: Record<string, any>;
    children: DynamicRoute[];
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/view',
            name: 'panel-view',
            component: () => import('./components/DisplayPanel.vue'),
            children: [
                {
                    path: 'map',
                    name: 'home',
                    meta: {
                        title: '电网设备数字孪生管理系统',
                        requiresAuth: true,
                    },
                    component: () => import('./components/scenes/Map3DScene.vue')
                },
                {
                    path: 'substation',
                    name: 'substation-scene',
                    meta: {
                        title: '电网设备数字孪生管理系统',
                        requiresAuth: true,
                    },
                    component: () => import('./components/scenes/SubstationScene.vue')
                }
            ],
        },
        {
            path: '/',
            redirect: '/view/map',
        },
        {
            path: '/login',
            name: 'login',
            meta: {
                title: '电网设备数字孪生管理系统',
                requiresAuth: false,
            },
            component: Login,
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            meta: {
                title: '页面不存在',
                requiresAuth: false,
            },
            component: () => import('./components/NotFound.vue')
        }
    ],
    scrollBehavior(_: any, __: any, savedPosition: any) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
});
router.beforeEach(({meta, name}, _, next) => {
    const { title, requiresAuth } = meta;
    if(title) document.title = title as string;
    if(sessionStorage.getItem('isLoggedIn') !== 'yes' && name !== 'login' && requiresAuth) {
        next({ name: 'login' });
    } else {
        next();
    }
});

export default router;