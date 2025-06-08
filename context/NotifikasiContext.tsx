import { createContext, useState, useContext, ReactNode } from "react";
import NotifikasiModal from "@/components/notification/Notification";

type Notif = {
  show: boolean;
  message: string;
  type?: "info" | "booking" | "payment" | "paid" | "confirmed" | "canceled" | "review" | "completed";
  actionLabel?: string;
  onAction?: () => void;
};

const NotifikasiContext = createContext<{
  showNotif: (notif: Omit<Notif, "show">) => void;
  closeNotif: () => void;
}>({
  showNotif: () => {},
  closeNotif: () => {},
});

export const useNotifikasi = () => useContext(NotifikasiContext);

export const NotifikasiProvider = ({ children }: { children: ReactNode }) => {
  const [notif, setNotif] = useState<Notif | null>(null);

  const showNotif = (data: Omit<Notif, "show">) => {
    setNotif({ show: true, ...data });
  };

  const closeNotif = () => setNotif(null);

  return (
    <NotifikasiContext.Provider value={{ showNotif, closeNotif }}>
      {children}
      {/* Modal dipasang di layout */}
      <NotifikasiModal
        show={!!notif?.show}
        message={notif?.message || ""}
        type={notif?.type}
        actionLabel={notif?.actionLabel}
        onAction={() => {
          notif?.onAction?.();
          closeNotif();
        }}
        onClose={closeNotif}
      />
    </NotifikasiContext.Provider>
  );
};
