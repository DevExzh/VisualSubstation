<script setup lang="ts">
import Hexagon from "./marker/Hexagon.vue";
import Circle3D from "./marker/Circle3D.vue";
import Triangle from "./marker/Triangle.vue";
import Shield from "./marker/Shield.vue";
import Circle from "./marker/Circle.vue";
import Square from "./marker/Square.vue";

withDefaults(
    defineProps<{
      type?: 'hexagon' | 'circle' | '3d-circle' | 'triangle' | 'shield' | 'square',
      themeColor?: string,
      height?: number,
    }>(), {
      type: 'hexagon'
    }
);
</script>

<template>
  <transition name="fade" appear>
    <Hexagon v-if="$props.type === 'hexagon'" :height="$props.height" :themeColor="$props.themeColor">
      <slot :themeColor="$props.themeColor"/>
    </Hexagon>
    <Circle v-else-if="$props.type === 'circle'" :height="$props.height" :themeColor="$props.themeColor">
      <slot :themeColor="$props.themeColor"/>
    </Circle>
    <Circle3D v-else-if="$props.type === '3d-circle'" :height="$props.height" :themeColor="$props.themeColor">
      <slot :themeColor="$props.themeColor"/>
    </Circle3D>
    <Triangle v-else-if="$props.type === 'triangle'" :height="$props.height" :themeColor="$props.themeColor">
      <slot :themeColor="$props.themeColor"/>
    </Triangle>
    <Shield v-else-if="$props.type === 'shield'" :height="$props.height" :themeColor="$props.themeColor">
      <slot :themeColor="$props.themeColor"/>
    </Shield>
    <Square v-else :height="$props.height" :themeColor="$props.themeColor">
      <slot :themeColor="$props.themeColor"/>
    </Square>
  </transition>
</template>

<style scoped>

</style>