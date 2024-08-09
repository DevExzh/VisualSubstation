<script setup lang="ts">
import { ElForm, ElMessage, ElMessageBox, ElTable, ElInput, ElSelect, ElOption,
  ElDatePicker, ElButton, ElDialog, ElRadioGroup, ElRadio, ElRow, ElCol } from "element-plus";
import { onMounted, reactive, ref, toRefs } from "vue";
import { Search, Refresh, Plus, Edit, Delete, Download } from "@element-plus/icons-vue";
import useDictStore, {DictValue, useDict} from "../../../../ts/store/DictStore.ts";
import {addDateRange, parseTime} from "../../../../ts/common/Utils.ts";
import {DateRange} from "../../../../ts/common/Types.ts";
import {DictRow} from "../../../../ts/common/ApiTypes.ts";
import Pagination from "../../../widgets/layout/Pagination.vue";
import DictTag from "../../../widgets/form/DictTag.vue";
import RightToolBar from "../../../widgets/form/RightToolBar.vue";
import Api from "../../../../ts/common/Api.ts";

const { sys_normal_disable } = useDict("sys_normal_disable");

const typeList = ref<DictRow[]>([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<number[]>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref<DateRange>();
const queryRef = ref<InstanceType<typeof ElForm>>();
const dictRef = ref<InstanceType<typeof ElForm>>();

const data = reactive<{
  form: Record<string, any>;
  queryParams: Record<string, any>;
  rules: Record<string, any>;
}>({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    dictName: undefined,
    dictType: undefined,
    status: undefined
  },
  rules: {
    dictName: [{ required: true, message: "字典名称不能为空", trigger: "blur" }],
    dictType: [{ required: true, message: "字典类型不能为空", trigger: "blur" }]
  }
});
const { queryParams, form, rules } = toRefs(data);
/** 查询字典类型列表 */
const getList = () => {
  loading.value = true;
  Api.System.Dict.Type.listType(addDateRange(queryParams.value, dateRange.value!)).then(response => {
    typeList.value = response.rows;
    total.value = response.total;
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
    dictId: undefined,
    dictName: undefined,
    dictType: undefined,
    status: "0",
    remark: undefined
  };
  dictRef.value!.resetFields();
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

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  open.value = true;
  title.value = "添加字典类型";
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: any[]) => {
  ids.value = selection.map(item => item.dictId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 修改按钮操作 */
const handleUpdate = (row: Record<string, any>) => {
  reset();
  const dictId = row.dictId || ids.value;
  Api.System.Dict.Type.getType(dictId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改字典类型";
  });
};

/** 提交按钮 */
const submitForm = () => {
  dictRef.value!.validate((valid: boolean) => {
    if (valid) {
      if (form.value.dictId != undefined) {
        Api.System.Dict.Type.updateType(form.value as DictRow).then(() => {
          ElMessage.success("修改成功");
          open.value = false;
          getList();
        });
      } else {
        Api.System.Dict.Type.addType(form.value as DictRow).then(() => {
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
  const dictIds = row.dictId || ids.value;
  ElMessageBox.confirm(`是否确认删除字典编号为"${dictIds}"的数据项？`, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  }).then(() => Api.System.Dict.Type.deleteType(dictIds)).then(() => {
    getList();
    ElMessage.success("删除成功");
  });
};

/** 导出按钮操作 */
const handleExport = () => {
};

/** 刷新缓存按钮操作 */
const handleRefreshCache = () => {
  Api.System.Dict.Type.refreshCache().then(() => {
    ElMessage.success("刷新成功");
    useDictStore().cleanDict();
  });
};

onMounted(getList);
</script>

<template>
  <div :class="{'loading-area': loading}" v-loading="loading">
    <ElForm :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <ElFormItem label="字典名称" prop="dictName">
        <ElInput
            v-model="queryParams.dictName"
            placeholder="请输入字典名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem label="字典类型" prop="dictType">
        <ElInput
            v-model="queryParams.dictType"
            placeholder="请输入字典类型"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem label="状态" prop="status">
        <ElSelect
            v-model="queryParams.status"
            placeholder="字典状态"
            clearable
            style="width: 240px"
        >
          <ElOption
              v-for="dict in sys_normal_disable"
              :key="dict['value']"
              :label="dict['label']"
              :value="dict['value']"
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
            v-has-permission="['system:dict:add']"
        >新增</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="success"
            plain
            :icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-has-permission="['system:dict:edit']"
        >修改</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="danger"
            plain
            :icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-has-permission="['system:dict:remove']"
        >删除</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="warning"
            plain
            :icon="Download"
            @click="handleExport"
            v-has-permission="['system:dict:export']"
        >导出</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="danger"
            plain
            :icon="Refresh"
            @click="handleRefreshCache"
            v-has-permission="['system:dict:remove']"
        >刷新缓存</ElButton>
      </ElCol>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </ElRow>

    <ElTable v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <ElTableColumn type="selection" width="55" align="center" />
      <ElTableColumn label="字典编号" align="center" prop="dictId" />
      <ElTableColumn label="字典名称" align="center" prop="dictName" :show-overflow-tooltip="true"/>
      <ElTableColumn label="字典类型" align="center" :show-overflow-tooltip="true">
<!--        <template #default="scope">-->
<!--          <router-link :to="'/system/dict-data/index/' + scope.row.dictId" class="link-type">-->
<!--            <span>{{ scope.row.dictType }}</span>-->
<!--          </router-link>-->
<!--        </template>-->
      </ElTableColumn>
      <ElTableColumn label="状态" align="center" prop="status">
        <template #default="scope">
          <DictTag :options="sys_normal_disable as DictValue[]" :value="scope.row.status" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <ElTableColumn label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template #default="scope">
          <ElButton link type="primary" :icon="Edit" @click="handleUpdate(scope.row)" v-has-permission="['system:dict:edit']">修改</ElButton>
          <ElButton link type="primary" :icon="Delete" @click="handleDelete(scope.row)" v-has-permission="['system:dict:remove']">删除</ElButton>
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

    <!-- 添加或修改参数配置对话框 -->
    <ElDialog :title="title" v-model="open" width="500px" append-to-body>
      <ElForm ref="dictRef" :model="form" :rules="rules" label-width="80px">
        <ElFormItem label="字典名称" prop="dictName">
          <ElInput v-model="form.dictName" placeholder="请输入字典名称" />
        </ElFormItem>
        <ElFormItem label="字典类型" prop="dictType">
          <ElInput v-model="form.dictType" placeholder="请输入字典类型" />
        </ElFormItem>
        <ElFormItem label="状态" prop="status">
          <ElRadioGroup v-model="form.status">
            <ElRadio
                v-for="dict in sys_normal_disable"
                :key="dict['value']"
                :value="dict['value']"
            >{{ dict['label'] }}</ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="备注" prop="remark">
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
  </div>
</template>

<style scoped>
.loading-area {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>