import { useState, useCallback } from "react";
import { ApprovalAmountInputProps } from "../types";


export const ApprovalAmountInput = ({
  requestedAmount,
  onApprove,
  onReject,
  loading,
  rejecting,
  isSupplier
}: ApprovalAmountInputProps) => {
  const [approvalAmount, setApprovalAmount] = useState(requestedAmount);
  const [showInput, setShowInput] = useState(false);

  const handleApprove = useCallback(() => {
    if (showInput) {
      onApprove(approvalAmount);
      setShowInput(false);
    } else {
      setShowInput(true);
    }
  }, [showInput, approvalAmount, onApprove]);

  const handleCancel = useCallback(() => {
    setApprovalAmount(requestedAmount);
    setShowInput(false);
  }, [requestedAmount]);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setApprovalAmount(value);
    }
  }, []);

  if (showInput || isSupplier) {
    return (
      <div className="flex items-center gap-2 bg-black border border-white rounded-sm p-2">
        <label className="text-xs font-herm text-ama">Amount:</label>
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
            "Approve"
          )}
        </button>
        {!isSupplier && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-2 py-1 border border-white hover:bg-white hover:text-black text-white text-xs font-herm rounded-sm transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        disabled={loading}
        className="px-3 py-1 bg-white hover:opacity-70 disabled:opacity-50 text-black text-sm font-herm rounded-sm transition-colors flex items-center gap-1"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-black"></div>
        ) : (
          "Approve"
        )}
        ({requestedAmount})
      </button>
      <button
        onClick={onReject}
        disabled={rejecting}
        className="px-3 py-1 border border-white hover:bg-white hover:text-black text-white text-sm font-herm rounded-sm transition-colors flex items-center gap-1"
      >
        {rejecting ? (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
        ) : (
          "Reject"
        )}
      </button>
    </div>
  );
};