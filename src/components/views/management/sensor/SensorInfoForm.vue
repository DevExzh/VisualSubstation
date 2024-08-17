<script setup lang="ts">
import {
  ElButton, ElCol, ElRow, ElCheckbox,
  ElCollapse, ElCollapseItem,
  ElCheckboxButton, ElDatePicker,
  ElForm, ElButtonGroup,
  ElFormItem, ElIcon,
  ElInput, ElInputNumber, ElOption,
  ElSelect, ElScrollbar,
  ElTooltip
} from "element-plus";
import {onBeforeMount, reactive, ref, watch} from "vue";
import {
  Bell, Operation, RemoveFilled,
  CirclePlusFilled, Close, Filter,
  LocationFilled, Coordinate,
  CircleCheck, Check
} from "@element-plus/icons-vue";
import ConditionForm from "./ConditionForm.vue";
import SyntaxTooltip from "./SyntaxTooltip.vue";
import {keySceneOperations, ModelSceneOperations} from "../../../canvas/ModelSceneCanvas.ts";
import useCommonStore from "../../../../ts/store/CommonStore.ts";
const binding = defineModel<Record<string, any>>({required: true});
const sensor = reactive<Record<string, any>>({
  installationDate: new Date(),
  manufacturer: '',
  description: '',
  type: undefined,
  unit: '',
  location: {
    longitude: 0,
    latitude: 0,
  },
  rule: {
    validation: {
      expression: '',
      policy: 'discard',
      operation: 'none',
      interpolation: '',
    },
    notification: [],
  },
});
const coordinateInputType = ref<boolean>(false);
const isToday = ref<boolean>(true);
const isSensorPlaced = ref<boolean>(false);
const isValidationEnabled = ref<boolean>(false);
const isNotificationEnabled = ref<boolean>(false);
const showAddButtonText = ref<boolean>(false);
const hoveredIndex = ref<number | null>(null);
const placeSensorButtonClicked = () => {
  if(!coordinateInputType.value) {
    isSensorPlaced.value = !isSensorPlaced.value;
  }
  coordinateInputType.value = false;
};
watch(isToday, value => {
  if(value) {
    sensor.installationDate = new Date();
  }
});
onBeforeMount(() => {
  // 合并字段值
  Object.assign(sensor, binding.value);
  watch(binding, value => {
    Object.assign(sensor, value);
  });
  const operations = useCommonStore().get(keySceneOperations) as ModelSceneOperations;
  let uuid: string | undefined;
  watch(isSensorPlaced, value => {
    if(value) {
      operations?.addObjectFunction('/arduino.glb').then(value => uuid = value);
    } else if(uuid) {
      operations?.removeObjectFunction(uuid);
    }
  });
});
</script>

