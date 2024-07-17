<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from "vue";
import { ElForm, ElMessage, ElMessageBox, ElTable, ElInput, ElSelect, ElOption, ElButton, ElDialog, ElInputNumber, ElRadioGroup, ElRadio, ElRow, ElCol } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete, Download } from "@element-plus/icons-vue";
import {DictValue, useDict} from "../../../../ts/store/DictStore.ts";
import Api from "../../../../ts/common/Api.ts";
import {parseTime} from "../../../../ts/common/Utils.ts";
import DictTag from "../../../widgets/DictTag.vue";
import Pagination from "../../../widgets/Pagination.vue";
import RightToolBar from "../../../widgets/RightToolBar.vue";
import {PostInfo} from "../../../../ts/common/ApiTypes.ts";

const { sys_normal_disable } = useDict("sys_normal_disable");

const postList = ref<PostInfo[]>([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<number[]>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const queryRef = ref<InstanceType<typeof ElForm>>();
const postRef = ref<InstanceType<typeof ElForm>>();

const data = reactive<{
  form: Record<string, any>;
  queryParams: Record<string, any>;
  rules: Record<string, any>;
}>({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    postCode: undefined,
    postName: undefined,
    status: undefined
  },
  rules: {
    postName: [{ required: true, message: "岗位名称不能为空", trigger: "blur" }],
    postCode: [{ required: true, message: "岗位编码不能为空", trigger: "blur" }],
    postSort: [{ required: true, message: "岗位顺序不能为空", trigger: "blur" }],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询岗位列表 */
const getList = () => {
  loading.value = true;
  Api.System.Post.listPost(queryParams.value).then(response => {
    postList.value = response.rows;
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
    postId: undefined,
    postCode: undefined,
    postName: undefined,
    postSort: 0,
    status: "0",
    remark: undefined
  };
  postRef.value!.resetFields();
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

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  open.value = true;
  title.value = "添加岗位";
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: any[]) => {
  ids.value = selection.map(item => item.postId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 修改按钮操作 */
const handleUpdate = (row: Record<string, any>) => {
  reset();
  const postId = row.postId || ids.value;
  Api.System.Post.getPost(postId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改岗位";
  });
};

/** 提交按钮 */
const submitForm = () => {
  postRef.value!.validate((valid: boolean) => {
    if (valid) {
      if (form.value.postId != undefined) {
        Api.System.Post.updatePost(form.value).then(() => {
          ElMessage.success("修改成功");
          open.value = false;
          getList();
        });
      } else {
        Api.System.Post.addPost(form.value).then(() => {
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
  const postIds = row.postId || ids.value;
  ElMessageBox.confirm(`是否确认删除岗位编号为"${postIds}"的数据项？`, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  }).then(() => Api.System.Post.deletePost(postIds)).then(() => {
    getList();
    ElMessage.success("删除成功");
  });
};
/** 导出按钮操作 */
const handleExport = () => {};
onMounted(getList);
</script>

<template>
  <div :class="{'loading-area': loading}" v-loading="loading">
    <ElForm :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <ElFormItem label="岗位编码" prop="postCode">
        <ElInput
            v-model="queryParams.postCode"
            placeholder="请输入岗位编码"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem label="岗位名称" prop="postName">
        <ElInput
            v-model="queryParams.postName"
            placeholder="请输入岗位名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem label="状态" prop="status">
        <ElSelect
            v-model="queryParams.status"
            placeholder="岗位状态"
            clearable
            style="width: 200px"
        >
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
            v-has-permission="['system:post:add']"
        >新增</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="success"
            plain
            :icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-has-permission="['system:post:edit']"
        >修改</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="danger"
            plain
            :icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-has-permission="['system:post:remove']"
        >删除</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="warning"
            plain
            :icon="Download"
            @click="handleExport"
            v-has-permission="['system:post:export']"
        >导出</ElButton>
      </ElCol>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </ElRow>

    <ElTable v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <ElTableColumn type="selection" width="55" align="center" />
      <ElTableColumn label="岗位编号" align="center" prop="postId" />
      <ElTableColumn label="岗位编码" align="center" prop="postCode" />
      <ElTableColumn label="岗位名称" align="center" prop="postName" />
      <ElTableColumn label="岗位排序" align="center" prop="postSort" />
      <ElTableColumn label="状态" align="center" prop="status">
        <template #default="scope">
          <DictTag :options="sys_normal_disable as DictValue[]" :value="scope.row.status" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <ElButton link type="primary" :icon="Edit" @click="handleUpdate(scope.row)"
                    v-has-permission="['system:post:edit']">修改</ElButton>
          <ElButton link type="primary" :icon="Delete" @click="handleDelete(scope.row)"
                    v-has-permission="['system:post:remove']">删除</ElButton>
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

    <!-- 添加或修改岗位对话框 -->
    <ElDialog :title="title" v-model="open" width="500px" append-to-body>
      <ElForm ref="postRef" :model="form" :rules="rules" label-width="80px">
        <ElFormItem label="岗位名称" prop="postName">
          <ElInput v-model="form.postName" placeholder="请输入岗位名称" />
        </ElFormItem>
        <ElFormItem label="岗位编码" prop="postCode">
          <ElInput v-model="form.postCode" placeholder="请输入编码名称" />
        </ElFormItem>
        <ElFormItem label="岗位顺序" prop="postSort">
          <ElInputNumber v-model="form.postSort" controls-position="right" :min="0" />
        </ElFormItem>
        <ElFormItem label="岗位状态" prop="status">
          <ElRadioGroup v-model="form.status">
            <ElRadio
                v-for="dict in sys_normal_disable"
                :key="dict['value']"
                :value="dict['value']"
            >{{ dict['label'] }}</ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="备注" prop="remark">
          <ElInput v-model="form.remark" type="textarea" placeholder="请输入内容" />
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