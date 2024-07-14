<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {MapScene} from "../../ts/renderers/map/MapScene.ts";
const modelCanvas = ref<HTMLCanvasElement>();
let scene: MapScene;
onMounted(() => {
  scene = new MapScene(modelCanvas.value!);
});
onBeforeUnmount(() => {
  scene?.[Symbol.dispose]();
});
</script>

<template>
  <canvas ref="modelCanvas" class="full-screen-canvas"/>
</template>

<style scoped>
@import url("../../common.css");
.full-screen-canvas {
  cursor: grab;
}
.full-screen-canvas:active {
  cursor: grabbing;
}
</style>