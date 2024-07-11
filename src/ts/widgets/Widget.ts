import {defineStore} from "pinia";
import {ref, Ref} from "vue";

/**
 * 窗口状态
 */
export enum WindowState {
    Closed,
    Normal,
    Maximized,
    Minimized,
}

export class WidgetState {
    windowId: number = -1;
    windowState: WindowState = WindowState.Closed;
    windowTitle: Ref<string> = ref<string>('Window');
    fullscreen: Ref<boolean> = ref(false);
    zIndex: Ref<number> = ref<number>(10);
}

export const useWidgetStore = defineStore('widget', {
    state: (): {activeWidget: number, widgets: WidgetState[]} => ({
        activeWidget: -1,
        widgets: [],
    }),
});