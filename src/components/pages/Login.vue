<script setup lang="ts">
import {onBeforeMount, ref, watch} from "vue";
import {ElSkeleton, ElForm, ElFormItem, ElInput, ElButton, ElIcon, ElCheckbox, ElLink, ElTooltip} from 'element-plus';
import {User, Lock, Warning} from '@element-plus/icons-vue';
import Background from "../misc/LoginBackground.vue";
import {LocationQuery, LocationQueryValue, useRoute, useRouter} from "vue-router";
import useUserStore from "../../ts/store/UserStore.ts";
import Api from "../../ts/common/Api.ts";
import Cookies from "js-cookie";
import OpenSourceDisclaimer from "../widgets/dialog/OpenSourceDisclaimer.vue";
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const loginRef = ref<InstanceType<typeof ElForm>>();
const loginForm = ref<{
  username: string;
  password: string;
  rememberMe: boolean;
  code: string;
  uuid: string;
}>({
  username: "admin",
  password: "admin123",
  rememberMe: false,
  code: "",
  uuid: ""
});
const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }]
};
const codeUrl = ref<string>("");
const loading = ref<boolean>(false);
// 验证码开关
const captchaEnabled = ref<boolean>(true);
// 注册开关
const redirect = ref<string | LocationQuery | LocationQueryValue | LocationQueryValue[]>();

watch(route, (newRoute) => {
  redirect.value = newRoute.query && newRoute.query.redirect;
}, { immediate: true });

const handleLogin = () => {
  loginRef.value!.validate(valid => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, { expires: 30 });
        Cookies.set("password", loginForm.value.password, { expires: 30 });
        Cookies.set("rememberMe", String(loginForm.value.rememberMe), { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法
      userStore.login(loginForm.value).then(() => {
        const query = route.query;
        const otherQueryParams = Object.keys(query).reduce((acc: LocationQuery, cur: string) => {
          if (cur !== "redirect") {
            acc[cur] = query[cur];
          }
          return acc;
        }, {});
        router.push({
          path: redirect.value as string || "/view/map",
          query: otherQueryParams
        });
      }).catch(() => {
        loading.value = false;
        // 重新获取验证码
        if (captchaEnabled.value) {
          getCode();
        }
      });
    }
  });
};
const isAboutUsOpen = ref<boolean>(false);
const isCodeReady = ref<boolean>(false);
const getCode = () => {
  Api.getCodeImg().then(res => {
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      loginForm.value.uuid = res.uuid;
      isCodeReady.value = true;
    }
  });
}
const getCookie = () => {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  if(loginForm.value) {
    loginForm.value.username = username === undefined ? loginForm.value.username : username;
    loginForm.value.password = password === undefined ? loginForm.value.password : password;
    loginForm.value.rememberMe = rememberMe === undefined ? false : Boolean(rememberMe);
  }
}
onBeforeMount(() => {
  getCode();
  getCookie();
});
</script>

<template>
  <div class="login">
    <ElForm ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title" style="display: flex; align-items: center; justify-content: center;">
        <img src="/logo.svg" alt="logo" class="logo" style="height: 1.5em; margin-right: 0.4em;" />
        电网设备数字孪生管理系统
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
      <ElFormItem prop="code" v-if="captchaEnabled">
        <ElInput
            v-model="loginForm.code"
            size="large"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter="handleLogin"
        >
          <template #prefix>
            <img class="el-input__icon input-icon" src="/images/icons/validCode.svg" alt="captcha prefix"/>
          </template>
        </ElInput>
        <ElTooltip :show-after="500" :content="isCodeReady ? '刷新验证码' : '验证码加载中...'">
          <div class="login-code">
            <img
                v-show="isCodeReady" :src="codeUrl"
                @load="isCodeReady = true"
                @click="getCode" class="login-code-img" alt="captcha image"
            />
            <ElSkeleton
                style="height: 100%; padding: 0; overflow: hidden; transform: scale(0.5);"
                v-if="!isCodeReady" :rows="1" animated
            />
          </div>
        </ElTooltip>
      </ElFormItem>
      <ElCheckbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</ElCheckbox>
      <span style="font-size: 0.7em; color: #777; padding-left: 1em;">
        <ElIcon><Warning/></ElIcon>
        请勿在公用计算机上勾选此选项
      </span>
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
      <span style="cursor: pointer;" @click="isAboutUsOpen = true">
        版权所有 © {{new Date().getFullYear()}} Ryker Zhu
        <OpenSourceDisclaimer @closed="isAboutUsOpen = false" v-if="isAboutUsOpen"/>
      </span>
      <ElTooltip v-once raw-content :teleported="false" content="点我跳转到作者 GitHub 主页">
        <ElLink type="primary" target="_blank" href="https://github.com/DevExzh/">
          （<svg viewBox="0 0 98 96"
                style="height: 1em; width: 1em; vertical-align: middle; fill: var(--el-link-text-color);"
        >
          <path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/>
        </svg>
          &ensp;@DevExzh）
        </ElLink>
      </ElTooltip>
    </div>
    <Background/>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-skeleton__paragraph) {
  margin-top: 0.2em;
}
:deep(.el-form-item__content) {
  line-height: 1em;
}
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
  background: linear-gradient(to top, #536DFE, #03A9F4);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.logo {
  animation: rotation 10s infinite alternate-reverse linear;
}
.login-form {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 6px;
  background: #ffffff;
  box-shadow: 4pt 4pt 8pt rgba(100%, 100%, 100%, 0.2);
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
  color: rgba(100%, 100%, 100%, 0.5);
  font-family: Arial,sans-serif;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
