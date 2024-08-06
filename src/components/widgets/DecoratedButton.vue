<script setup lang="ts">
import {ref} from "vue";
import {pixels} from "../../ts/common/Utils.ts";
const props = withDefaults(defineProps<{
  // 按钮样式
  type?: 'circle' | 'hexagon',
  size?: string | number,
}>(), {
  type: 'circle',
  size: '3rem',
});
const iconSize = ref<string>(pixels(props.size) + 'px');
</script>

<template>
  <div
      class="icon-container"
  >
    <div class="icon">
      <slot/>
    </div>
    <img
        class="icon-background"
        v-if="$props.type === 'circle'" v-once
        src="/images/icon-circle-border.svg" alt="border"
    />
    <img
        class="icon-background"
        v-if="$props.type === 'hexagon'" v-once
        src="/images/icon-hexagon-border.svg" alt="border"
    />
  </div>
</template>

<style lang="scss" scoped>
$iconSize: v-bind(iconSize);
.icon-container {
  width: $iconSize;
  height: $iconSize;
  cursor: pointer;
  & .icon {
    position: absolute;
    top: 20%;
    left: 20%;
    width: 60%;
    height: 60%;
    z-index: 3;
  }
  & .icon-background {
    position: absolute;
    top: 0;
    left: 0;
    // 只需要高度占满即可
    height: 100%;
  }
}
</style>