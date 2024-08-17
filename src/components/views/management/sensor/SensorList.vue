<script lang="ts" setup>
import { ElTable, ElTableColumn, ElTooltip, ElIcon, ElTag, ElContainer } from 'element-plus';
import { Setting, View } from '@element-plus/icons-vue';
import {reactive} from "vue";
import SensorInfoForm from "./SensorInfoForm.vue";
import Widget from "../../../widgets/layout/Widget.vue";

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
</script>

<template>
  <ElTable :data="tableData" stripe height="100%" style="width: 100%">
    <ElTableColumn fixed="left" sortable prop="id" label="编号" width="120" align="center" />
    <ElTableColumn sortable prop="status" label="当前状态" width="120" align="center">
      <template #default="scope">
        <ElTag>{{scope.row.status ?? '未知'}}</ElTag>
      </template>
    </ElTableColumn>
    <ElTableColumn sortable prop="type" label="类型" width="120" align="center" />
    <ElTableColumn show-overflow-tooltip sortable prop="description" label="描述" width="120" align="center" />
    <ElTableColumn sortable prop="installationDate" label="安装日期" width="120" align="center" />
    <ElTableColumn sortable prop="lastMaintenanceDate" label="维护日期" width="120" align="center" />
    <ElTableColumn show-overflow-tooltip sortable prop="location" label="地理位置" width="300" align="center" />
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
              <View />
            </ElIcon>
          </ElTooltip>
        </ElContainer>
      </template>
    </ElTableColumn>
  </ElTable>
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






