import { getDictionary } from "@/app/[lang]/dictionaries";
import DetailsEntry from "@/components/Layout/modules/DetailsEntry";

export default async function DetailsPage({
  params,
}: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const { lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <DetailsEntry dict={dict} />;
}
