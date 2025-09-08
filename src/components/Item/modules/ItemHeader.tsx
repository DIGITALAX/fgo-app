import Image from "next/image";
import { useItemHeader } from "../hooks/useItemHeader";
import { ItemHeaderProps } from "../types";

export const ItemHeader = ({ item, isTemplate, dict }: ItemHeaderProps) => {
  const { imageUrl, title, supplierTitle, contractAddress, itemId } =
    useItemHeader(item, isTemplate);

  return (
    <div className="flex flex-col gap-8 items-center">
    

      <div className="w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-ama text-sm">
            {"designId" in item ? dict?.parent : isTemplate ? dict?.template : dict?.child}{" "}
            {dict?.id}: {itemId}
          </p>
        </div>

          <h3 className="text-lg font-semibold text-white mb-3">
            {dict?.contractInfo}
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-ama">{dict?.contract}:</span>
              <p className="text-white font-mono text-xs break-all">
                {contractAddress}
              </p>
            </div>
            {"designId" in item ? (
              <>
                <div>
                  <span className="text-ama">{dict?.designer}:</span>
                  <p className="text-white font-mono text-xs break-all">
                    {item.designer}
                  </p>
                </div>
                <div>
                  <span className="text-ama">{dict?.designerName}:</span>
                  <p className="text-white">{supplierTitle}</p>
                </div>
                <div>
                  <span className="text-ama">{dict?.supplyChainMarker}:</span>
                  <p className="text-white">{item.scm}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-ama">{dict?.supplier}:</span>
                  <p className="text-white font-mono text-xs break-all">
                    {item.supplier}
                  </p>
                </div>
                <div>
                  <span className="text-ama">{dict?.supplierName}:</span>
                  <p className="text-white">{supplierTitle}</p>
                </div>
                <div>
                  <span className="text-ama">{dict?.childType}:</span>
                  <p className="text-white">{item.childType}</p>
                </div>
                <div>
                  <span className="text-ama">{dict?.scm}:</span>
                  <p className="text-white">{item.scm}</p>
                </div>
              </>
            )}
          </div>
     
      </div>
        {imageUrl && (
        <div className="aspect-square w-[50%] relative">
          <Image
            src={imageUrl}
            fill
            draggable={false}
            alt={title}
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
};
