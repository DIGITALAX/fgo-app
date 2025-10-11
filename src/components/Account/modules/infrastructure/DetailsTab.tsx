import { FancyBorder } from "@/components/Layout/modules/FancyBorder";
import { DetailsTabProps } from "../../types";
import { getCurrentNetwork } from "@/constants";
import Image from "next/image";

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
      <FancyBorder type="diamond" color="oro" className="relative">
        <div className="relative z-10 p-4 space-y-4">
          <h3 className="text-lg font-awk uppercase text-oro mb-4">
            {dict?.basicInformation}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.infrastructureId}
              </p>
              <p className="text-gris font-chicago text-sm">
                {infrastructure.infraId}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.status}
              </p>
              <div className="relative w-fit">
                <div
                  className={`text-xs font-chicago relative lowercase flex px-3 py-1 bg-offNegro ${
                    infrastructure.isActive ? "text-gris" : "text-fresa"
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
                    {infrastructure.isActive ? dict?.active : dict?.inactive}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.title}
              </p>
              <p className="text-gris font-chicago text-sm">
                {infrastructure.metadata?.title || dict?.noTitle}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.deployer}
              </p>
              <p className="text-gris font-pixel text-xs break-all">
                {infrastructure.deployer}
              </p>
            </div>
          </div>

          {infrastructure.metadata?.description && (
            <div className="mt-4 space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.description}
              </p>
              <p className="text-gris font-chicago text-sm">
                {infrastructure.metadata.description}
              </p>
            </div>
          )}
        </div>
      </FancyBorder>

      <FancyBorder type="diamond" color="oro" className="relative">
        <div className="relative z-10 p-4 space-y-4">
          <h3 className="text-lg font-awk uppercase text-oro mb-4">
            {dict?.contractAddresses}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.accessControlContract}
              </p>
              <button
                onClick={() =>
                  window.open(
                    `${network.blockExplorer}/address/${infrastructure.accessControlContract}`,
                    "_blank"
                  )
                }
                className="text-gris hover:text-ama font-pixel text-xs underline transition-colors text-left break-all"
              >
                {infrastructure.accessControlContract}
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.designerContract}
              </p>
              <button
                onClick={() =>
                  window.open(
                    `${network.blockExplorer}/address/${infrastructure.designerContract}`,
                    "_blank"
                  )
                }
                className="text-gris hover:text-ama font-pixel text-xs underline transition-colors text-left break-all"
              >
                {infrastructure.designerContract}
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.supplierContract}
              </p>
              <button
                onClick={() =>
                  window.open(
                    `${network.blockExplorer}/address/${infrastructure.supplierContract}`,
                    "_blank"
                  )
                }
                className="text-gris hover:text-ama font-pixel text-xs underline transition-colors text-left break-all"
              >
                {infrastructure.supplierContract}
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.fulfillerContract}
              </p>
              <button
                onClick={() =>
                  window.open(
                    `${network.blockExplorer}/address/${infrastructure.fulfillerContract}`,
                    "_blank"
                  )
                }
                className="text-gris hover:text-ama font-pixel text-xs underline transition-colors text-left break-all"
              >
                {infrastructure.fulfillerContract}
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.superAdmin}
              </p>
              <button
                onClick={() =>
                  window.open(
                    `${network.blockExplorer}/address/${infrastructure.superAdmin}`,
                    "_blank"
                  )
                }
                className="text-gris hover:text-ama font-pixel text-xs underline transition-colors text-left break-all"
              >
                {infrastructure.superAdmin}
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.paymentToken}
              </p>
              <button
                onClick={() =>
                  window.open(
                    `${network.blockExplorer}/address/${infrastructure.paymentToken}`,
                    "_blank"
                  )
                }
                className="text-gris hover:text-ama font-pixel text-xs underline transition-colors text-left break-all"
              >
                {infrastructure.paymentToken}
              </button>
            </div>
          </div>
        </div>
      </FancyBorder>
      <FancyBorder type="diamond" color="oro" className="relative">
        <div className="relative z-10 p-4 space-y-4">
          <h3 className="text-lg font-awk uppercase text-oro mb-4">
            {dict?.configurationStatus}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.designerGated}
              </p>
              <div className="relative w-fit">
                <div
                  className={`text-xs font-chicago relative lowercase flex px-3 py-1 bg-offNegro ${
                    infrastructure.isDesignerGated === true ||
                    infrastructure.isDesignerGated == null
                      ? "text-gris"
                      : "text-fresa"
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
                    {infrastructure.isDesignerGated === true ||
                    infrastructure.isDesignerGated == null
                      ? dict?.yes
                      : dict?.no}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.supplierGated}
              </p>
              <div className="relative w-fit">
                <div
                  className={`text-xs font-chicago relative lowercase flex px-3 py-1 bg-offNegro ${
                    infrastructure.isSupplierGated === true ||
                    infrastructure.isSupplierGated == null
                      ? "text-gris"
                      : "text-fresa"
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
                    {infrastructure.isSupplierGated === true ||
                    infrastructure.isSupplierGated == null
                      ? dict?.yes
                      : dict?.no}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.paymentTokenLocked}
              </p>
              <div className="relative w-fit">
                <div
                  className={`text-xs font-chicago relative lowercase flex px-3 py-1 bg-offNegro ${
                    infrastructure.isPaymentTokenLocked
                      ? "text-fresa"
                      : "text-gris"
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
                    {infrastructure.isPaymentTokenLocked
                      ? dict?.locked
                      : dict?.unlocked}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.adminControlRevoked}
              </p>
              <div className="relative w-fit">
                <div
                  className={`text-xs font-chicago relative lowercase flex px-3 py-1 bg-offNegro ${
                    infrastructure.adminControlRevoked
                      ? "text-fresa"
                      : "text-gris"
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
                    {infrastructure.adminControlRevoked ? dict?.yes : dict?.no}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FancyBorder>

      <FancyBorder type="diamond" color="oro" className="relative">
        <div className="relative z-10 p-4 space-y-4">
          <h3 className="text-lg font-awk uppercase text-oro mb-4">
            {dict?.onChain}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.transactionHash}
              </p>
              <button
                onClick={() => window.open(explorerUrl, "_blank")}
                className="text-gris hover:text-ama font-pixel text-xs underline transition-colors"
              >
                {truncatedTxHash}
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-awk uppercase text-gris">
                {dict?.uri}
              </p>
              <p className="text-gris font-pixel text-xs break-all">
                {infrastructure.uri}
              </p>
            </div>
          </div>
        </div>
      </FancyBorder>
    </div>
  );
};
