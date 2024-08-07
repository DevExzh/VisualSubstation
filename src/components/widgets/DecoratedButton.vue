<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {pixels} from "../../ts/common/Utils.ts";
const props = withDefaults(defineProps<{
  // 按钮样式
  type?: 'circle' | 'hexagon',
  size?: string | number,
  tooltip?: string,
  tooltipPlacement?: string,
  onClick?: () => void
}>(), {
  type: 'circle',
  size: '2.5rem',
  tooltip: '',
  tooltipPlacement: 'bottom',
  onClick: () => {}
});
const iconSize = ref<string>(pixels(props.size) + 'px');
const iconStyle = reactive<Record<string, any>>({
  'background-size': '100% 100%'
});
onMounted(() => {
  switch (props.type) {
    case 'circle': {
      iconStyle['background-image'] = 'url(/images/icon-circle-border.svg)';
      break;
    }
    case "hexagon": {
      iconStyle['background-image'] = 'url(/images/icon-hexagon-border.svg)';
      break;
    }
  }
});
</script>

<template>
  <ElTooltip :disabled="$props.tooltip === ''" :content="$props.tooltip" :placement="tooltipPlacement">
    <div
        class="icon-container"
        @click="$props.onClick"
        :style="iconStyle"
    >
      <div class="icon"><slot/></div>
    </div>
  </ElTooltip>
</template>

<style lang="scss" scoped>
$iconSize: v-bind(iconSize);
.icon-container {
  width: $iconSize;
  height: $iconSize;
  cursor: pointer;
  user-select: none;
  pointer-events: auto;
  position: relative;
  & .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 20%;
    left: 20%;
    width: 60%;
    height: 60%;
  }
}
</style>