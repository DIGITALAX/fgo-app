import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";
import { ItemSupplyRequestsProps } from "../types";
import { formatPrice } from "@/lib/helpers/price";

export const ItemSupplyRequests = ({
  supplyRequests,
  dict,
  infraCurrency,
}: ItemSupplyRequestsProps) => {
  const router = useRouter();
  const [formattedMaxPrices, setFormattedMaxPrices] = useState<
    Record<string, string>
  >({});

  const supplyRequestsKey = useMemo(
    () => supplyRequests.map((request) => request.id).join("|"),
    [supplyRequests]
  );

  useEffect(() => {
    const loadPrices = async () => {
      if (!infraCurrency) {
        setFormattedMaxPrices({});
        return;
      }

      const entries = await Promise.all(
        supplyRequests.map(async (request) => {
          if (!request.preferredMaxPrice) {
            return [request.id, ""];
          }

          try {
            const price = await formatPrice(
              request.preferredMaxPrice,
              infraCurrency
            );
            return [request.id, price];
          } catch {
            return [request.id, ""];
          }
        })
      );

      setFormattedMaxPrices(
        entries.reduce<Record<string, string>>((acc, [id, value]) => {
          acc[id] = value;
          return acc;
        }, {})
      );
    };

    loadPrices();
  }, [infraCurrency, supplyRequestsKey, supplyRequests]);

  if (!supplyRequests || supplyRequests.length === 0) {
    return null;
  }

  return (
    <FancyBorder className="relative p-4" type="diamond" color="oro">
      <div className="relative z-10 space-y-3">
        <h3 className="text-oro font-awk text-xl uppercase">
          {dict?.supplyRequests}
        </h3>

        <div className="space-y-2">
          {supplyRequests.map((request, index) => (
              <div
                key={index}
                onClick={() => router.push(`/market/supply-request/${request.id}`)}
                className="relative cursor-pointer hover:opacity-80 transition-opacity"
              >
                <FancyBorder className="relative p-3" type="circle" color="white">
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gris font-chicago text-sm">
                          {request.isPhysical ? dict?.physical : dict?.digital}
                        </span>
                        {request.paid && (
                          <span className="text-green-500 font-chicago text-xs uppercase">
                            {dict?.fulfilled}
                          </span>
                        )}
                        {!request.paid && (
                          <span className="text-ama font-chicago text-xs uppercase">
                            {dict?.pending}
                          </span>
                        )}
                      </div>
                      <div className="relative w-4 h-4 rotate-180">
                        <Image
                          src={"/images/arrow.png"}
                          draggable={false}
                          fill
                          objectFit="contain"
                          alt="arrow"
                          className="rotate-180"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-chicago">
                      <div>
                        <span className="text-oro">{dict?.quantity}: </span>
                        <span className="text-gris">{request.quantity}</span>
                      </div>
                      <div>
                        <span className="text-oro">{dict?.maxPrice}: </span>
                        <span className="text-gris">
                          {formattedMaxPrices[request.id] ||
                            request.preferredMaxPrice}
                        </span>
                      </div>
                    </div>

                    {request.existingChildId !== "0" && (
                      <div className="text-xs font-chicago">
                        <span className="text-oro">{dict?.existingChild}: </span>
                        <span className="text-gris truncate">
                          {request.existingChildId}
                        </span>
                      </div>
                    )}
                  </div>
                </FancyBorder>
              </div>
            ))}
        </div>
      </div>
    </FancyBorder>
  );
};
