import { AccountTabsProps, AccountTab } from "../types";

export const AccountTabs = ({
  activeTab,
  onTabChange,
  dict,
}: AccountTabsProps & { dict: any }) => {
  const tabs: { id: AccountTab; label: string }[] = [
    { id: "infrastructure", label: dict?.infrastructure },
    { id: "designer", label: dict?.designer },
    { id: "supplier", label: dict?.supplier },
    { id: "fulfiller", label: dict?.fulfiller },
    { id: "settings", label: dict?.settings },
  ];

  return (
    <div className="w-full flex items-center justify-center py-4 mb-4">
      <div className="flex flex-wrap justify-center items-center flex-row gap-3 font-pixel">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`uppercase text-sm transition-colors ${
              activeTab === tab.id ? "text-oro" : "text-gris hover:text-oro"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
