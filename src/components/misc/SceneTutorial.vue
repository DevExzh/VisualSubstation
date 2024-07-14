<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import Cookies from "js-cookie";
enum Step {
  Dolly = 0,
  Rotate = 1,
  Pan = 2,
  KeyBinds = 3,
}
const step = ref<number>(0);
const show = computed((): boolean => {
  if (step.value < 4 && !Cookies.get('tutorial-complete')) {
    return true;
  } else {
    Cookies.set('tutorial-complete', 'yes');
    return false;
  }
});
const text = computed((): string => {
  switch (step.value) {
    case 0: return '按住鼠标中键或推动滚轮以缩放';
    case 1: return '按住鼠标右键以旋转视图';
    case 2: return '按住鼠标左键以平移';
    case 3: return '使用 WASD 键控制视角';
    default: return '';
  }
});
const wheelEvent = (_: WheelEvent) => {
  if(step.value === 0) {
    window.removeEventListener('wheel', wheelEvent);
    step.value++;
  }
};
const middleButtonEvent = (event: PointerEvent) => {
  if(step.value === 0) {
    if(event.button !== 1) return;
    window.removeEventListener('pointerdown', middleButtonEvent);
    step.value++;
  }
};
const rightButtonEvent = (event: PointerEvent) => {
  if(step.value === 1) {
    if(event.button !== 2) return;
    window.removeEventListener('pointerdown', rightButtonEvent);
    step.value++;
  }
};
const leftButtonEvent = (event: PointerEvent) => {
  if(step.value === 2) {
    if(event.button !== 0) return;
    window.addEventListener('pointerdown', leftButtonEvent);
    step.value++;
  }
};
const keyUpEvent = (event: KeyboardEvent) => {
  if(step.value === 3) {
    if(event.ctrlKey || event.altKey || event.shiftKey || event.metaKey
        || !['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
      return;
    }
    window.removeEventListener('keyup', keyUpEvent);
    step.value++;
  }
};
onMounted(() => {
  if(!!Cookies.get('tutorial-complete')) {
    window.addEventListener('wheel', wheelEvent, {passive: true});
    window.addEventListener('pointerdown', middleButtonEvent, {passive: true});
    window.addEventListener('pointerdown', rightButtonEvent, {passive: true});
    window.addEventListener('pointerdown', leftButtonEvent, {passive: true});
    window.addEventListener('keyup', keyUpEvent, {passive: true});
  } else {
    step.value = 8;
  }
});
</script>

<template>
 <transition name="fade" mode="out-in">
   <div class="container" v-if="show">
     <transition name="fade" mode="out-in">
       <div class="icon-container" :key="step">
         <div class="sketch-map dolly" v-if="step === Step.Dolly">
           <div class="img-container">
             <img class="mouse-img" src="/images/mouse-middle.svg" alt="Middle Button Mouse">
           </div>
         </div>
         <div class="sketch-map rotate" v-if="step === Step.Rotate">
           <div class="img-container animation">
             <img src="/images/thick-arrow-left.svg" alt="Left Arrow">
             <img class="mouse-img" src="/images/mouse-right.svg" alt="Right Button Mouse">
             <img src="/images/thick-arrow-right.svg" alt="Right Arrow">
           </div>
         </div>
         <div class="sketch-map pan" v-if="step === Step.Pan">
           <div class="img-container animation">
             <img src="/images/thick-arrow-left.svg" alt="Left Arrow">
             <img class="mouse-img" src="/images/mouse-left.svg" alt="Left Button Mouse">
             <img src="/images/thick-arrow-right.svg" alt="Right Arrow">
           </div>
         </div>
         <div class="sketch-map key-binds" v-if="step === Step.KeyBinds">
           <div class="key-grid">
             <div :key="keyName"
                  :class="['key', {
                  placeholder: keyName === ''
                }]"
                  v-for="keyName in ['', 'W', '', 'A', 'S', 'D']"
             >
               <div class="key-label" v-if="keyName">{{ keyName }}</div>
             </div>
           </div>
         </div>
       </div>
     </transition>
     <transition name="fade" mode="out-in">
       <div class="tips-text" :key="text">{{text}}</div>
     </transition>
   </div>
 </transition>
</template>

<style scoped>
.container {
  z-index: 100;
  position: absolute;
  bottom: 3%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  pointer-events: none;
}
.tips-text {
  font-weight: bold;
  text-align: center;
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}
img {
  height: 2.5rem;
}
.key-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.625rem;
  justify-items: center;
  align-items: center;
  width: 10rem;
}
@keyframes infinite-slide {
  0%, 50%, 100% {
    left: 0;
  }
  25% {
    left: -1em;
  }
  75% {
    left: 1em;
  }
}
.img-container {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.img-container.animation {
  animation: linear 1s infinite normal none running infinite-slide;
}
.mouse-img {
  margin: 0 0.5rem 0 0.5rem;
}
.key {
  width: 3rem;
  height: 3rem;
  background-color: #f5f5f5;
  border-radius: 0.625rem;
  border: #7f7f7f solid 1px;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.2);
  font-size: calc(1.5rem);
  display: flex;
  justify-content: center;
  align-items: center;
}
.key.placeholder {
  background-color: transparent;
  border: none;
  box-shadow: none;
  visibility: hidden;
}
.key-label {
  font-weight: bold;
  padding: 0 0.625rem;
}
</style>