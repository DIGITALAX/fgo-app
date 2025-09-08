import { AccountTabsProps, AccountTab } from "../types";

export const AccountTabs = ({ activeTab, onTabChange, dict }: AccountTabsProps & { dict: any }) => {
  const tabs: { id: AccountTab; label: string }[] = [
    { id: "infrastructure", label: dict?.infrastructure || "Infrastructure" },
    { id: "designer", label: dict?.designer || "Designer" },
    { id: "supplier", label: dict?.supplier || "Supplier" },
    { id: "fulfiller", label: dict?.fulfiller || "Fulfiller" },
    { id: "settings", label: dict?.settings || "Settings" },
  ];

  return (
    <div className="border-b border-white bg-black mb-3 sm:mb-6">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-herm border-b-2 whitespace-nowrap transition-colors min-w-0 flex-shrink-0 ${
              activeTab === tab.id
                ? "border-ama text-ama bg-ama/10"
                : "border-transparent text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
