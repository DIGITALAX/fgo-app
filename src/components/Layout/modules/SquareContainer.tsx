import { ContainerProps } from "../types";

export const Container = ({ children }: ContainerProps) => {
  return (
    <div className="flex items-center justify-center w-full p-4">
      <div className="w-[95%] sm:w-[85%] min-h-[45rem] h-[85vh] bg-black backdrop-blur-sm border-4 border-mar overflow-hidden flex flex-col p-4">
        {children}
      </div>
    </div>
  );
};
