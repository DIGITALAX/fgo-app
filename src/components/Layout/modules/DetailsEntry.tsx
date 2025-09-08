"use client";

import { useParams } from "next/navigation";
import { TemplateDetails } from "@/components/Item/modules/TemplateDetails";
import { ChildDetails } from "@/components/Item/modules/ChildDetails";
import { ParentDetails } from "@/components/Item/modules/ParentDetails";

export default function DetailsEntry({ dict }: { dict: any }) {
  const { type, contract, id } = useParams();

  if (!type || !contract || !id) {
    return <div>{dict?.item}</div>;
  }

  return (
    <>
      {type === "template" ? (
        <TemplateDetails
          contractAddress={contract as string}
          templateId={parseInt(id as string)}
          dict={dict}
        />
      ) : type === "child" ? (
        <ChildDetails
          contractAddress={contract as string}
          childId={parseInt(id as string)}
          dict={dict}
        />
      ) : type === "parent" ? (
        <ParentDetails
          contractAddress={contract as string}
          designId={parseInt(id as string)}
          dict={dict}
        />
      ) : (
        <div>{dict?.item}</div>
      )}
    </>
  );
}
