import { AccountTabsProps, AccountTab } from "../types";

export const AccountTabs = ({ activeTab, onTabChange }: AccountTabsProps) => {
  const tabs: { id: AccountTab; label: string }[] = [
    { id: "infrastructure", label: "Infrastructure" },
    { id: "designer", label: "Designer" },
    { id: "supplier", label: "Supplier" },
    { id: "fulfiller", label: "Fulfiller" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="border-b border-white bg-black mb-6">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-herm border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border-ama text-ama bg-ama/10"
                : "border-transparent text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
