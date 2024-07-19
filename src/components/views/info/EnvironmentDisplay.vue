<script setup lang="ts">
import ProgressBar from "../../widgets/ProgressBar.vue";

const titles = ['温度', '风速', '湿度'];
const formatter = [
  (p: number) => p + '℃',
  (p: number) => p + 'm/s',
  (p: number) => p + '% RH',
];
const colors = ['blue', 'orange', 'green'];
const data = [
    +(Math.random() * 40).toFixed(1),
  +(Math.random() * 10).toFixed(1),
  +(Math.random() * 40).toFixed(1)
];
withDefaults(defineProps<{
  width?: number;
}>(), {
  width: 300
});
</script>

<template>
  <div class="progress-container">
    <ProgressBar
        v-for="i in 3"
        :key="i"
        :showInfo="true"
        :percent="data[i]"
        type="line"
        :title="titles[i - 1]"
        :format="formatter[i - 1]"
        :width="300"
        :strokeColor="colors[i - 1]"
    />
  </div>
</template>

<style scoped>

</style>