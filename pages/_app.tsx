import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NotifikasiProvider } from "@/context/NotifModalContext"; // MODAL NOTIFIKASI
import { NotificationProvider } from "@/context/NotificationContext"; // UPDATE REALTIME NOTIFIKASI
import { UserProvider } from "@/context/UserContext"; // UPDATE REALTIME USER

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NotifikasiProvider>
      <NotificationProvider>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </NotificationProvider>
    </NotifikasiProvider>
  );
}
