<script setup lang="ts">
import tinycolor from "tinycolor2";

withDefaults(defineProps<{
  height?: number | string;
  color?: string;
  title?: string;
  formatter?: (value: number) => string;
  showText?: boolean;
  min?: number;
  max?: number;
  value: number;
}>(), {
  min: 0,
  max: 100,
  height: '1.5em',
  showText: true,
  color: "#2196f3",
});
</script>

<template>
  <div
      class="inner"
      :style="{
        boxShadow: `0 0 1em ${tinycolor($props.color).darken(20).setAlpha(0.5).toString()}`,
        border: `1pt solid ${tinycolor($props.color).lighten(10).toString()}`,
        background: tinycolor($props.color).darken(35).setAlpha(0.5).toString(),
        height: $props.height,
      }"
  >
    <div class="bar" :style="{
        width: `${$props.value / ($props.max! - $props.min!) * 100}%`,
        background:
          `linear-gradient(45deg, rgba(0, 0, 0, 0.1) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.1) 50%,` +
          `rgba(0, 0, 0, 0.1) 75%, transparent 75%, transparent),` +
          `linear-gradient(to bottom, ${$props.color}, ${tinycolor($props.color).darken(20).toString()})`,
        height: $props.height,
      }"/>
    <div class="prefix" v-if="$slots.prefix">
      <slot name="prefix"/>
    </div>
    <span class="text">
      <span v-if="$props.showText && !$slots.default">
        {{ formatter ? formatter($props.value) : $props.value }}
      </span>
      <slot/>
    </span>
  </div>
  <div class="title" :style="{ color: tinycolor($props.color).lighten(25).toString() }">{{ $props.title }}</div>
</template>

<style scoped>
.inner {
  position: relative;
  border-radius: .75em;
  overflow: hidden;
  min-width: 3em;
}
.prefix {
  position: absolute;
  top: 0;
  left: 0.5em;
  width: 1em;
  height: 100%;
}
.text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: medium;
  color: white;
}
.title {
  text-align: center;
  font-size: smaller;
  font-weight: bolder;
  color: white;
}
.bar {
  transition: width 0.3s ease-out;
}
</style>
