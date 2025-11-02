import { FGOUser, Infrastructure } from "@/components/Account/types";
import { SetStateAction } from "react";

export interface SuccessData {
  message: string;
  txHash?: string;
}

export interface ErrorData {
  message: string;
}

export interface AppContextType {
  selectedInfrastructure: {
    infrastructure: Infrastructure;
    isOwner: boolean;
  } | null;
  setSelectedInfrastructure: (
    e: SetStateAction<{
      infrastructure: Infrastructure;
      isOwner: boolean;
    } | null>
  ) => void;
  showSuccess: (message: string, txHash?: string) => void;
  showError: (message: string) => void;
  hideSuccess: () => void;
  hideError: () => void;
  successData: SuccessData | null;
  errorData: ErrorData | null;
  fgoUser: FGOUser | null;
  setFgoUser: (e: SetStateAction<FGOUser | null>) => void;
  colorSwitch: boolean;
  setColorSwitch: (e: SetStateAction<boolean>) => void;
}
