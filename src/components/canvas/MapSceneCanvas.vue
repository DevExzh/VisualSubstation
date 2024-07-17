<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {MapScene} from "../../ts/renderers/map/MapScene.ts";
import {FeatureProperties} from "../../ts/map/GeoJson.ts";
import {RegionClickEvent} from "../../ts/events/MapEvents.ts";
const modelCanvas = ref<HTMLCanvasElement>();
let scene: MapScene;
const emits = defineEmits<{
  regionClicked: [region: FeatureProperties]
}>();
onMounted(() => {
  scene = new MapScene(modelCanvas.value!);
  scene.addEventListener('region-click', evt => {
    emits('regionClicked', (evt as RegionClickEvent).region);
  });
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