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
      className="group overflow-hidden gap-2 flex flex-col cursor-pointer transition-colors p-2"
    >
      <div className="border border-white rounded-sm p-2 group-hover:border-fresa transition-colors">
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
      <div className="border border-white rounded-sm w-full flex flex-row gap-2 justify-between p-2 text-xs uppercase font-break text-ama group-hover:border-fresa transition-colors">
        <div className="relative w-fit h-fit flex">{data?.availability}</div>
        <div className="relative w-fit h-fit flex">{data?.scm}</div>
      </div>
      <div className="space-y-2 border border-white rounded-sm p-2 group-hover:border-fresa transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs truncate">{detalles?.proveedorT}</span>
          <span
            className={`px-2 py-1 rounded bg-ama/20 border border-ama text-xs`}
          >
            {statusLabel}
          </span>
        </div>

        <h4 className="text-white font-semibold text-sm truncate">
          {detalles?.titulo}
        </h4>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Digital:</span>
            <span className="text-ama">{detalles?.precioD}</span>
          </div>
          {detalles?.precioP && (
            <div className="flex justify-between">
              <span>Physical:</span>
              <span className="text-ama">{detalles?.precioP}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Usage:</span>
            <span className="text-white">{data.usageCount}</span>
          </div>
          <div className="text-sm font-gen">{formattedDate}</div>
        </div>
      </div>
    </div>
  );
};
