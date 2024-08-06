<script setup lang="ts">
import ScrollArea from "../../widgets/ScrollArea.vue";
import {onMounted, ref} from "vue";
import Api from "../../../ts/common/Api.ts";
import {EventInfo} from "../../../ts/common/ApiTypes.ts";
import {parseTime} from "../../../ts/common/Utils.ts";
const events = ref<EventInfo[]>([]);
const mapToTypeName = (name: string): string => {
  switch (name) {
    case 'info': return 'info';
    case 'warning': return 'warning';
    case 'critical': return 'danger';
    case 'fatal': return 'danger';
    default: return 'primary';
  }
};
const mapToTagName = (name: string): string => {
  switch (name) {
    case 'info': return '信息';
    case 'warning': return '警告';
    case 'critical': return '重要';
    case 'fatal': return '致命';
    default: return '默认';
  }
};
onMounted(() => {
  Api.Event.listRecentEvents(10).then(resp => {
    events.value = resp.rows;
  });
});
</script>

<template>
  <ScrollArea>
    <div :class="[
        'event-row',
        {
          'even': index % 2 === 0,
          'odd': index % 2 !== 0,
        }
        ]"
         v-for="(value, index) in events"
         :key="index"
    >
      <span class="index">{{index}}</span>
      <span class="time">{{parseTime(value.time)}}</span>
      <ElTag :type="mapToTypeName(value.emergency)" size="small">
        {{mapToTagName(value.emergency)}}
      </ElTag>
      <span class="detail">{{value.description}}</span>
    </div>
  </ScrollArea>
</template>

<style scoped>
.index {
  width: 1.25em;
  height: 1.25em;
  border-radius: 0.25em;
  background: linear-gradient(to right, rgba(31, 135, 204, .24), rgba(31, 135, 204, .06));
  text-align: center;
}
.time {
  margin: 0 1em 0 1em;
  font-size: small;
  text-wrap: nowrap;
}
.detail {
  margin-left: 1em;
  font-size: smaller;
  text-wrap: nowrap;
}
.event-row {
  height: 2rem;
  padding: 0 5% 0 5%;
  display: flex;
  align-items: center;
  overflow: hidden;
  color: rgb(255, 255, 255, 0.7);
}
.even {
  background: #041821;
}
.odd {
  background: #052636;
}
</style>