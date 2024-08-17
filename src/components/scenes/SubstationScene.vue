<script setup lang="ts">
import SkySceneCanvas from "../canvas/SkySceneCanvas.vue";
import ModelSceneCanvas from "../canvas/ModelSceneCanvas.vue";
import EventScrollView from "../views/info/EventScrollView.vue";
import CurrentChangeLineChart from "../views/info/CurrentChangeLineChart.vue";
import {onMounted, ref} from "vue";
import LoadingView from "../views/info/LoadingView.vue";
import DockItem from "../widgets/layout/DockItem.vue";
import Dock from "../widgets/layout/Dock.vue";
import ModelDismantleCanvas from "../canvas/ModelDismantleCanvas.vue";
import DecoratedContainer from "../widgets/decoration/DecoratedContainer.vue";
import InspectionStatisticsChart from "../views/info/InspectionStatisticsChart.vue";
import EnvironmentDashBoard from "../views/info/EnvironmentDashBoard.vue";
import SensorInfoDashBoard from "../views/info/SensorInfoDashBoard.vue";
import Panel from "../widgets/layout/Panel.vue";
import DecoratedButton from "../widgets/decoration/DecoratedButton.vue";
import {CameraViewType} from "../../ts/common/Types.ts";
import SensorList from "../views/management/sensor/SensorList.vue";

// 属性
withDefaults(defineProps<{
  sky?: boolean,
  location: string,
}>(), {
  sky: false
});

// 是否加载完成
const loadCompleted = ref<boolean>(false);
const inspectedPeriod = ref<'today' | 'month'>('today');
const modelScene = ref<InstanceType<typeof ModelSceneCanvas>>();
const cameraViewType = ref<CameraViewType>(CameraViewType.Spectator);
let callFunc: ((
    functionName: string,
    isAsync: boolean,
    expectResult: boolean,
    ...parameters: any[]
) => Promise<any>) | undefined;
const toggleCameraViewType = () => {
  if(!loadCompleted.value || !modelScene.value) return;
  if(!callFunc) callFunc = modelScene.value!.useCall();
  callFunc?.('toggleCameraViewType', false, false);
};
const onCameraViewTypeChange = (type: CameraViewType) => {
  cameraViewType.value = type;
};
const sensors = ref<any[]>([{}]);
onMounted(() => {
  callFunc = modelScene.value!.useCall();
});
</script>

