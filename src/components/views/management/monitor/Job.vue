<script setup lang="ts">
import {onMounted, reactive, Ref, ref, toRefs} from "vue";
import {ElForm, ElMessage, ElMessageBox} from "element-plus";
import {
  QuestionFilled, Search, Refresh, Plus,
  Delete, Download, Operation, Edit, CaretRight, View
} from "@element-plus/icons-vue";
import Api from "../../../../ts/common/Api.ts";
import RightToolBar from "../../../widgets/RightToolBar.vue";
import DictTag from "../../../widgets/DictTag.vue";
import Pagination from "../../../widgets/Pagination.vue";
import {useDict} from "../../../../ts/store/DictStore.ts";
import {parseTime, selectDictLabel} from "../../../../ts/common/Utils.ts";
import {JobInfo} from "../../../../ts/common/ApiTypes.ts";
import CronTab from "../../../widgets/CronTab.vue";
const { sys_job_group, sys_job_status } = useDict("sys_job_group", "sys_job_status");
const jobList = ref<JobInfo[]>([]);
const open = ref<boolean>(false);
const loading = ref<boolean>(true);
const showSearch = ref<boolean>(true);
const ids = ref<number[]>([]);
const single = ref<boolean>(true);
const multiple = ref(true);
const total = ref<number>(0);
const title = ref<string>("");
const openView = ref<boolean>(false);
const openCron = ref<boolean>(false);
const expression = ref<string>("");
const jobRef = ref<InstanceType<typeof ElForm>>();
const queryRef = ref<InstanceType<typeof ElForm>>();
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    jobName: undefined,
    jobGroup: undefined,
    status: undefined
  },
  rules: {
    jobName: [{ required: true, message: "任务名称不能为空", trigger: "blur" }],
    invokeTarget: [{ required: true, message: "调用目标字符串不能为空", trigger: "blur" }],
    cronExpression: [{ required: true, message: "cron执行表达式不能为空", trigger: "change" }]
  }
});
const { queryParams, form, rules } = toRefs(data);
/** 查询定时任务列表 */
const getList = () => {
  loading.value = true;
  Api.Monitor.Job.listJob(queryParams.value).then(response => {
    jobList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
};
/** 任务组名字典翻译 */
const jobGroupFormat = (row: JobInfo) => {
  return selectDictLabel(sys_job_group.value, row.jobGroup);
};
/** 取消按钮 */
const cancel = () => {
  open.value = false;
  reset();
};
/** 表单重置 */
const reset = () => {
  form.value = {
    jobId: undefined,
    jobName: undefined,
    jobGroup: undefined,
    invokeTarget: undefined,
    cronExpression: undefined,
    misfirePolicy: 1,
    concurrent: 1,
    status: "0"
  };
  jobRef.value?.resetFields();
};
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  queryRef.value?.resetFields();
  handleQuery();
};
// 多选框选中数据
const handleSelectionChange = (selection: JobInfo[]) => {
  ids.value = selection.map(item => item.jobId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};
// 任务状态修改
const handleStatusChange = (row: JobInfo) => {
  const text = row.status === "0" ? "启用" : "停用";
  ElMessageBox.confirm(`确认要${text} "${row.jobName}" 任务吗？`, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  })
      .then(() => Api.Monitor.Job.changeJobStatus(row.jobId, row.status))
      .then(() => ElMessage.success(text + "成功"))
      .catch(() => row.status = row.status === "0" ? "1" : "0");
};
/* 立即执行一次 */
const handleRun = (row: JobInfo) => {
  ElMessageBox.confirm(`确认要立即执行一次"${row.jobName}"任务吗?`, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  })
      .then(() => Api.Monitor.Job.runJob(row.jobId, row.jobGroup))
      .then(() => ElMessage.success("执行成功"))
      .catch(reason => console.error(reason));
};
/** 任务详细信息 */
const handleView = (row: JobInfo) => {
  Api.Monitor.Job.getJob(row.jobId).then(response => {
    form.value = response.data;
    openView.value = true;
  });
};
/** cron表达式按钮操作 */
const handleShowCron = () => {
  expression.value = form.value.cronExpression;
  openCron.value = true;
};
/** 确定后回传值 */
const crontabFill = (value: string) => {
  (form as Ref<JobInfo>).value.cronExpression = value;
};
/** 任务日志列表查询 */
const handleJobLog = (row: JobInfo) => {
  const jobId = row.jobId || 0;
  //router.push('/monitor/job-log/index/' + jobId)
}
/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  open.value = true;
  title.value = "添加任务";
};
/** 修改按钮操作 */
const handleUpdate = (row: JobInfo) => {
  reset();
  const jobId = row.jobId || ids.value;
  Api.Monitor.Job.getJob(jobId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改任务";
  });
};
/** 提交按钮 */
const submitForm = () => {
  jobRef.value?.validate(valid => {
    if (valid) {
      if (form.value.jobId != undefined) {
        Api.Monitor.Job.updateJob(form.value).then(response => {
          ElMessage.success("修改成功");
          open.value = false;
          getList();
        });
      } else {
        Api.Monitor.Job.addJob(form.value).then(response => {
          ElMessage.success("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
};
/** 删除按钮操作 */
const handleDelete = (row) => {
  const jobIds = row.jobId || ids.value;
  ElMessageBox.confirm(`是否确认删除定时任务编号为"${jobIds}"的数据项?`, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  })
      .then(() => Api.Monitor.Job.deleteJob(jobIds))
      .then(() => {
        getList();
        ElMessage.success("删除成功");
      })
      .catch(reason => console.error(reason));
};
/** 导出按钮操作 */
const handleExport = () => {};
onMounted(getList);
</script>

<template>
  <div class="app-container">
    <ElForm :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <ElFormItem label="任务名称" prop="jobName">
        <ElInput
            v-model="queryParams.jobName"
            placeholder="请输入任务名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </ElFormItem>
      <ElFormItem label="任务组名" prop="jobGroup">
        <ElSelect v-model="queryParams.jobGroup" placeholder="请选择任务组名" clearable style="width: 200px">
          <ElOption
              v-for="dict in sys_job_group"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="任务状态" prop="status">
        <ElSelect v-model="queryParams.status" placeholder="请选择任务状态" clearable style="width: 200px">
          <ElOption
              v-for="dict in sys_job_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
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
            v-has-permission="['monitor:job:add']"
        >新增</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-has-permission="['monitor:job:edit']"
        >修改</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="danger"
            plain
            :icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-has-permission="['monitor:job:remove']"
        >删除</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="warning"
            plain
            :icon="Download"
            @click="handleExport"
            v-has-permission="['monitor:job:export']"
        >导出</ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton
            type="info"
            plain
            :icon="Operation"
            @click="handleJobLog"
            v-has-permission="['monitor:job:query']"
        >日志</ElButton>
      </ElCol>
      <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" />
    </ElRow>

    <ElTable v-loading="loading" :data="jobList" @selection-change="handleSelectionChange">
      <ElTableColumn type="selection" width="55" align="center" />
      <ElTableColumn label="任务编号" width="100" align="center" prop="jobId" />
      <ElTableColumn label="任务名称" align="center" prop="jobName" :show-overflow-tooltip="true" />
      <ElTableColumn label="任务组名" align="center" prop="jobGroup">
        <template #default="scope">
          <DictTag :options="sys_job_group" :value="scope.row.jobGroup" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="调用目标字符串" align="center" prop="invokeTarget" :show-overflow-tooltip="true" />
      <ElTableColumn label="cron执行表达式" align="center" prop="cronExpression" :show-overflow-tooltip="true" />
      <ElTableColumn label="状态" align="center">
        <template #default="scope">
          <ElSwitch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
          ></ElSwitch>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template #default="scope">
          <ElTooltip content="修改" placement="top">
            <ElButton link type="primary" :icon="Edit" @click="handleUpdate(scope.row)" v-has-permission="['monitor:job:edit']" />
          </ElTooltip>
          <ElTooltip content="删除" placement="top">
            <ElButton link type="primary" :icon="Delete" @click="handleDelete(scope.row)" v-has-permission="['monitor:job:remove']" />
          </ElTooltip>
          <ElTooltip content="执行一次" placement="top">
            <ElButton link type="primary" :icon="CaretRight" @click="handleRun(scope.row)" v-has-permission="['monitor:job:changeStatus']" />
          </ElTooltip>
          <ElTooltip content="任务详细" placement="top">
            <ElButton link type="primary" :icon="View" @click="handleView(scope.row)" v-has-permission="['monitor:job:query']" />
          </ElTooltip>
          <ElTooltip content="调度日志" placement="top">
            <ElButton link type="primary" :icon="Operation" @click="handleJobLog(scope.row)" v-has-permission="['monitor:job:query']" />
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

    <!-- 添加或修改定时任务对话框 -->
    <ElDialog :title="title" v-model="open" width="820px" append-to-body>
      <ElForm ref="jobRef" :model="form" :rules="rules" label-width="120px">
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="任务名称" prop="jobName">
              <ElInput v-model="form.jobName" placeholder="请输入任务名称" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="任务分组" prop="jobGroup">
              <ElSelect v-model="form.jobGroup" placeholder="请选择">
                <ElOption
                    v-for="dict in sys_job_group"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                ></ElOption>
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem prop="invokeTarget">
              <template #label>
                        <span>
                           调用方法
                           <ElTooltip placement="top">
                              <template #content>
                                 <div>
                                    Bean调用示例：ryTask.ryParams('ry')
                                    <br />Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
                                    <br />参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                                 </div>
                              </template>
                              <ElIcon><QuestionFilled /></ElIcon>
                           </ElTooltip>
                        </span>
              </template>
              <ElInput v-model="form.invokeTarget" placeholder="请输入调用目标字符串" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="cron表达式" prop="cronExpression">
              <ElInput v-model="form.cronExpression" placeholder="请输入cron执行表达式">
                <template #append>
                  <ElButton type="primary" @click="handleShowCron">
                    生成表达式
                    <i class="el-icon-time el-icon--right"></i>
                  </ElButton>
                </template>
              </ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :span="24" v-if="form.jobId !== undefined">
            <ElFormItem label="状态">
              <ElRadioGroup v-model="form.status">
                <ElRadio
                    v-for="dict in sys_job_status"
                    :key="dict.value"
                    :value="dict.value"
                >{{ dict.label }}</ElRadio>
              </ElRadioGroup>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="执行策略" prop="misfirePolicy">
              <ElRadioGroup v-model="form.misfirePolicy">
                <ElRadioButton value="1">立即执行</ElRadioButton>
                <ElRadioButton value="2">执行一次</ElRadioButton>
                <ElRadioButton value="3">放弃执行</ElRadioButton>
              </ElRadioGroup>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="是否并发" prop="concurrent">
              <ElRadioGroup v-model="form.concurrent">
                <ElRadioButton value="0">允许</ElRadioButton>
                <ElRadioButton value="1">禁止</ElRadioButton>
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

    <ElDialog title="Cron表达式生成器" v-model="openCron" append-to-body destroy-on-close>
      <CronTab @hide="!openCron" @fill="crontabFill" :expression="expression" />
    </ElDialog>

    <!-- 任务日志详细 -->
    <ElDialog title="任务详细" v-model="openView" width="700px" append-to-body>
      <ElForm :model="form" label-width="120px">
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="任务编号：">{{ form.jobId }}</ElFormItem>
            <ElFormItem label="任务名称：">{{ form.jobName }}</ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="任务分组：">{{ jobGroupFormat(form) }}</ElFormItem>
            <ElFormItem label="创建时间：">{{ form.createTime }}</ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="cron表达式：">{{ form.cronExpression }}</ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="下次执行时间：">{{ parseTime(form.nextValidTime) }}</ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="调用目标方法：">{{ form.invokeTarget }}</ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="任务状态：">
              <div v-if="form.status == 0">正常</div>
              <div v-else-if="form.status == 1">暂停</div>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="是否并发：">
              <div v-if="form.concurrent == 0">允许</div>
              <div v-else-if="form.concurrent == 1">禁止</div>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="执行策略：">
              <div v-if="form.misfirePolicy == 0">默认策略</div>
              <div v-else-if="form.misfirePolicy == 1">立即执行</div>
              <div v-else-if="form.misfirePolicy == 2">执行一次</div>
              <div v-else-if="form.misfirePolicy == 3">放弃执行</div>
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="openView = false">关 闭</ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>
