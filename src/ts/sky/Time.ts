import {SkyRenderer} from "../renderers/sky/SkyRenderer.ts";
//import {deltaTime} from "./helpers/Helper.ts";
import {RenderObject} from "../common/RenderObject.ts";

export class Time extends RenderObject {
    DayLengthInMinutes: number = 30;
    //UpdateInterval: number = 0;
    ProgressDate: boolean = true;
    ProgressMoonPhase: boolean = true;

    private sky: SkyRenderer;
    public deltaTime: number = 1 / 30;

    constructor(sky: SkyRenderer) {
        super();
        this.sky = sky;
    }

    update() {
        //if (this.deltaTime < this.UpdateInterval) return;

        const oneDay = this.DayLengthInMinutes * 60;
        const oneHour = oneDay / 24;

        const hourIter = this.deltaTime / oneHour;
        const moonIter = this.deltaTime / (30 * oneDay) * 2;

        this.sky.cycle.hour += hourIter;

        if (this.ProgressMoonPhase) {
            this.sky.cycle.moonPhase += moonIter;
            if (this.sky.cycle.moonPhase < -1) {
                this.sky.cycle.moonPhase = 1;
            } else if (this.sky.cycle.moonPhase > 1) {
                this.sky.cycle.moonPhase = -1;
            }
        }

        if (this.sky.cycle.hour >= 24) {
            this.sky.cycle.hour = 0;

            if (this.ProgressDate) {
                const daysInMonth = new Date(this.sky.cycle.year, this.sky.cycle.month, 0).getDate();
                if (++this.sky.cycle.day > daysInMonth) {
                    this.sky.cycle.day = 1;
                    if (++this.sky.cycle.month > 12) {
                        this.sky.cycle.month = 1;
                        this.sky.cycle.year++;
                    }
                }
            }
        }
    }
}