import { getIPFSUrl } from "@/lib/helpers/ipfs";
import { InfrastructureCardProps } from "../../types";
import Image from "next/image";

export const InfrastructureCard = ({
  infrastructure,
  isOwner,
  onClick,
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
      className="group overflow-hidden gap-2 flex flex-col cursor-pointer transition-colors p-2"
    >
      <div className="border border-white rounded-sm p-2 group-hover:border-fresa transition-colors">
        {imageUrl && (
          <div className="aspect-square w-full relative">
            <Image
              src={imageUrl}
              fill
              draggable={false}
              alt={title}
              className="object-cover"
            />
          </div>
        )}
      </div>
      <div className="border border-white rounded-sm w-full flex flex-row gap-2 justify-between p-2 text-xs uppercase font-break text-ama group-hover:border-fresa transition-colors">
        <div className="relative w-fit h-fit flex">{title}</div>
        {isOwner && (
          <div className="relative w-fit h-fit flex">Super Admin</div>
        )}
      </div>
      <div className="space-y-2 border border-white rounded-sm p-2 group-hover:border-fresa transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs truncate">Status</span>
          <span
            className={`px-2 py-1 rounded bg-ama/20 border border-ama text-xs`}
          >
            {infrastructure.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Infra ID:</span>
            <span className="text-ama"> {infrastructure.infraId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
