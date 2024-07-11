<script setup lang="ts">
import VChart from "vue-echarts";
import {ref} from "vue";
import {EChartsOption} from "echarts";
import {registerMap, use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {MapChart} from "echarts/charts";
import 'echarts-gl';
import {Tween} from "@tweenjs/tween.js";
import {useRouter} from "vue-router";
const router = useRouter();
const emits = defineEmits(['sceneChange']);
use([
    CanvasRenderer,
    MapChart,
]);
const props = withDefaults(defineProps<{
  map?: string,
  viewCenter?: [number, number, number],
  distance?: number,
  minDistance?: number,
  maxDistance?: number,
}>(), {
  map: 'china',
  viewCenter: () => [20, 0, 0],
  distance: 40,
  minDistance: 10,
  maxDistance: 60,
});
const options = ref<EChartsOption>();
const regions = ref<{name: string; height: number; itemStyle: any;}[]>([]);
fetch(`/map/${props.map}.json`).then((res) => res.json()).then((data) => {
  registerMap(props.map, data);
  options.value = {
    // @ts-ignore
    series: [
      {
        type: 'map3D',
        selectedMode: 'single',
        regionHeight: 1,
        map: props.map,
        shading: 'realistic',
        environment: '#252525',
        groundPlane: {
          show: true,
          realisticMaterial: {
            detailTexture: '/textures/ground-plane.jpg',
            textureTiling: 16,
            roughness: 0
          },
        },
        viewControl: {
          distance: props.distance,
          alpha: 45,
          rotateMouseButton: 'right',
          maxDistance: props.maxDistance,
          minDistance: props.minDistance,
          center: props.viewCenter,
        },
        label: {
          color: '#fff',
          fontSize: 18,
          formatter: (params: {name: string}) => params.name ?? '',
        },
        itemStyle: {
          color: '#505050',
          borderWidth: 1,
          borderColor: 'rgba(255,193,7,0.5)',
        },
        emphasis: {
          itemStyle: {
            color: '#505050',
          }
        },
        light: {
          main: {
            color: '#fff',
            intensity: 1,
            alpha: 25,
            beta: 20
          },
          ambient: {
            color: '#fff',
            intensity: 0.2
          }
        },
        postEffect: {
          enable: true,
        },
        data: regions
      } // series
    ]
  };
});

const onMapClick = (e: {name: string}) => {
  let animating = true;
  const tween = new Tween({height: 1})
      .to({height: 2}, 300)
      .onUpdate((object: {height: number}) => {
        regions.value = [{
          name: e.name, height: object.height,
          itemStyle: {
            color: '#B3E5FC',
            borderWidth: 1,
            borderColor: '#B3E5FC',
          }
        }];
      })
      .onComplete(() => {
        animating = false;
        emits('sceneChange', e.name);
        router.push({
          name: 'substation-scene',
        });
      })
      .start();
  const update = () => {
    tween.update();
    if(animating) requestAnimationFrame(update);
  };
  update();
  // @ts-ignore
  options.value.series[0].viewControl.distance = 25;
}
</script>

<template>
  <div class="map-canvas">
    <VChart :option="options" @click="onMapClick" autoresize/>
  </div>
</template>

<style scoped>
.map-canvas {
  width: 100vw;
  height: 100vh;
}
</style>