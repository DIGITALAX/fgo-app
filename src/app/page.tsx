import Wrapper from "@/components/Layout/modules/Wrapper";
import { getDictionary } from "./[lang]/dictionaries";
import { Library } from "@/components/Library/modules/Library";

export default async function Home() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return <Wrapper dict={dict} page={<Library dict={dict} />}></Wrapper>;
}
