<template>
  <div id="bg" @contextmenu.prevent>
    <canvas ref="backgroundCanvas"></canvas>
    <canvas ref="foregroundCanvas1"></canvas>
    <canvas ref="foregroundCanvas2"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';

const backgroundCanvas = ref<HTMLCanvasElement | null>(null);
const foregroundCanvas1 = ref<HTMLCanvasElement | null>(null);
const foregroundCanvas2 = ref<HTMLCanvasElement | null>(null);

const dpr = window.devicePixelRatio || 1;
let wWidth: number;
let wHeight: number;
let timer: number;

type GraphicElementProp = {
  amount: number,
  layer: number,
  color: [number, number, number],
  alpha: number
};

const props = withDefaults(defineProps<{
  circle?: GraphicElementProp,
  line?: GraphicElementProp,
  speed?: number,
  angle?: number
}>(), {
  circle: _ => ({
    amount: 28,
    layer: 3,
    color: [157, 97, 207],
    alpha: 0.3
  }),
  line: _ => ({
    amount: 22,
    layer: 3,
    color: [255, 255, 255],
    alpha: 0.3
  }),
  speed: 0.5,
  angle: 20
});

const circles: any[] = [];
const lines: any[] = [];
const degree = (props.angle / 360) * Math.PI * 2;

const setCanvasHeight = () => {
  if (!backgroundCanvas.value) return;
  wWidth = window.innerWidth * dpr;
  wHeight = window.innerHeight * dpr;

  [backgroundCanvas, foregroundCanvas1, foregroundCanvas2].forEach(canvas => {
    if (canvas.value) {
      canvas.value.width = wWidth;
      canvas.value.height = wHeight;
    }
  });
};

const drawCircle = (fctx1: CanvasRenderingContext2D, x: number, y: number, radius: number, color: number[], alpha: number) => {
  const gradient = fctx1.createRadialGradient(x, y, radius, x, y, 0);
  gradient.addColorStop(0, `rgba(${color[0]},${color[1]},${color[2]},${alpha})`);
  gradient.addColorStop(1, `rgba(${color[0]},${color[1]},${color[2]},${alpha - 0.1})`);

  fctx1.beginPath();
  fctx1.arc(x, y, radius, 0, Math.PI * 2, true);
  fctx1.fillStyle = gradient;
  fctx1.fill();
};

const drawLine = (fctx2: CanvasRenderingContext2D, x: number, y: number, width: number, color: number[], alpha: number) => {
  const endX = x + Math.sin(degree) * width;
  const endY = y - Math.cos(degree) * width;
  const gradient = fctx2.createLinearGradient(x, y, endX, endY);
  gradient.addColorStop(0, `rgba(${color[0]},${color[1]},${color[2]},${alpha})`);
  gradient.addColorStop(1, `rgba(${color[0]},${color[1]},${color[2]},${alpha - 0.1})`);

  fctx2.beginPath();
  fctx2.moveTo(x, y);
  fctx2.lineTo(endX, endY);
  fctx2.lineWidth = 3;
  fctx2.lineCap = 'round';
  fctx2.strokeStyle = gradient;
  fctx2.stroke();
};

const drawBack = (bctx: CanvasRenderingContext2D) => {
  bctx.clearRect(0, 0, wWidth, wHeight);

  const gradient: CanvasGradient[] = [];

  gradient[0] = bctx.createRadialGradient(wWidth * 0.3, wHeight * 0.1, 0, wWidth * 0.3, wHeight * 0.1, wWidth * 0.9);
  gradient[0].addColorStop(0, 'rgb(0, 26, 77)');
  gradient[0].addColorStop(1, 'transparent');

  bctx.translate(wWidth, 0);
  bctx.scale(-1, 1);
  bctx.beginPath();
  bctx.fillStyle = gradient[0];
  bctx.fillRect(0, 0, wWidth, wHeight);

  gradient[1] = bctx.createRadialGradient(wWidth * 0.1, wHeight * 0.1, 0, wWidth * 0.3, wHeight * 0.1, wWidth);
  gradient[1].addColorStop(0, 'rgb(0, 150, 240)');
  gradient[1].addColorStop(0.8, 'transparent');

  bctx.translate(wWidth, 0);
  bctx.scale(-1, 1);
  bctx.beginPath();
  bctx.fillStyle = gradient[1];
  bctx.fillRect(0, 0, wWidth, wHeight);

  gradient[2] = bctx.createRadialGradient(wWidth * 0.1, wHeight * 0.5, 0, wWidth * 0.1, wHeight * 0.5, wWidth * 0.5);
  gradient[2].addColorStop(0, 'rgb(40, 20, 105)');
  gradient[2].addColorStop(1, 'transparent');

  bctx.beginPath();
  bctx.fillStyle = gradient[2];
  bctx.fillRect(0, 0, wWidth, wHeight);
};

