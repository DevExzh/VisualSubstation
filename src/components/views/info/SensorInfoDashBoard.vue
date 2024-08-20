<script setup lang="ts">
import {onMounted, reactive} from 'vue';
import Api from "../../../ts/common/Api.ts";
const data = reactive<Record<string, any>>({
  running: 0, broken: 0, total: 0, error: 0, extreme: 0,
  sensors: [],
});
onMounted(() => {
  Api.Sensor.getSensorCountByType().then(resp => {
    for(const key in resp.data) {
      data[key] = resp.data[key];
    }
  });
});
</script>

<template>
  <div class="dashboard">
    <div class="panel">
      <div class="info-box">
        <div class="info-title">总数</div>
        <hr class="divider">
        <div class="info-data">{{ data.total }}</div>
      </div>
    </div>
    <div class="panel">
      <div class="info-box">
        <div class="info-title">在线</div>
        <hr class="divider">
        <div class="info-data" style="color: green">{{ data.running }}</div>
      </div>
    </div>
    <div class="panel">
      <div class="info-box">
        <div class="info-title">离线</div>
        <hr class="divider">
        <div class="info-data" style="color: yellow">{{ data.broken }}</div>
      </div>
    </div>
    <div class="panel">
      <div class="info-box">
        <div class="info-title">告警</div>
        <hr class="divider">
        <div class="info-data" style="color: red">{{ data.error }}</div>
      </div>
    </div>
  </div>
  <ElScrollbar style="margin-top: 1rem" height="7rem">
    <div class="status-displays">
      <div class="display-screen" v-for="sensor in data.sensors" :key="sensor.name">
        <div class="vertical-line"></div>
        <div class="content">
          <div class="title">{{ sensor.name }}</div>
          <div class="data">{{ sensor.count }}</div>
        </div>
      </div>
    </div>
  </ElScrollbar>
</template>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  margin-top: 0.5rem;
}
.panel {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18%;
}
.info-box {
  background: linear-gradient(to bottom, rgba(5, 27, 38, .8), rgba(0, 65, 97, .8));
  border-radius: 0.25em;
  border: 1px solid #5EBCF5;
  margin: 0.1em;
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
  margin: 10px 0;
  border: 1px solid #ccc;
}
.status-displays {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  &:first-child {
    margin-top: -1rem;
  }
  &:last-child {
    margin-bottom: 1rem;
  }
}
.display-screen {
  display: flex;
  align-items: center;
  background-color: #1a1a2e;
  border-radius: 8px;
  margin-top: 1rem;
  width: 10rem; /* Two items per row, considering margins */
  height: 2.5rem;
  box-shadow: 0 0 1rem rgba(0, 242, 254, 0.2);
  border: 1px solid #5EBCF5;
  overflow: hidden;
}
.vertical-line {
  width: 5px;
  height: 100%;
  background-color: orange;
  margin-right: 0.75rem;
}
.content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: 0.8rem;
}
.title {
  flex: 3;
  font-size: smaller;
  color: white;
}
.data {
  flex: 1;
  font-size: smaller;
  color: orange;
  text-align: right;
}
</style>


