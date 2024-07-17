<script setup lang="ts">
import {DictValue, useDict} from "../../../../ts/store/DictStore.ts";
import {onMounted, ref} from "vue";
import {ElForm, ElMessage, ElMessageBox, ElTable, Sort} from "element-plus";
import Api from "../../../../ts/common/Api.ts";
import RightToolBar from "../../../widgets/RightToolBar.vue";
import DictTag from "../../../widgets/DictTag.vue";
import {addDateRange, parseTime} from "../../../../ts/common/Utils.ts";
import Pagination from "../../../widgets/Pagination.vue";
import {LoginInfo} from "../../../../ts/common/ApiTypes.ts";
import {DateRange} from "../../../../ts/common/Types.ts";
import {Delete, Download, Refresh, Search, Unlock} from "@element-plus/icons-vue";

const { sys_common_status } = useDict("sys_common_status");
const loginInfoList = ref<LoginInfo[]>([]);
const loading = ref<boolean>(true);
const showSearch = ref<boolean>(true);
const ids = ref<number[]>([]);
const single = ref<boolean>(true);
const multiple = ref<boolean>(true);
const selectName = ref<string | string[]>('');
const total = ref<number>(0);
const dateRange = ref<DateRange>([]);
const defaultSort = ref<Sort>({ prop: "loginTime", order: "descending" });

const loginInfoRef = ref<InstanceType<typeof ElTable>>();
const queryRef = ref<InstanceType<typeof ElForm>>();

// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  ipaddr: undefined,
  userName: undefined,
  status: undefined,
  orderByColumn: undefined,
  isAsc: undefined
});
/** 查询登录日志列表 */
const getList = () => {
  loading.value = true;
  Api.Monitor.LoginInfo.list(addDateRange(queryParams.value, dateRange.value)).then(response => {
    loginInfoList.value = response.rows;
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
  queryRef.value?.resetFields();
  queryParams.value.pageNum = 1;
  loginInfoRef.value!.sort(defaultSort.value.prop, defaultSort.value.order);
};
/** 多选框选中数据 */
const handleSelectionChange = (selection: LoginInfo[]) => {
  ids.value = selection.map(item => item.infoId);
  multiple.value = !selection.length;
  single.value = selection.length != 1;
  selectName.value! = selection.map(item => item.userName);
};
/** 排序触发事件 */
const handleSortChange = (column: any, _: string, __: any) => {
  queryParams.value.orderByColumn = column.prop;
  queryParams.value.isAsc = column.order;
  getList();
};
/** 删除按钮操作 */
const handleDelete = (row: LoginInfo) => {
  const infoIds = row.infoId || ids.value;
  ElMessageBox.confirm(`是否确认删除访问编号为 "${infoIds}" 的数据项?`, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  })
      .then(() => Api.Monitor.LoginInfo.deleteLoginInfo(String(infoIds)))
      .then(() => {
        getList();
        ElMessage.success("删除成功");
      });
};
/** 清空按钮操作 */
const handleClean = () => {
  ElMessageBox.confirm("是否确认清空所有登录日志数据项?", "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  })
      .then(() => Api.Monitor.LoginInfo.cleanLoginInfo())
      .then(() => {
        getList();
        ElMessage.success("清空成功");
      });
};
/** 解锁按钮操作 */
const handleUnlock = () => {
  const username = selectName.value;
  ElMessageBox.confirm(`是否确认解锁用户 "${username}" 数据项?`, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  })
      .then(() => Api.Monitor.LoginInfo.unlockLoginInfo(String(username)))
      .then(() => ElMessage.success("用户" + username + "解锁成功"));
};
/** 导出按钮操作 */
const handleExport = () => {};
onMounted(getList);
</script>

<template>
  <div class="app-container">
    <ElForm :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <ElFormItem label="登录地址" prop="ipaddr">
        <ElInput
            v-model="queryParams.ipaddr"
            placeholder="请输入登录地址"
            clearable
            style="width: 240px;"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem label="用户名称" prop="userName">
        <ElInput
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            style="width: 240px;"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem label="状态" prop="status">
        <ElSelect
            v-model="queryParams.status"
            placeholder="登录状态"
            clearable
            style="width: 240px"
        >
          <ElOption
              v-for="dict in sys_common_status"
              :key="dict['value']"
              :label="dict['label']"
              :value="dict['value']"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="登录时间" style="width: 308px">
        <ElDatePicker
            v-model="dateRange"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[
                new Date(2000, 1, 1, 0, 0, 0),
                new Date(2000, 1, 1, 23, 59, 59)]"
        ></ElDatePicker>
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" :icon="Search" @click="handleQuery">搜索</ElButton>
        <ElButton :icon="Refresh" @click="resetQuery">重置</ElButton>
      </ElFormItem>
    </ElForm>
    <ElRow :gutter="10" class="mb8">
      <ElCol :span="1.5">
        <ElButton
            type="danger"
            plain
            :icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-has-permission="['monitor:logininfor:remove']"
        >删除</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="danger"
            plain
            :icon="Delete"
            @click="handleClean"
            v-has-permission="['monitor:logininfor:remove']"
        >清空</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="primary"
            plain
            :icon="Unlock"
            :disabled="single"
            @click="handleUnlock"
            v-has-permission="['monitor:logininfor:unlock']"
        >解锁</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="warning"
            plain
            :icon="Download"
            @click="handleExport"
            v-has-permission="['monitor:logininfor:export']"
        >导出</ElButton>
      </ElCol>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList"></RightToolBar>
    </ElRow>
    <ElTable
        ref="loginInfoRef"
        v-loading="loading"
        :data="loginInfoList"
        @selection-change="handleSelectionChange"
        :default-sort="defaultSort"
        @sort-change="handleSortChange"
    >
      <ElTableColumn type="selection" width="55" align="center" />
      <ElTableColumn label="访问编号" align="center" prop="infoId" />
      <ElTableColumn label="用户名称" align="center" prop="userName"
                     :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']" />
      <ElTableColumn label="地址" align="center" prop="ipaddr" :show-overflow-tooltip="true" />
      <ElTableColumn label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
      <ElTableColumn label="操作系统" align="center" prop="os" :show-overflow-tooltip="true" />
      <ElTableColumn label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true" />
      <ElTableColumn label="登录状态" align="center" prop="status">
        <template #default="scope">
          <DictTag :options="sys_common_status as DictValue[]" :value="scope.row.status" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="描述" align="center" prop="msg" :show-overflow-tooltip="true" />
      <ElTableColumn label="访问时间" align="center" prop="loginTime"
                     sortable="custom" :sort-orders="['descending', 'ascending']" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
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
  </div>
</template>
