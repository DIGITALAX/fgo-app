import { useState } from "react";
import { ManualApprovalModalProps, ApprovalTab } from "../../types";
import { MarketsApprovalTab } from "./approval/MarketsApprovalTab";
import { TemplatesApprovalTab } from "./approval/TemplatesApprovalTab";
import { ParentsApprovalTab } from "./approval/ParentsApprovalTab";
import Image from "next/image";

export const ManualApprovalModal = ({
  isOpen,
  onClose,
  itemType,
  itemData,
  dict,
}: ManualApprovalModalProps) => {
  const [activeTab, setActiveTab] = useState<ApprovalTab>("markets");

  if (!isOpen) return null;

  const availableTabs: { id: ApprovalTab; label: string }[] = [
    { id: "markets", label: dict?.markets },
    ...(itemType !== "parent"
      ? [
          { id: "parents" as ApprovalTab, label: dict?.parents },
          { id: "templates" as ApprovalTab, label: dict?.templates },
        ]
      : []),
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "markets":
        return (
          <MarketsApprovalTab
            dict={dict}
            itemData={itemData}
            itemType={itemType}
          />
        );
      case "parents":
        return (
          <ParentsApprovalTab
            dict={dict}
            itemData={itemData}
            itemType={itemType}
          />
        );
      case "templates":
        return (
          <TemplatesApprovalTab
            dict={dict}
            itemData={itemData}
            itemType={itemType}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="absolute z-0 top-0 left-0 w-full h-full flex">
          <Image
            src={"/images/borderblue.png"}
            draggable={false}
            objectFit="fill"
            fill
            alt="border"
          />
        </div>
        <div className="relative z-10 flex flex-col h-full">
          <div className="p-6 border-b border-gris/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-awk uppercase text-oro">
                {dict?.manualApprovals}
              </h2>
              <div
                onClick={onClose}
                className="relative cursor-pointer hover:opacity-80 transition-opacity w-4 h-4"
              >
                <Image
                  src={"/images/plug.png"}
                  draggable={false}
                  fill
                  objectFit="contain"
                  alt="close"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative"
                >
                  <div
                    className={`text-xs font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center ${
                      activeTab === tab.id
                        ? "text-oro"
                        : "text-gris hover:text-oro/80"
                    }`}
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
                    <span className="relative z-10">{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">{renderActiveTab()}</div>
        </div>
      </div>
    </div>
  );
};
