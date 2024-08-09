<template>
  <svg
      :width="calculatedWidth" :height="height" v-once
      viewBox="0 0 80 91.098"
  >
    <defs>
      <linearGradient :id="uuids[0]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).setAlpha(0.5).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[1]" x1="50%" x2="50%" y1="50%" y2="119.75%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).lighten(10).setAlpha(0.026).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(30).setAlpha(0.5).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[2]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).darken(10).setAlpha(0).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(20).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[3]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).darken(20).setAlpha(0).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(20).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[4]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(20).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[5]" x1="50%" x2="50%" y1="0%" y2="84.299%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).lighten(10).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(20).setAlpha(0).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[6]" x1="50.007%" x2="50.007%" y1="100%" y2="0%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0.2).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(20).setAlpha(0.1).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[7]" x1="50.007%" x2="50.007%" y1="100%" y2="0%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0.5).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(20).setAlpha(0).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[8]" x1="50%" x2="50%" y1="0%" y2="96.51%">
        <stop :offset="0" stop-color="#FFF" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[9]" x1="50.736%" x2="50.736%" y1="99.264%" y2=".736%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).lighten(20).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).darken(20).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[10]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).lighten(20).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).darken(10).setAlpha(0).toRgbString()" />
      </linearGradient>
      <radialGradient :id="uuids[11]" cx="50%" cy="0%" r="31.925%" fx="50%" fy="0%" gradientTransform="matrix(0 1 -.85056 0 .5 -.5)">
        <stop :offset="0" :stop-color="tinycolor(themeColor).brighten(20).setAlpha(0.5).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).darken(30).setAlpha(0).toRgbString()" />
      </radialGradient>
      <filter :id="uuids[12]" width="129.4%" height="161.7%" x="-14.7%" y="-30.8%" filterUnits="objectBoundingBox">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
      </filter>
      <path :id="uuids[13]" d="M40 5.903 75.045 51.84 70.87 64.503H9.974l-5.02-12.662z" />
    </defs>
    <g fill="none" fill-rule="evenodd">
      <ellipse cx="39.585" cy="74.882" :stroke="`url(#${uuids[0]})`" stroke-width=".5" rx="33.804" ry="15.966" />
      <ellipse cx="39.585" cy="72.882" :fill="`url(#${uuids[1]})`" :stroke="`url(#${uuids[2]})`" rx="19.932" ry="9.23" />
      <ellipse cx="39.585" cy="66.882" :stroke="`url(#${uuids[3]})`" stroke-width=".5" rx="16.55" ry="7.75" />
      <ellipse cx="39.585" cy="79.368" :stroke="`url(#${uuids[4]})`" :filter="`url(#${uuids[12]})`" rx="19.932" ry="9.23" />
      <path :fill="`url(#${uuids[5]})`" d="M39.585 57.21q-4.983 14.758-15.541 17.878c-.116.265 31.183.018 31.083 0Q44.118 71.345 39.585 57.21" />
      <path :fill="`url(#${uuids[6]})`" d="m40 0 40 48.913-7.405 20.613H8.369L0 48.913z" transform="matrix(1 0 0 -1 0 69.526)" />
      <g transform="matrix(1 0 0 -1 0 70.406)">
        <use :xlink:href="`#${uuids[13]}`" :fill="`url(#${uuids[7]})`" />
        <path :fill="`url(#${uuids[11]})`" :stroke="`url(#${uuids[8]})`" stroke-linejoin="bevel" d="m40 6.727 34.488 45.208-3.98 12.068H10.314L5.523 51.92z" />
      </g>
      <path :fill="`url(#${uuids[9]})`" fill-rule="nonzero" d="M9.987 5.069h60.899l4.33 13.663H72.45L69.01 7.561H11.771L7.503 18.732l-2.693-.058z" />
      <path :stroke="`url(#${uuids[10]})`" stroke-width=".5" d="m5.32 18.935 2.056.045L40 62.067l32.573-43.085h2.142L40 65.068z" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
import tinycolor from "tinycolor2";
import { v4 } from "uuid";
const aspectRatio = 80 / 91.098;
const props = withDefaults(
    defineProps<{
      height?: number
      themeColor?: 'blue' | 'green' | 'orange' | string
    }>(),
    {
      height: 91.098,
      themeColor: 'blue',
    }
);
const themeColor = computed(() => {
  switch (props.themeColor) {
    case 'blue':
      return '#00ABFF'
    case 'green':
      return '#1ACC83'
    case 'orange':
      return '#EF7911'
    default:
      return props.themeColor
  }
});
const uuids = Array.from({ length: 14 }, () => v4());
const calculatedWidth = computed(() => aspectRatio * props.height);
</script>