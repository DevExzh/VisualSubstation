import * as Types from "./ApiTypes.ts";
import HTTPService from "./Request.ts";
export namespace Api {
  /**
   * 登录
   * @param username 用户名
   * @param password 密码
   * @param code 验证码
   * @param uuid 用户 UUID
   */
  export async function login(
      username: string,
      password: string,
      code: string,
      uuid: string
  ): Promise<Types.LoginResponse> {
    return HTTPService.post('/login', {
      username, password,
      code, uuid
    }, false, false);
  }

  /**
   * 注册
   * @param data 注册信息
   * @see RegisterData
   */
  export async function register(data: Types.RegisterData): Promise<Types.Response> {
    return HTTPService.post('/register', data, false);
  }

  // 获取用户详细信息
  export async function getInfo(): Promise<Types.UserInfoResponse> {
    return HTTPService.get('/getInfo');
  }

  // 退出登录
  export async function logout(): Promise<Types.Response> {
    return HTTPService.post('/logout');
  }

  // 获取验证码
  export async function getCodeImg(): Promise<Types.CaptchaImageResponse> {
    return HTTPService.get('/captchaImage', undefined, false, 20000);
  }

  // 获取公钥
  export async function getPublicKey(): Promise<Types.PublicKeyResponse> {
    return HTTPService.get('/publicKey');
  }

  // 获取路由
  export async function getRouters(): Promise<Types.RouteListResponse> {
    return HTTPService.get('/getRouters');
  }

  export namespace Monitor {
    export namespace Cache {
      // 查询缓存详细
      export async function getCache(): Promise<Types.CacheInfoResponse> {
        return HTTPService.get('/monitor/cache');
      }

      // 查询缓存名称列表
      export async function listCacheName(): Promise<Types.CacheNameListResponse> {
        return HTTPService.get('/monitor/cache/getNames');
      }

      // 查询缓存键名列表
      export async function listCacheKey(cacheName: string): Promise<Types.Response> {
        return HTTPService.get(`/monitor/cache/getKeys/${cacheName}`);
      }

      // 查询缓存内容
      export async function getCacheValue(cacheName: string, cacheKey: string): Promise<Types.Response> {
        return HTTPService.get(`/monitor/cache/getValue/${cacheName}/${cacheKey}`);
      }

      // 清理指定名称缓存
      export async function clearCacheName(cacheName: string): Promise<Types.Response> {
        return HTTPService.delete(`/monitor/cache/clearCacheName/${cacheName}`);
      }

      // 清理指定键名缓存
      export async function clearCacheKey(cacheKey: string): Promise<Types.Response> {
        return HTTPService.delete(`/monitor/cache/clearCacheKey/${cacheKey}`);
      }

      // 清理全部缓存
      export async function clearCacheAll(): Promise<Types.Response> {
        return HTTPService.delete('/monitor/cache/clearCacheAll');
      }
    }

    export namespace Job {
      // 查询定时任务调度列表
      export async function listJob(query: Types.QueryOptions): Promise<Types.JobInfoListResponse> {
        return HTTPService.get('/monitor/job/list', query);
      }

      // 查询定时任务调度详细
      export async function getJob(jobId: number): Promise<Types.JobInfoResponse> {
        return HTTPService.get(`/monitor/job/${jobId}`);
      }

      // 新增定时任务调度
      export async function addJob(data: any): Promise<Types.Response> {
        return HTTPService.post('/monitor/job', data);
      }

      // 修改定时任务调度
      export async function updateJob(data: any): Promise<Types.Response> {
        return HTTPService.put('/monitor/job', data);
      }

      // 删除定时任务调度
      export async function deleteJob(jobId: number): Promise<Types.Response> {
        return HTTPService.delete(`/monitor/job/${jobId}`);
      }

      // 任务状态修改
      export async function changeJobStatus(jobId: number, status: string): Promise<Types.Response> {
        return HTTPService.put('/monitor/job/changeStatus', {
          jobId,
          status
        });
      }

      // 定时任务立即执行一次
      export async function runJob(jobId: number, jobGroup: string): Promise<Types.Response> {
        return HTTPService.put('/monitor/job/run', {
          jobId,
          jobGroup
        });
      }
    }

