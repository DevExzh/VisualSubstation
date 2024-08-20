<script setup lang="ts">
import DecoratedButton from "../widgets/decoration/DecoratedButton.vue";
import {onMounted, ref, watch} from "vue";
import useUserStore from "../../ts/store/UserStore.ts";
import {
  ElMessage, ElMessageBox, ElBreadcrumb, ElScrollbar,
  ElBreadcrumbItem, ElForm, ElFormItem, ElSwitch, ElIcon,
  ElSlider,
} from "element-plus";
import {DArrowRight, InfoFilled} from "@element-plus/icons-vue";
import Api from "../../ts/common/Api.ts";
import router from "../../routes.ts";
import useDockStore from "../../ts/store/DockStore.ts";
import DockItem from "../widgets/layout/DockItem.vue";
import useCommonStore from "../../ts/store/CommonStore.ts";
import Cookies from "js-cookie";

const formattedDateTime = ref<string>('');
const userName = ref<string>('');
const onExitClicked = () => {
  ElMessageBox.confirm(`您确定要退出登录吗?`, "系统提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: "warning",
  })
      .then(Api.logout)
      .then(() => {
        router.replace({name: 'login'});
        ElMessage.success('登出成功');
      })
  ;
};
const isSettingsOpen = ref<boolean>(false);
const dock = useDockStore();
const commonStore = useCommonStore();
const showCurrentTime = ref<boolean>((Cookies.get('SHOW_NOW_TIME') ?? 'y') === 'y');
const autoHideDock = ref<boolean>(Cookies.get('AUTO_HIDE_DOCK') === 'y');
const autoHideInterval = ref<number>(parseInt(Cookies.get('AUTO_HIDE_INTERVAL') ?? '3'));
watch(autoHideDock, val => {
  Cookies.set('AUTO_HIDE_DOCK', val ? 'y' : 'n');
});
watch(autoHideInterval, val => {
  Cookies.set('AUTO_HIDE_INTERVAL', val.toString());
});
onMounted(() => {
  useUserStore().getInfo().then(res => userName.value = res.user.nickName);
  if(showCurrentTime.value) {
    setInterval(() => {
      const now = new Date();
      formattedDateTime.value = now.toLocaleDateString() + '<br>' + now.toLocaleTimeString();
    }, 1000);
  }
});
</script>

<template>
  <div
      id="display-panel"
  >
    <header class="panel-header">
      <div v-once class="panel-title">
        电网设备数字孪生管理系统
      </div>
      <img v-once src="/images/banner.svg" class="top-decoration" alt="hologram"/>
      <div class="header-background left-part">
        <img v-once
            alt="decoration" src="/images/bg-decoration-1.svg"
            style="height: 100%; margin: 0 -1.2em 0 0.5em;"
            @dragstart.prevent @contextmenu.prevent
        />
        <div class="header-text" style="font-size: small;">
          <span v-once style="font-weight: bold; text-shadow: 1pt 1pt rgba(100%,100%,100%,0.4); padding-bottom: 0.5em;">
            当前位置
          </span>
          <ElBreadcrumb style="margin-left: 0.5em;" :separator-icon="DArrowRight">
            <ElBreadcrumbItem to="map">全国</ElBreadcrumbItem>
            <ElBreadcrumbItem
                v-if="$route.name === 'substation-scene' && commonStore.get('CURRENT_SCENE_NAME')"
            >{{ commonStore.get('CURRENT_SCENE_NAME') }}
            </ElBreadcrumbItem>
          </ElBreadcrumb>
        </div>
      </div>
      <div class="header-background right-part">
        <DecoratedButton
            @click="onExitClicked"
            style="z-index: 8" type="hexagon" size="2rem" tooltip="退出登录">
          <svg v-once style="width: 100%; height: 100%;" viewBox="0 0 1024 1024">
            <path
                fill="url(#decorated-fill)"
                d="M768 640V512H448V384h320V256l192 192zm-64-64v256H384v192L0 832V0h704v320h-64V64H128l256 128v576h256V576z"
            />
          </svg>
        </DecoratedButton>
        <DecoratedButton
            @click="isSettingsOpen = true"
            style="z-index: 8" type="hexagon" size="2rem" tooltip="设置"
        >
          <teleport :to="dock.dockItemContainer" v-if="isSettingsOpen">
            <DockItem
                name="设置" icon="/images/settings.png"
                widget-client-width="32rem"
                widget-client-height="20rem"
                :open="isSettingsOpen" @widget-closed="isSettingsOpen = false"
            >
              <ElScrollbar>
                <div class="info-quote">
                  <ElIcon><InfoFilled/></ElIcon>
                  &ensp;<b>注意</b>：设置可能不会立即生效，但在下一次打开页面时，设置会被自动应用。
                </div>
                <ElForm label-width="auto" inline style="padding: 0 1em;">
                  <ElFormItem label="显示当前时间">
                    <ElSwitch v-model="showCurrentTime"/>
                  </ElFormItem>
                  <ElFormItem label="自动隐藏 Dock 栏">
                    <ElSwitch v-model="autoHideDock"/>
                  </ElFormItem>
                  <ElFormItem v-if="autoHideDock" label="自动隐藏的等待时间">
                    <ElSlider
                        style="padding-left: 1em; min-width: 20em;"
                        v-model="autoHideInterval"
                        :format-tooltip="val => val == 0 ? '立即隐藏' : val + ' 秒'"
                        :marks="{0: '立即隐藏', 60: '1 分钟'}"
                        show-stops show-input :step="1" :max="60" :min="0"
                    />
                  </ElFormItem>
                </ElForm>
              </ElScrollbar>
            </DockItem>
          </teleport>
          <svg v-once style="width: 100%; height: 100%;" viewBox="0 0 1024 1024">
            <path
                fill="url(#decorated-fill)"
                d="m940 596-76-57.6c.8-8 1.6-16.8 1.6-26.4s-.8-18.4-1.6-26.4l76-57.6c20.8-16 26.4-44 12.8-68L868 216.8c-9.6-16.8-28-27.2-47.2-27.2-6.4 0-12 .8-18.4 3.2L712 228c-15.2-10.4-31.2-19.2-47.2-26.4l-13.6-92c-4-26.4-26.4-45.6-53.6-45.6H426.4c-27.2 0-49.6 19.2-53.6 44.8L360 201.6c-16 7.2-31.2 16-47.2 26.4l-90.4-35.2c-6.4-2.4-12.8-3.2-19.2-3.2-19.2 0-37.6 9.6-46.4 26.4L71.2 360c-13.6 22.4-8 52 12.8 68l76 57.6c-.8 9.6-1.6 18.4-1.6 26.4s0 16.8 1.6 26.4L84 596c-20.8 16-26.4 44-12.8 68L156 807.2c9.6 16.8 28 27.2 47.2 27.2 6.4 0 12-.8 18.4-3.2L312 796c15.2 10.4 31.2 19.2 47.2 26.4l13.6 92C376 940 399.2 960 426.4 960h171.2c27.2 0 49.6-19.2 53.6-44.8l13.6-92.8c16-7.2 31.2-16 47.2-26.4l90.4 35.2c6.4 2.4 12.8 3.2 19.2 3.2 19.2 0 37.6-9.6 46.4-26.4l85.6-144.8C966.4 640 960.8 612 940 596m-236-84c0 105.6-86.4 192-192 192s-192-86.4-192-192 86.4-192 192-192 192 86.4 192 192"
            />
          </svg>
        </DecoratedButton>
        <div class="header-text">
          <span style="font-size: small;">欢迎您&ensp;</span><b>{{ userName }}</b>
          <span style="font-size: small;" v-if="showCurrentTime">&ensp;现在是&ensp;</span>
          <b style="font-size: small;" v-if="showCurrentTime" v-html="formattedDateTime"/>
        </div>
      </div>
    </header>
    <div class="panel-body">
      <RouterView v-slot="{ Component }">
        <Transition>
          <div :key="$route.path">
            <Component :is="Component"/>
          </div>
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style>
.msg-box {
  margin-top: 3.25em;
}
</style>

