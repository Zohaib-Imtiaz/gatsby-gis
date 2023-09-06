import React from "react";
import {
  currencyAndUnit,
  keysOfCurrencyAndUnit,
} from "../../constants/currencyAndUnit";
import { currency } from "../../utils/intl";
import * as classes from './CountryPopUp.module.css';

interface CountryPopUpProps {
  overview:
    | { Value: any; Indicator: { id: any; title: any; units: any } }[]
    | null;
  properties: { [key: string]: any } | undefined;
}

const CountryPopUp = ({ overview, properties }: CountryPopUpProps) => {
  console.log("POPUP ===>", overview, properties);

  const displayValue = (unit: keysOfCurrencyAndUnit, value: number) => {
    if (currencyAndUnit[unit] === "USA") {
      return currency(value, "USD");
    }
    if (currencyAndUnit[unit] === "SELF") {
      return currency(value, properties?.currency_code);
    }
    if (currencyAndUnit[unit] === "PERCENT") {
      return `${value}%`;
    }
    if (currencyAndUnit[unit] === "DECIMAL") {
      return value;
    }
    return value;
  };

  return (
    <div>
      <h2>{properties?.name}</h2>
      <div>
        {overview?.map((element) => {
          return (
            <React.Fragment key={element?.Value}>
              <div className={classes.space_between}>
                <span className={classes.field}>{element?.Indicator.id}: </span>
                <span>
                  {displayValue(element?.Indicator.units, element?.Value)}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CountryPopUp;
