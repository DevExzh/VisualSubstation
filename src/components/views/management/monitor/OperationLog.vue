<script setup lang="ts">
import Api from "../../../../ts/common/Api.ts";
import {ElForm, ElMessage, ElMessageBox, ElTable, Sort} from "element-plus";
import {onMounted, reactive, ref, toRefs} from "vue";
import {DictValue, useDict} from "../../../../ts/store/DictStore.ts";
import {addDateRange, parseTime, selectDictLabel} from "../../../../ts/common/Utils.ts";
import {DateRange} from "../../../../ts/common/Types.ts";
import {OperationLogInfo} from "../../../../ts/common/ApiTypes.ts";
import Pagination from "../../../widgets/layout/Pagination.vue";
import RightToolBar from "../../../widgets/form/RightToolBar.vue";
import DictTag from "../../../widgets/form/DictTag.vue";
import {Search, Refresh, View, Delete, Download} from "@element-plus/icons-vue";

const { sys_oper_type, sys_common_status } = useDict("sys_oper_type","sys_common_status");

const opLogList = ref<OperationLogInfo[]>([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<any[]>([]);
const multiple = ref(true);
const total = ref(0);
const dateRange = ref<DateRange>();
const defaultSort = ref<Sort>({ prop: "operTime", order: "descending" });
const opLogRef = ref<InstanceType<typeof ElTable>>();
const queryRef = ref<InstanceType<typeof ElForm>>();

const data = reactive<{
  form: Record<string, any>;
  queryParams: Record<string, any>;
}>({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    operIp: undefined,
    title: undefined,
    operName: undefined,
    businessType: undefined,
    status: undefined
  }
});
const { queryParams, form } = toRefs(data);
/** 查询登录日志 */
const getList = () => {
  loading.value = true;
  Api.Monitor.OperationLog.list(addDateRange(queryParams.value, dateRange.value!)).then(response => {
    opLogList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
};
/** 操作日志类型字典翻译 */
const typeFormat = (row: Record<string, any>) => {
  return selectDictLabel(sys_oper_type.value, row.businessType);
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
  queryParams.value.pageNum = 1;
  opLogRef.value!.sort(defaultSort.value.prop, defaultSort.value.order);
};
/** 多选框选中数据 */
const handleSelectionChange = (selection: any[]) => {
  ids.value = selection.map(item => item.operId);
  multiple.value = !selection.length;
};
/** 排序触发事件 */
const handleSortChange = (data: {column: any, prop: string, order: any }) => {
  queryParams.value!.orderByColumn = data.prop;
  queryParams.value!.isAsc = data.order;
  getList();
};
/** 详细按钮操作 */
const handleView = (row: Record<string, any>) => {
  open.value = true;
  form.value = row;
};
/** 删除按钮操作 */
const handleDelete = (row: Record<string, any>) => {
  const opIds = row.operId || ids.value;
  ElMessageBox.confirm(`是否确认删除日志编号为"${opIds}"的数据项?`, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  }).then(() => Api.Monitor.OperationLog.deleteOperationLog(opIds)).then(() => {
    getList();
    ElMessage.success("删除成功");
  });
};
/** 清空按钮操作 */
const handleClean = () => {
  ElMessageBox.confirm("是否确认清空所有操作日志数据项?", "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  }).then(Api.Monitor.OperationLog.cleanOperationLog).then(() => {
    getList();
    ElMessage.success("清空成功");
  });
};
/** 导出按钮操作 */
const handleExport = () => {};

onMounted(getList);
</script>

<template>
  <div
      :class="{'loading-area': loading}"
      v-loading="loading"
  >
    <ElForm :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <ElFormItem label="操作地址" prop="operIp">
        <ElInput
            v-model="queryParams.operIp"
            placeholder="请输入操作地址"
            clearable
            style="width: 240px;"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem label="系统模块" prop="title">
        <ElInput
            v-model="queryParams.title"
            placeholder="请输入系统模块"
            clearable
            style="width: 240px;"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem label="操作人员" prop="operName">
        <ElInput
            v-model="queryParams.operName"
            placeholder="请输入操作人员"
            clearable
            style="width: 240px;"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem label="类型" prop="businessType">
        <ElSelect
            v-model="queryParams.businessType"
            placeholder="操作类型"
            clearable
            style="width: 240px"
        >
          <ElOption
              v-for="dict in sys_oper_type"
              :key="dict"
              :label="(dict as DictValue).label"
              :value="(dict as DictValue).value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="状态" prop="status">
        <ElSelect
            v-model="queryParams.status"
            placeholder="操作状态"
            clearable
            style="width: 240px"
        >
          <ElOption
              v-for="dict in sys_common_status"
              :key="dict"
              :label="(dict as DictValue).label"
              :value="(dict as DictValue).value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="操作时间" style="width: 308px">
        <ElDatePicker
            v-model="dateRange"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
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
            type="danger"
            plain
            :icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-has-permission="['monitor:operlog:remove']"
        >删除</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="danger"
            plain
            :icon="Delete"
            @click="handleClean"
            v-has-permission="['monitor:operlog:remove']"
        >清空</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="warning"
            plain
            :icon="Download"
            @click="handleExport"
            v-has-permission="['monitor:operlog:export']"
        >导出</ElButton>
      </ElCol>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </ElRow>

    <ElTable ref="opLogRef" v-loading="loading" :data="opLogList" @selection-change="handleSelectionChange" :default-sort="defaultSort" @sort-change="handleSortChange">
      <ElTableColumn type="selection" width="50" align="center" />
      <ElTableColumn label="日志编号" align="center" prop="operId" />
      <ElTableColumn label="系统模块" align="center" prop="title" :show-overflow-tooltip="true" />
      <ElTableColumn label="操作类型" align="center" prop="businessType">
        <template #default="scope">
          <DictTag :options="sys_oper_type as DictValue[]" :value="scope.row.businessType" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作人员" align="center" width="110" prop="operName" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']" />
      <ElTableColumn label="操作地址" align="center" prop="operIp" width="130" :show-overflow-tooltip="true" />
      <ElTableColumn label="操作状态" align="center" prop="status">
        <template #default="scope">
          <DictTag :options="sys_common_status as DictValue[]" :value="scope.row.status" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作日期" align="center" prop="operTime" width="180" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          <span>{{ parseTime(scope.row.operTime) }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="消耗时间" align="center" prop="costTime" width="110" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          <span>{{ scope.row.costTime }}毫秒</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <ElButton link type="primary" :icon="View" @click="handleView(scope.row)" v-has-permission="['monitor:operlog:query']">详细</ElButton>
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

    <!-- 操作日志详细 -->
    <ElDialog title="操作日志详细" v-model="open" width="800px" append-to-body>
      <ElForm :model="form" label-width="100px">
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="操作模块：">{{ form.title }} / {{ typeFormat(form) }}</ElFormItem>
            <ElFormItem
                label="登录信息："
            >{{ form.operName }} / {{ form.operIp }} / {{ form.operLocation }}</ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="请求地址：">{{ form.operUrl }}</ElFormItem>
            <ElFormItem label="请求方式：">{{ form.requestMethod }}</ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="操作方法：">{{ form.method }}</ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="请求参数：">{{ form.operParam }}</ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="返回参数：">{{ form.jsonResult }}</ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="操作状态：">
              <div v-if="form.status === 0">正常</div>
              <div v-else-if="form.status === 1">失败</div>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="消耗时间：">{{ form.costTime }}毫秒</ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="操作时间：">{{ parseTime(form.operTime) }}</ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="open = false">关 闭</ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>

</style>