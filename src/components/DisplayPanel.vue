<script setup lang="ts">
</script>

<template>
  <svg style="visibility: hidden; z-index: -256;">
    <defs>
      <linearGradient id="b" x1="0%" x2="99.111%" y1="50%" y2="50%">
        <stop offset="0%" stop-color="#1F87CC" stop-opacity=".302"/>
        <stop offset="100%" stop-color="#1F87CC" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="c" x1="0%" x2="92.145%" y1="50%" y2="50%">
        <stop offset="0%" stop-color="#5EBCF5" stop-opacity=".4"/>
        <stop offset="100%" stop-color="#5EBCF5" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="h" x1="0%" x2="100%" y1="49.817%" y2="49.817%">
        <stop offset="0%" stop-color="#59BFFF" stop-opacity="0"/>
        <stop offset="28.99%" stop-color="#59BFFF" stop-opacity=".851"/>
        <stop offset="50.97%" stop-color="#ABDFFF"/>
        <stop offset="71.81%" stop-color="#59BFFF" stop-opacity=".651"/>
        <stop offset="100%" stop-color="#59BFFF" stop-opacity="0"/>
      </linearGradient>
    </defs>
  </svg>
  <div
      id="display-panel"
  >
    <header v-once class="panel-header">
      <div class="panel-title">
        电网设备数字孪生管理系统
      </div>
      <img src="/images/banner.svg" class="top-decoration" alt="hologram"/>
      <div class="header-background left-part" />
      <div class="header-background right-part" />
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

<style lang="scss" scoped>
@font-face {
  font-family: 'YouSheBiaoTiHei';
  src: url('/fonts/YouSheBiaoTiHei.woff2') format('woff2'),
  url('/fonts/YouSheBiaoTiHei.woff') format('woff'),
  url('/fonts/YouSheBiaoTiHei.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
.top-decoration {
  height: 3.25rem;
  z-index: 4;
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
  position: absolute;
  display: flex;
  justify-content: center;
  left: 0;
  top: 0;
  width: 100vw;
  height: 3.25rem;
  pointer-events: none;
  animation: 1.25s ease-out 0s header-slide;
}
.panel-title {
  display: inline-block;
  z-index: 5;
  font-size: 2rem;
  text-shadow: 1px 1px 3rem black;
  font-family: YouSheBiaoTiHei, serif;
  background-image: linear-gradient(to bottom, #fff 50%, #63D8FF 100%);
  background-size: 100%;
  background-clip: text;
  -webkit-text-fill-color: rgba(100%, 100%, 100%, 0.5);
  position: absolute;
  left: 50%;
  top: 5%;
  transform: translate(-50%, 0);
}
.panel-body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
.header-background {
  position: absolute;
  top: 0;
  height: 2.2rem;
  background: linear-gradient(to bottom, transparent, rgba(42, 167, 250, 0.2));
  width: 100%;
  &.left-part {
    left: 0;
    width: calc(50vw - 19rem);
    clip-path: polygon(
            0 0,
            calc(100% - 2.2rem) 0,
            100% 2.2rem,
            100% 100%,
            0 100%,
            0 0
    );
  }
  &.right-part {
    right: 0;
    width: calc(50vw - 19rem);
    clip-path: polygon(
            100% 0,
            2.2rem 0,
            0 100%,
            100% 100%,
            100% 0
    );
  }
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