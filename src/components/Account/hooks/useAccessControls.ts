import { useState, useContext, useCallback } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import { AppContext } from "@/lib/providers/Providers";
import { uploadImageToIPFS, uploadJSONToIPFS } from "@/lib/helpers/ipfs";
import { getCoreContractAddresses, getCurrentNetwork } from "@/constants";
import {
  CONTRACT_FUNCTIONS,
  ROLES,
  RoleType,
  getRoleFunctionName,
} from "@/constants/contracts";
import { ABIS } from "@/abis";
import { UseAccessControlsProps } from "../types";
import { convertInfraIdToBytes32 } from "@/lib/helpers/infraId";

export const useAccessControls = ({
  infrastructure,
  dict,
}: UseAccessControlsProps) => {
  const [adminAddress, setAdminAddress] = useState<string>("");
  const [designerAddress, setDesignerAddress] = useState<string>("");
  const [supplierAddress, setSupplierAddress] = useState<string>("");
  const [fulfillerAddress, setFulfillerAddress] = useState<string>("");
  const [newPaymentToken, setNewPaymentToken] = useState<string>("");
  const [newSuperAdmin, setNewSuperAdmin] = useState<string>("");
  const [loading, setLoading] = useState<string | null>(null);
  const [updateTitle, setUpdateTitle] = useState<string>(
    infrastructure.metadata?.title || ""
  );
  const [updateDescription, setUpdateDescription] = useState<string>(
    infrastructure.metadata?.description || ""
  );
  const [updateImage, setUpdateImage] = useState<File | null>(null);

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const context = useContext(AppContext);

  const network = getCurrentNetwork();
  const { Factory: factoryAddress } = getCoreContractAddresses(network.chainId);

  const handleRoleAction = useCallback(
    async (role: RoleType, action: "add" | "remove", address: string) => {
      if (
        !walletClient ||
        !publicClient ||
        !context ||
        infrastructure.isActive == false ||
        !address
      )
        return;

      const actionKey = `${action}${
        role.charAt(0).toUpperCase() + role.slice(1)
      }`;
      setLoading(actionKey);
      try {
        const hash = await walletClient.writeContract({
          address: infrastructure.accessControlContract as `0x${string}`,
          abi: ABIS.FGOAccessControl,
          functionName: getRoleFunctionName(role, action),
          args: [address],
        });

        await publicClient.waitForTransactionReceipt({ hash });

        context.showSuccess(dict?.roleUpdatedSuccessfully, hash);
        setLoading(null);
        setAdminAddress("");
        setDesignerAddress("");
        setSupplierAddress("");
        setFulfillerAddress("");
      } catch (error) {
        context.showError(`Failed to ${action} ${role}`);
        setLoading(null);
      }
    },
    [
      walletClient,
      publicClient,
      context,
      infrastructure.isActive,
      infrastructure.accessControlContract,
    ]
  );

  const handleAddAdmin = useCallback(
    () => handleRoleAction(ROLES.ADMIN, "add", adminAddress),
    [handleRoleAction, adminAddress]
  );
  const handleRemoveAdmin = useCallback(
    () => handleRoleAction(ROLES.ADMIN, "remove", adminAddress),
    [handleRoleAction, adminAddress]
  );
  const handleAddDesigner = useCallback(
    () => handleRoleAction(ROLES.DESIGNER, "add", designerAddress),
    [handleRoleAction, designerAddress]
  );
  const handleRemoveDesigner = useCallback(
    () => handleRoleAction(ROLES.DESIGNER, "remove", designerAddress),
    [handleRoleAction, designerAddress]
  );
  const handleAddSupplier = useCallback(
    () => handleRoleAction(ROLES.SUPPLIER, "add", supplierAddress),
    [handleRoleAction, supplierAddress]
  );
  const handleRemoveSupplier = useCallback(
    () => handleRoleAction(ROLES.SUPPLIER, "remove", supplierAddress),
    [handleRoleAction, supplierAddress]
  );
  const handleAddFulfiller = useCallback(
    () => handleRoleAction(ROLES.FULFILLER, "add", fulfillerAddress),
    [handleRoleAction, fulfillerAddress]
  );
  const handleRemoveFulfiller = useCallback(
    () => handleRoleAction(ROLES.FULFILLER, "remove", fulfillerAddress),
    [handleRoleAction, fulfillerAddress]
  );

  const handleToggleDesignerGating = useCallback(async () => {
    if (!walletClient || !publicClient || !context || !infrastructure.isActive)
      return;

    setLoading("designerGating");
    try {
      const hash = await walletClient.writeContract({
        address: infrastructure.accessControlContract as `0x${string}`,
        abi: ABIS.FGOAccessControl,
        functionName: CONTRACT_FUNCTIONS.ACCESS_CONTROL.TOGGLE_DESIGNER_GATING,
        args: [],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context.showSuccess(dict?.designerGatingToggledSuccessfully, hash);
      setLoading(null);
    } catch (error) {
      context.showError(dict?.failedToToggleDesignerGating);
      setLoading(null);
    }
  }, [
    walletClient,
    publicClient,
    context,
    infrastructure.isActive,
    infrastructure.accessControlContract,
  ]);

  const handleToggleSupplierGating = useCallback(async () => {
    if (!walletClient || !publicClient || !context || !infrastructure.isActive)
      return;

    setLoading("supplierGating");
    try {
      const hash = await walletClient.writeContract({
        address: infrastructure.accessControlContract as `0x${string}`,
        abi: ABIS.FGOAccessControl,
        functionName: CONTRACT_FUNCTIONS.ACCESS_CONTROL.TOGGLE_SUPPLIER_GATING,
        args: [],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context.showSuccess(dict?.supplierGatingToggledSuccessfully, hash);
      setLoading(null);
    } catch (error) {
      context.showError(dict?.failedToToggleSupplierGating);
      setLoading(null);
    }
  }, [
    walletClient,
    publicClient,
    context,
    infrastructure.isActive,
    infrastructure.accessControlContract,
  ]);

  const handleUpdatePaymentToken = useCallback(async () => {
    if (!walletClient || !publicClient || !context || !infrastructure.isActive)
      return;

    setLoading("updatePaymentToken");
    try {
      const hash = await walletClient.writeContract({
        address: infrastructure.accessControlContract as `0x${string}`,
        abi: ABIS.FGOAccessControl,
        functionName: CONTRACT_FUNCTIONS.ACCESS_CONTROL.UPDATE_PAYMENT_TOKEN,
        args: [newPaymentToken],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context.showSuccess(dict?.paymentTokenUpdatedSuccessfully, hash);
      setLoading(null);
      setNewPaymentToken("");
    } catch (error) {
      context.showError(dict?.failedToUpdatePaymentToken);
      setLoading(null);
    }
  }, [
    walletClient,
    publicClient,
    context,
    infrastructure.isActive,
    infrastructure.accessControlContract,
    newPaymentToken,
  ]);

  const handleLockPaymentToken = useCallback(async () => {
    if (!walletClient || !publicClient || !context || !infrastructure.isActive)
      return;

    setLoading("lockPaymentToken");
    try {
      const hash = await walletClient.writeContract({
        address: infrastructure.accessControlContract as `0x${string}`,
        abi: ABIS.FGOAccessControl,
        functionName: CONTRACT_FUNCTIONS.ACCESS_CONTROL.LOCK_PAYMENT_TOKEN,
        args: [],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context.showSuccess(dict?.paymentTokenLockedSuccessfully, hash);
      setLoading(null);
    } catch (error) {
      context.showError(dict?.failedToLockPaymentToken);
      setLoading(null);
    }
  }, [
    walletClient,
    publicClient,
    context,
    infrastructure.isActive,
    infrastructure.accessControlContract,
  ]);

  const handleRevokeAdminControl = useCallback(async () => {
    if (!walletClient || !publicClient || !context || !infrastructure.isActive)
      return;

    setLoading("revokeAdminControl");
    try {
      const hash = await walletClient.writeContract({
        address: infrastructure.accessControlContract as `0x${string}`,
        abi: ABIS.FGOAccessControl,
        functionName: CONTRACT_FUNCTIONS.ACCESS_CONTROL.REVOKE_ADMIN_CONTROL,
        args: [],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context.showSuccess(dict?.adminControlRevokedSuccessfully, hash);
      setLoading(null);
    } catch (error) {
      context.showError(dict?.failedToRevokeAdminControl);
      setLoading(null);
    }
  }, [
    walletClient,
    publicClient,
    context,
    infrastructure.isActive,
    infrastructure.accessControlContract,
  ]);

  const handleUpdateInfrastructureURI = useCallback(async () => {
    if (!walletClient || !publicClient || !context || !infrastructure.isActive)
      return;

    setLoading("updateURI");
    try {
      let imageUri = infrastructure.metadata?.image || "";

      if (updateImage) {
        const imageHash = await uploadImageToIPFS(updateImage);
        imageUri = `ipfs://${imageHash}`;
      }

      const metadata = {
        title: updateTitle,
        description: updateDescription,
        image: imageUri,
      };

      const metadataHash = await uploadJSONToIPFS(metadata);
      const newURI = `ipfs://${metadataHash}`;

      const infraIdAsBytes32 = convertInfraIdToBytes32(infrastructure.infraId);

      const hash = await walletClient.writeContract({
        address: factoryAddress as `0x${string}`,
        abi: ABIS.FGOFactory,
        functionName: CONTRACT_FUNCTIONS.FACTORY.UPDATE_INFRASTRUCTURE_URI,
        args: [infraIdAsBytes32, newURI],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context.showSuccess(dict?.infrastructureUriUpdatedSuccessfully, hash);
      setLoading(null);
      setUpdateTitle(infrastructure.metadata?.title || "");
      setUpdateDescription(infrastructure.metadata?.description || "");
      setUpdateImage(null);
    } catch (error) {
      context.showError(dict?.failedToUpdateInfrastructureUri);
      setLoading(null);
    }
  }, [
    walletClient,
    publicClient,
    context,
    infrastructure.isActive,
    infrastructure.metadata?.image,
    infrastructure.infraId,
    updateImage,
    updateTitle,
    updateDescription,
    factoryAddress,
  ]);

  const handleDeactivateInfrastructure = useCallback(async () => {
    if (!walletClient || !publicClient || !context || !infrastructure.isActive)
      return;

    setLoading("deactivate");
    try {
      const infraIdAsBytes32 = convertInfraIdToBytes32(infrastructure.infraId);

      const hash = await walletClient.writeContract({
        address: factoryAddress as `0x${string}`,
        abi: ABIS.FGOFactory,
        functionName: CONTRACT_FUNCTIONS.FACTORY.DEACTIVATE_INFRASTRUCTURE,
        args: [infraIdAsBytes32],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context.showSuccess(dict?.infrastructureDeactivatedSuccessfully, hash);
      setLoading(null);
    } catch (error) {
      context.showError(dict?.failedToDeactivateInfrastructure);
      setLoading(null);
    }
  }, [
    walletClient,
    publicClient,
    context,
    infrastructure.isActive,
    infrastructure.infraId,
    factoryAddress,
  ]);

  const handleReactivateInfrastructure = useCallback(async () => {
    if (!walletClient || !publicClient || !context) return;

    setLoading("reactivate");
    try {
      const infraIdAsBytes32 = convertInfraIdToBytes32(infrastructure.infraId);

      const hash = await walletClient.writeContract({
        address: factoryAddress as `0x${string}`,
        abi: ABIS.FGOFactory,
        functionName: CONTRACT_FUNCTIONS.FACTORY.REACTIVATE_INFRASTRUCTURE,
        args: [infraIdAsBytes32],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context.showSuccess(dict?.infrastructureReactivatedSuccessfully, hash);
      setLoading(null);
    } catch (error) {
      context.showError(dict?.failedToReactivateInfrastructure);
      setLoading(null);
    }
  }, [
    walletClient,
    publicClient,
    context,
    infrastructure.infraId,
    factoryAddress,
  ]);

  const handleTransferSuperAdmin = useCallback(async () => {
    if (!walletClient || !publicClient || !context || !infrastructure.isActive)
      return;

    setLoading("transferSuperAdmin");
    try {
      const infraIdAsBytes32 = convertInfraIdToBytes32(infrastructure.infraId);

      const hash = await walletClient.writeContract({
        address: factoryAddress as `0x${string}`,
        abi: ABIS.FGOFactory,
        functionName: CONTRACT_FUNCTIONS.FACTORY.TRANSFER_SUPER_ADMIN,
        args: [infraIdAsBytes32, newSuperAdmin],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context.showSuccess(dict?.superAdminTransferredSuccessfully, hash);
      setLoading(null);
      setNewSuperAdmin("");
    } catch (error) {
      context.showError(dict?.failedToTransferSuperAdmin);
      setLoading(null);
    }
  }, [
    walletClient,
    publicClient,
    context,
    infrastructure.isActive,
    infrastructure.infraId,
    newSuperAdmin,
    factoryAddress,
  ]);

  return {
    adminAddress,
    setAdminAddress,
    designerAddress,
    setDesignerAddress,
    supplierAddress,
    setSupplierAddress,
    fulfillerAddress,
    setFulfillerAddress,
    newPaymentToken,
    setNewPaymentToken,
    newSuperAdmin,
    setNewSuperAdmin,
    loading,
    updateTitle,
    setUpdateTitle,
    updateDescription,
    setUpdateDescription,
    setUpdateImage,
    handleAddAdmin,
    handleRemoveAdmin,
    handleAddDesigner,
    handleRemoveDesigner,
    handleAddSupplier,
    handleRemoveSupplier,
    handleAddFulfiller,
    handleRemoveFulfiller,
    handleToggleDesignerGating,
    handleToggleSupplierGating,
    handleUpdatePaymentToken,
    handleLockPaymentToken,
    handleRevokeAdminControl,
    handleUpdateInfrastructureURI,
    handleDeactivateInfrastructure,
    handleReactivateInfrastructure,
    handleTransferSuperAdmin,
  };
};
