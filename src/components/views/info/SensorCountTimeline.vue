<script lang="ts" setup>
import VChart from 'vue-echarts'
import {onMounted, ref} from 'vue'
import {graphic, use} from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import Api from "../../../ts/common/Api.ts";
import {clamp} from "../../../ts/common/Helper.ts";
import {EChartsOption} from "echarts";

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
]);

const series1 = ref<number[][]>([]);
const series2 = ref<number[][]>([]);

const options = ref<EChartsOption>({
  grid: {
    left: '5%',
    right: '5%',
    bottom: '5%',
    top: '20%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      label: { show: true },
      crossStyle: { color: '#999' },
      shadowStyle: { color: "rgba(22, 93, 255, 0.1)" }
    },
  },
  xAxis: {
    type: 'time',
    splitNumber: 3,
    splitLine: {
      lineStyle: { color: "rgba(77, 128, 254, 0.18)", type: "solid" }
    },
    axisLabel: {
      show: true,
      color: "rgba(255, 255, 255, 1)",
      fontSize: "12",
      fontFamily: "SourceHanSans",
      rotate: 0,
      formatter: (val: number) => {
        const date = new Date(val);
        return `${date.getMonth() + 1}/${date.getDate()}`
      }
    },
  },
  yAxis: [
    {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'rgba(110, 184, 229, 0.8)',
        },
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "rgba(255, 255, 255, 0.18)",
        },
      },
    }
  ],
  // @ts-ignore
  series: [
    {
      name: '连接的传感器数量',
      type: 'bar',
      data: series2,
      smooth: true,
      barMaxWidth: 16,
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(0, 177, 230, 0)" },
          { offset: 1, color: "rgba(0, 177, 230, .1)" },
        ]),
      },
      itemStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(54, 110, 244, .5)" },
          { offset: 1, color: "rgba(0, 177, 230, .1)" },
        ]),
        borderColor: 'rgba(255,255,255,.7)',
        borderWidth: 1,
        opacity: .6,
      }
    },
    {
      name: '在线的传感器数量',
      type: 'line',
      data: series1,
      smooth: true,
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(255, 216, 76, 0)" },
          { offset: 1, color: "rgba(255, 216, 76, .1)" },
        ]),
      },
      itemStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(255, 216, 76, .5)" },
          { offset: 1, color: "rgba(255, 216, 76, .1)" },
        ]),
        borderColor: 'rgba(255,255,255,.7)',
        borderWidth: 1,
        opacity: .6,
      }
    },
  ],
});

onMounted(() => {
  Api.Sensor.getSensorCount().then(resp => {
    series1.value = resp.data;
    series2.value = series1.value.map(point =>
        [point[0], clamp(point[1] - Math.round(Math.random() * 20), 0, Infinity)]);
  });
});
</script>

<template>
  <VChart :option="options" autoresize/>
</template>

<style scoped>
</style>