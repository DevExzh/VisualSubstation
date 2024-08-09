<template>
  <svg
      :width="calculatedWidth"
      :height="height"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 48 58"
  >
    <defs>
      <radialGradient :id="uuids[0]" cx="50%" cy="4.81%" r="70.812%" fx="50%" fy="4.81%" :gradientTransform="`matrix(0 1 -.83015 0 .54 -.452)`">
        <stop offset="0%" :stop-color="tinycolor(themeColor).lighten(50).toRgbString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColor).toRgbString()" stop-opacity="0" />
      </radialGradient>
      <radialGradient :id="uuids[1]" cx="50%" cy="100%" r="45.554%" fx="50%" fy="100%" :gradientTransform="`matrix(0 1 -1.6707 0 2.17 .5)`">
        <stop offset="0%" :stop-color="tinycolor(themeColor).lighten(40).setAlpha(0.5).toRgbString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColor).toRgbString()" stop-opacity="0" />
      </radialGradient>
      <radialGradient :id="uuids[2]" cx="50%" cy="96.134%" r="26.569%" fx="50%" fy="96.134%" :gradientTransform="`matrix(0 1 -1.9949 0 2.418 .461)`">
        <stop offset="0%" stop-color="#FFF" />
        <stop offset="100%" :stop-color="tinycolor(themeColor).toRgbString()" stop-opacity="0" />
      </radialGradient>
      <radialGradient :id="uuids[3]" cx="50%" cy="2.728%" r="26.569%" fx="50%" fy="2.728%" :gradientTransform="`matrix(0 1 -1.9949 0 .554 -.473)`">
        <stop offset="0%" stop-color="#FFF" />
        <stop offset="100%" :stop-color="tinycolor(themeColor).toRgbString()" stop-opacity="0" />
      </radialGradient>
      <linearGradient :id="uuids[4]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColor).setAlpha(0.5).toRgbString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColor).toRgbString()" stop-opacity="0" />
      </linearGradient>
      <linearGradient :id="uuids[5]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColor).setAlpha(0.5).toRgbString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColor).toRgbString()" stop-opacity="0" />
      </linearGradient>
      <linearGradient :id="uuids[6]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColor).darken(20).setAlpha(0.8).toRgbString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColor).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[7]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" stop-color="#FFF" />
        <stop offset="100%" :stop-color="tinycolor(themeColor).toRgbString()" />
      </linearGradient>
      <rect id="rectShape" width="40" height="40" x="4" y="4" rx="8" />
      <path id="pathShape" d="M24.841 45.308 32.01 56.46a1 1 0 0 1-.842 1.54H16.832a1 1 0 0 1-.842-1.54l7.169-11.152a1 1 0 0 1 1.682 0" />
    </defs>
    <g fill="none" fill-rule="evenodd">
      <g transform="matrix(1 0 0 -1 0 102)">
        <use :xlink:href="`#${uuids[4]}`" fill="url(#c)" />
        <use :xlink:href="`#${uuids[0]}`" fill="url(#d)" />
      </g>
      <rect width="48" height="48" :fill="`url(#${uuids[5]})`" rx="10" />
      <use xlink:href="#rectShape" :fill="`url(#${uuids[6]})`" />
      <rect width="39" height="39" x="4.5" y="4.5" :fill="`url(#${uuids[1]})`" :stroke="`url(#${uuids[7]})`" stroke-linejoin="bevel" rx="8" />
      <rect width="39" height="39" x="4.5" y="4.5" :stroke="`url(#${uuids[2]})`" stroke-linejoin="bevel" rx="8" />
      <rect width="39" height="39" x="4.5" y="4.5" :stroke="`url(#${uuids[3]})`" stroke-linejoin="bevel" rx="8" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
import tinycolor from "tinycolor2";
import { v4 } from "uuid";
const aspectRatio = 48 / 58;
const props = withDefaults(
    defineProps<{
      height?: number
      themeColor?: 'blue' | 'green' | 'grey' | string
    }>(),
    {
      height: 58,
      themeColor: 'blue',
    }
);
const themeColor = computed(() => {
  switch (props.themeColor) {
    case 'blue':
      return '#17A6FF'
    case 'green':
      return '#0FF087'
    case 'grey':
      return '#62789C'
    default:
      return props.themeColor
  }
});
const uuids = Array.from({ length: 8 }, () => v4());
const calculatedWidth = computed(() => aspectRatio * props.height);
</script>