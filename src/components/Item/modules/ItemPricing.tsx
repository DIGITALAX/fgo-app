import { getAvailabilityLabel } from "@/lib/helpers/availability";
import { useItemPricing } from "../hooks/useItemPricing";
import { ItemPricingProps } from "../types";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

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
    <FancyBorder type="diamond" color="oro" className="text-sm bg-black p-6 space-y-4">
      <h3 className="text-lg font-agency uppercase text-white mb-4">
        {dict?.pricingSupply}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {showDigital && (
          <div className="space-y-2">
            <span className="text-oro font-agency">{dict?.digitalPrice}</span>
            <p className="text-white font-slim">{formattedDigitalPrice}</p>
          </div>
        )}

        {showPhysical && (
          <div className="space-y-2">
            <span className="text-oro font-agency">{dict?.physicalPrice}</span>
            <p className="text-white font-slim">{formattedPhysicalPrice}</p>
          </div>
        )}

        {"designId" in item ? (
          <>
            <div className="space-y-2">
              <span className="text-oro font-agency">
                {dict?.totalPurchases}
              </span>
              <p className="text-white font-slim">{item.totalPurchases}</p>
            </div>

            {showDigital && (
              <>
                <div className="space-y-2">
                  <span className="text-oro font-agency">
                    {dict?.maxDigital}
                  </span>
                  <p className="text-white font-slim">
                    {formatEditionLimit(item.maxDigitalEditions)}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-oro font-agency">
                    {dict?.currentDigital}
                  </span>
                  <p className="text-white font-slim">
                    {item.currentDigitalEditions}
                  </p>
                </div>
              </>
            )}

            {showPhysical && (
              <>
                <div className="space-y-2">
                  <span className="text-oro font-agency">
                    {dict?.maxPhysical}
                  </span>
                  <p className="text-white font-slim">
                    {formatEditionLimit(item.maxPhysicalEditions)}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-oro font-agency">
                    {dict?.currentPhysical}
                  </span>
                  <p className="text-white font-slim">
                    {item.currentPhysicalEditions}
                  </p>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="space-y-2">
              <span className="text-oro font-agency">{dict?.supplyCount}</span>
              <p className="text-white font-slim">{item.supplyCount}</p>
            </div>

            {showPhysical && (
              <>
                <div className="space-y-2">
                  <span className="text-oro font-agency">
                    {dict?.maxPhysical}
                  </span>
                  <p className="text-white font-slim">
                    {formatEditionLimit(item.maxPhysicalEditions)}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-oro font-agency">
                    Physical Fulfillments:
                  </span>
                  <p className="text-white font-slim">
                    {item.currentPhysicalEditions}
                  </p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <span className="text-oro font-agency">{dict?.usageCount}</span>
              <p className="text-white font-slim">{item.usageCount}</p>
            </div>
          </>
        )}

        <div className="space-y-2">
          <span className="text-oro font-agency">{dict?.status}:</span>
          <p className="text-white font-slim">{statusLabel}</p>
        </div>

        <div className="space-y-2">
          <span className="text-oro font-agency">{dict?.availability}:</span>
          <p className="text-white font-slim">
            {"designId" in item
              ? getAvailabilityLabel(item.availability, dict)
              : item.availability}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {"designId" in item ? (
          <>
            {showDigital && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rotate-45 ${
                    item.digitalMarketsOpenToAll === true
                      ? "bg-oro"
                      : "bg-gris/30"
                  }`}
                ></div>
                <span className="text-gris font-agency">
                  Digital Markets Open:{" "}
                  {item.digitalMarketsOpenToAll === true ? dict?.yes : dict?.no}
                </span>
              </div>
            )}

            {showPhysical && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5  rotate-45 ${
                    item.physicalMarketsOpenToAll === true
                      ? "bg-oro"
                      : "bg-gris/30"
                  }`}
                ></div>
                <span className="text-white font-agency">
                  Physical Markets Open:{" "}
                  {item.physicalMarketsOpenToAll === true
                    ? dict?.yes
                    : dict?.no}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5  rotate-45 ${
                  item.authorizedMarkets.length > 0 ? "bg-oro" : "bg-gris/30"
                }`}
              ></div>
              <span className="text-white font-agency">
                Authorized Markets: {item.authorizedMarkets.length}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5  rotate-45 ${
                  item.isImmutable ? "bg-fresa" : "bg-oro"
                }`}
              ></div>
              <span className="text-white font-agency">
                {item.isImmutable ? dict?.immutable : dict?.mutable}
              </span>
            </div>

            {showDigital && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rotate-45 ${
                    item.digitalMarketsOpenToAll ? "bg-oro" : "bg-gris/30"
                  }`}
                ></div>
                <span className="text-white font-agency">
                  Digital Markets Open:{" "}
                  {item.digitalMarketsOpenToAll ? dict?.yes : dict?.no}
                </span>
              </div>
            )}

            {showPhysical && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rotate-45 ${
                    item.physicalMarketsOpenToAll ? "bg-oro" : "bg-gris/30"
                  }`}
                ></div>
                <span className="text-white font-agency">
                  Physical Markets Open:{" "}
                  {item.physicalMarketsOpenToAll ? dict?.yes : dict?.no}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rotate-45 ${
                  item.standaloneAllowed === true ? "bg-oro" : "bg-gris/30"
                }`}
              ></div>
              <span className="text-white font-agency">
                Standalone:{" "}
                {item.standaloneAllowed === true ? dict?.yes : dict?.no}
              </span>
            </div>
          </>
        )}
      </div>
    </FancyBorder>
  );
};
