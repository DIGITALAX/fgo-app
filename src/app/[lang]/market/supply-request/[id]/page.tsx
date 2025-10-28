import { getDictionary } from "@/app/[lang]/dictionaries";
import { SupplyRequest } from "@/components/Market/modules/SupplyRequest";

export default async function SupplyRequestPage({
  params,
}: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);

  return <SupplyRequest dict={dict} />;
}
