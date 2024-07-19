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

export interface UserInfoListResponse extends Response {
    total: number;
    rows: UserInfo[];
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

export interface CPUInfo {
    cpuNum: number;
    total: number;
    sys: number;
    used: number;
    wait: number;
    free: number;
}

export interface MemoryInfo {
    total: number;
    used: number;
    free: number;
    usage: number;
}

export interface JVMInfo {
    total: number;
    max: number;
    free: number;
    version: string;
    home: string;
    usage: number;
    used: number;
    startTime: string;
    name: string;
    runTime: string;
    inputArgs: string;
}

export interface SystemInfo {
    computerName: string;
    computerIp: string;
    userDir: string;
    osName: string;
    osArch: string;
}

export interface SystemVolumeInfo {
    dirName: string;
    sysTypeName: string;
    typeName: string;
    total: string;
    free: string;
    used: string;
    usage: number;
}

export type SystemVolumeInfoList = SystemVolumeInfo[];

export interface ServerInfo {
    cpu: CPUInfo;
    mem: MemoryInfo;
    jvm: JVMInfo;
    sys: SystemInfo;
    sysFiles: SystemVolumeInfoList;
}

export interface ServerInfoResponse extends Response {
    data: ServerInfo;
}

export interface OperationLogInfo extends MetaData {
    operId: number;
    title: string;
    businessType: number;
    businessTypes?: string;
    method: string;
    requestMethod: string;
    operatorType: number;
    operName: string;
    deptName: string;
    operUrl: string;
    operIp: string;
    operLocation: string;
    operParam: string;
    jsonResult: string;
    status: number;
    errorMsg?: string;
    operTime: string;
    costTime: number;
}

export interface OperationLogInfoListResponse extends Response {
    total: number;
    rows: OperationLogInfo[];
}

export interface CacheInfo {
    commandStats: {
        name: string;
        value: string;
    }[];
    info: Record<string, string>;
    dbSize: number;
}

export interface CacheInfoResponse extends Response {
    data: CacheInfo;
}

export interface CacheNameListResponse extends Response {
    data: {
        cacheName: string;
        cacheKey: string;
        cacheValue: string;
        remark: string;
    }[];
}

export interface JobInfo extends MetaData {
    jobId: number;
    jobName: string;
    jobGroup: string;
    invokeTarget: string;
    cronExpression: string;
    misfirePolicy: string;
    concurrent: string;
    status: string;
    nextValidTime: string;
}

export interface JobInfoListResponse extends Response {
    total: number;
    rows: JobInfo[];
}

export interface JobInfoResponse extends Response {
    data: JobInfo;
}

export interface PublicKeyResponse extends Response {
    publicKey: string;
}

export interface UserOnline {
    tokenId: string;
    deptName: string;
    userName: string;
    ipaddr: string;
    loginLocation: string;
    browser: string;
    os: string;
    loginTime: number;
}

export interface UserOnlineListResponse extends Response {
    total: number;
    rows: UserOnline[];
}

export interface LoginInfo extends MetaData {
    infoId: number;
    userName: string;
    status: string;
    ipaddr: string;
    loginLocation: string;
    browser: string;
    os: string;
    msg: string;
    loginTime: string;
}

export interface LoginInfoResponse extends Response {
    total: number;
    rows: LoginInfo[];
}

export interface AnnouncementInfo extends MetaData {
    noticeId: number;
    noticeTitle: string;
    noticeType: string;
    noticeContent: string;
    status: string;
}

export interface AnnouncementInfoListResponse extends Response {
    total: number;
    rows: AnnouncementInfo[];
}

export interface AnnouncementInfoResponse extends Response {
    data: AnnouncementInfo;
}

export interface DepartmentInfo extends MetaData {
    deptId: number;
    parentId: number;
    ancestors: string;
    deptName: string;
    orderNum: number;
    leader: string;
    phone: string;
    email: string;
    status: string;
    delFlag: string;
    parentName?: string;
    children: DepartmentInfo[];
}

export interface DepartmentInfoListResponse extends Response {
    data: DepartmentInfo[];
}

export interface DepartmentInfoResponse extends Response {
    data: DepartmentInfo;
}

export interface PostInfo extends MetaData {
    postId: number;
    postCode: string;
    postName: string;
    postSort: number;
    status: string;
    flag: boolean;
}

export interface PostInfoListResponse extends Response {
    total: number;
    rows: PostInfo[];
}

export interface PostInfoResponse extends Response {
    data: PostInfo;
}

export interface RoleInfoListResponse extends Response {
    total: number;
    rows: RoleInfo[];
}

export interface RoleInfoResponse extends Response {
    data: RoleInfo;
}

export interface Menu {
    id: number;
    label: string;
    children?: Menu[];
}

export interface RoleMenuResponse extends Response {
    menus: Menu[];
    checkedKeys: number[];
}

export interface DeptMenuResponse extends Response {
    depts: Menu[];
    checkedKeys: number[];
}

export interface MenuResponse extends Response {
    data: Menu[];
}

export interface UserDetailedInfoResponse extends Response {
    roleIds: number[];
    data: UserInfo;
    postIds: number[];
    roles: RoleInfo[];
    posts: PostInfo[];
}

export interface EventInfo {
    sourceId: string;
    latitude: number;
    scope: string;
    scopeName: string;
    description: string;
    emergency: string;
    scopeLevel: number;
    time: string;
    event: string;
    longitude: number;
    statusCode: number;
}

export interface RecentEventResponse extends Response {
    total: number;
    rows: EventInfo[];
}

export interface EnvironmentInfo {
    humidity: number;
    magnetic_field: number;
    noise_level: number;
    temperature: number;
    wind_speed: number;
}

export interface EnvironmentInfoResponse extends Response {
    data: EnvironmentInfo;
}

export interface CurrentChangeInfo {
    minValue: number;
    maxValue: number;
    time: string;
}

export interface CurrentChangeInfoResponse extends Response {
    total: number;
    rows: CurrentChangeInfo[];
}

export interface PowerGridLoadInfo {
    monthMin: number;
    monthMax: number;
    todayMin: number;
    todayMax: number;
}

export interface PowerGridLoadInfoResponse extends Response {
    data: PowerGridLoadInfo;
}