<template>
  <svg v-once :width="width" :height="height">
    <defs>
      <linearGradient :id="uuids[0]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).darken(30).setAlpha(0).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).setAlpha(0.3).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[1]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0.3).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).setAlpha(0.1).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[2]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0.3).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).setAlpha(0.1).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[3]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="themeColorValue" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).lighten(10).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[4]" x1="50%" x2="50%" y1="28.419%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).setAlpha(1).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[5]" x1="50%" x2="50%" y1="28.419%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).setAlpha(0.6).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[6]" x1="50%" x2="50%" y1="28.419%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).setAlpha(0.4).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[7]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).lighten(30).setAlpha(0).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).lighten(20).toString()" />
      </linearGradient>
      <radialGradient :id="uuids[8]" cx="92.23%" cy="72.295%" r="126.314%" fx="92.23%" fy="72.295%" gradientTransform="matrix(-.47993 .2805 -.08263 -.56555 1.425 .873)">
        <stop offset="0%" stop-color="#FFF" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
      </radialGradient>
      <radialGradient :id="uuids[9]" cx="4.601%" cy="60.888%" r="66.017%" fx="4.601%" fy="60.888%" gradientTransform="matrix(.28199 .82579 -.24328 .3323 .181 .369)">
        <stop offset="0%" stop-color="#FFF" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
      </radialGradient>
      <filter :id="uuids[10]" width="124.7%" height="144.4%" x="-12.3%" y="-22.2%" filterUnits="objectBoundingBox">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
      </filter>
      <filter :id="uuids[11]" width="200%" height="300%" x="-50%" y="-100%" filterUnits="objectBoundingBox">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
      </filter>
    </defs>
    <g fill="none" fill-rule="evenodd">
      <path :fill="`url(#${uuids[0]})`" d="M48.6 0c11.598 0 21 4.701 21 10.5v.05l-.001 79.4.001.05c0 5.732-9.185 10.39-20.596 10.498l-.404.002c-11.598 0-21-4.701-21-10.5V10.5l.004-.202C27.819 4.592 37.137 0 48.6 0" />
      <ellipse cx="48.6" cy="93" :fill="tinycolor(themeColorValue).setAlpha(0.1).toString()" :stroke="tinycolor(themeColorValue).lighten(20).setAlpha(0.1).toString()" :filter="`url(#${uuids[10]})`" rx="48.1" ry="26.5" />
      <ellipse cx="48.6" cy="90" :fill="tinycolor(themeColorValue).setAlpha(0.1).toString()" :stroke="tinycolor(themeColorValue).setAlpha(0.1).toString()" rx="38.5" ry="19" />
      <g stroke-linejoin="bevel" stroke-width="2">
        <ellipse cx="48.6" cy="90" :fill="tinycolor(themeColorValue).setAlpha(0.3).toString()" :stroke="themeColorValue" rx="20" ry="9.5" />
        <ellipse cx="48.6" cy="90" :stroke="tinycolor(themeColorValue).lighten(10).toString()" rx="20" ry="9.5" />
        <ellipse cx="48.6" cy="90" :stroke="tinycolor(themeColorValue).lighten(20).toString()" rx="20" ry="9.5" />
      </g>
      <ellipse cx="48.6" cy="78" :stroke="tinycolor(themeColorValue).setAlpha(1).toString()" stroke-width="2" rx="20" ry="9.5" />
      <ellipse cx="48.6" cy="65.25" :stroke="tinycolor(themeColorValue).setAlpha(0.6).toString()" stroke-width="2" rx="18.5" ry="8.75" />
      <ellipse cx="48.6" cy="52.5" :stroke="tinycolor(themeColorValue).setAlpha(0.4).toString()" stroke-width="2" rx="17" ry="8" />
      <ellipse cx="48.6" cy="90" :fill="tinycolor(themeColorValue).lighten(10).toString()" :filter="`url(#${uuids[11]})`" rx="12" ry="6" />
      <path :stroke="tinycolor(themeColorValue).lighten(30).toString()" stroke-linecap="round" d="M48.6 11.876v78" />
      <ellipse cx="48.6" cy="90" fill="#FFF" rx="3" ry="1.5" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import tinycolor from "tinycolor2";
import { defineProps, withDefaults, computed } from "vue";
import { v4 } from "uuid";

const uuids = Array.from({ length: 12 }, () => v4());

const props = withDefaults(
    defineProps<{
      height: number;
      themeColor: 'blue' | 'green' | 'orange' | string;
    }>(),
    {
      height: 120,
      themeColor: 'blue',
    }
);

const aspectRatio = 97.2 / 120;
const width = computed(() => props.height * aspectRatio);
const themeColorValue = computed(() => {
  switch (props.themeColor) {
    case 'blue':
      return '#46ABFF';
    case 'green':
      return '#0FF087';
    case 'orange':
      return '#FFAD14';
    default:
      return props.themeColor;
  }
});
</script>