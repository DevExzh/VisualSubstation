<script setup lang="ts">
import interact from 'interactjs';
import {onBeforeUnmount, onMounted, provide, ref} from "vue";
import {useWidgetStore, widgetKey, WidgetState, WindowState} from "../../../ts/widgets/Widget.ts";
import {pixels} from "../../../ts/common/Utils.ts";
const windowContainer = ref<HTMLElement>();
const clientArea = ref<HTMLElement>();
const props = withDefaults(
    defineProps<{
      controlButtons?: boolean,
      resizable?: boolean,
      width?: number | string,
      height?: number | string,
      x?: number | 'center',
      y?: number | 'center',
    }>(), {
      controlButtons: _ => true,
      resizable: _ => true,
      width: _ => '45rem',
      height: _ => '25.5rem',
      x: _ => 50,
      y: _ => 50,
    }
);
const emits = defineEmits<{
  opened: [],
  closed: [],
  maximized: [],
  minimized: [],
}>();
const windowTitle = defineModel<string>('windowTitle', {required: true});
const windowIcon = defineModel<string>('windowIcon', {required: false, default: ''});
const visible = defineModel<boolean>('isVisible');
// 窗口左上角坐标、长宽
const w = ref<number>(
    pixels(props.width)
), h = ref<number>(
    pixels(props.height)
);
const x = ref<number>(
    props.x === 'center' ? (window.innerWidth - w.value) / 2 : props.x
), y = ref<number>(
    props.y === 'center' ? (window.innerHeight - h.value) / 2 : props.y
);
provide(widgetKey, {
  windowTitle(): string {
    return widget.windowTitle.value;
  },
  setWindowTitle(title: string): void {
    windowTitle.value = widget.windowTitle.value = title;
  },
  windowIcon(): string {
    return windowIcon.value;
  },
  setWindowIcon(icon: string): void {
    windowIcon.value = icon;
  }
});
let storedX = -1, storedY = -1, storedW = -1, storedH = -1;
let minBtnPressed = ref<boolean>(false),
    maxBtnPressed = ref<boolean>(false),
    closeBtnPressed = ref<boolean>(false),
    focusLost = ref<boolean>(false),
    shouldRender = ref<boolean>(true)
