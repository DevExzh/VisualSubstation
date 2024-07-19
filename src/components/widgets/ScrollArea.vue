<script setup lang="ts">
// GitHub 上已有项目 vue-seamless-scroll 的代码风格实在太糟糕，而且还没有类型注解，故重构了整个组件
import {ScrollDirection} from "../../ts/widgets/ScrollArea.ts";
import {onMounted, reactive, ref} from "vue";
const container = ref<HTMLDivElement>(), listContainer = ref<HTMLDivElement>();
const props = withDefaults(
    defineProps<{
      // 单次动画的步长，可以用此属性控制动画的快慢
      step?: number,
      // 单步移动后等待的时长
      stepDelay?: number,
      // 当光标置于当前组件上时，是否需要暂停
      pauseOnHover?: boolean,
      // 滚动的方向
      direction?: ScrollDirection
    }>(),
    {
      step: 1,
      stepDelay: 500,
      pauseOnHover: false,
      direction: ScrollDirection.TopToBottom
    }
);
let isHovered = false;
let x = ref<number>(0),
    y = ref<number>(0),
    w = ref<number>(0),
    h = ref<number>(0)
;
let requestId: number = -1;
const containerStyle = reactive({
  overflow: "hidden",
  transform: '',
  height: ''
});
const scroll = () => {
  requestId = requestAnimationFrame(() => {
    switch (props.direction) {
      case ScrollDirection.TopToBottom: {
        if(y.value >= 0) y.value = -h.value;
        y.value += props.step;
        break;
      }
      case ScrollDirection.BottomToTop: {
        if(Math.abs(y.value) >= h.value) y.value = 0;
        y.value -= props.step;
        break;
      }
      case ScrollDirection.LeftToRight: {
        if(x.value >= 0) x.value = -w.value;
        x.value += props.step;
        break;
      }
      case ScrollDirection.RightToLeft: {
        if(Math.abs(x.value) >= w.value) x.value = 0;
        x.value -= props.step;
        break;
      }
    }
    containerStyle.transform = `translate(${x.value}px,${y.value}px)`;
    setTimeout(() => requestAnimationFrame(scroll), 100);
  });
};
const cancelScroll = () => {
  cancelAnimationFrame(requestId);
};
// 光标移入事件
const onEnter = () => {
  if(props.pauseOnHover) {
    isHovered = false;
    scroll();
  }
};
// 光标移出事件
const onLeave = () => {
  if(props.pauseOnHover) {
    isHovered = true;
    cancelScroll();
  }
};
onMounted(() => {
  switch (props.direction) {
    case ScrollDirection.TopToBottom:
    case ScrollDirection.BottomToTop: {
      h.value = container.value!.offsetHeight;
      w.value = container.value!.offsetWidth;
      break;
    }
    case ScrollDirection.LeftToRight:
    case ScrollDirection.RightToLeft: {
      break;
    }
  }
  container.value!.style!.height = h.value + 'px';
  scroll();
});
</script>

<template>
<div
    ref="container"
    :style="{overflow: 'hidden'}"
>
  <div
      ref="listContainer"
      :style="containerStyle"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
  >
    <slot v-for="_ in 2"/>
  </div>
</div>
</template>