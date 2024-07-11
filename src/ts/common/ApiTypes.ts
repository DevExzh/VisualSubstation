export type ValueType = boolean | number | string | null;

export interface QueryOptions {
    pageNum?: number;
    pageSize?: number;
}

export interface Response {
    msg: string;
    code: number;
}

export interface MetaData {
    createdBy?: string;
    createTime?: string;
    updateBy?: string;
    updateTime?: string;
    remark?: string;
    params: Record<string, any>;
}

export interface DeptInfo extends MetaData {
    deptId: number;
    parentId: number;
    ancestors: string;
    deptName: string;
    orderNum: number;
    leader: string;
    phone?: string;
    email?: string;
    status?: string;
    delFlag?: string;
    parentName?: string;
    children: DeptInfo[];
}

export interface RoleInfo extends MetaData {
    roleId: number;
    roleName: string;
    roleKey: string;
    roleSort: number;
    dataScope: string;
    menuCheckStrictly: boolean;
    deptCheckStrictly: boolean;
    status: string;
    delFlag?: string;
    flag: boolean;
    menuIds?: number[];
    deptIds?: number[];
    permissions?: string[];
    admin: boolean;
}

export interface UserInfo extends MetaData {
    userId: number;
    deptId: number;
    userName: string;
    nickName: string;
    email: string;
    phonenumber: string;
    sex: string;
    avatar?: string;
    password: string;
    status: string;
    delFlag: string;
    loginIp: string;
    loginDate: string;
    dept: DeptInfo;
    roles: RoleInfo[];
}

export interface UserInfoResponse extends Response {
    permissions: string[];
    roles: string[];
    user: UserInfo;
}

export interface LoginResponse extends Response {
    token: string;
}

export enum DictStatus {
    Enabled = '0',
    Disabled = '1'
}

export interface DictRow extends MetaData {
    dictId: number;
    dictName: string;
    dictType: string;
    status: DictStatus;
}

export interface DictRowResponse extends Response {
    data: DictRow;
}

export interface DictTypeListResponse {
    total: number;
    rows: DictRow[];
}

export interface DictTypeInfo extends MetaData {
    dictCode: number;
    dictSort: number;
    dictLabel: string;
    dictValue: string;
    dictType: string;
    cssClass?: string;
    listClass: string;
    isDefault: 'Y' | 'N';
    status: string;
    default: boolean;
}

export interface DictTypeInfoResponse extends Response {
    data: DictTypeInfo[];
}

export interface RouterMeta {
    title: string;
    icon: string;
    noCache: boolean;
    link?: string;
}

export interface Route {
    name: string;
    path: string;
    hidden: boolean;
    redirect?: string | 'noRedirect';
    component: string;
    alwaysShow?: boolean;
    meta: Record<string, ValueType> | RouterMeta;
    children: Route[];
}

export interface RouteListResponse extends Response {
    data: Route[];
}

export interface CaptchaImageResponse extends Response {
    img: string;
    uuid: string;
    captchaEnabled: boolean;
}

// 注册信息
export interface RegisterData {
    uuid: string;
    username: string;
    password: string;
    confirmPassword: string;
    code: string;
}
