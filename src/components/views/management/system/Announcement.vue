<script setup lang="ts">
import { ElForm, ElMessage, ElMessageBox, ElTable, ElButton,
  ElDialog, ElInput, ElSelect, ElOption, ElRadioGroup, ElRadio, ElRow, ElCol } from "element-plus";
import { onMounted, reactive, ref, toRefs } from "vue";
import { Search, Refresh, Plus, Edit, Delete } from "@element-plus/icons-vue";
import {DictValue, useDict} from "../../../../ts/store/DictStore.ts";
import {parseTime} from "../../../../ts/common/Utils.ts";
import Api from "../../../../ts/common/Api.ts";
import RightToolBar from "../../../widgets/RightToolBar.vue";
import DictTag from "../../../widgets/DictTag.vue";
import Pagination from "../../../widgets/Pagination.vue";
import Editor from "../../../widgets/Editor.vue";

const { sys_notice_status, sys_notice_type } = useDict("sys_notice_status", "sys_notice_type");

const noticeList = ref<any[]>([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<number[]>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
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
    noticeTitle: undefined,
    createBy: undefined,
    status: undefined
  },
  rules: {
    noticeTitle: [{ required: true, message: "公告标题不能为空", trigger: "blur" }],
    noticeType: [{ required: true, message: "公告类型不能为空", trigger: "change" }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询公告列表 */
const getList = () => {
  loading.value = true;
  Api.System.Notice.listNotice(queryParams.value).then(response => {
    noticeList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
};

/** 表单重置 */
const reset = () => {
  form.value = {
    noticeId: undefined,
    noticeTitle: undefined,
    noticeType: undefined,
    noticeContent: undefined,
    status: "0"
  };
  queryRef.value!.resetFields();
};

/** 取消按钮 */
const cancel = () => {
  open.value = false;
  reset();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryRef.value!.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: any[]) => {
  ids.value = selection.map(item => item.noticeId);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  open.value = true;
  title.value = "添加公告";
};

/** 修改按钮操作 */
const handleUpdate = (row: Record<string, any>) => {
  reset();
  const noticeId = row.noticeId || ids.value;
  Api.System.Notice.getNotice(noticeId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改公告";
  });
};

/** 提交按钮 */
const submitForm = () => {
  queryRef.value!.validate((valid: boolean) => {
    if (valid) {
      if (form.value.noticeId != undefined) {
        Api.System.Notice.updateNotice(form.value).then(() => {
          ElMessage.success("修改成功");
          open.value = false;
          getList();
        });
      } else {
        Api.System.Notice.addNotice(form.value).then(() => {
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
  const noticeIds = row.noticeId || ids.value;
  ElMessageBox.confirm(`是否确认删除公告编号为"${noticeIds}"的数据项?`, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  }).then(() => Api.System.Notice.deleteNotice(noticeIds)).then(() => {
    getList();
    ElMessage.success("删除成功");
  });
};

onMounted(getList);
</script>

<template>
  <div :class="{'loading-area': loading}" v-loading="loading">
    <ElForm :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <ElFormItem label="公告标题" prop="noticeTitle">
        <ElInput
            v-model="queryParams.noticeTitle"
            placeholder="请输入公告标题"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem label="操作人员" prop="createBy">
        <ElInput
            v-model="queryParams.createBy"
            placeholder="请输入操作人员"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem label="类型" prop="noticeType">
        <ElSelect v-model="queryParams.noticeType" placeholder="公告类型" clearable style="width: 200px">
          <ElOption
              v-for="dict in sys_notice_type"
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
            v-has-permission="['system:notice:add']"
        >新增</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="success"
            plain
            :icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-has-permission="['system:notice:edit']"
        >修改</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="danger"
            plain
            :icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-has-permission="['system:notice:remove']"
        >删除</ElButton>
      </ElCol>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </ElRow>

    <ElTable v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
      <ElTableColumn type="selection" width="55" align="center" />
      <ElTableColumn label="序号" align="center" prop="noticeId" width="100" />
      <ElTableColumn label="公告标题" align="center" prop="noticeTitle" :show-overflow-tooltip="true" />
      <ElTableColumn label="公告类型" align="center" prop="noticeType" width="100">
        <template #default="scope">
          <DictTag :options="sys_notice_type as DictValue[]" :value="scope.row.noticeType" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="状态" align="center" prop="status" width="100">
        <template #default="scope">
          <DictTag :options="sys_notice_status as DictValue[]" :value="scope.row.status" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="创建者" align="center" prop="createBy" width="100" />
      <ElTableColumn label="创建时间" align="center" prop="createTime" width="100">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <ElButton link type="primary" :icon="Edit" @click="handleUpdate(scope.row)" v-has-permission="['system:notice:edit']">修改</ElButton>
          <ElButton link type="primary" :icon="Delete" @click="handleDelete(scope.row)" v-has-permission="['system:notice:remove']">删除</ElButton>
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

    <!-- 添加或修改公告对话框 -->
    <ElDialog :title="title" v-model="open" width="780px" append-to-body>
      <ElForm ref="noticeRef" :model="form" :rules="rules" label-width="80px">
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="公告标题" prop="noticeTitle">
              <ElInput v-model="form.noticeTitle" placeholder="请输入公告标题" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="公告类型" prop="noticeType">
              <ElSelect v-model="form.noticeType" placeholder="请选择">
                <ElOption
                    v-for="dict in sys_notice_type"
                    :key="dict['value']"
                    :label="dict['label']"
                    :value="dict['value']"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="状态">
              <ElRadioGroup v-model="form.status">
                <ElRadio
                    v-for="dict in sys_notice_status"
                    :key="dict['value']"
                    :value="dict['value']"
                >{{ dict['label'] }}</ElRadio>
              </ElRadioGroup>
            </ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="内容">
              <Editor v-model="form.noticeContent" :min-height="192" />
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