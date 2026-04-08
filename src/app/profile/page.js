"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import userService from "@/services/userService";
import {
  User,
  Mail,
  Phone,
  Calendar,
  IdCard,
  Hash,
  LogOut,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("userToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const data = await userService.getMe();
      if (data && data._id) {
        setUser(data);
      } else {
        // Token might be invalid or expired
        handleLogout();
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userData");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-gray-600 font-medium text-lg italic">
          Profil yuklanmoqda...
        </p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Xatolik</h2>
          <p className="text-gray-600 mb-6">
            {error || "Sessiya muddati tugagan bo'lishi mumkin"}
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Qayta kirish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-[#18436E] rounded-t-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <User size={120} />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg">
              <span className="text-4xl font-bold uppercase">
                {user.lastName?.[0]}
                {user.firstName?.[0]}
              </span>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-extrabold tracking-tight">
                {user.lastName} {user.firstName} {user.middleName}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-blue-100 italic">
                <ShieldCheck size={18} />
                <span>Tasdiqlangan foydalanuvchi</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="md:ml-auto cursor-pointer flex items-center gap-2 bg-red-500/80 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl transition-all shadow-md group"
            >
              <LogOut
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="font-bold">Chiqish</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-b-2xl shadow-xl overflow-hidden border-x border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
            {/* Information Card - Left */}
            <div className="bg-white p-8">
              <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-8 h-px bg-blue-600/30"></span>
                Shaxsiy ma'lumotlar
              </h3>

              <div className="space-y-6">
                <InfoItem
                  icon={<User className="text-gray-400" size={20} />}
                  label="F.I.SH"
                  value={`${user.lastName} ${user.firstName} ${user.middleName}`}
                />
                <InfoItem
                  icon={<Calendar className="text-gray-400" size={20} />}
                  label="Tug'ilgan sana"
                  value={new Date(user.dateOfBirth).toLocaleDateString(
                    "uz-UZ",
                    {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    },
                  )}
                />
                <InfoItem
                  icon={<Mail className="text-gray-400" size={20} />}
                  label="Elektron pochta"
                  value={user.email}
                />
                <InfoItem
                  icon={<Phone className="text-gray-400" size={20} />}
                  label="Telefon raqami"
                  value={user.phoneNumber}
                />
              </div>
            </div>

            {/* Information Card - Right */}
            <div className="bg-white p-8">
              <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-8 h-px bg-blue-600/30"></span>
                Identifikatsiya
              </h3>

              <div className="space-y-6">
                <InfoItem
                  icon={<IdCard className="text-gray-400" size={20} />}
                  label="Passport seriya va raqami"
                  value={`${user.passportSeries} ${user.passportNumber}`}
                />
                <InfoItem
                  icon={<Hash className="text-gray-400" size={20} />}
                  label="JSHSHIR (PINFL)"
                  value={user.jshshir}
                />
                <div className="mt-8 pt-8 border-t border-gray-50 bg-blue-50/30 p-4 rounded-xl">
                  <p className="text-xs text-blue-800/70 leading-relaxed italic">
                    Ushbu ma'lumotlar auksion savdolarida ishtirok etish uchun
                    shaxsingizni tasdiqlashda foydalaniladi. Agar ma'lumotlarda
                    xatolik bo'lsa, ma'muriyatga murojaat qiling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="mt-1 p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-gray-800 font-semibold text-lg">{value}</p>
      </div>
    </div>
  );
}
