<script setup lang="ts">
import {ElIcon, ElTooltip, ElDialog} from "element-plus";
import {InfoFilled} from "@element-plus/icons-vue";
import {ref} from "vue";
import DocumentPanel from "../../../widgets/dialog/docs/DocumentPanel.vue";
import {Section} from "../../../widgets/dialog/docs/DocumentPanel.ts";
const showReference = ref<boolean>(false);
const sections = ref<Section[]>([{
  name: '语法基础',
  children: [{
    name: '基本数据类型',
    component: () => import('../../../widgets/dialog/docs/pages/Arithmetic.vue'),
  }, {
    name: '布尔运算',
    component: () => import('../../../widgets/dialog/docs/pages/Boolean.vue'),
  }, {
    name: '条件与逻辑',
    component: () => import('../../../widgets/dialog/docs/pages/LogicOperation.vue'),
  }, {
    name: '字符串',
    component: () => import('../../../widgets/dialog/docs/pages/String.vue'),
  }]
}, {
  name: '语法进阶',
  children: [{
    name: '类型与实例化',
    component: () => import('../../../widgets/dialog/docs/pages/Type.vue'),
  }, {
    name: '变量',
    component: () => import('../../../widgets/dialog/docs/pages/Variable.vue'),
  }, {
    name: '方法调用',
    component: () => import('../../../widgets/dialog/docs/pages/MethodCall.vue'),
  }, {
    name: '集合操作',
    component: () => import('../../../widgets/dialog/docs/pages/Collection.vue'),
  }]
}]);
</script>

<template>
  <ElTooltip placement="top">
    <template #content>
      支持输入任意表达式，语法规则如下：<br/>
      <ul style="padding-left: 1em;">
        <li>用 <code>#value</code> 指代当前值、<code>#prev</code> 指代前一个值</li>
        <li>支持常量，如圆周率 <code>Pi</code>、自然常数 <code>E</code></li>
        <li>支持数学函数 <code>sin</code>、<code>cos</code>、<code>tan</code> 等</li>
        <li>更多规则请参见
          <span class="link" @click="showReference = true">语法参考手册</span>
        </li>
      </ul>
    </template>
    <ElIcon v-once>
      <InfoFilled/>
    </ElIcon>
  </ElTooltip>
  <ElDialog append-to="#app" width="75%" v-model="showReference" @close="showReference = false">
    <DocumentPanel v-model="sections"/>
  </ElDialog>
</template>

<style lang="scss" scoped>
.link {
  font-size: inherit;
  cursor: pointer;
  color: #03a9f4;
}
</style>