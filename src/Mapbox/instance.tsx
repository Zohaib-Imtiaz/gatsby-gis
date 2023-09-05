import * as React from "react";
import mapboxgl, {
  AnyLayer,
  AnySourceData,
  GeoJSONSourceOptions,
  Source,
} from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./map.css";

mapboxgl.accessToken = process.env.GATSBY_MAPBOX_ACCESS_TOKEN as string;

interface MapboxReactProps {
  sources?: {
    id: string;
    type: Source["type"];
    source: GeoJSONSourceOptions["data"] | null;
    layer?: Omit<AnyLayer, "id">;
  }[];
}

function MapboxReact({ sources }: MapboxReactProps) {
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
  console.log("HELLO", sources);

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
              console.log('Layer Already exists')
            } else {
              map.current.addLayer({
                ...source.layer,
                id: source.id,
                source: source.id,
              } as AnyLayer);
            }
          }
        }
      }
    }
  }, [sources]);

  useEffect(() => {
    if (map.current && map.current.loaded() && sources && sources?.length > 0) {
      addSources();
    }
  }, [addSources]);

  console.log(
    map.current?.getLayer("countries"),
    map.current?.getSource("countries")
  );

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default MapboxReact;
