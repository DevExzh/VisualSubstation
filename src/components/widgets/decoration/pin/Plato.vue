<template>
  <svg v-once :width="width" :height="height">
    <defs>
      <linearGradient :id="uuids[0]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).lighten(20).toString()" />
        <stop offset="100%" stop-color="#FFF" />
      </linearGradient>
      <linearGradient :id="uuids[1]" x1="50%" x2="50%" y1="100%" y2="0%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).lighten(15).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).darken(20).toString()" stop-opacity="0.9" />
      </linearGradient>
      <linearGradient :id="uuids[2]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).lighten(10).toString()" />
        <stop offset="100%" stop-color="#FFF" />
      </linearGradient>
      <linearGradient :id="uuids[3]" x1="50%" x2="50%" y1="100%" y2="0%">
        <stop offset="0%" :stop-color="themeColorValue" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).darken(30).spin(30).toString()" stop-opacity="0.9" />
      </linearGradient>
      <linearGradient :id="uuids[4]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).lighten(5).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).lighten(40).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[5]" x1="50%" x2="50%" y1="100%" y2="0%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).lighten(10).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).spin(-20).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[6]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).lighten(5).toString()" />
        <stop offset="100%" stop-color="#FFF" />
      </linearGradient>
      <radialGradient :id="uuids[7]" cx="50%" cy="100%" r="55.483%" fx="50%" fy="100%" gradientTransform="matrix(0 1 -1.2225 0 1.723 .5)">
        <stop offset="0%" stop-color="#FFF" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).lighten(50).toString()" stop-opacity="0" />
      </radialGradient>
      <path :id="uuids[8]" d="M19.58 0 0 9.63l19.447 9.371 19.798-9.37z" />
    </defs>
    <g fill="none" fill-rule="evenodd">
      <path :fill="themeColorValue" fill-opacity="0.1" d="M41.509 21C18.582 21 0 32.193 0 45.994 0 59.806 18.582 71 41.509 71 64.419 71 83 59.806 83 45.994 83 32.193 64.418 21 41.509 21"/>
      <path :fill="themeColorValue" fill-opacity="0.3" d="M41.005 31C27.746 31 17 37.492 17 45.497 17 53.507 27.746 60 41.005 60 54.254 60 65 53.507 65 45.497 65 37.492 54.254 31 41.005 31"/>
      <path :fill="themeColorValue" fill-opacity="0.6" :stroke="themeColorValue" d="M41.002 39C34.925 39 30 41.91 30 45.498 30 49.09 34.925 52 41.002 52 47.075 52 52 49.09 52 45.498 52 41.91 47.075 39 41.002 39"/>
      <path :fill="`url(#${uuids[0]})`" d="M41.5 22c-2.485 0-4.5 1.12-4.5 2.5s2.015 2.5 4.5 2.5 4.5-1.12 4.5-2.5-2.015-2.5-4.5-2.5" transform="translate(0 21)"/>
      <g stroke-linejoin="round">
        <path :fill="`url(#${uuids[1]})`" :stroke="`url(#${uuids[2]})`" stroke-width=".5" d="m0 9.63 19.623 34.717V19.008z" transform="translate(21.667)"/>
        <path :fill="`url(#${uuids[3]})`" :stroke="`url(#${uuids[4]})`" stroke-width=".5" d="m19.623 9.63 19.622 34.717V19.008z" transform="matrix(-1 0 0 1 80.535 0)"/>
        <g transform="translate(21.667)">
          <use :xlink:href="`#${uuids[8]}`" :fill="`url(#${uuids[5]})`"/>
          <use :xlink:href="`#${uuids[8]}`" :fill="`url(#${uuids[7]})`" :stroke="`url(#${uuids[6]})`" stroke-width=".5"/>
        </g>
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import tinycolor from "tinycolor2";
import { defineProps, withDefaults, computed } from "vue";
import { v4 } from "uuid";

const uuids = Array.from({ length: 9 }, () => v4());

const props = withDefaults(
    defineProps<{
      height?: number;
      themeColor?: 'blue' | 'green' | 'orange' | string;
    }>(),
    {
      height: 71,
      themeColor: 'blue',
    }
);
const aspectRatio = 82.677 / 71;
const width = computed(() => props.height * aspectRatio);
const themeColorValue = computed(() => {
  switch (props.themeColor) {
    case 'blue':
      return '#46ABFF';
    case 'green':
      return '#6BFFB0';
    case 'orange':
      return '#FFBF63';
    default:
      return props.themeColor;
  }
});
</script>