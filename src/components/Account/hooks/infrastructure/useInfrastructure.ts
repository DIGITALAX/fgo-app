import { useState, useEffect, useContext } from "react";
import { useWalletConnection } from "@/components/Library/hooks/useWalletConnection";
import { getFGOUser } from "@/lib/subgraph/queries/getFGOUser";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { FGOUser, Infrastructure } from "../../types";
import { AppContext } from "@/lib/providers/Providers";

export const useInfrastructure = (dict: any) => {
  const { address, isConnected } = useWalletConnection();
  const context = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfrastructure = async () => {
      if (!address || !isConnected) {
        context?.setFgoUser(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getFGOUser(address.toLowerCase());
        if (result?.data?.fgousers && result.data.fgousers.length > 0) {
          const user = result.data.fgousers[0];

          const processedOwnedInfrastructures = await Promise.all(
            user.ownedInfrastructures.map(async (infra: Infrastructure) => {
              const processedInfra = await ensureMetadata(infra);
              return {
                ...processedInfra,
                infraId: parseInt(infra.infraId, 16).toString(),
              };
            })
          );

          const processedAdminInfrastructures = await Promise.all(
            user.adminInfrastructures.map(async (infra: Infrastructure) => {
              const processedInfra = await ensureMetadata(infra);
              return {
                ...processedInfra,
                infraId: parseInt(infra.infraId, 16).toString(),
              };
            })
          );

          context?.setFgoUser({
            id: user.id,
            ownedInfrastructures: processedOwnedInfrastructures,
            adminInfrastructures: processedAdminInfrastructures,
            futureCredits: user?.futureCredits,
          });
        } else {
          context?.setFgoUser({
            id: address.toLowerCase(),
            ownedInfrastructures: [],
            adminInfrastructures: [],
            futureCredits: [],
          });
        }
      } catch (err) {
        setError(dict?.failedToLoadInfrastructureData);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfrastructure();
  }, [address, isConnected]);

  const handleInfrastructureClick = (
    infrastructure: Infrastructure,
    isOwner: boolean
  ) => {
    context?.setSelectedInfrastructure({ infrastructure, isOwner });
  };

  const handleBackToList = () => {
    context?.setSelectedInfrastructure(null);
  };

  return {
    loading,
    error,
    isConnected,
    handleInfrastructureClick,
    handleBackToList,
  };
};
