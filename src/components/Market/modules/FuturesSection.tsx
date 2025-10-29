"use client";

import { FuturesSectionProps } from "../types";
import { truncateAddress } from "@/lib/helpers/address";
import { formatPrice } from "@/lib/helpers/price";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const FuturesSection = ({
  futures,
  infraCurrency,
  dict,
  availability,
}: FuturesSectionProps) => {
  const [formattedPrice, setFormattedPrice] = useState<string>("");
  const [formattedPurchasePrices, setFormattedPurchasePrices] = useState<
    Map<number, string>
  >(new Map());

  useEffect(() => {
    const loadPrice = async () => {
      if (futures && futures.pricePerUnit) {
        const price = await formatPrice(futures.pricePerUnit, infraCurrency);
        setFormattedPrice(price);
      }
    };
    loadPrice();
  }, [futures, infraCurrency]);

  useEffect(() => {
    const loadPurchasePrices = async () => {
      if (!futures?.purchases || futures.purchases.length === 0) return;

      const priceMap = new Map<number, string>();
      for (let i = 0; i < futures.purchases.length; i++) {
        const purchase = futures.purchases[i];
        if (purchase.totalCost) {
          const formattedCost = await formatPrice(
            purchase.totalCost,
            infraCurrency
          );
          priceMap.set(i, formattedCost);
        }
      }
      setFormattedPurchasePrices(priceMap);
    };
    loadPurchasePrices();
  }, [futures, infraCurrency]);

  if (!futures) {
    return null;
  }

  const deadline =
    futures.deadline && futures.deadline !== "0"
      ? formatDistanceToNow(new Date(Number(futures.deadline) * 1000), {
          addSuffix: true,
        })
      : dict?.perpetual;

  const supplierAddress = truncateAddress(futures.supplier);

  const formattedDate = futures.blockTimestamp
    ? new Date(parseInt(futures.blockTimestamp) * 1000).toLocaleDateString()
    : "";

  return (
    <FancyBorder type="circle" color="verde" className="bg-black p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-agency uppercase text-white">
          {dict?.futuresPosition}
        </h3>
        <a
          href="https://futures.themanufactory.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-oro hover:text-oro/80 font-awk text-sm uppercase underline"
        >
          {dict?.tradeFutures}
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <span className="text-oro font-agency">{dict?.supplier}</span>
          <p className="text-white font-slim">{supplierAddress}</p>
        </div>

        <div className="space-y-2">
          <span className="text-oro font-agency">{dict?.pricePerUnit}</span>
          <p className="text-white font-slim">{formattedPrice}</p>
        </div>

        <div className="space-y-2">
          <span className="text-oro font-agency">{dict?.deadline}</span>
          <p className="text-white font-slim">{deadline}</p>
        </div>

        <div className="space-y-2">
          <span className="text-oro font-agency">
            {dict?.totalAmount}
          </span>
          <p className="text-white font-slim">{futures.totalAmount}</p>
        </div>

        <div className="space-y-2">
          <span className="text-oro font-agency">
            {dict?.soldAmount}
          </span>
          <p className="text-white font-slim">{futures.soldAmount}</p>
        </div>

        {formattedDate && (
          <div className="space-y-2">
            <span className="text-oro font-agency">{dict?.created}</span>
            <p className="text-white font-slim">{formattedDate}</p>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rotate-45 ${
              futures.isActive ? "bg-oro" : "bg-gris/30"
            }`}
          ></div>
          <span className="text-white font-agency">
            {futures.isActive ? dict?.active : dict?.inactive}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rotate-45 ${
              futures.isSettled ? "bg-oro" : "bg-gris/30"
            }`}
          ></div>
          <span className="text-white font-agency">
            {dict?.settled}: {futures.isSettled ? dict?.yes : dict?.no}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rotate-45 ${
              futures.closed ? "bg-fresa" : "bg-oro"
            }`}
          ></div>
          <span className="text-white font-agency">
            {dict?.closed}: {futures.closed ? dict?.yes : dict?.no}
          </span>
        </div>
      </div>

      {futures.purchases && futures.purchases.length > 0 && (
        <div className="pt-4 border-t border-oro/30">
          <h4 className="text-base font-agency uppercase text-oro mb-3">
            {dict?.purchases}
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {futures.purchases.map((purchase, index) => (
              <div
                key={index}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-offNegro/30"
              >
                <div className="space-y-1">
                  <span className="text-gris font-agency text-xs">
                    {dict?.buyer}
                  </span>
                  <p className="text-white font-slim text-xs">
                    {truncateAddress(purchase.buyer)}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-gris font-agency text-xs">
                    {availability == dict?.physicalOnly
                      ? dict?.physical
                      : dict?.digital}
                  </span>
                  <p className="text-white font-slim text-xs">
                    {purchase.amount}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-gris font-agency text-xs">
                    {dict?.totalCost}
                  </span>
                  <p className="text-white font-slim text-xs">
                    {formattedPurchasePrices.get(index) || purchase.totalCost}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </FancyBorder>
  );
};
