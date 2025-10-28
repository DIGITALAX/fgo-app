"use client";

import { useParams } from "next/navigation";
import useFuture from "../hooks/useFuture";
import { ItemHeader } from "@/components/Item/modules/ItemHeader";
import { ItemPricing } from "@/components/Item/modules/ItemPricing";
import { ItemMetadata } from "@/components/Item/modules/ItemMetadata";
import { ItemRequests } from "@/components/Item/modules/ItemRequests";
import { ItemAuthorized } from "@/components/Item/modules/ItemAuthorized";
import { ItemBlockchainInfo } from "@/components/Item/modules/ItemBlockchainInfo";
import Image from "next/image";
import { FuturesSection } from "./FuturesSection";
import { useChildDetails } from "@/components/Item/hooks/useChildDetails";

export const Future = ({ dict }: { dict: any }) => {
  const { contract, id } = useParams();
  const { isLoading, error, child } = useChildDetails(
    contract as string,
    Number(id),
    dict
  );

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="relative w-fit animate-spin h-fit flex">
          <div className="relative w-6 h-6 flex">
            <Image
              layout="fill"
              objectFit="cover"
              src={"/images/scissors.png"}
              draggable={false}
              alt="loader"
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-6">
        <p className="text-fresa font-chicago text-sm">
          {dict?.error}: {error}
        </p>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-6">
        <p className="text-white font-chicago text-sm">{dict?.childNotFound}</p>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 space-y-2 h-screen overflow-y-auto">
      <ItemHeader item={child} isTemplate={false} dict={dict} />
      <FuturesSection
        futures={child.futures}
        infraCurrency={child.infraCurrency}
        dict={dict}
        availability={child.availability}
      />
      <ItemPricing item={child} dict={dict} />
      <ItemMetadata item={child} dict={dict} />
      <ItemRequests item={child} dict={dict} />
      <ItemAuthorized item={child} dict={dict} />
      <ItemBlockchainInfo item={child} dict={dict} />
    </div>
  );
};