;
let interactable: any;
const closeBtn = ref<HTMLElement>(), minBtn = ref<HTMLElement>(), maxBtn = ref<HTMLElement>();
const store = useWidgetStore();
const widget = new WidgetState(); // 当前窗口的状态
const windId = store.widgets.length; // 当前窗口的 ID
widget.windowId = windId;
widget.windowTitle = windowTitle;
const titleBarButtonsEntered = () => {
  if(closeBtn.value && maxBtn.value && minBtn.value)
  closeBtn.value.style.display = maxBtn.value.style.display = minBtn.value.style.display = 'block';
};
const titleBarButtonsLeft = () => {
  if(closeBtn.value && maxBtn.value && minBtn.value)
    closeBtn.value.style.display = maxBtn.value.style.display = minBtn.value.style.display = 'none';
};
const setActive = () => {
  if(store.activeWidget === windId) return;
  focusLost.value = false;
  store.activeWidget = windId;
  widget.zIndex.value = 16;
};
const setInactive = () => {
  focusLost.value = true;
  widget.zIndex.value = 10;
};
const hideWindow = () => {
  if(windowContainer.value) {
    windowContainer.value.style.transition = 'all ease-in 0.15s';
    windowContainer.value.style.opacity = '0';
    setTimeout(() => {
      if(windowContainer.value) {
        windowContainer.value.style.transition = 'none';
        windowContainer.value.style.opacity = '100%';
        windowContainer.value.style.display = 'none';
      }
    }, 150);
    visible.value = false;
  }
};
const useInteract = () => {
  interactable = interact(windowContainer.value!)
      .draggable({
        // 只允许点按标题栏以移动
        ignoreFrom: clientArea.value,
        listeners: {
          start: _ => { setActive() },
          // 当前窗口被尝试移动时
          move: event => {
            x.value += event.dx;
            y.value += event.dy;
          }
        }
      })
      .resizable(props.resizable ? {
        ignoreFrom: clientArea.value,
        edges: {
          top: true, left: true, bottom: true, right: true
        },
        margin: 2,
        listeners: {
          // 当前窗口被尝试改变大小时，调用此函数
          move: event => {
            w.value = event.rect.width;
            h.value = event.rect.height;
            x.value += event.deltaRect.left;
            y.value += event.deltaRect.top;
          }
        }
      } : false)
  ;
};
const onClose = () => {
  closeBtnPressed.value = false;
  widget.windowState = WindowState.Closed;
  emits('closed');
  hideWindow();
  shouldRender.value = false;
};
const onMinimize = () => {
  minBtnPressed.value = false;
  widget.windowState = WindowState.Minimized;
  emits('minimized');
  hideWindow();
};
const onResize = () => {
  if(widget.fullscreen) {
    w.value = window.innerWidth;
    h.value = window.innerHeight;
  }
};
const onMaximized = () => {
  maxBtnPressed.value = false;
  if(windowContainer.value) {
    windowContainer.value.style.transition = 'all ease-in 0.3s';
    setTimeout(() => {
      if(windowContainer.value)
      windowContainer.value.style.transition = 'none';
      }, 300);
    if(widget.fullscreen.value) {
      // 从最大化状态恢复到之前的状态
      widget.windowState = WindowState.Normal;
      interactable.draggable(true);
      interactable.resizable(true);
      x.value = storedX;
      y.value = storedY;
      w.value = storedW;
      h.value = storedH;
      window.removeEventListener('resize', onResize);
    } else {
      widget.windowState = WindowState.Maximized;
      interactable.draggable(false);
      interactable.resizable(false);
      storedX = x.value;
      storedY = y.value;
      storedW = w.value;
      storedH = h.value;
      x.value = 0;
      y.value = 0;
      w.value = window.innerWidth;
      h.value = window.innerHeight;
      window.addEventListener('resize', onResize);
    }
    widget.fullscreen.value = !widget.fullscreen.value;
  }
};
// @ts-ignore
store.widgets.push(widget);
store.$subscribe((_, state) => {
  if(state.activeWidget !== windId) {
    setInactive();
  }
});
onMounted(useInteract);
onBeforeUnmount(() => {
  interactable?.unset();
  const index = store.widgets.indexOf({
    windowId: widget.windowId,
    windowState: widget.windowState,
    windowTitle: widget.windowTitle.value,
    fullscreen: widget.fullscreen.value,
    zIndex: widget.zIndex.value,
  });
  if(index !== -1) {
    store.widgets.splice(index, 1);
  }
  if(store.widgets.length === 0) {
    store.activeWidget = -1;
  }
});
defineExpose({
  open: () => {
    if(windowContainer.value) {
      windowContainer.value.style.transition = 'all ease-in 0.15s';
      windowContainer.value.style.opacity = '1';
      windowContainer.value.style.display = 'block';
    }
    if(!shouldRender.value) {
      shouldRender.value = true;
      interactable?.unset();
      useInteract();
    }
  },
  widget,
  setActive
});
</script>

