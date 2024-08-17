<script setup lang="ts">
import {ElFormItem, ElInput, ElInputNumber, ElOption, ElSelect} from "element-plus";
import SyntaxTooltip from "./SyntaxTooltip.vue";
import {reactive, ref} from "vue";
enum ConditionType {
  Equal, NotEqual, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual, Range, Custom
}
const currentType = ref<ConditionType>(ConditionType.Equal);
const rule = reactive<{
  value?: number, minValue?: number, maxValue?: number, customExpression?: string
}>({value: 0, minValue: 0, maxValue: 0, customExpression: ''});
const binding = defineModel<string>({required: true});
const onUpdate = () => {
  switch (currentType.value) {
    case ConditionType.Equal: {
      binding.value = `#value == ${rule.value!}`;
      break;
    }
    case ConditionType.NotEqual: {
      binding.value = `#value != ${rule.value!}`;
      break;
    }
    case ConditionType.GreaterThan: {
      binding.value = `#value > ${rule.value!}`;
      break;
    }
    case ConditionType.GreaterThanOrEqual: {
      binding.value = `#value >= ${rule.value!}`;
      break;
    }
    case ConditionType.LessThan: {
      binding.value = `#value < ${rule.value!}`;
      break;
    }
    case ConditionType.LessThanOrEqual: {
      binding.value = `#value <= ${rule.value!}`;
      break;
    }
    case ConditionType.Range: {
      binding.value = `#value >= ${rule.minValue ?? -Infinity} && #value <= ${rule.maxValue ?? Infinity}`;
      break;
    }
    case ConditionType.Custom: {
      binding.value = rule.customExpression!;
      break;
    }
  }
};
withDefaults(
    defineProps<{
      multiline?: boolean,
      disabled?: boolean,
    }>(), {
      disabled: false,
    }
);
</script>

