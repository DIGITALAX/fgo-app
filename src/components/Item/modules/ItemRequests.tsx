import { useItemRequests } from "../hooks/useItemRequests";
import { useApprovalActions } from "../hooks/useApprovalActions";
import { ApprovalAmountInput } from "./ApprovalAmountInput";
import { ItemRequestsProps } from "../types";
import { useAccount } from "wagmi";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";
import Image from "next/image";

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

  const MAX_UINT256_STRING =
    "115792089237316195423570985008687907853269984665640564039457584007913129639935";

  const formatAmountDisplay = (value?: string | null) => {
    if (!value) {
      return "0";
    }

    if (value === MAX_UINT256_STRING) {
      return dict?.unlimited;
    }

    return value;
  };

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
    <FancyBorder type="diamond" color="oro" className="bg-black p-6 space-y-4">
      <h3 className="text-lg font-agency uppercase text-white mb-4">
        {dict?.requests}
      </h3>

      {item.marketRequests && item.marketRequests.length > 0 && (
        <div className="space-y-3">
          <span className="text-oro font-agency  pb-2">{dict?.marketRequests}</span>
          <div className="space-y-4 pb-2">
            {item.marketRequests.map((request, index: number) => (
              <div key={index} className="relative w-full bg-black/50 space-y-3">
                <div className="pt-4 flex flex-col md:flex-row sm:items-center justify-between gap-4 flex-wrap">
                  <div className="flex-1 space-y-3">
                    <div>
                      <span className="text-oro font-agency text-sm">
                        {dict?.marketContract}:
                      </span>
                      <span className="text-white font-slim text-sm ml-2 break-all">
                        {request.marketContract}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-oro font-agency text-sm">
                          {dict?.date}:
                        </span>
                        <span className="text-white font-slim text-sm ml-1">
                          {formatTimestamp(request.timestamp)}
                        </span>
                      </div>
                      <div>
                        <span className="text-oro font-agency text-sm">
                          {dict?.status}:
                        </span>
                        <span className="text-white font-slim text-sm ml-1">
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
                        className="px-3 py-1 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white text-sm rounded-sm font-pixel transition-colors flex items-center gap-1"
                      >
                        {loadingStates[
                          `approve-market-${request.marketContract}`
                        ] && (
                          <div className="relative w-fit animate-spin h-fit flex">
                            <div className="relative w-3 h-3 flex">
                              <Image
                                layout="fill"
                                objectFit="cover"
                                src={"/images/scissors.png"}
                                draggable={false}
                                alt="loader"
                              />
                            </div>
                          </div>
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
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white text-sm rounded-sm font-pixel transition-colors flex items-center gap-1"
                      >
                        {loadingStates[
                          `reject-market-${request.marketContract}`
                        ] && (
                          <div className="relative w-fit animate-spin h-fit flex">
                            <div className="relative w-3 h-3 flex">
                              <Image
                                layout="fill"
                                objectFit="cover"
                                src={"/images/scissors.png"}
                                draggable={false}
                                alt="loader"
                              />
                            </div>
                          </div>
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
        <div className="space-y-3">
          <span className="text-oro font-agency  pb-2">{dict?.templateRequests}</span>
          <div className="space-y-4 pb-2">
            {processedTemplateRequests.map((request, index: number) => (
              <div key={index} className="bg-black/50 space-y-3">
                <div className="flex pt-4 flex-col md:flex-row sm:items-center justify-between gap-4 flex-wrap">
                  <div className="flex-1 space-y-3">
                    <button
                      onClick={() =>
                        handleTemplateClick(
                          request.templateContract,
                          request.templateId
                        )
                      }
                      className="text-oro hover:text-oro/80 font-agency text-sm underline flex items-center gap-2"
                    >
                      {request.template?.metadata?.image && (
                        <div className="relative w-6 h-6 flex-shrink-0">
                          <Image
                            draggable={false}
                            src={getImageUrl(request.template.metadata.image)}
                            alt=""
                            layout="fill"
                            className="object-cover"
                          />
                        </div>
                      )}
                      {request.template?.metadata?.title ||
                        `Template ${request.templateId}`}
                    </button>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                      <div>
                        <span className="text-oro font-agency text-sm">
                          {dict?.requested}:
                        </span>
                        <span className="text-white font-slim text-sm ml-1">
                          {formatAmountDisplay(request.requestedAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-oro font-agency text-sm">
                          {dict?.approved}:
                        </span>
                        <span className="text-white font-slim text-sm ml-1">
                          {formatAmountDisplay(request.approvedAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-oro font-agency text-sm">
                          {dict?.type}:
                        </span>
                        <span
                          className={`font-chicago text-xs ml-1 ${
                            request.isPhysical ? "text-ama" : "text-verde"
                          }`}
                        >
                          {request.isPhysical ? dict?.physical : dict?.digital}
                        </span>
                      </div>
                      <div>
                        <span className="text-oro font-agency text-sm">
                          {dict?.date}:
                        </span>
                        <span className="text-white font-slim text-sm ml-1">
                          {formatTimestamp(request.timestamp)}
                        </span>
                      </div>
                      <div>
                        <span className="text-oro font-agency text-sm">
                          {dict?.status}:
                        </span>
                        <span className="text-white font-slim text-sm ml-1">
                          {
                            getStatusInfo(request.isPending, request.approved)
                              .text
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  {isOwner &&
                    request.isPending &&
                    (() => {
                      return (
                        <ApprovalAmountInput
                          dict={dict}
                          requestedAmount={request.requestedAmount}
                          onApprove={(amount) =>
                            approveTemplateRequest(
                              request.templateContract,
                              request.templateId,
                              amount,
                              request.isPhysical
                            )
                          }
                          onReject={() =>
                            rejectTemplateRequest(
                              request.templateContract,
                              request.templateId,
                              request.isPhysical
                            )
                          }
                          loading={
                            loadingStates[
                              `approve-template-${request.templateContract}-${
                                request.templateId
                              }-${request.isPhysical ? "physical" : "digital"}`
                            ]
                          }
                          rejecting={
                            loadingStates[
                              `reject-template-${request.templateContract}-${
                                request.templateId
                              }-${request.isPhysical ? "physical" : "digital"}`
                            ]
                          }
                        />
                      );
                    })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {processedParentRequests.length > 0 && (
        <div className="space-y-3">
          <span className="text-oro font-agency pb-2">{dict?.parentRequests}</span>
          <div className="space-y-4">
            {processedParentRequests.map((request, index: number) => (
              <div key={index} className="bg-black/50 space-y-3">
                <div className="pt-4 flex flex-col md:flex-row sm:items-center justify-between gap-4 flex-wrap">
                  <div className="flex-1 space-y-3">
                    <button
                      onClick={() =>
                        handleParentClick(
                          request.parentContract,
                          request.parentId
                        )
                      }
                      className="text-oro hover:text-oro/80 font-agency text-sm underline flex items-center gap-2"
                    >
                      {request.parent?.metadata?.image && (
                        <div className="relative w-6 h-6 flex-shrink-0">
                          <Image
                            draggable={false}
                            src={getImageUrl(request.parent.metadata.image)}
                            alt=""
                            layout="fill"
                            className="object-cover"
                          />
                        </div>
                      )}
                      {request.parent?.metadata?.title ||
                        `Parent ${request.parentId}`}
                    </button>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                      <div>
                        <span className="text-oro font-agency text-sm">
                          {dict?.requested}:
                        </span>
                        <span className="text-white font-slim text-sm ml-1">
                          {formatAmountDisplay(request.requestedAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-oro font-agency text-sm">
                          {dict?.approved}:
                        </span>
                        <span className="text-white font-slim text-sm ml-1">
                          {formatAmountDisplay(request.approvedAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-oro font-agency text-sm">
                          {dict?.type}:
                        </span>
                        <span
                          className={`font-chicago text-xs ml-1 ${
                            request.isPhysical ? "text-ama" : "text-verde"
                          }`}
                        >
                          {request.isPhysical ? dict?.physical : dict?.digital}
                        </span>
                      </div>
                      <div>
                        <span className="text-oro font-agency text-sm">
                          {dict?.date}:
                        </span>
                        <span className="text-white font-slim text-sm ml-1">
                          {formatTimestamp(request.timestamp)}
                        </span>
                      </div>
                      <div>
                        <span className="text-oro font-agency text-sm">
                          {dict?.status}:
                        </span>
                        <span className="text-white font-slim text-sm ml-1">
                          {
                            getStatusInfo(request.isPending, request.approved)
                              .text
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  {isOwner &&
                    request.isPending &&
                    (() => {
                      return (
                        <ApprovalAmountInput
                          dict={dict}
                          requestedAmount={request.requestedAmount}
                          onApprove={(amount) =>
                            approveParentRequest(
                              request.parentContract,
                              request.parentId,
                              amount,
                              request.isPhysical
                            )
                          }
                          onReject={() =>
                            rejectParentRequest(
                              request.parentContract,
                              request.parentId,
                              request.isPhysical
                            )
                          }
                          loading={
                            loadingStates[
                              `approve-parent-${request.parentContract}-${
                                request.parentId
                              }-${request.isPhysical ? "physical" : "digital"}`
                            ]
                          }
                          rejecting={
                            loadingStates[
                              `reject-parent-${request.parentContract}-${
                                request.parentId
                              }-${request.isPhysical ? "physical" : "digital"}`
                            ]
                          }
                        />
                      );
                    })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </FancyBorder>
  );
};
