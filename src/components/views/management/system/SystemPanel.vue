<script setup lang="ts">
import {ElTabPane, ElTabs} from "element-plus";
import {inject, ref} from "vue";
import {widgetKey} from "../../../../ts/widgets/Widget.ts";
import User from "./User.vue";
import Role from "./Role.vue";
import Department from "./Department.vue";
import Post from "./Post.vue";
import Dictionary from "./Dictionary.vue";
import Announcement from "./Announcement.vue";

const activeName = ref<string>('user');
const widget = inject(widgetKey);
widget?.setWindowTitle('系统管理 - 用户管理');
const onTabChange = (name: string | number) => {
  switch (name) {
    default: break;
    case 'user': {
      widget!.setWindowTitle('系统管理 - 用户管理');
      break;
    }
    case 'role': {
      widget!.setWindowTitle('系统管理 - 角色管理');
      break;
    }
    case 'dept': {
      widget!.setWindowTitle('系统管理 - 部门管理');
      break;
    }
    case 'post': {
      widget!.setWindowTitle('系统管理 - 岗位管理');
      break;
    }
    case 'dict': {
      widget!.setWindowTitle('系统管理 - 字典管理');
      break;
    }
    case 'announce': {
      widget!.setWindowTitle('系统管理 - 通知公告');
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
    <ElTabPane lazy label="用户管理" name="user">
      <User />
    </ElTabPane>
    <ElTabPane lazy label="角色管理" name="role">
      <Role/>
    </ElTabPane>
    <ElTabPane lazy label="部门管理" name="dept">
      <Department/>
    </ElTabPane>
    <ElTabPane lazy label="岗位管理" name="post">
      <Post/>
    </ElTabPane>
    <ElTabPane lazy label="字典管理" name="dict">
      <Dictionary/>
    </ElTabPane>
    <ElTabPane lazy label="通知公告" name="announce">
      <Announcement/>
    </ElTabPane>
  </ElTabs>
</template>

<style scoped>

</style>