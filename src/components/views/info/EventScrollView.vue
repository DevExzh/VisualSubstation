<script setup lang="ts">
import ScrollArea from "../../widgets/ScrollArea.vue";
</script>

<template>
  <div class="scroll-area">
    <ScrollArea>
      <div :class="[
        'event-row',
        {
          'even': index % 2 === 0,
          'odd': index % 2 !== 0,
        }
        ]"
           v-for="(_, index) in 10"
           :key="index"
      >
        {{new Date().toLocaleTimeString() + ' 事件名称 ' + index.toString()}}
      </div>
    </ScrollArea>
  </div>
</template>

<style scoped>
.scroll-area {
  padding: 0.5rem 0.5rem 0 0.5rem;
  height: calc(100% - 1rem);
}
.event-row {
  height: 2rem;
  padding: 0 5% 0 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgb(255, 255, 255, 0.7);
}
.even {
  background: linear-gradient(to right, transparent 0%, rgba(2, 136, 209, 0.2) 10% 90%, transparent 100%);
}
.odd {
  background: linear-gradient(to right, transparent 0%, rgba(179, 229, 252, 0.2) 10% 90%, transparent 100%);
}
</style>