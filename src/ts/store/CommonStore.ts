import {defineStore} from "pinia";

const useCommonStore = defineStore('common', {
    state: (): {
        map: Record<string, any>
    } => ({
        map: {}
    }),
    actions: {
        get<T>(key: string): T { return this.map[key] as T; },
        set(key: string, value: any): void { this.map[key] = value; },
        remove(key: string): void { if(this.map[key]) delete this.map[key]; },
        contains(key: string): boolean { return !!this.map[key]; },
        hasKey(key: string): boolean { return key in this.map; },
    }
});

export default useCommonStore;