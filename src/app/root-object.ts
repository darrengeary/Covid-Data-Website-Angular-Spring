export interface UniqueIdField {
    name: string;
    isSystemMaintained: boolean;
}

export interface SpatialReference {
    wkid: number;
    latestWkid: number;
}

export interface Field {
    name: string;
    type: string;
    alias: string;
    sqlType: string;
    length: number;
    domain?: any;
    defaultValue?: any;
}

export interface Attributes {
    ORIGID: number;
    CountyName: string;
    PopulationCensus16: number;
    IGEasting: number;
    IGNorthing: number;
    Lat: number;
    Long: number;
    CovidCaseroundUp: string;
    CovidCases: number;
    PopulationProportionCovidCases: number;
    x: number;
    y: number;
    ObjectId: number;
    UGI: string;
}

export interface Geometry {
    x: number;
    y: number;
}

export interface Feature {
    attributes: Attributes;
    geometry: Geometry;
}

export class RootObject {
    objectIdFieldName: string;
    uniqueIdField: UniqueIdField;
    globalIdFieldName: string;
    geometryType: string;
    spatialReference: SpatialReference;
    fields: Field[];
    features: Feature[];
 }