import { getIPFSUrl } from "@/lib/helpers/ipfs";
import { InfrastructureCardProps } from "../../types";
import Image from "next/image";

export const InfrastructureCard = ({
  infrastructure,
  isOwner,
  onClick,
  dict,
}: InfrastructureCardProps) => {
  const imageUrl = infrastructure.metadata?.image
    ? getIPFSUrl(infrastructure.metadata.image)
    : null;
  const title =
    infrastructure.metadata?.title ||
    `Infrastructure ${infrastructure.infraId}`;

  return (
    <div
      onClick={() => onClick(infrastructure, isOwner)}
      className="group cursor-pointer transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute z-0 top-0 left-0 w-full h-full flex">
        <Image
          src={"/images/borderpurple.png"}
          draggable={false}
          objectFit="fill"
          fill
          alt="border"
        />
      </div>
      <div className="relative z-10 p-3 space-y-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-col w-fit h-fit">
            <div className="text-xs font-awk uppercase tracking-wide mb-1 text-oro">
              {dict?.infraId} #{infrastructure.infraId}
            </div>
            <h4 className="font-agency text-base leading-tight truncate text-white">
              {title}
            </h4>
          </div>
          {isOwner && (
            <div className="flex">
              <div className="text-xs text-gris font-chicago relative lowercase flex px-3 py-1 bg-offNegro">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderoro2.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                <span className="relative z-10">{dict?.superAdmin}</span>
              </div>
            </div>
          )}
        </div>

        <div className="relative aspect-square overflow-hidden">
          {imageUrl && (
            <Image
              src={imageUrl}
              fill
              draggable={false}
              alt={title}
              className="object-cover rounded-md transition-transform duration-300"
            />
          )}
          <div className="absolute z-0 top-0 left-0 w-full h-full flex">
            <Image
              src={"/images/borderblue.png"}
              draggable={false}
              objectFit="fill"
              fill
              alt="border"
            />
          </div>
          <div className="absolute bottom-2 left-2">
            <div className="text-xs text-oro font-chicago relative lowercase flex px-3 py-1 bg-offNegro/70 rounded-sm">
              <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                <Image
                  src={"/images/borderblue.png"}
                  draggable={false}
                  objectFit="fill"
                  fill
                  alt="border"
                />
              </div>
              <span className="relative z-10">
                {infrastructure.isActive ? dict?.active : dict?.inactive}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3">
          <div className="text-gris text-center w-full justify-center flex">
            <div className="text-sm font-awk uppercase tracking-wide">
              {infrastructure.metadata?.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
