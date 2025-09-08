import { DetailsTabProps } from "../../types";
import { getCurrentNetwork } from "@/constants";

export const DetailsTab = ({ infrastructure, dict }: DetailsTabProps) => {
  const network = getCurrentNetwork();
  const explorerUrl = `${network.blockExplorer}/tx/${infrastructure.transactionHash}`;
  const truncatedTxHash = infrastructure.transactionHash
    ? `${infrastructure.transactionHash.slice(
        0,
        10
      )}...${infrastructure.transactionHash.slice(-8)}`
    : dict?.na;

  return (
    <div className="space-y-4">
      <div className="w-full bg-black border border-white p-4 rounded-sm">
        <h3 className="text-lg font-herm mb-4">{dict?.basicInformation}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-herm text-ama mb-1">{dict?.infrastructureId}</p>
            <p className="text-white font-mono text-sm">
              {infrastructure.infraId}
            </p>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">{dict?.status}</p>
            <span
              className={`inline-block px-2 py-1 rounded-sm text-xs font-herm ${
                infrastructure.isActive
                  ? "bg-mar text-black"
                  : "bg-fresa text-white"
              }`}
            >
              {infrastructure.isActive ? dict?.active : dict?.inactive}
            </span>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">{dict?.title}</p>
            <p className="text-white font-herm">
              {infrastructure.metadata?.title || dict?.noTitle}
            </p>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">{dict?.deployer}</p>
            <p className="text-white font-mono text-sm">
              {infrastructure.deployer}
            </p>
          </div>
        </div>

        {infrastructure.metadata?.description && (
          <div className="mt-4">
            <p className="text-sm font-herm text-ama mb-2">{dict?.description}</p>
            <p className="text-white font-herm">
              {infrastructure.metadata.description}
            </p>
          </div>
        )}
      </div>

      <div className="w-full bg-black border border-white p-4 rounded-sm">
        <h3 className="text-lg font-herm text-white mb-4">
          {dict?.contractAddresses}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-herm text-ama mb-1">
              {dict?.accessControlContract}
            </p>
            <button
              onClick={() =>
                window.open(
                  `${network.blockExplorer}/address/${infrastructure.accessControlContract}`,
                  "_blank"
                )
              }
              className="text-mar hover:text-ama font-mono text-sm underline transition-colors text-left break-all"
            >
              {infrastructure.accessControlContract}
            </button>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">{dict?.designerContract}</p>
            <button
              onClick={() =>
                window.open(
                  `${network.blockExplorer}/address/${infrastructure.designerContract}`,
                  "_blank"
                )
              }
              className="text-mar hover:text-ama font-mono text-sm underline transition-colors text-left break-all"
            >
              {infrastructure.designerContract}
            </button>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">{dict?.supplierContract}</p>
            <button
              onClick={() =>
                window.open(
                  `${network.blockExplorer}/address/${infrastructure.supplierContract}`,
                  "_blank"
                )
              }
              className="text-mar hover:text-ama font-mono text-sm underline transition-colors text-left break-all"
            >
              {infrastructure.supplierContract}
            </button>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">
              {dict?.fulfillerContract}
            </p>
            <button
              onClick={() =>
                window.open(
                  `${network.blockExplorer}/address/${infrastructure.fulfillerContract}`,
                  "_blank"
                )
              }
              className="text-mar hover:text-ama font-mono text-sm underline transition-colors text-left break-all"
            >
              {infrastructure.fulfillerContract}
            </button>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">{dict?.superAdmin}</p>
            <button
              onClick={() =>
                window.open(
                  `${network.blockExplorer}/address/${infrastructure.superAdmin}`,
                  "_blank"
                )
              }
              className="text-mar hover:text-ama font-mono text-sm underline transition-colors text-left break-all"
            >
              {infrastructure.superAdmin}
            </button>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">{dict?.paymentToken}</p>
            <button
              onClick={() =>
                window.open(
                  `${network.blockExplorer}/address/${infrastructure.paymentToken}`,
                  "_blank"
                )
              }
              className="text-mar hover:text-ama font-mono text-sm underline transition-colors text-left break-all"
            >
              {infrastructure.paymentToken}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full bg-black border border-white p-4 rounded-sm">
        <h3 className="text-lg font-herm text-white mb-4">
          {dict?.configurationStatus}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-herm text-ama mb-1">{dict?.designerGated}</p>
            <span
              className={`inline-block px-2 py-1 rounded-sm text-xs font-herm ${
                infrastructure.isDesignerGated === true ||
                infrastructure.isDesignerGated == null
                  ? "bg-mar text-black"
                  : "bg-fresa text-white"
              }`}
            >
              {infrastructure.isDesignerGated === true ||
              infrastructure.isDesignerGated == null
                ? dict?.yes
                : dict?.no}
            </span>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">{dict?.supplierGated}</p>
            <span
              className={`inline-block px-2 py-1 rounded-sm text-xs font-herm ${
                infrastructure.isSupplierGated === true ||
                infrastructure.isSupplierGated == null
                  ? "bg-mar text-black"
                  : "bg-fresa text-white"
              }`}
            >
              {infrastructure.isSupplierGated === true ||
              infrastructure.isSupplierGated == null
                ? dict?.yes
                : dict?.no}
            </span>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">
              {dict?.paymentTokenLocked}
            </p>
            <span
              className={`inline-block px-2 py-1 rounded-sm text-xs font-herm ${
                infrastructure.isPaymentTokenLocked
                  ? "bg-fresa text-white"
                  : "bg-mar text-black"
              }`}
            >
              {infrastructure.isPaymentTokenLocked ? dict?.locked : dict?.unlocked}
            </span>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">
              {dict?.adminControlRevoked}
            </p>
            <span
              className={`inline-block px-2 py-1 rounded-sm text-xs font-herm ${
                infrastructure.adminControlRevoked
                  ? "bg-fresa text-white"
                  : "bg-mar text-black"
              }`}
            >
              {infrastructure.adminControlRevoked ? dict?.yes : dict?.no}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full bg-black border border-white p-4 rounded-sm">
        <h3 className="text-lg font-herm text-white mb-4">{dict?.onChain}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-herm text-ama mb-1">{dict?.transactionHash}</p>
            <button
              onClick={() => window.open(explorerUrl, "_blank")}
              className="text-mar hover:text-ama font-mono text-sm underline transition-colors"
            >
              {truncatedTxHash}
            </button>
          </div>
          <div>
            <p className="text-sm font-herm text-ama mb-1">{dict?.uri}</p>
            <p className="text-white font-mono text-sm break-all">
              {infrastructure.uri}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
