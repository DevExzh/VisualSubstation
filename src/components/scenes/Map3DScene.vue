<script setup lang="ts">
import MapSceneCanvas from "../canvas/MapSceneCanvas.vue";
import SceneTutorial from "../misc/SceneTutorial.vue";
import DockItem from "../widgets/DockItem.vue";
import Dock from "../widgets/Dock.vue";
</script>

<template>
  <SceneTutorial/>
  <MapSceneCanvas />
  <Dock>
    <DockItem name="系统管理" icon="/images/system-management.svg" />
    <DockItem name="系统监控" icon="/images/server-monitor.svg" />
  </Dock>
</template>

<style scoped>

</style>