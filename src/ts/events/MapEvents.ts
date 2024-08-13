import {FeatureProperties} from "../map/GeoJson.ts";

export class RegionClickEvent extends Event {
    public readonly region?: FeatureProperties;
    public readonly isCancelled: boolean;
    public constructor(region?: FeatureProperties, isCancelled: boolean = false) {
        super('region-click');
        this.region = region;
        this.isCancelled = isCancelled;
    }
}

export class SpriteCreationEvent extends Event {
    public readonly position: [number, number, number];
    public readonly userData?: Record<string, any>;
    public constructor(position: [number, number, number], userData?: Record<string, any>) {
        super('sprite-create');
        this.position = position;
        this.userData = userData;
    }
}

export class SpriteDeleteEvent extends Event {
    public constructor() {
        super('sprite-delete');
    }
}