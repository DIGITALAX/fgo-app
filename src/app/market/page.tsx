import { getDictionary } from "@/app/[lang]/dictionaries";
import Wrapper from "@/components/Layout/modules/Wrapper";
import { Market } from "@/components/Market/modules/Market";

export default async function MarketPage() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return <Wrapper dict={dict} page={<Market dict={dict} />}></Wrapper>;
}
