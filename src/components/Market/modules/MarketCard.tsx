"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MarketCardProps,  } from "../types";



export const MarketCard = ({ data, dict }: MarketCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (data.type === "child") {
      router.push(`/child/${data.contractAddress}/${data.id}`);
    } else if (data.type === "template") {
      router.push(`/template/${data.contractAddress}/${data.id}`);
    } else if (data.type === "parent") {
      router.push(`/parent/${data.contractAddress}/${data.id}`);
    }
  };

  const getTypeLabel = () => {
    switch (data.type) {
      case "child":
        return dict?.child;
      case "template":
        return dict?.template;
      case "parent":
        return dict?.parent;
      case "supplyRequest":
        return dict?.supplyRequests;
      case "futures":
        return dict?.futures;
      case "market":
        return dict?.market;
      default:
        return data.type;
    }
  };

  const getAvailabilityLabel = () => {
    switch (data.availability) {
      case "0":
        return dict?.digitalOnly;
      case "1":
        return dict?.physicalOnly;
      case "2":
        return dict?.both;
      default:
        return dict?.unknown;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="border border-oro/20 hover:border-oro/60 cursor-pointer transition-all bg-black p-4 flex flex-col gap-3"
    >
      <div className="relative w-full aspect-square">
        <Image
          src={data.image || "/images/placeholder.png"}
          alt={data.title}
          layout="fill"
          objectFit="cover"
          draggable={false}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-oro font-agency text-xs uppercase">
            {getTypeLabel()}
          </span>
          <span className="text-verde font-chicago text-xs">
            {getAvailabilityLabel()}
          </span>
        </div>

        <h3 className="text-oro font-agency text-base line-clamp-2">
          {data.title}
        </h3>

        {data.description && (
          <p className="text-oro/70 font-chicago text-xs line-clamp-3">
            {data.description}
          </p>
        )}

        {data.deadline && (
          <div className="flex items-center gap-2 text-ama font-chicago text-xs">
            <span>{dict?.deadline}:</span>
            <span>{new Date(Number(data.deadline) * 1000).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};