<template>
  <div class="dashboard">
    <div class="panel">
      <div class="info-box">
        <div class="info-title">总数</div>
        <hr class="divider">
        <div class="info-data">885</div>
      </div>
    </div>
    <div class="panel">
      <div class="info-box">
        <div class="info-title">在线</div>
        <hr class="divider">
        <div class="info-data" style="color: green">{{ onlineCount.toFixed(0) }}</div>
      </div>
    </div>
    <div class="panel">
      <div class="info-box">
        <div class="info-title">离线</div>
        <hr class="divider">
        <div class="info-data" style="color: yellow">{{ offlineCount.toFixed(0) }}</div>
      </div>
    </div>
    <div class="panel">
      <div class="info-box">
        <div class="info-title">告警</div>
        <hr class="divider">
        <div class="info-data" style="color: red">{{ alertCount.toFixed(0) }}</div>
      </div>
    </div>
  </div>
  <ElScrollbar style="margin-top: 1rem" height="7rem">
    <div class="status-displays">
      <div class="display-screen" v-for="screen in screens" :key="screen.title">
        <div class="vertical-line"></div>
        <div class="content">
          <div class="title">{{ screen.title }}</div>
          <div class="data">{{ screen.value }}</div>
        </div>
      </div>
    </div>
  </ElScrollbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const onlineCount = ref(Math.random() * 1000);
const offlineCount = ref(Math.random() * 500);
const alertCount = ref(Math.random() * 100);
const screens = ref([
  { title: '门禁探测器1', value: 100},
  { title: '门禁探测器2', value: 200 },
  { title: '水浸探测器', value: 150 },
  { title: "玻璃破碎探测器", value: 250 },
  { title: "门禁探测器3", value: 300 },
  { title: '红外被动探测器', value: 180 }
]);
</script>

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


