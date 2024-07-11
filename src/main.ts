import {createApp, DirectiveBinding} from 'vue';
import { createPinia } from 'pinia';

// Element Plus
import ElementPlus from "element-plus";
import 'element-plus/dist/index.css';

// Vue 组件
import App from './App.vue';
import router from "./routes.ts";
import useUserStore from "./ts/store/UserStore.ts";

console.info('电网设备数字孪生管理平台\n作者：Ryker Zhu (ryker.zhu@nuist.edu.cn)');
createApp(App)
    .use(ElementPlus)
    .use(createPinia())
    .use(router)
    .directive('hasRole', {
        mounted(el: Element, binding: DirectiveBinding) {
            const { value } = binding;
            if(value && value instanceof Array && value.length > 0) {
                const roles: string[] = useUserStore().roles;
                if(!roles.some(role => 'admin' === role || value.includes(role))) {
                    el.parentNode && el.parentNode.removeChild(el);
                }
            } else {
                throw new Error(`User role attribute not set.`);
            }
        }
    })
    .directive('hasPermission', {
        mounted(el: Element, binding: DirectiveBinding) {
            const { value } = binding;
            if(value && value instanceof Array && value.length > 0) {
                const permissions: string[] = useUserStore().permissions;
                if(!permissions.some(permission => '*:*:*' === permission || value.includes(permission))) {
                    el.parentNode && el.parentNode.removeChild(el);
                }
            } else {
                throw new Error(`Operation permission attribute not set.`);
            }
        }
    })
    .mount('#app');
