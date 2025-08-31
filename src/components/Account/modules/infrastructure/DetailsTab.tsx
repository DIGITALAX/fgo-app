import { DetailsTabProps } from "../../types";
import { getCurrentNetwork } from "@/constants";

export const DetailsTab = ({ infrastructure,  }: DetailsTabProps) => {
  const network = getCurrentNetwork();
  const explorerUrl = `${network.blockExplorer}/tx/${infrastructure.transactionHash}`;
  const truncatedTxHash = infrastructure.transactionHash 
    ? `${infrastructure.transactionHash.slice(0, 10)}...${infrastructure.transactionHash.slice(-8)}`
    : "N/A";



  return (
    <div className="space-y-4">
      <div className="w-full bg-black border border-white p-4 rounded-sm">
        <h3 className="text-lg font-herm mb-4">Basic Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-herm text-ama mb-1">Infrastructure ID</p>
            <p className="text-white font-mono text-sm">{infrastructure.infraId}</p>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">Status</p>
            <span className={`inline-block px-2 py-1 rounded-sm text-xs font-herm ${
              infrastructure.isActive 
                ? "bg-mar text-black" 
                : "bg-fresa text-white"
            }`}>
              {infrastructure.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">Title</p>
            <p className="text-white font-herm">{infrastructure.metadata?.title || "No title"}</p>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">Deployer</p>
            <p className="text-white font-mono text-sm">{infrastructure.deployer}</p>
          </div>
        </div>
        
        {infrastructure.metadata?.description && (
          <div className="mt-4">
            <p className="text-sm font-herm text-ama mb-2">Description</p>
            <p className="text-white font-herm">{infrastructure.metadata.description}</p>
          </div>
        )}
      </div>

      <div className="w-full bg-black border border-white p-4 rounded-sm">
        <h3 className="text-lg font-herm text-white mb-4">Contract Addresses</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-herm text-ama mb-1">Access Control Contract</p>
            <button
              onClick={() => window.open(`${network.blockExplorer}/address/${infrastructure.accessControlContract}`, '_blank')}
              className="text-mar hover:text-ama font-mono text-sm underline transition-colors text-left break-all"
            >
              {infrastructure.accessControlContract}
            </button>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">Designer Contract</p>
            <button
              onClick={() => window.open(`${network.blockExplorer}/address/${infrastructure.designerContract}`, '_blank')}
              className="text-mar hover:text-ama font-mono text-sm underline transition-colors text-left break-all"
            >
              {infrastructure.designerContract}
            </button>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">Supplier Contract</p>
            <button
              onClick={() => window.open(`${network.blockExplorer}/address/${infrastructure.supplierContract}`, '_blank')}
              className="text-mar hover:text-ama font-mono text-sm underline transition-colors text-left break-all"
            >
              {infrastructure.supplierContract}
            </button>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">Fulfiller Contract</p>
            <button
              onClick={() => window.open(`${network.blockExplorer}/address/${infrastructure.fulfillerContract}`, '_blank')}
              className="text-mar hover:text-ama font-mono text-sm underline transition-colors text-left break-all"
            >
              {infrastructure.fulfillerContract}
            </button>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">Super Admin</p>
            <button
              onClick={() => window.open(`${network.blockExplorer}/address/${infrastructure.superAdmin}`, '_blank')}
              className="text-mar hover:text-ama font-mono text-sm underline transition-colors text-left break-all"
            >
              {infrastructure.superAdmin}
            </button>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">Payment Token</p>
            <button
              onClick={() => window.open(`${network.blockExplorer}/address/${infrastructure.paymentToken}`, '_blank')}
              className="text-mar hover:text-ama font-mono text-sm underline transition-colors text-left break-all"
            >
              {infrastructure.paymentToken}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full bg-black border border-white p-4 rounded-sm">
        <h3 className="text-lg font-herm text-white mb-4">Configuration & Status</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-herm text-ama mb-1">Designer Gated</p>
            <span className={`inline-block px-2 py-1 rounded-sm text-xs font-herm ${
              infrastructure.isDesignerGated 
                ? "bg-mar text-black" 
                : "bg-fresa text-white"
            }`}>
              {infrastructure.isDesignerGated ? "Yes" : "No"}
            </span>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">Supplier Gated</p>
            <span className={`inline-block px-2 py-1 rounded-sm text-xs font-herm ${
              infrastructure.isSupplierGated 
                ? "bg-mar text-black" 
                : "bg-fresa text-white"
            }`}>
              {infrastructure.isSupplierGated ? "Yes" : "No"}
            </span>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">Payment Token Locked</p>
            <span className={`inline-block px-2 py-1 rounded-sm text-xs font-herm ${
              infrastructure.isPaymentTokenLocked 
                ? "bg-fresa text-white" 
                : "bg-mar text-black"
            }`}>
              {infrastructure.isPaymentTokenLocked ? "Locked" : "Unlocked"}
            </span>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">Admin Control Revoked</p>
            <span className={`inline-block px-2 py-1 rounded-sm text-xs font-herm ${
              infrastructure.adminControlRevoked 
                ? "bg-fresa text-white" 
                : "bg-mar text-black"
            }`}>
              {infrastructure.adminControlRevoked ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full bg-black border border-white p-4 rounded-sm">
        <h3 className="text-lg font-herm text-white mb-4">On Chain</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-herm text-ama mb-1">Transaction Hash</p>
            <button
              onClick={() => window.open(explorerUrl, '_blank')}
              className="text-mar hover:text-ama font-mono text-sm underline transition-colors"
            >
              {truncatedTxHash}
            </button>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">URI</p>
            <p className="text-white font-mono text-sm break-all">{infrastructure.uri}</p>
          </div>
        </div>
      </div>
    </div>
  );
};