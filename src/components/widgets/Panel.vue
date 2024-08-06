<script setup lang="ts">
import {reactive} from "vue";
const props = withDefaults(defineProps<{
  side: 'left' | 'right',
  // 离停靠边的距离
  spacing?: string | number,
  top?: string,
  left?: string,
  right?: string,
  bottom?: string,
  show?: boolean,
}>(), {
  spacing: '0.5rem',
  top: '0px',
  left: '0px',
  right: '0px',
  bottom: '0px',
  show: true,
});
const panelStyle = reactive<Record<string, any>>({
  margin: props.top + ' ' + props.right + ' ' + props.bottom + ' ' + props.left,
});
panelStyle['padding-' + props.side] = props.spacing;
</script>

<template>
  <transition
      :name="$props.side" mode="out-in"
  >
    <ElScrollbar
      v-show="$props.show"
      :class="$props.side"
      :style="panelStyle"
      :height="`calc(100vh - ${$props.top} - ${props.bottom})`"
    >
      <slot />
    </ElScrollbar>
  </transition>
</template>

<style lang="scss" scoped>
// 把出现在左侧的面板的滚动条放到左边去
.left > :deep(.el-scrollbar__bar) {
  left: 2px;
  right: auto;
}
$sides: left, right, top, bottom;
@for $i from 1 through length($sides) {
  $side: nth($sides, $i);
  .#{$side} {
    position: absolute;
    #{$side}: 0;
    height: 100vh;
    z-index: 5;
    background: linear-gradient(to #{$side}, transparent, rgba(20, 20, 20, 0.8));
  }
}
.right-enter-from, .right-leave-to,
.left-enter-from, .left-leave-to {
  opacity: 0;
}
.left-enter-from, .left-leave-to {
  left: -25%;
}
.right-enter-from, .right-leave-to {
  right: -25%;
}
.right-enter-to, .right-leave-from,
.left-enter-to, .left-leave-from {
  opacity: 1;
}
.left-enter-to, .left-leave-from {
  left: 0;
}
.right-enter-to, .right-leave-from {
  right: 0;
}
.right-enter-active, .right-leave-active,
.left-enter-active, .left-leave-active {
  transition: all 1s ease-out;
}
</style>