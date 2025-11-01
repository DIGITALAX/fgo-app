import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";
import { useFulfillers } from "../../hooks/useFulfillers";
import { useMemo } from "react";
import { getIPFSUrl } from "@/lib/helpers/ipfs";
import { formatEther } from "viem";
import { FulfillerSelectionModalProps } from "../../types";

export const FulfillerSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
  infraId,
  dict,
  selectedAddress,
}: FulfillerSelectionModalProps) => {
  const {
    fulfillers,
    isLoading,
    hasMore,
    error,
    loadMore,
    refresh,
    searchText,
    setSearchText,
  } = useFulfillers(isOpen ? infraId : undefined);

  const normalizedSelected = selectedAddress?.toLowerCase();

  const handleSelect = (fulfiller: any) => {
    onSelect(fulfiller);
  };

  const list = useMemo(() => fulfillers, [fulfillers]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="absolute z-0 top-0 left-0 w-full h-full flex">
          <Image
            src="/images/borderblue.png"
            draggable={false}
            fill
            alt="border"
            className="object-fill"
          />
        </div>

        <div className="relative z-10 bg-black/85 p-6 flex-1 overflow-hidden flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2">
              <h2 className="text-2xl font-awk uppercase text-oro">
                {dict?.selectFulfiller}
              </h2>
              <p className="text-gris font-chicago text-sm">
                {dict?.selectFulfillerSubtitle}
              </p>
            </div>
            <div
              onClick={onClose}
              className="relative cursor-pointer hover:opacity-80 transition-opacity w-4 h-4"
            >
              <Image
                src="/images/plug.png"
                fill
                alt="close"
                draggable={false}
                className="object-contain"
              />
            </div>
          </div>

          <FancyBorder color="white" type="circle" className="relative">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={dict?.searchByTitlePlaceholder || dict?.search}
              className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none bg-transparent"
            />
          </FancyBorder>

          {error && (
            <div className="text-fresa text-sm font-chicago">{error}</div>
          )}

          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {list.length === 0 && !isLoading ? (
              <p className="text-center text-gris font-chicago text-sm">
                {dict?.noFulfillersFound}
              </p>
            ) : (
              list.map((fulfiller) => {
                const price =
                  fulfiller.basePrice && fulfiller.basePrice !== "0"
                    ? `${formatEther(BigInt(fulfiller.basePrice))} ${
                        dict?.ethSymbol || "ETH"
                      }`
                    : dict?.notAvailable || "N/A";
                const vig =
                  fulfiller.vigBasisPoints && fulfiller.vigBasisPoints !== "0"
                    ? `${(Number(fulfiller.vigBasisPoints) / 100).toFixed(2)}%`
                    : dict?.notAvailable || "N/A";
                const isSelected =
                  normalizedSelected &&
                  fulfiller.fulfiller?.toLowerCase() === normalizedSelected;

                return (
                  <FancyBorder
                    key={`${fulfiller.fulfillerId || fulfiller.fulfillerId}-${
                      fulfiller.fulfiller
                    }`}
                    type="diamond"
                    color={isSelected ? "oro" : "blue"}
                    className={`p-4 bg-black/70 transition-colors ${
                      isSelected ? "ring-2 ring-oro/60" : ""
                    }`}
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative w-24 h-24 flex-shrink-0 bg-offNegro/50">
                        {fulfiller.metadata?.image ? (
                          <Image
                            src={getIPFSUrl(fulfiller.metadata.image)}
                            fill
                            alt={
                              fulfiller.metadata?.title || fulfiller.fulfiller
                            }
                            className="object-cover"
                            draggable={false}
                          />
                        ) : (
                          <div className="w-full h-full" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <p className="text-white font-agency text-lg truncate">
                              {fulfiller.metadata?.title || fulfiller.fulfiller}
                            </p>
                            {fulfiller.metadata?.description && (
                              <p className="text-gris font-chicago text-xs line-clamp-2">
                                {fulfiller.metadata.description}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-chicago uppercase ${
                              fulfiller.isActive
                                ? "bg-oro/10 text-oro"
                                : "bg-fresa/10 text-fresa"
                            }`}
                          >
                            {fulfiller.isActive ? dict?.active : dict?.inactive}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-chicago text-gris">
                          <p className="break-all">
                            <span className="text-oro uppercase mr-1">
                              {dict?.address}:
                            </span>
                            {fulfiller.fulfiller}
                          </p>
                          <p>
                            <span className="text-oro uppercase mr-1">
                              {dict?.basePrice}:
                            </span>
                            {price}
                          </p>
                          <p>
                            <span className="text-oro uppercase mr-1">
                              {dict?.vigBasisPoints}:
                            </span>
                            {vig}
                          </p>
                          {fulfiller.metadata?.link && (
                            <a
                              href={fulfiller.metadata.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-oro hover:text-oro/70 underline"
                            >
                              {dict?.viewProfile}
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2 justify-end md:justify-between">
                        <button
                          type="button"
                          onClick={() => handleSelect(fulfiller)}
                          className="relative text-xs text-gris font-chicago lowercase flex px-4 py-2 bg-offNegro justify-center items-center hover:opacity-80"
                        >
                          <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                            <Image
                              src="/images/borderoro2.png"
                              draggable={false}
                              fill
                              alt="border"
                            />
                          </div>
                          <span className="relative z-10">
                            {isSelected ? dict?.selected : dict?.select}
                          </span>
                        </button>
                      </div>
                    </div>
                  </FancyBorder>
                );
              })
            )}

            {hasMore && !isLoading && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={loadMore}
                  className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro hover:opacity-80"
                >
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src="/images/borderoro2.png"
                      draggable={false}
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10">{dict?.loadMore}</span>
                </button>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <div className="relative w-fit animate-spin h-fit flex">
                  <div className="relative w-6 h-6 flex">
                    <Image
                      src="/images/scissors.png"
                      fill
                      alt="loading"
                      draggable={false}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                refresh();
              }}
              className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center hover:opacity-80"
            >
              <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                <Image
                  src="/images/borderoro2.png"
                  draggable={false}
                  fill
                  alt="border"
                />
              </div>
              <span className="relative z-10">{dict?.refresh}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center hover:opacity-80"
            >
              <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                <Image
                  src="/images/borderoro2.png"
                  draggable={false}
                  fill
                  alt="border"
                />
              </div>
              <span className="relative z-10">{dict?.close}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
