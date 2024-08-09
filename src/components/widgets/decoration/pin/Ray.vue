<template>
  <svg v-once :width="width" :height="height">
    <defs>
      <linearGradient :id="uuids[0]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0.1).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).lighten(30).setAlpha(0).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[1]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0.5).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).lighten(30).setAlpha(0).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[2]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
        <stop offset="100%" :stop-color="themeColorValue" :stop-opacity="0.5" />
      </linearGradient>
      <linearGradient :id="uuids[3]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0.5).toString()" />
        <stop offset="100%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
      </linearGradient>
      <linearGradient :id="uuids[4]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="tinycolor(themeColorValue).setAlpha(0).toString()" />
        <stop offset="100%" :stop-color="themeColorValue" />
      </linearGradient>
    </defs>
    <g fill="none" fill-rule="evenodd">
      <ellipse cx="26" cy="64" :fill="`url(#${uuids[0]})`" :stroke="`url(#${uuids[1]})`" stroke-width=".5" rx="25.75" ry="12.75" />
      <ellipse cx="26" cy="64" :fill="themeColorValue" fill-opacity=".1" :stroke="`url(#${uuids[2]})`" stroke-width=".5" rx="17.75" ry="8.75" />
      <ellipse cx="26" cy="64" :fill="`url(#${uuids[3]})`" :stroke="themeColorValue" stroke-width=".5" rx="9.35" ry="3.75" />
      <rect width="4" height="64" x="24" :fill="`url(#${uuids[4]})`" rx="2" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import tinycolor from "tinycolor2";
import { defineProps, withDefaults, computed } from "vue";
import {v4} from "uuid";
const uuids = [v4(), v4(), v4(), v4(), v4()];
const props = withDefaults(
    defineProps<{
      height: number;
      themeColor: 'blue' | 'green' | 'orange' | string;
    }>(),
    {
      height: 77,
      themeColor: 'blue',
    }
);
const aspectRatio = 52 / 77;
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