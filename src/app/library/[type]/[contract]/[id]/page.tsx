"use client";

import { useParams } from "next/navigation";
import { TemplateDetails } from "@/components/Item/modules/TemplateDetails";
import { ChildDetails } from "@/components/Item/modules/ChildDetails";
import { ParentDetails } from "@/components/Item/modules/ParentDetails";

export default function LibraryItemPage() {
  const { type, contract, id } = useParams();
  if (!type || !contract || !id) {
    return <div>Invalid parameters</div>;
  }

  return (
    <>
      {type === "template" ? (
        <TemplateDetails
          contractAddress={contract as string}
          templateId={parseInt(id as string)}
        />
      ) : type === "child" ? (
        <ChildDetails
          contractAddress={contract as string}
          childId={parseInt(id as string)}
        />
      ) : type === "parent" ? (
        <ParentDetails
          contractAddress={contract as string}
          designId={parseInt(id as string)}
        />
      ) : (
        <div>Invalid item type</div>
      )}
    </>
  );
}
