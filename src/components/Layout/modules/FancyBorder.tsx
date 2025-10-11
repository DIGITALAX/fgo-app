import { FancyBorderProps } from "../types";

export const FancyBorder = ({
  children,
  className = "",
  color = "oro",
  type,
}: FancyBorderProps) => {
  const colorMap = {
    oro: "bg-oro",
    white: "bg-white",
    purple: "bg-fresa",
    blue: "bg-mar",
    ama: "bg-ama",
    verde: "bg-verde",
  };

  return (
    <div className={`fancy-border-${color} ${className}`}>
      {type !== "none" && (
        <>
          {" "}
          <div
            className={`absolute w-1 h-1 ${
              type == "diamond" ? "rotate-45" : "rounded-full"
            }  ${colorMap[color]} z-20`}
            style={{ top: "0px", left: "0px" }}
          ></div>
          <div
            className={`absolute w-1 h-1 ${
              type == "diamond" ? "rotate-45" : "rounded-full"
            } ${colorMap[color]} z-20`}
            style={{ top: "0px", right: "0px" }}
          ></div>
        </>
      )}

      {children}
      {type !== "none" && (
        <>
          {" "}
          <div
            className={`absolute w-1 h-1 ${
              type == "diamond" ? "rotate-45" : "rounded-full"
            } ${colorMap[color]} z-20`}
            style={{ bottom: "0px", left: "0px" }}
          ></div>
          <div
            className={`absolute w-1 h-1 ${
              type == "diamond" ? "rotate-45" : "rounded-full"
            } ${colorMap[color]} z-20`}
            style={{ bottom: "0px", right: "0px" }}
          ></div>
        </>
      )}
    </div>
  );
};
