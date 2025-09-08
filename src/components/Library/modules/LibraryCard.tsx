import { useRouter } from "next/navigation";
import { LibraryCardProps } from "../types";
import { useLibraryCard } from "../hooks/useLibraryCard";
import { getStatusLabel } from "@/lib/helpers/status";
import Image from "next/image";

export const LibraryCard = ({ data, onClick, dict }: LibraryCardProps) => {
  const router = useRouter();
  const {
    detalles,
    formattedDate,
    isTemplate,
    contractAddress,
    itemId,
  } = useLibraryCard(data);

  const statusLabel = getStatusLabel(data.status, dict);

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
      className="group cursor-pointer transition-all duration-300 bg-amber-950/20 border border-amber-800/50 hover:border-amber-600/70 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-800/40 via-amber-700/60 to-amber-800/40"></div>
      
      <div className="p-3 space-y-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-mono uppercase tracking-wide text-amber-600/80 mb-1">
              {dict?.lot} #{itemId}
            </div>
            <h4 className="text-white font-medium text-sm leading-tight truncate">
              {detalles?.titulo}
            </h4>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-block px-2 py-1 bg-amber-950/40 border border-amber-800/60 text-xs font-mono uppercase tracking-wide text-amber-200">
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="relative aspect-square bg-amber-950/40 border border-amber-800/50 overflow-hidden">
          {detalles?.imageURL && (
            <Image
              src={detalles?.imageURL}
              fill
              draggable={false}
              alt={detalles?.titulo}
              className="object-contain transition-transform duration-300"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-950/90 via-amber-950/50 to-transparent h-16"></div>
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-amber-100 bg-amber-950/70 px-2 py-1 border border-amber-800/60">
                {data?.availability}
              </span>
              <span className="font-mono text-amber-100 bg-amber-950/70 px-2 py-1 border border-amber-800/60">
                {data?.scm}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-800/50 pt-3">
          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
            <div className="space-y-1">
              <div className="font-mono uppercase tracking-wide text-amber-600/70">{dict?.supplier}</div>
              <div className="text-amber-200 text-xs leading-tight truncate">{detalles?.proveedorT}</div>
            </div>
            <div className="space-y-1">
              <div className="font-mono uppercase tracking-wide text-amber-600/70">{dict?.usage}</div>
              <div className="text-amber-100 font-mono">{data.usageCount}</div>
            </div>
          </div>
          
          <div className="border-t border-amber-900/50 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-mono uppercase text-xs text-amber-600/70">{dict?.digital}</span>
                <span className="font-mono text-xs text-amber-100 bg-amber-950/50 px-2 py-0.5 border border-amber-800/60">
                  {detalles?.precioD}
                </span>
              </div>
              {detalles?.precioP && (
                <div className="flex justify-between items-center">
                  <span className="font-mono uppercase text-xs text-amber-600/70">{dict?.physical}</span>
                  <span className="font-mono text-xs text-amber-100 bg-amber-950/50 px-2 py-0.5 border border-amber-800/60">
                    {detalles?.precioP}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-2 pt-2 border-t border-amber-900/50">
            <div className="text-xs font-mono text-amber-600/70 uppercase tracking-wide">
              {formattedDate}
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-800/40 via-amber-700/60 to-amber-800/40"></div>
    </div>
  );
};
