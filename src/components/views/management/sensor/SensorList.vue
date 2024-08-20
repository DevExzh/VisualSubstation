<script lang="ts" setup>
import { ElTable, ElTableColumn, ElTooltip, ElIcon, ElTag, ElContainer } from 'element-plus';
import { Setting, View, MapLocation } from '@element-plus/icons-vue';
import {onBeforeUnmount, onMounted, reactive, ref} from "vue";
import SensorInfoForm from "./SensorInfoForm.vue";
import Widget from "../../../widgets/layout/Widget.vue";
import Api from "../../../../ts/common/Api.ts";
import useCommonStore from "../../../../ts/store/CommonStore.ts";
import {keySceneOperations, ModelSceneOperations} from "../../../canvas/ModelSceneCanvas.ts";
import {Projector} from "../../../../ts/map/workers/Projector.ts";
import {useRoute} from "vue-router";

const tableData = defineModel<Record<string, any>[]>({required: true});
const currentEditor = reactive<{
  title: string,
  visible: boolean,
  data: Record<string, any>,
}>({
  title: "设置传感器信息",
  visible: false,
  data: {},
});
const openEditor = (row: Record<string, any>) => {
  currentEditor.visible = true;
  currentEditor.data = row;
};
enum SensorType {
  Current = 0, MagneticField = 1, NoiseLevel = 2, GridLoad = 3
}
const nameOfType = (typeVal: SensorType) => {
  switch (typeVal) {
    case SensorType.Current: return '电流';
    case SensorType.MagneticField: return '磁场';
    case SensorType.NoiseLevel: return '响度';
    case SensorType.GridLoad: return '功率';
    default: return '未知';
  }
};
const statusToString = (status: string) => {
  switch (status) {
    case 'running': return '运行中';
    default: return '未知';
  }
};
const operations = useCommonStore().get(keySceneOperations) as ModelSceneOperations;
const projector = new Projector();
const route = useRoute();
let uuid: string | undefined;
let viewerMode: boolean = false;
const viewSensorInTheScene = async (info: Record<string, any>) => {
  if(viewerMode) {
    if(uuid) {
      await operations.removeObjectFunction(uuid);
      viewerMode = false;
    }
  } else {
    viewerMode = true;
    projector
        .center(
            route.params.location
                ? [...((route.params.location as string).split(',').map(c => parseFloat(c)) as [number, number])]
                : [103.38, 35.55]
        )
        .translate([0, 0]);
    // 投影后在场景中的位置
    const result = await Promise.all([
      operations.addObjectFunction('/arduino.glb'),
      projector.project([info.location.longitude, info.location.latitude]),
    ]);
    uuid = result[0];
    const pos = result[1];
    if(uuid) {
      await operations.setObjectPosition(uuid, [pos[0], 0, pos[1]]);
    }
  }
};
const isLoading = ref<boolean>(true);
onMounted(() => {
  Api.Sensor.getSensors().then(resp => {
    tableData.value = resp.rows;
    isLoading.value = false;
  });
});
onBeforeUnmount(() => {
  if(uuid) {
    operations.removeObjectFunction(uuid);
  }
});
</script>

<template>
  <div style="width: 100%; height: 100%;" v-loading="isLoading" element-loading-text="数据加载中...">
    <ElTable
        :data="tableData" stripe height="100%"
        style="width: 100%; background: transparent;"
    >
      <ElTableColumn fixed="left" sortable prop="id" label="编号" width="120" align="center" />
      <ElTableColumn sortable prop="status" label="当前状态" width="120" align="center">
        <template #default="scope">
          <ElTag>{{statusToString(scope.row.status)}}</ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn sortable prop="name" label="名称" width="120" align="center" />
      <ElTableColumn sortable prop="type" label="类型" width="120" align="center">
        <template #default="scope">
          <ElTag>{{nameOfType(scope.row.type)}}</ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn sortable prop="unit" label="单位" width="100" align="center" />
      <ElTableColumn show-overflow-tooltip sortable prop="description" label="描述" width="120" align="center" />
      <ElTableColumn sortable prop="manufacturer" label="制造商" width="150" align="center" />
      <ElTableColumn sortable prop="installationDate" label="安装日期" width="120" align="center" />
      <ElTableColumn sortable prop="lastMaintenanceDate" label="维护日期" width="120" align="center" />
      <ElTableColumn show-overflow-tooltip sortable prop="location" label="地理位置" width="300" align="center">
        <template #default="scope">
          <ElIcon><MapLocation/></ElIcon>&ensp;({{scope.row.location.longitude}}, {{scope.row.location.latitude}})
        </template>
      </ElTableColumn>
      <ElTableColumn fixed="right" label="操作" width="100" align="center">
        <template #default="scope">
          <ElContainer class="op-container">
            <ElTooltip content="设置" :show-after="1500" :auto-close="1500">
              <ElIcon class="op" size="1.2em">
                <Setting @click="openEditor(scope.row)" />
              </ElIcon>
            </ElTooltip>
            <ElTooltip content="查看" :show-after="1500" :auto-close="1500">
              <ElIcon class="op" size="1.2em">
                <View @click="viewSensorInTheScene(scope.row)"/>
              </ElIcon>
            </ElTooltip>
          </ElContainer>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
  <Widget
      width="32em" height="20em" x="center" y="center"
      active-on-display v-if="currentEditor.visible"
      :control-buttons="['close']"
      :window-title="currentEditor.title"
      @closed="currentEditor.visible = false"
  >
    <div v-if="currentEditor.visible" class="editor">
      <SensorInfoForm v-model="currentEditor.data"/>
    </div>
  </Widget>
</template>

<style lang="scss" scoped>
.op-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em;
}
.op {
  cursor: pointer;
  transition: all 0.3s ease-out;
  &:hover {
    transform: rotate(360deg);
  }
}
.editor {
  height: 100%;
  overflow: hidden;
}
</style>






