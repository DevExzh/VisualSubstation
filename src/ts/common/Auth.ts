import useUserStore from "../store/UserStore.ts";

const AllPermission = "*:*:*";
const SuperAdmin = 'admin';

function authPermission(permission: string): boolean {
    if (permission) {
        return useUserStore().permissions.some(v => {
            return AllPermission === v || v === permission
        });
    } else {
        return false;
    }
}

function authRole(role: string): boolean {
    if (role) {
        return useUserStore().roles.some(v => {
            return SuperAdmin === v || v === role;
        });
    } else {
        return false;
    }
}

export default {
    // 验证用户是否具备某权限
    hasPermission(permission: string): boolean {
        return authPermission(permission);
    },
    // 验证用户是否含有指定权限，只需包含其中一个
    hasPermissionOr(permissions: string[]): boolean {
        return permissions.some(item => {
            return authPermission(item);
        })
    },
    // 验证用户是否含有指定权限，必须全部拥有
    hasPermissionAnd(permissions: string[]): boolean {
        return permissions.every(item => {
            return authPermission(item);
        })
    },
    // 验证用户是否具备某角色
    hasRole(role: string): boolean {
        return authRole(role);
    },
    // 验证用户是否含有指定角色，只需包含其中一个
    hasRoleOr(roles: string[]): boolean {
        return roles.some(item => {
            return authRole(item);
        })
    },
    // 验证用户是否含有指定角色，必须全部拥有
    hasRoleAnd(roles: string[]): boolean {
        return roles.every(item => {
            return authRole(item);
        })
    }
}