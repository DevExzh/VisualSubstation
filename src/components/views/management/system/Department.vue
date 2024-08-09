<script setup lang="ts">
import { ElForm, ElMessage, ElMessageBox, ElTable, ElButton, ElDialog, ElTreeSelect,
  ElInput, ElSelect, ElOption, ElInputNumber, ElRadioGroup, ElRadio, ElRow, ElCol,
} from "element-plus";
import { onMounted, reactive, ref, toRefs, nextTick } from "vue";
import { Search, Refresh, Plus, Edit, Delete, Sort as SortIcon } from "@element-plus/icons-vue";
import {DictValue, useDict} from "../../../../ts/store/DictStore.ts";
import Api from "../../../../ts/common/Api.ts";
import RightToolBar from "../../../widgets/form/RightToolBar.vue";
import {DepartmentInfo} from "../../../../ts/common/ApiTypes.ts";
import {parseTime} from "../../../../ts/common/Utils.ts";
import DictTag from "../../../widgets/form/DictTag.vue";

const { sys_normal_disable } = useDict("sys_normal_disable");

const deptList = ref<DepartmentInfo[]>([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const deptOptions = ref<any[]>([]);
const isExpandAll = ref(true);
const refreshTable = ref(true);
const queryRef = ref<InstanceType<typeof ElForm>>();

const data = reactive<{
  form: Record<string, any>;
  queryParams: Record<string, any>;
  rules: Record<string, any>;
}>({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptName: undefined,
    status: undefined
  },
  rules: {
    parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
    deptName: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
    orderNum: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
    email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
    phone: [{ pattern: /^1[3456789][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询部门列表 */
const getList = () => {
  loading.value = true;
  Api.System.Dept.listDept(queryParams.value).then(response => {
    deptList.value = handleTree(response.data, 'deptId', 0);
    loading.value = false;
  });
};

/** 取消按钮 */
const cancel = () => {
  open.value = false;
  reset();
};

/** 表单重置 */
const reset = () => {
  form.value = {
    deptId: undefined,
    parentId: undefined,
    deptName: undefined,
    orderNum: 0,
    leader: undefined,
    phone: undefined,
    email: undefined,
    status: "0"
  };
  queryRef.value!.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryRef.value!.resetFields();
  handleQuery();
};

/** 新增按钮操作 */
const handleAdd = (row?: Record<string, any>) => {
  reset();
  Api.System.Dept.listDept({
    pageNum: 1,
    pageSize: 10,
  }).then(response => {
    deptOptions.value = handleTree(response.data, "deptId");
  });
  if (row) {
    form.value.parentId = row.deptId;
  }
  open.value = true;
  title.value = "添加部门";
};

/** 展开/折叠操作 */
const toggleExpandAll = () => {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
};

/** 修改按钮操作 */
const handleUpdate = (row: Record<string, any>) => {
  reset();
  Api.System.Dept.listDeptExcludeChild(row.deptId).then(response => {
    deptOptions.value = handleTree(response.data, "deptId");
  });
  Api.System.Dept.getDept(row.deptId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改部门";
  });
};

/** 提交按钮 */
const submitForm = () => {
  queryRef.value!.validate((valid: boolean) => {
    if (valid) {
      if (form.value.deptId != undefined) {
        Api.System.Dept.updateDept(form.value).then(() => {
          ElMessage.success("修改成功");
          open.value = false;
          getList();
        });
      } else {
        Api.System.Dept.addDept(form.value).then(() => {
          ElMessage.success("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
};

/** 删除按钮操作 */
const handleDelete = (row: Record<string, any>) => {
  ElMessageBox.confirm(`是否确认删除名称为"${row.deptName}"的数据项?`, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  }).then(() => Api.System.Dept.deleteDept(row.deptId)).then(() => {
    getList();
    ElMessage.success("删除成功");
  });
};

/** 处理树形数据 */
const handleTree = (data: DepartmentInfo[], idField: keyof DepartmentInfo, parentId?: number): DepartmentInfo[] => {
  return data.filter(item => item.parentId == parentId).map(item => {
    const children = handleTree(data, idField, item[idField] as number);
    if (children.length) {
      item.children = children;
    }
    return item;
  });
};

onMounted(getList);
</script>

<template>
  <div :class="{'loading-area': loading}" v-loading="loading">
    <ElForm :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <ElFormItem label="部门名称" prop="deptName">
        <ElInput
            v-model="queryParams.deptName"
            placeholder="请输入部门名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem label="状态" prop="status">
        <ElSelect v-model="queryParams.status" placeholder="部门状态" clearable style="width: 200px">
          <ElOption
              v-for="dict in sys_normal_disable"
              :key="dict['value']"
              :label="dict['label']"
              :value="dict['value']"
          />
        </ElSelect>
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
            v-has-permission="['system:dept:add']"
        >新增</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="info"
            plain
            :icon="SortIcon"
            @click="toggleExpandAll"
        >展开/折叠</ElButton>
      </ElCol>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </ElRow>

    <ElTable
        v-if="refreshTable"
        v-loading="loading"
        :data="deptList"
        row-key="deptId"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <ElTableColumn prop="deptName" label="部门名称" width="260" />
      <ElTableColumn prop="orderNum" label="排序" width="200" />
      <ElTableColumn prop="status" label="状态" width="100">
        <template #default="scope">
          <DictTag :options="sys_normal_disable as DictValue[]" :value="scope.row.status" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="创建时间" align="center" prop="createTime" width="200">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <ElButton link type="primary" :icon="Edit" @click="handleUpdate(scope.row)" v-has-permission="['system:dept:edit']">修改</ElButton>
          <ElButton link type="primary" :icon="Plus" @click="handleAdd(scope.row)" v-has-permission="['system:dept:add']">新增</ElButton>
          <ElButton v-if="scope.row.parentId != 0" link type="primary" :icon="Delete" @click="handleDelete(scope.row)" v-has-permission="['system:dept:remove']">删除</ElButton>
        </template>
      </ElTableColumn>
    </ElTable>

    <!-- 添加或修改部门对话框 -->
    <ElDialog :title="title" v-model="open" width="600px" append-to-body>
      <ElForm ref="deptRef" :model="form" :rules="rules" label-width="80px">
        <ElRow>
          <ElCol :span="24" v-if="form.parentId">
            <ElFormItem label="上级部门" prop="parentId">
              <ElTreeSelect
                  v-model="form.parentId"
                  :data="deptOptions"
                  :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
                  value-key="deptId"
                  placeholder="选择上级部门"
                  check-strictly
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="部门名称" prop="deptName">
              <ElInput v-model="form.deptName" placeholder="请输入部门名称" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="显示排序" prop="orderNum">
              <ElInputNumber v-model="form.orderNum" controls-position="right" :min="0" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="负责人" prop="leader">
              <ElInput v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="联系电话" prop="phone">
              <ElInput v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="邮箱" prop="email">
              <ElInput v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="部门状态">
              <ElRadioGroup v-model="form.status">
                <ElRadio
                    v-for="dict in sys_normal_disable"
                    :key="dict['value']"
                    :value="dict['value']"
                >{{ dict['label'] }}</ElRadio>
              </ElRadioGroup>
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
      <template #footer>
        <div class="dialog-footer">
          <ElButton type="primary" @click="submitForm">确 定</ElButton>
          <ElButton @click="cancel">取 消</ElButton>
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
