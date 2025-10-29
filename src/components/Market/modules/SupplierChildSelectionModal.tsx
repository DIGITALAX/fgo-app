import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";
import { useMemo } from "react";
import { getIPFSUrl } from "@/lib/helpers/ipfs";
import { SupplierChildSelectionModalProps } from "../types";

export const SupplierChildSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
  childrenList,
  isLoading,
  hasMore,
  loadMore,
  dict,
  searchText,
  setSearchText,
  proposingChildId,
}: SupplierChildSelectionModalProps) => {
  const filteredChildren = useMemo(() => {
    if (!searchText) {
      return childrenList;
    }

    const query = searchText.toLowerCase();
    return childrenList.filter((child) => {
      const title = child.metadata?.title?.toLowerCase() ?? "";
      const idMatch = child.childId.toLowerCase().includes(query);
      const titleMatch = title.includes(query);
      return idMatch || titleMatch;
    });
  }, [childrenList, searchText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
        <div className="relative z-10 bg-black/80 p-6 overflow-y-auto space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-awk uppercase text-oro">
                {dict?.supplyRequestSelectChild}
              </h2>
              <p className="text-gris font-chicago text-sm mt-1">
                {dict?.supplyRequestSelectChildSubtitle ||
                  "Choose one of your children to propose this supply match."}
              </p>
            </div>
            <div
              onClick={onClose}
              className="relative cursor-pointer hover:opacity-80 transition-opacity w-4 h-4"
            >
              <Image
                src="/images/plug.png"
                draggable={false}
                fill
                alt="close"
                className="object-contain"
              />
            </div>
          </div>

          <div>
            <FancyBorder color="white" type="circle" className="relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={dict?.search}
                className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
              />
            </FancyBorder>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {filteredChildren.map((child) => (
              <FancyBorder
                key={`${child.childContract}-${child.childId}`}
                color="oro"
                type="diamond"
                className="bg-black/60 p-4"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    {child.metadata?.image ? (
                      <Image
                        src={getIPFSUrl(child.metadata.image)}
                        fill
                        alt={child.metadata?.title || child.childId}
                        className="object-contain"
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full bg-offNegro" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <h4 className="text-white font-agency text-lg truncate">
                        {child.metadata?.title ||
                          `${dict?.child} ${child.childId}`}
                      </h4>
                      <span className="px-2 py-1 bg-oro/10 text-oro text-xs font-slim uppercase">
                        {child.availability}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-chicago text-gris">
                      <p>
                        <span className="text-oro uppercase mr-1">ID:</span>
                        {child.childId}
                      </p>
                      <p className="break-all">
                        <span className="text-oro uppercase mr-1">
                          {dict?.contract}
                        </span>
                        {child.childContract}
                      </p>
                      <p>
                        <span className="text-oro uppercase mr-1">
                          {dict?.supplyCount}
                        </span>
                        {child.supplyCount}
                      </p>
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2 justify-end md:justify-between">
                    <button
                      type="button"
                      onClick={() => onSelect(child)}
                      disabled={proposingChildId === child.childId}
                      className="relative"
                    >
                      <div className="text-xs text-black font-chicago relative uppercase flex px-4 py-2 bg-oro justify-center items-center hover:opacity-80 disabled:opacity-60">
                        <span className="relative z-10 flex items-center gap-2">
                          {proposingChildId === child.childId ? (
                            <div className="relative w-3 h-3 flex animate-spin">
                              <Image
                                src="/images/scissors.png"
                                fill
                                alt="loading"
                                draggable={false}
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            dict?.supplyRequestPropose ||
                            dict?.propose ||
                            "Propose"
                          )}
                        </span>
                        <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                          <Image
                            src="/images/borderoro2.png"
                            draggable={false}
                            fill
                            alt="border"
                          />
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </FancyBorder>
            ))}

            {filteredChildren.length === 0 && !isLoading && (
              <p className="text-center text-gris font-chicago text-sm">
                {dict?.supplyRequestNoChildren}
              </p>
            )}

            {hasMore && !isLoading && (
              <div className="flex justify-center">
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
                  <span className="relative z-10">
                    {dict?.loadMore}
                  </span>
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

          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="relative">
              <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center hover:opacity-80">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src="/images/borderoro2.png"
                    draggable={false}
                    fill
                    alt="border"
                  />
                </div>
                <span className="cursor-pointer relative z-10">{dict?.close}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
