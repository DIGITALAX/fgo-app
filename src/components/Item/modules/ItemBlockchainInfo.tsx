import { useItemBlockchainInfo } from "../hooks/useItemBlockchainInfo";
import { ItemBlockchainInfoProps } from "../types";

export const ItemBlockchainInfo = ({ item }: ItemBlockchainInfoProps) => {
  const {
    formattedCreatedDate,
    formattedUpdatedDate,
    truncatedTxHash,
    explorerUrl,
  } = useItemBlockchainInfo(item);

  return (
    <div className="border border-white rounded-sm p-6">
      <h3 className="text-lg font-herm text-white mb-4">Transaction Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-ama">Transaction Hash:</span>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-white font-herm text-xs break-all">{truncatedTxHash}</p>
            {explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ama hover:text-ama/80 text-xs underline font-herm"
              >
                View
              </a>
            )}
          </div>
        </div>
        <div>
          <span className="text-ama">Block Number:</span>
          <p className="text-white font-herm mt-1">{item.blockNumber}</p>
        </div>
        <div>
          <span className="text-ama">Created:</span>
          <p className="text-white font-herm mt-1">{formattedCreatedDate}</p>
        </div>
        <div>
          <span className="text-ama">Updated:</span>
          <p className="text-white font-herm mt-1">{formattedUpdatedDate}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-ama">Block Timestamp:</span>
            <p className="text-white font-herm mt-1">{item.blockTimestamp}</p>
          </div>
          <div>
            <span className="text-ama">URI Version:</span>
            <p className="text-white font-herm mt-1">{'uriVersion' in item ? item.uriVersion : 'N/A'}</p>
          </div>
          <div>
            <span className="text-ama">Metadata Version:</span>
            <p className="text-white font-herm mt-1">{'version' in item ? item.version : item.metadata?.version || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};