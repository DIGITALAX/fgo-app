import { getAvailabilityLabel } from "@/lib/helpers/availability";
import { useItemPricing } from "../hooks/useItemPricing";
import { ItemPricingProps } from "../types";

export const ItemPricing = ({ item }: ItemPricingProps) => {
  const { formattedDigitalPrice, formattedPhysicalPrice, statusLabel } =
    useItemPricing(item);

  return (
    <div className="border border-white rounded-sm p-6 space-y-4">
      <h3 className="text-lg font-herm text-white mb-4">Pricing & Supply</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <span className="text-ama text-sm">Digital Price:</span>
          <p className="text-white font-herm">{formattedDigitalPrice}</p>
        </div>

        <div className="space-y-2">
          <span className="text-ama text-sm">Physical Price:</span>
          <p className="text-white font-herm">{formattedPhysicalPrice}</p>
        </div>

        {"designId" in item ? (
          <>
            <div className="space-y-2">
              <span className="text-ama text-sm">Total Purchases:</span>
              <p className="text-white font-herm">{item.totalPurchases}</p>
            </div>

            <div className="space-y-2">
              <span className="text-ama text-sm">Max Digital:</span>
              <p className="text-white font-herm">{item.maxDigitalEditions}</p>
            </div>

            <div className="space-y-2">
              <span className="text-ama text-sm">Max Physical:</span>
              <p className="text-white font-herm">{item.maxPhysicalEditions}</p>
            </div>

            <div className="space-y-2">
              <span className="text-ama text-sm">Current Digital:</span>
              <p className="text-white font-herm">
                {item.currentDigitalEditions}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-ama text-sm">Current Physical:</span>
              <p className="text-white font-herm">
                {item.currentPhysicalEditions}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <span className="text-ama text-sm">Supply Count:</span>
              <p className="text-white font-herm">{item.supplyCount}</p>
            </div>

            <div className="space-y-2">
              <span className="text-ama text-sm">Max Physical:</span>
              <p className="text-white font-herm">{item.maxPhysicalEditions}</p>
            </div>

            <div className="space-y-2">
              <span className="text-ama text-sm">Physical Fulfillments:</span>
              <p className="text-white font-herm">
                {item.currentPhysicalEditions}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-ama text-sm">Usage Count:</span>
              <p className="text-white font-herm">{item.usageCount}</p>
            </div>
          </>
        )}

        <div className="space-y-2">
          <span className="text-ama text-sm">Status:</span>
          <p className="text-white font-herm">{statusLabel}</p>
        </div>

        <div className="space-y-2">
          <span className="text-ama text-sm">Availability:</span>
          <p className="text-white font-herm">
            {"designId" in item
              ? getAvailabilityLabel(item.availability)
              : item.availability}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        {"designId" in item ? (
          <>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  item.digitalMarketsOpenToAll === "true"
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              ></div>
              <span className="text-ama">
                Digital Markets Open:{" "}
                {item.digitalMarketsOpenToAll === "true" ? "Yes" : "No"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  item.physicalMarketsOpenToAll === "true"
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              ></div>
              <span className="text-ama">
                Physical Markets Open:{" "}
                {item.physicalMarketsOpenToAll === "true" ? "Yes" : "No"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  item.authorizedMarkets.length > 0
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              ></div>
              <span className="text-ama">
                Authorized Markets: {item.authorizedMarkets.length}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  item.isImmutable ? "bg-red-500" : "bg-green-500"
                }`}
              ></div>
              <span className="text-ama">
                {item.isImmutable ? "Immutable" : "Mutable"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  item.digitalMarketsOpenToAll ? "bg-green-500" : "bg-gray-500"
                }`}
              ></div>
              <span className="text-ama">
                Digital Open: {item.digitalMarketsOpenToAll ? "Yes" : "No"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  item.physicalMarketsOpenToAll ? "bg-green-500" : "bg-gray-500"
                }`}
              ></div>
              <span className="text-ama">
                Physical Open: {item.physicalMarketsOpenToAll ? "Yes" : "No"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  item.standaloneAllowed === "true"
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              ></div>
              <span className="text-ama">
                Standalone: {item.standaloneAllowed === "true" ? "Yes" : "No"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
