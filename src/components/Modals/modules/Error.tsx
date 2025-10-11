import { useContext } from "react";
import { AppContext } from "@/lib/providers/Providers";
import Image from "next/image";

export const Error = ({ dict }: { dict: any }) => {
  const context = useContext(AppContext);

  if (!context?.errorData) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative max-w-md w-full">
        <div className="absolute z-0 top-0 left-0 w-full h-full flex">
          <Image
            src={"/images/borderblue.png"}
            draggable={false}
            objectFit="fill"
            fill
            alt="border"
          />
        </div>
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-awk uppercase text-fresa">{dict?.error}</h2>
            <div
              onClick={context.hideError}
              className="relative cursor-pointer hover:opacity-80 transition-opacity w-4 h-4"
            >
              <Image
                src={"/images/plug.png"}
                draggable={false}
                fill
                objectFit="contain"
                alt="close"
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gris font-chicago text-sm leading-relaxed whitespace-pre-wrap break-words">
              {context.errorData.message}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={context.hideError}
              className="relative"
            >
              <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center">
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
                  {dict?.close}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
