import { useRouter } from "next/navigation";
import { LibraryCardProps } from "../types";
import { useLibraryCard } from "../hooks/useLibraryCard";
import Image from "next/image";

export const LibraryCard = ({ data, onClick }: LibraryCardProps) => {
  const router = useRouter();
  const {
    detalles,
    statusLabel,
    formattedDate,
    isTemplate,
    contractAddress,
    itemId,
  } = useLibraryCard(data);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const type = isTemplate ? "template" : "child";
      const path = `/library/${type}/${contractAddress}/${itemId}`;
      router.push(path);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group overflow-hidden gap-1 sm:gap-2 flex flex-col cursor-pointer transition-colors p-1 sm:p-2"
    >
      <div className="border border-white rounded-sm p-1 sm:p-2 group-hover:border-fresa transition-colors">
        {detalles?.imageURL && (
          <div className="aspect-square w-full relative">
            <Image
              src={detalles?.imageURL}
              fill
              draggable={false}
              alt={detalles?.titulo}
              className="object-contain"
            />
          </div>
        )}
      </div>
      <div className="border border-white rounded-sm w-full flex flex-row gap-1 sm:gap-2 justify-between p-1 sm:p-2 text-xs uppercase font-break text-ama group-hover:border-fresa transition-colors">
        <div className="relative w-fit h-fit flex truncate">{data?.availability}</div>
        <div className="relative w-fit h-fit flex truncate">{data?.scm}</div>
      </div>
      <div className="space-y-1 sm:space-y-2 border border-white rounded-sm p-1 sm:p-2 group-hover:border-fresa transition-colors">
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs truncate flex-1 min-w-0">{detalles?.proveedorT}</span>
          <span
            className={`px-1 sm:px-2 py-1 rounded bg-ama/20 border border-ama text-xs whitespace-nowrap flex-shrink-0`}
          >
            {statusLabel}
          </span>
        </div>

        <h4 className="text-white font-semibold text-sm truncate">
          {detalles?.titulo}
        </h4>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="truncate">Digital:</span>
            <span className="text-ama truncate ml-1">{detalles?.precioD}</span>
          </div>
          {detalles?.precioP && (
            <div className="flex justify-between">
              <span className="truncate">Physical:</span>
              <span className="text-ama truncate ml-1">{detalles?.precioP}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="truncate">Usage:</span>
            <span className="text-white truncate ml-1">{data.usageCount}</span>
          </div>
          <div className="text-xs sm:text-sm font-gen truncate">{formattedDate}</div>
        </div>
      </div>
    </div>
  );
};
