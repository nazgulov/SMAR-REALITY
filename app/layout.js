import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SMAR s.r.o. | Reality",
  description:
    "Moderní wireframe realitního webu SMAR s.r.o. s nabídkami k prodeji a pronájmu."
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body className="min-h-screen font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
