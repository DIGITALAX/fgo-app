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
import Image from "next/image";

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
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div
          onClick={onBack}
          className="relative cursor-pointer hover:opacity-80 transition-opacity w-fit"
        >
          <div className="text-xs text-gris font-chicago relative lowercase flex px-3 py-1 bg-offNegro items-center gap-2">
            <div className="absolute z-0 top-0 left-0 w-full h-full flex">
              <Image
                src={"/images/borderoro2.png"}
                draggable={false}
                objectFit="fill"
                fill
                alt="border"
              />
            </div>
            <span className="relative z-10 text-sm">←</span>
            <span className="relative z-10">{dict?.back}</span>
          </div>
        </div>
        <h2 className="text-lg font-awk uppercase text-oro">
          {infrastructure.metadata?.title || `${dict?.infra} ${infrastructure.infraId}`}
        </h2>
        {isOwner && (
          <div className="relative">
            <div className="text-xs text-oro font-chicago relative lowercase flex px-3 py-1 bg-offNegro">
              <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                <Image
                  src={"/images/borderoro2.png"}
                  draggable={false}
                  objectFit="fill"
                  fill
                  alt="border"
                />
              </div>
              <span className="relative z-10">{dict?.owner}</span>
            </div>
          </div>
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
