"use client";

import { useAccount } from "../hooks/useAccount";
import { AccountTabs } from "./AccountTabs";
import { InfrastructureTab } from "./infrastructure/InfrastructureTab";
import { DesignerTab } from "./designer/DesignerTab";
import { SupplierTab } from "./supplier/SupplierTab";
import { FutureCreditsTab } from "./FutureCreditsTab";
import { FulfillerTab } from "./fulfiller/FulfillerTab";
import { SettingsTab } from "./settings/SettingsTab";
import Image from "next/image";

export const Account = ({ dict }: { dict: any }) => {
  const { activeTab, setActiveTab, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full w-full p-8">
        <div className="relative w-full max-w-2xl">
          <div className="absolute z-0 top-0 left-0 w-full h-full flex">
            <Image
              src={"/images/borderpurple.png"}
              draggable={false}
              objectFit="fill"
              fill
              alt="border"
            />
          </div>
          <div className="relative z-10 p-8 space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-count text-oro uppercase tracking-wider">
                {dict?.connect}
              </h2>
              <p className="text-gris font-chicago text-base leading-relaxed max-w-md mx-auto">
                {dict?.access}
              </p>
            </div>
            <div className="flex justify-center">
              <SettingsTab dict={dict} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "infrastructure":
        return <InfrastructureTab dict={dict} />;
      case "designer":
        return <DesignerTab dict={dict} />;
      case "supplier":
        return <SupplierTab dict={dict} />;
      case "futureCredits":
        return <FutureCreditsTab dict={dict} />;
      case "fulfiller":
        return <FulfillerTab dict={dict} />;
      case "settings":
        return <SettingsTab dict={dict} />;
      default:
        return <SettingsTab dict={dict} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <AccountTabs activeTab={activeTab} onTabChange={setActiveTab} dict={dict} />
      <div className="flex-1 overflow-auto min-h-0">{renderActiveTab()}</div>
    </div>
  );
};
