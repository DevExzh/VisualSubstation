interface Point {
    longitude: number;
    latitude: number;
}

interface Substation {
    id: string;
    type: number;
    name: string;
    statusCode: number;
    status: string;
    sensorCount: number;
    center: Point;
    province: string;
    city: string;
    district: string;
    location: string;
    voltageLevel: number | null;
    capacity: number;
    operationalSince: string;
    lastMaintenance: string | null;
}