<script setup lang="ts">
import {DismantledModelScene} from "../../ts/renderers/dismantle/DismantledModelScene.ts";
import {onBeforeUnmount, onMounted, ref} from "vue";
const canvas = ref<HTMLCanvasElement>();
let scene: DismantledModelScene;
const props = defineProps<{
  manifestPath: string,
  dismantleAction: {
    modelName: string;
    distance: number;
    component: 'x' | 'y' | 'z'
  }[]
}>();
const dismantle = () => {
  props.dismantleAction.forEach(value => {
    scene.call(
        "moveModelByDistance", false, false,
        value.modelName, value.distance, value.component
    );
  });
};
const reset = () => {
  scene.call("resetModelPosition");
};
const loading = ref<boolean>(true);
onMounted(() => {
  scene = new DismantledModelScene(canvas.value!);
  scene.addEventListener('load', _ => {
    loading.value = false;
  });
  scene.call("loadAll", true, false, props.manifestPath);
});
onBeforeUnmount(() => {
  scene?.[Symbol.dispose]();
});
</script>

<template>
  <div class="container" v-loading="loading">
    <div class="button-container">
      <ElButton class="button dismantle" type="primary" plain @click="dismantle">拆解</ElButton>
      <ElButton class="button reset" type="primary" plain @click="reset">还原</ElButton>
    </div>
    <canvas class="render-container" ref="canvas"/>
  </div>
</template>

<style scoped>
.button-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  width: 5.5rem;
}
.button {
  width: 5rem;
  margin: 0.25rem;
}
.container, .render-container {
  width: 100%;
  height: 100%;
}
</style>