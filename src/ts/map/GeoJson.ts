export type Point2D = [number, number];
export type Point3D = [number, number, number];
export type CoordinatePoint = Point2D | Point3D;

export interface MultiPolygon {
    type: 'MultiPolygon';
    coordinates: CoordinatePoint[][][];
}

export interface Polygon {
    type: 'Polygon';
    coordinates: CoordinatePoint[][];
}

export interface MultiPoint {
    type: 'MultiPoint';
    coordinates: CoordinatePoint[];
}

export interface Point {
    type: 'point';
    coordinates: CoordinatePoint;
}

export type GeometryType = Point | MultiPoint | Polygon | MultiPolygon;

export type FeatureProperties = {
    adcode: number;
    name: string;
    center: [number, number];
    centroid: [number, number];
    childrenNum: number;
    level: 'province' | 'city' | 'state';
    parent: {
        adcode: number;
    },
    subFeatureIndex: number;
    acroutes: number[];
}

export interface Feature {
    type: 'Feature';
    properties: FeatureProperties;
    geometry: GeometryType;
}

export interface FeatureCollection {
    type: 'FeatureCollection';
    features: Feature[];
}