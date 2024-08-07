<script setup lang="ts">
</script>

<template>
  <svg width="0" height="0" style="visibility: hidden;">
    <defs>
      <linearGradient id="header-bg" x1="0%" x2="99.111%" y1="50%" y2="50%">
        <stop offset="0%" stop-color="#1F87CC" stop-opacity=".302"/>
        <stop offset="100%" stop-color="#1F87CC" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="header-bg-stroke" x1="0%" x2="92.145%" y1="50%" y2="50%">
        <stop offset="0%" stop-color="#5EBCF5" stop-opacity=".4"/>
        <stop offset="100%" stop-color="#5EBCF5" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottom-deco" x1="0%" x2="100%" y1="49.817%" y2="49.817%">
        <stop offset="0%" stop-color="#59BFFF" stop-opacity="0"/>
        <stop offset="28.99%" stop-color="#59BFFF" stop-opacity=".851"/>
        <stop offset="50.97%" stop-color="#ABDFFF"/>
        <stop offset="71.81%" stop-color="#59BFFF" stop-opacity=".651"/>
        <stop offset="100%" stop-color="#59BFFF" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="decorated-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
        <stop offset="71%" style="stop-color:#C2E7FF;stop-opacity:1" />
        <stop offset="87%" style="stop-color:#95D5FF;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8DD2FF;stop-opacity:1" />
      </linearGradient>
    </defs>
  </svg>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <div :key="$route.path">
        <Component :is="Component" />
      </div>
    </Transition>
  </RouterView>
</template>

<style>
* {
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
