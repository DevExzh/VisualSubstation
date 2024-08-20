<script setup lang="ts">
import {onMounted, ref} from "vue";
import Api from "../../../ts/common/Api.ts";
withDefaults(defineProps<{
  height?: string
}>(), {
  height: '4.5rem'
});
const deviceNameMapping: Record<string, any> = {
  groundingTransformer: {
    name: '接地变',
    unit: '台'
  },
  switchgear: {
    name: '开关柜',
    unit: '台',
  },
  transformer: {
    name: '变压器',
    unit: '台',
  },
  cable: {
    name: '电缆',
    unit: '回'
  },
};
const devices = ref<Record<string, any>[]>([]);
const decoration = [
  "/images/bg-decoration-6.svg",
  "/images/bg-decoration-7.svg",
  "/images/bg-decoration-10.svg"
];
onMounted(() => {
  Api.Equipment.getEquipmentScale().then(resp => {
    for(const deviceType in resp.data) {
      if(devices.value.length >= 4) break;
      if(!(deviceType in deviceNameMapping)) continue;
      devices.value.push({
        name: deviceNameMapping[deviceType].name,
        unit: deviceNameMapping[deviceType].unit,
        count: resp.data[deviceType]
      });
    }
  });
});
</script>

<template>
  <div class="device-list">
    <div class="device" v-for="(dev, index) in devices">
      <img class="device-deco" :src="decoration[index % 3]" alt="background decoration" />
      <div class="device-count">
        <span class="count" v-if="dev.count">{{dev.count}}</span>
        <span class="unit" v-if="dev.unit">{{dev.unit}}</span>
      </div>
      <div class="device-name">{{dev.name}}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$height: v-bind(height);
.device-list {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
  .device {
    position: relative;
    display: inline-block;
    &-count {
      position: absolute;
      top: 11.5%;
      width: 100%;
      text-align: center;
      color: rgba(100%, 100%, 100%, 0.8);
      .count {
        font-size: calc(0.3 * $height);
        padding-right: 0.1em;
      }
      .unit {
        font-size: calc(0.1 * $height);
        font-weight: bolder;
      }
    }
    &-deco {
      height: $height;
    }
    &-name {
      font-size: calc(0.125 * $height);
      position: absolute;
      top: 1%;
      left: 50%;
      transform: translateX(-50%);
      background: white linear-gradient(180deg, #1ABCFF 0%, white 100%);
      text-shadow: 0 8pt 4pt 0 rgba(1,230,254,0.5);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    }
  }
}
</style>