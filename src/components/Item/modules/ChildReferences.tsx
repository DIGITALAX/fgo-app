import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getIPFSUrl } from "@/lib/helpers/ipfs";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { ChildReferencesProps } from "../types";
import Image from "next/image";

export const ChildReferences = ({ childData, dict }: ChildReferencesProps) => {
  const router = useRouter();
  const [childMetadata, setChildMetadata] = useState<
    Record<string, { title: string; image: string }>
  >({});
  const [loading, setLoading] = useState(false);

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
    isTemplate?: boolean
  ) => {
    const type = isTemplate ? "template" : "child";
    router.push(`/library/${type}/${childContract}/${childId}`);
  };

  if (!childData || childData.length === 0) {
    return null;
  }

  return (
    <div className="bg-black border border-white rounded-sm p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        {dict?.childReferences}
      </h3>

      <div className="space-y-4">
        {childData.map((child, index) => {
          const key = `${child.childContract}-${child.childId}`;
          const metadata = childMetadata[key];
          const isTemplate: boolean =
            "isTemplate" in child ? (child.isTemplate as boolean) : false;
          return (
            <div
              key={`${key}-${index}`}
              className="bg-black border border-ama p-2 cursor-pointer transition-colors"
              onClick={() =>
                handleChildClick(child.childContract, child.childId, isTemplate)
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
                    <h4 className="text-white font-medium">
                      {metadata?.title ||
                        `${isTemplate ? dict?.template : dict?.child} ${
                          child.childId
                        }`}
                    </h4>
                    <span className="px-2 py-1 bg-azul text-white text-xs rounded-sm">
                      {isTemplate ? dict?.template : dict?.child}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-ama">{dict?.id}:</span>
                      <p className="text-white">{child.childId}</p>
                    </div>
                    <div>
                      <span className="text-ama">{dict?.amount}:</span>
                      <p className="text-white">{child.amount}</p>
                    </div>
                    <div>
                      <span className="text-ama">{dict?.contract}:</span>
                      <p className="text-white font-mono text-xs truncate">
                        {child.childContract}
                      </p>
                    </div>
                    {child.uri && (
                      <div>
                        <span className="text-ama">{dict?.placementURI}:</span>
                        <p
                          className="text-white font-mono text-xs break-all cursor-pointer hover:text-ama transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(child.uri);
                          }}
                          title={dict?.clickToCopy}
                        >
                          {child.uri}
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
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-azul"></div>
          <span className="ml-2 text-azul">{dict?.loadingMetadata}</span>
        </div>
      )}
    </div>
  );
};
