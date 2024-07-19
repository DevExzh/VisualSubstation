<script setup lang="ts">
import {ref} from "vue";
import {pixels} from "../../ts/common/Utils.ts";
import {v4} from "uuid";

const props = withDefaults(defineProps<{
  title: string;
  clientHeight?: string | number;
  clientWidth?: string | number;
  borderWidth?: string | number;
  headerHeight?: string | number;
}>(), {
  clientHeight: "10rem",
  clientWidth: "28.125rem",
  borderWidth: "1px",
  headerHeight: 40,
});
const containerWidth = ref<string>(
    typeof props.clientWidth === "number" ?
    `${props.clientWidth}px` : props.clientWidth
);
const borderWidth = ref<string>(pixels(props.borderWidth) + 'px');
const titleWidth = ref<number>(pixels(props.title.length) * 17);
const headerHeight = ref<number>(pixels(props.headerHeight));
const svgInitWid = titleWidth.value + 60;
const bgContainerStyle = ref<string>(`polygon(${svgInitWid}px 0,0 0,0 100%,100% 100%,100% 12px,`+
    `calc(${svgInitWid}px + 13.5px) 12px,${svgInitWid}px 0)`);
const headerDrawCommand = ref<string>(`M${svgInitWid} 0H0v${pixels(props.headerHeight) - 10}` +
    `l10 10h${pixels(props.clientWidth)}V12H${svgInitWid + 13.5}z`
);
const uuids: string[] = [v4(), v4()];
</script>

<template>
  <div class="container" :style="{
    height: `calc(${headerHeight}px + ${$props.clientHeight})`
  }">
    <div class="header" :style="{
      height: headerHeight + 'px'
    }"
    >
      <div class="header-corner">
        <slot name="header-corner" />
      </div>
      <svg class="title-decorator" xmlns="http://www.w3.org/2000/svg"
           width="16.707" height="16.707"
      >
        <g fill="none" fill-rule="evenodd">
          <path stroke="#59BFFF" stroke-dasharray="0,0" stroke-opacity=".2" d="m8.707 16.707 8-8-8-8-8 8z"/>
          <path fill="#59BFFF" d="m8.707 11.707 3-3-3-3-3 3z"/>
        </g>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
           :width="containerWidth" :height="headerHeight"
           class="header-background"
      >
        <defs>
          <linearGradient id="b" x1="0%" x2="99.111%" y1="50%" y2="50%">
            <stop offset="0%" stop-color="#1F87CC" stop-opacity=".302"/>
            <stop offset="100%" stop-color="#1F87CC" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="c" x1="0%" x2="92.145%" y1="50%" y2="50%">
            <stop offset="0%" stop-color="#5EBCF5" stop-opacity=".4"/>
            <stop offset="100%" stop-color="#5EBCF5" stop-opacity="0"/>
          </linearGradient>
          <path :id="uuids[0]" :d="headerDrawCommand"/>
          <mask :id="uuids[1]" :width="containerWidth" height="40" x="0" y="0" fill="#fff"
                maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox">
            <use :xlink:href="`#${uuids[0]}`"/>
          </mask>
        </defs>
        <use :xlink:href="`#${uuids[0]}`" fill="url(#b)" fill-rule="evenodd" stroke="url(#c)"
             stroke-dasharray="0,0" stroke-width="2" :mask="`url(#${uuids[1]})`"/>
        <path fill="#DBF1FF" fill-rule="evenodd" d="M0 0h10v2H2v2H0V1z"/>
      </svg>
      <div class="header-title" v-if="$props.title">{{$props.title}}</div>
      <svg class="title-decorator-diamonds" xmlns="http://www.w3.org/2000/svg" width="51" height="8">
        <g fill="#02EA93" fill-rule="evenodd">
          <path d="M17 8 8 0H0l9 8z"/>
          <path d="m34 8-9-8h-8l9 8z" opacity=".5"/>
          <path d="m51 8-9-8h-8l9 8z" opacity=".2"/>
        </g>
      </svg>
    </div>
    <div class="content-area" :style="{height: $props.clientHeight}">
      <slot />
    </div>
    <div v-once class="bg-container">
      <div class="bg-border" />
      <svg class="bottom-decorator"
           xmlns="http://www.w3.org/2000/svg" :width="`calc(.53 * ${$props.clientWidth})`" height="1">
        <defs><linearGradient id="h" x1="0%" x2="100%" y1="49.817%" y2="49.817%">
          <stop offset="0%" stop-color="#59BFFF" stop-opacity="0"/>
          <stop offset="28.99%" stop-color="#59BFFF" stop-opacity=".851"/>
          <stop offset="50.97%" stop-color="#ABDFFF"/>
          <stop offset="71.81%" stop-color="#59BFFF" stop-opacity=".651"/>
          <stop offset="100%" stop-color="#59BFFF" stop-opacity="0"/>
        </linearGradient></defs>
        <path fill="url(#h)" fill-rule="evenodd" d="M345 299v1H105v-1z" transform="translate(-105 -299)"/>
      </svg>
      <svg class="bottom-corner-left" xmlns="http://www.w3.org/2000/svg" width="8" height="8">
        <path fill="#DBF1FF" fill-rule="evenodd" d="M0 8V0h2v6h6v2H2z"/>
      </svg>
      <svg class="bottom-corner-right" xmlns="http://www.w3.org/2000/svg" width="8" height="8">
        <path fill="#DBF1FF" fill-rule="evenodd" d="M8 8V0H6v6H0v2h6z"/>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$topMostLineWidth: v-bind("svgInitWid + 'px'");
$containerWidth: v-bind(containerWidth);
.container {
  position: relative;
  width: $containerWidth;
}
.header {
  position: absolute;
  top: 0;
  left: 0;
  height: 2.5em;
  z-index: 6;
  width: $containerWidth;
}
.header-background {
  position: absolute;
  top: 0;
  left: 0;
}
.header-title {
  position: absolute;
  left: 3em;
  top: 50%;
  transform: translateY(-50%);
  color: #ABDFFF;
}
.bg-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
  height: 100%;
  width: $containerWidth;
  background: linear-gradient(to bottom, rgba(2, 12, 18, 0.8), rgba(5, 27, 38, 0.8));
  clip-path: v-bind(bgContainerStyle);
}
$borderWidth: v-bind(borderWidth);
.bg-border {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(94, 188, 245, 0.25));
  clip-path: polygon(
      0 0,
      $borderWidth 0, $borderWidth calc(100% - $borderWidth),
      calc(100% - $borderWidth) calc(100% - $borderWidth),
      calc(100% - $borderWidth) 6%,
      100% 6%,
      100% 100%,
      0 100%,
      0 0
  );
}
.bottom-decorator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
}
.title-decorator {
  position: absolute;
  top: 50%;
  left: 1em;
  transform: translateY(-50%);
}
.title-decorator-diamonds {
  position: absolute;
  top: 0;
  left: calc($topMostLineWidth + .75em);
}
.content-area {
  pointer-events: visible;
  position: absolute;
  top: v-bind("headerHeight + 'px'");
  width: 100%;
  left: 0;
  z-index: 5;
}
.bottom-corner-left {
  position: absolute;
  bottom: 0;
  left: 0;
}
.bottom-corner-right {
  position: absolute;
  bottom: 0;
  right: 0;
}
.header-corner {
  position: absolute;
  bottom: 0;
  right: 0;
  height: v-bind("props.headerHeight + 'px'");
  width: v-bind("`calc(${containerWidth} - ${svgInitWid}px)`");
  z-index: 7;
}
</style>