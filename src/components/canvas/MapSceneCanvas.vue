<script setup lang="ts">
import {onBeforeUnmount, ref, h, onMounted} from "vue";
import {MapScene} from "../../ts/renderers/map/MapScene.ts";
import {FeatureProperties} from "../../ts/map/GeoJson.ts";
import {RegionClickEvent} from "../../ts/events/MapEvents.ts";
import {OverlayRenderer} from "../../ts/renderers/overlay/OverlayRenderer.ts";
import Marker from "../widgets/decoration/Marker.vue";
import {Projector} from "../../ts/map/workers/Projector.ts";
import {useRouter} from "vue-router";
const modelCanvas = ref<HTMLCanvasElement>();
let scene: MapScene;
const emits = defineEmits<{
  regionClicked: [region: FeatureProperties | undefined, isCancelled: boolean]
}>();
// 悬浮的 HTML 元素挂载点
const htmlMountPoint = ref<HTMLDivElement>();
let overlay: OverlayRenderer;
onMounted(() => {
  scene = new MapScene(modelCanvas.value!);
  overlay = new OverlayRenderer(htmlMountPoint.value!, scene);
  let regionHeight: number = 3;
  scene.call('getRegionHeight', false, true).then(v => regionHeight = v);
  const projector = new Projector();
  projector.center([103.38, 35.55]).translate([0, 0]);
  const router = useRouter();
  scene.addEventListener('region-click', evt => {
    const event = evt as RegionClickEvent;
    emits('regionClicked', event.region, event.isCancelled);
    overlay.clearAll();
    if(!event.isCancelled) {
      const center = event.region!.center;
      projector.project(center).then(projected => {
        overlay.addComponentToPosition(
            [projected[0], regionHeight, projected[1]],
            Marker, {
              height: 32,
              type: '3d-circle',
              style: {
                cursor: 'pointer',
              },
              onClick: () => {
                router.push({
                  name: 'substation-scene',
                  query: {
                    // 传经纬度作为参数
                    location: center[0] + ',' + center[1]
                  }
                });
              },
              onMouseenter: () => {
                console.log('enter');
              },
              onMouseleave: () => {
                console.log('leave');
              },
            }, () => [
              h('svg', {
                viewBox: '0 0 1024 1024',
                style: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
              }, [
                h('path', {
                  fill: 'white',
                  d: 'M59.284 911.63h67.8l75.884-434.608H103.8v52.817H72.973v-83.806l133.282-107.25v-63.489h-102.4v52.817H72.973v-83.698l133.282-107.359v-22.366c0-27.81 23.66-46.511 50.122-46.727l118.407-.108c26.516 0 50.607 19.08 50.607 46.835v22.636l133.39 107.358v83.483h-30.99v-52.817h-102.4v63.65l133.39 107.25v53.895h-30.99v-23.175h-99.166l4.096 23.175h-82.513l23.175-23.175H258.21l57.56 57.29 17.892-17.677-8.838 53.787-9.055-8.947-80.303 79.765 80.303 94.854 25.492-30.019h6.737v21.774l-19.563 23.066 19.563 23.067v29.804l-32.229-37.888L192.296 911.63H367.67v-204.1h541.588v204.1h55.458v44.517H59.23v-44.518zm166.912-251.473-39.882 228.729L303.158 750.86zm28.025-159.906L234.12 615.424l68.015-67.584-47.913-47.59zm6.522-79.656 43.708-61.764-43.708-61.817v123.58zM316.2 342.07l47.158-66.722h-94.315zm54.65-43.924-42.847 60.631 42.847 60.632zM316.2 375.43l-49.798 70.602h99.705zm-55.457-152.522 41.768-41.823-41.768-41.768zm55.457-55.512 45.056-45.056-90.22-.108zm54.65-27.217-40.96 40.96 40.96 40.96zm-54.65 54.596-49.583 49.583h99.167L316.2 194.776zm109.191 181.301v70.01h86.932zm-306.445 69.956H206.2v-70.171l-87.255 70.17zM425.39 174.457v69.902h86.932zM119.053 244.36h87.148v-70.117zm804.864 275.51H816.505v-45.92h4.959v-23.875h-75.83v23.875h4.85v72.111h-11.587V519.87H353.172l-22.42 136.838v29.589H946.23v-29.589zM462.632 911.63h89.681V749.945h-89.68zm309.033-161.684h-89.573v106.227h89.573z',
                }),
              ]),
            ]
        );
      });
    }
  });
});
onBeforeUnmount(() => {
  scene?.[Symbol.dispose]();
  overlay?.[Symbol.dispose]();
});
</script>

<template>
  <!-- 用于渲染地图场景的 Canvas 元素 -->
  <canvas ref="modelCanvas" class="full-screen-canvas"/>
  <!-- HTML 元素挂载点 -->
  <div ref="htmlMountPoint" class="mount-point"/>
</template>

<style scoped>
@import url("../../common.css");
.full-screen-canvas {
  cursor: grab;
}
.full-screen-canvas:active {
  cursor: grabbing;
}
.mount-point {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  z-index: 3;
}
</style>