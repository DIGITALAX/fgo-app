import { useContext } from "react";
import { AppContext } from "@/lib/providers/Providers";
import { FuturePositionCard } from "@/components/Market/modules/FuturePositionCard";
import { FutureCreditsTabProps } from "../types";

export const FutureCreditsTab = ({ dict }: FutureCreditsTabProps) => {
  const context = useContext(AppContext);

  if (context?.fgoUser?.futureCredits?.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gris font-chicago text-center">
          {dict?.noFutureCredits}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {context?.fgoUser?.futureCredits?.map((credit, index) => (
          <FuturePositionCard
            key={`${credit.child.childContract}-${credit.child.childId}-${index}`}
            futureCredit={credit}
            dict={dict}
          />
        ))}
      </div>
    </div>
  );
};
