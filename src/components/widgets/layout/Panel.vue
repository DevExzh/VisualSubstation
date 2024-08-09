<script setup lang="ts">
import {computed, reactive, watch, onMounted} from "vue";
import {pixels} from "../../../ts/common/Utils.ts";
import usePanelStore from "../../../ts/store/PanelStore.ts";
const props = withDefaults(defineProps<{
  side: 'left' | 'right',
  // 离停靠边的距离
  spacing?: string | number,
  top?: string,
  left?: string,
  right?: string,
  bottom?: string,
}>(), {
  spacing: '1rem',
  top: '0px',
  left: '0px',
  right: '0px',
  bottom: '0px',
});
const visible = defineModel<boolean>('show', {default: true});
const contentSpacing = computed<string>(() => `${pixels(props.spacing)}px`);
const panelStyle = reactive<Record<string, any>>({
  margin: props.top + ' ' + props.right + ' ' + props.bottom + ' ' + props.left,
  background: `linear-gradient(to ${props.side}, transparent, rgba(20, 20, 20, 0.8))`,
});
panelStyle['padding-' + props.side] = props.spacing;
const state = usePanelStore();
const setVisibility = (value: boolean, onlyThis: boolean = false) => {
  if(onlyThis) {
    visible.value = value;
  } else {
    state.setVisibility(value);
  }
};
const toggleVisibility = () => {
  setVisibility(!visible.value);
};
const ops = {setVisibility, toggleVisibility};
defineExpose(ops);
const pinnedStyle = reactive<Record<string, any>>({});
pinnedStyle[props.side] = '0';
watch(visible, val => {
  pinnedStyle[props.side] = val ? '100%' : '0';
});
onMounted(() => {
  state.setFunctions.push(setVisibility);
});
</script>

<template>
  <div :class="$props.side">
    <div :class="'pinned-' + $props.side" v-if="$slots.pin" :style="pinnedStyle">
      <slot name="pin" :operations="ops" :visible="visible"/>
    </div>
    <transition
        :name="$props.side" mode="out-in"
    >
      <ElScrollbar
          v-show="visible"
          :class="{'left-area': $props.side === 'left'}"
          :style="panelStyle"
          :height="`calc(100vh - ${$props.top} - ${props.bottom})`"
      >
        <div class="panel-content">
          <slot />
        </div>
      </ElScrollbar>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
// 把出现在左侧的面板的滚动条放到左边去
.left-area > :deep(.el-scrollbar__bar) {
  left: 2px;
  right: auto;
}
@each $side in left, right, top, bottom {
  .#{$side} {
    position: fixed;
    #{$side}: 0;
    height: 100vh;
    z-index: 5;
  }
}
@each $side in left, right, top, bottom {
  .pinned-#{$side} {
    transition: all 1s ease-out;
    position: absolute;
    top: v-bind(top);
    margin-#{$side}: 0.5em;
    & > * {
      margin-bottom: 0.5em;
    }
  }
}
.panel-content {
  & > * {
    margin-bottom: v-bind(contentSpacing);
  }
  &:last-child {
    margin-bottom: 0;
  }
}
// 让左右面板出现和退出的时候展示动画
.right-enter-from, .right-leave-to,
.left-enter-from, .left-leave-to {
  opacity: 0;
}
.left-enter-from, .left-leave-to {
  transform: translateX(-100%);
}
.right-enter-from, .right-leave-to {
  transform: translateX(100%);
}
.right-enter-to, .right-leave-from,
.left-enter-to, .left-leave-from {
  opacity: 1;
}
.left-enter-to, .left-leave-from,
.right-enter-to, .right-leave-from {
  transform: translateX(0%);
}
.right-enter-active, .right-leave-active,
.left-enter-active, .left-leave-active {
  transition: all 1s ease-out;
}
</style>