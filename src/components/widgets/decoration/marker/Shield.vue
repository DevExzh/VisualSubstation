<template>
  <svg
      :width="calculatedWidth" :height="height" v-once
      viewBox="0 0 56.066 68"
  >
    <defs>
      <linearGradient :id="uuids[0]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0.227).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(30).setAlpha(0).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[1]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).setAlpha(0.5).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[2]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).setAlpha(0.5).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[3]" x1="50%" x2="50%" y1="32.35%" y2="100%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[4]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).brighten(10).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(50).setAlpha(0).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[5]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).setAlpha(0.3).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[6]" x1="50%" x2="50%" y1="12.509%" y2="100%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).lighten(20).setAlpha(0).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(20).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[7]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).darken(10).setAlpha(0.8).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(50).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[8]" x1="50%" x2="50%" y1="12.509%" y2="100%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).lighten(30).setAlpha(0).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(30).toRgbString()" />
      </linearGradient>
      <radialGradient :id="uuids[9]" cx="50%" cy="97.912%" r="33.03%" fx="50%" fy="97.912%" gradientTransform="matrix(0 .9344 -1.7223 0 2.186 .512)">
        <stop :offset="0" :stop-color="tinycolor(themeColor).brighten(10).setAlpha(0.4).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(30).setAlpha(0).toRgbString()" />
      </radialGradient>
      <radialGradient :id="uuids[10]" cx="50%" cy="97.912%" r="44.268%" fx="50%" fy="97.912%" gradientTransform="matrix(0 .8958 -1.7223 0 2.186 .531)">
        <stop :offset="0" :stop-color="tinycolor(themeColor).lighten(50).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(70).setAlpha(0).toRgbString()" />
      </radialGradient>
      <path :id="uuids[12]" d="M4 0h48.066a4 4 0 0 1 4 4v38.238a4 4 0 0 1-2.075 3.506L28.033 60 2.074 45.744A4 4 0 0 1 0 42.238V4a4 4 0 0 1 4-4" />
      <path :id="uuids[13]" d="M10.885 3.934H45.18a4 4 0 0 1 4 4V36.68a4 4 0 0 1-2.006 3.468l-19.141 11-19.141-11a4 4 0 0 1-2.007-3.468V7.934a4 4 0 0 1 4-4" />
      <filter :id="uuids[11]" width="181.8%" height="400%" x="-40.9%" y="-150%" filterUnits="objectBoundingBox">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
      </filter>
    </defs>
    <g fill="none" fill-rule="evenodd">
      <g transform="translate(7 54)">
        <ellipse cx="20" cy="7" :fill="`url(#${uuids[0]})`" :stroke="`url(#${uuids[1]})`" stroke-width=".5" rx="19.75" ry="6.75" />
        <ellipse cx="21" cy="7" :fill="`url(#${uuids[2]})`" :stroke="`url(#${uuids[3]})`" stroke-width=".5" rx="10.75" ry="2.75" />
        <ellipse cx="21" cy="7" :fill="`url(#${uuids[4]})`" :filter="`url(#${uuids[11]})`" rx="3.667" ry="1" />
      </g>
      <use :xlink:href="`#${uuids[12]}`" :fill="`url(#${uuids[5]})`" />
      <path :fill="`url(#${uuids[9]})`" :stroke="`url(#${uuids[6]})`" stroke-linejoin="bevel" d="M52.066.5c.966 0 1.841.392 2.474 1.025A3.5 3.5 0 0 1 55.566 4v38.238a3.5 3.5 0 0 1-1.816 3.067L28.033 59.43 2.315 45.305A3.5 3.5 0 0 1 .5 42.238V4c0-.966.392-1.841 1.025-2.475A3.5 3.5 0 0 1 4 .5z" />
      <use :xlink:href="`#${uuids[13]}`" :fill="`url(#${uuids[7]})`" />
      <path :fill="`url(#${uuids[10]})`" :stroke="`url(#${uuids[8]})`" stroke-linejoin="bevel" d="M45.18 4.434c.967 0 1.842.392 2.475 1.026a3.5 3.5 0 0 1 1.025 2.474V36.68a3.5 3.5 0 0 1-1.756 3.034L28.033 50.571 9.14 39.713a3.5 3.5 0 0 1-1.756-3.034V7.934c0-.966.392-1.841 1.025-2.474a3.5 3.5 0 0 1 2.475-1.026Z" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
import tinycolor from "tinycolor2";
import { v4 } from "uuid";
const aspectRatio = 56.066 / 68;
const props = withDefaults(
    defineProps<{
      height?: number
      themeColor?: 'blue' | 'green' | 'purple' | string
    }>(),
    {
      height: 68,
      themeColor: 'blue',
    }
);
const themeColor = computed(() => {
  switch (props.themeColor) {
    case 'blue':
      return '#46ABFF'
    case 'green':
      return '#0FF087'
    case 'purple':
      return '#6234FF'
    default:
      return props.themeColor
  }
});
const uuids = Array.from({ length: 14 }, () => v4());
const calculatedWidth = computed(() => aspectRatio * props.height);
</script>