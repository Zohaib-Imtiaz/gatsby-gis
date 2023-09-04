import * as React from "react";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "./map.css";

// mapboxgl.accessToken = process.env.GATSBY_MAPBOX_ACCESS_TOKEN ?? "";
mapboxgl.accessToken = "pk.eyJ1Ijoiem9oYWliLWltdGlheiIsImEiOiJjbGs5Mzl4aHQwaXN4M2Z0NXN6ODlnbm40In0.5nKs4NOrWTvgJvt9bAhw6Q";

function MapboxReact() {
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
  }, []);

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default MapboxReact;
