<template>
  <svg v-once :width="width" :height="height">
    <defs>
      <linearGradient :id="uuids[0]" x1="50%" x2="50%" y1="100%" y2="0%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).lighten(30).toString()" />
        <stop offset="100%" :stop-color="themeColorValue" />
      </linearGradient>
      <linearGradient :id="uuids[1]" x1="50%" x2="50%" y1="100%" y2="0%">
        <stop offset="0%" stop-color="#FFF" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[2]" x1="50%" x2="50%" y1="100%" y2="0%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).lighten(20).setAlpha(0.5).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).darken(30).setAlpha(0.5).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[3]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="themeColorValue" />
        <stop offset="100%" stop-color="#FFF" />
      </linearGradient>
      <linearGradient :id="uuids[4]" x1="100%" x2="0%" y1="50%" y2="50%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).lighten(10).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[5]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).lighten(20).setAlpha(0).toString()" />
        <stop offset="100%" stop-color="#FFF" />
      </linearGradient>
      <linearGradient :id="uuids[6]" x1="50%" x2="50%" y1="100%" y2="0%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).lighten(10).toString()" />
        <stop offset="100%" stop-color="#FFF" />
      </linearGradient>
      <linearGradient :id="uuids[7]" x1="50%" x2="50%" y1="100%" y2="0%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).lighten(30).toString()" />
        <stop offset="100%" :stop-color="themeColorValue" />
      </linearGradient>
      <linearGradient :id="uuids[8]" x1="100%" x2="0%" y1="50%" y2="50%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
        <stop offset="100%" stop-color="#FFF" />
      </linearGradient>
      <linearGradient :id="uuids[9]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
        <stop offset="100%" :stop-color="themeColorValue" />
      </linearGradient>
      <linearGradient :id="uuids[10]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
        <stop offset="100%" :stop-color="themeColorValue" />
      </linearGradient>
      <linearGradient :id="uuids[11]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="themeColorValue" stop-opacity="0" />
        <stop offset="100%" :stop-color="themeColorValue" stop-opacity="0.3" />
      </linearGradient>
      <linearGradient :id="uuids[12]" x1="47.642%" x2="47.642%" y1="13.006%" y2="93.902%">
        <stop offset="0%" :stop-color="themeColorValue" stop-opacity="0" />
        <stop offset="100%" :stop-color="themeColorValue" />
      </linearGradient>
      <linearGradient :id="uuids[13]" x1="50%" x2="50%" y1="37.388%" y2="100%">
        <stop offset="0%" :stop-color="themeColorValue" stop-opacity="0" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).setAlpha(0.5).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[14]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" stop-color="#FFF" />
        <stop offset="100%" :stop-color="themeColorValue" />
      </linearGradient>
      <linearGradient :id="uuids[15]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
        <stop offset="53.1%" :stop-color="tinycolor(themeColorValue).lighten(20).toString()" />
        <stop offset="100%" :stop-color="themeColorValue" />
      </linearGradient>
      <radialGradient :id="uuids[16]" cx="47.737%" cy="92.431%" r="44.753%" fx="47.737%" fy="92.431%" gradientTransform="matrix(0 .7418 -1 0 1.402 .57)">
        <stop offset="0%" stop-color="#FFF" stop-opacity="0.5" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
      </radialGradient>
      <radialGradient :id="uuids[17]" cx="45.737%" cy="91.683%" r="45.069%" fx="45.737%" fy="91.683%" gradientTransform="matrix(0 .7367 -.6041 0 1.011 .58)">
        <stop offset="0%" stop-color="#FFF" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).lighten(20).setAlpha(0).toString()" />
      </radialGradient>
      <path :id="uuids[18]" d="m5.73 7.973 13.712 5.136L37 2.346 20.52 44.498z" />
      <path :id="uuids[19]" d="m11.744 13.843 9.62 3.795 11.544-7.654-11.543 28.73z" />
      <ellipse :id="uuids[20]" cx="21.173" cy="6.976" rx="5.612" ry="2.386" />
      <filter :id="uuids[21]" width="438.5%" height="896.5%" x="-169.3%" y="-356.3%" filterUnits="objectBoundingBox">
        <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="6" />
        <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1" />
        <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 1 0 0 0 0 0.7 0 0 0 0 0.5 0 0 0 0.813414247 0" />
      </filter>
    </defs>
    <g fill="none" fill-rule="evenodd">
      <path :fill="`url(#${uuids[0]})`" :stroke="`url(#${uuids[1]})`" stroke-width=".6" d="M.61 5.373 5.49 8.18l14.497 35.8-4.182-1.548z" transform="translate(2.126)" />
      <g transform="translate(2.126)">
        <use :xlink:href="`#${uuids[18]}`" :fill="`url(#${uuids[2]})`" />
        <path :fill="`url(#${uuids[16]})`" :stroke="`url(#${uuids[3]})`" stroke-linejoin="bevel" stroke-width=".6" d="m36.395 3.068-15.88 40.619L6.266 8.493l13.21 4.948z" />
      </g>
      <g transform="translate(2.126)">
        <use :xlink:href="`#${uuids[19]}`" :fill="`url(#${uuids[4]})`" />
        <path :fill="`url(#${uuids[17]})`" :stroke="`url(#${uuids[5]})`" stroke-linejoin="bevel" stroke-width=".6" d="m32.27 10.767-10.9 27.129-9.099-23.523 9.13 3.602z" />
      </g>
      <path :fill="`url(#${uuids[6]})`" d="m0 4.676 5.73 3.297 13.712 5.133-3.494-2.935z" transform="translate(2.126)" />
      <path :fill="`url(#${uuids[7]})`" :stroke="`url(#${uuids[8]})`" stroke-width=".6" d="m32.54.345 3.853 2.021-16.923 10.37-3.01-2.527z" transform="translate(2.126)" />
      <g transform="translate(0 45.422)">
        <ellipse cx="21.173" cy="9" :stroke="`url(#${uuids[9]})`" stroke-width=".6" opacity=".3" rx="15.176" ry="6.278" />
        <ellipse cx="21.173" cy="10" :stroke="`url(#${uuids[10]})`" stroke-width=".6" opacity=".3" rx="20.873" ry="9.7" />
        <ellipse cx="21.173" cy="7.804" :fill="`url(#${uuids[11]})`" :stroke="`url(#${uuids[12]})`" stroke-width=".6" rx="10.755" ry="4.399" />
        <use :xlink:href="`#${uuids[20]}`" fill="#000" :filter="`url(#${uuids[21]})`" />
        <ellipse cx="21.173" cy="6.976" :fill="`url(#${uuids[13]})`" :stroke="`url(#${uuids[14]})`" stroke-linejoin="bevel" stroke-width=".6" rx="5.312" ry="2.086" />
        <ellipse cx="21.498" cy="4.906" :fill="`url(#${uuids[15]})`" rx="3.571" ry="1.518" />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import tinycolor from "tinycolor2";
import { defineProps, withDefaults, computed } from "vue";
import { v4 } from "uuid";

const uuids = Array.from({ length: 22 }, () => v4());

const props = withDefaults(
    defineProps<{
      height: number;
      themeColor: 'blue' | 'green' | 'orange' | string;
    }>(),
    {
      height: 65.422,
      themeColor: 'blue',
    }
);
const aspectRatio = 42.347 / 65.422;
const width = computed(() => props.height * aspectRatio);
const themeColorValue = computed(() => {
  switch (props.themeColor) {
    case 'blue':
      return '#46ABFF';
    case 'green':
      return '#0FF087';
    case 'orange':
      return '#FC6C0F';
    default:
      return props.themeColor;
  }
});
</script>