import { useRouter } from "next/navigation";
import { LibraryCardProps } from "../types";
import { useLibraryCard } from "../hooks/useLibraryCard";
import { getStatusLabel } from "@/lib/helpers/status";
import Image from "next/image";

export const LibraryCard = ({ data, onClick, dict }: LibraryCardProps) => {
  const router = useRouter();
  const { detalles, formattedDate, isTemplate, contractAddress, itemId } =
    useLibraryCard(data);

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
      <div className="p-3 space-y-3 text-white">
        <div className="flex items-start  justify-between gap-2 mb-2">
          <div className="flex flex-col w-fit h-fit">
            <div className="text-xs font-awk uppercase tracking-wide mb-1">
              {dict?.lot} #{itemId}
            </div>
            <h4 className="font-agency text-base leading-tight truncate">
              {detalles?.titulo}
            </h4>
          </div>
          {!onClick && (
            <div className="flex">
              <div className="text-xs text-gris font-chicago relative lowercase cursor-pointer flex px-3 py-1 bg-offNegro">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderoro2.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                {statusLabel}
              </div>
            </div>
          )}
        </div>
        <div className="relative aspect-square overflow-hidden">
          {detalles?.imageURL && (
            <Image
              src={detalles?.imageURL}
              fill
              draggable={false}
              alt={detalles?.titulo}
              className="object-contain rounded-md transition-transform duration-300"
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
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="text-xs text-verde font-chicago relative lowercase cursor-pointer flex px-3 py-1 bg-offNegro/70 rounded-sm">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderblue.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                {data?.availability}
              </div>
              <div className="text-xs text-verde font-chicago relative lowercase cursor-pointer flex px-3 py-1 bg-offNegro/70 rounded-sm">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderblue.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                {data?.scm}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3">
          <div className="grid grid-cols-2 gap-2 text-base mb-2">
            <div className="space-y-1">
              <div className="font-awk uppercase tracking-wide text-gris">
                {dict?.supplier}
              </div>
              <div className="text-oro font-slim text-xs leading-tight truncate">
                {detalles?.proveedorT}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-awk uppercase tracking-wide text-gris">
                {dict?.usage}
              </div>
              <div className="text-oro font-slim text-xs leading-tight truncate">
                {data.usageCount}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="space-y-1">
              {data?.availability !== "Physical Only" && (
                <div className="flex justify-between items-center">
                  <span className="font-awk text-oro uppercase text-lg">
                    {dict?.digital}
                  </span>
                  <div className="text-xs text-gris font-chicago relative lowercase cursor-pointer flex px-3 py-1 bg-offNegro">
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    {detalles?.precioD ? detalles?.precioD : dict?.free}
                  </div>
                </div>
              )}
              {data?.availability !== "Digital Only" && (
                <div className="flex justify-between items-center">
                  <span className="font-awk uppercase text-lg text-oro">
                    {dict?.physical}
                  </span>
                  <div className="text-xs text-gris font-chicago relative lowercase cursor-pointer flex px-3 py-1 bg-offNegro">
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    {detalles?.precioP ? detalles?.precioP : dict?.free}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-2 text-gris text-center w-full justify-center flex">
            <div className="text-sm font-awk uppercase tracking-wide">
              {formattedDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
