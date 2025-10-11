import { useContext } from "react";
import { AppContext } from "@/lib/providers/Providers";
import { getCurrentNetwork } from "@/constants";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const Success = ({ dict }: { dict: any }) => {
  const context = useContext(AppContext);

  if (!context?.successData) return null;

  const network = getCurrentNetwork();
  const explorerUrl = context.successData.txHash
    ? `${network.blockExplorer}/tx/${context.successData.txHash}`
    : null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative max-w-md w-full">
        <div className="absolute z-0 top-0 left-0 w-full h-full flex">
          <Image
            src={"/images/borderblue.png"}
            draggable={false}
            objectFit="fill"
            fill
            alt="border"
          />
        </div>
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-awk uppercase text-verde">
              {dict?.success}
            </h2>
            <div
              onClick={context.hideSuccess}
              className="relative cursor-pointer hover:opacity-80 transition-opacity w-4 h-4"
            >
              <Image
                src={"/images/plug.png"}
                draggable={false}
                fill
                objectFit="contain"
                alt="close"
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gris font-chicago text-sm leading-relaxed mb-4">
              {context.successData.message}
            </p>

            {context.successData.txHash && (
              <FancyBorder type="diamond" color="oro" className="relative">
                <div className="relative z-10 p-3">
                  <p className="text-sm text-oro font-chicago mb-2">
                    {dict?.tx}
                  </p>
                  {explorerUrl ? (
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-pixel text-verde hover:text-white break-all underline transition-colors"
                    >
                      {context.successData.txHash}
                    </a>
                  ) : (
                    <p className="text-xs font-pixel text-verde break-all">
                      {context.successData.txHash}
                    </p>
                  )}
                </div>
              </FancyBorder>
            )}
          </div>

          <div className="flex justify-end">
            <button onClick={context.hideSuccess} className="relative">
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
                <span className="relative z-10">{dict?.close}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