<template>
  <!-- 可拖拽窗口容器 -->
  <div
      ref="windowContainer"
      :class="[
          'window-container',
          {
            maximized: widget.fullscreen.value,
            inactive: focusLost
          },
      ]"
      :style="{
        height: `${h}px`,
        width: `${w}px`,
        transform: `translate(${x}px, ${y}px)`,
        zIndex: widget.zIndex.value
      }"
      @mousedown="setActive"
  >
    <!-- 标题栏 -->
    <div
        :class="[
            'title-bar',
            {
              maximized: widget.fullscreen.value,
              inactive: focusLost,
            }
        ]"
    >
      <!-- 关闭、最小化、最大化按钮 -->
      <div
          @mouseenter="titleBarButtonsEntered"
          @mouseleave="titleBarButtonsLeft"
          :class="['title-buttons', { maximized: widget.fullscreen.value }]"
          v-if="props.controlButtons"
      >
        <div
            :class="[
                'button close-button',
                { pressed: closeBtnPressed, inactive: focusLost }
            ]"
            @mousedown="closeBtnPressed = true"
            @mouseup="onClose"
        >
          <svg ref="closeBtn" class="button-hover-img" viewBox="0 0 1024 1024">
            <path fill="#313131" d="m662.189 511.984 330.593-330.561a106.23 106.23 0 0 0 0-150.226 106.166 106.166 0 0 0-150.226 0L511.963 361.694 181.434 31.165a106.166 106.166 0 0 0-150.258 0 106.23 106.23 0 0 0 0 150.226L361.77 511.952 31.144 842.609a106.23 106.23 0 1 0 150.258 150.226L511.931 662.21l330.625 330.657a105.7 105.7 0 0 0 75.097 31.069 106.23 106.23 0 0 0 75.129-181.295L662.253 512.016z"/>
          </svg>
        </div>
        <div
            :class="[
                'button minimize-button',
                { pressed: minBtnPressed, inactive: focusLost }
            ]"
            @mousedown="minBtnPressed = true"
            @mouseup="onMinimize"
        >
          <svg ref="minBtn" class="button-hover-img" viewBox="0 0 1024 1024">
            <path d="M896 416H128c-35.34 0-64 28.66-64 64v64c0 35.34 28.66 64 64 64h768c35.34 0 64-28.66 64-64v-64c0-35.34-28.66-64-64-64z"  />
          </svg>
        </div>
        <div
            :class="[
                'button maximize-button',
                { pressed: maxBtnPressed, inactive: focusLost }
            ]"
            @mousedown="maxBtnPressed = true"
            @mouseup="onMaximized"
            v-if="props.resizable"
        >
          <svg ref="maxBtn" class="button-hover-img" viewBox="0 0 200 200">
            <path d="M50.7,181L181,50.7V181H50.7z M19,19h130.3L19,149.3V19z"/>
          </svg>
        </div>
      </div>
      <!-- 窗口标题 -->
      <span class="title-name">
        <span v-if="windowIcon">
          <img style="height: 100%; width: 1rem; vertical-align: middle; margin-right: 0.5rem;" :src="windowIcon" alt="Window icon" />
        </span>
        <transition name="fade" mode="out-in">
          <span class="window-title" :key="windowTitle">{{windowTitle}}</span>
        </transition>
      </span>
    </div>
    <!-- 窗口内容 -->
    <div
        :class="[
            'widget-client-area-container',
            { inactive: focusLost, maximized: widget.fullscreen.value }
        ]"
    >
      <div class="widget-client-area" ref="clientArea">
        <slot
            v-if="shouldRender"
            class="widget-content"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  touch-action: none;
  margin: 0;
  padding: 0;
}
.window-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 48rem;
  height: 36rem;
  border: 0.06rem solid #dadada;
  box-shadow: 0 1.5rem 3rem 0 rgba(0, 0, 0, 0.15), 0 6px 20px 0 rgba(0, 0, 0, 0.14);
  border-radius: 0.5rem;
}
.window-container.maximized {
  border-radius: 0;
  box-shadow: none;
  border: none;
}
.button {
  position: relative;
  cursor: default;
}
.button.inactive {
  background: #D0D0D0;
  border: 0.06rem solid #B0B0B0;
}
.button-hover-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.42rem;
  height: 0.42rem;
  opacity: 80%;
  display: none;
}
.minimize-button {
  height: 0.7rem;
  width: 0.7rem;
  border-radius: 0.4rem;
  background: #F4BF4F;
  border: 0.06rem solid #D6A03D;
}
.minimize-button.pressed {
  background: #B78F3B;
}
.maximize-button {
  height: 0.7rem;
  width: 0.7rem;
  border-radius: 0.4rem;
  background: #61C654;
  border: 0.06rem solid #51A83D;
}
.maximize-button.pressed {
  background: #499540;
}
.close-button {
  height: 0.7rem;
  width: 0.7rem;
  border-radius: 0.4rem;
  background: #EC6A5E;
  border: 0.06rem solid #D04E40;
}
.close-button.pressed {
  background: #BF4F47;
}
.title-buttons {
  display: flex;
  padding-left: 1rem;
  align-items: center;
  width: 3.25rem;
  justify-content: space-between;
}
.title-bar {
  display: flex;
  height: 2rem;
  width: 100%;
  background: rgba(240, 240, 240, 98%);
  backdrop-filter: saturate(1.8) blur(1em);
  z-index: 10;
  border-bottom: #dadada 0.07rem solid;
  position: relative;
  border-radius: 0.5rem 0.5rem 0 0;
}
.title-bar.maximized {
  background: #F0F0F0;
  border-radius: 0;
}
.title-name {
  user-select: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.9rem;
  font-weight: bolder;
  color: #474747;
}
.widget-client-area-container {
  border-radius: 0 0 0.5rem 0.5rem;
  width: calc(100% - 0.3rem);
  height: calc(100% - 2.15rem);
  padding: 0 0.15rem 0.15rem 0.15rem;
  background: rgba(100%, 100%, 100%, 90%);
  backdrop-filter: saturate(1.8) blur(1em);
}
.title-bar.inactive {
  background: rgba(240, 240, 240, 70%);
}
.widget-client-area-container.inactive {
  background: rgba(100%, 100%, 100%, 60%);
}
.widget-client-area-container.maximized {
  background: rgba(100%, 100%, 100%, 96%);
}
.widget-client-area {
  width: 100%;
  height: 100%;
  overflow: scroll;
}
</style>