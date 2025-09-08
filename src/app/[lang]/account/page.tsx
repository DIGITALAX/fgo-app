import { getDictionary } from "@/app/[lang]/dictionaries";
import { Account } from "@/components/Account/modules/Account";

export default async function AccountPage({
  params,
}: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const { lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <Account dict={dict} />;
}
