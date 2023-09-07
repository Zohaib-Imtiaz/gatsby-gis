import React from "react";
import {
  currencyAndUnit,
  keysOfCurrencyAndUnit,
} from "../../constants/currencyAndUnit";
import { currency } from "../../utils/intl";
import * as classes from "./CountryPopUp.module.css";
import { SimpleToolTip } from "../Tooltip/Tooltip";

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
      <div className={classes.popup_container}>
        {overview?.map((element) => {
          return (
            <React.Fragment key={element?.Value}>
              <div className={classes.space_between}>
                <SimpleToolTip
                  tooltip={
                    <>
                      <h3 className={classes.tooltip_heading}>{element?.Indicator.id}</h3>
                      <span>
                        {element?.Indicator.title} in {element?.Indicator.units}
                      </span>
                    </>
                  }
                >
                  <span className={classes.field}>
                    {element?.Indicator.id}:{" "}
                  </span>
                </SimpleToolTip>
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
