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
  <!-- 面板 -->
  <div class="panel-container">
    <!--  右侧面板  -->
    <transition name="right-panel" mode="out-in">
      <div
          class="right-panel"
          v-if="loadCompleted"
      >
        <div class="placeholder"/>
        <DecoratedContainer
            class="stylized-container"
            title="环境信息"
            client-height="9rem"
            client-width="24rem"
        >
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
      </div>
    </transition>
    <!--  左侧面板  -->
    <transition name="left-panel" mode="out-in">
      <div
          class="left-panel"
          v-if="loadCompleted"
      >
        <div class="placeholder"/>
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
            client-height="12rem"
            client-width="24rem"
        >
        </DecoratedContainer>
        <DecoratedContainer
            class="stylized-container"
            title="负荷电流变化"
            client-height="13rem"
            client-width="24rem"
        >
          <CurrentChangeLineChart />
        </DecoratedContainer>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@import "../../css/scene.style.css";
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