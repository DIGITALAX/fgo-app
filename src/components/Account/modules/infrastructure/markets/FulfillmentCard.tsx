import Image from "next/image";
import {
  Details,
  EncryptedData,
  FulfillmentCardProps,
} from "@/components/Account/types";
import { INFURA_GATEWAY, getCurrentNetwork } from "@/constants";
import { useRouter } from "next/navigation";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";
import useSteps, {
  isEncryptedDetails,
} from "@/components/Account/hooks/infrastructure/markets/useSteps";
import { getOrderLabel } from "@/lib/helpers/availability";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/helpers/price";
import { useAccount } from "wagmi";

export const FulfillmentCard = ({
  fulfillment,
  dict,
  setFlows,
}: FulfillmentCardProps) => {
  const { address } = useAccount();
  const [formattedTotalPayments, setFormattedTotalPayments] =
    useState<string>("");
  const {
    completing,
    completeStep,
    notes,
    setNotes,
    handleDecryptFulfillment,
    decrypting,
  } = useSteps(dict, setFlows, fulfillment);

  useEffect(() => {
    const loadPrices = async () => {
      if (!fulfillment?.parent?.infraCurrency) return;

      if (fulfillment?.order?.totalPayments) {
        const formatted = await formatPrice(
          fulfillment.order.totalPayments,
          fulfillment.parent.infraCurrency
        );
        setFormattedTotalPayments(formatted);
      }
    };
    loadPrices();
  }, [fulfillment]);
  const displayTitle =
    fulfillment?.parent?.metadata?.title ||
    fulfillment?.parent?.title ||
    dict?.unnamedParent;
  const displayImage =
    `${INFURA_GATEWAY}${
      fulfillment?.parent?.metadata?.image?.split("ipfs://")?.[1]
    }` || "";
  const router = useRouter();
  const workflow = fulfillment?.isPhysical
    ? fulfillment?.physicalSteps
    : fulfillment?.digitalSteps;
  const network = getCurrentNetwork();

  return (
    <FancyBorder
      color="oro"
      type="diamond"
      className="relative overflow-hidden"
    >
      <div className="relative z-10 p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div
            className="relative aspect-square w-20 h-20 flex-shrink-0 cursor-pointer"
            onClick={() =>
              router.push(
                `/library/parent/${fulfillment?.parent?.parentContract}/${fulfillment?.parent?.designId}`
              )
            }
          >
            <Image
              src={displayImage}
              fill
              draggable={false}
              alt={displayTitle}
              className="object-cover rounded-md"
            />
            <div className="absolute z-0 top-0 left-0 w-full h-full flex">
              <Image
                src={"/images/borderblue.png"}
                draggable={false}
                objectFit="fill"
                fill
                alt="border"
              />
            </div>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="text-xs font-awk uppercase tracking-wide mb-1 text-oro">
              {dict?.order} #{fulfillment?.orderId}
            </div>
            <h4 className="font-agency text-base leading-tight text-white truncate">
              {displayTitle}
            </h4>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-xs text-gris font-chicago relative lowercase flex px-2 py-1 bg-offNegro">
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
                  {fulfillment?.isPhysical ? dict?.physical : dict?.digital}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <span className="font-awk uppercase text-gris text-xs">
              {dict?.status}:
            </span>
            <p className="text-white font-chicago">
              {getOrderLabel(fulfillment?.order?.orderStatus, dict) ||
                dict?.pending}
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-awk uppercase text-gris text-xs">
              {dict?.currentStep}:
            </span>
            <p className="text-white font-chicago">
              {fulfillment.fulfillmentOrderSteps?.every(
                (step) => step.isCompleted
              )
                ? Number(fulfillment?.currentStep)
                : Number(fulfillment?.currentStep) + 1}
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-awk uppercase text-gris text-xs">
              {dict?.created}:
            </span>
            <p className="text-white font-chicago text-xs">
              {new Date(
                parseInt(fulfillment?.createdAt) * 1000
              ).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-awk uppercase text-gris text-xs">
              {dict?.updated}:
            </span>
            <p className="text-white font-chicago text-xs">
              {new Date(
                parseInt(fulfillment?.lastUpdated) * 1000
              ).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-awk uppercase text-gris text-xs">
              {dict?.progress}:
            </span>
            <p className="text-white font-chicago">
              {
                fulfillment?.fulfillmentOrderSteps?.map(
                  (item) => item.isCompleted
                ).length
              }
              /{workflow?.length}
            </p>
          </div>
          {fulfillment?.estimatedDeliveryDuration && (
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.estimatedDeliveryDuration}:
              </span>
              <p className="text-white font-chicago text-xs">
                {Math.floor(
                  parseInt(fulfillment?.estimatedDeliveryDuration) / 86400
                )}{" "}
                {dict?.days}
              </p>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-oro/30 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {fulfillment?.order?.parentAmount && (
              <div className="space-y-1">
                <span className="font-awk uppercase text-gris text-xs">
                  {dict?.parentAmount}:
                </span>
                <p className="text-white font-chicago">
                  {fulfillment?.order?.parentAmount}
                </p>
              </div>
            )}
            {fulfillment?.order?.totalPayments && (
              <div className="space-y-1">
                <span className="font-awk uppercase text-gris text-xs">
                  {dict?.totalPayments}:
                </span>
                <p className="text-white font-chicago">
                  {formattedTotalPayments || fulfillment?.order.totalPayments}
                </p>
              </div>
            )}
          </div>
          {fulfillment?.order?.transactionHash && (
            <a
              href={`${network.blockExplorer}/tx/${fulfillment.order.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-oro hover:text-white transition-colors"
            >
              <span className="font-awk uppercase text-gris">
                {dict?.txHash}
              </span>
              <span className="font-chicago break-all">
                {fulfillment.order.transactionHash.substring(0, 12)}...
              </span>
            </a>
          )}
        </div>

        {(fulfillment?.order?.fulfillmentData ||
          isEncryptedDetails(
            fulfillment?.order?.fulfillmentData as EncryptedData
          )) && (
          <div className="pt-2 border-t border-oro/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-awk uppercase text-gris block">
                {dict?.info}
              </span>
              {!fulfillment?.order?.decrypted &&
                isEncryptedDetails(
                  fulfillment?.order?.fulfillmentData as EncryptedData
                ) && (
                  <button
                    onClick={() => !decrypting && handleDecryptFulfillment()}
                    disabled={decrypting}
                    className="text-xs font-chicago text-white hover:text-oro transition-colors disabled:opacity-50"
                  >
                    {decrypting ? (
                      <div className="relative w-4 h-4 animate-spin">
                        <Image
                          layout="fill"
                          objectFit="cover"
                          src={"/images/scissors.png"}
                          draggable={false}
                          alt="loader"
                        />
                      </div>
                    ) : (
                      dict?.decrypt
                    )}
                  </button>
                )}
            </div>
            {fulfillment?.order?.decrypted && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(fulfillment?.order?.fulfillmentData as Details)?.address && (
                  <div className="space-y-1">
                    <span className="font-awk uppercase text-gris text-xs">
                      {dict?.address}:
                    </span>
                    <p className="text-white font-chicago break-all">
                      {
                        (fulfillment?.order?.fulfillmentData as Details)
                          ?.address
                      }
                    </p>
                  </div>
                )}
                {(fulfillment?.order?.fulfillmentData as Details)?.city && (
                  <div className="space-y-1">
                    <span className="font-awk uppercase text-gris text-xs">
                      {dict?.city}:
                    </span>
                    <p className="text-white font-chicago">
                      {(fulfillment?.order?.fulfillmentData as Details)?.city}
                    </p>
                  </div>
                )}
                {(fulfillment?.order?.fulfillmentData as Details)?.state && (
                  <div className="space-y-1">
                    <span className="font-awk uppercase text-gris text-xs">
                      {dict?.state}:
                    </span>
                    <p className="text-white font-chicago">
                      {(fulfillment?.order?.fulfillmentData as Details)?.state}
                    </p>
                  </div>
                )}
                {(fulfillment?.order?.fulfillmentData as Details)?.zip && (
                  <div className="space-y-1">
                    <span className="font-awk uppercase text-gris text-xs">
                      {dict?.zip}:
                    </span>
                    <p className="text-white font-chicago">
                      {(fulfillment?.order?.fulfillmentData as Details)?.zip}
                    </p>
                  </div>
                )}
                {(fulfillment?.order?.fulfillmentData as Details)?.country && (
                  <div className="space-y-1">
                    <span className="font-awk uppercase text-gris text-xs">
                      {dict?.country}:
                    </span>
                    <p className="text-white font-chicago">
                      {
                        (fulfillment?.order?.fulfillmentData as Details)
                          ?.country
                      }
                    </p>
                  </div>
                )}
                {(fulfillment?.order?.fulfillmentData as Details)?.size && (
                  <div className="space-y-1">
                    <span className="font-awk uppercase text-gris text-xs">
                      {dict?.size}:
                    </span>
                    <p className="text-white font-chicago">
                      {(fulfillment?.order?.fulfillmentData as Details)?.size}
                    </p>
                  </div>
                )}
              </div>
            )}
            {!fulfillment?.order?.decrypted && (
              <p className="text-xs text-gris font-chicago">
                {dict?.encryptedData}
              </p>
            )}
          </div>
        )}

        {workflow?.length > 0 && (
          <div className="pt-2 border-t border-oro/30 space-y-2">
            <span className="text-xs font-awk uppercase text-gris block">
              {fulfillment?.isPhysical
                ? dict?.physicalSteps
                : dict?.digitalSteps}
              :
            </span>
            <div className="space-y-2">
              {workflow?.map((step, index) => (
                <div
                  key={index}
                  className="space-y-1 text-xs border-l border-gris/30 pl-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-chicago text-gris">
                      {dict?.step} {index + 1}
                    </span>
                    {step?.fulfiller && (
                      <div className="space-y-1">
                        <span className="font-awk uppercase text-gris text-xs block">
                          {dict?.primaryFulfiller}:
                        </span>
                        <span className="text-oro font-chicago break-all block">
                          {step?.fulfiller?.metadata?.title ??
                            step?.fulfiller?.fulfiller}
                        </span>
                      </div>
                    )}
                  </div>

                  {step?.instructions && (
                    <p className="text-white font-chicago">
                      {step?.instructions}
                    </p>
                  )}
                  {step?.subPerformers && step?.subPerformers?.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-gris font-awk uppercase text-xs">
                        {dict?.subPerformers}:
                      </span>
                      {step?.subPerformers?.map((subPerformer, subIndex) => (
                        <div
                          key={subIndex}
                          className="flex items-center gap-2 text-gris ml-2"
                        >
                          <span className="text-oro">•</span>
                          <span className="break-all text-xs">
                            {subPerformer?.performer}
                          </span>
                          {subPerformer?.splitBasisPoints > 0 && (
                            <span className="text-oro text-xs flex-shrink-0">
                              {(subPerformer.splitBasisPoints / 100).toFixed(0)}
                              %
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {step?.fulfiller?.fulfiller?.toLowerCase() ===
                    address?.toLowerCase() &&
                    fulfillment?.fulfillmentOrderSteps?.length == index && (
                      <div className="pt-2 border-t border-oro/30 space-y-2">
                        <div className="space-y-1">
                          <label className="block text-xs font-awk uppercase text-gris">
                            {dict?.notes}
                          </label>
                          <div className="flex flex-col w-full items-start gap-2">
                            <FancyBorder
                              color="white"
                              type="circle"
                              className="relative flex w-full"
                            >
                              <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder={dict?.notesPlaceholder}
                                className="relative z-10 h-32 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none align-top resize-none"
                              ></textarea>
                            </FancyBorder>
                            <div
                              onClick={() => !completing && completeStep(index)}
                              className="relative cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              <div className="text-xs text-white font-chicago relative lowercase flex px-3 py-2 bg-offNegro">
                                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                                  <Image
                                    src={"/images/borderoro2.png"}
                                    draggable={false}
                                    objectFit="fill"
                                    fill
                                    alt="border"
                                  />
                                </div>
                                <div className="relative z-10 flex items-center gap-2">
                                  {completing ? (
                                    <div className="relative w-4 h-4 animate-spin">
                                      <Image
                                        layout="fill"
                                        objectFit="cover"
                                        src={"/images/scissors.png"}
                                        draggable={false}
                                        alt="loader"
                                      />
                                    </div>
                                  ) : (
                                    dict?.completeStep
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  {fulfillment?.fulfillmentOrderSteps[index] && (
                    <div className="pt-2 border-t border-oro/30 font-chicago">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-awk uppercase text-gris">
                          {dict?.fulfillmentSteps}:
                        </span>
                        <span className="text-xs text-oro font-chicago">
                          {
                            fulfillment?.fulfillmentOrderSteps?.map(
                              (item) => item.isCompleted
                            ).length
                          }
                          /{workflow?.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div
                            className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                              fulfillment?.fulfillmentOrderSteps[index]
                                ?.isCompleted
                                ? "bg-oro border-oro"
                                : "border-gris bg-offNegro"
                            }`}
                          >
                            {fulfillment?.fulfillmentOrderSteps[index]
                              ?.isCompleted && (
                              <span className="text-black text-xs">✓</span>
                            )}
                          </div>
                          <span className="text-gris">
                            {dict?.step} {index + 1}
                          </span>
                          {fulfillment?.fulfillmentOrderSteps[index]
                            ?.completedAt &&
                            fulfillment?.fulfillmentOrderSteps[index]
                              ?.completedAt !== "0" && (
                              <span className="text-oro text-xs ml-auto">
                                {new Date(
                                  parseInt(
                                    fulfillment?.fulfillmentOrderSteps[index]
                                      ?.completedAt
                                  ) * 1000
                                ).toLocaleDateString()}
                              </span>
                            )}
                        </div>
                        {fulfillment?.fulfillmentOrderSteps[index]?.notes &&
                          typeof fulfillment?.fulfillmentOrderSteps[index]
                            ?.notes === "string" && (
                            <div className="pl-6 text-xs text-gris font-chicago">
                              {fulfillment?.fulfillmentOrderSteps[index]?.notes}
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </FancyBorder>
  );
};
