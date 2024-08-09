<template>
  <svg
      :width="calculatedWidth" :height="height" v-once
      viewBox="0 0 73.469 120"
  >
    <defs>
      <linearGradient :id="uuids[0]" x1="50.007%" x2="50.007%" y1="100%" y2=".268%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0.5).toRgbString()" stop-opacity=".5" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).setAlpha(0.5).toRgbString()" stop-opacity="0" />
      </linearGradient>
      <linearGradient :id="uuids[1]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop :offset="0" :stop-color="themeColor" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[2]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop :offset="0" :stop-color="themeColor" />
        <stop :offset="1" stop-color="#FFF" />
      </linearGradient>
      <linearGradient :id="uuids[3]" x1="50.007%" x2="50.007%" y1="100%" y2="0%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0.5).toRgbString()" stop-opacity=".5" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).setAlpha(0.5).toRgbString()" stop-opacity="0" />
      </linearGradient>
      <linearGradient :id="uuids[4]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop :offset="0" :stop-color="themeColor" />
        <stop :offset="1" stop-color="#FFF" />
      </linearGradient>
      <linearGradient :id="uuids[5]" x1="50.007%" x2="50%" y1="66.056%" y2="40.374%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0.5).toRgbString()" stop-opacity=".5" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[6]" x1="50%" x2="50%" y1="3.642%" y2="24.712%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).darken(20).setAlpha(0.5).toRgbString()" stop-opacity=".5" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).darken(20).setAlpha(0).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[7]" x1="50%" x2="50%" y1="36.186%" y2="100%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).lighten(40).setAlpha(0).toRgbString()" />
        <stop :offset="1" stop-color="#FCFFFE" />
      </linearGradient>
      <linearGradient :id="uuids[8]" x1="50%" x2="50%" y1=".187%" y2="100%">
        <stop :offset="0" :stop-color="tinycolor(themeColor).brighten(20).setAlpha(0).toRgbString()" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).brighten(20).setAlpha(0.6).toRgbString()" />
      </linearGradient>
      <linearGradient :id="uuids[9]" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop :offset="0" :stop-color="themeColor" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()" />
      </linearGradient>
      <path id="d" d="M64.711 53.089v-32.52L36.64 4.303 8.574 20.568v32.52L36.64 69.346z" />
      <path id="i" d="m36.735 58.776 36.734-20.817v19.592L36.735 78.367 0 57.551V37.959z" />
      <radialGradient :id="uuids[10]" cx="50%" cy="100%" r="28.88%" fx="50%" fy="100%" gradientTransform="matrix(0 .8631 -2.3274 0 2.827 .568)">
        <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0.5).toRgbString()" stop-opacity=".5" />
        <stop :offset="1" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()" />
      </radialGradient>
      <filter :id="uuids[11]" width="104.1%" height="104.3%" x="-2%" y="-.7%" filterUnits="objectBoundingBox">
        <feGaussianBlur in="SourceAlpha" result="shadowBlurInner1" stdDeviation="1" />
        <feOffset dy="1" in="shadowBlurInner1" result="shadowOffsetInner1" />
        <feComposite in="shadowOffsetInner1" in2="SourceAlpha" k2="-1" k3="1" operator="arithmetic" result="shadowInnerInner1" />
        <feColorMatrix
            in="shadowInnerInner1"
            :values="tinycolor(themeColor).toHsl().l > 0.5
            ? '0 0 0 0 0.921568627 0 0 0 0 0.352941176 0 0 0 0 0.352941176 0 0 0 0.2 0'
            : '0 0 0 0 0.164705882 0 0 0 0 0.454901961 0 0 0 0 1 0 0 0 0.2 0'"
        />
      </filter>
    </defs>
    <g fill="none" fill-rule="evenodd">
      <path :fill="`url(#${uuids[0]})`" d="M68.571 55.333V18.444L36.731 0 4.898 18.444v36.889l31.833 18.444z" />
      <path :fill="themeColor" fill-rule="nonzero" d="m36.739 0-.36.21-1.01.628-1.571.839-2.039 1.207-2.406 1.392-2.69 1.593-2.874 1.676-2.975 1.677-2.966 1.719-2.874 1.677-2.69 1.55L9.91 15.56l-2.072 1.207-1.57.88-1.012.588-.359.21v30.18h.418V18.688L36.948.361zM6.569 55.81l-.226.361L36.74 73.777l.677-.394.108-.067.084-.05h.133l.084-.05h.226l26.167-15.368-.208-.36L36.739 73.29zm33.06-54.133-.208.36 28.733 16.65V51.98h.417V18.444z" />
      <path :fill="`url(#${uuids[1]})`" d="M35.51 80.816h2.449V120H35.51z" />
      <path :fill="`url(#${uuids[2]})`" d="m36.921 77.143 5.085 6.122h-10.17z" />
      <use :fill="`url(#${uuids[3]})`" />
      <path :fill="`url(#${uuids[10]})`" :stroke="`url(#${uuids[4]})`" stroke-linejoin="bevel" d="M36.639 4.882 64.21 20.856V52.8L36.64 68.767 9.074 52.8V20.856z" />
      <g style="mix-blend-mode:screen">
        <use :fill="`url(#${uuids[5]})`" />
        <use :fill="`url(#${uuids[6]})`" />
        <use fill="#000" :filter="`url(#${uuids[11]})`" />
        <path :stroke="`url(#${uuids[7]})`" stroke-linejoin="bevel" stroke-width=".5" d="M73.22 38.388v19.017L36.734 78.08.25 57.405V38.388l36.485 20.675z" />
      </g>
      <path :fill="`url(#${uuids[8]})`" d="m37.04 72.888 16.838-9.808h8.571L37.041 77.791l-25.408-14.71h8.571z" />
      <path :fill="`url(#${uuids[9]})`" d="m37.046 69.473 7.64 4.455h-15.28z" transform="matrix(1 0 0 -1 0 143.4)" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
import tinycolor from "tinycolor2";
import { v4 } from "uuid";
const aspectRatio = 73.469 / 120;
const props = withDefaults(
    defineProps<{
      height?: number
      themeColor?: 'blue' | 'red' | 'green' | string
    }>(),
    {
      height: 120,
      themeColor: 'blue',
    }
);
const themeColor = computed(() => {
  switch (props.themeColor) {
    case 'blue':
      return '#46ABFF'
    case 'red':
      return '#EB5A5A'
    case 'green':
      return '#1ACC83'
    default:
      return props.themeColor
  }
});
const uuids = Array.from({ length: 12 }, () => v4());
const calculatedWidth = computed(() => aspectRatio * props.height);
</script>