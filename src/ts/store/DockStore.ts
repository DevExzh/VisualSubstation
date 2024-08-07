import {defineStore} from "pinia";

export interface DockSettings {
    autoHide?: boolean;
    iconSize?: number | string;
    offset?: number;
    scaleFactor?: number;
    spacing?: number | string;
}

export const useDockStore = defineStore('dock', {
    state: (): {
        dockItemContainer?: HTMLUListElement;
    } & DockSettings => ({
        dockItemContainer: undefined
    }),
});

export default useDockStore;