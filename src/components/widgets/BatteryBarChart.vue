<template>
  <VChart :option="options" autoresize />
</template>

<script lang="ts" setup>
import VChart from 'vue-echarts'
import { ref } from 'vue'
import {graphic, use} from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {BarChart, PictorialBarChart} from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  PictorialBarChart,
  GridComponent,
  TooltipComponent
]);

const colorList = [
  'rgba(193,255,225,.2)', '#96c7ee', '#849df5', '#888af8', 'rgba(148,97,252,.5)'
];

const total = defineModel<number>('total', {default: 100});
const value = defineModel<number>('value', {default: 70});

const options = ref({
  grid: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  xAxis: [{
    show: false,
  }],
  yAxis: [
    {
      axisTick: 'none',
      axisLine: 'none',
      offset: '10',
      axisLabel: {
        margin: 1.5,
        textStyle: {
          color: '#8aa3b0',
          fontSize: '14',
        }
      },
      data: []
    },
    {
      axisTick: 'none',
      axisLine: 'none',
      type: 'category',
      axisLabel: {
        margin: 0,
        textStyle: {
          color: 'none',
          fontSize: '16',
        }
      },
      data: [],
    },
    {
      name: '',
      nameGap: '50',
      nameTextStyle: {
        color: '#000',
        fontSize: '16',
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0,0,0,0)'
        }
      },
      data: [],
    }
  ],
  series: [
    {
      name: '内容',
      type: 'pictorialBar',
      symbol: 'rect',
      barWidth: '11%',
      barMaxWidth: '20%',
      symbolMargin: 2,
      animationDelay: 50,
      itemStyle: {
        normal: {
          color: new graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 1, color: colorList[0] },
            { offset: .75, color: colorList[1] },
            { offset: .5, color: colorList[2] },
            { offset: .25, color: colorList[3] },
            { offset: 0, color: colorList[4] },
          ], false)
        }
      },
      z: 1,
      symbolOffset: [5, 0],
      symbolRepeat: true,
      symbolSize: [5, 12],
      data: [value.value],
      label: {
        normal: {
          show: true,
          position: 'top',
          textStyle: {
            color: 'transparent'
          }
        }
      },
      animationEasing: 'elasticOut',
    },
    {
      name: '外框',
      type: 'bar',
      yAxisIndex: 2,
      barGap: '-100%',
      data: [total.value],
      barWidth: 25,
      itemStyle: {
        normal: {
          color: 'none',
          barBorderColor: colorList[4],
          barBorderWidth: 1,
          barBorderRadius: 0,
          opacity: .7,
          label: {
            show: false,
            position: 'top'
          }
        }
      },
      z: 0
    }
  ]
});
</script>

<style scoped>
</style>