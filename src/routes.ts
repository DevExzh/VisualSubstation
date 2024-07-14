import {createRouter, createWebHistory} from "vue-router";
import Login from "./components/Login.vue";
import Cookies from "js-cookie";
import {tokenKey} from "./ts/common/Request.ts";
import Auth from "./ts/common/Auth.ts";
import useUserStore from "./ts/store/UserStore.ts";
import {ElMessage} from "element-plus";

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
                        permissions: ['view:map:all']
                    },
                    component: () => import('./components/scenes/Map3DScene.vue')
                },
                {
                    path: 'substation',
                    name: 'substation-scene',
                    meta: {
                        title: '电网设备数字孪生管理系统',
                        requiresAuth: true,
                        permissions: ['view:map:substation']
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
    const { title, requiresAuth, permissions, roles } = meta;
    if(title) document.title = title as string;
    if(!Cookies.get(tokenKey) && name !== 'login' && requiresAuth) {
        next({ name: 'login' });
    } else {
        const userStore = useUserStore();
        if(userStore.permissions.length == 0 || userStore.roles.length == 0) {
            userStore.getInfo().then(info => {
                if(requiresAuth && (Auth.hasPermissionOr(info.permissions) || Auth.hasRoleOr(info.roles))) {
                    next();
                } else {
                    ElMessage.error('您的权限不足以访问该页面');
                }
            });
        } else if(requiresAuth &&
            ((permissions && Auth.hasPermissionOr(permissions as string[])) ||
                (roles && Auth.hasRoleOr(roles as string[])))
        ) {
            next();
        } else {
            ElMessage.error('您的权限不足以访问该页面');
        }
    }
});

export default router;