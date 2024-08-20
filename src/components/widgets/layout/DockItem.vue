<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import {iconSizeKey, offsetKey, scaleFactorKey} from "../../../ts/widgets/Dock.ts";
import Widget from "./Widget.vue";
import {WindowState} from "../../../ts/widgets/Widget.ts";
import useDockStore from "../../../ts/store/DockStore.ts";
import {pixels} from "../../../ts/common/Utils.ts";

withDefaults(defineProps<{
  name: string;
  icon: string;
  showWidgetTitle?: boolean;
  showWidgetIcon?: boolean;
  widgetClientWidth?: string;
  widgetClientHeight?: string;
}>(), {
  showWidgetTitle: true,
  showWidgetIcon: false
});
const emits = defineEmits<{
  widgetOpen: [],
  widgetClosed: []
}>();
const isOpen = defineModel<boolean>('open', {default: false});
const icon = ref<HTMLElement>();
const indicator = ref<HTMLElement>();
const iconSize = ref<string>('');
const offset = ref<string>('');
const labelOffset = ref<string>('');
const scale = ref<number>(1);
const bindWidget = ref<InstanceType<typeof Widget>>();
const show = () => {
  emits('widgetOpen');
  if (isOpen.value) {
    switch (bindWidget.value?.widget.windowState) {
      case WindowState.Closed:
      case WindowState.Minimized: {
        bindWidget.value!.open();
        bindWidget.value!.setActive();
        indicator.value!.style.opacity = '1';
        break;
      }
      default:
        break;
    }
  } else {
    isOpen.value = true;
    icon.value!.className = 'pop-up';
    setTimeout(() => {
      icon.value!.className = '';
      indicator.value!.style.opacity = '1';
    }, 1500);
  }
};
defineExpose({show});
const onWidgetClose = () => {
  emits('widgetClosed');
  indicator.value!.style.opacity = '0';
};
onMounted(() => {
  const dock = useDockStore();
  iconSize.value = inject(iconSizeKey) ?? pixels(dock.iconSize!) + 'px';
  offset.value = (inject(offsetKey) ?? dock.offset) + 'px';
  scale.value = inject(scaleFactorKey) ?? dock.scaleFactor!;
  labelOffset.value = `calc(${iconSize.value} * ${scale.value} + 1rem)`;
});
</script>

<template>
  <Widget
      ref="bindWidget" v-if="isOpen"
      :window-title="showWidgetTitle ? $props.name : ''"
      :window-icon="showWidgetIcon ? $props.icon : ''"
      :width="$props.widgetClientWidth"
      :height="$props.widgetClientHeight"
      @closed="onWidgetClose"
  >
    <slot v-if="isOpen"/>
  </Widget>
  <li
      class="dock-item" v-once
      @dragstart.prevent
      @contextmenu.prevent
  >
    <span class="item-name">{{$props.name}}</span>
    <div ref="icon">
      <img
          @click="show"
          class="item-icon"
          :src="$props.icon"
          alt="Dock item"
      />
    </div>
    <div ref="indicator" class="indicator" />
  </li>
</template>

<style lang="scss" scoped>
$iconSize: v-bind(iconSize);
$offset: v-bind(offset);
$labelOffset: v-bind(labelOffset);
$scaleFactor: v-bind(scale);
$nameLabelBgColor: #ebebeb;
@mixin bottom-arrow($color, $size: 10px) {
  content: ' ';
  height: 0;
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  width: 0;
  border: $size solid transparent;
  border-top-color: $color;
}
@keyframes popUpIcon {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2rem);
  }
  100% {
    transform: translateY(0);
  }
}
.pop-up {
  animation: popUpIcon ease-in-out 0.5s 2;
}
.dock-item {
  list-style-type: none;
  display: inline-block;
  position: relative;
  z-index: 21;
  & .item-name {
    opacity: 0;
    position: absolute;
    bottom: $iconSize;
    left: 50%;
    transform: translateX(-50%);
    background: $nameLabelBgColor;
    font-size: small;
    padding: 0.25rem 0.5rem;
    border: 1px solid #ccc;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    border-radius: 0.5em;
    transition: all ease-out 0.3s;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
    // 下箭头
    &::before {
      @include bottom-arrow($nameLabelBgColor);
    }
  }
  & .item-icon {
    width: $iconSize;
    height: $iconSize;
    margin-bottom: $offset;
    transition: all ease 0.3s;
    transform-origin: 50% 100%;
    user-select: none;
    cursor: pointer;
  }
  &:hover {
    & .item-name {
      opacity: 1;
      bottom: $labelOffset;
    }
    & .item-icon {
      transform: scale($scaleFactor);
      margin: 0 2em $offset;
    }
  }
}
.indicator {
  background: #000;
  border-radius: 50%;
  width: 4px;
  height: 4px;
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  transition: all ease 0.3s;
  opacity: 0;
}
</style>