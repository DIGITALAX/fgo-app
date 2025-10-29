import { useState, useCallback } from "react";
import { ApprovalAmountInputProps } from "../types";
import Image from "next/image";

export const ApprovalAmountInput = ({
  requestedAmount,
  onApprove,
  onReject,
  loading,
  rejecting,
  dict,
}: ApprovalAmountInputProps) => {
  const [approvalAmount, setApprovalAmount] = useState<string>(requestedAmount);

  const handleApprove = useCallback(() => {
    onApprove(approvalAmount);
  }, [approvalAmount, onApprove]);

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || (/^\d+$/.test(value) && parseInt(value) > 0)) {
        setApprovalAmount(value);
      }
    },
    []
  );

  return (
    <div className="flex items-center gap-2 bg-black border border-white rounded-sm p-2">
      <label className="text-xs font-chicago text-white">{dict?.amount}:</label>
      <input
        type="text"
        value={approvalAmount}
        onChange={handleAmountChange}
        className="w-20 px-2 py-1 text-xs bg-black border border-white rounded-sm text-white font-chicago focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama"
        placeholder="1"
        min="1"
      />
      <button
        onClick={handleApprove}
        type="button"
        disabled={loading || !approvalAmount || parseInt(approvalAmount) === 0}
        className="relative px-2 py-1 bg-offNegro text-oro font-chicago text-xs uppercase cursor-pointer hover:opacity-70 disabled:opacity-50 transition-colors flex items-center gap-1"
      >
        <div className="absolute z-0 top-0 left-0 w-full h-full flex">
          <Image
            src={"/images/borderoro2.png"}
            draggable={false}
            objectFit="fill"
            fill
            alt="border"
          />
        </div>
        {loading ? (
          <div className="relative w-fit animate-spin h-fit flex z-10">
            <div className="relative w-3 h-3 flex">
              <Image
                layout="fill"
                objectFit="cover"
                src={"/images/scissors.png"}
                draggable={false}
                alt="loader"
              />
            </div>
          </div>
        ) : (
          <span className="relative z-10">{dict?.approve}</span>
        )}
      </button>
      <button
        onClick={onReject}
        type="button"
        disabled={rejecting}
        className="relative px-2 py-1 bg-offNegro text-gris font-chicago text-xs uppercase cursor-pointer hover:opacity-70 disabled:opacity-50 transition-colors flex items-center gap-1"
      >
        <div className="absolute z-0 top-0 left-0 w-full h-full flex">
          <Image
            src={"/images/borderoro2.png"}
            draggable={false}
            objectFit="fill"
            fill
            alt="border"
          />
        </div>
        {rejecting ? (
          <div className="relative w-fit animate-spin h-fit flex z-10">
            <div className="relative w-3 h-3 flex">
              <Image
                layout="fill"
                objectFit="cover"
                src={"/images/scissors.png"}
                draggable={false}
                alt="loader"
              />
            </div>
          </div>
        ) : (
          <span className="relative z-10">{dict?.reject}</span>
        )}
      </button>
    </div>
  );
};
