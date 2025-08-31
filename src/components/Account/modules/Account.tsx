import { useAccount } from "../hooks/useAccount";
import { AccountTabs } from "./AccountTabs";
import { InfrastructureTab } from "./infrastructure/InfrastructureTab";
import { DesignerTab } from "./designer/DesignerTab";
import { SupplierTab } from "./supplier/SupplierTab";
import { FulfillerTab } from "./fulfiller/FulfillerTab";
import { SettingsTab } from "./settings/SettingsTab";

export const Account = () => {
  const { activeTab, setActiveTab, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-herm text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-white/60 font-herm mb-6">
            Please connect your wallet to access your account
          </p>
          <SettingsTab />
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "infrastructure":
        return <InfrastructureTab />;
      case "designer":
        return <DesignerTab />;
      case "supplier":
        return <SupplierTab />;
      case "fulfiller":
        return <FulfillerTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <SettingsTab />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <AccountTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-auto min-h-0">{renderActiveTab()}</div>
    </div>
  );
};
