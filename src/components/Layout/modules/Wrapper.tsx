"use client";

import { JSX } from "react";
import { Navigation } from "./Navigation";
import { Modals } from "@/components/Modals/modules/Modals";
import { Container } from "./SquareContainer";

export default function Wrapper({
  dict,
  page,
}: {
  dict: any;
  page: JSX.Element;
}) {
  return (
    <div className="flex relative w-full flex-col gap-3">
      <Navigation dict={dict} />
      <Container>{page}</Container>
      <Modals dict={dict} />
    </div>
  );
}
