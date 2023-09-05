import * as React from "react";
import MapboxReact from "../../Mapbox/instance";
import { createClient } from "@supabase/supabase-js";
import { countriesPolygonClustersLayer } from "../../Mapbox/layers/mapPageLayers";

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL as string,
  process.env.GATSBY_SUPABASE_KEY as string
);

const MapPage = () => {
  const [countriesBoundries, setCountiesBoundries] = React.useState<
    FeatureCollection | undefined
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
            ]
      }
      interactiveLayerIds={['countries']}
      popup={{
        show:true,
        component(data) {
          console.log(data)
          return <h1>TESTING</h1>
        },
      }}
    />
  );
};

export default MapPage;
