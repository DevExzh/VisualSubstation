<script setup lang="ts">

</script>

<template>
  <div class="container">
    <div class="gradient-bg">
      <img v-once
           @contextmenu.prevent
           @dragstart.prevent
           class="decorator top-left"
           src="/images/text-overlay-top-left.svg"
           alt="Decorated Border"
      />
      <img v-once
           @contextmenu.prevent
           @dragstart.prevent
           class="decorator top-right"
           src="/images/text-overlay-top-left.svg"
           alt="Decorated Border"
      />
      <slot class="slot"/>
      <img v-once
           @contextmenu.prevent
           @dragstart.prevent
           class="decorator bottom-left"
           src="/images/text-overlay-bottom-left.svg"
           alt="Decorated Border"
      />
      <img v-once
           @contextmenu.prevent
           @dragstart.prevent
           class="decorator bottom-right"
           src="/images/text-overlay-bottom-left.svg"
           alt="Decorated Border"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  min-width: 567.2pt;
  min-height: 172.2pt;
  scale: 0.5;
}
.gradient-bg {
  position: absolute;
  left: 0;
  top: 20pt;
  padding: 20pt;
  margin: 0;
  z-index: 0;
  background: radial-gradient(circle at 50% 0%, #40597f 0%, #0d0407 100%);
}
.decorator {
  position: absolute;
  z-index: 1;
}
.top-left {
  top: -20pt;
  left: 0;
  width: 283.6pt;
}
.top-right {
  top: -20pt;
  right: 0;
  width: 283.6pt;
  transform: rotateY(180deg);
}
.bottom-left {
  left: 0;
  bottom: -20pt;
  width: 283.6pt;
}
.bottom-right {
  right: 0;
  bottom: -20pt;
  width: 283.6pt;
  transform: rotateY(180deg);
}
.slot {
  pointer-events: auto;
}
</style>