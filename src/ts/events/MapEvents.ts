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