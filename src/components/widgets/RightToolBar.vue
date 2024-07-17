<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {Search, Refresh, Menu} from "@element-plus/icons-vue";
import {TransferKey} from "element-plus";

const props = defineProps({
  /* 是否显示检索条件 */
  showSearch: {
    type: Boolean,
    default: true,
  },
  /* 显隐列信息 */
  columns: {
    type: Array<{
      key: string | number;
      visible: boolean;
      label: string;
    }>,
  },
  /* 是否显示检索图标 */
  search: {
    type: Boolean,
    default: true,
  },
  /* 显隐列类型（transfer穿梭框、checkbox复选框） */
  showColumnsType: {
    type: String,
    default: "checkbox",
  },
  /* 右外边距 */
  gutter: {
    type: Number,
    default: 10,
  },
})
const emits = defineEmits(['update:showSearch', 'queryTable']);
// 显隐数据
const value = ref<number[]>([]);
// 弹出层标题
const title = ref<string>("显示/隐藏");
// 是否显示弹出层
const open = ref<boolean>(false);
const style = computed(() => {
  const ret: Record<string, string> = {};
  if (props.gutter) {
    ret.marginRight = `${props.gutter / 2}px`;
  }
  return ret;
});
// 搜索
const toggleSearch = () => {
  emits("update:showSearch", !props.showSearch);
};
// 刷新
const refresh = () => {
  emits("queryTable");
};
// 右侧列表元素变化
const dataChange = (data: TransferKey[]) => {
  for (const item in props.columns!) {
    const key = props.columns[item].key;
    props.columns[item].visible = !data.includes(key);
  }
};
// 打开显隐列dialog
const showColumn = () => {
  open.value = true;
}
// 勾选
const checkboxChange = (event: boolean, label: string) => {
  props.columns!.filter(item => item.label == label)[0].visible = event;
};
onMounted(() => {
  if (props.showColumnsType == 'transfer') {
    // 显隐列初始默认隐藏列
    for (const item in props.columns!) {
      if (!props.columns[item].visible) {
        value.value.push(parseInt(item));
      }
    }
  }
});
</script>

<template>
  <div class="top-right-btn" :style="style">
    <el-row>
      <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top" v-if="search">
        <el-button circle :icon="Search" @click="toggleSearch" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button circle :icon="Refresh" @click="refresh" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="显隐列" placement="top" v-if="columns">
        <el-button circle :icon="Menu" @click="showColumn" v-if="showColumnsType == 'transfer'"/>
        <el-dropdown trigger="click" :hide-on-click="false" style="padding-left: 12px" v-if="showColumnsType == 'checkbox'">
          <el-button circle :icon="Menu" />
          <template #dropdown>
            <el-dropdown-menu>
              <template v-for="item in columns" :key="item.key">
                <el-dropdown-item>
                  <el-checkbox :checked="item.visible" @change="checkboxChange($event, item.label)" :label="item.label" />
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-tooltip>
    </el-row>
    <el-dialog :title="title" v-model="open" append-to-body>
      <el-transfer
          :titles="['显示', '隐藏']"
          v-model="value"
          :data="columns"
          @change="dataChange"
      ></el-transfer>
    </el-dialog>
  </div>
</template>

<style scoped>
:deep(.el-transfer__button) {
  border-radius: 50%;
  display: block;
  margin-left: 0;
}
:deep(.el-transfer__button:first-child) {
  margin-bottom: 10px;
}
:deep(.el-dropdown-menu__item) {
  line-height: 30px;
  padding: 0 17px;
}
</style>