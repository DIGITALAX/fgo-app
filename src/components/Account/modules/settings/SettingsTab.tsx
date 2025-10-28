"use client";

import { ConnectKitButton } from "connectkit";
import { useSettingsTab } from "../../hooks/useSettingsTab";
import Image from "next/image";
import { useState } from "react";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const SettingsTab = ({ dict }: { dict: any }) => {
  const {
    isConnected,
    address,
    selectedLanguage,
    languageOptions,
    handleLanguageChange,
  } = useSettingsTab(dict);

  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="relative w-full">
        <div className="relative z-10 p-6 space-y-6">
          <h3 className="text-2xl font-awk uppercase text-oro tracking-wide">
            {dict?.walletConnection}
          </h3>

          {isConnected ? (
            <div className="space-y-4">
              <div className="p-4 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="text-xs text-oro font-chicago relative lowercase flex px-3 py-1 bg-offNegro w-fit">
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    <span className="relative z-10">
                      {dict?.walletConnected}
                    </span>
                  </div>
                  <p className="text-xs text-gris font-chicago">
                    {address
                      ? `${address.slice(0, 6)}...${address.slice(-4)}`
                      : ""}
                  </p>
                </div>
                <div className="w-3 h-3 bg-verde rounded-full"></div>
              </div>

              <ConnectKitButton.Custom>
                {({ show }) => (
                  <div
                    onClick={show}
                    className="relative cursor-pointer hover:opacity-80 transition-opacity w-fit mx-auto"
                  >
                    <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro">
                      <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                        <Image
                          src={"/images/borderoro2.png"}
                          draggable={false}
                          objectFit="fill"
                          fill
                          alt="border"
                        />
                      </div>
                      <span className="relative z-10">
                        {dict?.disconnectWallet}
                      </span>
                    </div>
                  </div>
                )}
              </ConnectKitButton.Custom>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="text-xs text-gris font-chicago relative lowercase flex px-3 py-1 bg-offNegro w-fit">
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    <span className="relative z-10">
                      {dict?.noWalletConnected}
                    </span>
                  </div>
                  <p className="text-xs text-gris font-chicago">
                    {dict?.connectWalletAccess}
                  </p>
                </div>
                <div className="w-3 h-3 bg-gris rounded-full"></div>
              </div>

              <ConnectKitButton.Custom>
                {({ show }) => (
                  <div
                    onClick={show}
                    className="relative cursor-pointer hover:opacity-80 transition-opacity w-fit mx-auto"
                  >
                    <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro">
                      <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                        <Image
                          src={"/images/borderoro2.png"}
                          draggable={false}
                          objectFit="fill"
                          fill
                          alt="border"
                        />
                      </div>
                      <span className="relative z-10">
                        {dict?.connectWallet}
                      </span>
                    </div>
                  </div>
                )}
              </ConnectKitButton.Custom>
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full">
        <div className="relative z-10 p-6 space-y-4">
          <h3 className="text-2xl font-awk uppercase text-oro tracking-wide">
            {dict?.languageSettings}
          </h3>

          <div className="space-y-3">
            <label className="block text-sm font-chicago text-gris">
              {dict?.chooseLanguage}
            </label>
            <FancyBorder color="white" type="circle" className="relative">
              <div
                onClick={() =>
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                }
                className="relative z-10 w-full px-3 py-2 text-gris text-sm cursor-pointer flex items-center justify-between"
              >
                <span className="font-chicago">
                  {languageOptions.find((opt) => opt.code === selectedLanguage)
                    ?.name ?? "Aussie"}
                </span>
                <div className="relative w-3 h-3 rotate-90">
                  <Image
                    src={"/images/arrow.png"}
                    draggable={false}
                    fill
                    alt="arrow"
                  />
                </div>
              </div>
              {isLanguageDropdownOpen && (
                <div className="absolute z-20 w-full mt-1 bg-black border border-white font-chicago">
                  {languageOptions.map(({ code, name }) => (
                    <div
                      key={code}
                      onClick={() => {
                        handleLanguageChange({
                          target: { value: code },
                        } as any);
                        setIsLanguageDropdownOpen(false);
                      }}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-white hover:text-black text-gris"
                    >
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </FancyBorder>
          </div>
        </div>
      </div>
    </div>
  );
};
