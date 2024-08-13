<template>
  <div class="wrapper" :style="{
    width: calculatedWidth, height: $props.height
  }">
    <div class="icon-slot" v-if="$slots.default"
         :style="{
            width: calculatedWidth * 0.425 + 'px',
            height: calculatedWidth * 0.425 + 'px',
         }"
    >
      <slot/>
    </div>
    <svg
        :width="calculatedWidth" :height="height" v-once
        viewBox="0 0 60 90"
    >
      <defs>
        <linearGradient :id="uuids[0]" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).lighten(10).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(5).toRgbString()"/>
        </linearGradient>
        <linearGradient :id="uuids[1]" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).lighten(15).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(20).toRgbString()"/>
        </linearGradient>
        <linearGradient :id="uuids[2]" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).brighten(5).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).darken(10).toRgbString()"/>
        </linearGradient>
        <linearGradient :id="uuids[3]" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).toRgbString()"/>
        </linearGradient>
        <linearGradient :id="uuids[4]" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).toRgbString()"/>
        </linearGradient>
        <linearGradient :id="uuids[5]" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).toRgbString()"/>
        </linearGradient>
        <linearGradient :id="uuids[6]" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).setAlpha(0.9).toRgbString()"/>
        </linearGradient>
        <linearGradient :id="uuids[7]" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).lighten(20).setAlpha(0).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(10).toRgbString()"/>
        </linearGradient>
        <linearGradient :id="uuids[8]" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).darken(10).setAlpha(0.6).toRgbString()"/>
        </linearGradient>
        <radialGradient :id="uuids[9]" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).darken(10).setAlpha(0).toRgbString()"/>
          <stop :offset="0.7262" :stop-color="tinycolor(themeColor).setAlpha(0.181).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).setAlpha(0.5).toRgbString()"/>
        </radialGradient>
        <radialGradient :id="uuids[10]" cx="50%" cy="50%" r="69.75%" fx="50%" fy="50%"
                        gradientTransform="matrix(0 1 -1.09632 0 1.048 0)">
          <stop :offset="0" :stop-color="tinycolor(themeColor).lighten(10).setAlpha(0.026).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).darken(10).setAlpha(0.5).toRgbString()"/>
        </radialGradient>
        <radialGradient :id="uuids[11]" cx="50%" cy="95.609%" r="34.257%" fx="50%" fy="95.609%"
                        gradientTransform="matrix(0 1 -1.56312 0 1.994 .456)">
          <stop :offset="0" stop-color="#FFF"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).darken(10).setAlpha(0).toRgbString()"/>
        </radialGradient>
      </defs>
      <g fill="none" fill-rule="evenodd">
        <circle cx="30" cy="27" r="23.981" :fill="`url(#${uuids[9]})`" :stroke="`url(#${uuids[0]})`" stroke-width=".5"/>
        <path :stroke="`url(#${uuids[1]})`"
              d="M6.326 8.572A29.87 29.87 0 0 0 0 27a29.87 29.87 0 0 0 6.158 18.21m47.785-.13A29.87 29.87 0 0 0 60 27c0-6.751-2.23-12.982-5.994-17.995"/>
        <circle cx="30" cy="27" r="26.75" :stroke="`url(#${uuids[2]})`" stroke-width=".5" opacity=".5"/>
        <g transform="translate(2.767 46)">
          <ellipse cx="26.923" cy="30" :stroke="`url(#${uuids[3]})`" stroke-width=".5" opacity=".5" rx="26.673"
                   ry="13.75"/>
          <ellipse cx="26.923" cy="28.5" :stroke="`url(#${uuids[4]})`" stroke-width=".5" rx="19.942" ry="10.25"/>
          <g stroke-linejoin="bevel">
            <ellipse cx="26.923" cy="27.5" :fill="`url(#${uuids[10]})`" :stroke="`url(#${uuids[5]})`" rx="13.923"
                     ry="7"/>
            <ellipse cx="26.923" cy="27.5" :stroke="`url(#${uuids[11]})`" rx="13.923" ry="7"/>
          </g>
          <path :fill="`url(#${uuids[6]})`" :stroke="`url(#${uuids[7]})`" stroke-width=".5"
                d="m31.992.25.99 28.717c-.004.305-.164.561-.424.799-.314.286-.772.54-1.336.756-1.152.44-2.738.709-4.489.709-1.71 0-3.263-.257-4.408-.679-.564-.208-1.027-.454-1.354-.731-.273-.232-.45-.482-.482-.753L22.467.25z"/>
          <path :fill="`url(#${uuids[8]})`" d="M25.233 0h4l1.525 27.98q-2.31 1-4.31 1a7.1 7.1 0 0 1-3.69-1z"/>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import tinycolor from "tinycolor2";
import {v4} from "uuid";

const aspectRatio = 60 / 90;
const props = withDefaults(
    defineProps<{
      height?: number
      themeColor?: 'blue' | 'green' | 'red' | string
    }>(), {
      height: 90,
      themeColor: 'blue',
    }
);
const themeColor = computed(() => {
  switch (props.themeColor) {
    case 'blue':
      return '#00BCFF'
    case 'green':
      return '#00FFAD'
    case 'red':
      return '#FF5D5D'
    default:
      return props.themeColor
  }
});
const uuids = Array.from({length: 12}, () => v4());
const calculatedWidth = computed(() => aspectRatio * props.height);
</script>

<style scoped>
.wrapper {
  position: relative;
  display: inline-block;
}
.icon-slot {
  position: absolute;
  top: 12.5%;
  left: 50%;
  transform: translateX(-50%);
}
</style>