import {
  InfrastructureDetailTabsProps,
  InfrastructureDetailTab,
} from "../../types";

export const InfrastructureDetailTabs = ({
  activeTab,
  onTabChange,
  dict,
}: InfrastructureDetailTabsProps) => {
  const tabs: { id: InfrastructureDetailTab; label: string }[] = [
    { id: "details", label: dict?.details },
    { id: "access_controls", label: dict?.accessControls },
    { id: "parents", label: dict?.parents },
    { id: "children", label: dict?.children },
    { id: "templates", label: dict?.templates },
    { id: "markets", label: dict?.markets },
  ];

  return (
    <div className="border-b border-white/20 bg-black/30">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1 px-3 py-2 text-xs font-herm border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border-fresa text-fresa bg-fresa/10"
                : "border-transparent text-white hover:text-ama hover:bg-white/5"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
