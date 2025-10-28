import { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { SupplierChild, SupplyRequest } from "../types";
import { getAvailabilityLabel } from "@/lib/helpers/availability";
import { getSupplyRequest } from "@/lib/subgraph/queries/getMarkets";
import { getIPFSUrl } from "@/lib/helpers/ipfs";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { AppContext } from "@/lib/providers/Providers";
import { ABIS } from "@/abis";
import { getCoreContractAddresses, getCurrentNetwork } from "@/constants";
import { BaseError, isAddress } from "viem";
import { validateDemandForParent } from "@/lib/helpers/demandValidation";

export const useSupplyRequest = (id: string, dict: any) => {
  const [supplyRequest, setSupplyRequest] = useState<SupplyRequest>(
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null >(null);
  const [approvingProposalId, setApprovingProposalId] = useState<string | null>(
    null
  );
  const [payingProposalId, setPayingProposalId] = useState<string | null>(null);
  const [approvedProposals, setApprovedProposals] = useState<string[]>([]);
  const [proposingChildId, setProposingChildId] = useState<string | null>(null);
  const [isProposeModalOpen, setIsProposeModalOpen] = useState<boolean>(false);
  const [cancellingProposalId, setCancellingProposalId] = useState<string | null>(
    null
  );

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const context = useContext(AppContext);

  const currentNetwork = useMemo(() => getCurrentNetwork(), []);
  const coreAddresses = useMemo(
    () => getCoreContractAddresses(currentNetwork.chainId),
    [currentNetwork.chainId]
  );

  const supplyCoordAddress = coreAddresses.SupplyCoord as `0x${string}`;

  const resetProposalState = useCallback(() => {
    setApprovedProposals([]);
    setApprovingProposalId(null);
    setPayingProposalId(null);
    setProposingChildId(null);
    setIsProposeModalOpen(false);
    setCancellingProposalId(null);
  }, []);

  const isDeadlinePassed = useCallback((deadline?: string | null) => {
    if (!deadline) return false;
    try {
      const deadlineValue = BigInt(deadline);
      const now = BigInt(Math.floor(Date.now() / 1000));
      return deadlineValue < now;
    } catch (err) {
      console.error("Failed to parse deadline", err);
      return false;
    }
  }, []);

  const getTotalCostForProposal = useCallback(
    (proposal: any) => {
      if (!supplyRequest?.parent) {
        return BigInt(0);
      }

      const isPhysicalRequest = supplyRequest.isPhysical;
      const unitPriceRaw = isPhysicalRequest
        ? proposal?.child?.physicalPrice
        : proposal?.child?.digitalPrice;

      if (!unitPriceRaw) {
        return BigInt(0);
      }

      const editionsRaw = isPhysicalRequest
        ? supplyRequest.parent.maxPhysicalEditions
        : supplyRequest.parent.maxDigitalEditions;

      const unitPrice = BigInt(unitPriceRaw || "0");
      const editions = BigInt(editionsRaw || "0");

      return unitPrice * editions;
    },
    [supplyRequest]
  );

  const getProposalById = useCallback(
    (proposalId: string) =>
      supplyRequest?.proposals.find(
        (proposal) =>
          proposal.positionId === proposalId || proposal.id === proposalId
      ),
    [supplyRequest]
  );

  const parseContractError = useCallback(
    (err: unknown): string => {
      if (err instanceof BaseError) {
        if (err.shortMessage?.includes("AlreadyPaid")) {
          return dict?.supplyRequestErrorAlreadyPaid;
        }
        if (err.shortMessage?.includes("DeadlinePassed")) {
          return dict?.supplyRequestDeadlinePassed;
        }
        if (err.shortMessage?.includes("NoProposal")) {
          return dict?.supplyRequestErrorNoProposal;
        }
        if (err.shortMessage?.includes("IncorrectPayment")) {
          return dict?.supplyRequestErrorIncorrectPayment;
        }
        if (err.shortMessage?.includes("Unauthorized")) {
          return dict?.supplyRequestNotDesigner;
        }

        return err.shortMessage ?? err.message;
      }

      return err instanceof Error ? err.message : dict?.unknownError;
    },
    [dict]
  );

  const fetchSupplyRequest = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await getSupplyRequest(id);
      if (
        !result?.data?.childSupplyRequests ||
        result.data.childSupplyRequests.length === 0
      ) {
        setError(dict?.supplyRequestNotFound);
        resetProposalState();
        return;
      }

      const childSupplyRequestData = result.data.childSupplyRequests[0];

      const existingChildProcessed = await ensureMetadata(
        childSupplyRequestData.existingChild
      );
      const matchedChildProcessed = await ensureMetadata(
        childSupplyRequestData.matchedChild
      );
      const parentProcessed = await ensureMetadata(
        childSupplyRequestData.parent
      );

      const proposals = await Promise.all(
        childSupplyRequestData.proposals.map(async (p: any) => {
          const processedChild = await ensureMetadata(p.child);

          return {
            ...p,
            child: {
              ...processedChild,
              availability: getAvailabilityLabel(
                p.child.availability || 0,
                dict
              ),
            },
          };
        })
      );

      const url = getIPFSUrl(childSupplyRequestData.customSpec);
      const response = await fetch(url);

      setSupplyRequest({
        id,
        existingChildId: childSupplyRequestData.existingChildId,
        existingChild: {
          ...existingChildProcessed,
          availability: getAvailabilityLabel(
            existingChildProcessed.availability || 0,
            dict
          ),
        },
        quantity: childSupplyRequestData.quantity,
        preferredMaxPrice: childSupplyRequestData.preferredMaxPrice,
        deadline: childSupplyRequestData.deadline,
        existingChildContract: childSupplyRequestData.existingChildContract,
        isPhysical: childSupplyRequestData.isPhysical,
        expired: childSupplyRequestData.expired,
        customSpec: await response.text(),
        placementURI: childSupplyRequestData.placementURI,
        parent: {
          ...parentProcessed,
          availability: getAvailabilityLabel(
            parentProcessed.availability || 0,
            dict
          ),
        },
        proposals: proposals,
        matchedChild: {
          ...matchedChildProcessed,
          availability: getAvailabilityLabel(
            matchedChildProcessed.availability || 0,
            dict
          ),
        },
        matchedChildId: childSupplyRequestData.matchedChildId,
        matchedSupplier: childSupplyRequestData.matchedSupplier,
        matchedChildContract: childSupplyRequestData.matchedChildContract,
        paid: childSupplyRequestData.paid,
        blockNumber: childSupplyRequestData.blockNumber,
        blockTimestamp: childSupplyRequestData.blockTimestamp,
        transactionHash: childSupplyRequestData.transactionHash,
        paidBlockNumber: childSupplyRequestData.paidBlockNumber,
        paidBlockTimestamp: childSupplyRequestData.paidBlockTimestamp,
        paidTransactionHash: childSupplyRequestData.paidTransactionHash,
      });
      resetProposalState();
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : dict?.unknownError
      );
      resetProposalState();
    } finally {
      setIsLoading(false);
    }
  }, [dict, id, resetProposalState]);

  useEffect(() => {
    if (id) {
      fetchSupplyRequest();
    }
  }, [fetchSupplyRequest, id]);

  const openProposeModal = useCallback(() => {
    if (!address) {
      context?.showError(dict?.walletNotConnected);
      return;
    }

    if (!supplyRequest) {
      return;
    }

    if (supplyRequest.paid) {
      context?.showError(dict?.supplyRequestAlreadyPaid);
      return;
    }

    if (supplyRequest.matchedSupplier) {
      context?.showError(dict?.supplyRequestCannotProposeMatched);
      return;
    }

    setIsProposeModalOpen(true);
  }, [address, context, dict, supplyRequest]);

  const closeProposeModal = useCallback(() => {
    setIsProposeModalOpen(false);
    setProposingChildId(null);
  }, []);

  const proposeSupplyMatch = useCallback(
    async (child: SupplierChild) => {
      if (!supplyRequest) {
        return;
      }

      if (!walletClient || !publicClient || !address) {
        context?.showError(dict?.walletNotConnected);
        return;
      }

      if (child.supplier?.toLowerCase() !== address.toLowerCase()) {
        context?.showError(dict?.supplyRequestNotSupplier);
        return;
      }

      if (supplyRequest.paid) {
        context?.showError(dict?.supplyRequestAlreadyPaid);
        return;
      }

      if (supplyRequest.matchedSupplier) {
        context?.showError(dict?.supplyRequestCannotProposeMatched);
        return;
      }

      if (supplyRequest.expired || isDeadlinePassed(supplyRequest.deadline)) {
        context?.showError(dict?.supplyRequestDeadlinePassed);
        return;
      }

      const parent = supplyRequest.parent;

      if (!parent) {
        context?.showError(dict?.supplyRequestParentNotFound || dict?.unknownError);
        return;
      }

      const parentEditionCount = supplyRequest.isPhysical
        ? BigInt(parent.maxPhysicalEditions || "0")
        : BigInt(parent.maxDigitalEditions || "0");

      if (parentEditionCount === BigInt(0)) {
        context?.showError(
          dict?.supplyRequestNoParentEditions ||
            "Parent editions are not configured"
        );
        return;
      }

      const quantity = BigInt(supplyRequest.quantity || "0");
      if (quantity === BigInt(0)) {
        context?.showError(
          dict?.supplyRequestInvalidQuantity || "Invalid quantity"
        );
        return;
      }

      const childAvailability = child.availabilityValue ?? 0;
      const requestIsPhysical = Boolean(supplyRequest.isPhysical);

      const supportsRequest = requestIsPhysical
        ? childAvailability === 0 || childAvailability === 2
        : childAvailability === 0 || childAvailability === 1;

      if (!supportsRequest) {
        context?.showError(dict?.supplyRequestAvailabilityMismatch);
        return;
      }

      const validation = await validateDemandForParent(
        [
          {
            childContract: child.childContract,
            childId: child.childId,
            amount: supplyRequest.quantity,
            isTemplate: false,
          },
        ],
        parentEditionCount,
        dict
      );

      if (!validation.isValid) {
        const validationError = validation.errors[0] || dict?.unknownError;
        context?.showError(validationError);
        return;
      }

      setProposingChildId(child.childId);

      try {
        const hash = await walletClient.writeContract({
          address: supplyCoordAddress,
          abi: ABIS.FGOSupplyCoordination,
          functionName: "proposeSupplyMatch",
          args: [
            supplyRequest.id as `0x${string}`,
            BigInt(child.childId),
            child.childContract as `0x${string}`,
          ],
        });

        await publicClient.waitForTransactionReceipt({ hash });

        context?.showSuccess(
          dict?.supplyRequestProposeSuccess || dict?.successMessage,
          hash
        );

        await fetchSupplyRequest();
        closeProposeModal();
      } catch (err) {
        const message = parseContractError(err);
        context?.showError(message || dict?.supplyRequestProposeFailed);
      } finally {
        setProposingChildId(null);
      }
    },
    [
      address,
      closeProposeModal,
      context,
      dict,
      fetchSupplyRequest,
      isDeadlinePassed,
      parseContractError,
      publicClient,
      supplyCoordAddress,
      supplyRequest,
      walletClient,
    ]
  );

  const cancelProposal = useCallback(
    async (proposalId: string) => {
      if (!supplyRequest) {
        return;
      }

      const proposal = getProposalById(proposalId);
      if (!proposal) {
        context?.showError(dict?.supplyRequestProposalNotFound);
        return;
      }

      if (!walletClient || !publicClient || !address) {
        context?.showError(dict?.walletNotConnected);
        return;
      }

      if (proposal.supplier.toLowerCase() !== address.toLowerCase()) {
        context?.showError(dict?.supplyRequestNotSupplier);
        return;
      }

      if (supplyRequest.matchedSupplier) {
        context?.showError(dict?.supplyRequestCannotCancelMatched);
        return;
      }

      if (supplyRequest.paid) {
        context?.showError(dict?.supplyRequestAlreadyPaid);
        return;
      }

      if (supplyRequest.expired || isDeadlinePassed(supplyRequest.deadline)) {
        context?.showError(dict?.supplyRequestDeadlinePassed);
        return;
      }

      setCancellingProposalId(proposalId);

      try {
        const hash = await walletClient.writeContract({
          address: supplyCoordAddress,
          abi: ABIS.FGOSupplyCoordination,
          functionName: "cancelProposal",
          args: [proposal.positionId as `0x${string}`],
        });

        await publicClient.waitForTransactionReceipt({ hash });

        context?.showSuccess(
          dict?.supplyRequestCancelSuccess || dict?.successMessage,
          hash
        );

        await fetchSupplyRequest();
      } catch (err) {
        const message = parseContractError(err);
        context?.showError(message || dict?.supplyRequestCancelFailed);
      } finally {
        setCancellingProposalId(null);
      }
    },
    [
      address,
      context,
      dict,
      fetchSupplyRequest,
      getProposalById,
      isDeadlinePassed,
      parseContractError,
      publicClient,
      supplyCoordAddress,
      supplyRequest,
      walletClient,
    ]
  );

  const approveProposal = useCallback(
    async (proposalId: string) => {
      if (!supplyRequest) {
        return;
      }

      const proposal = getProposalById(proposalId);
      if (!proposal) {
        context?.showError(dict?.supplyRequestProposalNotFound);
        return;
      }

      if (!walletClient || !publicClient || !address) {
        context?.showError(dict?.walletNotConnected);
        return;
      }

      if (!supplyRequest.parent?.designer) {
        context?.showError(dict?.supplyRequestNotDesigner);
        return;
      }

      if (
        supplyRequest.parent.designer.toLowerCase() !== address.toLowerCase()
      ) {
        context?.showError(
          dict?.supplyRequestNotDesigner 
        );
        return;
      }

      if (supplyRequest.paid) {
        context?.showError(
          dict?.supplyRequestAlreadyPaid
        );
        return;
      }

      if (supplyRequest.expired || isDeadlinePassed(supplyRequest.deadline)) {
        context?.showError(
          dict?.supplyRequestDeadlinePassed
        );
        return;
      }

      const totalCost = getTotalCostForProposal(proposal);
      if (totalCost === BigInt(0)) {
        context?.showError(
          dict?.supplyRequestInvalidPrice
        );
        return;
      }

      const tokenAddress = supplyRequest.parent.infraCurrency;
      if (!isAddress(tokenAddress)) {
        context?.showError(dict?.supplyRequestInvalidToken);
        return;
      }

      try {
        const balance = await publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ABIS.ERC20,
          functionName: "balanceOf",
          args: [address],
        });

        if (BigInt(Number(balance)) < totalCost) {
          context?.showError(
            dict?.supplyRequestInsufficientBalance
          );
          return;
        }

        const allowance = await publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ABIS.ERC20,
          functionName: "allowance",
          args: [address, supplyCoordAddress],
        });

        if (BigInt(Number(allowance)) >= totalCost) {
          setApprovedProposals((prev) =>
            prev.includes(proposalId) ? prev : [...prev, proposalId]
          );
          context?.showSuccess(
            dict?.supplyRequestAlreadyApproved
          );
          return;
        }

        setApprovingProposalId(proposalId);

        const hash = await walletClient.writeContract({
          address: tokenAddress as `0x${string}`,
          abi: ABIS.ERC20,
          functionName: "approve",
          args: [supplyCoordAddress, totalCost],
        });

        await publicClient.waitForTransactionReceipt({ hash });

        setApprovedProposals((prev) =>
          prev.includes(proposalId) ? prev : [...prev, proposalId]
        );

        context?.showSuccess(dict?.supplyRequestApproveSuccess, hash);
      } catch (err) {
        const message = parseContractError(err);
        context?.showError(message);
      } finally {
        setApprovingProposalId(null);
      }
    },
    [
      address,
      context,
      dict,
      getProposalById,
      getTotalCostForProposal,
      isDeadlinePassed,
      parseContractError,
      publicClient,
      supplyCoordAddress,
      supplyRequest,
      walletClient,
    ]
  );

  const payForProposal = useCallback(
    async (proposalId: string) => {
      if (!supplyRequest) {
        return;
      }

      const proposal = getProposalById(proposalId);
      if (!proposal) {
        context?.showError(dict?.supplyRequestProposalNotFound);
        return;
      }

      if (!walletClient || !publicClient || !address) {
        context?.showError(dict?.walletNotConnected);
        return;
      }

      if (!supplyRequest.parent?.designer) {
        context?.showError(dict?.supplyRequestNotDesigner);
        return;
      }

      if (
        supplyRequest.parent.designer.toLowerCase() !== address.toLowerCase()
      ) {
        context?.showError(
          dict?.supplyRequestNotDesigner
        );
        return;
      }

      if (supplyRequest.paid) {
        context?.showError(
          dict?.supplyRequestAlreadyPaid
        );
        return;
      }

      if (supplyRequest.expired || isDeadlinePassed(supplyRequest.deadline)) {
        context?.showError(dict?.supplyRequestDeadlinePassed);
        return;
      }

      const totalCost = getTotalCostForProposal(proposal);
      if (totalCost === BigInt(0)) {
        context?.showError(dict?.supplyRequestInvalidPrice);
        return;
      }

      const tokenAddress = supplyRequest.parent.infraCurrency;
      if (!isAddress(tokenAddress)) {
        context?.showError(dict?.supplyRequestInvalidToken);
        return;
      }

      try {
        const balance = await publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ABIS.ERC20,
          functionName: "balanceOf",
          args: [address],
        });

        if (BigInt(Number(balance)) < totalCost) {
          context?.showError(
            dict?.supplyRequestInsufficientBalance
          );
          return;
        }

        const allowance = await publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ABIS.ERC20,
          functionName: "allowance",
          args: [address, supplyCoordAddress],
        });

        if (BigInt(Number(allowance)) < totalCost) {
          context?.showError(
            dict?.supplyRequestAllowanceRequired
          );
          return;
        }

        setPayingProposalId(proposalId);

        const hash = await walletClient.writeContract({
          address: supplyCoordAddress,
          abi: ABIS.FGOSupplyCoordination,
          functionName: "payForSupplyRequest",
          args: [
            proposal.positionId as `0x${string}`,
            proposal.supplier as `0x${string}`,
          ],
        });

        await publicClient.waitForTransactionReceipt({ hash });

        context?.showSuccess(dict?.supplyRequestPaySuccess, hash);

        await fetchSupplyRequest();
      } catch (err) {
        const message = parseContractError(err);
        context?.showError(message || dict?.supplyRequestPayFailed);
      } finally {
        setPayingProposalId(null);
      }
    },
    [
      address,
      context,
      dict,
      fetchSupplyRequest,
      getProposalById,
      getTotalCostForProposal,
      isDeadlinePassed,
      parseContractError,
      publicClient,
      supplyCoordAddress,
      supplyRequest,
      walletClient,
    ]
  );

  return {
    error,
    isLoading,
    supplyRequest,
    openProposeModal,
    closeProposeModal,
    isProposeModalOpen,
    proposeSupplyMatch,
    cancelProposal,
    approveProposal,
    payForProposal,
    approvingProposalId,
    payingProposalId,
    approvedProposals,
    cancellingProposalId,
    proposingChildId,
  };
};
