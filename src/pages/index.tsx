import * as React from "react";
import MapboxReact from "../Mapbox/instance";
import { createClient } from "@supabase/supabase-js";
import {
  countriesPolygonClustersLayer,
  selectedCountryPolygonClustersLayer,
} from "../Mapbox/layers/mapPageLayers";
import CountryPopUp from "../components/MapPopup/CountryPopUp";
import Popup from "../Mapbox/mapComponents/Popup";
import { LngLatLike } from "mapbox-gl";
import { ShapeLoader, WordLoader } from "../components/Loader/Loader";

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL as string,
  process.env.GATSBY_SUPABASE_KEY as string
);

const MapPage = () => {
  if (typeof window === "undefined") {
    // Code that uses `document` or browser-specific APIs
    console.log("OK");
    return <></>;
  }
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
  const [overviewDataFetchLoading, setOverviewDataFetchLoading] =
    React.useState(true);

  console.log("BOUNDRIES===>", countriesBoundries);

  const fetchFromDB = React.useCallback(async () => {
    try {
      let { data, error } = await supabase.rpc(
        "get_boundries_with_name_currency",
        {
          take: 250,
        }
      );
      if (error) throw error;

      const features: Feature[] = [];
      for (const element of data) {
        features.push({
          type: "Feature",
          geometry: JSON.parse(element.geojson),
          properties: {
            iso3: element.iso3,
            name: element.name,
            currency_code: element.currency_code,
          },
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
      setOverviewDataFetchLoading(true);
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
    if (overviewDataFetchLoading) {
      return <WordLoader />;
    }
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
        .select("Value, Indicator (id, title, units)")

        // Filters
        .eq("Country", selectedCountryISO3)
        .eq("Year", 2020)
        .or("Indicator.eq.BCA,Indicator.eq.GGXWDG,Indicator.eq.NGDPDPC");
      setOverviewData(economic_outlook);
      setOverviewDataFetchLoading(false);
    }
  }, [selectedCountryISO3]);

  React.useEffect(() => {
    getSelectedCountryEconomicData();
  }, [getSelectedCountryEconomicData]);

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
        updateSelectedCountry(
          data as mapboxgl.MapboxGeoJSONFeature[],
          position
        );
      }}
    >
      <Popup show={true} lngLat={lngLat ?? undefined}>
        {popUp()}
      </Popup>
      {dataLoading && (
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            padding: "10px",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            opacity: '0.5',
            top: '10px',
            left: '10px'
          }}
        >
          <div style={{ display: "flex" }}>
            <ShapeLoader /> <WordLoader />
          </div>
        </div>
      )}
    </MapboxReact>
  );
};

export default MapPage;
