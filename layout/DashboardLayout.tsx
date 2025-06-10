import Head from "next/head";
import Sidebar from "@/components/templates/Sidebar";
import Header from "@/components/templates/Header";
// import { NotifikasiProvider } from "@/context/NotifModalContext"; // MODAL NOTIFIKASI
// import { NotificationProvider } from "@/context/NotificationContext"; // UPDATE REALTIME NOTIFIKASI
// import { UserProvider } from "@/context/UserContext"; // UPDATE REALTIME USER
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

      {/* MEMBUKA MODAL NOTIFIKASI */}
      {/* <NotifikasiProvider> */}
      {/* <NotificationProvider> */}
      {/* <UserProvider> */}
      <div className="bg-[#f0f2f5] flex flex-col">
        {/* SIDEBAR */}
        <Header />
        <Sidebar>
          {/* HEADER */}

          {children}
        </Sidebar>
      </div>
      {/* </UserProvider> */}
      {/* </NotificationProvider> */}
      {/* </NotifikasiProvider> */}
    </>
  );
};

export default DashboardLayout;
