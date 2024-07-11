<script setup lang="ts">
</script>

<template>
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
