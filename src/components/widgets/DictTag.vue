<script setup lang="ts">
// 记录未匹配的项
import {computed, ref} from "vue";
import {DictValue} from "../../ts/store/DictStore.ts";
const mismatchArray = ref<string[]>([]);
const props = defineProps({
  // 数据
  options: {
    type: Array<DictValue>,
    default: null,
  },
  // 当前的值
  value: [Number, String, Array],
  // 当未找到匹配的数据时，显示value
  showValue: {
    type: Boolean,
    default: true,
  },
  separator: {
    type: String,
    default: ",",
  }
});

const values = computed(() => {
  if (!props.value) return [];
  return Array.isArray(props.value) ? props.value.map(item => '' + item) : String(props.value).split(props.separator);
});

const mismatch = computed(() => {
  mismatchArray.value = [];
  if (!props.value || props.options.length === 0) return false;
  let mismatch = false;
  values.value.forEach(item => {
    if (!props.options.some(v => v.value === item)) {
      mismatchArray.value.push(item);
      mismatch = true;
    }
  })
  return mismatch;
});

const handleArray = (array: any[]) => {
  if (array.length === 0) return "";
  return array.reduce((pre, cur) => {
    return pre + " " + cur;
  });
}
</script>

<template>
  <div>
    <template v-for="(item, index) in options">
      <template v-if="values.includes(item.value)">
        <span
            v-if="(item.elTagType === 'default' || !item.elTagType) && !item.elTagClass"
            :key="item.value"
            :class="item.elTagClass"
        >{{ item.label + " " }}</span>
        <ElTag
            v-else
            :disable-transitions="true"
            :key="item.value"
            :index="index"
            :type="item.elTagType ?? 'info'"
            :class="item.elTagClass"
        >{{ item.label + " " }}</ElTag>
      </template>
    </template>
    <template v-if="mismatch && showValue">
      {{// @ts-ignore
        mismatchArray | handleArray
      }}
    </template>
  </div>
</template>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
