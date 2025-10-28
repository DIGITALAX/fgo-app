import { getDictionary } from "@/app/[lang]/dictionaries";
import { Future } from "@/components/Market/modules/Future";

export default async function FuturePage({
  params,
}: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);

  return <Future dict={dict} />;
}
