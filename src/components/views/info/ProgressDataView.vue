<script setup lang="ts">

import {computed} from "vue";

const currentValue = defineModel<number>('value');
const props = withDefaults(
    defineProps<{
      name: string,
      min?: number,
      max?: number,
    }>(), {
      min: 0,
      max: 1000,
    }
);
const progress = computed(() => (currentValue.value! / (props.max - props.min) * 100).toString() + '%');
</script>

<template>
  <div>
    <div class="data-label">
      <div class="label-name">{{props.name}}</div>
      <div class="label-value">{{currentValue}}</div>
    </div>
    <div style="width: 100%; height: .5rem; margin-bottom: .8rem;">
      <div class="progress-bar"/>
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'Digital';
  src: url('/fonts/DS-Digital-BoldItalic.woff2') format('woff2'),
  url('/fonts/DS-Digital-BoldItalic.woff') format('woff'),
  url('/fonts/DS-Digital-BoldItalic.ttf') format('truetype');
  font-weight: bold;
  font-style: italic;
}
.label-name {
  position: absolute;
  bottom: 0;
  left: 0;
  color: #eee;
}
.data-label {
  width: 100%;
  position: relative;
  height: 1.5em;
}
.label-value {
  position: absolute;
  bottom: 0;
  right: 0;
  font-family: 'Digital', monospace;
  font-size: 1.5rem;
  color: #b2ebf2;
}
.progress-bar {
  width: v-bind(progress);
  height: .5rem;
  border-radius: .25rem;
  background: linear-gradient(to left, rgba(0, 255, 255, 0.4) 0%, rgba(1, 109, 255, 0.2) 60%, rgba(1, 109, 255, 0) 100%);
  margin-top: 0.2rem;
}
</style>