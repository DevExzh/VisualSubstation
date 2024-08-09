<template>
  <svg v-once :width="width" :height="height">
    <defs>
      <linearGradient :id="uuids[0]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).setAlpha(0.5).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[1]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0.5).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[2]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="themeColorValue" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).lighten(30).toString()" />
      </linearGradient>
      <radialGradient :id="uuids[3]" cx="50%" cy="97.912%" r="42.423%" fx="50%" fy="97.912%" gradientTransform="matrix(0 .7685 -1 0 1.48 .595)">
        <stop offset="0%" stop-color="#FFF" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).lighten(20).setAlpha(0).toString()" />
      </radialGradient>
      <filter :id="uuids[4]" width="109.7%" height="107.4%" x="-4.8%" y="-3.7%" filterUnits="objectBoundingBox">
        <feGaussianBlur in="SourceAlpha" result="shadowBlurInner1" stdDeviation="1.5" />
        <feOffset dy="1" in="shadowBlurInner1" result="shadowOffsetInner1" />
        <feComposite in="shadowOffsetInner1" in2="SourceAlpha" k2="-1" k3="1" operator="arithmetic" result="shadowInnerInner1" />
        <feColorMatrix in="shadowInnerInner1" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
      </filter>
      <path :id="uuids[5]" d="M20.708 53.895c-.644 0-1-.078-1.226-.343-.136-.16-13.822-16.404-17.47-24.27C.696 26.464 0 23.404 0 20.418 0 9.157 9.29 0 20.708 0c11.419 0 20.708 9.22 20.708 20.55 0 3.424-.642 6.01-2.214 8.927-4.349 8.058-17.122 23.885-17.25 24.043-.152.19-.424.375-1.212.375zm0-41.355c-4.391 0-7.965 3.574-7.965 7.965s3.574 7.965 7.965 7.965 7.965-3.574 7.965-7.965-3.574-7.965-7.965-7.965" />
    </defs>
    <g fill="none" fill-rule="evenodd">
      <!-- Ellipse and Path Definitions -->
      <ellipse cx="20.211" cy="53.895" :fill="tinycolor(themeColorValue).setAlpha(0.1).toString()" :stroke="tinycolor(themeColorValue).setAlpha(0.5).toString()" stroke-width=".5" rx="19.961" ry="9.855" />
      <ellipse cx="20.884" cy="53.895" :fill="`url(#${uuids[1]})`" :stroke="themeColorValue" stroke-width=".5" rx="10.529" ry="4.241" />
      <g fill-rule="nonzero">
        <use :xlink:href="`#${uuids[5]}`" :fill="`url(#${uuids[2]})`" />
        <use :xlink:href="`#${uuids[5]}`" :fill="`url(#${uuids[3]})`" />
        <use :xlink:href="`#${uuids[5]}`" fill="#000" :filter="`url(#${uuids[4]})`" />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import tinycolor from "tinycolor2";
import { defineProps, withDefaults, computed } from "vue";
import { v4 } from "uuid";

const uuids = Array.from({ length: 6 }, () => v4());

const props = withDefaults(
    defineProps<{
      height: number;
      themeColor: 'blue' | 'green' | 'red' | string;
    }>(),
    {
      height: 64,
      themeColor: 'blue',
    }
);
const aspectRatio = 41.416 / 64;
const width = computed(() => props.height * aspectRatio);
const themeColorValue = computed(() => {
  switch (props.themeColor) {
    case 'blue':
      return '#46ABFF';
    case 'green':
      return '#0FF087';
    case 'red':
      return '#EB5555';
    default:
      return props.themeColor;
  }
});
</script>