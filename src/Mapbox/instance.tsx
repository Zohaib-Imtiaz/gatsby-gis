import * as React from "react";
import { createRoot } from "react-dom/client";
import mapboxgl, {
  AnyLayer,
  AnySourceData,
  GeoJSONSourceOptions,
  Map,
  MapboxGeoJSONFeature,
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
  interactiveLayerIds?: string[];
  popup?: {
    show: true | false;
    component: JSX.Element;
  };
  onClick?: (data: MapboxGeoJSONFeature[] | undefined) => void;
}

function addPopup(reactNode: JSX.Element | undefined, lngLat: mapboxgl.LngLat) {
  const popupUINode = document.createElement("div");
  popupUINode.setAttribute("id", "map-popup");
  const popupUIRootElement = createRoot(popupUINode);
  popupUIRootElement.render(reactNode ?? <h1>NO UI</h1>);

  const marker = new mapboxgl.Popup()
    .setDOMContent(popupUINode)
    .setLngLat(lngLat);

  return marker;
}

function MapboxReact({
  sources,
  interactiveLayerIds,
  popup,
  onClick,
}: MapboxReactProps) {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  const popupRef = useRef<mapboxgl.Popup | null>(null);

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
      if (onClick) onClick(e.features);
      if (popup?.show) {
        if (popupRef.current === null) {
          popupRef.current = addPopup(
            popup?.component,
            e.lngLat
          ).addTo(map.current as Map);
        } else {
          popupRef.current.remove();
          popupRef.current = null;
        }
      }
    });
  }, []);

  useEffect(() => {
    if (map.current && map.current.loaded() && sources && sources?.length > 0) {
      addSources();
      addControls();
    }
  }, [addSources]);

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default MapboxReact;
