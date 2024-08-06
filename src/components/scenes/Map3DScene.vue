<script setup lang="ts">
import MapSceneCanvas from "../canvas/MapSceneCanvas.vue";
import SceneTutorial from "../misc/SceneTutorial.vue";
import DockItem from "../widgets/DockItem.vue";
import Dock from "../widgets/Dock.vue";
import MonitorPanel from "../views/management/monitor/MonitorPanel.vue";
import SystemPanel from "../views/management/system/SystemPanel.vue";
import DecoratedContainer from "../widgets/DecoratedContainer.vue";
import {onMounted, ref} from "vue";
import PowerGridInfo from "../views/info/PowerGridInfo.vue";
import LoadDashboard from "../views/info/LoadDashboard.vue";
import {FeatureProperties} from "../../ts/map/GeoJson.ts";
import SensorCountTimeline from "../views/info/SensorCountTimeline.vue";
import EnvironmentDisplay from "../views/info/EnvironmentDisplay.vue";
import SubstationInfo from "../views/info/SubstationInfo.vue";
import Panel from "../widgets/Panel.vue";

const shouldDisplayPanel = ref<boolean>(false);
const onRegionClicked = (_: FeatureProperties | undefined, cancel: boolean) => {
  shouldDisplayPanel.value = cancel;
};
onMounted(() => {
  shouldDisplayPanel.value = true;
});
</script>

<template>
  <SceneTutorial/>
  <MapSceneCanvas @regionClicked="onRegionClicked"/>
  <Dock>
    <DockItem name="系统管理" icon="/images/system-management.png">
      <SystemPanel/>
    </DockItem>
    <DockItem name="系统监控" icon="/images/server-monitor.png">
      <MonitorPanel/>
    </DockItem>
  </Dock>
  <div class="panel-container">
    <Panel side="left" top="2rem" :show="shouldDisplayPanel">
      <DecoratedContainer
          class="decorated-container"
          title="运行状态"
          client-width="24rem"
          client-height="8rem"
      >
        <div class="status-display">
          <div class="normal-status-label">正<br/>常</div>
          <div class="warning-status-label">警<br/>戒</div>
          <div class="error-status-label">告<br/>警</div>
        </div>
      </DecoratedContainer>
      <DecoratedContainer
          class="decorated-container"
          title="变电站详情"
          client-width="24rem"
          client-height="13rem"
      >
        <SubstationInfo/>
      </DecoratedContainer>
      <DecoratedContainer
          class="decorated-container"
          title="环境监测"
          client-width="24rem"
          client-height="9rem"
      >
        <EnvironmentDisplay/>
      </DecoratedContainer>
    </Panel>
    <Panel side="right" top="2rem" :show="shouldDisplayPanel">
      <DecoratedContainer
          class="decorated-container"
          title="电网运行状况"
          client-width="24rem"
      >
        <PowerGridInfo style="width: 100%; height: 100%;"/>
      </DecoratedContainer>
      <DecoratedContainer
          class="decorated-container"
          title="电网负荷"
          client-width="24rem"
          client-height="13rem"
      >
        <LoadDashboard/>
      </DecoratedContainer>
      <DecoratedContainer
          class="decorated-container"
          title="传感动态趋势"
          client-width="24rem"
          client-height="14rem"
      >
        <SensorCountTimeline/>
      </DecoratedContainer>
    </Panel>
  </div>
</template>

<style lang="scss" scoped>
.panel-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  pointer-events: none;
}

.decorated-container {
  margin-top: 1rem;
}

.status-display {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
}

@mixin status-label-format($color) {
  width: 15%;
  height: 70%;
  background-image: linear-gradient(90deg, rgba($color, 0.3) 10%, transparent 10%),
  linear-gradient(rgba($color, 0.15) 10%, transparent 10%);
  background-size: 3px 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: larger;
  font-weight: bold;
  color: $color;
  position: relative;
  &::before {
    content: "";
    width: 0.3em;
    height: 0.3em;
    position: absolute;
    top: -0.15em;
    left: -0.15em;
    background: $color;
  }
  &::after {
    content: "";
    width: 0.3em;
    height: 0.3em;
    position: absolute;
    bottom: -0.15em;
    right: -0.15em;
    background: $color;
  }
}

.normal-status-label {
  @include status-label-format(#0BC9EA);
}

.warning-status-label {
  @include status-label-format(#F7C456);
}

.error-status-label {
  @include status-label-format(#FC8C44);
}
</style>