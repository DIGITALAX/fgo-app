import { useState, useEffect } from "react";
import { useWalletConnection } from "@/components/Library/hooks/useWalletConnection";
import { getFGOUser } from "@/lib/subgraph/queries/getFGOUser";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { FGOUser, Infrastructure } from "../../types";

export const useInfrastructure = () => {
  const { address, isConnected } = useWalletConnection();
  const [fgoUser, setFgoUser] = useState<FGOUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInfrastructure, setSelectedInfrastructure] = useState<{ infrastructure: Infrastructure; isOwner: boolean } | null>(null);

  useEffect(() => {
    const fetchUserInfrastructure = async () => {
      if (!address || !isConnected) {
        setFgoUser(null);
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
                infraId: parseInt(infra.infraId, 16).toString()
              };
            })
          );

          const processedAdminInfrastructures = await Promise.all(
            user.adminInfrastructures.map(async (infra: Infrastructure) => {
              const processedInfra = await ensureMetadata(infra);
              return {
                ...processedInfra,
                infraId: parseInt(infra.infraId, 16).toString()
              };
            })
          );

          setFgoUser({
            id: user.id,
            ownedInfrastructures: processedOwnedInfrastructures,
            adminInfrastructures: processedAdminInfrastructures,
          });
        } else {
          setFgoUser({
            id: address.toLowerCase(),
            ownedInfrastructures: [],
            adminInfrastructures: [],
          });
        }
      } catch (err) {
        setError("Failed to load infrastructure data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfrastructure();
  }, [address, isConnected]);

  const handleInfrastructureClick = (infrastructure: Infrastructure, isOwner: boolean) => {
    setSelectedInfrastructure({ infrastructure, isOwner });
  };

  const handleBackToList = () => {
    setSelectedInfrastructure(null);
  };

  return {
    fgoUser,
    loading,
    error,
    isConnected,
    selectedInfrastructure,
    handleInfrastructureClick,
    handleBackToList,
  };
};