import { useState, useCallback, useContext, useEffect, useRef } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import { parseEther } from "viem";
import { AppContext } from "@/lib/providers/Providers";
import { uploadImageToIPFS, uploadJSONToIPFS } from "@/lib/helpers/ipfs";
import { ABIS } from "@/abis";
import { UseProfileManagerProps, ProfileFormData, Designer } from "../types";
import { getDesigner, getSupplier, getFulfiller } from "@/lib/subgraph/queries/getFGOUser";
import { convertInfraIdToBytes32 } from "@/lib/helpers/infraId";
import { ensureMetadata } from "@/lib/helpers/metadata";

export const useProfileManager = ({
  contract,
  infraId,
  walletAddress,
  profileType,
}: UseProfileManagerProps) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    title: "",
    description: "",
    link: "",
    image: null,
    basePrice: "",
    vigBasisPoints: "",
  });
  const [existingProfile, setExistingProfile] = useState<Designer | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const cancelledRef = useRef<boolean>(false);

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const context = useContext(AppContext);

  const cancelOperation = useCallback(() => {
    cancelledRef.current = true;
    setLoading(false);
  }, []);

  const checkExistingProfile = useCallback(async (showErrorModal = false) => {
    if (!infraId || !walletAddress) return false;

    try {
      setCheckingProfile(true);

      let result;
      if (profileType === "Designer") {
        result = await getDesigner(
          convertInfraIdToBytes32(infraId),
          walletAddress
        );
        
        if (!result?.data?.designers || result.data.designers.length === 0) {
          if (showErrorModal && context) {
            context.showError("You are not verified as a Designer for this infrastructure. Please contact the infrastructure owner to be added as a Designer.");
          }
          return false;
        }
        
        if (result.data.designers[0]?.designerId) {
          const designerWithMetadata = await ensureMetadata(result.data.designers[0]);
          setExistingProfile(designerWithMetadata);
          setFormData({
            title: designerWithMetadata?.metadata?.title || "",
            description: designerWithMetadata?.metadata?.description || "",
            link: designerWithMetadata?.metadata?.link || "",
            image: designerWithMetadata?.metadata?.image || null,
            basePrice: "",
            vigBasisPoints: "",
          });
        }
      } else if (profileType === "Supplier") {
        result = await getSupplier(
          convertInfraIdToBytes32(infraId),
          walletAddress
        );
        
        if (!result?.data?.suppliers || result.data.suppliers.length === 0) {
          if (showErrorModal && context) {
            context.showError("You are not verified as a Supplier for this infrastructure. Please contact the infrastructure owner to be added as a Supplier.");
          }
          return false;
        }
        
        if (result.data.suppliers[0]?.supplierId) {
          const supplierWithMetadata = await ensureMetadata(result.data.suppliers[0]);
          setExistingProfile(supplierWithMetadata);
          setFormData({
            title: supplierWithMetadata?.metadata?.title || "",
            description: supplierWithMetadata?.metadata?.description || "",
            link: supplierWithMetadata?.metadata?.link || "",
            image: supplierWithMetadata?.metadata?.image || null,
            basePrice: "",
            vigBasisPoints: "",
          });
        }
      } else if (profileType === "Fulfiller") {
        result = await getFulfiller(
          convertInfraIdToBytes32(infraId),
          walletAddress
        );
        
        if (!result?.data?.fulfillers || result.data.fulfillers.length === 0) {
          if (showErrorModal && context) {
            context.showError("You are not verified as a Fulfiller for this infrastructure. Please contact the infrastructure owner to be added as a Fulfiller.");
          }
          return false;
        }
        
        if (result.data.fulfillers[0]?.fulfillerId) {
          const fulfiller = result.data.fulfillers[0];
          const fulfillerWithMetadata = await ensureMetadata(fulfiller);
          setExistingProfile(fulfillerWithMetadata);
          setFormData({
            title: fulfillerWithMetadata?.metadata?.title || "",
            description: fulfillerWithMetadata?.metadata?.description || "",
            link: fulfillerWithMetadata?.metadata?.link || "",
            image: fulfillerWithMetadata?.metadata?.image || null,
            basePrice: fulfiller?.basePrice ? (parseFloat(fulfiller.basePrice) / 1e18).toString() : "",
            vigBasisPoints: fulfiller?.vigBasisPoints ? (parseFloat(fulfiller.vigBasisPoints) / 100).toString() : "",
          });
        }
      }
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error checking existing profile";
      console.error("Error checking existing profile:", error);
      if (showErrorModal && context) {
        context.showError(errorMessage);
      }
      return false;
    } finally {
      setCheckingProfile(false);
    }
  }, [infraId, walletAddress, profileType, context]);

  useEffect(() => {
    checkExistingProfile(false);
  }, [checkExistingProfile]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setFormData((prev) => ({ ...prev, image: file }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (submitData: ProfileFormData, onSuccess?: () => void) => {
      if (!walletClient || !publicClient || !context) return;

      setLoading(true);
      cancelledRef.current = false;
      
      try {
        if (cancelledRef.current) {
          setLoading(false);
          return;
        }
        let imageUri = existingProfile?.metadata?.image || "";

        if (submitData.image && typeof submitData.image !== "string") {
          const imageHash = await uploadImageToIPFS(submitData.image);
          imageUri = `ipfs://${imageHash}`;
        }

        if (cancelledRef.current) {
          setLoading(false);
          return;
        }

        const metadata = {
          title: submitData.title,
          description: submitData.description,
          link: submitData.link,
          image: imageUri,
        };

        const metadataHash = await uploadJSONToIPFS(metadata);
        const newURI = `ipfs://${metadataHash}`;

        if (cancelledRef.current) {
          setLoading(false);
          return;
        }

        const functionName = existingProfile
          ? "updateProfile"
          : "createProfile";

        let args;
        let abi;

        if (profileType === "Designer") {
          abi = ABIS.FGODesigners;
          if (existingProfile) {
            args = [BigInt(existingProfile.designerId), BigInt(1), newURI];
          } else {
            args = [BigInt(1), newURI];
          }
        } else if (profileType === "Supplier") {
          abi = ABIS.FGOSuppliers;
          if (existingProfile) {
            args = [
              BigInt((existingProfile as any).supplierId),
              BigInt(1),
              newURI,
            ];
          } else {
            args = [BigInt(1), newURI];
          }
        } else if (profileType === "Fulfiller") {
          abi = ABIS.FGOFulfillers;
          const vigBasisPoints = Math.round((parseFloat(submitData.vigBasisPoints || "0") * 100));
          if (existingProfile) {
            args = [
              BigInt((existingProfile as any).fulfillerId),
              BigInt(1),
              parseEther(submitData.basePrice || "0"),
              BigInt(vigBasisPoints),
              newURI,
            ];
          } else {
            args = [
              BigInt(1),
              BigInt(vigBasisPoints),
              parseEther(submitData.basePrice || "0"),
              newURI,
            ];
          }
        }

        if (!abi) {
          throw new Error(`Invalid profile type: ${profileType}`);
        }


        const hash = await walletClient.writeContract({
          address: contract as `0x${string}`,
          abi,
          functionName,
          args,
        });

        if (cancelledRef.current) {
          setLoading(false);
          return;
        }

        await publicClient.waitForTransactionReceipt({ hash });

        if (cancelledRef.current) {
          setLoading(false);
          return;
        }

        context.showSuccess(
          `${profileType} profile ${
            existingProfile ? "updated" : "created"
          } successfully!`,
          hash
        );

        await checkExistingProfile(false);

        if (!cancelledRef.current && onSuccess) {
          onSuccess();
        }

        setLoading(false);
      } catch (error) {
        if (!cancelledRef.current) {
          context.showError(
            `Failed to ${
              existingProfile ? "update" : "create"
            } ${profileType} profile`
          );
        }
        setLoading(false);
      }
    },
    [
      walletClient,
      publicClient,
      context,
      contract,
      existingProfile,
      profileType,
      checkExistingProfile,
    ]
  );

  const resetForm = useCallback(() => {
    if (existingProfile) {
      const fulfiller = existingProfile as any;
      setFormData({
        title: existingProfile.metadata?.title || "",
        description: existingProfile.metadata?.description || "",
        link: existingProfile.metadata?.link || "",
        image: existingProfile.metadata?.image || null,
        basePrice: profileType === "Fulfiller" && fulfiller?.basePrice ? (parseFloat(fulfiller.basePrice) / 1e18).toString() : "",
        vigBasisPoints: profileType === "Fulfiller" && fulfiller?.vigBasisPoints ? fulfiller.vigBasisPoints : "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        link: "",
        image: null,
        basePrice: "",
        vigBasisPoints: "",
      });
    }
  }, [existingProfile, profileType]);

  return {
    formData,
    existingProfile,
    loading: loading || checkingProfile,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    resetForm,
    checkExistingProfile,
    cancelOperation,
  };
};
