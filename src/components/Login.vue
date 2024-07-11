<script setup lang="ts">
import {ref} from "vue";
import {ElForm, ElFormItem, ElInput, ElButton, ElIcon, ElCheckbox, ElLink} from 'element-plus';
import {User, Lock} from '@element-plus/icons-vue';
import Background from "./misc/LoginBackground.vue";
import {useRouter} from "vue-router";
const router = useRouter();
const loginForm = ref({
  username: "admin",
  password: "admin123",
  rememberMe: false,
  code: "",
  uuid: ""
});
const loading = ref(false);
const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }]
};
const handleLogin = () => {
  sessionStorage.setItem('isLoggedIn', 'yes');
  router.replace({
    name: 'home'
  });
};
</script>

<template>
  <div class="login">
    <ElForm ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">
        <div style="display: flex; align-items: center; justify-content: center;">
          <img src="/logo.svg" alt="logo" style="height: 1.5em; margin-right: 0.4em;" />
          电网设备数字孪生管理系统
        </div>
      </h3>
      <ElFormItem prop="username">
        <ElInput
          v-model="loginForm.username"
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix>
            <ElIcon class="input-icon">
              <User />
            </ElIcon>
          </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem prop="password">
        <ElInput
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <ElIcon class="input-icon">
              <Lock />
            </ElIcon>
          </template>
        </ElInput>
      </ElFormItem>
      <ElCheckbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</ElCheckbox>
      <ElFormItem style="width:100%;">
        <ElButton
          :loading="loading"
          size="large"
          type="primary"
          style="width:100%;"
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </ElButton>
      </ElFormItem>
    </ElForm>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>版权所有 © 2024 Ryker Zhu (<ElLink>@DevExzh</ElLink>)</span>
    </div>
    <Background/>
  </div>
</template>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 6px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial,sans-serif;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
