<script setup lang="ts">
withDefaults(defineProps<{
  height: string,
  title?: string,
  description?: string,
}>(), {
  height: '5rem',
  title: '警告',
});
</script>

<template>
  <div class="warning-container">
    <div class="warning-image" :style="{width: $props.height, height: $props.height}">
      <img src="/images/warning-podium.svg" alt="Warning Sign" />
    </div>
    <div class="text" v-if="$props.title" :style="{
      fontSize: $props.description ? `calc(0.6 * ${$props.height})` : `calc(0.8 * ${$props.height})`
    }">
      <div class="title">{{$props.title}}</div>
      <div :style="{fontSize: `calc(0.2 * ${$props.height})` }" v-if="$props.description">
        {{$props.description}}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "stripe";
.warning-container {
  user-select: none;
  position: relative;
  display: inline-block;
  width: calc(100% - 5em);
  padding: 1em;
  margin: 1em;
  border-radius: 5pt;
  @keyframes sci-fi-glow-pulse {
    0%, 100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }
  @include stripe(0.8);
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 5pt;
    box-shadow: 0 0 2rem 1rem rgba(255, 235, 59, 0.7);
    opacity: 0;
    animation: sci-fi-glow-pulse 1s infinite;
  }
  .text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    text-shadow: 0 0 10pt rgba(0, 0, 0, 0.3);
    .title {
      font-weight: bold;
    }
  }
  .warning-image {
    display: block;
    background: white;
    padding: 0.25em;
    clip-path: circle(50% at 50% 50%);
    position: relative;
    > * {
      position: absolute;
      top: 10%;
      left: 10%;
      height: 80%;
      width: 80%;
    }
  }
}
</style>