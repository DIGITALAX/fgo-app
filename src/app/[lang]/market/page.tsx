import { getDictionary } from "@/app/[lang]/dictionaries";
import { Market } from "@/components/Market/modules/Market";

export default async function MarketPage({
  params,
}: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const { lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <Market dict={dict} />;
}