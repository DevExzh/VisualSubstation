<script setup lang="ts">

</script>

<template>
  <div class="svg-grid">
    <div class="svg-item">
      <div class="svg-data">598</div>
      <img src="/images/podium.svg" alt="Podium" class="podium" />
      <div class="svg-label">总数</div>
    </div>

    <div class="svg-item">
      <div class="svg-data">180</div>
      <img src="/images/podium.svg" alt="Podium" class="podium" />
      <div class="svg-label">220kV 变电站</div>
    </div>

    <div class="svg-item">
      <div class="svg-data">26</div>
      <img src="/images/podium.svg" alt="Podium" class="podium" />
      <div class="svg-label">500kV 变电站</div>
    </div>

    <div class="svg-item">
      <div class="svg-data">1</div>
      <img src="/images/podium.svg" alt="Podium" class="podium" />
      <div class="svg-label">1000kV 变电站</div>
    </div>
  </div>
</template>

<style scoped>
.svg-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-items: center;
}

.svg-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.svg-data {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: -0.5rem;
  color: white;
}

.svg-label {
  color: white;
  font-weight: 500;
}
</style>