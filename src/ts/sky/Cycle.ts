export enum MoonPositionType {
    OppositeToSun,
    Realistic
}

export class Cycle {
    private data: any = {
        hour: 0,
        day: 23,
        month: 5,
        year: 2004,
        moonPhase: 0.000001,
        moonPosition: MoonPositionType.OppositeToSun,
        latitude: 31.23,
        longitude: 121.47,
        timeZone: 0
    };

    get hour(): number {
        return this.data.hour;
    }
    set hour(value: number) {
        this.data.hour = value;
    }

    get day(): number {
        return this.data.day;
    }
    set day(value: number) {
        this.data.day = value;
    }

    get month(): number {
        return this.data.month;
    }
    set month(value: number) {
        if(value >= 1 && value <= 12) {
            this.data.month = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    get year(): number {
        return this.data.year;
    }
    set year(value: number) {
        if(value >= 1 && value <= 9999) {
            this.data.year = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 经度（单位：度），0 为本初子午线，-180 为格林威治西方，180 为其东方
     * @prop
     * @default 0
     */
    get longitude(): number {
        return this.data.longitude;
    }
    set longitude(value: number) {
        if(value >= -180 && value <= 180) {
            this.data.longitude = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 纬度（单位：度），90 为北极、0 为赤道、-90 为南极
     * @prop
     * @default 0
     */
    get latitude(): number {
        return this.data.latitude;
    }
    set latitude(value: number) {
        if(value >= -90 && value <= 90) {
            this.data.latitude = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    /**
     * 月相：0 为满月，1 或 -1 为新月
     * @prop
     * @default 0
     */
    get moonPhase(): number {
        return this.data.moonPhase;
    }
    set moonPhase(value: number) {
        this.data.moonPhase = value;
    }

    get moonPosition(): MoonPositionType {
        return this.data.moonPosition;
    }
    set moonPosition(value: MoonPositionType) {
        this.data.moonPosition = value;
    }

    /**
     * 时区：0 表示 UTC 时区，中国上海时区为 UTC+8
     * @prop
     * @default 0
     */
    get timeZone(): number {
        return this.data.timeZone;
    }
    set timeZone(value: number) {
        if(value >= -12 && value <= 12) {
            this.data.timeZone = value;
        } else {
            throw new Error('Invalid value range');
        }
    }

    get dateTime(): Date {
        return new Date(
            this.data.year, this.data.month,
            this.data.day, this.data.hour,
            0, 0
        );
    }
    set dateTime(value: Date) {
        this.data.year = value.getUTCFullYear();
        this.data.month = value.getUTCMonth();
        this.data.day = value.getUTCDay();
        this.data.hour = value.getHours();
    }

    get timeStamp(): number {
        return this.dateTime.getTime();
    }
    set timeStamp(value: number) {
        this.dateTime = new Date(value);
    }
}