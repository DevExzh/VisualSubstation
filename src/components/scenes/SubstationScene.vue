<script setup lang="ts">
import SkySceneCanvas from "../canvas/SkySceneCanvas.vue";
import ModelSceneCanvas from "../canvas/ModelSceneCanvas.vue";
import EventScrollView from "../views/info/EventScrollView.vue";
import CurrentChangeLineChart from "../views/info/CurrentChangeLineChart.vue";
import LoadDashboard from "../views/info/LoadDashboard.vue";
import {BorderBox11} from "@dataview/datav-vue3";
import {ref} from "vue";
import LoadingView from "../views/info/LoadingView.vue";

// 属性
withDefaults(defineProps<{
  sky?: boolean
}>(), {
  sky: true
});

// 是否加载完成
const loadCompleted = ref<boolean>(false);
</script>

<template>
  <Transition name="fade" mode="in-out">
    <LoadingView v-if="!loadCompleted"/>
  </Transition>
  <SkySceneCanvas
      v-if="$props.sky"
  />
  <ModelSceneCanvas
      manifest-path="/models.json"
      @load="loadCompleted = true"
  />
  <!-- 面板 -->
  <div class="panel-container">
    <!--  右侧面板  -->
    <div
        id="right-panel"
        v-if="loadCompleted"
    >
      <div class="placeholder"/>
      <BorderBox11
          backgroundColor="rgba(65,94,121,0.7)"
          class="stylized-container"
          title="环境信息"
          :titleWidth="170"
          style="height: 14rem;"
      >
      </BorderBox11>
      <BorderBox11
          backgroundColor="rgba(65,94,121,0.7)"
          class="stylized-container"
          title="设备负载"
          :titleWidth="170"
          style="height: 16rem;"
      >
        <div class="decorated-container">
          <LoadDashboard />
        </div>
      </BorderBox11>
      <BorderBox11
          backgroundColor="rgba(65,94,121,0.7)"
          class="stylized-container"
          title="实时感知"
          :titleWidth="170"
          style="height: 18rem;"
      >
        <div class="decorated-container">
          <EventScrollView/>
        </div>
      </BorderBox11>
    </div>
    <!--  左侧面板  -->
    <div
        id="left-panel"
        v-if="loadCompleted"
    >
      <div class="placeholder"/>
      <BorderBox11
          backgroundColor="rgba(65,94,121,0.7)"
          class="stylized-container"
          title="设备规模"
          :titleWidth="170"
          style="height: 14rem;"
      >
        <div class="decorated-container">
        </div>
      </BorderBox11>
      <BorderBox11
          backgroundColor="rgba(65,94,121,0.7)"
          class="stylized-container"
          title="巡视统计信息"
          :titleWidth="200"
          style="height: 18rem;"
      >
        <div class="decorated-container">
        </div>
      </BorderBox11>
      <BorderBox11
          backgroundColor="rgba(65,94,121,0.7)"
          class="stylized-container"
          title="负荷电流变化"
          :titleWidth="200"
          style="height: 18rem;"
      >
        <div class="decorated-container">
          <CurrentChangeLineChart />
        </div>
      </BorderBox11>
    </div>
  </div>
</template>

<style scoped>
.placeholder {
  height: 3rem;
  margin: 0;
  padding: 0;
}
.stylized-container > * {
  animation: 1s ease-out 0s item-appear;
}
.decorated-container {
  position: absolute;
  top: 3.2rem;
  left: 0;
  width: 100%;
  height: calc(100% - 3.2rem);
}
.panel-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
}
#right-panel {
  position: absolute;
  max-width: 30rem;
  width: 25%;
  right: 0;
  padding-right: 0.5rem;
  height: 100%;
  z-index: 5;
  background: linear-gradient(to left, rgba(20, 20, 20, 0.8), transparent);
  animation: 1s ease-out 0s right-panel-move;
}
#left-panel {
  position: absolute;
  max-width: 30rem;
  width: 25%;
  left: 0;
  padding-left: 0.5rem;
  height: 100%;
  z-index: 5;
  background: linear-gradient(to right, rgba(20, 20, 20, 0.8), transparent);
  animation: 1s ease-out 0s left-panel-move;
}
@keyframes item-appear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes right-panel-move {
  from {
    right: -25%;
  }
  to {
    right: 0;
  }
}
@keyframes left-panel-move {
  from {
    left: -25%;
  }
  to {
    left: 0;
  }
}
.fade-leave-active {
  transition: opacity 0.3s ease-in;
}
.fade-leave-to {
  opacity: 0;
}
</style>