<template>
  <ElScrollbar max-height="80vh">
    <ElCollapse class="container">
      <ElCollapseItem name="basic">
        <template #title>
          <ElIcon><Operation/></ElIcon>&ensp;传感器基本信息
        </template>
        <ElForm :model="sensor" label-width="auto">
          <ElRow>
            <ElCol :span="12">
              <ElFormItem
                  label="安装日期" style="display: flex;"
                  :rules="{required: true}"
              >
                <ElDatePicker
                    v-model="sensor.installationDate"
                    type="date" style="flex: 1;" :disabled="isToday"
                    placeholder="请选择日期"
                />
                <ElCheckboxButton
                    style="flex-shrink: 0;" v-model="isToday"
                >今日</ElCheckboxButton>
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem
                  label="生产厂家" :rules="{required: true}"
              >
                <ElInput v-model="sensor.manufacturer" placeholder="请输入生产厂家"/>
              </ElFormItem>
            </ElCol>
          </ElRow>
          <ElRow>
            <ElCol :span="12">
              <ElFormItem
                  label="传感器类型" :rules="{required: true}"
              >
                <ElSelect v-model="sensor.type" placeholder="请选择" default-first-option>
                  <ElOption label="电压" value="voltage"/>
                  <ElOption label="电流" value="current"/>
                  <ElOption label="温度" value="temperature"/>
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="数值单位">
                <ElTooltip :show-after="500" :auto-close="3000">
                  <template #content>
                    描述传感器数值的单位，如 ℃、mV 等。<br>
                    如果不需要单位，请将该字段留空。
                  </template>
                  <ElInput v-model="sensor.unit" placeholder="请输入单位"/>
                </ElTooltip>
              </ElFormItem>
            </ElCol>
          </ElRow>
          <ElFormItem
              label="位置" :rules="{required: true}"
          >
            <ElTooltip :show-after="500" content="在仿真场景中放置传感器" :disabled="!coordinateInputType">
              <ElButton
                  style="transition: all 0.3s ease-out;"
                  :type="coordinateInputType ? undefined : 'primary'" :plain="!coordinateInputType"
                  @click="placeSensorButtonClicked"
              >
                <ElIcon><LocationFilled/></ElIcon>
                <span :style="{
                  marginLeft: coordinateInputType ? '0' : '0.5em'
                }">{{coordinateInputType ? '' : '在场景中选取位置'}}</span>
              </ElButton>
            </ElTooltip>
            <Transition name="fade" mode="out-in">
              <ElButtonGroup v-if="!coordinateInputType && isSensorPlaced" style="margin: 0 0.5em 0 0.5em;">
                <ElButton :icon="Check" type="success" @click="isSensorPlaced = false"/>
                <ElButton :icon="Close" type="danger" @click="isSensorPlaced = false"/>
              </ElButtonGroup>
            </Transition>
            <div
                style="display: flex;"
                v-if="coordinateInputType"
            >
              <ElFormItem style="margin-bottom: 0;" label="经度">
                <ElTooltip
                    :disabled="!coordinateInputType"
                    :show-after="500" :auto-close="3000"
                >
                  <template #content>
                    <ul style="margin-left: -1.5em;">
                      <li>数值取值范围：[-180, 180]</li>
                      <li>正数表示东半球，负数表示西半球</li>
                    </ul>
                  </template>
                  <ElInputNumber :max="180" :min="-180" v-model="sensor.location.longitude" placeholder="请输入"/>
                </ElTooltip>
              </ElFormItem>
              <ElFormItem style="margin-bottom: 0;" label="纬度">
                <ElTooltip
                    :disabled="!coordinateInputType"
                    :show-after="500" :auto-close="3000"
                >
                  <template #content>
                    <ul style="margin-left: -1.5em;">
                      <li>数值取值范围：[-90, 90]</li>
                      <li>正数表示北半球，负数表示南半球</li>
                    </ul>
                  </template>
                  <ElInputNumber :max="90" :min="-90" v-model="sensor.location.latitude" placeholder="请输入"/>
                </ElTooltip>
              </ElFormItem>
            </div>
            <ElTooltip
                v-else
                :disabled="coordinateInputType" content="使用经纬度坐标以描述位置"
                :show-after="500" :auto-close="1500"
            >
              <ElButton
                  @click="coordinateInputType = true"
                  :icon="Coordinate"
              />
            </ElTooltip>
          </ElFormItem>
          <ElTooltip :show-after="500" :auto-close="1500" content="对传感器的信息做额外描述说明">
            <ElFormItem label="描述">
              <ElInput autosize show-word-limit maxlength="1024" type="textarea" v-model="sensor.description"/>
            </ElFormItem>
          </ElTooltip>
        </ElForm>
      </ElCollapseItem>
      <ElCollapseItem name="validation">
        <template #title>
          <ElIcon><CircleCheck/></ElIcon>
          &ensp;数据验证规则&ensp;
          <ElTooltip
              :show-after="500" :auto-close="3000"
              :content="isValidationEnabled ? '单击以禁用规则' : '单击以启用规则'"
          >
            <ElCheckbox @click.stop size="large" v-model="isValidationEnabled"/>
          </ElTooltip>
        </template>
        <ElForm :model="sensor.rule" label-width="auto">
          <ConditionForm :disabled="!isValidationEnabled" v-model="sensor.rule.validation.expression" multiline/>
          <div class="subsection" style="margin: 1em;">
            <ElIcon><Filter /></ElIcon>&ensp;<b>当条件不满足时</b>，对数据执行策略
          </div>
          <ElFormItem required label="数据处理策略">
            <ElRow style="width: 100%;">
              <ElCol :span="sensor.rule.validation.operation == 'expression' ? 4 : 11">
                <ElSelect :disabled="!isValidationEnabled" v-model="sensor.rule.validation.policy" default-first-option placeholder="请选择">
                  <ElOption label="仅丢弃" value="discard"/>
                  <ElOption label="丢弃并插值" value="interpolate"/>
                  <ElOption label="忽略" value="ignore"/>
                </ElSelect>
              </ElCol>
              <ElCol v-if="sensor.rule.validation.operation != 'expression'" :span="2"/>
              <Transition name="fade" mode="out-in">
                <ElCol
                    :key="sensor.rule.validation"
                    :span="sensor.rule.validation.operation == 'expression' ? 10 : 11">
                  <ElFormItem
                      v-if="sensor.rule.validation.policy == 'discard'"
                      label="丢弃后执行的操作" required
                  >
                    <ElSelect
                        :disabled="!isValidationEnabled"
                        default-first-option v-model="sensor.rule.validation.operation"
                    >
                      <ElOption label="不执行任何操作" value="none"/>
                      <ElOption label="发送通知" value="notify"/>
                      <ElOption label="写入日志" value="log"/>
                    </ElSelect>
                  </ElFormItem>
                  <ElFormItem
                      v-else-if="sensor.rule.validation.policy == 'interpolate'"
                      label="插值策略" required
                  >
                    <ElSelect
                        :disabled="!isValidationEnabled"
                        default-first-option v-model="sensor.rule.validation.operation"
                    >
                      <ElOption label="简单线性" value="linear"/>
                      <ElOption label="回归拟合" value="regression"/>
                      <ElOption label="自定义表达式" value="expression"/>
                    </ElSelect>
                  </ElFormItem>
                </ElCol>
              </Transition>
              <Transition name="fade" mode="out-in">
                <ElCol
                    :span="10"
                    v-if="sensor.rule.validation.policy == 'interpolate'
                       && sensor.rule.validation.operation == 'expression'"
                >
                  <ElFormItem required>
                    <template #label>
                      <span style="height: 100%; display: flex; align-items: center;">
                        插值表达式&ensp;<SyntaxTooltip />
                      </span>
                    </template>
                    <ElInput
                        :disabled="!isValidationEnabled"
                        type="textarea" show-word-limit maxlength="1024"
                        v-model="sensor.rule.validation.interpolation"
                    />
                  </ElFormItem>
                </ElCol>
              </Transition>
            </ElRow>
          </ElFormItem>
        </ElForm>
      </ElCollapseItem>
      <ElCollapseItem name="rule">
        <template #title>
          <ElIcon><Bell/></ElIcon>
          &ensp;通知规则&ensp;
          <ElTooltip
              :show-after="500" :auto-close="3000"
              :content="isNotificationEnabled ? '单击以禁用规则' : '单击以启用规则'"
          >
            <ElCheckbox @click.stop size="large" v-model="isNotificationEnabled"/>
          </ElTooltip>
        </template>
        <ElForm :model="sensor.rule">
          <div
              v-for="(rule, index) in sensor.rule.notification"
              :key="index" class="row-wrapper"
              @mouseover="hoveredIndex = index"
              @mouseout="hoveredIndex = null"
          >
            <div class="rule-row">
              <ElFormItem label="级别">
                <ElSelect :disabled="!isNotificationEnabled"
                    filterable allow-create default-first-option
                    class="selector" v-model="rule.warning" placeholder="请选择">
                  <ElOption label="红色" value="red"/>
                  <ElOption label="橙色" value="orange"/>
                  <ElOption label="黄色" value="yellow"/>
                </ElSelect>
              </ElFormItem>
              <ConditionForm :disabled="!isNotificationEnabled" v-model="rule.expression" />
            </div>
            <Transition name="fade" mode="out-in" v-if="isNotificationEnabled">
              <div v-show="index == hoveredIndex">
                <ElTooltip :show-after="500" :auto-close="1500" content="移除该规则">
                  <ElIcon class="remove-button" @click="sensor.rule.notification.splice(index, 1)" size="1.5em">
                    <RemoveFilled/>
                  </ElIcon>
                </ElTooltip>
              </div>
            </Transition>
          </div>
          <div
              v-if="isNotificationEnabled"
              style="display: flex; align-items: center; justify-content: center; cursor: pointer; height: 2em;"
              @mouseout="showAddButtonText = false" @mouseover="showAddButtonText = true"
              @click="sensor.rule.notification.push({warning: '', expression: ''})"
          >
            <Transition name="button" mode="out-in">
              <ElIcon
                  class="add-button" size="1.5em"
                  :style="{
                    marginRight: showAddButtonText ? '0.25em' : '0',
                  }"
                  :key="+showAddButtonText"
              >
                <CirclePlusFilled/>
              </ElIcon>
            </Transition>
            <Transition name="button-text" mode="out-in">
              <span
                  style="text-align: center; text-wrap: nowrap; font-weight: bold;"
                  v-show="showAddButtonText"
              >添加规则</span>
            </Transition>
          </div>
        </ElForm>
      </ElCollapseItem>
    </ElCollapse>
  </ElScrollbar>