    export namespace JobLog {
      // 查询调度日志列表
      export async function listJobLog(query: Types.QueryOptions): Promise<Types.Response> {
        return HTTPService.get('/monitor/jobLog/list', query);
      }

      // 删除调度日志
      export async function delJobLog(jobLogId: string): Promise<Types.Response> {
        return HTTPService.delete(`/monitor/jobLog/${jobLogId}`);
      }

      // 清空调度日志
      export async function cleanJobLog(): Promise<Types.Response> {
        return HTTPService.delete('/monitor/jobLog/clean');
      }
    }

    export namespace LoginInfo {
      // 查询登录日志列表
      export async function list(query: Types.QueryOptions): Promise<Types.LoginInfoResponse> {
        return HTTPService.get('/monitor/logininfor/list', query);
      }

      // 删除登录日志
      export async function deleteLoginInfo(infoId: string): Promise<Types.Response> {
        return HTTPService.delete(`/monitor/logininfor/${infoId}`);
      }

      // 解锁用户登录状态
      export async function unlockLoginInfo(userName: string): Promise<Types.Response> {
        return HTTPService.get(`/monitor/logininfor/unlock/${userName}`);
      }

      // 清空登录日志
      export async function cleanLoginInfo(): Promise<Types.Response> {
        return HTTPService.delete('/monitor/logininfor/clean');
      }
    }

    export namespace Online {
      // 查询在线用户列表
      export async function list(query: Types.QueryOptions & {
        ipaddr?: string;
        userName?: string;
      }): Promise<Types.UserOnlineListResponse> {
        return HTTPService.get('/monitor/online/list', query);
      }

      // 强退用户
      export async function forceLogout(tokenId: string): Promise<Types.Response> {
        return HTTPService.delete(`/monitor/online/${tokenId}`);
      }
    }

    export namespace OperationLog {
      // 查询操作日志列表
      export async function list(query: Types.QueryOptions): Promise<Types.OperationLogInfoListResponse> {
        return HTTPService.get('/monitor/operlog/list', query);
      }

      // 删除操作日志
      export async function deleteOperationLog(opId: number): Promise<Types.Response> {
        return HTTPService.delete(`/monitor/operlog/${opId}`);
      }

      // 清空操作日志
      export async function cleanOperationLog(): Promise<Types.Response> {
        return HTTPService.delete('/monitor/operlog/clean');
      }
    }

    export namespace Server {
      // 获取服务信息
      export async function getServer(): Promise<Types.ServerInfoResponse> {
        return HTTPService.get('/monitor/server');
      }
    }
  }

  export namespace Tool {
    export namespace Gen {
      // 查询生成表数据
      export async function listTable(query: Types.QueryOptions): Promise<Types.Response> {
        return HTTPService.get('/tool/gen/list', query);
      }

      // 查询db数据库列表
      export async function listDbTable(query: Types.QueryOptions): Promise<Types.Response> {
        return HTTPService.get('/tool/gen/db/list', query);
      }

      // 查询表详细信息
      export async function getGenTable(tableId: string): Promise<Types.Response> {
        return HTTPService.get(`/tool/gen/${tableId}`);
      }

      // 修改代码生成信息
      export async function updateGenTable(data: any): Promise<Types.Response> {
        return HTTPService.put('/tool/gen', data);
      }

      // 导入表
      export async function importTable(data: any): Promise<Types.Response> {
        return HTTPService.post('/tool/gen/importTable', data);
      }

      // 创建表
      export async function createTable(data: any): Promise<Types.Response> {
        return HTTPService.post('/tool/gen/createTable', data);
      }

      // 预览生成代码
      export async function previewTable(tableId: string): Promise<Types.Response> {
        return HTTPService.get(`/tool/gen/preview/${tableId}`);
      }

      // 删除表数据
      export async function delTable(tableId: string): Promise<Types.Response> {
        return HTTPService.delete(`/tool/gen/${tableId}`);
      }

      // 生成代码（自定义路径）
      export async function genCode(tableName: string): Promise<Types.Response> {
        return HTTPService.get(`/tool/gen/genCode/${tableName}`);
      }

