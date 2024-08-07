<script setup lang="ts">
import SkySceneCanvas from "../canvas/SkySceneCanvas.vue";
import ModelSceneCanvas from "../canvas/ModelSceneCanvas.vue";
import EventScrollView from "../views/info/EventScrollView.vue";
import CurrentChangeLineChart from "../views/info/CurrentChangeLineChart.vue";
import {ref} from "vue";
import LoadingView from "../views/info/LoadingView.vue";
import DockItem from "../widgets/DockItem.vue";
import Dock from "../widgets/Dock.vue";
import ModelDismantleCanvas from "../canvas/ModelDismantleCanvas.vue";
import DecoratedContainer from "../widgets/DecoratedContainer.vue";
import InspectionStatisticsChart from "../views/info/InspectionStatisticsChart.vue";
import EnvironmentDashBoard from "../views/info/EnvironmentDashBoard.vue";
import SensorInfoDashBoard from "../views/info/SensorInfoDashBoard.vue";
import Panel from "../widgets/Panel.vue";
import DecoratedButton from "../widgets/DecoratedButton.vue";

// 属性
withDefaults(defineProps<{
  sky?: boolean
}>(), {
  sky: true
});

// 是否加载完成
const loadCompleted = ref<boolean>(false);

const inspectedPeriod = ref<'today' | 'month'>('today');
</script>

<template>
  <Transition name="fade" mode="in-out">
    <LoadingView v-if="!loadCompleted"/>
  </Transition>
  <Dock style="z-index: 20">
    <DockItem name="感知设备管理" icon="/images/folder.png"></DockItem>
    <DockItem name="设备拆解" icon="/images/dismantle.png">
      <ElTabs tab-position="left" style="height: 100%; width: 100%;">
        <ElTabPane lazy label="变压器" name="transformer">
          <ModelDismantleCanvas
              manifest-path="/models/dismantled/transformer.dismantled.json"
              :dismantle-action="[
                  {modelName: 'transformer.part1', component: 'y', distance: 3},
                  {modelName: 'transformer.part2', component: 'x', distance: 3},
                  {modelName: 'transformer.part3', component: 'x', distance: -3},
              ]"
          />
        </ElTabPane>
        <ElTabPane lazy label="隔离开关" name="isolator">
          <ModelDismantleCanvas
              manifest-path="/models/dismantled/isolator-switch.dismantled.json"
              :dismantle-action="[
                  {modelName: 'isolator.part1', component: 'y', distance: 3},
                  {modelName: 'isolator.part2', component: 'x', distance: 3},
                  {modelName: 'isolator.part3', component: 'x', distance: 3},
                  {modelName: 'isolator.part4', component: 'x', distance: 3},
              ]"
          />
        </ElTabPane>
      </ElTabs>
    </DockItem>
  </Dock>
  <SkySceneCanvas
      v-if="$props.sky"
  />
  <ModelSceneCanvas
      manifest-path="/models.json"
      @load="loadCompleted = true"
  />
  <!--  右侧面板  -->
  <Panel side="right" top="2.5rem" :show="loadCompleted">
    <template #pin="scope">
      <DecoratedButton @click="scope.operations.toggleVisibility()">
        <svg style="width: 100%; height: 100%;" viewBox="0 0 517.217 897.628">
          <path style="fill: url(#decorated-fill)" v-if="scope.visible"
                d="M1.024 62.813v527.36q0 76.8-.512 141.312T0 831.837q0 24.576 11.776 40.96t29.696 22.016 39.424 0 39.936-24.064q37.888-38.912 81.92-81.408t90.624-85.504 94.208-86.016 91.648-82.944q19.456-17.408 29.184-43.008t8.704-53.248-11.776-54.272-32.256-45.056q-39.936-34.816-79.36-70.144t-80.896-72.704-87.04-78.336-96.768-87.04Q106.496 10.59 83.456 3.933T41.984 1.885t-29.696 20.48T1.024 62.813"/>
          <path style="fill: url(#decorated-fill)" v-else
                d="M516.194 62.813v527.36q0 76.8.512 141.312t.512 100.352q0 24.576-11.776 40.96t-29.696 22.016-39.424 0-39.936-24.064q-37.888-38.912-81.92-81.408t-90.624-85.504-94.208-86.016-91.648-82.944Q18.53 517.47 8.802 491.87T.098 438.621t11.776-54.272 32.256-45.056q39.936-34.816 79.36-70.144t80.896-72.704 87.04-78.336 96.768-87.04q22.528-20.48 45.568-27.136t41.472-2.048 29.696 20.48 11.264 40.448"/>
        </svg>
      </DecoratedButton>
    </template>
    <DecoratedContainer
        class="stylized-container"
        title="环境信息"
        client-height="12rem"
        client-width="24rem"
    >
      <EnvironmentDashBoard/>
    </DecoratedContainer>
    <DecoratedContainer
        class="stylized-container"
        title="巡视统计信息"
        client-height="13rem"
        client-width="24rem"
    >
      <template #header-corner>
        <ElButtonGroup class="corner-container" size="small">
          <ElButton text class="corner-button" @click="inspectedPeriod = 'today'">今日</ElButton>
          <ElButton text class="corner-button" @click="inspectedPeriod = 'month'">本月</ElButton>
        </ElButtonGroup>
      </template>
      <InspectionStatisticsChart v-model:period="inspectedPeriod"/>
    </DecoratedContainer>
    <DecoratedContainer
        class="stylized-container"
        title="实时感知"
        client-height="13rem"
        client-width="24rem"
    >
      <EventScrollView/>
    </DecoratedContainer>
  </Panel>
  <!--  左侧面板  -->
  <Panel side="left" top="2.5rem" :show="loadCompleted">
    <DecoratedContainer
        class="stylized-container"
        title="设备规模"
        client-height="9rem"
        client-width="24rem"
    >
    </DecoratedContainer>
    <DecoratedContainer
        class="stylized-container"
        title="传感器规模"
        client-height="14rem"
        client-width="24rem"
    >
      <SensorInfoDashBoard/>
    </DecoratedContainer>
    <DecoratedContainer
        class="stylized-container"
        title="负荷电流变化"
        client-height="13rem"
        client-width="24rem"
    >
      <CurrentChangeLineChart />
    </DecoratedContainer>
  </Panel>
</template>

<style scoped>
:deep(.el-tabs__content), :deep(.el-tab-pane) {
  height: 100%;
}
.fade-leave-active {
  transition: opacity 0.3s ease-in;
}
.fade-leave-to {
  opacity: 0;
}
.corner-container {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
}
.corner-button {
  color: #02EA93;
  opacity: 0.4;
  cursor: pointer;
  width: 3em;
}
</style>