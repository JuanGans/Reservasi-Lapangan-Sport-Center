import React, { useState, useEffect, useContext } from "react";
import ProfileHeader from "@/components/profiles/ProfileHeader";
import ProfileInfo from "@/components/profiles/ProfileInfo";
import SecurityInfo from "@/components/profiles/SecurityInfo";
import DeleteAccount from "@/components/profiles/DeleteAccount";
import EditPersonalInfoModal from "@/components/profiles/modal/EditPersonalInfoModal";
import UpdatePasswordModal from "@/components/profiles/modal/UpdatePasswordModal";
import DeleteAccountModal from "@/components/profiles/modal/DeleteAccountModal";
import DashboardLayout from "@/layout/DashboardLayout";
import Toast from "@/components/toast/Toast";
// import { UserContext } from "@/context/userContext";

interface ProfileData {
  id: number;
  username: string;
  fullname: string;
  email: string;
  no_hp: string;
  user_img: string;
  role: string;
}

const Profile: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [activeTab, setActiveTab] = useState<"profil" | "keamanan" | "hapus-akun">("profil");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // const { setUser } = useContext(UserContext);

  // Fetch profile data
  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Failed to fetch user data.");
      const data: ProfileData = await res.json();
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // MENGIRIM PROFIL KE API UPDATE PROFIL
  const handleSaveProfile = async (updated: ProfileData & { file?: File }) => {
    const formData = new FormData();
    formData.append("fullname", updated.fullname);
    formData.append("username", updated.username);
    formData.append("email", updated.email);
    formData.append("no_hp", updated.no_hp);
    if (updated.file) formData.append("user_img", updated.file);

    const res = await fetch("/api/profile/updateProfile", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      setToast({ message: data.message || "Update profil gagal", type: "error" });
      return;
    }

    // UBAH PROFILE DATA
    setProfileData(data);

    // MEMASUKKAN DATA USER KE USER CONTEXT
    // setUser(data);

    // TOAST
    setToast({ message: "Profil berhasil diperbarui", type: "success" });
  };

  const deleteAccount = async () => {
    const res = await fetch("/api/profile/deleteProfile", {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      // Simpan state di localStorage agar toast muncul di landing page
      localStorage.setItem("accountDeleted", "true");
      window.location.href = "/";
    } else {
      setToast(data.message || "Gagal menghapus akun");
    }
  };

  // RENDER CONTENT MENU TAB
  const renderContent = () => {
    switch (activeTab) {
      case "profil":
        return profileData ? <ProfileInfo profileData={profileData} openProfileModal={() => setIsPersonalInfoModalOpen(true)} /> : null;
      case "keamanan":
        return profileData ? <SecurityInfo profileData={profileData} openAccountModal={() => setIsPasswordModalOpen(true)} /> : null;
      case "hapus-akun":
        return <DeleteAccount openDeleteModal={() => setIsDeleteModalOpen(true)} />;
      default:
        return null;
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title="Profil Saya">
        <div className="flex-1 px-6 py-4 bg-gray-100">
          <ProfileHeader activeTab={activeTab} setActiveTab={(tab: string) => setActiveTab(tab as "profil" | "keamanan" | "hapus-akun")} />
          <div className="bg-white rounded-md shadow-sm flex">
            <div className="flex-1">{renderContent()}</div>
          </div>
        </div>

        {/* MODALS */}
        {profileData && (
          <EditPersonalInfoModal
            isOpen={isPersonalInfoModalOpen}
            onClose={() => setIsPersonalInfoModalOpen(false)}
            profileData={{
              fullname: profileData.fullname,
              email: profileData.email,
              username: profileData.username,
              no_hp: profileData.no_hp,
              user_img: profileData.user_img,
            }}
            onSave={(updatedData) => handleSaveProfile({ ...profileData, ...updatedData })}
          />
        )}

        <UpdatePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSave={async ({ oldPassword, newPassword }) => {
            try {
              const res = await fetch("/api/profile/updatePassword", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ oldPassword, newPassword }),
              });

              const data = await res.json();
              if (!res.ok) {
                setToast({ message: data.message || "Gagal memperbarui password", type: "error" });
                return;
              }

              setToast({ message: "Password berhasil diperbarui", type: "success" });
            } catch (error: any) {
              setToast({ message: error.message || "Terjadi kesalahan", type: "error" });
            }
          }}
        />

        <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => deleteAccount()} />
      </DashboardLayout>
    </>
  );
};

export default Profile;
