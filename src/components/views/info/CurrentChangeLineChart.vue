<script setup lang="ts">
import VChart from 'vue-echarts';
import {onMounted, ref} from "vue";
import {EChartsOption} from "echarts";
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {LineChart} from "echarts/charts";
import {DataZoomComponent, GridComponent, TooltipComponent} from "echarts/components";
import Api from "../../../ts/common/Api.ts";
use([
    CanvasRenderer,
    LineChart,
    GridComponent,
    TooltipComponent,
    DataZoomComponent,
]);
const series1 = ref<number[][]>([]);
const series2 = ref<number[][]>([]);
const options = ref<EChartsOption>({
  grid: {
    top: 35,
    right: 20,
    left: '11%',
    bottom: 80,
  },
  tooltip: {
    trigger: 'axis',
    appendTo: document.body,
    axisPointer: {
      type: 'cross',
    },
    position: (pos) => [pos[0] + 20, pos[1] - 60],
  },
  xAxis: {
    type: 'time',
    axisLine: {
      lineStyle: {
        color: 'rgba(110, 184, 229, 0.8)',
      }
    }
  },
  yAxis: {
    type: 'value',
    name: '电流',
    axisLine: {
      lineStyle: {
        color: 'rgba(110, 184, 229, 0.8)',
      },
    },
    axisLabel: {
      formatter: '{value}A',
    },
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 20,
    },
    {
      type: 'slider',
      start: 0,
      end: 100,
      bottom: '10%',
      textStyle: {
        color: 'rgba(240, 240, 240, 0.8)',
        textShadowColor: 'rgba(10, 10, 10, 0.4)',
        textShadowOffsetX: 2,
        textShadowOffsetY: 2,
        overflow: 'break',
      },
    }
  ],
  // @ts-ignore
  series: [
    {
      type: 'line',
      name: '预测值',
      smooth: true,
      clip: true,
      symbol: 'none',
      color: '#b2ebf2',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(0, 255, 255, 0.5)',
          }, {
            offset: .6, color: 'rgba(1, 109, 255, 0.1)',
          }, {
            offset: 1, color: 'rgba(1, 109, 255, 0)',
          }]
        }
      },
      data: series1,
    },
    {
      type: 'line',
      name: '实际值',
      smooth: true,
      clip: true,
      symbol: 'none',
      color: '#ffecb3',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(255, 235, 59, 0.5)',
          }, {
            offset: .6, color: 'rgba(255, 236, 179, 0.1)',
          }, {
            offset: 1, color: 'rgba(1, 109, 255, 0)',
          }]
        }
      },
      data: series2,
    },
  ],
});
onMounted(() => {
  Api.Sensor.getCurrentChangeInfo().then(resp => {
    series1.value = resp.predicted.map(val => [val[0], parseFloat(val[1].toFixed(2))]);
    series2.value = resp.value.map(val => [val[0], parseFloat(val[1].toFixed(2))]);
  });
});
</script>

<template>
  <VChart :option="options" autoresize/>
</template>

<style scoped>

</style>