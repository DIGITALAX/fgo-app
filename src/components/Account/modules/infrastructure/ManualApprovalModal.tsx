import { useState } from "react";
import { ManualApprovalModalProps, ApprovalTab } from "../../types";
import { MarketsApprovalTab } from "./approval/MarketsApprovalTab";
import { TemplatesApprovalTab } from "./approval/TemplatesApprovalTab";
import { ParentsApprovalTab } from "./approval/ParentsApprovalTab";

export const ManualApprovalModal = ({
  isOpen,
  onClose,
  itemType,
  itemData,
  contractAddress,
  itemId,
}: ManualApprovalModalProps) => {
  const [activeTab, setActiveTab] = useState<ApprovalTab>("markets");

  if (!isOpen) return null;

  const availableTabs: { id: ApprovalTab; label: string }[] = [
    { id: "markets", label: "Markets" },
    ...(itemType !== "parent" 
      ? [
          { id: "parents" as ApprovalTab, label: "Parents" },
          { id: "templates" as ApprovalTab, label: "Templates" }
        ] 
      : []
    ),
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "markets":
        return (
          <MarketsApprovalTab
            itemData={itemData}
            itemType={itemType}
          />
        );
      case "parents":
        return (
          <ParentsApprovalTab
            itemData={itemData}
            itemType={itemType}
          />
        );
      case "templates":
        return (
          <TemplatesApprovalTab
            itemData={itemData}
            itemType={itemType}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-sm border border-white max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-herm text-white">
              Manual Approvals
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-ama transition-colors font-herm"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-1 bg-black border border-white rounded-sm p-1 w-fit">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-sm text-sm font-herm transition-colors ${
                  activeTab === tab.id
                    ? "bg-ama text-black"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};