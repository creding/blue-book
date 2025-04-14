import Providers from "@/providers/Providers";
export default function DevotionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
