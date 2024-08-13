<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {ModelScene} from "../../ts/renderers/model/ModelScene.ts";
import {CameraViewTypeChangeEvent, ObjectSelectionEvent} from "../../ts/events/SceneEvents.ts";
import {OverlayRenderer} from "../../ts/renderers/overlay/OverlayRenderer.ts";
import DeviceInfoOverlay from "../overlay/DeviceInfoOverlay.vue";
import {CameraViewType} from "../../ts/common/Types.ts";
// import {SoundEffects} from "../../ts/effects/SoundEffects.ts";
// import {EventManager} from "../../ts/events/EventManager.ts";

// 定义需要的属性
const properties = defineProps<{
  manifestPath: string,
}>();
// 定义事件信号
const emits = defineEmits<{
  load: [],
  cameraViewType: [CameraViewType],
}>();

// 用来绘制元素的画布
const modelCanvas = ref<HTMLCanvasElement>();
// 悬浮的 HTML 元素挂载点
const htmlMountPoint = ref<HTMLDivElement>();

// 模型场景
let scene: ModelScene;
let overlay: OverlayRenderer;
// let soundEffects: SoundEffects;
// let eventManager: EventManager;
defineExpose({
  useCall: (): (((
      functionName: string,
      isAsync: boolean,
      expectResult: boolean,
      ...parameters: any[]
  ) => Promise<any>) | undefined) => {
    return scene?.call.bind(scene);
  }
});
// 在当前组件被挂载时，开始渲染
onMounted(() => {
  scene = new ModelScene(
      modelCanvas.value!
  );
  overlay = new OverlayRenderer(htmlMountPoint.value!, scene);

  // soundEffects = new SoundEffects(twin.camera);
  // eventManager = new EventManager(
  //     import.meta.env.DEV ? 'ws://localhost:2439' : 'wss://event.rykerzhu.fun'
  // );
  // eventManager.listenTo('fireAlarm', () => {
  //   soundEffects.play('fire');
  // });
  // eventManager.listenTo('electricityLeak', () => {
  //   soundEffects.play('electricity');
  // });
  // eventManager.listenTo('explosion', () => {
  //   soundEffects.play('explosion');
  // });

  // 事件监听
  scene.addEventListener('object-selection', (evt: Event) => {
    const event = (evt as ObjectSelectionEvent);
    if(event.selected) {
      event.objects.forEach(object => {
        const name = object.userData['fileName'];
        if(/[\u4E00-\u9FA5]+/g.test(name)) {
          overlay.addComponent(DeviceInfoOverlay, {
            name: (name as string).replace(/_/g, ' ')
          }, object.uuid);
        }
      });
    } else {
    }
  });
  scene.addEventListener('load', (_: Event) => {
    emits('load');
    modelCanvas.value!.style!.opacity = '1';
  });
  scene.addEventListener('camera-view-type', (evt: Event) => {
    emits('cameraViewType', (evt as CameraViewTypeChangeEvent).viewType);
  });

  // 加载清单中的各个模型
  (async () => await scene.loadModels(properties.manifestPath))();
});
// 在当前组件被卸载时，释放资源
onBeforeUnmount(() => {
  scene?.[Symbol.dispose]();
  overlay?.[Symbol.dispose]();
});
</script>

<template>
  <!-- 用于渲染模型场景的 Canvas 元素 -->
  <canvas ref="modelCanvas" class="full-screen-canvas"/>
  <!-- HTML 元素挂载点 -->
  <div ref="htmlMountPoint" class="mount-point"/>
</template>

<style scoped>
@import url("../../common.css");
.full-screen-canvas {
  opacity: 0;
  transition: all 1s ease;
  z-index: 2;
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