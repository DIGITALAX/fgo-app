import { getDictionary } from "@/app/[lang]/dictionaries";
import Wrapper from "@/components/Layout/modules/Wrapper";
import { Future } from "@/components/Market/modules/Future";

export default async function FuturePage() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");

  return <Wrapper dict={dict} page={<Future dict={dict} />}></Wrapper>;
}
