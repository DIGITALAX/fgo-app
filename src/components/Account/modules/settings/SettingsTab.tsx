"use client";

import { ConnectKitButton } from "connectkit";
import { useSettingsTab } from "../../hooks/useSettingsTab";

export const SettingsTab = ({ dict }: { dict: any }) => {
  const {
    isConnected,
    address,
    selectedLanguage,
    languageOptions,
    handleLanguageChange,
  } = useSettingsTab(dict);

  return (
    <div className="p-6 space-y-8  mx-auto">
      <div className="border border-white rounded-sm p-6">
        <h3 className="text-lg font-herm text-white mb-4">{dict?.walletConnection}</h3>
        
        {isConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-ama/10 border border-ama/30 rounded-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ama font-herm">{dict?.walletConnected}</p>
                  <p className="text-xs text-white mt-1 font-herm">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}
                  </p>
                </div>
                <div className="w-2 h-2 bg-ama rounded-full"></div>
              </div>
            </div>
            
            <ConnectKitButton.Custom>
              {({ show }) => (
                <button
                  onClick={show}
                  className="w-full px-4 py-3 bg-white hover:opacity-70 text-black font-herm rounded-sm transition-colors"
                >
                  {dict?.disconnectWallet}
                </button>
              )}
            </ConnectKitButton.Custom>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-black/20 border border-white/30 rounded-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ama font-herm">{dict?.noWalletConnected}</p>
                  <p className="text-xs text-white mt-1">{dict?.connectWalletAccess}</p>
                </div>
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              </div>
            </div>
            
            <ConnectKitButton.Custom>
              {({ show }) => (
                <button
                  onClick={show}
                  className="w-full px-4 py-3 bg-white hover:opacity-70 text-black font-herm rounded-sm transition-colors"
                >
                  {dict?.connectWallet}
                </button>
              )}
            </ConnectKitButton.Custom>
          </div>
        )}
      </div>

      <div className="border border-white rounded-sm p-6">
        <h3 className="text-lg font-herm text-white mb-4">{dict?.languageSettings}</h3>
        
        <div className="space-y-3">
          <label className="block text-sm font-herm text-ama">
            {dict?.chooseLanguage}
          </label>
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-sm text-white font-herm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama"
          >
            {languageOptions.map(({ code, name }) => (
              <option key={code} value={code} className="bg-black text-white">
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};