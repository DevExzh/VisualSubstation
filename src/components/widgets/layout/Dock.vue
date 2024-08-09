<script setup lang="ts">
import {onBeforeUnmount, onMounted, provide, ref} from "vue";
import DockItem from "./DockItem.vue";
import {iconSizeKey, offsetKey, scaleFactorKey} from "../../../ts/widgets/Dock.ts";
import {useDockStore, DockSettings} from "../../../ts/store/DockStore.ts";

const props = withDefaults(defineProps<DockSettings>(), {
  autoHide: false,
  iconSize: '4rem',
  offset: 5,
  scaleFactor: 1.75,
  spacing: 20,
});
provide(iconSizeKey, typeof props.iconSize === "number" ? props.iconSize + 'px' : props.iconSize);
provide(offsetKey, props.offset);
provide(scaleFactorKey, props.scaleFactor);
const dockContainer = ref<HTMLDivElement>();
const invisible = ref<HTMLDivElement>();
const spacing = ref<string>('');
let timer: any | undefined;
const hideDock = () => {
  if(!dockContainer.value || !props.autoHide) return;
  timer = undefined;
  dockContainer.value.style.transform = 'translateY(100%)';
  invisible.value!.style.display = 'inline-block';
};
const onEnter = () => {
  if(!dockContainer.value  || !props.autoHide) return;
  if(timer) clearTimeout(timer);
  dockContainer.value.style.transform = '';
  invisible.value!.style.display = 'none';
};
const onLeave = () => {
  if(!dockContainer.value || !props.autoHide) return;
  if(props.autoHide) setTimeout(hideDock, 100);
};
const dockItems = ref<HTMLUListElement>();
onMounted(() => {
  if(!dockContainer.value) return;
  if(props.autoHide) timer = setTimeout(hideDock, 3000);
  invisible.value!.style.height = props.iconSize as string;
  invisible.value!.style.width = `calc(${props.iconSize} * 2)`;
  spacing.value = typeof props.spacing === "number" ? props.spacing + 'px' : props.spacing;
  const dock = useDockStore();
  dock.dockItemContainer = dockItems.value;
  dock.iconSize = props.iconSize;
  dock.offset = props.offset;
  dock.scaleFactor = props.scaleFactor;
  dock.spacing = props.spacing;
});
onBeforeUnmount(() => {
  if(timer) clearTimeout(timer);
});
</script>

<template>
  <transition name="dock" appear>
    <div
        class="dock-container"
        @mouseenter="onEnter"
        @mouseleave="onLeave"
    >
      <div
          ref="dockContainer"
          class="dock-bar"
          @dragstart.prevent
          @contextmenu.prevent
      >
        <ul class="dock-items" ref="dockItems">
          <slot class="dock-item" :is="DockItem"/>
        </ul>
        <div
            class="dock-base"
            :style="{
            height: `calc(${props.iconSize} * 0.6)`
          }"
        />
      </div>
      <div ref="invisible" @mouseenter.native="onEnter" class="invisible" />
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.dock-enter-from {
  transform: translateY(100%);
}
.dock-enter-to {
  transform: translateY(0%);
}
.dock-enter-active {
  transition: all 0.4s ease-out;
}
.invisible {
  position: absolute;
  display: none;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: all;
}
.dock-container {
  position: fixed;
  bottom: 0;
  text-align: center;
  width: 100%;
  pointer-events: none;
}
.dock-bar {
  position: relative;
  display: inline-block;
  perspective: 10rem;
  pointer-events: all;
  transition: all ease 0.4s;
  z-index: 20;
}
.dock-items {
  font-size: 14pt;
  padding: 0 2rem;
  margin: 0;
  & :deep(.dock-item) {
    margin-right: v-bind(spacing);
  }
  &:deep(:last-child) {
    margin-right: 0;
  }
}
.dock-base {
  position: absolute;
  bottom: 0;
  width: 100%;
  pointer-events: none;
  user-select: none;
  z-index: 3;
  background: #888 linear-gradient(to bottom, #333, #999);
  opacity: 0.5;
  border: 2px #aaa solid;
  transform-origin: 50% 100%;
  transform: rotateX(55deg);
  transition: all ease 0.4s;
}
</style>