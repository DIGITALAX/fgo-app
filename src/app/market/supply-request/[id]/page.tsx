import { getDictionary } from "@/app/[lang]/dictionaries";
import Wrapper from "@/components/Layout/modules/Wrapper";
import { SupplyRequest } from "@/components/Market/modules/SupplyRequest";

export default async function SupplyRequestPage() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");

  return <Wrapper dict={dict} page={<SupplyRequest dict={dict} />}></Wrapper>;
}
