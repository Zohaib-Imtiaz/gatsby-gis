import { FillLayer } from "mapbox-gl";

export const countriesPolygonClustersLayer: Omit<FillLayer, "id"> = {
  type: "fill",
  //   maxzoom: 9,
  //   layout: {
  //     visibility: 'visible'
  //   },
  paint: {
    "fill-color": "#ff80ff", // blue color fill
    "fill-opacity": 0.5,
    "fill-outline-color": ["coalesce", ["get", "color"], "#000000"],
  },
  //     paint: {
  //   "fill-antialias": true,
  //   "fill-color": ["coalesce", ["get", "color"], "#28c2b3"],
  //   "fill-opacity": 0.35,
  //   "fill-outline-color": ["coalesce", ["get", "color"], "#28c2b3"],
  //     },
};
