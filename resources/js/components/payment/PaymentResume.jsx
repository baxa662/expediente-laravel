import React from "react";
import { PaymentItem } from "./PaymentItem";

export const PaymentResume = ({ items, isLoading }) => {
  return (
    <div className="bg-gray-100 card rounded-md">
      <div className="card-body">
        <div className="card-title">Resumen</div>
        <div className="stats stats-vertical rounded-none bg-transparent">
          {isLoading ? (
            <div className="flex justify-center w-full max-md:h-[50vh]">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : items ? (
            items.map((item) => <PaymentItem item={item} />)
          ) : (
            <div className="flex justify-center">No se encontraron items</div>
          )}
        </div>
      </div>
    </div>
  );
};
