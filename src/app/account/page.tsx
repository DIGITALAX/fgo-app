import Wrapper from "@/components/Layout/modules/Wrapper";
import { Account } from "@/components/Account/modules/Account";
import { getDictionary } from "../[lang]/dictionaries";

export default async function AccountPage() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return <Wrapper dict={dict} page={<Account dict={dict} />}></Wrapper>;
}
