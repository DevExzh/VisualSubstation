<script setup lang="ts">
import { ref, watch } from 'vue';
import VChart from "vue-echarts";
import {graphic, use} from "echarts/core";
import { EChartsOption } from 'echarts/types/dist/shared.js';
import {TooltipComponent} from "echarts/components";
import {BarChart} from "echarts/charts";
import {CanvasRenderer} from "echarts/renderers";
const currentPeriod = defineModel<'today' | 'month'>('period', {default: 'today'});
const todayData = {
  defect: [10, 30, 20, 10],
  inspection: [40, 50, 10, 20]
};
const monthData = {
  defect: [225, 126, 354, 143],
  inspection: [251, 712, 302, 171]
};
use([
    CanvasRenderer,
    TooltipComponent,
    BarChart
]);
const option = ref<EChartsOption>({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: ['变压器', 'GIS', '开关柜', '电缆'],
    axisLine: {
      lineStyle: {
        color: '#fff'
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#fff'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#003366'
      }
    }
  },
  grid: {
    top: '1%',
    left: '2%',
    right: '2%',
    bottom: '5%',
    containLabel: true
  },
  series: [
    {
      name: '缺陷数',
      type: 'bar',
      data: todayData.defect,
      itemStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#ff0000' },
          { offset: 1, color: '#ff000000' }
        ])
      }
    },
    {
      name: '巡视数',
      type: 'bar',
      data: todayData.inspection,
      itemStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#0021ff' },
          { offset: 1, color: '#0021ff00' }
        ])
      }
    }
  ]
});
watch(currentPeriod, () => {
  const data = currentPeriod.value === 'today' ? todayData : monthData;
  (option.value!.series! as Record<string, any>[])[0].data = data.defect;
  (option.value!.series! as Record<string, any>[])[1].data = data.inspection;
});
</script>

<template>
  <div class="container">
    <div class="info-container">
      <div class="info-box">
        <div class="info-title">当日巡视数</div>
        <div class="info-value">1</div>
      </div>
      <div class="info-box">
        <div class="info-title">本月巡视数</div>
        <div class="info-value">6</div>
      </div>
      <div class="info-box">
        <div class="info-title">巡视总数</div>
        <div class="info-value">5236</div>
      </div>
    </div>
    <VChart class="chart" :option="option" autoresize/>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
}
.info-container {
  display: flex;
  justify-content: center;
  width: 100%;
}
.info-box {
  background: linear-gradient(to bottom, rgba(5, 27, 38, .8), rgba(0, 65, 97, .8));
  border-radius: 0.25em;
  border: 1px solid #5EBCF5;
  margin: 0.5em;
  padding: 0.5em;
  text-align: center;
  color: #fff;
}
.info-title {
  font-size: 14px;
  margin-bottom: 5px;
}
.info-value {
  font-size: 18px;
  font-weight: bold;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
