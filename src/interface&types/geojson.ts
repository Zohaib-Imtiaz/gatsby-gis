interface MultiPolygon_Geometry {
  type: "MultiPolygon";
  coordinates: [number, number][][][];
}

interface Polygon_Geometry {
  type: "Polygon";
  coordinates: [number, number][][];
}

interface MultiLineString_Geometry {
  type: "MultiLineString";
  coordinates: [number, number][][];
}

interface LineString_Geometry {
  type: "LineString";
  coordinates: [number, number][];
}

interface MultiPoint_Geometry {
  type: "MultiPoint";
  coordinates: [number, number][];
}

interface Point_Geometry {
  type: "Point";
  coordinates: [number, number];
}

interface Feature {
  type: "Feature";
  geometry:
    | Point_Geometry
    | MultiPoint_Geometry
    | LineString_Geometry
    | MultiLineString_Geometry
    | Polygon_Geometry
    | MultiPolygon_Geometry;
  properties: {
    [key: string]: any;
  };
  id?: string | number;
  bbox?:
    | [number, number, number, number] //2D
    | [number, number, number, number, number, number]; //3D
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}
