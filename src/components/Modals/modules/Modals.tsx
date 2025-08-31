"use client";

import { useContext } from "react";
import { Success } from "./Success";
import { Error } from "./Error";
import { AppContext } from "@/lib/providers/Providers";

export const Modals = () => {
  const context = useContext(AppContext);

  if (!context) return null;

  return (
    <>
      {context.successData && <Success />}
      {context.errorData && <Error />}
    </>
  );
};
