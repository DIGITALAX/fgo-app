import Image from "next/image";
import { useItemAuthorized } from "../hooks/useItemAuthorized";
import { Child, ItemAuthorizedProps } from "../types";

export const ItemAuthorized = ({ item }: ItemAuthorizedProps) => {
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
      <div className="border border-white rounded-sm p-6">
        <div className="text-ama font-herm">Loading authorized items...</div>
      </div>
    );
  }

  if (!hasAuthorized) {
    return null;
  }

  return (
    <div className="border border-white rounded-sm p-6">
      <h3 className="text-lg font-herm text-white mb-4">Authorized Items</h3>

      {processedAuthorizedChildren.length > 0 && (
        <div className="mb-6">
          <h4 className="text-ama font-herm mb-3">Authorized Children</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {processedAuthorizedChildren.map((child, index: number) => (
              <button
                key={index}
                onClick={() =>
                  handleChildClick(child.childContract, child.childId)
                }
                className="p-2 gap-2 flex flex-col border border-white rounded-sm overflow-hidden hover:opacity-70"
              >
                {child.metadata?.image && (
                  <div className="relative w-full h-20">
                    <Image
                      draggable={false}
                      fill
                      sizes="300px"
                      src={getImageUrl(child.metadata.image)}
                      alt={child.metadata?.title || `Child ${child.childId}`}
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="text-ama font-herm text-sm underline">
                  {child.metadata?.title || `Child ${child.childId}`}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {processedAuthorizedParents.length > 0 && (
        <div className="mb-6">
          <h4 className="text-ama font-herm mb-3">Authorized Parents</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedAuthorizedParents.map((parent, index: number) => (
              <div
                key={index}
                className="bg-black/20 border border-white/30 rounded-sm overflow-hidden"
              >
                {parent.metadata?.image && (
                  <div className="relative w-full h-32">
                    <Image
                      draggable={false}
                      fill
                      sizes="300px"
                      src={getImageUrl(parent.metadata.image)}
                      alt={
                        parent.metadata?.title ||
                        `Parent ${parent.parentId}`
                      }
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="p-4">
                  <button
                    onClick={() =>
                      handleParentClick(
                        parent.parentContract,
                        parent.parentId
                      )
                    }
                    className="text-ama hover:text-ama/80 font-herm text-sm underline mb-2"
                  >
                    {parent.metadata?.title || `Parent ${parent.parentId}`}
                  </button>
                  <p className="text-ama text-xs font-herm break-all">
                    {parent.parentContract}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {processedAuthorizedTemplates.length > 0 && (
        <div>
          <h4 className="text-ama font-herm mb-3">Authorized Templates</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedAuthorizedTemplates.map((template, index: number) => (
              <div
                key={index}
                className="bg-black/20 border border-white/30 rounded-sm overflow-hidden"
              >
                {template.metadata?.image && (
                  <div className="relative w-full h-32">
                    <Image
                      draggable={false}
                      fill
                      sizes="300px"
                      src={getImageUrl(template.metadata.image)}
                      alt={
                        template.metadata?.title ||
                        `Template ${template.templateId}`
                      }
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="p-4">
                  <button
                    onClick={() =>
                      handleTemplateClick(
                        template.templateContract,
                        template.templateId
                      )
                    }
                    className="text-ama hover:text-ama/80 font-herm text-sm underline mb-2"
                  >
                    {template.metadata?.title ||
                      `Template ${template.templateId}`}
                  </button>
                  <p className="text-ama text-xs font-herm break-all">
                    {template.templateContract}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
