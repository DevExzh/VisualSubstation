<script setup lang="ts">
import Widget from "../layout/Widget.vue";
import {ElScrollbar} from "element-plus";
import {onMounted, ref} from "vue";
const notice = ref<string>('');
onMounted(() => {
  fetch('/NOTICE', { cache: 'force-cache' })
      .then(val => val.text())
      .then(txt => notice.value =
          txt.replace(/\n/g, '<br>')
              .replace(/(https?:\/\/[^\s)\]}>"'<]+)/, url => `<a href="${url}">${url}</a>`)
      );
});
</script>

<template>
  <Widget window-title="关于本项目" window-icon="/logo.svg" :control-buttons="['close']">
    <ElScrollbar>
      <div class="content">
        <div class="header">
          <img src="/logo.svg" alt="logo" class="logo" />
          <span class="title">Visual Substation</span>
        </div>
        <div class="splitter"/>
        <div style="width: 100%; text-align: center; margin-bottom: 1em;">
          <svg viewBox="0 0 1024 1024" style="height: 1em;">
            <path fill="#000" d="M469.333 85.333v341.334h-42.666V128h-85.334v496s-106.325-69.333-128-69.333c-78.165 0-85.333 42.666-85.333 42.666l214.656 288a137.13 137.13 0 0 0 109.355 53.334H640c94.293 0 170.667-76.374 170.667-170.667V213.333h-85.334v253.355l-42.666-6.699V128h-85.334v318.677l-42.666-6.656V85.333zm8.022 469.334 77.312 77.354 77.354-77.354 50.646 50.688-77.355 77.312 77.355 77.354-50.688 50.646-77.312-77.355-77.355 77.355-50.645-50.688 77.354-77.312-77.354-77.355z"/>
          </svg>
          &ensp;<b>开源许可免责说明</b><br>
          <span style="font-size: small;">
            对本系统的使用、分发或修改意味着您理解并同意许可证所列事项
            <br>Licensed under Apache License, version 2.0<br>
            You may obtain a copy of license from Apache Software Foundation.
          </span>
        </div>
        <div style="font-size: smaller;" v-html="notice"/>
      </div>
    </ElScrollbar>
  </Widget>
</template>

<style lang="scss" scoped>
.content {
  margin: 1em;
  .header {
    display: flex;
    align-items: center;
    padding-bottom: 0.5em;
    .logo {
      height: 3em;
      margin-right: 0.75em;
    }
    .title {
      font-size: 1.75em;
      font-weight: bold;
      display: flex;
      flex-direction: column;
      gap: 0.1em;
      &::after {
        content: '电网设备数字孪生管理系统';
        font-weight: normal;
        font-size: 0.5em;
      }
    }
  }
  .splitter {
    content: '';
    flex-shrink: 0;
    width: 100%;
    height: 1pt;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.5), transparent);
    margin-bottom: 0.5em;
  }
}
</style>