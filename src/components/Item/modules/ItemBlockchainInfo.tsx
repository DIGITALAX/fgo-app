import { useItemBlockchainInfo } from "../hooks/useItemBlockchainInfo";
import { ItemBlockchainInfoProps } from "../types";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const ItemBlockchainInfo = ({ item, dict }: ItemBlockchainInfoProps) => {
  const {
    formattedCreatedDate,
    formattedUpdatedDate,
    truncatedTxHash,
    explorerUrl,
  } = useItemBlockchainInfo(item);

  return (
    <FancyBorder type="diamond" color="oro" className="bg-black p-6 space-y-4">
      <h3 className="text-lg font-agency uppercase text-white mb-4">{dict?.transactionDetails}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <span className="text-oro font-agency">{dict?.transactionHash}:</span>
          <div className="flex items-center gap-2">
            <p className="text-white font-slim text-xs break-all">{truncatedTxHash}</p>
            {explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-oro hover:text-oro/80 text-xs underline font-agency"
              >
                {dict?.view}
              </a>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-oro font-agency">{dict?.blockNumber}:</span>
          <p className="text-white font-slim text-sm">{item.blockNumber}</p>
        </div>
        <div className="space-y-2">
          <span className="text-oro font-agency">{dict?.created}:</span>
          <p className="text-white font-slim text-sm">{formattedCreatedDate}</p>
        </div>
        <div className="space-y-2">
          <span className="text-oro font-agency">{dict?.updated}:</span>
          <p className="text-white font-slim text-sm">{formattedUpdatedDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <span className="text-oro font-agency">{dict?.blockTimestamp}:</span>
          <p className="text-white font-slim text-sm">{item.blockTimestamp}</p>
        </div>
        <div className="space-y-2">
          <span className="text-oro font-agency">{dict?.uriVersion}:</span>
          <p className="text-white font-slim text-sm">{'uriVersion' in item ? item.uriVersion : dict?.na}</p>
        </div>
        <div className="space-y-2">
          <span className="text-oro font-agency">{dict?.metadataVersion}:</span>
          <p className="text-white font-slim text-sm">{'version' in item ? item.version : item.metadata?.version || dict?.na}</p>
        </div>
      </div>
    </FancyBorder>
  );
};