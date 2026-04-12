import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
  heroPadding = false,
}: {
  children: React.ReactNode;
  heroPadding?: boolean;
}) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: heroPadding ? "var(--nav-height)" : 0 }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
