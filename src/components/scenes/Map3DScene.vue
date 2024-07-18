<script setup lang="ts">
import MapSceneCanvas from "../canvas/MapSceneCanvas.vue";
import SceneTutorial from "../misc/SceneTutorial.vue";
import DockItem from "../widgets/DockItem.vue";
import Dock from "../widgets/Dock.vue";
import MonitorPanel from "../views/management/monitor/MonitorPanel.vue";
import SystemPanel from "../views/management/system/SystemPanel.vue";
import DecoratedContainer from "../widgets/DecoratedContainer.vue";
</script>

<template>
  <SceneTutorial/>
  <MapSceneCanvas/>
  <Dock>
    <DockItem name="系统管理" icon="/images/system-management.png">
      <SystemPanel/>
    </DockItem>
    <DockItem name="系统监控" icon="/images/server-monitor.png">
      <MonitorPanel/>
    </DockItem>
  </Dock>
  <div class="panel-container">
    <div class="left-panel">
      <div style="height: 10rem;"></div>
      <DecoratedContainer title="标题" clientWidth="200px">
        <span style="color: white;">SOME TEXT</span>
      </DecoratedContainer>
    </div>
    <div class="right-panel"></div>
  </div>
</template>

<style scoped>
@import "../../css/scene.style.css";
</style>