<template>
  <ElFormItem label="条件" required>
    <ElSelect
        default-first-option :disabled="$props.disabled"
        style="min-width: 8em;" v-model="currentType" placeholder="请选择条件类别"
    >
      <template #prefix>
        <svg style="width: 1em; height: 1em;" viewBox="0 0 1024 1024">
          <path v-if="currentType == ConditionType.Equal"
                d="M896 608H128c-35.34 0-64 28.66-64 64v64c0 35.34 28.66 64 64 64h768c35.34 0 64-28.66 64-64v-64c0-35.34-28.66-64-64-64m0-384H128c-35.34 0-64 28.66-64 64v64c0 35.34 28.66 64 64 64h768c35.34 0 64-28.66 64-64v-64c0-35.34-28.66-64-64-64"
          />
          <path v-else-if="currentType == ConditionType.NotEqual"
                d="M895.996 416c35.34 0 64-28.66 64-64v-63.999c0-35.34-28.66-64-64-64h-47.76l103.74-133.62c10.74-14.04 8.08-34.119-5.94-44.859l-50.82-38.92c-14.04-10.76-34.12-8.08-44.88 5.94l-164.159 211.46H128c-35.34 0-64 28.66-64 63.999v64c0 35.34 28.66 64 64 64h409.118L388.058 608H128c-35.34 0-64 28.66-64 64v63.999c0 35.34 28.66 64 64 64h110.98l-103.74 133.62c-10.74 14.02-8.08 34.099 5.94 44.859l50.82 38.92c14.04 10.76 34.12 8.08 44.86-5.94l164.179-211.46h494.957c35.34 0 64-28.66 64-63.999v-64c0-35.34-28.66-64-64-64H550.098L699.158 416z"
          />
          <path v-else-if="currentType == ConditionType.GreaterThan"
                d="m859.034 419.7-612.6-285.68c-32.12-14.98-70.3-1.08-85.28 31.04l-27.14 58.16c-14.98 32.12-1.08 70.3 31.04 85.28l436.86 203.7-436.94 203.78c-32.04 14.94-45.9 53.02-30.96 85.06l27.04 58c14.94 32.04 53.02 45.9 85.06 30.96l612.94-285.82a64.01 64.01 0 0 0 36.96-58v-68.46c-.02-24.9-14.42-47.52-36.98-58.02"
          />
          <path v-else-if="currentType == ConditionType.GreaterThanOrEqual"
                d="m174.44 215.38 351.12 136.18-350.88 136.1c-36.78 12.06-55.76 48.78-42.4 82l24.18 60.16c13.36 33.22 53.98 50.38 90.76 38.3L850.04 428.4c27.54-9.04 45.96-33.22 45.96-60.34v-31.92c0-27.12-18.42-51.3-45.96-60.34L246.6 35.84c-36.58-12-77.02 5.06-90.3 38.12l-24.06 59.84c-13.28 33.06 5.62 69.58 42.2 81.58M912 800H112c-26.5 0-48 21.48-48 48v96c0 26.5 21.5 48 48 48h800c26.5 0 48-21.5 48-48v-96c0-26.52-21.5-48-48-48"
          />
          <path v-else-if="currentType == ConditionType.LessThan"
                d="m858.916 715.48-436.84-203.7 436.94-203.76c32.04-14.94 45.9-53.02 30.96-85.06l-27.04-58c-14.94-32.04-53.02-45.9-85.06-30.96l-612.92 285.82a64.03 64.03 0 0 0-36.96 58v68.48c0 24.88 14.42 47.5 36.96 58l612.62 285.66c32.12 14.98 70.3 1.08 85.28-31.04l27.12-58.16c14.98-32.12 1.08-70.3-31.06-85.28"
          />
          <path v-else-if="currentType == ConditionType.LessThanOrEqual"
                d="m173.96 428.4 602.82 239.74c36.78 12.06 77.42-5.08 90.76-38.3l24.18-60.16c13.36-33.22-5.64-69.94-42.42-82l-350.88-136.1L849.54 215.4c36.58-12 55.48-48.54 42.2-81.58l-24.06-59.84c-13.28-33.06-53.72-50.12-90.3-38.12L173.96 275.78C146.42 284.82 128 309 128 336.14v31.92c0 27.12 18.42 51.3 45.96 60.34M912 800H112c-26.5 0-48 21.48-48 48v96c0 26.5 21.5 48 48 48h800c26.5 0 48-21.5 48-48v-96c0-26.52-21.5-48-48-48"
          />
          <path v-else-if="currentType == ConditionType.Range"
                d="M170.667 128H384v85.333H256v597.334h128V896H170.667zM640 810.667V896h213.333V128H640v85.333h128v597.334z"
          />
          <path v-else
                d="M218.926 488.09 488.08 218.976l-88.239-88.239-123.357 123.358a15.84 15.84 0 0 1-22.42 0l-22.42-22.42c-6.2-6.2-6.2-16.24 0-22.42l123.36-123.356L287.725 18.6c-24.78-24.78-64.94-24.78-89.719 0L18.59 198.016c-24.76 24.78-24.78 64.939 0 89.718zM995.85 254.495c37.519-37.52 37.499-98.338 0-135.857l-90.499-90.499c-37.519-37.519-98.358-37.519-135.897 0l-92.038 92.019 226.395 226.395zm-363.693-89.058L38.169 759.345.65 974.221c-5.06 28.98 20.18 54.219 49.18 49.119l214.895-37.68 593.828-593.848zm373.252 570.849-67.278-67.28-123.358 123.359c-6.2 6.2-16.24 6.2-22.42 0l-22.419-22.42c-6.18-6.2-6.18-16.24 0-22.42l123.358-123.357-88.279-88.278L535.86 805.004 736.276 1005.4c24.78 24.78 64.938 24.78 89.718 0l179.416-179.396c24.78-24.78 24.78-64.939 0-89.718"
          />
        </svg>
      </template>
      <ElOption label="等于" :value="ConditionType.Equal"/>
      <ElOption label="不等于" :value="ConditionType.NotEqual"/>
      <ElOption label="大于" :value="ConditionType.GreaterThan"/>
      <ElOption label="大于或等于" :value="ConditionType.GreaterThanOrEqual"/>
      <ElOption label="小于" :value="ConditionType.LessThan"/>
      <ElOption label="小于或等于" :value="ConditionType.LessThanOrEqual"/>
      <ElOption label="区间" :value="ConditionType.Range"/>
      <ElOption label="自定义" :value="ConditionType.Custom"/>
    </ElSelect>
  </ElFormItem>
  <ElFormItem required v-if="currentType < ConditionType.Range" label="值">
    <ElInputNumber :disabled="$props.disabled" v-model="rule.value" @input="onUpdate"/>
  </ElFormItem>
  <ElFormItem required v-else-if="currentType == ConditionType.Range" label="区间">
    <ElInputNumber :disabled="$props.disabled" v-model="rule.minValue" placeholder="最小值" @input="onUpdate"/>
    <span style="padding: 0 5px;">至</span>
    <ElInputNumber :disabled="$props.disabled" v-model="rule.maxValue" placeholder="最大值" @input="onUpdate"/>
  </ElFormItem>
  <ElFormItem required v-else>
    <template #label>
      <span :style="{marginRight: $props.multiline ? '0.25em' : '0'}">表达式</span>
      <span v-if="$props.multiline" style="height: 100%; display: flex; align-items: center;"><SyntaxTooltip /></span>
    </template>
    <ElInput
        v-model="rule.customExpression"
        @input="onUpdate" :disabled="$props.disabled"
        placeholder="请输入自定义表达式"
        :type="$props.multiline ? 'textarea' : 'text'"
        :autosize="!!$props.multiline"
        show-word-limit maxlength="1024"
    >
      <template #suffix>
        <SyntaxTooltip/>
      </template>
    </ElInput>
  </ElFormItem>
</template>