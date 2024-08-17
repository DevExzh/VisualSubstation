<script setup lang="ts">
import {ElBacktop, ElContainer, ElTooltip, ElScrollbar, ElHeader, ElAside, ElMain} from 'element-plus';
import {computed, defineAsyncComponent, onMounted, ref} from "vue";
import {Section} from "./DocumentPanel.ts";
import interact from "interactjs";

const props = withDefaults(
    defineProps<{
      sidebarMinWidth?: number;
      sidebarMaxWidth?: number;
      defaultTitle?: boolean;
    }>(), {
      sidebarMinWidth: 200,
      sidebarMaxWidth: 400,
      defaultTitle: false,
    }
);
const sideBarWidth = ref<string>('200px');
const sections = defineModel<Section[]>({required: true, default: {}});
const currentPage = ref<Section>();
const currentComponent = computed(() => {
  if (!currentPage.value || !currentPage.value.component) return undefined;
  switch (typeof currentPage.value.component) {
    default:
      return undefined;
    case "function":
      return defineAsyncComponent(currentPage.value.component as () => Promise<any>);
    case "object":
      return currentPage.value.component;
  }
});
const onClicked = (section: Section) => {
  currentPage.value = section;
};
onMounted(() => {
  interact('#sidebar')
      .resizable({
        axis: 'x',
        margin: 5,
        edges: {
          // 只有右侧才允许拖动
          top: false, right: true, bottom: false, left: false
        },
        onmove(event: { rect: { width: number } }) {
          // 当前仅当大于最小宽度、小于最大宽度时才允许改变大小
          if (event.rect.width >= props.sidebarMinWidth && event.rect.width <= props.sidebarMaxWidth) {
            sideBarWidth.value = `${event.rect.width}px`;
          }
        }
      });
  currentPage.value = sections.value[0];
});
</script>

<template>
  <ElContainer class="container">
    <ElHeader class="header">
      <img class="title-icon" src="/images/documentation.png" alt="documentation icon"/>
      <span class="title">参考手册</span>
    </ElHeader>
    <ElContainer style="height: calc(100% - 3em);">
      <ElAside
          :width="sideBarWidth"
          id="sidebar" style="border-right: 1pt solid #eee;"
      >
        <ElScrollbar max-height="70vh">
          <div
              v-for="section in sections"
          >
            <ul class="section">
              <li class="section-title"><b>{{ section.name }}</b></li>
              <li
                  class="page-title"
                  :class="{current: page == currentPage}"
                  v-for="page in section.children"
                  @click="onClicked(page)"
              >
                <ElTooltip :disabled="!page.description" :content="page.description">
                  {{ page.name }}
                </ElTooltip>
              </li>
            </ul>
          </div>
        </ElScrollbar>
      </ElAside>
      <ElMain>
        <ElScrollbar max-height="70vh" class="scrollbar" data-document>
          <Transition name="fade" mode="out-in">
            <div ref="componentContainer" class="page-content" v-if="currentPage" :key="currentPage.name">
              <div class="content-title" v-if="$props.defaultTitle">{{ currentPage.name }}</div>
              <Component
                  :is="currentComponent"
              />
            </div>
          </Transition>
          <ElBacktop target=".scrollbar[data-document] .el-scrollbar__wrap"/>
        </ElScrollbar>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style lang="scss" scoped>
kbd {
  display: inline-block;
  min-width: 1em;
  margin-inline: .125rem;
  padding: .25em;
  border: 1px solid #eee;
  border-radius: .25em;
  box-shadow: 1px 1px 4px #00000026;
  line-height: 1;
  letter-spacing: -.1em;
  text-align: center
}

/********************* 文档样式 ************************/
:deep(code) {
  margin: 0;
  padding: 3px 6px;
  border-radius: 4px;
  background: #7f7f7f1f;
  font-size: .875em;
  overflow-wrap: break-word
}

:deep(strong) {
  font-weight: 600
}

:deep(h1,h2,h3,h4,h5,h6) {
  font-weight: 600;
  line-height: 1.25;
  overflow-wrap: break-word
}

:deep(h1) {
  font-size: 2rem
}

:deep(h2) {
  padding-bottom: .3rem;
  border-bottom: 1px solid #eaecef;
  font-size: 1.65rem
}

:deep(h3) {
  font-size: 1.35rem
}

:deep(h4) {
  font-size: 1.15rem
}

:deep(h5) {
  font-size: 1.05rem
}

:deep(h6) {
  font-size: 1rem
}

:deep(p,ul,ol) {
  line-height: 1.6;
  overflow-wrap: break-word
}

:deep(hr) {
  border: 0;
  border-top: 1px solid #eaecef
}

:deep(pre) {
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-wrap: normal;
  word-break: normal;
  overflow-wrap: unset;
  -moz-tab-size: 4;
  tab-size: 4;
  -webkit-hyphens: none;
  hyphens: none;
  direction: ltr
}

/********************* 容器样式 ************************/
.container {
  height: calc(70vh - 3em);
}

.header {
  display: flex;
  align-items: center;
  padding: 0.7rem 1.5rem;
  height: 3em;
  border-bottom: 1pt solid #eee;
}

.title {
  font-size: 1.3rem;
  font-weight: bold;

  &-icon {
    height: 1.75em;
    margin-right: 0.7em;
  }
}

.section {
  text-align: left;
  list-style: none;
  padding: 0;

  .section-title {
    padding: .35rem 1.5rem .35rem 1.25rem;
    font-size: 1.1em;
  }

  .page-title {
    cursor: pointer;
    transition: all 0.3s ease-out;
    padding: .35rem 1rem .35rem 2rem;
    font-size: 1em;

    &:hover, &.current {
      color: #2196f3;
    }
  }
}

.page-content {
  text-align: left;

  > * {
    margin-block: 0.4em;
  }

  .content-title {
    font-size: xx-large;
    font-weight: bold;
  }
}

:deep(.el-backtop) {
  position: absolute;
}
</style>