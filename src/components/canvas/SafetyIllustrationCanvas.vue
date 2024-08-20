<script setup lang="ts">
import {ElButton, ElPopover, ElSelect, ElOption} from "element-plus";
import {InfoFilled, VideoPlay, Refresh} from "@element-plus/icons-vue";
import {computed, onMounted, ref} from "vue";
import SafeDistanceSheet from "../misc/SafeDistanceSheet.vue";
import SciFiWarningOverlay from "../overlay/SciFiWarningOverlay.vue";
import {SafetyIllustrationScene} from "../../ts/renderers/safety/SafetyIllustrationScene.ts";

const isSheetVisible = ref<boolean>(false);
const isInfoButtonChecked = ref<boolean>(false);
const currentDistance = ref<number>(0);
const voltageLevel = ref<number>(10);
const minimumDistanceMapping: Record<number, number> = {
  10: 0.4, 35: 0.6, 63: 0.7, 110: 1.0, 220: 1.8, 330: 2.6, 500: 3.2
};
const isWarningDisplayed = computed<boolean>(() => currentDistance.value < minimumDistanceMapping[voltageLevel.value]);
const renderCanvas = ref<HTMLCanvasElement>();
const distanceDisplayed = ref<string>('');
let renderer: SafetyIllustrationScene;
let currentPlayStatus: number = 0;
const movePlayer = () => {
  switch (currentPlayStatus) {
    case 0:
      renderer.call('moveTowardsPlayer');
      currentPlayStatus++;
      break;
    case 1:
      renderer.call('replay', false,false,
          minimumDistanceMapping[voltageLevel.value] + 6);
      currentPlayStatus = 0;
      break;
  }
};
const isLoading = ref<boolean>(true);
onMounted(() => {
  renderer = new SafetyIllustrationScene(renderCanvas.value!);
  setInterval(() => {
    renderer.call('calculateDistance', false, true)
        .then((d: number) => {
          distanceDisplayed.value = (currentDistance.value = d).toFixed(3);
        });
  }, 500);
  setTimeout(() => {
    isLoading.value = false;
  }, 3000);
});
</script>

<template>
  <div style="width: 100%; height: 100%;" v-loading="isLoading" element-loading-text="加载场景中...">
    <div class="wrapper" v-show="!isLoading">
      <ElButton
          type="primary" plain
          :icon="currentPlayStatus ? Refresh : VideoPlay"
          class="player-move" @click="movePlayer"
      >{{currentPlayStatus ? '重置' : '开始'}}</ElButton>
      <transition name="fade" mode="out-in">
        <div v-show="isWarningDisplayed" class="striped-border"/>
      </transition>
      <div class="canvas-container" :class="{warning: isWarningDisplayed}">
        <canvas ref="renderCanvas" class="paint-area"/>
      </div>
      <div class="distance">{{distanceDisplayed}}</div>
      <ElPopover trigger="hover" :visible="isSheetVisible" width="30rem" placement="left">
        <template #reference>
          <ElButton
              @click="isInfoButtonChecked = !isInfoButtonChecked"
              @mouseover="isSheetVisible = true"
              @mouseout="() => {if(!isInfoButtonChecked) isSheetVisible = false}"
              :icon="InfoFilled" :type="isInfoButtonChecked ? 'primary' : 'info'"
              style="position: absolute; right: 1em; top: 1em; z-index: 2;"
          >帮助</ElButton>
        </template>
        <SafeDistanceSheet/>
      </ElPopover>
      <transition name="fade" mode="out-in">
        <SciFiWarningOverlay
            title="小于安全距离" description="请与电气设备保持安全距离"
            v-show="isWarningDisplayed"
            height="3em" class="overlay"
        />
      </transition>
      <ElSelect
          v-model="voltageLevel" class="voltage-select" placeholder="电压等级"
          automatic-dropdown
      >
        <ElOption label="10 kV" :value="10"/>
        <ElOption label="35 kV" :value="35"/>
        <ElOption label="63 (66) kV" :value="63"/>
        <ElOption label="110 kV" :value="110"/>
        <ElOption label="220 kV" :value="220"/>
        <ElOption label="330 kV" :value="330"/>
        <ElOption label="500 kV" :value="500"/>
      </ElSelect>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../overlay/stripe";
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  .player-move {
    position: absolute;
    top: 1em;
    left: 1em;
    z-index: 1;
  }
  .canvas-container {
    width: calc(100% - 4pt);
    height: calc(100% - 4pt);
    position: absolute;
    top: 2pt;
    left: 2pt;
    .paint-area {
      width: 100%;
      height: 100%;
    }
  }
  .distance {
    padding: 1em;
    user-select: none;
    width: fit-content;
    color: black;
    font-family: "Courier New", monospace;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 10pt rgba(0, 0, 0, 0.1);
    border-radius: 5pt;
    border: 1pt solid rgba(20, 20, 20, 0.3);
    position: absolute;
    right: 1em;
    bottom: 1em;
    &::before {
      content: '实时距离';
      display: block;
      font-size: small;
      background: linear-gradient(180deg, #aaa 0%, #000 100%);
      text-shadow: 0 8pt 4pt 0 rgba(1,230,254,0.5);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    }
    &::after {
      content: 'm';
      display: inline-block;
      font-size: small;
      font-weight: bold;
      margin-left: 0.2em;
    }
  }
  @keyframes striped-flow {
    0% {
      background-position: -100%;
    }
    100% {
      background-position: 100%;
    }
  }
  .striped-border {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    $borderWidth: 5pt;
    clip-path: polygon(
            0% 0%,
            0% 100%,
            $borderWidth 100%,
            $borderWidth $borderWidth,
            calc(100% - $borderWidth) $borderWidth,
            calc(100% - $borderWidth) calc(100% - $borderWidth),
            $borderWidth calc(100% - $borderWidth),
            $borderWidth 100%,
            100% 100%,
            100% 0%
    );
    &::after {
      content: '';
      display: inline-block;
      width: 100%;
      height: 100%;
      @include stripe(1);
      background-size: 10em 10em;
      animation: striped-flow 5s linear infinite;
    }
  }
  @keyframes bg-warning {
    from {
      background: transparent;
    }
    to {
      background: rgba(255, 235, 59, 0.5);
    }
  }
  .warning {
    animation: bg-warning 0.3s linear alternate infinite;
  }
  .voltage-select {
    width: 8em;
    position: absolute;
    user-select: all;
    right: 1em;
    top: 3.5em;
  }
  .overlay {
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>