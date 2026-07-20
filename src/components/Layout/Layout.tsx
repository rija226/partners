import type { ReactNode } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import ScrollToTopButton from "@components/ScrollToTopButton/ScrollToTopButton";
import { Main } from "./Layout.style";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
