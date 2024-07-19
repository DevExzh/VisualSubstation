<script lang="ts" setup>
import VChart from 'vue-echarts'
import { ref } from 'vue'
import {graphic, use} from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, DataZoomComponent } from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent
]);

const colors = [
  "rgba(54, 110, 244, .5)",
  "rgba(255, 216, 76, .5)",
  "rgba(0, 177, 230, .5)",
  "rgba(0, 218, 216, .5)",
  "rgba(98, 247, 249, .5)"
];

const colorsChange = [
  "rgba(0, 177, 230, .1)",
  "rgba(255, 216, 76, .1)",
  "rgba(0, 218, 216, .1)",
  "rgba(0, 177, 230, .1)",
  "rgba(98, 247, 249, .1)"
];

const colorsChangeTo = [
  "rgba(0, 177, 230, 0)",
  "rgba(255, 216, 76, 0)",
  "rgba(0, 218, 216, 0)",
  "rgba(0, 177, 230, 0)",
  "rgba(98, 247, 249, 0)"
];

const chartData = {
  name: ['Example Series 1', 'Example Series 2'],
  label: ['Label 1', 'Label 2', 'Label 3'],
  data: {
    series1: { type: 'bar', data: [10, 20, 30] },
    series2: { type: 'line', data: [15, 25, 35] },
  },
  yName: ['Y Axis Label'],
  xAxisTYpe: 'category',
};

const options = ref({
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
    }
  },
  dataZoom: [
    {
      type: "inside",
      startValue: 0,
      endValue: 100,
      xAxisIndex: 0,
      zoomOnMouseWheel: true,
    },
  ],
  xAxis: {
    type: chartData.xAxisTYpe ? chartData.xAxisTYpe : 'category',
    boundaryGap: true,
    axisLine: {
      show: !chartData.xAxisTYpe,
      lineStyle: { color: "rgba(255, 255, 255, 0.18)" }
    },
    splitLine: {
      lineStyle: { color: "rgba(77, 128, 254, 0.18)", type: "line" }
    },
    axisTick: { show: true, alignWithLabel: true },
    axisLabel: {
      show: true,
      textStyle: {
        color: "rgba(255, 255, 255, 1)",
        fontSize: "12",
        fontFamily: "SourceHanSans"
      },
      rotate: 0
    },
    data: chartData.label,
  },
  yAxis: [
    {
      type: 'value',
      name: chartData.yName[0],
      axisLine: {
        lineStyle: {
          color: 'rgba(110, 184, 229, 0.8)',
        },
      },
      axisLabel: {
        formatter: '{value}',
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "rgba(255, 255, 255, 0.18)",
        },
      },
    }
  ],
  series: [
    {
      name: chartData.name[0],
      type: chartData.data.series1.type,
      data: chartData.data.series1.data,
      smooth: true,
      barMaxWidth: 16,
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: colorsChangeTo[0] },
          { offset: 1, color: colorsChange[0] },
        ]),
      },
      itemStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: colors[0] },
          { offset: 1, color: colorsChange[0] },
        ]),
        borderColor: 'rgba(255,255,255,.7)',
        borderWidth: 1,
        opacity: .6,
      }
    },
    {
      name: chartData.name[1],
      type: chartData.data.series2.type,
      data: chartData.data.series2.data,
      smooth: true,
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: colorsChangeTo[1] },
          { offset: 1, color: colorsChange[1] },
        ]),
      },
      itemStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: colors[1] },
          { offset: 1, color: colorsChange[1] },
        ]),
        borderColor: 'rgba(255,255,255,.7)',
        borderWidth: 1,
        opacity: .6,
      }
    },
  ],
});
</script>

<template>
  <VChart :option="options" autoresize/>
</template>

<style scoped>
</style>