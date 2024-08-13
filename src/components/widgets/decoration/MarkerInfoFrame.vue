<script setup lang="ts">
import {reactive, ref} from "vue";
import {ElTooltip} from "element-plus";

withDefaults(defineProps<{
  title: string,
  imagePreview?: string,
  clientWidth?: string,
  clientHeight?: string,
  headerHeight?: string,
}>(), {
  clientWidth: '20rem',
  clientHeight: '9rem',
  headerHeight: '2.5rem',
});
defineEmits<{
  close: [],
  viewDetails: []
  viewCamera: []
}>();
const showExitButton = ref<boolean>(false);
const info = reactive<Record<string, any>>({
  name: 'ABC',
  hah: "yea",
  wtf: 'no'
});
</script>

<template>
  <div class="wrapper" :style="{width: $props.clientWidth, height: `calc(${$props.headerHeight} + ${$props.clientHeight})`}">
    <div class="header" :style="{height: $props.headerHeight}">
      <div class="title">{{$props.title}}</div>
      <div class="icon">
        <ElTooltip placement="top" content="关闭该窗口">
          <svg
              viewBox="0 0 1024 1024"
              @mouseover="showExitButton = true" @mouseout="showExitButton = false"
              :style="{cursor: showExitButton ? 'pointer' : 'default', width: '100%', height: '100%'}"
          >
            <path v-if="showExitButton" @click="$emit('close')"
                  d="M887.2 774.2 624.8 510.8l263-260c10.8-10.8 10.8-28.4 0-39.2l-74.8-75.2c-5.2-5.2-12.2-8-19.6-8-7.4 0-14.4 3-19.6 8L512 395.6 249.8 136.6c-5.2-5.2-12.2-8-19.6-8-7.4 0-14.4 3-19.6 8L136 211.8c-10.8 10.8-10.8 28.4 0 39.2l263 260L136.8 774.2c-5.2 5.2-8.2 12.2-8.2 19.6 0 7.4 2.8 14.4 8.2 19.6l74.8 75.2c5.4 5.4 12.4 8.2 19.6 8.2 7 0 14.2-2.6 19.6-8.2L512 626.2l261.4 262.2c5.4 5.4 12.4 8.2 19.6 8.2 7 0 14.2-2.6 19.6-8.2l74.8-75.2c5.2-5.2 8.2-12.2 8.2-19.6C895.4 786.4 892.4 779.4 887.2 774.2z"
            />
            <path v-else
                  d="M59.284 911.63h67.8l75.884-434.608H103.8v52.817H72.973v-83.806l133.282-107.25v-63.489h-102.4v52.817H72.973v-83.698l133.282-107.359v-22.366c0-27.81 23.66-46.511 50.122-46.727l118.407-.108c26.516 0 50.607 19.08 50.607 46.835v22.636l133.39 107.358v83.483h-30.99v-52.817h-102.4v63.65l133.39 107.25v53.895h-30.99v-23.175h-99.166l4.096 23.175h-82.513l23.175-23.175H258.21l57.56 57.29 17.892-17.677-8.838 53.787-9.055-8.947-80.303 79.765 80.303 94.854 25.492-30.019h6.737v21.774l-19.563 23.066 19.563 23.067v29.804l-32.229-37.888L192.296 911.63H367.67v-204.1h541.588v204.1h55.458v44.517H59.23v-44.518zm166.912-251.473-39.882 228.729L303.158 750.86zm28.025-159.906L234.12 615.424l68.015-67.584-47.913-47.59zm6.522-79.656 43.708-61.764-43.708-61.817v123.58zM316.2 342.07l47.158-66.722h-94.315zm54.65-43.924-42.847 60.631 42.847 60.632zM316.2 375.43l-49.798 70.602h99.705zm-55.457-152.522 41.768-41.823-41.768-41.768zm55.457-55.512 45.056-45.056-90.22-.108zm54.65-27.217-40.96 40.96 40.96 40.96zm-54.65 54.596-49.583 49.583h99.167L316.2 194.776zm109.191 181.301v70.01h86.932zm-306.445 69.956H206.2v-70.171l-87.255 70.17zM425.39 174.457v69.902h86.932zM119.053 244.36h87.148v-70.117zm804.864 275.51H816.505v-45.92h4.959v-23.875h-75.83v23.875h4.85v72.111h-11.587V519.87H353.172l-22.42 136.838v29.589H946.23v-29.589zM462.632 911.63h89.681V749.945h-89.68zm309.033-161.684h-89.573v106.227h89.573z"
            />
          </svg>
        </ElTooltip>
      </div>
    </div>
    <transition name="fade" appear>
      <div class="content" :style="{height: $props.clientHeight, top: $props.headerHeight}">
        <div class="button" @click="$emit('viewDetails')">查&emsp;看</div>
        <ElTooltip placement="bottom-end" content="变电站实景" :teleported="false">
          <div class="preview" @click="$emit('viewCamera')" v-if="$props.imagePreview"/>
        </ElTooltip>
        <div class="rows">
          <div
              class="row" v-for="(value, key) in info"
          >
            <div class="key">{{key}}</div>
            <div class="value">{{value}}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  border-radius: 4pt;
  position: relative;
  border: 1pt solid transparent;
  background: linear-gradient(rgba(2, 14, 35, 0.8), rgb(2, 14, 35, 0.8)) padding-box,
  linear-gradient(to bottom, rgba(99, 244, 255, 0.2), #46ABFF) border-box;
  &::after {
    content: '正常运行';
    position: absolute;
    bottom: 8pt;
    right: 8pt;
    font-size: medium;
    font-style: italic;
    color: rgba(70,171,255,0.1);
    text-shadow: -0.1em -0.1em 4pt rgba(70,171,255,0.1);
  }
}
@mixin component {
  position: absolute;
  width: 100%;
  left: 0;
}
.header {
  @include component;
  background: linear-gradient(270deg, rgba(70,171,255,0) 0%, rgba(70,171,255,0.3) 100%);
  border-radius: 2pt 2pt 0 0;
  &::after {
    content: '';
    opacity: 0.2;
    background: linear-gradient(270deg, #46ABFF 0%, rgba(70, 171, 255, 0) 100%);
    width: 70%;
    height: 80%;
    position: absolute;
    top: 20%;
    left: 0;
    clip-path: polygon(0 0, calc(100% - 25pt) 0, 100% 100%, 0 100%, 0 0);
  }
  &::before {
    content: '';
    opacity: 0.1;
    background: linear-gradient(270deg, #46ABFF 0%, rgba(70,171,255,0.00) 100%);
    width: 100%;
    height: 60%;
    position: absolute;
    top: 40%;
    left: 0;
    clip-path: polygon(0 0, calc(100% - 20pt) 0, 100% 100%, 0 100%, 0 0);
  }
  .title {
    text-align: left;
    position: absolute;
    top: 20%;
    left: 10pt;
    background: linear-gradient(to bottom, #e1f8ff, #6cd7ff);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    font-family: YouSheBiaoTiHei,serif;
    font-size: calc(0.5 * v-bind(headerHeight));
  }
  .icon {
    position: absolute;
    right: 10pt;
    top: 50%;
    transform: translateY(-50%);
    fill: rgba(156, 228, 255, 0.8);
    height: 50%;
  }
}
.content {
  @include component;
  .preview {
    width: 25%;
    height: 40%;
    position: absolute;
    top: 10%;
    right: 5%;
    border-radius: 5pt;
    border: 2pt solid transparent;
    background: linear-gradient(to bottom, #00b5ff, #00a4ff) border-box;
    cursor: zoom-in;
    &::after {
      content: '';
      background: v-bind(imagePreview);
      background-size: cover;
      width: 100%;
      height: 100%;
      display: inline-block;
      border-radius: inherit;
    }
  }
  &::before {
    // 分割线
    content: '';
    height: 1pt;
    width: 100%;
    position: absolute;
    left: 0;
    top: -1pt;
    background: linear-gradient(to right, #92DAFF, rgb(166, 220, 254, 0));
  }
  &::after {
    // 背景渐变
    content: '';
    position: absolute;
    bottom: 0;
    left: 15%;
    width: 70%;
    height: 2rem;
    background: radial-gradient(ellipse 70% 50% at 50% 100%, rgba(97, 240, 255, 0.4) 0%, rgba(0, 123, 255, 0) 30%),
    radial-gradient(ellipse 70% 100% at 50% 100%, rgba(70, 171, 255, 0.3) 0%, rgba(0, 123, 255, 0) 60%);
  }
  .rows {
    position: absolute;
    top: 5pt;
    left: 10pt;
    @if str-length(v-bind(imagePreview)) > 0 {
      width: 60%;
    } @else {
      width: calc(100% - 10pt);
    }
    > :not(:last-child)::after {
      content: '';
      width: 200%;
      height: 1pt;
      background: linear-gradient(to right, transparent 0%, rgba(1, 181, 255, 0.4) 20% 80%, transparent 100%);
    }
    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 0.1em 0 0.1em 0;
      .key {
        font-weight: bolder;
        text-align: right;
        padding-right: 1em;
        background: linear-gradient(to top, #bbb, #fff);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }
      .value {
        text-align: left;
        background: linear-gradient(to bottom, #E1F8FF, #6CD7FF);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }
    }
  }
  .button {
    position: absolute;
    left: 50%;
    bottom: 1em;
    transform: translateX(-50%);
    width: 50%;
    max-width: 6rem;
    height: 1.5rem;
    border: 1pt solid transparent;
    background: linear-gradient(135deg,
        rgba(0, 0, 0, 0.1) 25%, transparent 25%,
        transparent 50%, rgba(0, 0, 0, 0.1) 50%,
        rgba(0, 0, 0, 0.1) 75%, transparent 75%, transparent) padding-box,
    linear-gradient(rgba(9, 52, 120, 0.8), rgba(9, 52, 120, 0.8)) padding-box,
    linear-gradient(to bottom, rgba(0, 181, 255, 0), #00a4ff) border-box;
    border-radius: 6pt;
    color: white;
    font-size: 0.6em;
    display: flex;
    justify-content: center;
    align-items: center;
    text-shadow: 0 0 1em rgba(104,190,254,0.50);
    font-weight: bolder;
    cursor: pointer;
    user-select: none;
    z-index: 2;
    &:hover {
      background: linear-gradient(135deg,
          rgba(0, 0, 0, 0.1) 25%, transparent 25%,
          transparent 50%, rgba(0, 0, 0, 0.1) 50%,
          rgba(0, 0, 0, 0.1) 75%, transparent 75%, transparent),
      linear-gradient(lighten(rgba(9, 52, 120, 0.8), 3%) 0%, lighten(rgba(9, 52, 120, 0.8), 6%) 100%) padding-box,
      linear-gradient(to bottom, rgba(0, 181, 255, 0), #00a4ff) border-box;
    }
  }
}
</style>