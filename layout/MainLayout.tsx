import Head from "next/head";
import { ReactNode } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

interface MainLayoutProps {
  title?: string;
  children: ReactNode;
}

const MainLayout = ({ title, children }: MainLayoutProps) => {
  return (
    <>
      {/* TITLE */}
      <Head>
        <title>{`${title} | JTI Sport Center`}</title>
      </Head>

      {/* NAVBAR */}

      <Navbar />

      {/* CHILDREN */}
      {children}

      {/* FOOTER */}

      <Footer />
    </>
  );
};

export default MainLayout;
