import { useItemRequests } from "../hooks/useItemRequests";
import { useApprovalActions } from "../hooks/useApprovalActions";
import { ApprovalAmountInput } from "./ApprovalAmountInput";
import { ItemRequestsProps } from "../types";
import { useAccount } from "wagmi";

export const ItemRequests = ({ item, dict }: ItemRequestsProps) => {
  const { address } = useAccount();
  const {
    handleTemplateClick,
    handleParentClick,
    formatTimestamp,
    getStatusInfo,
    getImageUrl,
    processedParentRequests,
    processedTemplateRequests,
    loading,
  } = useItemRequests(item);

  const getItemId = () => {
    if ("childId" in item) return item.childId;
    if ("templateId" in item) return item.templateId;
    if ("designId" in item) return item.designId;
    return "";
  };

  const getContractAddress = () => {
    if ("childContract" in item) return item.childContract;
    if ("templateContract" in item) return item.templateContract;
    if ("parentContract" in item) return item.parentContract;
    return "";
  };

  const getContractType = (): "child" | "template" | "parent" => {
    if ("childId" in item) return "child";
    if ("templateId" in item) return "template";
    return "parent";
  };

  const getOwnerAddress = () => {
    if ("supplier" in item) return item.supplier;
    if ("designer" in item) return item.designer;
    return "";
  };

  const isOwner =
    address && address.toLowerCase() === getOwnerAddress().toLowerCase();

  const {
    approveMarketRequest,
    rejectMarketRequest,
    approveParentRequest,
    rejectParentRequest,
    approveTemplateRequest,
    rejectTemplateRequest,
    loadingStates,
  } = useApprovalActions(
    getContractAddress(),
    getItemId(),
    getContractType(),
    dict
  );

  const hasRequests =
    processedTemplateRequests.length > 0 ||
    processedParentRequests.length > 0 ||
    (item.marketRequests && item.marketRequests.length > 0);

  if (!hasRequests) {
    return null;
  }

  return (
    <div className="border border-white rounded-sm p-6">
      <h3 className="text-lg font-herm text-white mb-4">{dict?.requests}</h3>

      {item.marketRequests && item.marketRequests.length > 0 && (
        <div className="mb-6">
          <h4 className="text-ama font-herm mb-3">{dict?.marketRequests}</h4>
          <div className="space-y-3">
            {item.marketRequests.map((request, index: number) => (
              <div
                key={index}
                className="bg-black/20 border border-white/30 rounded-sm p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="text-white font-herm text-sm">
                        {dict?.marketContract}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-ama">
                      <div>
                        <span className="text-ama">{dict?.contract}</span>
                        <span className="font-herm text-xs break-all ml-1 text-white">
                          {request.marketContract}
                        </span>
                      </div>
                      <div>
                        <span className="text-ama">{dict?.date}</span>{" "}
                        <span className="text-white">
                          {formatTimestamp(request.timestamp)}
                        </span>
                      </div>
                      <div>
                        <span className="text-ama">{dict?.status}:</span>
                        <span className="text-white font-herm text-xs ml-1">
                          {
                            getStatusInfo(request.isPending, request.approved)
                              .text
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  {isOwner && request.isPending && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          approveMarketRequest(request.marketContract)
                        }
                        disabled={
                          loadingStates[
                            `approve-market-${request.marketContract}`
                          ]
                        }
                        className="px-3 py-1 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white text-sm rounded-sm font-herm transition-colors flex items-center gap-1"
                      >
                        {loadingStates[
                          `approve-market-${request.marketContract}`
                        ] && (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        )}
                        {dict?.approve}
                      </button>
                      <button
                        onClick={() =>
                          rejectMarketRequest(request.marketContract)
                        }
                        disabled={
                          loadingStates[
                            `reject-market-${request.marketContract}`
                          ]
                        }
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white text-sm rounded-sm font-herm transition-colors flex items-center gap-1"
                      >
                        {loadingStates[
                          `reject-market-${request.marketContract}`
                        ] && (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        )}
                        {dict?.reject}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {processedTemplateRequests.length > 0 && (
        <div className="mb-6">
          <h4 className="text-ama font-herm mb-3">{dict?.templateRequests}</h4>
          <div className="space-y-3">
            {processedTemplateRequests.map((request, index: number) => (
              <div
                key={index}
                className="bg-black/20 border border-white/30 rounded-sm p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2">
                      <button
                        onClick={() =>
                          handleTemplateClick(
                            request.templateContract,
                            request.templateId
                          )
                        }
                        className="text-ama hover:text-ama/80 font-herm text-sm underline flex items-center gap-2"
                      >
                        {request.template?.metadata?.image && (
                          <img
                            src={getImageUrl(request.template.metadata.image)}
                            alt=""
                            className="w-6 h-6 rounded-sm object-cover"
                          />
                        )}
                        {request.template?.metadata?.title ||
                          `Template ${request.templateId}`}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs text-ama">
                      <div>
                        <span className="text-ama">{dict?.requested}</span>{" "}
                        <span className="text-white">
                          {request.requestedAmount}
                        </span>
                      </div>
                      <div>
                        <span className="text-ama">{dict?.approved}:</span>{" "}
                        <span className="text-white">
                          {request.approvedAmount || "0"}
                        </span>
                      </div>
                      <div>
                        <span className="text-ama">{dict?.date}</span>{" "}
                        <span className="text-white">
                          {formatTimestamp(request.timestamp)}
                        </span>
                      </div>
                      <div>
                        <span className="text-ama">{dict?.status}:</span>
                        <span className="text-white font-herm text-xs ml-1">
                          {
                            getStatusInfo(request.isPending, request.approved)
                              .text
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  {isOwner && request.isPending && (
                    <ApprovalAmountInput
                      isSupplier={isOwner}
                      dict={dict}
                      requestedAmount={request.requestedAmount}
                      onApprove={(amount) =>
                        approveTemplateRequest(
                          request.templateContract,
                          request.templateId,
                          amount
                        )
                      }
                      onReject={() =>
                        rejectTemplateRequest(
                          request.templateContract,
                          request.templateId
                        )
                      }
                      loading={
                        loadingStates[
                          `approve-template-${request.templateContract}-${request.templateId}`
                        ]
                      }
                      rejecting={
                        loadingStates[
                          `reject-template-${request.templateContract}-${request.templateId}`
                        ]
                      }
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {processedParentRequests.length > 0 && (
        <div>
          <h4 className="text-ama font-herm mb-3">{dict?.parentRequests}</h4>
          <div className="space-y-3">
            {processedParentRequests.map((request, index: number) => (
              <div
                key={index}
                className="bg-black/20 border border-white/30 rounded-sm p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2">
                      <button
                        onClick={() =>
                          handleParentClick(
                            request.parentContract,
                            request.parentId
                          )
                        }
                        className="text-ama hover:text-ama/80 font-herm text-sm underline flex items-center gap-2"
                      >
                        {request.parent?.metadata?.image && (
                          <img
                            src={getImageUrl(request.parent.metadata.image)}
                            alt=""
                            className="w-6 h-6 rounded-sm object-cover"
                          />
                        )}
                        {request.parent?.metadata?.title ||
                          `Parent ${request.parentId}`}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs text-ama">
                      <div>
                        <span className="text-ama">{dict?.requested}</span>{" "}
                        <span className="text-white">
                          {request.requestedAmount}
                        </span>
                      </div>
                      <div>
                        <span className="text-ama">{dict?.approved}:</span>{" "}
                        <span className="text-white">
                          {request.approvedAmount || "0"}
                        </span>
                      </div>
                      <div>
                        <span className="text-ama">{dict?.date}</span>{" "}
                        <span className="text-white">
                          {formatTimestamp(request.timestamp)}
                        </span>
                      </div>
                      <div>
                        <span className="text-ama">{dict?.status}:</span>
                        <span className="text-white font-herm text-xs ml-1">
                          {
                            getStatusInfo(request.isPending, request.approved)
                              .text
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  {isOwner && request.isPending && (
                    <ApprovalAmountInput
                      isSupplier={isOwner}
                      dict={dict}
                      requestedAmount={request.requestedAmount}
                      onApprove={(amount) =>
                        approveParentRequest(
                          request.parentContract,
                          request.parentId,
                          amount
                        )
                      }
                      onReject={() =>
                        rejectParentRequest(
                          request.parentContract,
                          request.parentId
                        )
                      }
                      loading={
                        loadingStates[
                          `approve-parent-${request.parentContract}-${request.parentId}`
                        ]
                      }
                      rejecting={
                        loadingStates[
                          `reject-parent-${request.parentContract}-${request.parentId}`
                        ]
                      }
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
