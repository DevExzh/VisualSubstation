<script setup lang="ts">
import {onBeforeUnmount, onMounted, reactive, ref} from "vue";
import VChart from "vue-echarts";
import {EChartsOption} from "echarts";
import {use} from "echarts/core";
import {GaugeChart} from "echarts/charts";
import {CanvasRenderer} from "echarts/renderers";
import {WeatherNow} from "../../../ts/common/ApiTypes.ts";
import ProgressBar from "../../widgets/form/ProgressBar.vue";
import Api from "../../../ts/common/Api.ts";
import {TooltipComponent} from "echarts/components";

const props = withDefaults(defineProps<{
  location: string
}>(), {});
const weather = ref<WeatherNow>();
const windDirection = reactive<{ value: number }>({ value: 0 });
const windChartOption = ref<EChartsOption>({
  tooltip: {
    appendTo: document.body,
    formatter: _ => {
      const now = weather.value?.now;
      return now ? `<b>风力</b>：${now.windScale} 级<br/><b>风向</b>：${now.windDir}` : '';
    },
  },
  series: [{
    type: 'gauge',
    startAngle: 90,
    endAngle: -270,
    min: 0,
    max: 360,
    splitNumber: 4,
    clockwise: true,
    radius: '125%',
    axisLabel: {
      formatter: value => {
        switch (value) {
          case 0: return '北';
          case 90: return '东';
          case 180: return '南';
          case 270: return '西';
          default: return '';
        }
      },
      color: '#eee',
      distance: 5,
      fontWeight: 'bolder',
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      splitNumber: 16,
      lineStyle: {
        color: 'rgba(100%, 100%, 100%, 0.2)',
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(100%, 100%, 100%, 0.1)',
      },
    },
    progress: {
      show: false,
      width: 0,
    },
    detail: {
      show: false,
    },
    anchor: {
      show: false,
    },
    data: [windDirection],
    pointer: {
      icon: 'arrow',
      itemStyle: {
        color: '#fff',
      }
    },
  }]
});
use([
  GaugeChart, TooltipComponent, CanvasRenderer,
]);
const syncData = () => {
  Api.Weather.getWeatherNow(props.location).then(res => {
    weather.value = res.data;
  });
  if(weather.value) {
    windDirection.value = +weather.value.now.wind360;
  }
};
// 每 30 秒请求一次最新数据
const interval = setInterval(syncData, 30000);
onMounted(() => {
  syncData();
});
onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<template>
  <ElScrollbar noresize>
    <div class="wrapper" v-if="weather && weather.code === '200'">
      <div class="bars">
        <ProgressBar
            title="温度" color="#F44336" :min="-30" :max="50"
            :value="parseFloat(weather.now.temp)" :formatter="value => value + '℃'"
        >
          <template #prefix>
            <i class="weather" :class="'qi-' + weather.now.icon"/>
          </template>
        </ProgressBar>
        <ProgressBar
            title="湿度" color="#03A9F4"
            :value="parseFloat(weather.now.humidity)" :formatter="value => value + '% RH'"
        >
          <template #prefix>
            <svg viewBox="0 0 1024 1024">
              <path
                  class="weather"
                  d="M575.8 44.2c-17.4-57.6-107.8-60.2-127.6 0C346.2 359.6 128 445.4 128 667.8 128 864.6 299.8 1024 512 1024s384-159.4 384-356.2c0-223.4-217.8-306.6-320.2-623.6zM320 576c0-35.4 28.6-64 64-64s64 28.6 64 64-28.6 64-64 64-64-28.6-64-64z m99 263.6c-5.6 7-15.6 8-22.4 2.4l-25-20c-6.8-5.6-8-15.6-2.4-22.4l236-295c5.6-6.8 15.6-8 22.4-2.4l25 20c7 5.6 8 15.6 2.4 22.4l-236 295zM640 832c-35.4 0-64-28.6-64-64s28.6-64 64-64 64 28.6 64 64-28.6 64-64 64z"/>
            </svg>
          </template>
        </ProgressBar>
      </div>
      <VChart :option="windChartOption" autoresize/>
    </div>
    <div class="params" v-if="weather && weather.code === '200'">
      <div class="param" v-if="weather.now.windSpeed">
        <div class="param-key" v-once>
          <svg class="param-icon" viewBox="0 0 12.68 11.039">
            <path d="M.63 3.773a9.4 9.4 0 0 1 2.656-.39c1.085 0 1.914.164 2.937.164 1.148 0 1.844-.781 1.844-1.774 0-1.039-.79-1.765-1.758-1.765-.688 0-1.305.414-1.594.976-.117.227-.086.5.156.633.22.117.5.055.657-.226a.9.9 0 0 1 .78-.477c.47 0 .86.32.86.86 0 .53-.367.867-.945.867-.96 0-1.82-.164-2.937-.164-1.008 0-2.008.164-2.93.43-.29.085-.406.335-.336.577.07.235.297.383.61.29m9.507 2.922c1.438 0 2.469-.93 2.469-2.218 0-1.297-.985-2.211-2.211-2.211-1.117 0-1.945.757-2.102 1.78-.047.29.11.516.36.556.258.039.484-.118.547-.454.101-.601.609-.984 1.195-.984.726 0 1.312.523 1.312 1.313 0 .78-.625 1.32-1.57 1.32-1.851 0-3.852-1.063-6.297-1.063a10.6 10.6 0 0 0-3.484.563c-.281.094-.406.336-.336.578s.305.39.61.281c1-.351 2.03-.523 3.21-.523 2.446 0 4.227 1.062 6.297 1.062M6.231 11.04c.969 0 1.726-.71 1.726-1.75 0-1.476-1.484-2.297-4.257-2.297a10.5 10.5 0 0 0-3.344.555c-.281.094-.406.336-.336.578s.305.39.61.281c.96-.328 2-.515 3.07-.515 2.203 0 3.359.547 3.359 1.398 0 .54-.375.852-.828.852-.461 0-.719-.32-.805-.805-.047-.258-.226-.469-.523-.445-.32.023-.438.289-.399.562.11.867.75 1.586 1.727 1.586"/>
          </svg>
          <span class="param-name">风速</span>
        </div>
        <div class="param-value">{{weather.now.windSpeed}}<span class="param-unit">公里/小时</span></div>
      </div>
      <div class="param" v-if="weather.now.pressure">
        <div class="param-key" v-once>
          <svg class="param-icon" viewBox="0 0 13.023 12.617">
            <path d="M6.305 12.61c3.445 0 6.312-2.86 6.312-6.305C12.617 2.859 9.742 0 6.297 0 2.859 0 0 2.86 0 6.305s2.867 6.304 6.305 6.304m0-1.188a5.087 5.087 0 0 1-5.102-5.117c0-2.844 2.258-5.117 5.094-5.117a5.1 5.1 0 0 1 5.125 5.117 5.095 5.095 0 0 1-5.117 5.117"/>
            <path d="M6.29 7.727a1.422 1.422 0 0 0 0-2.844c-.79 0-1.43.633-1.43 1.422s.64 1.422 1.43 1.422m0-.868a.554.554 0 1 1 0-1.109c.304 0 .554.242.554.555 0 .312-.25.554-.555.554m-.228.485-.796-.797-.961.969a.556.556 0 0 0 0 .789.566.566 0 0 0 .797 0ZM6.54 5.28l.805.79 2.101-2.11a.566.566 0 0 0 0-.797.566.566 0 0 0-.797 0Z"/>
          </svg>
          <span class="param-name">大气压</span>
        </div>
        <div class="param-value">{{weather.now.pressure}}<span class="param-unit">百帕</span></div>
      </div>
      <div class="param" v-if="weather.now.vis">
        <div class="param-key" v-once>
          <svg class="param-icon" viewBox="0 0 17.313 10.57">
            <path d="M8.453 10.57c5.024 0 8.453-4.023 8.453-5.28 0-1.267-3.43-5.282-8.453-5.282C3.508.008 0 4.023 0 5.289c0 1.258 3.508 5.281 8.453 5.281m0-1.093c-3.945 0-7.242-3.344-7.242-4.188 0-.68 3.297-4.187 7.242-4.187 3.938 0 7.235 3.507 7.235 4.187 0 .844-3.297 4.188-7.235 4.188m0-.758a3.44 3.44 0 0 0 3.438-3.43 3.406 3.406 0 0 0-3.438-3.43c-1.922 0-3.445 1.508-3.445 3.43a3.443 3.443 0 0 0 3.445 3.43m0-2.266a1.18 1.18 0 0 1-1.18-1.164 1.175 1.175 0 0 1 2.352 0c0 .633-.523 1.164-1.172 1.164"/>
          </svg>
          <span class="param-name">能见度</span>
        </div>
        <div class="param-value">{{weather.now.vis}}<span class="param-unit">公里</span></div>
      </div>
      <div class="param" v-if="weather.now.precip">
        <div class="param-key" v-once>
          <svg class="param-icon" viewBox="0 0 17.313 10.57">
            <path d="m9.36 13.93 1.765-3.063a.39.39 0 0 0-.148-.555c-.204-.109-.446-.062-.563.149l-1.75 3.047a.4.4 0 0 0 .14.57.4.4 0 0 0 .555-.148m-2.421-.008 1.757-3.04a.4.4 0 0 0-.148-.57c-.211-.117-.445-.062-.57.157l-1.758 3.054a.4.4 0 0 0 .156.555.403.403 0 0 0 .563-.156m-2.438 0 1.758-3.04a.4.4 0 0 0-.149-.57c-.21-.117-.445-.062-.57.157l-1.758 3.054a.4.4 0 0 0 .156.555.403.403 0 0 0 .563-.156m-2.437 0 1.757-3.04a.4.4 0 0 0-.148-.57c-.211-.117-.445-.062-.57.157l-1.758 3.054a.4.4 0 0 0 .156.555.403.403 0 0 0 .563-.156m1.085-4.578h7.57c2.04 0 3.54-1.547 3.54-3.453 0-1.985-1.61-3.43-3.703-3.43C9.789.96 8.344 0 6.602 0c-2.329 0-4.25 1.805-4.454 4.078-1.101.32-1.93 1.305-1.93 2.602 0 1.476 1.071 2.664 2.93 2.664"/>
          </svg>
          <span class="param-name">降水量</span>
        </div>
        <div class="param-value">{{weather.now.precip}}<span class="param-unit">毫米</span></div>
      </div>
    </div>
  </ElScrollbar>
</template>

<style lang="scss" scoped>
@import "/qweather-icons.css";
.weather {
  color: #f9f9f9;
  fill: #f9f9f9;
}
.wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  margin: 1em;
  .bars {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
.params {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  grid-gap: 0.5em;
  margin: 1.5em 0 1em 0;
}
.param {
  color: rgba(100%, 100%, 100%, 0.8);
  flex-basis: 4.5em;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, 1fr);
}
.param-icon {
  width: 1em;
  height: 1em;
  display: inline-block;
  fill: rgba(100%, 100%, 100%, 0.8);
  vertical-align: middle;
}
.param-name {
  font-weight: bolder;
  font-size: small;
  margin-left: 0.5em;
}
.param-key, .param-value {
  text-align: center;
}
.param-unit {
  font-size: xx-small;
  margin-left: 0.25em;
}
</style>