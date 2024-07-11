<script setup lang="ts">
import {CloudType, WeatherType} from "../../ts/sky/Weather.ts";
import {onMounted, onUnmounted, ref} from "vue";
import {SkyScene} from "../../ts/renderers/sky/SkyScene.ts";
withDefaults(
    defineProps<{
      // 云层类型
      cloudType?: CloudType,
      // 天气类型
      weatherType?: WeatherType,
      enableFog?: boolean
    }>(), {
      cloudType: () => CloudType.Scattered,
      weatherType: () => WeatherType.Clear,
      enableFog: () => true,
    }
);
const skyCanvas = ref<HTMLCanvasElement>();
let scene: SkyScene;
onMounted(() => {
  scene = new SkyScene(skyCanvas.value as unknown as HTMLCanvasElement);
});
onUnmounted(() => {
  scene?.[Symbol.dispose]();
});
</script>

<template>
  <!-- 用以渲染天空的画布 -->
  <canvas ref="skyCanvas" class="full-screen-canvas"/>
</template>

<style scoped>
@import url("../../common.css");
.full-screen-canvas {
  z-index: 1;
}
</style>