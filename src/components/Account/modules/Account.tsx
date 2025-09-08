"use client";

import { useAccount } from "../hooks/useAccount";
import { AccountTabs } from "./AccountTabs";
import { InfrastructureTab } from "./infrastructure/InfrastructureTab";
import { DesignerTab } from "./designer/DesignerTab";
import { SupplierTab } from "./supplier/SupplierTab";
import { FulfillerTab } from "./fulfiller/FulfillerTab";
import { SettingsTab } from "./settings/SettingsTab";

export const Account = ({ dict }: { dict: any }) => {
  const { activeTab, setActiveTab, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-herm text-white mb-4">
            {dict?.connect}
          </h2>
          <p className="text-white/60 font-herm mb-6">
            {dict?.access}
          </p>
          <SettingsTab dict={dict} />
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
