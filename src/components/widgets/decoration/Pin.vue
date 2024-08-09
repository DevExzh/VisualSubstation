<script setup lang="ts">
import Plato from "./pin/Plato.vue";
import Portal from "./pin/Portal.vue";
import MapPin from "./pin/MapPin.vue";
import Arrow from "./pin/Arrow.vue";
import Ray from "./pin/Ray.vue";

withDefaults(
    defineProps<{
      type?: 'plato' | 'portal' | 'pin' | 'arrow' | 'ray',
      themeColor?: string,
      height?: number,
    }>(), {
      type: 'plato'
    }
);
</script>

<template>
  <Plato v-if="$props.type === 'plato'" :height="$props.height" :theme-color="$props.themeColor"/>
  <Portal v-else-if="$props.type === 'portal'" :height="$props.height" :theme-color="$props.themeColor"/>
  <MapPin v-else-if="$props.type === 'pin'" :height="$props.height" :theme-color="$props.themeColor"/>
  <Arrow v-else-if="$props.type === 'arrow'" :height="$props.height" :theme-color="$props.themeColor"/>
  <Ray v-else :height="$props.height" :theme-color="$props.themeColor"/>
</template>