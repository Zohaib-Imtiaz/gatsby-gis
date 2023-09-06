import * as React from "react";
import MapboxReact from "../../Mapbox/instance";
import { createClient } from "@supabase/supabase-js";
import {
  countriesPolygonClustersLayer,
  selectedCountryPolygonClustersLayer,
} from "../../Mapbox/layers/mapPageLayers";
import CountryPopUp from "../../components/CountryPopUp";
import Popup from "../../Mapbox/mapComponents/Popup";
import { LngLatLike } from "mapbox-gl";

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
  const [lngLat, setLngLat] = React.useState<LngLatLike | null>(null);
  const [dataLoading, setDataLoading] = React.useState(true);
  const [overviewData, setOverviewData] = React.useState<
    { Value: any; Indicator: { title: any; units: any }[] }[] | null
  >(null);

  console.log("BOUNDRIES===>", countriesBoundries);

  const fetchFromDB = React.useCallback(async () => {
    try {
      let { data, error } = await supabase.rpc("get_boundries_with_name", {
        take: 250,
      });
      if (error) throw error;

      const features: Feature[] = [];
      for (const element of data) {
        features.push({
          type: "Feature",
          geometry: JSON.parse(element.geojson),
          properties: { iso3: element.iso3, name: element.name },
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
    (data: mapboxgl.MapboxGeoJSONFeature[], position: LngLatLike) => {
      setSelectedCountryISO3(data[0].properties?.iso3);
      setLngLat(position);
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

  const popUp = React.useCallback(() => {
    console.log(
      "FUNCTION===>",
      overviewData,
      selectedCountry?.features[0].properties
    );
    return (
      <CountryPopUp
        overview={overviewData as any}
        properties={selectedCountry?.features[0].properties}
      />
    );
  }, [overviewData, selectedCountry]);

  const getSelectedCountryEconomicData = React.useCallback(async () => {
    if (selectedCountryISO3) {
      let { data: economic_outlook, error } = await supabase
        .from("economic_outlook")
        .select("Value, Indicator (title, units)")

        // Filters
        .eq("Country", selectedCountryISO3)
        .eq("Year", 2020)
        .or("Indicator.eq.BCA,Indicator.eq.GGXWDG,Indicator.eq.NGDPDPC");
      console.log(economic_outlook, error);
      setOverviewData(economic_outlook);
    }
  }, [selectedCountryISO3]);

  React.useEffect(() => {
    getSelectedCountryEconomicData();
  }, [getSelectedCountryEconomicData]);

  console.log('INDEX LNGLAT,', lngLat)

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
      onClick={(data, position) => {
        updateSelectedCountry(data as mapboxgl.MapboxGeoJSONFeature[], position);
      }}
    >
      <Popup show={true} lngLat={lngLat?? undefined}>
        {popUp()}
      </Popup>
    </MapboxReact>
  );
};

export default MapPage;
