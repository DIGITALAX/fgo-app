import { ApprovalItemCardProps, ExtendedApprovalItemCardProps } from "../../../types";
import { MarketContract, Parent } from "../../../types";
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
}: ExtendedApprovalItemCardProps) => {
  const getItemData = () => {
    switch (itemType) {
      case "market":
        const market = item as MarketContract;
        return {
          title: market.marketMetadata?.title || market.title || "Unnamed Market",
          description: market.marketMetadata?.description || "No description available",
          image: market.marketMetadata?.image || "",
          symbol: market.symbol,
          address: market.contractAddress,
        };
      case "parent":
        const parent = item as Parent;
        return {
          title: parent.metadata?.title || parent.title || "Unnamed Parent",
          description: parent.metadata?.description || "No description available",
          image: parent.metadata?.image || "",
          symbol: parent.symbol,
          address: parent.parentContract,
        };
      case "template":
        const template = item as Template;
        return {
          title: template.metadata?.title || "Unnamed Template",
          description: template.metadata?.description || "No description available",
          image: template.metadata?.image || "",
          symbol: template.symbol || "",
          address: template.templateContract,
        };
      default:
        return {
          title: "Unknown Item",
          description: "No description available",
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
      className={`border rounded-sm p-4 space-y-3 transition-all ${
        !isActive 
          ? "opacity-50 border-white/30" 
          : isApproved 
            ? "border-ama bg-ama/5" 
            : "border-white hover:border-fresa"
      }`}
    >
      {imageUrl && (
        <div className="aspect-square rounded-sm overflow-hidden bg-black flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={itemData.title}
            width={200}
            height={200}
            draggable={false}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-white font-herm text-sm line-clamp-2">
            {itemData.title}
          </h4>
          {isApproved && (
            <div className="bg-ama/20 border border-ama px-2 py-1 rounded text-xs font-herm text-ama whitespace-nowrap">
              Approved
            </div>
          )}
        </div>

        <p className="text-white/60 font-herm text-xs line-clamp-2">
          {itemData.description}
        </p>

        <div className="space-y-1 text-xs font-herm">
          <div className="flex justify-between text-white/60">
            <span>Symbol:</span>
            <span className="font-mono text-ama">{itemData.symbol}</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Status:</span>
            <span className={`font-mono ${isActive ? "text-ama" : "text-fresa"}`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="pt-2">
          {!isActive ? (
            <div className="text-center py-2 text-white/40 font-herm text-xs">
              Inactive - Cannot approve
            </div>
          ) : isApproved ? (
            <button
              onClick={onRevoke}
              disabled={loading}
              className="w-full px-3 py-2 bg-fresa hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-herm text-xs rounded-sm transition-opacity"
            >
              {loading ? "Revoking..." : "Revoke Approval"}
            </button>
          ) : (
            <button
              onClick={onApprove}
              disabled={loading}
              className="w-full px-3 py-2 bg-ama hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-black font-herm text-xs rounded-sm transition-opacity"
            >
              {loading ? "Approving..." : "Approve"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};