import { ReactNode } from "react";

export interface ContainerProps {
  children: ReactNode;
}

export interface FancyBorderProps {
  children: ReactNode;
  type: "diamond" | "none" | "circle";
  className?: string;
  color?: "oro" | "white" | "purple" | "blue" | "ama" | "verde";
}
