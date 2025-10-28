import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getIPFSUrl } from "@/lib/helpers/ipfs";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { ChildReferencesProps } from "../types";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const ChildReferences = ({ childData, dict }: ChildReferencesProps) => {
  const router = useRouter();
  const [childMetadata, setChildMetadata] = useState<
    Record<string, { title: string; image: string }>
  >({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (childData.length === 0) return;

      setLoading(true);
      const metadataMap: Record<string, { title: string; image: string }> = {};

      for (const child of childData) {
        const key = `${child.childContract}-${child.childId}`;
        try {
          if (child?.child?.metadata?.title && child?.child.metadata?.image) {
            metadataMap[key] = {
              title: child?.child.metadata.title,
              image: child?.child.metadata.image,
            };
          } else if (child?.child?.uri) {
            const metadata = await ensureMetadata({ uri: child?.child?.uri });
            metadataMap[key] = metadata.metadata;
          }
        } catch (error) {}
      }

      setChildMetadata(metadataMap);
      setLoading(false);
    };

    fetchMetadata();
  }, [childData]);

  const handleChildClick = (
    childContract: string,
    childId: string,
    isTemplate?: boolean,
    isFutures?: boolean
  ) => {
    if (isFutures) {
      router.push(`/market/future/${childContract}/${childId}`);
    } else {
      const type = isTemplate ? "template" : "child";
      router.push(`/library/${type}/${childContract}/${childId}`);
    }
  };

  if (!childData || childData.length === 0) {
    return null;
  }

  return (
    <FancyBorder type="diamond" color="oro" className="bg-black p-6 space-y-4">
      <h3 className="text-lg font-agency uppercase text-white mb-4">
        {dict?.childReferences}
      </h3>

      <div className="space-y-4">
        {childData.map((child, index) => {
          const key = `${child.childContract}-${child.childId}`;
          const metadata = childMetadata[key];
          const isTemplate: boolean =
            "isTemplate" in child ? (child.isTemplate as boolean) : false;
          const isFutures: boolean =
            Number(child?.child?.futures?.pricePerUnit) > 0 ? true : false;
          return (
            <div
              key={`${key}-${index}`}
              className="bg-black/50 p-4 cursor-pointer transition-colors hover:opacity-70"
              onClick={() =>
                handleChildClick(
                  child.childContract,
                  child.childId,
                  isTemplate,
                  isFutures
                )
              }
            >
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative w-32 h-32 flex-shrink-0">
                  {metadata?.image && (
                    <Image
                      draggable={false}
                      src={getIPFSUrl(metadata.image)}
                      fill
                      sizes="128px"
                      alt={
                        metadata.title ||
                        `${isTemplate ? dict?.template : dict?.child} ${
                          child.childId
                        }`
                      }
                      className="object-contain"
                    />
                  )}
                </div>

                <div className="lg:w-3/4 space-y-3">
                  <div className="flex items-center gap-3">
                    <h4 className="text-oro font-agency">
                      {metadata?.title ||
                        `${isTemplate ? dict?.template : dict?.child} ${
                          child.childId
                        }`}
                    </h4>
                    <span className="px-2 py-1 bg-oro/10 text-oro text-xs font-slim">
                      {isTemplate ? dict?.template : dict?.child}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <span className="text-oro font-agency text-sm">
                        {dict?.id}:
                      </span>
                      <p className="text-white font-slim text-sm ml-1">
                        {child.childId}
                      </p>
                    </div>
                    <div>
                      <span className="text-oro font-agency text-sm">
                        {dict?.amount}:
                      </span>
                      <p className="text-white font-slim text-sm ml-1">
                        {child.amount}
                      </p>
                    </div>
                    <div>
                      <span className="text-oro font-agency text-sm">
                        {dict?.contract}:
                      </span>
                      <p className="text-white font-slim text-xs truncate ml-1">
                        {child.childContract}
                      </p>
                    </div>
                    {child.placementURI && (
                      <div>
                        <span className="text-oro break-all font-agency text-sm">
                          {dict?.placementURI}:
                        </span>
                        <p
                          className="text-white font-slim text-xs break-all cursor-pointer break-all hover:text-oro transition-colors ml-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(child.placementURI);
                          }}
                          title={dict?.clickToCopy}
                        >
                          {child.placementURI}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="relative w-fit animate-spin h-fit flex">
            <div className="relative w-6 h-6 flex">
              <Image
                layout="fill"
                objectFit="cover"
                src={"/images/scissors.png"}
                draggable={false}
                alt="loader"
              />
            </div>
          </div>
        </div>
      )}
    </FancyBorder>
  );
};
