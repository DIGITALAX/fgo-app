import { ApprovalItemCardProps, MarketContract, Parent } from "../../../types";
import { Template } from "@/components/Item/types";
import { getIPFSUrl } from "@/lib/helpers/ipfs";
import Image from "next/image";

export const ApprovalItemCard = ({
  item,
  isApproved,
  isActive,
  onApprove,
  onRevoke,
  itemType,
  loading = false,
  dict,
  onApprovePhysical,
  onApproveDigital,
}: ApprovalItemCardProps) => {
  const getItemData = () => {
    switch (itemType) {
      case "market":
        const market = item as MarketContract;
        return {
          title:
            market.marketMetadata?.title || market.title || dict?.unnamedMarket,
          description:
            market.marketMetadata?.description || dict?.noDescription,
          image: market.marketMetadata?.image || "",
          symbol: market.symbol,
          address: market.contractAddress,
        };
      case "parent":
        const parent = item as Parent;
        return {
          title: parent.metadata?.title || parent.title || dict?.unnamedParent,
          description: parent.metadata?.description || dict?.noDescription,
          image: parent.metadata?.image || "",
          symbol: parent.symbol,
          address: parent.parentContract,
        };
      case "template":
        const template = item as Template;
        return {
          title: template.metadata?.title || dict?.unnamedTemplate,
          description: template.metadata?.description || dict?.noDescription,
          image: template.metadata?.image || "",
          symbol: template.symbol || "",
          address: template.templateContract,
        };
      default:
        return {
          title: dict?.unknownItem,
          description: dict?.noDescription,
          image: "",
          symbol: "",
          address: "",
        };
    }
  };

  const itemData = getItemData();
  const imageUrl = itemData.image ? getIPFSUrl(itemData.image) : null;

  return (
    <div
      className={`transition-all duration-300 relative overflow-hidden ${
        !isActive ? "opacity-50" : ""
      }`}
    >
      <div className="absolute z-0 top-0 left-0 w-full h-full flex">
        <Image
          src={"/images/borderpurple.png"}
          draggable={false}
          objectFit="fill"
          fill
          alt="border"
        />
      </div>
      <div className="relative z-10 p-3 space-y-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-col w-full">
            <div className="text-xs font-awk uppercase tracking-wide mb-1 text-oro">
              {itemType === "market"
                ? dict?.market
                : itemType === "template"
                ? dict?.template
                : dict?.parent}
            </div>
            <h4 className="font-agency text-base leading-tight text-white line-clamp-2">
              {itemData.title}
            </h4>
          </div>
          {isApproved && (
            <div className="flex">
              <div className="text-xs text-verde font-chicago relative lowercase flex px-2 py-1 bg-offNegro">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderoro2.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                <span className="relative z-10">{dict?.approved}</span>
              </div>
            </div>
          )}
        </div>

        {imageUrl && (
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={imageUrl}
              fill
              draggable={false}
              alt={itemData.title}
              className="object-cover rounded-md transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <div className="absolute z-0 top-0 left-0 w-full h-full flex">
              <Image
                src={"/images/borderblue.png"}
                draggable={false}
                objectFit="fill"
                fill
                alt="border"
              />
            </div>
          </div>
        )}

        <p className="text-gris font-chicago text-xs line-clamp-2">
          {itemData.description}
        </p>

        <div className="pt-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-awk uppercase text-gris">
                {dict?.status}:
              </span>
              <div
                className={`text-xs font-chicago relative lowercase flex px-2 py-1 bg-offNegro ${
                  isActive ? "text-verde" : "text-fresa"
                }`}
              >
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderoro2.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                <span className="relative z-10">
                  {isActive ? dict?.active : dict?.inactive}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          {!isActive ? (
            <div className="text-center py-2 text-gris font-chicago text-xs">
              {dict?.inactiveCannotApprove}
            </div>
          ) : isApproved ? (
            <button
              onClick={onRevoke}
              disabled={loading}
              className="w-full relative disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderoro2.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                <span className="relative z-10">
                  {loading ? dict?.revoking : dict?.revokeApproval}
                </span>
              </div>
            </button>
          ) : onApprovePhysical && onApproveDigital ? (
            <div className="flex gap-2">
              <button
                onClick={onApprovePhysical}
                disabled={loading}
                className="w-full relative disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-xs text-ama font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10">
                    {loading ? dict?.approving : dict?.physical}
                  </span>
                </div>
              </button>
              <button
                onClick={onApproveDigital}
                disabled={loading}
                className="w-full relative disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-xs text-verde font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10">
                    {loading ? dict?.approving : dict?.digital}
                  </span>
                </div>
              </button>
            </div>
          ) : (
            <button
              onClick={onApprove}
              disabled={loading}
              className="w-full relative disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderoro2.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                <span className="relative z-10">
                  {loading ? dict?.approving : dict?.approve}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
