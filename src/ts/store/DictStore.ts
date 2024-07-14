import {defineStore} from "pinia";
import {ref, toRefs} from "vue";
import Api from "../common/Api.ts";

type K = string;
type V = DictValue;

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

/**
 * 获取字典数据
 */
export type DictValue = {
    label: string;
    value: string;
    elTagType: string;
    elTagClass?: string;
};
const res = ref<Record<string, DictValue | DictValue[]>>({});
export function useDict(...args: string[]) {
    args.forEach((dictType: string, _: number) => {
        res.value[dictType] = [];
        const dict = useDictStore().getDict(dictType);
        if (dict) {
            res.value[dictType] = dict;
        } else {
            Api.System.Dict.Data.getDicts(dictType).then(resp => {
                res.value[dictType] = resp.data.map(p => ({
                    label: p.dictLabel,
                    value: p.dictValue,
                    elTagType: p.listClass,
                    elTagClass: p.cssClass
                }) as DictValue);
                useDictStore().setDict(dictType, res.value[dictType] as DictValue);
            })
        }
    });
    return toRefs(res.value);
}

export default useDictStore;