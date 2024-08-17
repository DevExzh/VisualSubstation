import {Component} from "vue";

export interface Section {
    name: string;
    description?: string;
    children?: Section[];
    component?: Component | (() => Promise<Component>) | string;
}