<style lang="scss" scoped>
:deep(.el-breadcrumb__separator path) {
  fill: url(#decorated-fill);
}
:deep(.el-breadcrumb__inner) {
  color: inherit;
}
:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: white;
}
:deep(.el-breadcrumb__separator) {
  margin: 0 0.1em;
}
.info-quote {
  margin: 1em;
  padding-left: 1em;
  color: rgba(0, 0, 0, 0.5);
  border-left: 3pt solid rgba(0, 0, 0, 0.5);
  font-size: smaller;
}
@font-face {
  font-family: 'YouSheBiaoTiHei';
  src: url('/fonts/YouSheBiaoTiHei.woff2') format('woff2'),
  url('/fonts/YouSheBiaoTiHei.woff') format('woff'),
  url('/fonts/YouSheBiaoTiHei.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
.top-decoration {
  height: 3.25rem;
  z-index: 4;
}
#display-panel {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
}
.panel-header {
  z-index: 10;
  color: #fff;
  font-size: x-large;
  position: absolute;
  display: flex;
  justify-content: center;
  left: 0;
  top: 0;
  width: 100vw;
  height: 3.25rem;
  animation: 1.25s ease-out 0s header-slide;
}
.header-text {
  font-size: medium;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #FFFFFF 0%, #C2E7FF 71%, #95D5FF 87%, #8DD2FF 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
.panel-title {
  display: inline-block;
  z-index: 5;
  font-size: 2rem;
  text-shadow: 1px 1px 3rem black;
  font-family: YouSheBiaoTiHei, serif;
  background-image: linear-gradient(to bottom, #fff 50%, #63D8FF 100%);
  background-size: 100%;
  background-clip: text;
  -webkit-text-fill-color: rgba(100%, 100%, 100%, 0.5);
  position: absolute;
  left: 50%;
  top: 5%;
  transform: translate(-50%, 0);
}
.panel-body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
.header-background {
  position: absolute;
  top: 0;
  height: 2.2rem;
  background: linear-gradient(to bottom, transparent, rgba(42, 167, 250, 0.2));
  display: flex;
  gap: 0.5em;
  &.left-part {
    left: 0;
    width: calc(50vw - 19rem);
    clip-path: polygon(
            0 0,
            calc(100% - 2.2rem) 0,
            100% 2.2rem,
            100% 100%,
            0 100%,
            0 0
    );
  }
  &.right-part {
    right: 0;
    width: calc(50vw - 19rem);
    flex-direction: row-reverse;
    clip-path: polygon(
            100% 0,
            2.2rem 0,
            0 100%,
            100% 100%,
            100% 0
    );
  }
}
@keyframes header-slide {
  from {
    top: -8rem;
  }
  to {
    top: 0;
  }
}
</style>