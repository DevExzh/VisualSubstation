import {defineStore} from "pinia";

type K = string;
type V = string;

const useDictStore = defineStore('dict', {
    state: (): {
        dict: {
            key: K;
            value: V;
        }[];
    } => ({
        dict: []
    }),
    actions: {
        // 获取字典
        getDict(key: K): (V | undefined) {
            if (!key) return undefined
            try {
                for (let i = 0; i < this.dict.length; i++) {
                    if (this.dict[i].key == key) {
                        return this.dict[i].value;
                    }
                }
            } catch (e) {
                return undefined;
            }
        },
        // 设置字典
        setDict(key: K, value: V): void {
            if (key) {
                this.dict.push({key, value});
            }
        },
        // 删除字典
        removeDict(key: K): boolean {
            try {
                for (let i = 0; i < this.dict.length; i++) {
                    if (this.dict[i].key == key) {
                        this.dict.splice(i, 1);
                        return true;
                    }
                }
            } catch (e) {
                return false;
            }
            return false;
        },
        // 清空字典
        cleanDict() {
            this.dict.length = 0;
        },
    }
});

export default useDictStore;