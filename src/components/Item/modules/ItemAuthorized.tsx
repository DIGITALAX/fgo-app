import Image from "next/image";
import { useItemAuthorized } from "../hooks/useItemAuthorized";
import { ItemAuthorizedProps } from "../types";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const ItemAuthorized = ({ item, dict }: ItemAuthorizedProps) => {
  const {
    handleChildClick,
    handleParentClick,
    handleTemplateClick,
    getImageUrl,
    processedAuthorizedChildren,
    processedAuthorizedParents,
    processedAuthorizedTemplates,
    loading,
  } = useItemAuthorized(item);

  const hasAuthorized =
    processedAuthorizedChildren.length > 0 ||
    processedAuthorizedParents.length > 0 ||
    processedAuthorizedTemplates.length > 0;

  if (loading) {
    return (
      <FancyBorder type="diamond" color="oro" className="bg-black p-6">
        <div className="w-full flex items-center justify-center py-4">
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
      </FancyBorder>
    );
  }

  if (!hasAuthorized) {
    return null;
  }

  return (
    <FancyBorder type="diamond" color="oro" className="bg-black p-6 space-y-4">
      <h3 className="text-lg font-agency uppercase text-white mb-4">
        {dict?.authorizedItems}
      </h3>

      {processedAuthorizedChildren.length > 0 && (
        <div className="space-y-3">
          <span className="text-oro font-agency">
            {dict?.authorizedChildren}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {processedAuthorizedChildren.map((child, index: number) => {

              return (
              <button
                key={index}
                onClick={() =>
                  handleChildClick(child.childContract, child.childId,  child.futures?.id ? true : false)
                }
                className="p-2 gap-2 flex flex-col bg-black/50 overflow-hidden hover:opacity-70"
              >
                {child.metadata?.image && (
                  <div className="relative w-full h-20">
                    <Image
                      draggable={false}
                      fill
                      sizes="300px"
                      src={getImageUrl(child.metadata.image)}
                      alt={
                        child.metadata?.title ||
                        `${dict?.child} ${child.childId}`
                      }
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="text-oro font-agency text-sm underline">
                  {child.metadata?.title || `${dict?.child} ${child.childId}`}
                </div>
              </button>
              );
            })}
          </div>
        </div>
      )}

      {processedAuthorizedParents.length > 0 && (
        <div className="space-y-3">
          <span className="text-oro font-agency">
            {dict?.authorizedParents}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedAuthorizedParents.map((parent, index: number) => (
              <div key={index} className="bg-black/50 overflow-hidden">
                {parent.metadata?.image && (
                  <div className="relative w-full h-32 w-32">
                    <Image
                      draggable={false}
                      fill
                      objectPosition="top left"
                      src={getImageUrl(parent.metadata.image)}
                      alt={
                        parent.metadata?.title ||
                        `${dict?.parent} ${parent.parentId}`
                      }
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleParentClick(parent.parentContract, parent.parentId)
                      }
                      className="text-oro hover:text-oro/80 font-agency text-sm underline"
                    >
                      {parent.metadata?.title ||
                        `${dict?.parent} ${parent.parentId}`}
                    </button>
                    <span className={`px-2 py-0.5 text-xs font-chicago rounded ${parent.isPhysical ? "bg-ama/20 text-ama" : "bg-verde/20 text-verde"}`}>
                      {parent.isPhysical ? dict?.physical : dict?.digital}
                    </span>
                  </div>
                  <p className="text-white text-xs font-slim break-all">
                    {parent.parentContract}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {processedAuthorizedTemplates.length > 0 && (
        <div className="space-y-3">
          <span className="text-oro font-agency">
            {dict?.authorizedTemplates}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedAuthorizedTemplates.map((template, index: number) => (
              <div key={index} className="bg-black/50 overflow-hidden">
                {template.metadata?.image && (
                  <div className="relative w-full h-32">
                    <Image
                      draggable={false}
                      fill
                      sizes="300px"
                      src={getImageUrl(template.metadata.image)}
                      alt={
                        template.metadata?.title ||
                        `${dict?.template} ${template.templateId}`
                      }
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleTemplateClick(
                          template.templateContract,
                          template.templateId
                        )
                      }
                      className="text-oro hover:text-oro/80 font-agency text-sm underline"
                    >
                      {template.metadata?.title ||
                        `${dict?.template} ${template.templateId}`}
                    </button>
                    <span className={`px-2 py-0.5 text-xs font-chicago rounded ${template.isPhysical ? "bg-ama/20 text-ama" : "bg-verde/20 text-verde"}`}>
                      {template.isPhysical ? dict?.physical : dict?.digital}
                    </span>
                  </div>
                  <p className="text-white text-xs font-slim break-all">
                    {template.templateContract}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </FancyBorder>
  );
};
