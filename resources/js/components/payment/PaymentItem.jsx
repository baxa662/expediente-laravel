import React from "react";
import { currencyFormatter } from "../../helpers/CurrencyFormatter";

export const PaymentItem = ({ item }) => {
  let classes;

  switch (item.type) {
    case "item":
      classes = "text-gray-500 text-sm";
      break;
    case "total":
      classes = "text-lg text-current";
      break;

    default:
      classes = "text-gray-500";
      break;
  }

  return (
    <div className="stat px-0 font-semibold">
      <div className={`stat-title flex justify-between ${classes}`}>
        <div>{item.name}</div>
        <div>
          {currencyFormatter({
            currency: "MXN",
            value: item.cost,
          })}
        </div>
      </div>
    </div>
  );
};
