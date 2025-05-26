import Head from "next/head";
import Sidebar from "@/components/templates/Sidebar";
import Header from "@/components/templates/Header";

import { ReactNode } from "react";

interface DashboardLayoutProps {
  title?: string;
  children: ReactNode;
}

const DashboardLayout = ({ title, children }: DashboardLayoutProps) => {
  return (
    <>
      {/* HEAD */}
      <Head>
        <title>{title}</title>
      </Head>
      <div className="bg-[#f0f2f5] flex flex-col">
        {/* SIDEBAR */}
        <Sidebar>
          {/* HEADER */}
          <Header />
          {children}
        </Sidebar>
      </div>
    </>
  );
};

export default DashboardLayout;
