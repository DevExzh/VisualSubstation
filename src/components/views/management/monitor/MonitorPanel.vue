<script setup lang="ts">
import {ElTabs, ElTabPane} from "element-plus";
import {inject, ref} from "vue";
import {widgetKey} from "../../../../ts/widgets/Widget.ts";
import Server from "./Server.vue";
import LoginInfo from "./LoginInfo.vue";
import OperationLog from "./OperationLog.vue";
import Cache from "./Cache.vue";
import Job from "./Job.vue";
import UserOnline from "./UserOnline.vue";
const activeName = ref<string>('server');
const widget = inject(widgetKey);
widget?.setWindowTitle('系统监控 - 服务器监控');
const onTabChange = (name: string | number) => {
  switch (name) {
    default: break;
    case 'server': {
      widget!.setWindowTitle('系统监控 - 服务器监控');
      break;
    }
    case 'cache': {
      widget!.setWindowTitle('系统监控 - 缓存监控');
      break;
    }
    case 'job': {
      widget!.setWindowTitle('系统监控 - 定时任务');
      break;
    }
    case 'userOnline': {
      widget!.setWindowTitle('系统监控 - 在线用户');
      break;
    }
    case 'loginInfo': {
      widget!.setWindowTitle('系统监控 - 登录信息');
      break;
    }
    case 'operationLog': {
      widget!.setWindowTitle('系统监控 - 操作记录');
      break;
    }
  }
};
</script>

<template>
  <ElTabs
      v-model="activeName"
      @tabChange="onTabChange"
      type="border-card"
  >
    <ElTabPane lazy label="服务器监控" name="server">
      <Server/>
    </ElTabPane>
    <ElTabPane lazy label="缓存监控" name="cache">
      <Cache/>
    </ElTabPane>
    <ElTabPane lazy label="定时任务" name="job">
      <Job/>
    </ElTabPane>
    <ElTabPane lazy label="在线用户" name="userOnline">
      <UserOnline/>
    </ElTabPane>
    <ElTabPane lazy label="登录信息" name="loginInfo">
      <LoginInfo/>
    </ElTabPane>
    <ElTabPane lazy label="操作记录" name="operationLog">
      <OperationLog/>
    </ElTabPane>
  </ElTabs>
</template>

<style scoped>
</style>