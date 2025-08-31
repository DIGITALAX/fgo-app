import { useAccount } from 'wagmi';

export const useWalletConnection = () => {
  const { address, isConnected } = useAccount();

  return {
    address,
    isConnected,
  };
};