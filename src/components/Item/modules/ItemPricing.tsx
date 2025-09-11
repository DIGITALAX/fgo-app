import { getAvailabilityLabel } from "@/lib/helpers/availability";
import { useItemPricing } from "../hooks/useItemPricing";
import { ItemPricingProps } from "../types";

export const ItemPricing = ({ item, dict }: ItemPricingProps) => {
  const {
    formattedDigitalPrice,
    formattedPhysicalPrice,
    statusLabel,
    getAvailabilityType,
    formatEditionLimit,
  } = useItemPricing(item, dict);

  const { showDigital, showPhysical } = getAvailabilityType();

  return (
    <div className="border border-white rounded-sm p-6 space-y-4">
      <h3 className="text-lg font-herm text-white mb-4">{dict?.pricingSupply}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {showDigital && (
          <div className="space-y-2">
            <span className="text-ama text-sm">{dict?.digitalPrice}</span>
            <p className="text-white font-herm">{formattedDigitalPrice}</p>
          </div>
        )}

        {showPhysical && (
          <div className="space-y-2">
            <span className="text-ama text-sm">{dict?.physicalPrice}</span>
            <p className="text-white font-herm">{formattedPhysicalPrice}</p>
          </div>
        )}

        {"designId" in item ? (
          <>
            <div className="space-y-2">
              <span className="text-ama text-sm">{dict?.totalPurchases}</span>
              <p className="text-white font-herm">{item.totalPurchases}</p>
            </div>

            {showDigital && (
              <>
                <div className="space-y-2">
                  <span className="text-ama text-sm">{dict?.maxDigital}</span>
                  <p className="text-white font-herm">
                    {formatEditionLimit(item.maxDigitalEditions)}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-ama text-sm">{dict?.currentDigital}</span>
                  <p className="text-white font-herm">
                    {item.currentDigitalEditions}
                  </p>
                </div>
              </>
            )}

            {showPhysical && (
              <>
                <div className="space-y-2">
                  <span className="text-ama text-sm">{dict?.maxPhysical}</span>
                  <p className="text-white font-herm">
                    {formatEditionLimit(item.maxPhysicalEditions)}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-ama text-sm">{dict?.currentPhysical}</span>
                  <p className="text-white font-herm">
                    {item.currentPhysicalEditions}
                  </p>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="space-y-2">
              <span className="text-ama text-sm">{dict?.supplyCount}</span>
              <p className="text-white font-herm">{item.supplyCount}</p>
            </div>

            {showPhysical && (
              <>
                <div className="space-y-2">
                  <span className="text-ama text-sm">{dict?.maxPhysical}</span>
                  <p className="text-white font-herm">
                    {formatEditionLimit(item.maxPhysicalEditions)}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-ama text-sm">
                    Physical Fulfillments:
                  </span>
                  <p className="text-white font-herm">
                    {item.currentPhysicalEditions}
                  </p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <span className="text-ama text-sm">{dict?.usageCount}</span>
              <p className="text-white font-herm">{item.usageCount}</p>
            </div>
          </>
        )}

        <div className="space-y-2">
          <span className="text-ama text-sm">{dict?.status}:</span>
          <p className="text-white font-herm">{statusLabel}</p>
        </div>

        <div className="space-y-2">
          <span className="text-ama text-sm">{dict?.availability}:</span>
          <p className="text-white font-herm">
            {"designId" in item
              ? getAvailabilityLabel(item.availability, dict)
              : item.availability}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        {"designId" in item ? (
          <>
            {showDigital && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.digitalMarketsOpenToAll === true
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                ></div>
                <span className="text-ama">
                  Digital Markets Open:{" "}
                  {item.digitalMarketsOpenToAll === true ? dict?.yes : dict?.no}
                </span>
              </div>
            )}

            {showPhysical && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.physicalMarketsOpenToAll === true
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                ></div>
                <span className="text-ama">
                  Physical Markets Open:{" "}
                  {item.physicalMarketsOpenToAll === true ? dict?.yes : dict?.no}
                </span>
              </div>
            )}

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
                {item.isImmutable ? dict?.immutable : dict?.mutable}
              </span>
            </div>

            {showDigital && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.digitalMarketsOpenToAll
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                ></div>
                <span className="text-ama">
                  Digital Markets Open:{" "}
                  {item.digitalMarketsOpenToAll ? dict?.yes : dict?.no}
                </span>
              </div>
            )}

            {showPhysical && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.physicalMarketsOpenToAll
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                ></div>
                <span className="text-ama">
                  Physical Markets Open:{" "}
                  {item.physicalMarketsOpenToAll ? dict?.yes : dict?.no}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  item.standaloneAllowed === true
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              ></div>
              <span className="text-ama">
                Standalone: {item.standaloneAllowed === true ? dict?.yes : dict?.no}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
