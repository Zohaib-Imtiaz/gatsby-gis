import React from "react";

interface CountryPopUpProps {
  overview: { Value: any; Indicator: { title: any; units: any } }[] | null;
  properties: { [key: string]: any } | undefined;
}

const CountryPopUp = ({ overview, properties }: CountryPopUpProps) => {
    console.log('POPUP ===>',overview, properties)
  return (
    <div>
      <h2>{properties?.name}</h2>
      <div>
        {overview?.map((element) => {
          return (
            <>
              <h3>{element?.Indicator.title}</h3>
              <p>{element?.Value}</p>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default CountryPopUp;