<template>
  <Transition name="fade" mode="in-out">
    <LoadingView v-if="!loadCompleted"/>
  </Transition>
  <Dock style="z-index: 20">
    <DockItem name="感知设备管理" icon="/images/folder.png">
      <SensorList
          v-if="modelScene"
          v-model="sensors"
      />
    </DockItem>
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
      ref="modelScene"
      @load="loadCompleted = true"
      @camera-view-type="onCameraViewTypeChange"
  />
  <!--  右侧面板  -->
  <Panel side="right" top="2.5rem" :show="loadCompleted">
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
      <DecoratedButton
          @click="toggleCameraViewType"
          tooltip="切换视角"
          tooltip-placement="left-start"
      >
        <transition name="fade" mode="out-in">
          <svg style="width: 60%; height: 60%;" viewBox="0 0 1024 1024" :key="cameraViewType">
            <path
                fill="url(#decorated-fill)" v-if="cameraViewType === CameraViewType.FirstPerson"
                d="M761.7 671.9c-46.4-18.2-103.2-30.6-165.1-36.5l14.1-139h32.5c13.2 0 23.9-10.7 23.9-23.9l-33-215.8c0-13.2-10.7-23.9-23.9-23.9h-54.7l-41.9 30-48.5-30h-50c-13.2 0-23.9 10.7-23.9 23.9l-31 215.8c0 13.2 10.7 23.9 23.9 23.9h32.5l14.1 139c-61.9 5.9-118.7 18.4-165.1 36.5-70.9 27.8-110 66.5-110 109s39.1 81.2 110 109c66.5 26.1 154.6 40.4 248.1 40.4s181.6-14.4 248.1-40.4c70.9-27.8 110-66.5 110-109s-39.1-81.2-110.1-109m-319.2 81.4c0 12.3 11.5 22.2 25.7 22.2H559c14.2 0 25.7-9.9 25.7-22.2l3.3-33.1c19.1 3.4 36.7 8.1 51.9 14.1 27.8 10.9 45.1 25.3 45.1 37.7 0 12.3-17.3 26.8-45.1 37.7-33.5 13.1-78.4 20.4-126.3 20.4-48 0-92.8-7.2-126.3-20.4-27.8-10.9-45.1-25.3-45.1-37.7 0-12.3 17.3-26.8 45.1-37.7 15.2-6 32.8-10.7 51.9-14.1zm308.3 108.8c-63.1 24.7-147.3 38.3-237.1 38.3s-174-13.6-237.1-38.3c-57.8-22.7-91-52.2-91-81.1s33.2-58.5 91-81.1c43.9-17.2 98-29 157.2-34.6l2.5 25c-22 3.8-42.2 9.2-59.8 16.1-41.3 16.2-64.1 39.5-64.1 65.6s22.8 49.4 64.1 65.6C413.2 852 462 860 513.6 860s100.4-8 137.3-22.4c41.3-16.2 64.1-39.5 64.1-65.6s-22.8-49.4-64.1-65.6c-17.6-6.9-37.8-12.3-59.8-16.1l2.5-25c59.1 5.6 113.3 17.4 157.2 34.6 57.8 22.7 91 52.2 91 81.1s-33.2 58.4-91 81.1M464.554 199.974a69.4 69.4 0 1 0 98.145-98.148 69.4 69.4 0 1 0-98.145 98.148"
            />
            <path
                fill="url(#decorated-fill)" v-else-if="cameraViewType === CameraViewType.ThirdPerson"
                d="M885.077 380.075a25.77 25.77 0 0 0-23.552-3.072L675.5 446.123v-17.067a53.077 53.077 0 0 0-53.248-53.59H181.248A53.077 53.077 0 0 0 128 428.374v218.454a53.077 53.077 0 0 0 53.248 52.906h136.533L191.317 844.971a25.6 25.6 0 0 0 38.571 34.133l145.579-168.277v219.306a25.6 25.6 0 0 0 51.2 0V710.827l146.261 167.936a25.6 25.6 0 0 0 38.57-34.134l-125.78-144.896H622.25a53.077 53.077 0 0 0 53.248-52.906V629.76l186.026 68.267a26.3 26.3 0 0 0 8.875 1.706 25.6 25.6 0 0 0 25.6-25.6V401.067a25.6 25.6 0 0 0-10.923-20.992M531.968 358.4a128 128 0 1 0-126.976-128 127.66 127.66 0 0 0 126.976 128m-270.677 8.533a102.4 102.4 0 1 0-102.4-102.4 102.4 102.4 0 0 0 102.4 102.4"
            />
            <path
                fill="url(#decorated-fill)" v-else
                d="M342.833 808.325c9.544 59.103-20.088 117.62-73.39 144.881-53.3 27.262-118.093 17.056-160.426-25.278-42.334-42.334-52.54-107.126-25.279-160.427C111 714.2 169.517 684.555 228.62 694.112c14.835-15.92 28.335-31.304 40.325-45.977-69.509-23.731-146.466-5.89-198.444 46.002-75.074 75.06-75.074 197.222 0 272.307 75.06 75.086 197.234 75.086 272.32 0 51.865-51.966 69.72-128.886 46.014-198.382-14.698 11.966-30.12 25.44-46.002 40.263M766.21 641.148c11.79 14.822 25.103 30.269 39.726 46.227 59.065-9.42 117.482 20.274 144.681 73.55 27.188 53.277 16.969 118.007-25.315 160.303-42.284 42.31-107.002 52.565-160.29 25.403C711.723 919.47 681.99 861.077 691.386 802c-15.958-14.61-31.417-27.91-46.252-39.688-23.244 69.259-5.34 145.704 46.252 197.446 75.073 75.085 197.246 75.085 272.32 0 75.06-75.086 75.085-197.247 0-272.32-51.742-51.63-128.212-69.546-197.496-46.29m-71.867-413.059c-9.457-59.078 20.225-117.532 73.514-144.744S885.9 66.352 928.209 108.661s52.553 107.051 25.353 160.352c-27.2 53.289-85.641 82.996-144.719 73.539-15.222 16.494-28.485 31.866-39.976 46.14 69.384 23.443 146.042 5.539 197.87-46.19 75.086-75.086 75.086-197.247 0-272.32-75.085-75.085-197.258-75.085-272.32 0-51.766 51.854-69.645 128.562-46.164 197.97 13.912-11.241 29.259-24.492 46.09-40.063m-433.72 146.803c-12.415-14.748-26.152-29.982-41.05-45.69-59.164 9.782-117.868-19.751-145.28-73.09-27.399-53.326-17.218-118.255 25.191-160.664 42.409-42.384 107.339-52.54 160.677-25.116 53.326 27.424 82.846 86.14 73.04 145.305a1049 1049 0 0 0 45.69 41.05c24.367-69.809 6.65-147.402-45.603-199.718-75.086-75.085-197.284-75.085-272.32 0-75.036 75.086-75.085 197.247 0 272.32 52.303 52.203 129.86 69.92 199.655 45.603m259.568 85.08c-26.813.037-49.87 19.014-55.073 45.315-5.203 26.314 8.896 52.628 33.688 62.871 24.779 10.244 53.35 1.56 68.236-20.749s11.953-52.016-7.012-70.98a55.98 55.98 0 0 0-39.839-16.457m0 0"/><path d="M789.304 844.42c3.207 3.407 11.042 12.29 12.677 13.925l.81.786c.425.487.9.923 1.436 1.298 19.152 17.23 46.725 18.565 62.82 2.408 15.098-15.097 14.923-40.313.612-59.203a170 170 0 0 0-12.227-12.153c-1.585-1.335-2.858-2.52-3.469-2.994-44.043-40.8-187.789-180.39-184.957-262.176.112-3.406 0-17.755 0-21.884-.4-82.048 141.35-219.668 185.007-260.13a316 316 0 0 1 3.468-3.02 167 167 0 0 0 12.228-12.14c14.273-18.89 14.485-44.093-.612-59.202-16.095-16.095-43.656-14.823-62.82 2.408a8.3 8.3 0 0 0-1.423 1.297c-.262.275-.536.512-.81.774-1.635 1.647-9.483 10.518-12.677 13.949-42.983 46.04-170.284 175.212-250.76 181.314-6.338.486-28.01.386-33.313.174-82.41-3.219-217.035-141.824-256.899-184.932-.499-.536-1.659-1.884-3.006-3.468a165 165 0 0 0-12.14-12.215c-18.89-14.274-44.106-14.486-59.203.599-16.095 16.107-14.835 43.669 2.408 62.82.374.525.81 1.011 1.298 1.436l.773.798c1.647 1.66 10.518 9.483 13.937 12.677C237.279 289.488 360.974 411.336 372.989 492c1.298 8.683 1.21 44.13-1.11 55.122-17.13 80.576-135.748 197.372-179.48 238.183-3.418 3.207-12.29 11.03-13.936 12.677l-.774.81a8 8 0 0 0-1.297 1.436c-17.243 19.164-18.554 46.726-2.409 62.82 15.11 15.11 40.313 14.935 59.203.612a165 165 0 0 0 12.14-12.215c1.348-1.584 2.52-2.857 3.032-3.468 38.978-42.085 168.15-175.225 250.922-184.52 7.461-.836 33.887-.812 40.787-.163 80.575 7.599 206.529 135.449 249.237 181.127M581.99 577.99c-24.991 24.991-62.584 32.477-95.236 18.952-32.664-13.525-53.95-45.39-53.95-80.737s21.286-67.213 53.95-80.738c32.652-13.525 70.245-6.051 95.236 18.94a86.834 86.834 0 0 1 0 123.583m0 0"
          />
          </svg>
        </transition>
      </DecoratedButton>
    </template>
    <DecoratedContainer
        class="stylized-container"
        title="环境信息"
        client-height="12rem"
        client-width="24.5rem"
    >
      <EnvironmentDashBoard :location="$props.location"/>
    </DecoratedContainer>
    <DecoratedContainer
        class="stylized-container"
        title="巡视统计信息"
        client-height="13rem"
        client-width="24.5rem"
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
        client-width="24.5rem"
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
        client-width="24.5rem"
    >
    </DecoratedContainer>
    <DecoratedContainer
        class="stylized-container"
        title="传感器规模"
        client-height="14rem"
        client-width="24.5rem"
    >
      <SensorInfoDashBoard/>
    </DecoratedContainer>
    <DecoratedContainer
        class="stylized-container"
        title="负荷电流变化"
        client-height="13rem"
        client-width="24.5rem"
    >
      <CurrentChangeLineChart />
    </DecoratedContainer>
  </Panel>
</template>

<style scoped>
:deep(.el-tabs__content), :deep(.el-tab-pane) {
  height: 100%;
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