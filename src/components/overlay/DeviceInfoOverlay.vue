<script setup lang="ts">
defineProps<{
  name: string
}>();
</script>

<template>
  <div class="text">
    <span class="key">名称：</span>
    <span class="value">{{$props.name}}</span>
    <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur deleniti, eum exercitationem molestiae nobis quaerat quisquam unde voluptatum. Autem consectetur deleniti dignissimos error expedita fugiat laborum molestiae non numquam voluptatum.</div>
  </div>
</template>

<style scoped>
.text {
  color: white;
  font-size: 4em;
  user-select: auto;
}
.key {
  font-weight: bold;
}
</style>