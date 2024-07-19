<script setup lang="ts">
import {ref} from 'vue';
import VChart from "vue-echarts";
import {graphic, use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {GaugeChart} from "echarts/charts";
use([
    CanvasRenderer,
    GaugeChart,
]);
const colorStyle: any = [[1, new graphic.LinearGradient(
    0, 0, 1, 0, [
      {
        offset: 0,
        color: 'rgba(22, 148, 255, 0.1)',
      },
      {
        offset: 1,
        color:'rgba(63, 250, 250, 0.9)',
      }
    ]
)]];
const option = ref({
  series: [
    //最外的圆圈（外层刻度）
    {
      type: 'gauge',
      center: [
        '50%',
        '55%'
      ],
      radius: '100%',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      axisLine: {
        show: true,
        lineStyle: {
          width: 3,
          color: colorStyle
        }
      },
      axisLabel: {
        show: 0
      },
      axisTick: {
        lineStyle: {
          color:'rgba(63,250,250,0.7)',
          width: 1
        },
        length: 5
      },
      splitLine: {
        length: 8,
        lineStyle: {
          color:'rgba(63,250,250,0.8)',
          width: 3
        }
      },
    },
    // 外围刻度（第二层）
    {
      type: 'gauge',
      center: [
        '50%',
        '55%'
      ],
      radius: '95%', // 1行3个
      min: 0,
      max: 100,
      startAngle: 200,
      endAngle: -20,
      axisLine: { // 坐标轴线
        lineStyle: { // 属性lineStyle控制线条样式
          color: colorStyle,
          width: 2,
          opacity: 1, //刻度背景宽度
        }
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
    },
    // 外围刻度（中间有背景颜色那块，包括里面的刻度）
    {
      type: 'gauge',
      center: [
        '50%',
        '55%'
      ],
      radius: '85%', // 1行3个
      splitNumber: 10,
      min: 0,
      max: 100,
      startAngle: 200,
      endAngle: -20,
      //分隔线样式
      axisTick: {
        show: false
      },
      //刻度样式
      axisLine: {
        show: true,
        lineStyle: {
          width: 95,
          color: colorStyle
        }
      },
      //整数分隔线
      splitLine: {
        show: false,
      },
      //刻度数字
      axisLabel: {
        show: true,
        distance: -4,
        textStyle: {
          color:'rgba(63, 250, 250, 0.8)',
          fontWeight: 'bold'
        }
      },
    },
    //从外数第三条线
    {
      type: 'gauge',
      center: [
        '50%',
        '55%'
      ],
      radius: '80%', // 1行3个
      splitNumber: 10,
      min: 0,
      max: 100,
      startAngle: 200,
      endAngle: -20,
      axisLine: { // 坐标轴线
        lineStyle: { // 属性lineStyle控制线条样式
          color: colorStyle,
          width: 2,
          opacity: 1, //刻度背景宽度
        }
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      pointer: {
        show: false
      },
      axisTick: {
        show: false
      },
      detail: {
        show: 0
      }
    },
    // 内侧指针、数值显示
    {
      name: '',
      center: [
        '50%',
        '50%'
      ],
      type: 'gauge',
      radius: '85%', // 1行3个
      splitNumber: 10,
      min: 0,
      max: 100,
      startAngle: 200,
      endAngle: -20,
      axisLine: {
        show: true,
        lineStyle: {
          width: 50,
          color: [
            [
              1,
              new graphic.LinearGradient(
                  0, 0, 1, 0, [
                    {
                      offset: 0,
                      color: 'rgba(0, 199, 187, 0)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(0, 199, 187, 0)',
                    }
                  ]
              )
            ],
          ]
        }
      },
      axisTick: {
        show: 0,
      },
      splitLine: {
        show: 0,
      },
      axisLabel: {
        show: 0
      },
      pointer: {
        show: true,
        length: '102%',
        width: 8,
        itemStyle: {
          color: colorStyle
        }
      },
      data: [
        {
          value: 22.8,
          name: '完好率',
          title: {
            offsetCenter: ['0%', '85%'],
            color:'#4fe8d6'
          },
          detail: {
            offsetCenter: ['0%', '45%'],
            valueAnimation: true,
            color:'#4fe8d6'
          }
        }
      ]
    }
  ]
});
</script>

<template>
  <VChart :option="option" autoresize/>
</template>