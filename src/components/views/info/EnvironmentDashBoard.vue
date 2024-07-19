<template>
  <div class="container">
    <div class="dashboard">
      <div class="info-box">
        <div class="info-title">磁感应强度</div>
        <hr class="divider">
        <div class="info-data">
          <span class="magnetic" v-if="result">{{result.magnetic_field.toFixed(2)}}</span>
          v/m
        </div>
      </div>
      <div class="info-box">
        <div class="info-title">变电站噪声</div>
        <hr class="divider">
        <div class="info-data">
          <span class="noise" v-if="result">{{result.noise_level.toFixed(2)}}</span>
          dB
        </div>
      </div>
    </div>
    <EnvironmentDisplay :width="100"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HTTPService from "../../../ts/common/Request.ts";
import {EnvironmentInfo, EnvironmentInfoResponse} from "../../../ts/common/ApiTypes.ts";
import EnvironmentDisplay from "./EnvironmentDisplay.vue";
const result = ref<EnvironmentInfo>();
onMounted(() => {
  HTTPService.get("/api/sensor/eim", {max_count: 10}).then((response: EnvironmentInfoResponse) => {
    // 判断一下是不是请求成功了
    if(response.code == 200) {
      // 如果成功就赋值
      result.value = response.data;
    }
  });
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
.dashboard {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  justify-content: center; /* 横向排列 */
  align-items: center; /* 纵向居中 */
  width: 100%; /* 适应父容器 */
  height: 100%;
  padding: 0;
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
  font-size: 18px;
  font-weight: bold;
}

.divider {
  margin: 5px 0; /* 缩小为原来的一半 */
  border: 1px solid #ccc;
}
</style>