      // 同步数据库
      export async function synchDb(tableName: string): Promise<Types.Response> {
        return HTTPService.get(`/tool/gen/synchDb/${tableName}`);
      }
    }
  }

  export namespace System {
    export namespace Config {
      // 查询参数列表
      export async function listConfig(query: Types.QueryOptions): Promise<Types.Response> {
        return HTTPService.get('/system/config/list', query);
      }

      // 查询参数详细
      export async function getConfig(configId: string): Promise<Types.Response> {
        return HTTPService.get(`/system/config/${configId}`);
      }

      // 根据参数键名查询参数值
      export async function getConfigKey(configKey: string): Promise<Types.Response> {
        return HTTPService.get(`/system/config/configKey/${configKey}`);
      }

      // 新增参数配置
      export async function addConfig(data: any): Promise<Types.Response> {
        return HTTPService.post('/system/config', data);
      }

      // 修改参数配置
      export async function updateConfig(data: any): Promise<Types.Response> {
        return HTTPService.put('/system/config', data);
      }

      // 删除参数配置
      export async function delConfig(configId: string): Promise<Types.Response> {
        return HTTPService.delete(`/system/config/${configId}`);
      }

      // 刷新参数缓存
      export async function refreshCache(): Promise<Types.Response> {
        return HTTPService.delete('/system/config/refreshCache');
      }
    }

    export namespace Dept {
      // 查询部门列表
      export async function listDept(query: Types.QueryOptions): Promise<Types.DepartmentInfoListResponse> {
        return HTTPService.get('/system/dept/list', query);
      }

      // 查询部门列表（排除节点）
      export async function listDeptExcludeChild(deptId: string): Promise<Types.DepartmentInfoListResponse> {
        return HTTPService.get(`/system/dept/list/exclude/${deptId}`);
      }

      // 查询部门详细
      export async function getDept(deptId: string): Promise<Types.DepartmentInfoResponse> {
        return HTTPService.get(`/system/dept/${deptId}`);
      }

      // 新增部门
      export async function addDept(data: any): Promise<Types.Response> {
        return HTTPService.post('/system/dept', data);
      }

      // 修改部门
      export async function updateDept(data: any): Promise<Types.Response> {
        return HTTPService.put('/system/dept', data);
      }

      // 删除部门
      export async function deleteDept(deptId: number): Promise<Types.Response> {
        return HTTPService.delete(`/system/dept/${deptId}`);
      }
    }

    export namespace Menu {
      // 查询菜单列表
      export async function listMenu(query: Types.QueryOptions): Promise<Types.Response> {
        return HTTPService.get('/system/menu/list', query);
      }

      // 查询菜单详细
      export async function getMenu(menuId: number): Promise<Types.Response> {
        return HTTPService.get(`/system/menu/${menuId}`);
      }

      // 查询菜单下拉树结构
      export async function treeSelect(): Promise<Types.MenuResponse> {
        return HTTPService.get('/system/menu/treeselect');
      }

      // 根据角色ID查询菜单下拉树结构
      export async function roleMenuTreeSelect(roleId: number): Promise<Types.RoleMenuResponse> {
        return HTTPService.get(`/system/menu/roleMenuTreeselect/${roleId}`);
      }

      // 新增菜单
      export async function addMenu(data: any): Promise<Types.Response> {
        return HTTPService.post('/system/menu', data);
      }

      // 修改菜单
      export async function updateMenu(data: any): Promise<Types.Response> {
        return HTTPService.put('/system/menu', data);
      }

      // 删除菜单
      export async function delMenu(menuId: string): Promise<Types.Response> {
        return HTTPService.delete(`/system/menu/${menuId}`);
      }
    }

    export namespace Notice {
      // 查询公告列表
      export async function listNotice(query: Types.QueryOptions): Promise<Types.AnnouncementInfoListResponse> {
        return HTTPService.get('/system/notice/list', query);
      }

      // 查询公告详细
      export async function getNotice(noticeId: number): Promise<Types.AnnouncementInfoResponse> {
        return HTTPService.get(`/system/notice/${noticeId}`);
      }

