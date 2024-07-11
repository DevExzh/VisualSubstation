<script setup lang="ts">
const props = defineProps<{
  name: string,
}>();
</script>

<template>
  <div>
    <div class="label-container">
      <span class="label-property">设备名称：</span>
      <span class="label-value">{{props.name}}}</span>
    </div>
  </div>
</template>

<style scoped>
.label-container {
  width: 5em;
  height: 3em;
}
.label-property {
  font-weight: bold;
}
</style>