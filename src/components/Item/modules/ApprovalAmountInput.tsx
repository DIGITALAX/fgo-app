import { useState, useCallback } from "react";
import { ApprovalAmountInputProps } from "../types";


export const ApprovalAmountInput = ({
  requestedAmount,
  onApprove,
  onReject,
  loading,
  rejecting,
  isSupplier,
  dict
}: ApprovalAmountInputProps) => {
  const [approvalAmount, setApprovalAmount] = useState(requestedAmount);

  const handleApprove = useCallback(() => {
    onApprove(approvalAmount);
  }, [approvalAmount, onApprove]);


  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setApprovalAmount(value);
    }
  }, []);

  return (
    <div className="flex items-center gap-2 bg-black border border-white rounded-sm p-2">
      <label className="text-xs font-herm text-ama">{dict?.amount}:</label>
      <input
        type="text"
        value={approvalAmount}
        onChange={handleAmountChange}
        className="w-20 px-2 py-1 text-xs bg-black border border-white rounded-sm text-white font-herm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama"
        placeholder="1"
        min="1"
      />
      <button
        onClick={handleApprove}
        disabled={loading || !approvalAmount || parseInt(approvalAmount) === 0}
        className="px-2 py-1 bg-white hover:opacity-70 disabled:opacity-50 text-black text-xs font-herm rounded-sm transition-colors flex items-center gap-1"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-black"></div>
        ) : (
          dict?.approve
        )}
      </button>
      <button
        onClick={onReject}
        disabled={rejecting}
        className="px-2 py-1 border border-white hover:bg-white hover:text-black text-white text-xs font-herm rounded-sm transition-colors flex items-center gap-1"
      >
        {rejecting ? (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
        ) : (
          dict?.reject
        )}
      </button>
    </div>
  );
};