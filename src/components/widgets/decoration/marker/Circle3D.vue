<template>
  <div :style="{
    width: calculatedWidth, height: $props.height
  }" class="wrapper">
    <div v-if="$slots.default" :style="{
            width: calculatedWidth * 0.525 + 'px',
            height: calculatedWidth * 0.525 + 'px',
         }"
         class="icon-slot"
    >
      <slot/>
    </div>
    <svg
        v-once :height="height" :width="calculatedWidth"
        viewBox="0 0 60 121"
    >
      <defs>
        <linearGradient :id="uuids[0]" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).lighten(20).toRgbString()"/>
          <stop :offset="1" stop-color="#FFF"/>
        </linearGradient>
        <linearGradient :id="uuids[1]" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()"/>
          <stop :offset="0.48" :stop-color="tinycolor(themeColor).lighten(10).setAlpha(0.132).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(30).setAlpha(0.564).toRgbString()"/>
        </linearGradient>
        <linearGradient :id="uuids[2]" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop :offset="0" stop-color="#FFF"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).lighten(30).toRgbString()"/>
        </linearGradient>
        <linearGradient :id="uuids[3]" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0).toRgbString()"/>
          <stop :offset="0.58593" :stop-color="tinycolor(themeColor).lighten(50).toRgbString()"/>
          <stop :offset="1" stop-color="#FFF"/>
        </linearGradient>
        <linearGradient :id="uuids[4]" x1="30.75%" x2="75.823%" y1="5.823%" y2="90.671%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0.2).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).darken(30).setAlpha(0).toRgbString()"/>
        </linearGradient>
        <linearGradient :id="uuids[5]" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).brighten(20).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).darken(20).setAlpha(0.503).toRgbString()"/>
        </linearGradient>
        <linearGradient :id="uuids[6]" x1="50%" x2="50%" y1="3.206%" y2="99.27%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).lighten(20).setAlpha(0.8).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).darken(10).setAlpha(0.8).toRgbString()"/>
        </linearGradient>
        <linearGradient :id="uuids[7]" x1="22.926%" x2="84.087%" y1="9.401%" y2="87.169%">
          <stop :offset="0" stop-color="#FFF"/>
          <stop :offset="1" stop-color="#FFF" stop-opacity="0"/>
        </linearGradient>
        <linearGradient :id="uuids[8]" x1="24.129%" x2="88.049%" y1="11.046%" y2="76.229%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).lighten(30).setAlpha(0.3).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).darken(40).setAlpha(0).toRgbString()"/>
        </linearGradient>
        <linearGradient :id="uuids[9]" x1="15.824%" x2="85.408%" y1="5.878%" y2="90.288%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).lighten(10).setAlpha(0.295).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).darken(20).setAlpha(0).toRgbString()"/>
        </linearGradient>
        <radialGradient :id="uuids[10]" cx="83.737%" cy="86.242%" fx="83.737%" fy="86.242%" r="58.353%">
          <stop :offset="0" :stop-color="tinycolor(themeColor).setAlpha(0.265).toRgbString()"/>
          <stop :offset="1" :stop-color="tinycolor(themeColor).darken(50).setAlpha(0).toRgbString()"/>
        </radialGradient>
        <circle :id="uuids[11]" cx="30" cy="30" r="26.25"/>
        <path :id="uuids[12]" d="M14 61c7.732 0 14-3.134 14-7s-6.268-7-14-7-14 3.134-14 7 6.268 7 14 7"/>
        <mask :id="uuids[13]" fill="#fff" height="14" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox"
              width="28" x="0" y="0">
          <use :xlink:href="`#${uuids[12]}`"/>
        </mask>
      </defs>
      <g fill="none" fill-rule="evenodd">
        <g transform="translate(16 60)">
          <use :mask="`url(#${uuids[13]})`" :stroke="`url(#${uuids[0]})`" :xlink:href="`#${uuids[12]}`"
               stroke-dasharray="12,9" stroke-width="2"/>
          <path :fill="`url(#${uuids[1]})`" d="M8 0h12v54c0 1.657-2.686 3-6 3s-6-1.343-6-3z"/>
          <ellipse :fill="`url(#${uuids[2]})`" cx="14" cy="54" rx="6" ry="3"/>
          <path :fill="`url(#${uuids[3]})`" d="M14 0a1 1 0 0 1 1 1v52a1 1 0 0 1-2 0V1a1 1 0 0 1 1-1"/>
        </g>
        <circle :fill="`url(#${uuids[4]})`" :stroke="`url(#${uuids[5]})`" cx="30" cy="30" r="29.75" stroke-width=".5"/>
        <path
            :fill="`url(#${uuids[6]})`"
            :stroke="`url(#${uuids[7]})`"
            d="m52.88 43.38 2.82 1.617a29.9 29.9 0 0 1-10.802 10.76A29.6 29.6 0 0 1 30 59.75c-1.977 0-3.909-.193-5.777-.56l.654-3.184c1.678.328 3.393.494 5.165.494a26.45 26.45 0 0 0 13.264-3.577 26.56 26.56 0 0 0 9.574-9.544ZM7.582 10.441l2.43 2.159C5.835 17.394 3.5 23.514 3.5 30.04a26.36 26.36 0 0 0 3.52 13.165l-2.801 1.65A29.6 29.6 0 0 1 .25 30a29.64 29.64 0 0 1 7.332-19.558ZM30.032.252c6.882.108 12.802 2.243 17.614 5.794a29.8 29.8 0 0 1 10.561 14.473l-3.089 1.01a26.5 26.5 0 0 0-9.561-12.985 26.46 26.46 0 0 0-15.322-5.043Z"
            fill-rule="nonzero"
            stroke-width=".5"
        />
        <g stroke-linecap="round" stroke-linejoin="round">
          <use :fill="`url(#${uuids[8]})`" :xlink:href="`#${uuids[11]}`"/>
          <circle :fill="`url(#${uuids[10]})`" :stroke="`url(#${uuids[9]})`" cx="30" cy="30" r="26.5"
                  stroke-width=".5"/>
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import tinycolor from "tinycolor2";
import {v4} from "uuid";

const aspectRatio = 60 / 121;
const props = withDefaults(
    defineProps<{
      height?: number
      themeColor?: 'blue' | 'green' | 'yellow' | string
    }>(),
    {
      height: 121,
      themeColor: 'blue',
    }
);
const themeColor = computed(() => {
  switch (props.themeColor) {
    case 'blue':
      return '#76BCFF'
    case 'green':
      return '#00EFD5'
    case 'yellow':
      return '#FFD12A'
    default:
      return props.themeColor
  }
});
const uuids = Array.from({length: 14}, () => v4());
const calculatedWidth = computed(() => aspectRatio * props.height);
</script>

<style scoped>
.wrapper {
  position: relative;
  display: inline-block;
}

.icon-slot {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
}
</style>