const animate = (bctx: CanvasRenderingContext2D, fctx1: CanvasRenderingContext2D, fctx2: CanvasRenderingContext2D) => {
  const sin = Math.sin(degree);
  const cos = Math.cos(degree);

  if (props.circle.amount > 0 && props.circle.layer > 0) {
    fctx1.clearRect(0, 0, wWidth, wHeight);
    for (let i = 0, len = circles.length; i < len; i++) {
      const item = circles[i];
      let { x, y, radius, speed } = item;

      if (x > wWidth + radius) {
        x = -radius;
      } else if (x < -radius) {
        x = wWidth + radius;
      } else {
        x += sin * speed;
      }

      if (y > wHeight + radius) {
        y = -radius;
      } else if (y < -radius) {
        y = wHeight + radius;
      } else {
        y -= cos * speed;
      }

      item.x = x;
      item.y = y;
      drawCircle(fctx1, x, y, radius, item.color, item.alpha);
    }
  }

  if (props.line.amount > 0 && props.line.layer > 0) {
    fctx2.clearRect(0, 0, wWidth, wHeight);
    for (let j = 0, len = lines.length; j < len; j++) {
      const item = lines[j];
      let { x, y, width, speed } = item;

      if (x > wWidth + width * sin) {
        x = -width * sin;
      } else if (x < -width * sin) {
        x = wWidth + width * sin;
      } else {
        x += sin * speed;
      }

      if (y > wHeight + width * cos) {
        y = -width * cos;
      } else if (y < -width * cos) {
        y = wHeight + width * cos;
      } else {
        y -= cos * speed;
      }

      item.x = x;
      item.y = y;
      drawLine(fctx2, x, y, width, item.color, item.alpha);
    }
  }

  timer = requestAnimationFrame(() => animate(bctx, fctx1, fctx2));
};

const createItem = (bctx: CanvasRenderingContext2D, fctx1: CanvasRenderingContext2D, fctx2: CanvasRenderingContext2D) => {
  circles.length = 0;
  lines.length = 0;

  if (props.circle.amount > 0 && props.circle.layer > 0) {
    for (let i = 0; i < props.circle.amount / props.circle.layer; i++) {
      for (let j = 0; j < props.circle.layer; j++) {
        circles.push({
          x: Math.random() * wWidth,
          y: Math.random() * wHeight,
          radius: Math.random() * (20 + j * 5) + (20 + j * 5) * dpr,
          color: props.circle.color,
          alpha: Math.random() * 0.2 + (props.circle.alpha - j * 0.1),
          speed: props.speed * (1 + j * 0.5)
        });
      }
    }
  }

  if (props.line.amount > 0 && props.line.layer > 0) {
    for (let m = 0; m < props.line.amount / props.line.layer; m++) {
      for (let n = 0; n < props.line.layer; n++) {
        lines.push({
          x: Math.random() * wWidth,
          y: Math.random() * wHeight,
          width: Math.random() * (20 + n * 5) + (20 + n * 5) * dpr,
          color: props.line.color,
          alpha: Math.random() * 0.2 + (props.line.alpha - n * 0.1),
          speed: props.speed * (1 + n * 0.5)
        });
      }
    }
  }

  cancelAnimationFrame(timer);
  timer = requestAnimationFrame(() => animate(bctx, fctx1, fctx2));
  drawBack(bctx);
};

onMounted(() => {
  setCanvasHeight();
  if (backgroundCanvas.value && foregroundCanvas1.value && foregroundCanvas2.value) {
    const bctx = backgroundCanvas.value.getContext('2d')!;
    const fctx1 = foregroundCanvas1.value.getContext('2d')!;
    const fctx2 = foregroundCanvas2.value.getContext('2d')!;
    createItem(bctx, fctx1, fctx2);
  }

  window.addEventListener('resize', () => {
    setCanvasHeight();
    if (backgroundCanvas.value && foregroundCanvas1.value && foregroundCanvas2.value) {
      const bctx = backgroundCanvas.value.getContext('2d')!;
      const fctx1 = foregroundCanvas1.value.getContext('2d')!;
      const fctx2 = foregroundCanvas2.value.getContext('2d')!;
      createItem(bctx, fctx1, fctx2);
    }
  });
});

onBeforeUnmount(() => {
  cancelAnimationFrame(timer);
  circles.length = lines.length = 0;
});
</script>

<style scoped>

#bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #090d00;
  z-index: -1;
}

#bg canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>