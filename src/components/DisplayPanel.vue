<script setup lang="ts">
</script>

<template>
  <div
      id="display-panel"
  >
    <header v-once class="panel-header">
      <div class="panel-title">
        电网设备数字孪生管理系统
      </div>
      <img src="/images/hologram.svg" class="top-decoration" alt="hologram"/>
    </header>
    <div class="panel-body">
      <RouterView v-slot="{ Component }">
        <Transition>
          <div :key="$route.path">
            <Component :is="Component" />
          </div>
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style scoped>
@import url("/fonts/fonts.css");
.top-decoration {
  height: 8rem;
}
#display-panel {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
}
.panel-header {
  z-index: 10;
  color: #fff;
  font-size: x-large;
  padding: .5rem 0 .5rem 2rem;
  position: absolute;
  display: flex;
  justify-content: center;
  left: 0;
  top: 0;
  width: 100vw;
  height: 8rem;
  pointer-events: none;
  animation: 0.7s ease-out 0s header-slide;
}
.panel-title {
  display: inline-block;
  z-index: 5;
  font-size: 2.75rem;
  text-shadow: 1px 1px 3rem black;
  font-family: YouSheBiaoTiHei, serif;
  background-image: linear-gradient(to bottom, #fff 50%, #333 100%);
  background-size: 100%;
  background-clip: text;
  -webkit-text-fill-color: rgba(100%, 100%, 100%, 0.5);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.panel-body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
@keyframes header-slide {
  from {
    top: -8rem;
  }
  to {
    top: 0;
  }
}
</style>