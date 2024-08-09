<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
const countDown = ref<number>(5);
const router = useRouter();
onMounted(() => {
  const reduce = () => {
    countDown.value--;
    if(countDown.value == 0) {
      router.push({
        name: 'home'
      });
    } else {
      setTimeout(reduce, 1000);
    }
  };
  setTimeout(reduce, 1000);
});
</script>

<template>
  <div class="container">
    <div class="content">
      <div class="text">
        <div v-once class="place-holder"></div>
        <h1 v-once class="title">404</h1>
        <div class="description">
          似乎来到了一片没有知识的荒原<br/>
          页面将在 {{countDown}} 秒后跳转……
        </div>
        <div v-once class="place-holder"></div>
      </div>
      <img v-once src="/images/404.svg" alt="404"/>
    </div>
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
.container {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
}
.content {
  display: flex;
  justify-content: center;
}
.text {
  width: 30vw;
}
img {
  height: 75vh;
}
.title {
  font-size: calc(15vh);
}
.description {
  height: 10vh;
}
.place-holder {
  height: 25vh;
}
</style>