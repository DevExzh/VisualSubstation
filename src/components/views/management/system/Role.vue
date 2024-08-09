<script setup lang="ts">
import { ElForm, ElMessage, ElMessageBox, ElTable, ElInput, ElSelect, ElOption, ElDatePicker,
  ElButton, ElDialog, ElInputNumber, ElRadioGroup, ElRadio, ElRow, ElCol, ElSwitch,
  ElTooltip, ElCheckbox, ElTree } from "element-plus";
import { onMounted, reactive, ref, toRefs, nextTick } from "vue";
import { Search, Refresh, Plus, Edit, Delete, Download,
  CircleCheck, User, QuestionFilled } from "@element-plus/icons-vue";
import {DictValue, useDict} from "../../../../ts/store/DictStore.ts";
import {addDateRange, parseTime} from "../../../../ts/common/Utils.ts";
import Api from "../../../../ts/common/Api.ts";
import {DateRange} from "../../../../ts/common/Types.ts";
import Pagination from "../../../widgets/layout/Pagination.vue";
import RightToolBar from "../../../widgets/form/RightToolBar.vue";
import {Menu, RoleInfo} from "../../../../ts/common/ApiTypes.ts";

const { sys_normal_disable } = useDict("sys_normal_disable");

const roleList = ref<RoleInfo[]>([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<number[]>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref<DateRange>();
const menuOptions = ref<Menu[]>([]);
const menuExpand = ref(false);
const menuNodeAll = ref(false);
const deptExpand = ref(true);
const deptNodeAll = ref(false);
const deptOptions = ref<Menu[]>([]);
const openDataScope = ref(false);
const queryRef = ref<InstanceType<typeof ElForm>>();
const menuRef = ref<InstanceType<typeof ElTree>>();
const deptRef = ref<InstanceType<typeof ElTree>>();
const roleRef = ref<InstanceType<typeof ElForm>>();

/** 数据范围选项 */
const dataScopeOptions = ref([
  { value: "1", label: "全部数据权限" },
  { value: "2", label: "自定数据权限" },
  { value: "3", label: "本部门数据权限" },
  { value: "4", label: "本部门及以下数据权限" },
  { value: "5", label: "仅本人数据权限" }
]);

const data = reactive<{
  form: Record<string, any>;
  queryParams: Record<string, any>;
  rules: Record<string, any>;
}>({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    roleName: undefined,
    roleKey: undefined,
    status: undefined
  },
  rules: {
    roleName: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
    roleKey: [{ required: true, message: "权限字符不能为空", trigger: "blur" }],
    roleSort: [{ required: true, message: "角色顺序不能为空", trigger: "blur" }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询角色列表 */
const getList = () => {
  loading.value = true;
  Api.System.Role.listRole(addDateRange(queryParams.value, dateRange.value!)).then(response => {
    roleList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  dateRange.value = [];
  queryRef.value!.resetFields();
  handleQuery();
};

/** 删除按钮操作 */
const handleDelete = (row: Record<string, any>) => {
  const roleIds = row.roleId || ids.value;
  ElMessageBox.confirm(`是否确认删除角色编号为"${roleIds}"的数据项?`, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  }).then(() => Api.System.Role.deleteRole(roleIds)).then(() => {
    getList();
    ElMessage.success("删除成功");
  });
};

/** 导出按钮操作 */
const handleExport = () => {};

/** 多选框选中数据 */
const handleSelectionChange = (selection: any[]) => {
  ids.value = selection.map(item => item.roleId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 角色状态修改 */
const handleStatusChange = (row: Record<string, any>) => {
  const text = row.status === "0" ? "启用" : "停用";
  ElMessageBox.confirm(`确认要"${text}""${row.roleName}"角色吗?`, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  }).then(() => Api.System.Role.changeRoleStatus(row.roleId, row.status)).then(() => {
    ElMessage.success(`${text}成功`);
  }).catch(() => {
    row.status = row.status === "0" ? "1" : "0";
  });
};

/** 分配用户 */
const handleAuthUser = (_: RoleInfo) => {
  // router.push("/system/role-auth/user/" + row.roleId);
};

/** 查询菜单树结构 */
const getMenuTreeSelect = () => {
  Api.System.Menu.treeSelect().then(response => {
    menuOptions.value = response.data;
  });
};

/** 所有部门节点数据 */
const getDeptAllCheckedKeys = () => {
  const checkedKeys = deptRef.value!.getCheckedKeys();
  const halfCheckedKeys = deptRef.value!.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
};

/** 重置新增的表单以及其他数据 */
const reset = () => {
  if (menuRef.value != undefined) {
    menuRef.value.setCheckedKeys([]);
  }
  menuExpand.value = false;
  menuNodeAll.value = false;
  deptExpand.value = true;
  deptNodeAll.value = false;
  form.value = {
    roleId: undefined,
    roleName: undefined,
    roleKey: undefined,
    roleSort: 0,
    status: "0",
    menuIds: [],
    deptIds: [],
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    remark: undefined
  };
  roleRef.value?.resetFields();
};

/** 添加角色 */
const handleAdd = () => {
  reset();
  getMenuTreeSelect();
  open.value = true;
  title.value = "添加角色";
};

/** 修改角色 */
const handleUpdate = (row: Record<string, any>) => {
  reset();
  const roleId = row.roleId || ids.value;
  const roleMenu = getRoleMenuTreeSelect(roleId);
  Api.System.Role.getRole(roleId).then(response => {
    form.value = response.data;
    form.value.roleSort = Number(form.value.roleSort);
    open.value = true;
    nextTick(() => {
      roleMenu.then((res) => {
        const checkedKeys = res.checkedKeys;
        checkedKeys.forEach((v: any) => {
          nextTick(() => {
            menuRef.value!.setChecked(v, true, false);
          });
        });
      });
    });
    title.value = "修改角色";
  });
};

/** 根据角色ID查询菜单树结构 */
const getRoleMenuTreeSelect = async (roleId: number) => {
  return Api.System.Menu.roleMenuTreeSelect(roleId).then(response => {
    menuOptions.value = response.menus;
    return response;
  });
};

/** 根据角色ID查询部门树结构 */
const getDeptTree = async (roleId: number) => {
  return Api.System.Role.deptTreeSelect(roleId).then(response => {
    deptOptions.value = response.depts;
    return response;
  });
};

/** 树权限（展开/折叠） */
const handleCheckedTreeExpand = (value: boolean, type: string) => {
  if (type == "menu") {
    const treeList = menuOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      menuRef.value!.store.nodesMap[treeList[i].id].expanded = value;
    }
  } else if (type == "dept") {
    const treeList = deptOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      deptRef.value!.store.nodesMap[treeList[i].id].expanded = value;
    }
  }
};

/** 树权限（全选/全不选） */
const handleCheckedTreeNodeAll = (value: boolean, type: string) => {
  if (type == "menu") {
    menuRef.value!.setCheckedNodes(value ? menuOptions.value as any[] : []);
  } else if (type == "dept") {
    deptRef.value!.setCheckedNodes(value ? deptOptions.value as any[] : []);
  }
};

/** 树权限（父子联动） */
const handleCheckedTreeConnect = (value: boolean, type: string) => {
  if (type == "menu") {
    form.value.menuCheckStrictly = value;
  } else if (type == "dept") {
    form.value.deptCheckStrictly = value;
  }
};

/** 所有菜单节点数据 */
const getMenuAllCheckedKeys = () => {
  const checkedKeys = menuRef.value!.getCheckedKeys();
  const halfCheckedKeys = menuRef.value!.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
};

/** 提交按钮 */
const submitForm = () => {
  roleRef.value!.validate((valid: boolean) => {
    if (valid) {
      if (form.value.roleId != undefined) {
        form.value.menuIds = getMenuAllCheckedKeys();
        Api.System.Role.updateRole(form.value).then(() => {
          ElMessage.success("修改成功");
          open.value = false;
          getList();
        });
      } else {
        form.value.menuIds = getMenuAllCheckedKeys();
        Api.System.Role.addRole(form.value).then(() => {
          ElMessage.success("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
};

/** 取消按钮 */
const cancel = () => {
  open.value = false;
  reset();
};

/** 选择角色权限范围触发 */
const dataScopeSelectChange = (value: string) => {
  if (value !== "2") {
    deptRef.value!.setCheckedKeys([]);
  }
};

/** 分配数据权限操作 */
const handleDataScope = (row: RoleInfo) => {
  reset();
  const deptTreeSelect = getDeptTree(row.roleId);
  Api.System.Role.getRole(row.roleId).then(response => {
    form.value = response.data;
    openDataScope.value = true;
    nextTick(() => {
      deptTreeSelect.then(res => {
        nextTick(() => {
          if (deptRef.value) {
            deptRef.value.setCheckedKeys(res.checkedKeys);
          }
        });
      });
    });
    title.value = "分配数据权限";
  });
};

/** 提交按钮（数据权限） */
const submitDataScope = () => {
  if (form.value.roleId != undefined) {
    form.value.deptIds = getDeptAllCheckedKeys();
    Api.System.Role.dataScope(form.value).then(() => {
      ElMessage.success("修改成功");
      openDataScope.value = false;
      getList();
    });
  }
};

/** 取消按钮（数据权限） */
const cancelDataScope = () => {
  openDataScope.value = false;
  reset();
};

onMounted(getList);
</script>

<template>
  <div
      :class="{'loading-area': loading}"
      v-loading="loading"
  >
    <ElForm :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <ElFormItem label="角色名称" prop="roleName">
        <ElInput
            v-model="queryParams.roleName"
            placeholder="请输入角色名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem label="权限字符" prop="roleKey">
        <ElInput
            v-model="queryParams.roleKey"
            placeholder="请输入权限字符"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem label="状态" prop="status">
        <ElSelect
            v-model="queryParams.status"
            placeholder="角色状态"
            clearable
            style="width: 240px"
        >
          <ElOption
              v-for="dict in sys_normal_disable"
              :key="(dict as DictValue).value"
              :label="(dict as DictValue).label"
              :value="(dict as DictValue).value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="创建时间" style="width: 308px">
        <ElDatePicker
            v-model="dateRange"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" :icon="Search" @click="handleQuery">搜索</ElButton>
        <ElButton :icon="Refresh" @click="resetQuery">重置</ElButton>
      </ElFormItem>
    </ElForm>
    <ElRow :gutter="10" class="mb8">
      <ElCol :span="1.5">
        <ElButton
            type="primary"
            plain
            :icon="Plus"
            @click="handleAdd"
            v-has-permission="['system:role:add']"
        >新增</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="success"
            plain
            :icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-has-permission="['system:role:edit']"
        >修改</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="danger"
            plain
            :icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-has-permission="['system:role:remove']"
        >删除</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="warning"
            plain
            :icon="Download"
            @click="handleExport"
            v-has-permission="['system:role:export']"
        >导出</ElButton>
      </ElCol>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </ElRow>
    <ElTable v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <ElTableColumn type="selection" width="55" align="center" />
      <ElTableColumn label="角色编号" prop="roleId" width="120" />
      <ElTableColumn label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150" />
      <ElTableColumn label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150" />
      <ElTableColumn label="显示顺序" prop="roleSort" width="100" />
      <ElTableColumn label="状态" align="center" width="100">
        <template #default="scope">
          <ElSwitch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
          ></ElSwitch>
        </template>
      </ElTableColumn>
      <ElTableColumn label="创建时间" align="center" prop="createTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <ElTooltip content="修改" placement="top" v-if="scope.row.roleId !== 1">
            <ElButton link type="primary" :icon="Edit" @click="handleUpdate(scope.row)" v-has-permission="['system:role:edit']"></ElButton>
          </ElTooltip>
          <ElTooltip content="删除" placement="top" v-if="scope.row.roleId !== 1">
            <ElButton link type="primary" :icon="Delete" @click="handleDelete(scope.row)" v-has-permission="['system:role:remove']"></ElButton>
          </ElTooltip>
          <ElTooltip content="数据权限" placement="top" v-if="scope.row.roleId !== 1">
            <ElButton link type="primary" :icon="CircleCheck" @click="handleDataScope(scope.row)" v-has-permission="['system:role:edit']"></ElButton>
          </ElTooltip>
          <ElTooltip content="分配用户" placement="top" v-if="scope.row.roleId !== 1">
            <ElButton link type="primary" :icon="User" @click="handleAuthUser(scope.row)" v-has-permission="['system:role:edit']"></ElButton>
          </ElTooltip>
        </template>
      </ElTableColumn>
    </ElTable>
    <Pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />
    <!-- 添加或修改角色配置对话框 -->
    <ElDialog :title="title" v-model="open" width="500px" append-to-body>
      <ElForm ref="roleRef" :model="form" :rules="rules" label-width="100px">
        <ElFormItem label="角色名称" prop="roleName">
          <ElInput v-model="form.roleName" placeholder="请输入角色名称" />
        </ElFormItem>
        <ElFormItem prop="roleKey">
          <template #label>
            <span>
              <ElTooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)" placement="top">
                <ElIcon><QuestionFilled/></ElIcon>
              </ElTooltip>
              权限字符
            </span>
          </template>
          <ElInput v-model="form.roleKey" placeholder="请输入权限字符" />
        </ElFormItem>
        <ElFormItem label="角色顺序" prop="roleSort">
          <ElInputNumber v-model="form.roleSort" controls-position="right" :min="0" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElRadioGroup v-model="form.status">
            <ElRadio
                v-for="dict in sys_normal_disable"
                :key="(dict as DictValue).value"
                :value="(dict as DictValue).value"
            >{{ (dict as DictValue).label }}</ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="菜单权限">
          <ElCheckbox v-model="menuExpand" @change="handleCheckedTreeExpand($event as boolean, 'menu')">展开/折叠</ElCheckbox>
          <ElCheckbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event as boolean, 'menu')">全选/全不选</ElCheckbox>
          <ElCheckbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event as boolean, 'menu')">父子联动</ElCheckbox>
          <ElTree
              class="tree-border"
              :data="menuOptions"
              show-checkbox
              ref="menuRef"
              node-key="id"
              :check-strictly="!form.menuCheckStrictly"
              empty-text="加载中，请稍候"
              :props="{ label: 'label', children: 'children' }"
          ></ElTree>
        </ElFormItem>
        <ElFormItem label="备注">
          <ElInput v-model="form.remark" type="textarea" placeholder="请输入内容"></ElInput>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="dialog-footer">
          <ElButton type="primary" @click="submitForm">确 定</ElButton>
          <ElButton @click="cancel">取 消</ElButton>
        </div>
      </template>
    </ElDialog>
    <!-- 分配角色数据权限对话框 -->
    <ElDialog :title="title" v-model="openDataScope" width="500px" append-to-body>
      <ElForm :model="form" label-width="80px">
        <ElFormItem label="角色名称">
          <ElInput v-model="form.roleName" :disabled="true" />
        </ElFormItem>
        <ElFormItem label="权限字符">
          <ElInput v-model="form.roleKey" :disabled="true" />
        </ElFormItem>
        <ElFormItem label="权限范围">
          <ElSelect v-model="form.dataScope" @change="dataScopeSelectChange">
            <ElOption
                v-for="item in dataScopeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></ElOption>
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="数据权限" v-show="form.dataScope == 2">
          <ElCheckbox v-model="deptExpand" @change="handleCheckedTreeExpand($event as boolean, 'dept')">展开/折叠</ElCheckbox>
          <ElCheckbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event as boolean, 'dept')">全选/全不选</ElCheckbox>
          <ElCheckbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event as boolean, 'dept')">父子联动</ElCheckbox>
          <ElTree
              class="tree-border"
              :data="deptOptions"
              show-checkbox
              default-expand-all
              ref="deptRef"
              node-key="id"
              :check-strictly="!form.deptCheckStrictly"
              empty-text="加载中，请稍候"
              :props="{ label: 'label', children: 'children' }"
          ></ElTree>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="dialog-footer">
          <ElButton type="primary" @click="submitDataScope">确 定</ElButton>
          <ElButton @click="cancelDataScope">取 消</ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.loading-area {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>