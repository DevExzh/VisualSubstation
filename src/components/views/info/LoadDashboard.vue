<script setup lang="ts">
import VChart from 'vue-echarts';
import {ref} from "vue";
import {use} from 'echarts/core';
import {CanvasRenderer} from "echarts/renderers";
import {GaugeChart} from "echarts/charts";
import {EChartsOption} from "echarts";
import ProgressDataView from "./ProgressDataView.vue";
use([
    CanvasRenderer,
    GaugeChart
]);
const options = ref<EChartsOption>({
  series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        title: {
          show: false,
        },
        anchor: {
          show: false,
        },
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          width: 20,
        },
        itemStyle: {
          color: 'rgba(88, 217, 249, 0.5)',
          borderColor: 'rgba(110, 184, 229, 0.8)',
          shadowColor: 'rgba(0,138,255,0.45)',
          shadowBlur: 5,
          shadowOffsetX: 2,
          shadowOffsetY: 2
        },
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          splitNumber: 0,
        },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, '-25%'],
          color: 'rgba(84, 186, 223, 0.95)',
          formatter: (value) => {
            return `{value|${value.toFixed(0)}}{unit|mW}`;
          },
          rich: {
            value: {
              fontFamily: 'Digital',
              fontSize: 50,
            },
            unit: {
              fontSize: 16,
              padding: [0, 0, -20, 10],
            }
          }
        },
        data: [
          {
            value: 100,
          }
        ]
      },
  ]
});
const changeValue = () => {
  // @ts-ignore
  options.value.series[0].data[0].value = (Math.random() * 100).toFixed(0);
  setTimeout(changeValue, 100);
};
setTimeout(changeValue, 500);
</script>

<template>
  <div>
    <div class="left-part">
      <div class="gauge-chart">
        <VChart :option="options" autoresize/>
      </div>
      <div class="gauge-label">当前负荷</div>
    </div>
    <div class="right-part">
      <ProgressDataView name="今日最低" :value="123"/>
      <ProgressDataView name="今日最高" :value="456"/>
      <ProgressDataView name="历史最低" :value="789"/>
      <ProgressDataView name="历史最高" :value="123"/>
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'Digital';
  src: url('/fonts/DS-Digital-BoldItalic.woff2') format('woff2'),
  url('/fonts/DS-Digital-BoldItalic.woff') format('woff'),
  url('/fonts/DS-Digital-BoldItalic.ttf') format('truetype');
  font-weight: bold;
  font-style: italic;
}
.left-part {
  position: absolute;
  top: 0;
  left: 0;
  width: 45%;
  height: 100%;
}
.right-part {
  position: absolute;
  left: 45%;
  width: 55%;
}
.gauge-chart {
  position: absolute;
  top: 0;
  left: 0;
  height: 110%;
  width: 100%;
}
.gauge-label {
  position: absolute;
  bottom: 20%;
  left: 15%;
  height: 10%;
  width: 70%;
  text-align: center;
  color: rgba(118, 199, 248, 0.95);
  background-color: rgba(136, 159, 244, 0.1);
}
</style>