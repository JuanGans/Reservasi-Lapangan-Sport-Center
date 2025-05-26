import React, { useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";

import Toast from "@/components/toast/Toast";

const MemberPage: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title="Dashboard">
        <h2 className="text-blue-900 font-semibold text-xl">Ini Booking</h2>
      </DashboardLayout>
    </>
  );
};

export default MemberPage;
