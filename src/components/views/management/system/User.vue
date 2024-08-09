<script setup lang="ts">
import {
  ElForm, ElTable, ElInput, ElButton, ElSelect, ElOption, ElSwitch, ElDatePicker,
  ElTree, ElDialog, ElUpload, ElTooltip, ElCheckbox, ElLink, ElMessage, ElTreeSelect, ElMessageBox, ElRadio, UploadFile
} from "element-plus";
import {reactive, ref, toRefs, watch, onMounted} from "vue";
import {Search, Refresh, Plus, Edit, Delete, Upload, Download,
  Key, CircleCheck, UploadFilled
} from "@element-plus/icons-vue";
import {useDict} from "../../../../ts/store/DictStore.ts";
import {baseURL, tokenKey} from "../../../../ts/common/Request.ts";
import Cookies from "js-cookie";
import Api from "../../../../ts/common/Api.ts";
import {addDateRange, parseTime} from "../../../../ts/common/Utils.ts";
import Pagination from "../../../widgets/layout/Pagination.vue";
import {DateRange} from "../../../../ts/common/Types.ts";
import {Menu, PostInfo, RoleInfo, UserInfo} from "../../../../ts/common/ApiTypes.ts";
import RightToolBar from "../../../widgets/form/RightToolBar.vue";

const {sys_normal_disable, sys_user_sex} = useDict("sys_normal_disable", "sys_user_sex");

const userList = ref<UserInfo[]>([]);
const loading = ref(false);
const open = ref(false);
const showSearch = ref(true);
const ids = ref<number[]>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref<DateRange>();
const deptName = ref("");
const deptOptions = ref<Menu[]>([]);
const initPassword = ref("");
const postOptions = ref<PostInfo[]>([]);
const roleOptions = ref<RoleInfo[]>([]);
const upload = reactive({
  open: false,
  title: "",
  isUploading: false,
  updateSupport: 0,
  headers: {Authorization: "Bearer " + Cookies.get(tokenKey)},
  url: baseURL + "/system/user/importData"
});
const columns = ref([
  {key: 0, label: "用户编号", visible: true},
  {key: 1, label: "用户名称", visible: true},
  {key: 2, label: "用户昵称", visible: true},
  {key: 3, label: "部门", visible: true},
  {key: 4, label: "手机号码", visible: true},
  {key: 5, label: "状态", visible: true},
  {key: 6, label: "创建时间", visible: true}
]);

const userRef = ref<InstanceType<typeof ElForm>>();
const uploadRef = ref<InstanceType<typeof ElUpload>>();
const deptTreeRef = ref<InstanceType<typeof ElTree>>();
const queryRef = ref<InstanceType<typeof ElForm>>();

