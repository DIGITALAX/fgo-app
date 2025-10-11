import Image from "next/image";
import { useItemHeader } from "../hooks/useItemHeader";
import { ItemHeaderProps } from "../types";

export const ItemHeader = ({ item, isTemplate, dict }: ItemHeaderProps) => {
  const { imageUrl, title, supplierTitle, contractAddress, itemId } =
    useItemHeader(item, isTemplate, dict);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start gap-8 justify-center">
      <div className="w-full space-y-2 sm:order-1 order-2">
        <div>
          <h1 className="text-3xl font-agency uppercase text-white mb-2">
            {title}
          </h1>
          <p className="text-oro text-sm font-slim">
            {"designId" in item
              ? dict?.parent
              : isTemplate
              ? dict?.template
              : dict?.child}{" "}
            {dict?.id}: {itemId}
          </p>
        </div>
        <div>
          <span className="text-amarillo font-agency">{dict?.contract}:</span>
          <p className="text-white font-slim text-xs break-all">
            {contractAddress}
          </p>
        </div>
        {"designId" in item ? (
          <>
            <div>
              <span className="text-amarillo font-agency">
                {dict?.designer}:
              </span>
              <p className="text-white font-slim text-xs break-all">
                {item.designer}
              </p>
            </div>
            <div>
              <span className="text-amarillo font-agency">
                {dict?.designer}:
              </span>
              <p className="text-white font-slim text-xs">{supplierTitle}</p>
            </div>
            <div>
              <span className="text-amarillo font-agency">{dict?.scm}:</span>
              <p className="text-white font-slim text-xs">{item.scm}</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <span className="text-amarillo font-agency">
                {dict?.supplier}:
              </span>
              <p className="text-oro font-slim text-xs break-all">
                {item.supplier}
              </p>
            </div>
            <div>
              <span className="text-amarillo font-agency">
                {dict?.supplierName}:
              </span>
              <p className="text-oro font-slim text-xs">{supplierTitle}</p>
            </div>
            <div>
              <span className="text-amarillo font-agency">
                {dict?.childType}:
              </span>
              <p className="text-oro font-slim text-xs">{item.childType}</p>
            </div>
            <div>
              <span className="text-amarillo font-agency">{dict?.scm}:</span>
              <p className="text-oro font-slim text-xs">{item.scm}</p>
            </div>
          </>
        )}
      </div>
      {imageUrl && (
        <div className="aspect-square sm:order-2 order-1 w-[50%] relative">
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
