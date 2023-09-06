import * as React from "react";
import MapboxReact from "../../Mapbox/instance";
import { createClient } from "@supabase/supabase-js";
import {
  countriesPolygonClustersLayer,
  selectedCountryPolygonClustersLayer,
} from "../../Mapbox/layers/mapPageLayers";

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL as string,
  process.env.GATSBY_SUPABASE_KEY as string
);

const MapPage = () => {
  const [countriesBoundries, setCountiesBoundries] = React.useState<
    FeatureCollection | undefined
  >(undefined);
  const [selectedCountryISO3, setSelectedCountryISO3] = React.useState<
    string | undefined
  >(undefined);
  const [dataLoading, setDataLoading] = React.useState(true);

  console.log("BOUNDRIES===>", countriesBoundries);

  const fetchFromDB = React.useCallback(async () => {
    try {
      let { data, error } = await supabase.rpc("get_boundries", {
        take: 250,
      });
      if (error) throw error;

      const features: Feature[] = [];
      for (const element of data) {
        features.push({
          type: "Feature",
          geometry: JSON.parse(element.geojson),
          properties: { iso3: element.iso3 },
        });
      }
      setCountiesBoundries({
        type: "FeatureCollection",
        features: features,
      });
      setDataLoading(false);
    } catch (error) {
      console.error("Catched Error ===>", error);
    }
  }, []);

  React.useEffect(() => {
    fetchFromDB();
  }, []);

  const updateSelectedCountry = React.useCallback(
    (data: mapboxgl.MapboxGeoJSONFeature[]) => {
      setSelectedCountryISO3(data[0].properties?.iso3);
    },
    []
  );

  const selectedCountry = React.useMemo(() => {
    const selectedFeature = countriesBoundries?.features.find(
      (feat) => feat.properties.iso3 === selectedCountryISO3
    );
    console.log(selectedCountryISO3, selectedFeature, countriesBoundries);
    if (selectedFeature) {
      return {
        type: "FeatureCollection",
        features: [selectedFeature],
      } as FeatureCollection;
    }
    return undefined;
  }, [selectedCountryISO3]);

  return (
    <MapboxReact
      sources={
        dataLoading
          ? undefined
          : [
              {
                id: "countries",
                type: "geojson",
                source: countriesBoundries,
                layer: countriesPolygonClustersLayer,
              },
              {
                id: "selected_country",
                type: "geojson",
                source: selectedCountry,
                layer: selectedCountryPolygonClustersLayer,
              },
            ]
      }
      interactiveLayerIds={["countries"]}
      onClick={(data) => {
        updateSelectedCountry(data as mapboxgl.MapboxGeoJSONFeature[]);
      }}
      popup={{
        show: true,
        component: (() => {
          console.log(selectedCountry);
          return <h1>TESTING</h1>;
        })(),
      }}
    />
  );
};

export default MapPage;
