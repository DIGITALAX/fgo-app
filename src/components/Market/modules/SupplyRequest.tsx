"use client";

import { useParams, useRouter } from "next/navigation";
import { SupplyRequestProps } from "../types";
import { useSupplyRequest } from "../hooks/useSupplyRequest";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";
import { getIPFSUrl } from "@/lib/helpers/ipfs";
import { formatDistanceToNow } from "date-fns";
import { truncateAddress } from "@/lib/helpers/address";
import { getCurrentNetwork } from "@/constants";
import { formatPrice } from "@/lib/helpers/price";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useSupplierChildren } from "../hooks/useSupplierChildren";
import { SupplierChildSelectionModal } from "./SupplierChildSelectionModal";

export const SupplyRequest = ({ dict }: SupplyRequestProps) => {
  const { id } = useParams();
  const router = useRouter();
  const { address } = useAccount();
  const {
    error,
    isLoading,
    supplyRequest,
    proposeSupplyMatch,
    cancelProposal,
    approveProposal,
    payForProposal,
    approvingProposalId,
    payingProposalId,
    approvedProposals,
    cancellingProposalId,
    openProposeModal,
    closeProposeModal,
    isProposeModalOpen,
    proposingChildId,
  } = useSupplyRequest(id as string, dict);
  const [childSearch, setChildSearch] = useState<string>("");
  const canManageProposals =
    !supplyRequest?.paid &&
    supplyRequest?.parent?.designer?.toLowerCase() === address?.toLowerCase();
  const canProposeMatch =
    address && !supplyRequest?.paid && !supplyRequest?.matchedSupplier;

  const {
    children: supplierChildren,
    isLoading: supplierChildrenLoading,
    hasMore: supplierChildrenHasMore,
    loadMore: loadMoreSupplierChildren,
    refresh: refreshSupplierChildren,
  } = useSupplierChildren(
    isProposeModalOpen ? address?.toLowerCase() : undefined,
    dict
  );

  useEffect(() => {
    if (!isProposeModalOpen) {
      setChildSearch("");
    } else {
      refreshSupplierChildren();
    }
  }, [isProposeModalOpen, refreshSupplierChildren]);

  const [formattedMaxPrice, setFormattedMaxPrice] = useState<string>("");
  const [formattedMatchedDigitalPrice, setFormattedMatchedDigitalPrice] =
    useState<string>("");
  const [formattedMatchedPhysicalPrice, setFormattedMatchedPhysicalPrice] =
    useState<string>("");
  const [formattedParentDigitalPrice, setFormattedParentDigitalPrice] =
    useState<string>("");
  const [formattedParentPhysicalPrice, setFormattedParentPhysicalPrice] =
    useState<string>("");
  const [formattedProposalPrices, setFormattedProposalPrices] = useState<
    Map<number, { digital: string; physical: string }>
  >(new Map());

  useEffect(() => {
    const loadMaxPrice = async () => {
      if (
        supplyRequest?.preferredMaxPrice &&
        supplyRequest?.parent?.infraCurrency
      ) {
        const price = await formatPrice(
          supplyRequest.preferredMaxPrice,
          supplyRequest?.parent?.infraCurrency
        );
        setFormattedMaxPrice(price);
      } else {
        setFormattedMaxPrice("");
      }
    };
    loadMaxPrice();
  }, [supplyRequest?.preferredMaxPrice, supplyRequest?.parent?.infraCurrency]);

  useEffect(() => {
    const loadMatchedPrices = async () => {
      if (
        !supplyRequest?.matchedChild ||
        !supplyRequest?.parent?.infraCurrency
      ) {
        setFormattedMatchedDigitalPrice("");
        setFormattedMatchedPhysicalPrice("");
        return;
      }

      if (supplyRequest.matchedChild.digitalPrice) {
        const digitalPrice = await formatPrice(
          supplyRequest.matchedChild.digitalPrice,
          supplyRequest?.parent?.infraCurrency
        );
        setFormattedMatchedDigitalPrice(digitalPrice);
      } else {
        setFormattedMatchedDigitalPrice("");
      }

      if (supplyRequest.matchedChild.physicalPrice) {
        const physicalPrice = await formatPrice(
          supplyRequest.matchedChild.physicalPrice,
          supplyRequest?.parent?.infraCurrency
        );
        setFormattedMatchedPhysicalPrice(physicalPrice);
      } else {
        setFormattedMatchedPhysicalPrice("");
      }
    };
    loadMatchedPrices();
  }, [
    supplyRequest?.matchedChild?.digitalPrice,
    supplyRequest?.matchedChild?.physicalPrice,
    supplyRequest?.parent?.infraCurrency,
  ]);

  useEffect(() => {
    const loadParentPrices = async () => {
      if (!supplyRequest?.parent || !supplyRequest?.parent?.infraCurrency)
        return;

      if (supplyRequest.parent.digitalPrice) {
        const digitalPrice = await formatPrice(
          supplyRequest.parent.digitalPrice,
          supplyRequest?.parent?.infraCurrency
        );
        setFormattedParentDigitalPrice(digitalPrice);
      }

      if (supplyRequest.parent.physicalPrice) {
        const physicalPrice = await formatPrice(
          supplyRequest.parent.physicalPrice,
          supplyRequest?.parent?.infraCurrency
        );
        setFormattedParentPhysicalPrice(physicalPrice);
      }
    };
    loadParentPrices();
  }, [supplyRequest]);

  useEffect(() => {
    const loadProposalPrices = async () => {
      if (
        !supplyRequest?.proposals ||
        supplyRequest.proposals.length === 0 ||
        !supplyRequest?.parent?.infraCurrency
      )
        return;

      const priceMap = new Map<number, { digital: string; physical: string }>();
      for (let i = 0; i < supplyRequest.proposals.length; i++) {
        const proposal = supplyRequest.proposals[i];
        if (proposal.child) {
          const digitalPrice =
            proposal.child.digitalPrice && proposal.child.digitalPrice !== "0"
              ? await formatPrice(
                  proposal.child.digitalPrice,
                  supplyRequest?.parent?.infraCurrency
                )
              : "0";
          const physicalPrice =
            proposal.child.physicalPrice && proposal.child.physicalPrice !== "0"
              ? await formatPrice(
                  proposal.child.physicalPrice,
                  supplyRequest?.parent?.infraCurrency
                )
              : "0";
          priceMap.set(i, { digital: digitalPrice, physical: physicalPrice });
        }
      }
      setFormattedProposalPrices(priceMap);
    };
    loadProposalPrices();
  }, [supplyRequest]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
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
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-6">
        <p className="text-fresa font-chicago text-sm">
          {dict?.error}: {error}
        </p>
      </div>
    );
  }

  if (!supplyRequest) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-6">
        <p className="text-white font-chicago text-sm">
          {dict?.supplyRequestNotFound}
        </p>
      </div>
    );
  }

  const deadline =
    supplyRequest.deadline && supplyRequest.deadline !== "0"
      ? formatDistanceToNow(new Date(Number(supplyRequest.deadline) * 1000), {
          addSuffix: true,
        })
      : dict?.unlimited || "Perpetual";

  const network = getCurrentNetwork();

  return (
    <>
      <div className="p-2 md:p-6 space-y-4 h-screen overflow-y-auto">
        <FancyBorder
          type="diamond"
          color="oro"
          className="bg-black p-6 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-lg font-agency uppercase text-white">
            {dict?.requestDetails}
          </h3>
          {canProposeMatch && (
            <button
              type="button"
              onClick={openProposeModal}
              className="relative self-start sm:self-auto"
            >
              <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center hover:opacity-80">
                <span className="relative z-10 uppercase text-oro">
                  {dict?.supplyRequestPropose || dict?.propose}
                </span>
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src="/images/borderoro2.png"
                    draggable={false}
                    fill
                    alt="border"
                  />
                </div>
              </div>
            </button>
          )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <span className="text-oro font-agency">{dict?.quantity}</span>
              <p className="text-white font-slim">{supplyRequest.quantity}</p>
            </div>

            <div className="space-y-2">
              <span className="text-oro font-agency">{dict?.maxPrice}</span>
              <p className="text-white font-slim">
                {formattedMaxPrice || supplyRequest.preferredMaxPrice}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-oro font-agency">{dict?.deadline}</span>
              <p className="text-white font-slim">{deadline}</p>
            </div>

            <div className="space-y-2">
              <span className="text-oro font-agency">{dict?.type}</span>
              <p className="text-white font-slim">
                {supplyRequest.isPhysical ? dict?.physical : dict?.digital}
              </p>
            </div>

            {supplyRequest.placementURI && (
              <div className="space-y-2 col-span-full">
                <span className="text-oro font-agency">
                  {dict?.placementURI}
                </span>
                <p className="text-white font-slim text-xs break-all">
                  {supplyRequest.placementURI}
                </p>
              </div>
            )}

            {supplyRequest.customSpec && (
              <div className="space-y-2 col-span-full">
                <span className="text-oro font-agency">{dict?.customSpec}</span>
                <div className="max-h-40 overflow-y-auto bg-offNegro/30 p-3 rounded">
                  <p className="text-white font-slim text-sm whitespace-pre-wrap">
                    {supplyRequest.customSpec}
                  </p>
                </div>
              </div>
            )}
          </div>

          {supplyRequest.existingChild && (
            <div className="pt-4 border-t border-oro/30">
              <h4 className="text-base font-agency uppercase text-oro mb-3">
                {dict?.existingChild}
              </h4>
              <div
                onClick={() =>
                  router.push(
                    `/library/child/${supplyRequest.existingChild.childContract}/${supplyRequest.existingChild.childId}`
                  )
                }
                className="flex items-center gap-4 cursor-pointer hover:opacity-70 transition-opacity bg-offNegro/30 p-3 rounded"
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={
                      supplyRequest.existingChild.metadata?.image
                        ? getIPFSUrl(supplyRequest.existingChild.metadata.image)
                        : "/images/default.png"
                    }
                    fill
                    draggable={false}
                    alt={
                      supplyRequest.existingChild.metadata?.title ||
                      `Child ${supplyRequest.existingChild.childId}`
                    }
                    className="object-contain rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-agency text-sm truncate">
                    {supplyRequest.existingChild.metadata?.title ||
                      `${dict?.child} ${supplyRequest.existingChild.childId}`}
                  </p>
                  <p className="text-gris font-slim text-xs">
                    {dict?.child} #{supplyRequest.existingChild.childId}
                  </p>
                </div>
              </div>
            </div>
          )}
        </FancyBorder>

        {supplyRequest.matchedChild && (
          <FancyBorder
            type="diamond"
            color="oro"
            className="bg-black p-6 space-y-4"
          >
            <h3 className="text-lg font-agency uppercase text-white mb-4">
              {dict?.matchDetails}
            </h3>

            <div
              onClick={() =>
                router.push(
                  `/library/child/${supplyRequest.matchedChildContract}/${supplyRequest.matchedChildId}`
                )
              }
              className="flex items-center gap-4 cursor-pointer hover:opacity-70 transition-opacity bg-offNegro/30 p-4 rounded mb-4"
            >
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={
                    supplyRequest.matchedChild.metadata?.image
                      ? getIPFSUrl(supplyRequest.matchedChild.metadata.image)
                      : "/images/default.png"
                  }
                  fill
                  draggable={false}
                  alt={
                    supplyRequest.matchedChild.metadata?.title ||
                    `Child ${supplyRequest.matchedChildId}`
                  }
                  className="object-contain rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-agency text-base truncate">
                  {supplyRequest.matchedChild.metadata?.title ||
                    `${dict?.child} ${supplyRequest.matchedChildId}`}
                </p>
                <p className="text-oro font-slim text-sm">
                  {dict?.supplier}:{" "}
                  {truncateAddress(supplyRequest.matchedSupplier)}
                </p>
                <p className="text-gris font-slim text-xs">
                  {dict?.child} #{supplyRequest.matchedChildId}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-oro font-agency">{dict?.status}</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rotate-45 ${
                      supplyRequest.paid ? "bg-oro" : "bg-gris/30"
                    }`}
                  ></div>
                  <span className="text-white font-slim">
                    {supplyRequest.paid ? dict?.paid : dict?.pending}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-oro font-agency">
                  {dict?.availability}
                </span>
                <p className="text-white font-slim">
                  {supplyRequest.matchedChild.availability}
                </p>
              </div>

              {supplyRequest.isPhysical ? (
                <div className="space-y-2">
                  <span className="text-oro font-agency">
                    {dict?.physicalPrice}
                  </span>
                  <p className="text-white font-slim">
                    {formattedMatchedPhysicalPrice ||
                      supplyRequest.matchedChild.physicalPrice}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-oro font-agency">
                    {dict?.digitalPrice}
                  </span>
                  <p className="text-white font-slim">
                    {formattedMatchedDigitalPrice ||
                      supplyRequest.matchedChild.digitalPrice}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-oro/30">
              <h4 className="text-base font-agency uppercase text-oro mb-3">
                {dict?.transactionDetails}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {supplyRequest.paid && supplyRequest.paidTransactionHash && (
                  <>
                    <div className="space-y-2">
                      <span className="text-oro font-agency">
                        {dict?.paid} {dict?.txHash}:
                      </span>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-slim text-xs break-all">
                          {`${supplyRequest.paidTransactionHash.slice(
                            0,
                            10
                          )}...${supplyRequest.paidTransactionHash.slice(-8)}`}
                        </p>
                        <a
                          href={`${network.blockExplorer}/tx/${supplyRequest.paidTransactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-oro hover:text-oro/80 text-xs underline font-agency"
                        >
                          {dict?.view}
                        </a>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-oro font-agency">
                        {dict?.paid} {dict?.blockNumber}:
                      </span>
                      <p className="text-white font-slim text-sm">
                        {supplyRequest.paidBlockNumber}
                      </p>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <span className="text-oro font-agency">
                    {dict?.created} {dict?.txHash}:
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-slim text-xs break-all">
                      {`${supplyRequest.transactionHash.slice(
                        0,
                        10
                      )}...${supplyRequest.transactionHash.slice(-8)}`}
                    </p>
                    <a
                      href={`${network.blockExplorer}/tx/${supplyRequest.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-oro hover:text-oro/80 text-xs underline font-agency"
                    >
                      {dict?.view}
                    </a>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-oro font-agency">
                    {dict?.created} {dict?.blockNumber}:
                  </span>
                  <p className="text-white font-slim text-sm">
                    {supplyRequest.blockNumber}
                  </p>
                </div>
              </div>
            </div>
          </FancyBorder>
        )}

        {supplyRequest.parent && (
          <FancyBorder
            type="diamond"
            color="oro"
            className="bg-black p-6 space-y-4"
          >
            <h3 className="text-lg font-agency uppercase text-white mb-4">
              {dict?.parent}
            </h3>

            <div
              onClick={() =>
                router.push(
                  `/library/parent/${supplyRequest.parent.parentContract}/${supplyRequest.parent.designId}`
                )
              }
              className="flex items-center gap-4 cursor-pointer hover:opacity-70 transition-opacity bg-offNegro/30 p-4 rounded"
            >
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={
                    supplyRequest.parent.metadata?.image
                      ? getIPFSUrl(supplyRequest.parent.metadata.image)
                      : "/images/default.png"
                  }
                  fill
                  draggable={false}
                  alt={
                    supplyRequest.parent.metadata?.title ||
                    `Parent ${supplyRequest.parent.designId}`
                  }
                  className="object-contain rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-agency text-base truncate">
                  {supplyRequest.parent.metadata?.title ||
                    `${dict?.parent} ${supplyRequest.parent.designId}`}
                </p>
                <p className="text-gris font-slim text-xs">
                  {dict?.parent} #{supplyRequest.parent.designId}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <span className="text-oro font-agency">
                  {dict?.availability}
                </span>
                <p className="text-white font-slim">
                  {supplyRequest.parent.availability}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-oro font-agency">
                  {dict?.digitalPrice}
                </span>
                <p className="text-white font-slim">
                  {formattedParentDigitalPrice ||
                    supplyRequest.parent.digitalPrice}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-oro font-agency">
                  {dict?.physicalPrice}
                </span>
                <p className="text-white font-slim">
                  {formattedParentPhysicalPrice ||
                    supplyRequest.parent.physicalPrice}
                </p>
              </div>
            </div>
          </FancyBorder>
        )}

        {supplyRequest.proposals && supplyRequest.proposals.length > 0 && (
          <FancyBorder
            type="diamond"
            color="oro"
            className="bg-black p-6 space-y-4"
          >
            <h3 className="text-lg font-agency uppercase text-white mb-4">
              {dict?.proposalDetails}
            </h3>

            <div className="space-y-3">
              {supplyRequest.proposals.map((proposal: any, index: number) => {
                const proposalKey =
                  proposal.positionId ||
                  proposal.id ||
                  `${proposal.childContract}-${proposal.childId}-${index}`;
                const isApproved = approvedProposals.includes(proposalKey);
                const isApproving = approvingProposalId === proposalKey;
                const isPaying = payingProposalId === proposalKey;
                const isPayDisabled = !isApproved || isPaying;
                const canCancelProposal =
                  proposal.supplier?.toLowerCase() === address?.toLowerCase() &&
                  !supplyRequest.paid &&
                  !supplyRequest.matchedSupplier;
                const isCancelling = cancellingProposalId === proposalKey;

                return (
                  <div
                    key={proposalKey}
                    className="bg-offNegro/30 p-4 rounded space-y-3"
                  >
                    <div
                      onClick={() =>
                        router.push(
                          `/library/child/${proposal.childContract}/${proposal.childId}`
                        )
                      }
                      className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={
                            proposal.child?.metadata?.image
                              ? getIPFSUrl(proposal.child.metadata.image)
                              : "/images/default.png"
                          }
                          fill
                          draggable={false}
                          alt={
                            proposal.child?.metadata?.title ||
                            `Child ${proposal.childId}`
                          }
                          className="object-contain rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-agency text-sm truncate">
                          {proposal.child?.metadata?.title ||
                            `${dict?.child} ${proposal.childId}`}
                        </p>
                        <p className="text-gris font-slim text-xs">
                          {dict?.child} #{proposal.childId}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="text-gris font-agency">
                          {dict?.supplier}
                        </span>
                        <p className="text-white font-slim">
                          {truncateAddress(proposal.supplier)}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-gris font-agency">
                          {dict?.availability}
                        </span>
                        <p className="text-white font-slim">
                          {proposal.child?.availability || dict?.unknown}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-gris font-agency">
                          {dict?.digitalPrice}
                        </span>
                        <p className="text-white font-slim">
                          {formattedProposalPrices.get(index)?.digital ||
                            proposal.child?.digitalPrice ||
                            "0"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-gris font-agency">
                          {dict?.physicalPrice}
                        </span>
                        <p className="text-white font-slim">
                          {formattedProposalPrices.get(index)?.physical ||
                            proposal.child?.physicalPrice ||
                            "0"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gris/30 space-y-3">
                      <div className="space-y-2">
                        <span className="text-oro font-agency">
                          {dict?.txHash}:
                        </span>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-slim text-xs break-all">
                            {`${proposal.transactionHash.slice(
                              0,
                              10
                            )}...${proposal.transactionHash.slice(-8)}`}
                          </p>
                          <a
                            href={`${network.blockExplorer}/tx/${proposal.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-oro hover:text-oro/80 text-xs underline font-agency"
                          >
                            {dict?.view}
                          </a>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-oro font-agency">
                          {dict?.blockNumber}:
                        </span>
                        <p className="text-white font-slim text-sm">
                          {proposal.blockNumber}
                        </p>
                      </div>
                      {(canManageProposals || canCancelProposal) && (
                        <div className="flex flex-wrap justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => approveProposal(proposalKey)}
                            disabled={isApproving || isApproved}
                            className="relative"
                          >
                            <div
                              className={`text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center ${
                                isApproving || isApproved
                                  ? "opacity-60"
                                  : "hover:opacity-80"
                              }`}
                            >
                              <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                                <Image
                                  src={"/images/borderoro2.png"}
                                  draggable={false}
                                  fill
                                  alt="border"
                                />
                              </div>
                              <span className="relative z-10 flex items-center gap-2 uppercase text-oro">
                                {isApproving ? (
                                  <div className="relative w-3 h-3 flex animate-spin">
                                    <Image
                                      src="/images/scissors.png"
                                      fill
                                      alt="loading"
                                      draggable={false}
                                      className="object-contain"
                                    />
                                  </div>
                                ) : (
                                  dict?.supplyRequestApprove ||
                                  dict?.approve ||
                                  "Approve"
                                )}
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => payForProposal(proposalKey)}
                            disabled={isPayDisabled}
                            className="relative"
                          >
                            <div
                              className={`text-xs text-black font-chicago relative uppercase flex px-4 py-2 bg-oro justify-center items-center ${
                                isPayDisabled
                                  ? "opacity-60"
                                  : "hover:opacity-80"
                              }`}
                            >
                              <span className="relative z-10 flex items-center gap-2">
                                {isPaying ? (
                                  <div className="relative w-3 h-3 flex animate-spin">
                                    <Image
                                      src="/images/scissors.png"
                                      fill
                                      alt="loading"
                                      draggable={false}
                                      className="object-contain"
                                    />
                                  </div>
                                ) : (
                                  dict?.supplyRequestPay || dict?.pay 
                                )}
                              </span>
                              <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                                <Image
                                  src="/images/borderoro2.png"
                                  draggable={false}
                                  fill
                                  alt="border"
                                />
                              </div>
                            </div>
                          </button>

                          {canCancelProposal && (
                            <button
                              type="button"
                              onClick={() => cancelProposal(proposalKey)}
                              disabled={isCancelling}
                              className="relative"
                            >
                              <div
                                className={`text-xs text-white font-chicago relative uppercase flex px-4 py-2 bg-fresa justify-center items-center ${
                                  isCancelling
                                    ? "opacity-60"
                                    : "hover:opacity-80"
                                }`}
                              >
                                <span className="relative z-10 flex items-center gap-2">
                                  {isCancelling ? (
                                    <div className="relative w-3 h-3 flex animate-spin">
                                      <Image
                                        src="/images/scissors.png"
                                        fill
                                        alt="loading"
                                        draggable={false}
                                        className="object-contain"
                                      />
                                    </div>
                                  ) : (
                                    dict?.supplyRequestCancel ||
                                    dict?.cancel ||
                                    "Cancel"
                                  )}
                                </span>
                                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                                  <Image
                                    src="/images/borderoro2.png"
                                    draggable={false}
                                    fill
                                    alt="border"
                                  />
                                </div>
                              </div>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </FancyBorder>
        )}
      </div>
      <SupplierChildSelectionModal
        isOpen={isProposeModalOpen}
        onClose={closeProposeModal}
        onSelect={(child) => proposeSupplyMatch(child)}
        childrenList={supplierChildren}
        isLoading={supplierChildrenLoading}
        hasMore={supplierChildrenHasMore}
        loadMore={loadMoreSupplierChildren}
        dict={dict}
        searchText={childSearch}
        setSearchText={setChildSearch}
        proposingChildId={proposingChildId}
      />
    </>
  );
};
