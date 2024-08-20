<template>
  <div class="container">
    <div class="dashboard">
      <div class="info-box">
        <div class="info-title">磁感应强度</div>
        <hr class="divider">
        <div class="info-data">
          <span class="magnetic">{{result?.magnetic?.toFixed(2) ?? '未知'}}&ensp;v/m</span>
        </div>
      </div>
      <div class="info-box">
        <div class="info-title">变电站噪声</div>
        <hr class="divider">
        <div class="info-data">
          <span class="noise">{{result?.noise?.toFixed(2) ?? '未知'}}&ensp;dB</span>
        </div>
      </div>
    </div>
    <EnvironmentDisplay class="display" :location="$props.location"/>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import EnvironmentDisplay from "./EnvironmentDisplay.vue";
import Api from "../../../ts/common/Api.ts";
defineProps<{
  location: string;
}>();
const result = reactive<Record<string, any>>({});
onMounted(() => {
  Api.Environment.getMagneticFieldInfo().then(resp => {
    result.magnetic = resp.data;
  }).catch(reason => console.error(reason));
  Api.Environment.getNoiseInfo().then(resp => {
    result.noise = resp.data;
  }).catch(reason => console.error(reason));
});
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
}
.dashboard {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column; /* 垂直排列 */
  justify-content: center; /* 横向排列 */
  align-items: center; /* 纵向居中 */
  height: 100%;
  margin-left: 0.5em;
  flex-basis: 9em;
}
.display {
  position: absolute;
  top: 0.25em;
  right: 0;
  height: calc(100% - 0.5em);
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
.info-data {
  font-size: 0.9em;
  font-weight: bold;
}

.divider {
  margin: 5px 0; /* 缩小为原来的一半 */
  border: 1px solid #ccc;
}
</style>