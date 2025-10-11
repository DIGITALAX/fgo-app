import {
  InfrastructureDetailTabsProps,
  InfrastructureDetailTab,
} from "../../types";
import Image from "next/image";

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
    <div className="flex overflow-x-auto gap-2 pb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="relative"
        >
          <div className={`text-xs font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center ${
            activeTab === tab.id ? "text-oro" : "text-gris"
          }`}>
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
  );
};
