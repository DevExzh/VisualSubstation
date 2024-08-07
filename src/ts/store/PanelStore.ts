import {defineStore} from "pinia";

const usePanelStore = defineStore('panel', {
    state: (): {
        setFunctions: ((value: boolean, onlyThis: boolean) => void)[]
    } => ({
        setFunctions: []
    }),
    actions: {
        setVisibility(visible: boolean) {
            this.setFunctions.forEach(f => f(visible, true));
        }
    }
});

export default usePanelStore;