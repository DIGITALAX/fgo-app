export interface SuccessData {
  message: string;
  txHash?: string;
}

export  interface ErrorData {
  message: string;
}

export  interface AppContextType {
  showSuccess: (message: string, txHash?: string) => void;
  showError: (message: string) => void;
  hideSuccess: () => void;
  hideError: () => void;
  successData: SuccessData | null;
  errorData: ErrorData | null;
}