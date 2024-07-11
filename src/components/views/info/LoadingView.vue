<script setup lang="ts">
import VChart from "vue-echarts";
import {EChartsOption} from "echarts";
import {ref} from "vue";
import {use} from "echarts/core";
import {GraphicComponent} from "echarts/components";
import {CanvasRenderer} from "echarts/renderers";
use([
    CanvasRenderer,
    GraphicComponent
]);
const options = ref<EChartsOption>({
  graphic: {
    elements: [
      {
        type: 'text',
        left: 'center',
        top: '67%',
        style: {
          text: '加载中……',
          fontSize: 20,
          fill: '#5470c6',
        },
        cursor: 'default',
        silent: true,
      },
      {
        type: 'text',
        left: 'center',
        top: '40%',
        style: {
          text: 'Visual Substation',
          fontSize: 80,
          fontWeight: 'bold',
          lineDash: [0, 200],
          lineDashOffset: 0,
          fill: 'transparent',
          stroke: '#000',
          lineWidth: 1,
        },
        keyframeAnimation: {
          duration: 2500,
          loop: true,
          keyframes: [
            {
              percent: 0.7,
              style: {
                fill: 'transparent',
                lineDashOffset: 200,
                lineDash: [200, 0]
              }
            },
            {
              percent: 0.8,
              style: {
                fill: 'transparent'
              }
            },
            {
              percent: 1,
              style: {
                fill: 'black'
              }
            }
          ]
        },
        cursor: 'default',
        silent: true,
      },
      {
        type: 'group',
        left: 'center',
        top: '60%',
        children: new Array(7).fill(0).map((_, i) => ({
          type: 'rect',
          x: i * 20,
          shape: {
            x: 0,
            y: -20,
            width: 10,
            height: 40
          },
          style: {
            fill: '#5470c6'
          },
          keyframeAnimation: {
            duration: 1000,
            delay: i * 200,
            loop: true,
            keyframes: [
              {
                percent: 0.5,
                scaleY: 0.3,
                easing: 'cubicIn'
              },
              {
                percent: 1,
                scaleY: 1,
                easing: 'cubicOut'
              }
            ]
          }
        })),
        cursor: 'default',
        silent: true,
      }
    ]
  }
});
</script>

<template>
  <Transition>
    <div class="container">
      <VChart :option="options" autoresizable/>
    </div>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.container {
  margin: 0;
  padding: 0;
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999999;
  background: #fff;
}
</style>