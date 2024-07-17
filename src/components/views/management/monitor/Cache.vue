<script setup lang="ts">
import VChart from "vue-echarts";
import {onMounted, ref} from "vue";
import Api from "../../../../ts/common/Api.ts";
import {PieChart as Pie, Odometer} from "@element-plus/icons-vue";
import {CacheInfo} from "../../../../ts/common/ApiTypes.ts";
import {EChartsOption} from "echarts";
import {use} from "echarts/core";
import {GaugeChart, PieChart} from "echarts/charts";
import {GridComponent, TooltipComponent} from "echarts/components";
import {CanvasRenderer} from "echarts/renderers";
use([
    PieChart,
    GaugeChart,
    TooltipComponent,
    GridComponent,
    CanvasRenderer
]);
const cache = ref<CacheInfo>();
const loading = ref<boolean>(false);
const commandStatsOption = ref<EChartsOption>({
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  series: [
    {
      name: "命令",
      type: "pie",
      roseType: "radius",
      animationEasing: "cubicInOut",
      animationDuration: 1000
    }
  ]
});
const usedMemoryOption = ref<EChartsOption>({
  tooltip: {},
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  series: [
    {
      name: "峰值",
      type: "gauge",
      min: 0,
      max: 1000,
      detail: {
        valueAnimation: true,
        fontSize: 20,
        offsetCenter: [0, '70%']
      },
      data: [{}],
      radius: '100%',
      progress: {
        show: true,
        width: 18
      },
      axisLine: {
        lineStyle: {
          width: 18
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        length: 15,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      axisLabel: {
        show: false
      },
    }
  ]
});
onMounted(() => {
  loading.value = true;
  Api.Monitor.Cache.getCache().then(response => {
    loading.value = false;
    cache.value = response.data;
    // @ts-ignore
    commandStatsOption.value!.series![0]!.data = response.data.commandStats;
    const usedMem = response.data.info.used_memory_human;
    // @ts-ignore
    usedMemoryOption.value!.tooltip!.formatter = "内存消耗<br/>{a} : " + usedMem;
    // @ts-ignore
    usedMemoryOption.value!.series![0].detail!.formatter = usedMem;
    // @ts-ignore
    usedMemoryOption.value!.series![0].data![0]!.value = parseFloat(usedMem);
  });
});
</script>

<template>
  <div
      class="container"
      :class="{'loading-area': loading}"
      v-loading="loading"
      element-loading-text="正在加载缓存监控数据，请稍候！"
  >
    <ElRow v-if="cache">
      <ElCol :span="24" class="card-box">
        <ElCard>
          <template #header>
            <img src="/images/icons/monitor.svg" class="svg-icon" alt="monitor" />
            <span class="icon-name">基本信息</span>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table style="width: 100%; border-spacing: 0;">
              <tbody>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">Redis 版本</div></td>
                <td class="el-table__cell is-leaf">
                  <div class="cell" v-if="cache.info">{{ cache.info.redis_version }}</div>
                </td>
                <td class="el-table__cell is-leaf"><div class="cell">运行模式</div></td>
                <td class="el-table__cell is-leaf">
                  <div class="cell" v-if="cache.info">
                    {{ cache.info.redis_mode == "standalone" ? "单机" : "集群" }}
                  </div>
                </td>
                <td class="el-table__cell is-leaf"><div class="cell">端口</div></td>
                <td class="el-table__cell is-leaf">
                  <div class="cell" v-if="cache.info">{{ cache.info.tcp_port }}</div>
                </td>
                <td class="el-table__cell is-leaf"><div class="cell">客户端数</div></td>
                <td class="el-table__cell is-leaf">
                  <div class="cell" v-if="cache.info">{{ cache.info.connected_clients }}</div>
                </td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">运行时间(天)</div></td>
                <td class="el-table__cell is-leaf">
                  <div class="cell" v-if="cache.info">{{ cache.info.uptime_in_days }}</div>
                </td>
                <td class="el-table__cell is-leaf"><div class="cell">内存使用率</div></td>
                <td class="el-table__cell is-leaf">
                  <div class="cell" v-if="cache.info">{{ cache.info.used_memory_human }}</div>
                </td>
                <td class="el-table__cell is-leaf"><div class="cell">CPU 使用率</div></td>
                <td class="el-table__cell is-leaf">
                  <div class="cell" v-if="cache.info">
                    {{ parseFloat(cache.info.used_cpu_user_children).toFixed(2) }}
                  </div>
                </td>
                <td class="el-table__cell is-leaf"><div class="cell">内存配置</div></td>
                <td class="el-table__cell is-leaf">
                  <div class="cell" v-if="cache.info">{{ cache.info.maxmemory_human }}</div>
                </td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">AOF 是否开启</div></td>
                <td class="el-table__cell is-leaf">
                  <div class="cell" v-if="cache.info">{{ cache.info.aof_enabled == "0" ? "否" : "是" }}</div>
                </td>
                <td class="el-table__cell is-leaf"><div class="cell">RDB 是否成功</div></td>
                <td class="el-table__cell is-leaf">
                  <div class="cell" v-if="cache.info">{{ cache.info.rdb_last_bgsave_status }}</div>
                </td>
                <td class="el-table__cell is-leaf"><div class="cell">键值对数量</div></td>
                <td class="el-table__cell is-leaf">
                  <div class="cell" v-if="cache.dbSize">{{ cache.dbSize }} </div>
                </td>
                <td class="el-table__cell is-leaf"><div class="cell">网络入口/出口</div></td>
                <td class="el-table__cell is-leaf">
                  <div class="cell" v-if="cache.info">
                    {{ cache.info.instantaneous_input_kbps }}kps/{{cache.info.instantaneous_output_kbps}}kps
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>
    <ElRow :gutter="10" class="row" v-if="cache">
      <ElCol :span="12" class="card-box">
        <ElCard>
          <template #header>
            <ElIcon class="svg-icon">
              <Pie/>
            </ElIcon>
            <span class="icon-name">命令统计</span>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium chart-container">
            <VChart :loading="loading" class="chart" :option="usedMemoryOption" theme="macarons" />
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="12" class="card-box">
        <ElCard>
          <template #header>
            <ElIcon class="svg-icon">
              <Odometer/>
            </ElIcon>
            <span class="icon-name">内存信息</span>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium chart-container">
            <VChart :loading="loading" class="chart" :option="commandStatsOption" theme="macarons"/>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<style scoped>
.container {
  min-height: 10rem;
}
.svg-icon {
  width: 1em; height: 1em; vertical-align: middle;
}
.chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 10rem;
}
.chart {
  width: 100%;
  height: 100%;
  min-height: 10rem;
}
.row {
  margin-top: 1rem;
}
.icon-name {
  vertical-align: middle;
  margin-left: 0.5rem;
  font-weight: bolder;
}
</style>
