<script setup lang="ts">
// GitHub 上已有项目 vue-seamless-scroll 的代码风格实在太糟糕，而且还没有类型注解，故重构了整个组件
import {ScrollDirection} from "../../ts/widgets/ScrollArea.ts";
import {reactive, ref, onMounted} from "vue";
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
      step: 0.5,
      stepDelay: 500,
      pauseOnHover: true,
      direction: ScrollDirection.TopToBottom
    }
);
// let isHovered = false;
const x = ref<number>(0),
      y = ref<number>(0),
      h = ref<number>(0),
      w = ref<number>(0)
;
const containerStyle = reactive({
  transform: '',
});
let continueFlag = true;
const scroll = () => {
  if(!h.value) {
    h.value = scrollArea.value!.offsetHeight / -2;
    w.value = scrollArea.value!.offsetWidth / -2;
  }
  switch (props.direction) {
    case ScrollDirection.TopToBottom: {
      if(y.value >= 0) y.value = h.value;
      y.value += props.step;
      break;
    }
    case ScrollDirection.BottomToTop: {
      if(y.value <= h.value) y.value = 0;
      y.value -= props.step;
      break;
    }
    case ScrollDirection.LeftToRight: {
      if(x.value >= 0) x.value = w.value;
      x.value += props.step;
      break;
    }
    case ScrollDirection.RightToLeft: {
      if(x.value <= w.value) x.value = 0;
      x.value -= props.step;
      break;
    }
  }
  containerStyle.transform = `translate(${x.value}px,${y.value}px)`;
  if(continueFlag) setTimeout(scroll, 33);
};
// 光标移入事件
const onEnter = () => {
  if(props.pauseOnHover) {
    continueFlag = false;
  }
};
// 光标移出事件
const onLeave = () => {
  if(props.pauseOnHover) {
    continueFlag = true;
    scroll();
  }
};
const scrollArea = ref<HTMLDivElement>();
onMounted(scroll);
</script>

<template>
<div class="scroll-area">
  <div
      class="container"
      :style="containerStyle"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
  >
    <div ref="scrollArea"><slot name="default" v-for="_ in 2"/></div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.scroll-area {
  width: calc(100% - 0.5em);
  height: calc(100% - 0.5em);
  overflow: hidden;
  padding: 0.2em;
}
.container {
  height: 200%;
  width: 100%;
}
</style>