import { getDictionary } from "@/app/[lang]/dictionaries";
import DetailsEntry from "@/components/Layout/modules/DetailsEntry";
import Wrapper from "@/components/Layout/modules/Wrapper";

export default async function LibraryPage() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return <Wrapper dict={dict} page={<DetailsEntry dict={dict} />}></Wrapper>;
}
