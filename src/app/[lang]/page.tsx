import { getDictionary } from "@/app/[lang]/dictionaries";
import { Library } from "@/components/Library/modules/Library";

export default async function Home({
  params,
}: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const { lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <Library dict={dict} />;
}
