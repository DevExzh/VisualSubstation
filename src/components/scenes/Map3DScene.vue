<script setup lang="ts">
import MapSceneCanvas from "../canvas/MapSceneCanvas.vue";
import SceneTutorial from "../misc/SceneTutorial.vue";
import DockItem from "../widgets/layout/DockItem.vue";
import Dock from "../widgets/layout/Dock.vue";
import MonitorPanel from "../views/management/monitor/MonitorPanel.vue";
import SystemPanel from "../views/management/system/SystemPanel.vue";
import DecoratedContainer from "../widgets/decoration/DecoratedContainer.vue";
import {onMounted, ref} from "vue";
import PowerGridInfo from "../views/info/PowerGridInfo.vue";
import LoadDashboard from "../views/info/LoadDashboard.vue";
import {FeatureProperties} from "../../ts/map/GeoJson.ts";
import SensorCountTimeline from "../views/info/SensorCountTimeline.vue";
import EnvironmentDisplay from "../views/info/EnvironmentDisplay.vue";
import SubstationInfo from "../views/info/SubstationInfo.vue";
import Panel from "../widgets/layout/Panel.vue";
import DecoratedButton from "../widgets/decoration/DecoratedButton.vue";

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
  <Panel side="left" top="2.5rem" :show="shouldDisplayPanel">
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
        client-height="8.25rem"
    >
      <EnvironmentDisplay location="101020800"/>
    </DecoratedContainer>
  </Panel>
  <Panel side="right" top="2.5rem" :show="shouldDisplayPanel">
    <template #pin="scope">
      <DecoratedButton
          @click="scope.operations.toggleVisibility"
          :tooltip="scope.visible ? '折叠面板' : '展开面板'"
          tooltip-placement="left-start"
      >
        <svg style="width: 60%; height: 60%;" viewBox="0 0 517.217 897.628">
          <path fill="url(#decorated-fill)" v-if="scope.visible"
                d="M1.024 62.813v527.36q0 76.8-.512 141.312T0 831.837q0 24.576 11.776 40.96t29.696 22.016 39.424 0 39.936-24.064q37.888-38.912 81.92-81.408t90.624-85.504 94.208-86.016 91.648-82.944q19.456-17.408 29.184-43.008t8.704-53.248-11.776-54.272-32.256-45.056q-39.936-34.816-79.36-70.144t-80.896-72.704-87.04-78.336-96.768-87.04Q106.496 10.59 83.456 3.933T41.984 1.885t-29.696 20.48T1.024 62.813"/>
          <path fill="url(#decorated-fill)" v-else
                d="M516.194 62.813v527.36q0 76.8.512 141.312t.512 100.352q0 24.576-11.776 40.96t-29.696 22.016-39.424 0-39.936-24.064q-37.888-38.912-81.92-81.408t-90.624-85.504-94.208-86.016-91.648-82.944Q18.53 517.47 8.802 491.87T.098 438.621t11.776-54.272 32.256-45.056q39.936-34.816 79.36-70.144t80.896-72.704 87.04-78.336 96.768-87.04q22.528-20.48 45.568-27.136t41.472-2.048 29.696 20.48 11.264 40.448"/>
        </svg>
      </DecoratedButton>
    </template>
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
</template>

<style lang="scss" scoped>
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

.decorated-path {
  box-shadow: 0 0 20px 0 rgba(0, 133, 255, 0.50);
}
</style>