      // 新增公告
      export async function addNotice(data: any): Promise<Types.Response> {
        return HTTPService.post('/system/notice', data);
      }

      // 修改公告
      export async function updateNotice(data: any): Promise<Types.Response> {
        return HTTPService.put('/system/notice', data);
      }

      // 删除公告
      export async function deleteNotice(noticeId: number): Promise<Types.Response> {
        return HTTPService.delete(`/system/notice/${noticeId}`);
      }
    }

    export namespace Post {
      // 查询岗位列表
      export async function listPost(query: Types.QueryOptions): Promise<Types.PostInfoListResponse> {
        return HTTPService.get('/system/post/list', query);
      }

      // 查询岗位详细
      export async function getPost(postId: number): Promise<Types.PostInfoResponse> {
        return HTTPService.get(`/system/post/${postId}`);
      }

      // 新增岗位
      export async function addPost(data: any): Promise<Types.Response> {
        return HTTPService.post('/system/post', data);
      }

      // 修改岗位
      export async function updatePost(data: any): Promise<Types.Response> {
        return HTTPService.put('/system/post', data);
      }

      // 删除岗位
      export async function deletePost(postId: number): Promise<Types.Response> {
        return HTTPService.delete(`/system/post/${postId}`);
      }
    }

    export namespace Role {
      // 查询角色列表
      export async function listRole(query: Types.QueryOptions): Promise<Types.RoleInfoListResponse> {
        return HTTPService.get('/system/role/list', query);
      }

      // 查询角色详细
      export async function getRole(roleId: number): Promise<Types.RoleInfoResponse> {
        return HTTPService.get(`/system/role/${roleId}`);
      }

      // 新增角色
      export async function addRole(data: any): Promise<Types.Response> {
        return HTTPService.post('/system/role', data);
      }

      // 修改角色
      export async function updateRole(data: any): Promise<Types.Response> {
        return HTTPService.put('/system/role', data);
      }

      // 角色数据权限
      export async function dataScope(data: any): Promise<Types.Response> {
        return HTTPService.put('/system/role/dataScope', data);
      }

      // 角色状态修改
      export async function changeRoleStatus(roleId: number, status: string): Promise<Types.Response> {
        return HTTPService.put('/system/role/changeStatus', {
          roleId,
          status
        });
      }

      // 删除角色
      export async function deleteRole(roleId: number): Promise<Types.Response> {
        return HTTPService.delete(`/system/role/${roleId}`);
      }

      // 查询角色已授权用户列表
      export async function allocatedUserList(query: Types.QueryOptions): Promise<Types.Response> {
        return HTTPService.get('/system/role/authUser/allocatedList', query);
      }

      // 查询角色未授权用户列表
      export async function unallocatedUserList(query: Types.QueryOptions): Promise<Types.Response> {
        return HTTPService.get('/system/role/authUser/unallocatedList', query);
      }

      // 取消用户授权角色
      export async function authUserCancel(data: any): Promise<Types.Response> {
        return HTTPService.put('/system/role/authUser/cancel', data);
      }

      // 批量取消用户授权角色
      export async function authUserCancelAll(data: any): Promise<Types.Response> {
        return HTTPService.put('/system/role/authUser/cancelAll', data);
      }

      // 授权用户选择
      export async function authUserSelectAll(data: any): Promise<Types.Response> {
        return HTTPService.put('/system/role/authUser/selectAll', data);
      }

      // 根据角色ID查询部门树结构
      export async function deptTreeSelect(roleId: number): Promise<Types.DeptMenuResponse> {
        return HTTPService.get(`/system/role/deptTree/${roleId}`);
      }
    }

    export namespace User {
      // 查询用户列表
      export async function listUser(query: Types.QueryOptions): Promise<Types.UserInfoListResponse> {
        return HTTPService.get('/system/user/list', query);
      }

      // 查询用户详细
      export async function getUser(userId?: number): Promise<Types.UserDetailedInfoResponse> {
        return HTTPService.get('/system/user/' + userId ?? '');
      }

      // 新增用户
      export async function addUser(data: any): Promise<Types.Response> {
        return HTTPService.post('/system/user', data);
      }

