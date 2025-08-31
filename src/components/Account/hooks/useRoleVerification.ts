import { useCallback, useContext } from "react";
import { AppContext } from "@/lib/providers/Providers";
import { getDesigner, getSupplier, getFulfiller } from "@/lib/subgraph/queries/getFGOUser";
import { convertInfraIdToBytes32 } from "@/lib/helpers/infraId";

export const useRoleVerification = () => {
  const context = useContext(AppContext);

  const verifyRole = useCallback(async (
    profileType: "Designer" | "Supplier" | "Fulfiller",
    infraId: string,
    walletAddress: string
  ): Promise<boolean> => {
    if (!infraId || !walletAddress || !context) return false;

    try {
      let result;
      let errorMessage = "";

      if (profileType === "Designer") {
        result = await getDesigner(convertInfraIdToBytes32(infraId), walletAddress);
        if (!result?.data?.designers || result.data.designers.length === 0) {
          errorMessage = "You are not verified as a Designer for this infrastructure. Please contact the infrastructure owner to be added as a Designer.";
        }
      } else if (profileType === "Supplier") {
        result = await getSupplier(convertInfraIdToBytes32(infraId), walletAddress);
        if (!result?.data?.suppliers || result.data.suppliers.length === 0) {
          errorMessage = "You are not verified as a Supplier for this infrastructure. Please contact the infrastructure owner to be added as a Supplier.";
        }
      } else if (profileType === "Fulfiller") {
        result = await getFulfiller(convertInfraIdToBytes32(infraId), walletAddress);
        if (!result?.data?.fulfillers || result.data.fulfillers.length === 0) {
          errorMessage = "You are not verified as a Fulfiller for this infrastructure. Please contact the infrastructure owner to be added as a Fulfiller.";
        }
      }

      if (errorMessage) {
        context.showError(errorMessage);
        return false;
      }

      return true;
    } catch (error) {
      context.showError("Error verifying role. Please try again.");
      return false;
    }
  }, [context]);

  return { verifyRole };
};