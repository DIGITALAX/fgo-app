"use client";

import { useContext } from "react";
import { Success } from "./Success";
import { Error } from "./Error";
import { AppContext } from "@/lib/providers/Providers";

export const Modals = ({ dict }: { dict: any }) => {
  const context = useContext(AppContext);

  if (!context) return null;

  return (
    <>
      {context.successData && <Success dict={dict} />}
      {context.errorData && <Error dict={dict} />}
    </>
  );
};