      // 修改用户
      export async function updateUser(data: any): Promise<Types.Response> {
        return HTTPService.put('/system/user', data);
      }

      // 删除用户
      export async function deleteUser(userId: number): Promise<Types.Response> {
        return HTTPService.delete('/system/user/' + userId);
      }

      // 用户密码重置
      export async function resetUserPwd(userId: number, password: string): Promise<Types.Response> {
        return HTTPService.put('/system/user/resetPwd', {
          userId,
          password
        });
      }

      // 用户状态修改
      export async function changeUserStatus(userId: number, status: string): Promise<Types.Response> {
        return HTTPService.put('/system/user/changeStatus', {
          userId,
          status
        });
      }

      // 查询用户个人信息
      export async function getUserProfile(): Promise<Types.Response> {
        return HTTPService.get('/system/user/profile');
      }

      // 修改用户个人信息
      export async function updateUserProfile(data: any): Promise<Types.Response> {
        return HTTPService.put('/system/user/profile', data);
      }

      // 用户密码重置
      export async function updateUserPwd(oldPassword: string, newPassword: string): Promise<Types.Response> {
        return HTTPService.put('/system/user/profile/updatePwd', {
          oldPassword,
          newPassword
        });
      }

      // 用户头像上传
      export async function uploadAvatar(data: any): Promise<Types.Response> {
        return HTTPService.post('/system/user/profile/avatar', data);
      }

      // 查询授权角色
      export async function getAuthRole(userId: number): Promise<Types.Response> {
        return HTTPService.get('/system/user/authRole/' + userId);
      }

      // 保存授权角色
      export async function updateAuthRole(data: any): Promise<Types.Response> {
        return HTTPService.put('/system/user/authRole', data);
      }

      // 查询部门下拉树结构
      export async function deptTreeSelect(): Promise<Types.Response & { data: Types.Menu[] }> {
        return HTTPService.get('/system/user/deptTree');
      }
    }

    export namespace Dict {
      export namespace Data {
        // 查询字典数据列表
        export async function listData(query: Types.QueryOptions): Promise<Types.Response> {
          return HTTPService.get('/system/dict/data/list', query);
        }

        // 查询字典数据详细
        export async function getData(dictCode: string): Promise<Types.Response> {
          return HTTPService.get('/system/dict/data/' + dictCode);
        }

        // 根据字典类型查询字典数据信息
        export async function getDicts(dictType: string): Promise<Types.DictTypeInfoResponse> {
          return HTTPService.get('/system/dict/data/type/' + dictType);
        }

        // 新增字典数据
        export async function addData(data: any): Promise<Types.Response> {
          return HTTPService.post('/system/dict/data', data);
        }


        // 修改字典数据
        export async function updateData(data: any): Promise<Types.Response> {
          return HTTPService.put('/system/dict/data', data);
        }

        // 删除字典数据
        export async function delData(dictCode: string): Promise<Types.Response> {
          return HTTPService.delete('/system/dict/data/' + dictCode);
        }
      }

      export namespace Type {
        // 查询字典类型列表
        export async function listType(query: Types.QueryOptions): Promise<Types.DictTypeListResponse> {
          return HTTPService.get('/system/dict/type/list', query);
        }

        // 查询字典类型详细
        export async function getType(dictId: number): Promise<Types.DictRowResponse> {
          return HTTPService.get('/system/dict/type/' + dictId);
        }

        // 新增字典类型
        export async function addType(data: any): Promise<Response> {
          return HTTPService.post('/system/dict/type', data);
        }

        // 修改字典类型
        export async function updateType(data: Types.DictRow): Promise<Response> {
          return HTTPService.put('/system/dict/type', data);
        }

        // 删除字典类型
        export async function deleteType(dictId: number): Promise<Response> {
          return HTTPService.delete('/system/dict/type/' + dictId);
        }

        // 刷新字典缓存
        export async function refreshCache(): Promise<Response> {
          return HTTPService.delete('/system/dict/type/refreshCache');
        }

        // 获取字典选择框列表
        export async function optionselect(): Promise<Types.DictRowResponse> {
          return HTTPService.get('/system/dict/type/optionselect');
        }
      }
    }
  }
}

export default Api;