<script setup lang="ts">
import VChart from 'vue-echarts';
import {onBeforeUnmount, onMounted, reactive, ref} from "vue";
import {use} from 'echarts/core';
import {CanvasRenderer} from "echarts/renderers";
import {GaugeChart} from "echarts/charts";
import {EChartsOption} from "echarts";
import ProgressDataView from "./ProgressDataView.vue";
import Api from "../../../ts/common/Api.ts";
import {baseURL} from "../../../ts/common/Request.ts";
use([
    CanvasRenderer,
    GaugeChart
]);
const val = reactive<{value: number}>({value: 100});
const options = ref<EChartsOption>({
  series: [
      {
        type: 'gauge',
        radius: '70%',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 500,
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
          width: 15,
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
            return `{value|${value.toFixed(1)}}`;
          },
          rich: {
            value: {
              fontFamily: 'Digital',
              fontSize: 38,
            },
          }
        },
        data: [val]
      },
  ]
});
const monthMin = ref<number>(0);
const monthMax = ref<number>(0);
const todayMin = ref<number>(0);
const todayMax = ref<number>(0);
let ws: WebSocket;
onMounted(() => {
  Api.Sensor.getPowerGridLoad().then(resp => {
    monthMin.value = +resp.data.monthMin.toFixed(2);
    monthMax.value = +resp.data.monthMax.toFixed(2);
    todayMin.value = +resp.data.todayMin.toFixed(2);
    todayMax.value = +resp.data.todayMax.toFixed(2);
  });
  ws = new WebSocket(baseURL + '/api/sensor/gridLoad/now');
  ws.addEventListener('message', evt => val.value = evt.data);
});
onBeforeUnmount(() => {
  ws.close();
});
</script>

<template>
  <div>
    <div class="left-part">
      <div class="gauge-chart">
        <VChart :option="options" autoresize/>
      </div>
      <div class="gauge-label">当前负荷 (mW)</div>
    </div>
    <div class="right-part">
      <ProgressDataView name="今日最低" :value="todayMin"/>
      <ProgressDataView name="今日最高" :value="todayMax"/>
      <ProgressDataView name="历史最低" :value="monthMin"/>
      <ProgressDataView name="历史最高" :value="monthMax"/>
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
  top: 5%;
  width: 50%;
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