const data = reactive<{
  form: Record<string, any>;
  queryParams: Record<string, any>;
  rules: Record<string, any>;
}>({
  form: {
    userId: undefined,
    deptId: undefined,
    userName: undefined,
    nickName: undefined,
    password: undefined,
    phonenumber: undefined,
    email: undefined,
    sex: undefined,
    status: "0",
    remark: undefined,
    postIds: [],
    roleIds: []
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    phonenumber: undefined,
    status: undefined,
    deptId: undefined
  },
  rules: {
    userName: [{required: true, message: "用户名称不能为空", trigger: "blur"}, {
      min: 2,
      max: 20,
      message: "用户名称长度必须介于 2 和 20 之间",
      trigger: "blur"
    }],
    nickName: [{required: true, message: "用户昵称不能为空", trigger: "blur"}],
    password: [{required: true, message: "用户密码不能为空", trigger: "blur"}, {
      min: 5,
      max: 20,
      message: "用户密码长度必须介于 5 和 20 之间",
      trigger: "blur"
    }, {pattern: /^[^<>"'|\\]+$/, message: "不能包含非法字符：< > \" ' \\\ |", trigger: "blur"}],
    email: [{type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"]}],
    phonenumber: [{pattern: /^1[3456789][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur"}]
  }
});
const {queryParams, form, rules} = toRefs(data);

const filterNode = (value: any, data: any, _: any): boolean => {
  if (!value) return true;
  return data.label.includes(value);
};

watch(deptName, val => {
  deptTreeRef.value!.filter(val);
});

const getDeptTree = () => {
  Api.System.User.deptTreeSelect().then(response => {
    deptOptions.value = response.data;
  });
};

const getList = () => {
  loading.value = true;
  Api.System.User.listUser(addDateRange(queryParams.value, dateRange.value!)).then(res => {
    loading.value = false;
    userList.value = res.rows;
    total.value = res.total;
  });
};

const handleNodeClick = (data: any) => {
  queryParams.value.deptId = data.id;
  handleQuery();
};

const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

const resetQuery = () => {
  dateRange.value = [];
  queryRef.value!.resetFields();
  queryParams.value.deptId = undefined;
  deptTreeRef.value!.setCurrentKey(undefined);
  handleQuery();
};

const handleDelete = (row: any) => {
  const userIds = row.userId || ids.value[0];
  ElMessageBox.confirm(`是否确认删除用户编号为 "${userIds}" 的数据项？`, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  }).then(() => Api.System.User.deleteUser(userIds)).then(() => {
    getList();
    ElMessage.success("删除成功");
  });
};

const handleExport = () => {
  // download("system/user/export", {...queryParams.value}, `user_${new Date().getTime()}.xlsx`);
};

const handleStatusChange = (row: UserInfo) => {
  const text = row.status === "0" ? "启用" : "停用";
  ElMessageBox.confirm(`确认要 ${text} "${row.userName}" 用户吗?`, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  })
      .then(() => Api.System.User.changeUserStatus(row.userId, row.status))
      .then(() => ElMessage.success(text + "成功")).catch(() => {
        row.status = row.status === "0" ? "1" : "0";
      });
};

const handleAuthRole = (_: any) => {
  // const userId = row.userId;
  // router.push("/system/user-auth/role/" + userId);
};

const handleResetPwd = (row: UserInfo) => {
  ElMessageBox.prompt(`请输入 "${row.userName}" 的新密码`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    inputPattern: /^.{5,20}$/,
    inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
  }).then(({value}) => {
    Api.System.User.resetUserPwd(row.userId, value).then(() => {
      ElMessage.success("修改成功，新密码是：" + value);
    });
  });
};

const handleSelectionChange = (selection: UserInfo[]) => {
  ids.value = selection.map(item => item.userId);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
};

const handleImport = () => {
  upload.title = "用户导入";
  upload.open = true;
};

const importTemplate = () => {
  // download("system/user/importTemplate", {}, `user_template_${new Date().getTime()}.xlsx`);
};

const handleFileSuccess = (response: any, file: UploadFile) => {
  upload.open = false;
  upload.isUploading = false;
  uploadRef.value!.handleRemove(file);
  ElMessageBox.alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>"
      + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};

const submitFileForm = () => {
  uploadRef.value!.submit();
};

const reset = () => {
  form.value = {
    userId: undefined,
    deptId: undefined,
    userName: undefined,
    nickName: undefined,
    password: undefined,
    phonenumber: undefined,
    email: undefined,
    sex: undefined,
    status: "0",
    remark: undefined,
    postIds: [],
    roleIds: []
  };
  userRef.value?.resetFields();
};

const cancel = () => {
  open.value = false;
  reset();
};

const handleAdd = () => {
  reset();
  Api.System.User.getUser().then(response => {
    postOptions.value = response.posts;
    roleOptions.value = response.roles;
    open.value = true;
    title.value = "添加用户";
    form.value.password = initPassword.value;
  });
};

const handleUpdate = (row: any) => {
  reset();
  const userId = row.userId || ids.value[0];
  Api.System.User.getUser(userId).then(response => {
    form.value = response.data;
    postOptions.value = response.posts;
    roleOptions.value = response.roles;
    form.value.postIds = response.postIds;
    form.value.roleIds = response.roleIds;
    open.value = true;
    title.value = "修改用户";
    form.value.password = "";
  });
};

const submitForm = () => {
  userRef.value!.validate(valid => {
    if (valid) {
      if (form.value.userId) {
        Api.System.User.updateUser(form.value).then(() => {
          ElMessage.success("修改成功");
          open.value = false;
          getList();
        });
      } else {
        Api.System.User.addUser(form.value).then(() => {
          ElMessage.success("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
};
onMounted(() => {
  getDeptTree();
  getList();
});
</script>

<template>
  <div :class="{'loading-area': loading}" v-loading="loading">
    <ElRow :gutter="20">
      <!--部门数据-->
      <ElCol :span="4" :xs="24">
        <div class="head-container">
          <ElInput
              v-model="deptName"
              placeholder="请输入部门名称"
              clearable
              :prefix-icon="Search"
              style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <ElTree
              :data="deptOptions"
              :props="{ label: 'label', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="deptTreeRef"
              node-key="id"
              highlight-current
              default-expand-all
              @node-click="handleNodeClick"
          />
        </div>
      </ElCol>
      <!--用户数据-->
      <ElCol :span="20" :xs="24">
        <ElForm :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <ElFormItem label="用户名称" prop="userName">
            <ElInput
                v-model="queryParams.userName"
                placeholder="请输入用户名称"
                clearable
                style="width: 240px"
                @keyup.enter="handleQuery"
            />
          </ElFormItem>
          <ElFormItem label="手机号码" prop="phonenumber">
            <ElInput
                v-model="queryParams.phonenumber"
                placeholder="请输入手机号码"
                clearable
                style="width: 240px"
                @keyup.enter="handleQuery"
            />
          </ElFormItem>
          <ElFormItem label="状态" prop="status">
            <ElSelect
                v-model="queryParams.status"
                placeholder="用户状态"
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
          <ElFormItem label="创建时间" style="width: 308px;">
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
                v-has-permission="['system:user:add']"
            >新增
            </ElButton>
          </ElCol>
          <ElCol :span="1.5">
            <ElButton
                type="success"
                plain
                :icon="Edit"
                :disabled="single"
                @click="handleUpdate"
                v-has-permission="['system:user:edit']"
            >修改
            </ElButton>
          </ElCol>
          <ElCol :span="1.5">
            <ElButton
                type="danger"
                plain
                :icon="Delete"
                :disabled="multiple"
                @click="handleDelete"
                v-has-permission="['system:user:remove']"
            >删除
            </ElButton>
          </ElCol>
          <ElCol :span="1.5">
            <ElButton
                type="info"
                plain
                :icon="Upload"
                @click="handleImport"
                v-has-permission="['system:user:import']"
            >导入
            </ElButton>
          </ElCol>
          <ElCol :span="1.5">
            <ElButton
                type="warning"
                plain
                :icon="Download"
                @click="handleExport"
                v-has-permission="['system:user:export']"
            >导出
            </ElButton>
          </ElCol>
          <RightToolBar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></RightToolBar>
        </ElRow>

        <ElTable v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <ElTableColumn type="selection" width="50" align="center"/>
          <ElTableColumn label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible"/>
          <ElTableColumn label="用户名称" align="center" key="userName" prop="userName" v-if="columns[1].visible"
                         :show-overflow-tooltip="true"/>
          <ElTableColumn label="用户昵称" align="center" key="nickName" prop="nickName" v-if="columns[2].visible"
                         :show-overflow-tooltip="true"/>
          <ElTableColumn label="部门" align="center" key="deptName" prop="dept.deptName" v-if="columns[3].visible"
                         :show-overflow-tooltip="true"/>
          <ElTableColumn label="手机号码" align="center" key="phonenumber" prop="phonenumber"
                         v-if="columns[4].visible" width="120"/>
          <ElTableColumn label="状态" align="center" key="status" v-if="columns[5].visible">
            <template #default="scope">
              <ElSwitch
                  v-model="scope.row.status"
                  active-value="0"
                  inactive-value="1"
                  @change="handleStatusChange(scope.row)"
              ></ElSwitch>
            </template>
          </ElTableColumn>
          <ElTableColumn label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template #default="scope">
              <ElTooltip content="修改" placement="top" v-if="scope.row.userId !== 1">
                <ElButton link type="primary" :icon="Edit" @click="handleUpdate(scope.row)"
                          v-has-permission="['system:user:edit']"></ElButton>
              </ElTooltip>
              <ElTooltip content="删除" placement="top" v-if="scope.row.userId !== 1">
                <ElButton link type="primary" :icon="Delete" @click="handleDelete(scope.row)"
                          v-has-permission="['system:user:remove']"></ElButton>
              </ElTooltip>
              <ElTooltip content="重置密码" placement="top" v-if="scope.row.userId !== 1">
                <ElButton link type="primary" :icon="Key" @click="handleResetPwd(scope.row)"
                          v-has-permission="['system:user:resetPwd']"></ElButton>
              </ElTooltip>
              <ElTooltip content="分配角色" placement="top" v-if="scope.row.userId !== 1">
                <ElButton link type="primary" :icon="CircleCheck" @click="handleAuthRole(scope.row)"
                          v-has-permission="['system:user:edit']"></ElButton>
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
      </ElCol>
    </ElRow>

    <!-- 添加或修改用户配置对话框 -->
    <ElDialog :title="title" v-model="open" width="600px" append-to-body>
      <ElForm :model="form" :rules="rules" ref="userRef" label-width="80px">
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="用户昵称" prop="nickName">
              <ElInput v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30"/>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="归属部门" prop="deptId">
              <ElTreeSelect
                  v-model="form.deptId"
                  :data="deptOptions"
                  :props="{ value: 'id', label: 'label', children: 'children' }"
                  value-key="id"
                  placeholder="请选择归属部门"
                  check-strictly
              />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="手机号码" prop="phonenumber">
              <ElInput v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11"/>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="邮箱" prop="email">
              <ElInput v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="12">
            <ElFormItem v-if="form.userId == undefined" label="用户名称" prop="userName">
              <ElInput v-model="form.userName" placeholder="请输入用户名称" maxlength="30"/>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem v-if="form.userId == undefined" label="用户密码" prop="password">
              <ElInput v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20"
                       show-password/>
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="用户性别">
              <ElSelect v-model="form.sex" placeholder="请选择">
                <ElOption
                    v-for="dict in sys_user_sex"
                    :key="dict['value']"
                    :label="dict['label']"
                    :value="dict['value']"
                ></ElOption>
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="状态">
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
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="岗位">
              <ElSelect v-model="form.postIds" multiple placeholder="请选择">
                <ElOption
                    v-for="item in postOptions"
                    :key="item.postId"
                    :label="item.postName"
                    :value="item.postId"
                    :disabled="+item.status == 1"
                ></ElOption>
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="角色">
              <ElSelect v-model="form.roleIds" multiple placeholder="请选择">
                <ElOption
                    v-for="item in roleOptions"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                    :disabled="+item.status == 1"
                ></ElOption>
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="24">
            <ElFormItem label="备注">
              <ElInput v-model="form.remark" type="textarea" placeholder="请输入内容"></ElInput>
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

    <!-- 用户导入对话框 -->
    <ElDialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <ElUpload
          ref="uploadRef"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
          :disabled="upload.isUploading"
          :on-progress="() => upload.isUploading = true"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
      >
        <ElIcon class="el-icon--upload">
          <UploadFilled/>
        </ElIcon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <ElCheckbox v-model="upload.updateSupport"/>
              是否更新已经存在的用户数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <ElLink type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                    @click="importTemplate">下载模板
            </ElLink>
          </div>
        </template>
      </ElUpload>
      <template #footer>
        <div class="dialog-footer">
          <ElButton type="primary" @click="submitFileForm">确 定</ElButton>
          <ElButton @click="upload.open = false">取 消</ElButton>
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
