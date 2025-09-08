import { useState } from "react";
import {
  InfrastructureDetailProps,
  InfrastructureDetailTab,
} from "../../types";
import { InfrastructureDetailTabs } from "./InfrastructureDetailTabs";
import { DetailsTab } from "./DetailsTab";
import { AccessControlsTab } from "./AccessControlsTab";
import { ParentsTab } from "./parents/ParentsTab";
import { ChildrenTab } from "./children/ChildrenTab";
import { TemplatesTab } from "./templates/TemplatesTab";
import { MarketsTab } from "./markets/MarketsTab";

export const InfrastructureDetailView = ({
  infrastructure,
  isOwner,
  onBack,
  dict,
}: InfrastructureDetailProps) => {
  const [activeTab, setActiveTab] =
    useState<InfrastructureDetailTab>("details");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "details":
        return <DetailsTab infrastructure={infrastructure} dict={dict} />;
      case "access_controls":
        return (
          <AccessControlsTab
            infrastructure={infrastructure}
            isOwner={isOwner}
            dict={dict}
          />
        );
      case "parents":
        return <ParentsTab infrastructure={infrastructure} isOwner={isOwner} dict={dict} />;
      case "children":
        return (
          <ChildrenTab infrastructure={infrastructure} isOwner={isOwner} dict={dict} />
        );
      case "templates":
        return (
          <TemplatesTab infrastructure={infrastructure} isOwner={isOwner} dict={dict} />
        );
      case "markets":
        return <MarketsTab infrastructure={infrastructure} isOwner={isOwner} dict={dict} />;
      default:
        return <DetailsTab infrastructure={infrastructure} dict={dict} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-ama transition-colors font-herm text-sm"
        >
          <span className="text-base">←</span>
          <span>{dict?.back}</span>
        </button>
        <div className="w-px h-4 bg-white/20"></div>
        <h2 className="text-lg font-herm text-white">
          {infrastructure.metadata?.title || `${dict?.infra} ${infrastructure.infraId}`}
        </h2>
        {isOwner && (
          <span className="px-2 py-0.5 rounded-sm text-xs bg-fresa/20 text-fresa border border-fresa/30 font-herm">
            {dict?.owner}
          </span>
        )}
      </div>

      <InfrastructureDetailTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        dict={dict}
      />

      <div className="flex-1">{renderActiveTab()}</div>
    </div>
  );
};
