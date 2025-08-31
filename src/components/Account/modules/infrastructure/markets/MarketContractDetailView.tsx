import { MarketContractDetailViewProps } from "@/components/Account/types";
import { getCurrentNetwork } from "@/constants";
import { ProfileManager } from "../../ProfileManager";
import { useState } from "react";
import { useAccount } from "wagmi";

export const MarketContractDetailView = ({
  marketContract,
  onBack,
}: MarketContractDetailViewProps) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { address } = useAccount();

  const network = getCurrentNetwork();
  const explorerUrl = `${network.blockExplorer}/tx/${marketContract.transactionHash}`;

  const displayTitle =
    marketContract.marketMetadata?.title ||
    marketContract.title ||
    "Unnamed Market";
  const displayDescription = marketContract.marketMetadata?.description || "";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-ama transition-colors font-herm"
        >
          <span className="text-sm">←</span>
          <span className="text-sm">Back to Market Contracts</span>
        </button>
      </div>

      <div className="bg-black rounded-sm border border-white p-4">
        <div className="mb-4">
          <h1 className="text-xl font-herm text-white mb-3">{displayTitle}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-ama font-herm">Contract:</span>
              <p className="font-mono text-xs text-white break-all">
                {marketContract.contractAddress}
              </p>
            </div>
            <div>
              <span className="text-ama font-herm">Symbol:</span>
              <p className="text-white font-herm">{marketContract.symbol}</p>
            </div>
            <div>
              <span className="text-ama font-herm">TX Hash:</span>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-mar hover:text-ama text-xs break-all transition-colors underline flex"
              >
                {marketContract.transactionHash.substring(0, 15) + "..."}
              </a>
            </div>
            <div>
              <span className="text-ama font-herm">Deployer:</span>
              <p className="font-mono text-xs text-white break-all">
                {marketContract.deployer}
              </p>
            </div>
          </div>

          {displayDescription && (
            <div className="mt-3 pt-3 border-t border-white">
              <p className="text-white font-herm text-sm">
                {displayDescription}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-3 py-2 border border-white hover:bg-white hover:text-black text-white font-herm rounded-sm transition-colors text-sm"
          >
            Fulfiller Profile
          </button>
        </div>
      </div>

      <div className="bg-black rounded-sm p-4 border border-white">
        <p className="text-ama text-center font-herm text-sm">
          Market functionality coming soon.
        </p>
      </div>

      <ProfileManager
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        contract={marketContract.fulfillerContract}
        infraId={marketContract.infraId}
        walletAddress={address || ""}
        profileType="Fulfiller"
      />
    </div>
  );
};
