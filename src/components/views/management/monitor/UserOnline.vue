<script setup lang="ts">
import {onMounted, ref} from "vue";
import Api from "../../../../ts/common/Api.ts";
import Pagination from "../../../widgets/layout/Pagination.vue";
import {parseTime} from "../../../../ts/common/Utils.ts";
import {ElForm, ElMessage, ElMessageBox} from "element-plus";
import {UserOnline} from "../../../../ts/common/ApiTypes.ts";
import {Search, Refresh, Delete} from "@element-plus/icons-vue";

const onlineList = ref<UserOnline[]>([]);
const loading = ref<boolean>(true);
const total = ref<number>(0);
const pageNum = ref<number>(1);
const pageSize = ref<number>(10);
const queryRef = ref<InstanceType<typeof ElForm>>();
const queryParams = ref<{
  ipaddr?: string;
  userName?: string;
}>({
  ipaddr: undefined,
  userName: undefined
});
const getList = () => {
  loading.value = true;
  Api.Monitor.Online.list(queryParams.value).then(response => {
    onlineList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
};
/** 搜索按钮操作 */
const handleQuery = () => {
  pageNum.value = 1;
  getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  queryRef.value!.resetFields();
  handleQuery();
};
/** 强退按钮操作 */
const handleForceLogout = (row: UserOnline) => {
  ElMessageBox.confirm(`是否确认强退名称为 "${row.userName}" 的用户?`, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  }).then(function () {
    return Api.Monitor.Online.forceLogout(row.tokenId);
  }).then(() => {
    getList();
    ElMessage.success("删除成功");
  }).catch(() => {});
};
onMounted(getList);
</script>

<template>
  <div :class="{'loading-area': loading}" v-loading="loading">
    <ElForm :model="queryParams" ref="queryRef" :inline="true">
      <ElFormItem label="登录地址" prop="ipaddr">
        <ElInput
            v-model="queryParams.ipaddr"
            placeholder="请输入登录地址"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem label="用户名称" prop="userName">
        <ElInput
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" :icon="Search" @click="handleQuery">搜索</ElButton>
        <ElButton :icon="Refresh" @click="resetQuery">重置</ElButton>
      </ElFormItem>
    </ElForm>
    <ElTable
        v-loading="loading"
        :data="onlineList.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
        style="width: 100%;"
    >
      <ElTableColumn label="序号" width="50" type="index" align="center">
        <template #default="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="会话编号" align="center" prop="tokenId" :show-overflow-tooltip="true" />
      <ElTableColumn label="登录名称" align="center" prop="userName" :show-overflow-tooltip="true" />
      <ElTableColumn label="所属部门" align="center" prop="deptName" :show-overflow-tooltip="true" />
      <ElTableColumn label="主机" align="center" prop="ipaddr" :show-overflow-tooltip="true" />
      <ElTableColumn label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
      <ElTableColumn label="操作系统" align="center" prop="os" :show-overflow-tooltip="true" />
      <ElTableColumn label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true" />
      <ElTableColumn label="登录时间" align="center" prop="loginTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <ElButton
              link type="primary"
              :icon="Delete"
              @click="handleForceLogout(scope.row)"
              v-has-permission="['monitor:online:forceLogout']"
          >
            强退
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
    <Pagination v-show="total > 0" :total="total" v-model:page="pageNum" v-model:limit="pageSize" />
  </div>
</template>
