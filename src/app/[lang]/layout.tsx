import ModalsEntry from "@/components/Modals/modules/ModalsEntry";
import { Container } from "@/components/Layout/modules/SquareContainer";
import NavigationEntry from "@/components/Layout/modules/NavigationEntry";

export type tParams = Promise<{ lang: string }>;
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }, { lang: "pt" }];
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: tParams;
}>) {
  return (
    <div className="flex relative w-full flex-col gap-3">
      <NavigationEntry params={params} />
      <Container>{children}</Container>
      <ModalsEntry params={params} />
    </div>
  );
}
