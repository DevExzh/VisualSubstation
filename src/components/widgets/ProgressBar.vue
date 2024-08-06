<template>
  <div class="progress-bar">
    <div class="progress-bar-inner">
      <div class="progress-bar-bg" :style="{ width: `${percent}%`, background: gradient, height: `${strokeWidth}px` }"></div>
      <span v-if="showInfo" class="progress-bar-text">{{ format ? format(percent) : `${percent}%` }}</span>
    </div>
    <div class="progress-bar-title">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from 'vue';

const props = withDefaults(defineProps<{
  width?: string | number;
  percent?: number;
  strokeWidth?: number;
  strokeColor?: string;
  showInfo?: boolean;
  format?: (percent: number) => string;
  title?: string;
}>(), {
  width: 200,
  percent: 80
});

//const width = computed(() => typeof props.width === 'number' ? `${props.width}px` : props.width || '100%');
const percent = ref(props.percent || 0);
const strokeWidth = props.strokeWidth || 20;
const strokeColor = props.strokeColor || 'blue';
const showInfo = computed((): boolean => props.showInfo);

const gradient = computed(() => {
  switch (strokeColor) {
    case 'blue':
      return 'linear-gradient(to right, #4facfe, #00f2fe)';
    case 'orange':
      return 'linear-gradient(to right, #f093fb, #f5576c)';
    case 'green':
      return 'linear-gradient(to right, #43e97b, #38f9d7)';
    default:
      return 'linear-gradient(to right, #4facfe, #00f2fe)';
  }
});
</script>

<style lang="scss" scoped>
.progress-bar {
  display: inline-block;
  position: relative;
  text-align: center;
  margin-top: -0.4em;
  padding-left: 5px;
  padding-right: 5px;
  width: 180px;
  .progress-bar-inner {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    background: linear-gradient(145deg, #0f3460, #162447);
    box-shadow: 0 0 1rem rgba(0, 242, 254, 0.3);
    border: 1px solid #5EBCF5;
    margin: 20px;
    width: 150px;

    .progress-bar-bg {
      height: 100%;
      transition: width 0.3s;
    }

    .progress-bar-text {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
      color: white;
    }
  }

  .progress-bar-title {
    text-align: center;
    font-size: smaller;
    color: white;
    margin-top: -1em;
    padding-left: 10px;
  }
}
</style>
