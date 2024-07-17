import {FeatureProperties} from "../map/GeoJson.ts";

export class RegionClickEvent extends Event {
    public readonly region: FeatureProperties;
    public constructor(region: FeatureProperties) {
        super('region-click');
        this.region = region;
    }
}