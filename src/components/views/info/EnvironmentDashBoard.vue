<template>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HTTPService from "../../../ts/common/Request.ts";
import {EnvironmentInfo, EnvironmentInfoResponse} from "../../../ts/common/ApiTypes.ts";
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
.dashboard {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  justify-content: space-between; /* 横向排列 */
  align-items: center; /* 纵向居中 */
  height: 150px;
  width: 100%; /* 适应父容器 */
  padding: 0;
}

.info-box {
  border-radius: 8px;
  color: white;
  text-align: center;
  background: linear-gradient(145deg, #0f3460, #162447);
  border: 2px solid #00f2fe;
  box-shadow: 0 0 15px #00f2fe;
  height: 70px;
  width: 125px; /* 缩小为原来的一半 */
  margin: 5px; /* 增加外边距，避免贴合太紧 */
}

.info-title {
  font-size: 12px; /* 缩小为原来的一半 */
  margin-bottom: 5px; /* 缩小为原来的一半 */
  background-color: #1a1a2e;
  padding: 5px; /* 缩小为原来的一半 */
  border-radius: 5px;
}

.info-data {
  font-size: 16px; /* 缩小为原来的一半 */
  background-color: #1f4068;
  padding: 5px; /* 缩小为原来的一半 */
  border-radius: 5px;
}

.divider {
  margin: 5px 0; /* 缩小为原来的一半 */
  border: 1px solid #ccc;
}
</style>