</template>

<style lang="scss" scoped>
:deep(.el-form-item) {
  margin-bottom: 1em;
}
:deep(.el-collapse-item__header), :deep(.el-collapse-item__wrap) {
  background: transparent;
}
.container {
  height: 100%;
  border-bottom: none;
  padding: 0 1em 0 1em;
}
.selector {
  min-width: 8em;
}
.row-wrapper {
  margin-bottom: 1em;
  position: relative;
}
.rule-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
}
.add-button {
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  height: 100%;
}
.remove-button {
  cursor: pointer;
  position: absolute;
  top: 0.25em;
  right: 1em;
  z-index: 1;
}
.subsection {
  > * {
    vertical-align: middle;
  }
  &::before, &::after {
    content: '';
    height: 1pt;
    width: 15%;
    display: inline-block;
    vertical-align: middle;
    margin: 0 1em 0 1em;
  }
  &::before {
    background: linear-gradient(to left, rgba(50%, 50%, 50%, 0.5), transparent);
  }
  &::after {
    background: linear-gradient(to right, rgba(50%, 50%, 50%, 0.5), transparent);
  }
}
.button-text-enter-active, .button-text-leave-active {
  transition: all 0.3s ease-in;
}
.button-text-enter-from, .button-text-leave-to {
  width: 0;
  opacity: 0;
}
.button-text-enter-to, .button-text-leave-from {
  width: 6em;
  opacity: 1;
}
.button-enter-active, .button-leave-active {
  transition: all 0.3s ease-in;
}
.button-enter-from, .button-leave-to {
  transform: none;
  margin-right: 0;
}
.button-enter-to, .button-leave-from {
  transform: rotate(-180deg);
  margin-right: .25em;
}
</style>