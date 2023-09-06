import * as React from "react";
import mapboxgl, {
  AnyLayer,
  GeoJSONSourceOptions,
  LngLatLike,
  MapboxGeoJSONFeature,
  Source,
} from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./map.css";

mapboxgl.accessToken = process.env.GATSBY_MAPBOX_ACCESS_TOKEN as string;

export const MapContext = React.createContext<mapboxgl.Map | null>(null);
interface MapboxReactProps {
  sources?: {
    id: string;
    type: Source["type"];
    source: GeoJSONSourceOptions["data"] | null;
    layer?: Omit<AnyLayer, "id">;
  }[];
  interactiveLayerIds?: string[];
  onClick?: (
    data: MapboxGeoJSONFeature[] | undefined,
    lngLat: LngLatLike
  ) => void;
  children?: React.ReactNode;
}

function MapboxReact({
  sources,
  interactiveLayerIds,
  onClick,
  children,
}: MapboxReactProps) {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) {
      return;
    }
    map.current =
      new mapboxgl.Map({
        container: mapContainer.current ?? "",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
      }) ?? "";
    map.current.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
      })
    );
  }, []);

  const addSources = React.useCallback(() => {
    if (map.current === null) {
      return;
    }
    if (sources instanceof Array) {
      for (const source of sources) {
        if (source.source) {
          const sourceLayer = map.current.getSource(source.id);
          if (sourceLayer) {
            if (sourceLayer.type === "geojson") {
              sourceLayer.setData(source.source as FeatureCollection);
            }
          } else {
            map.current.addSource(source.id, {
              type: "geojson",
              data: source.source,
            });
          }
          if (source.layer) {
            const layerSource = map.current.getLayer(source.id);
            if (layerSource) {
              console.log("Layer Already exists");
              map.current.removeLayer(source.id);
            }
            map.current.addLayer({
              ...source.layer,
              id: source.id,
              source: source.id,
            } as AnyLayer);
          }
        }
      }
    }
  }, [sources]);

  const addControls = React.useCallback(() => {
    if (map.current === null || interactiveLayerIds === undefined) return;
    map.current.on("click", interactiveLayerIds as string[], (e) => {
      if (onClick) onClick(e.features, e.lngLat);
    });
  }, []);

  useEffect(() => {
    if (map.current && map.current.loaded() && sources && sources?.length > 0) {
      addSources();
      addControls();
    }
  }, [addSources]);

  return (
    <div ref={mapContainer} className="map-container">
      <MapContext.Provider value={map.current}>{children}</MapContext.Provider>
    </div>
  );
}

export default MapboxReact;
