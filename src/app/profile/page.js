"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import userService from "@/services/userService";
import applicationService from "@/services/applicationService";
import protocolService from "@/services/protocolService";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/authSlice";
import Link from "next/link";
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
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [protocols, setProtocols] = useState([]);
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
        try {
          const apps = await applicationService.getMyApplications();
          setApplications(Array.isArray(apps) ? apps : []);
          
          const protos = await protocolService.getMyProtocols();
          setProtocols(Array.isArray(protos) ? protos : []);
        } catch(e) {
          console.error("Failed to fetch applications or protocols:", e);
        }
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
    dispatch(logout());
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 p-4">
        <div className="bg-white p-8 rounded-sm shadow-lg max-w-md w-full text-center">
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
    <div className="min-h-screen bg-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-[#18436E] rounded-t-sm p-8 text-white shadow-xl relative overflow-hidden">
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
              className="md:ml-auto cursor-pointer flex items-center gap-2 bg-red-500/80 hover:bg-red-600 text-white px-5 py-2.5 rounded-sm transition-all shadow-md group"
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
        <div className="bg-white rounded-b-sm shadow-xl overflow-hidden border-x border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
            {/* Information Card - Left */}
            <div className="bg-white p-4">
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
            <div className="bg-white p-4">
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
                {user.fullAddress && (
                  <InfoItem
                    icon={<User className="text-gray-400" size={20} />}
                    label="Yashash manzili"
                    value={`${user.fullAddress.region || ''}, ${user.fullAddress.city || ''}, ${user.fullAddress.street || ''}, ${user.fullAddress.houseNumber || ''}`}
                  />
                )}
                <div className="mt-8 border-t border-gray-100 bg-blue-50/70 p-4 rounded-sm">
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

        {/* Applications Section */}
        <div className="bg-white mt-6 rounded-sm shadow-xl overflow-hidden border border-gray-100 p-4">
          <h3 className="text-xl font-black text-[#18436E] uppercase tracking-widest mb-6 flex items-center gap-2">
            Mening arizalarim
          </h3>
          
          {applications.length === 0 ? (
            <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center font-medium">Siz hali hech qaysi lotga ariza bermagansiz.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app) => (
                app.lot && (
                  <Link
                    href={`/lots/${app.lot.slug}`}
                    key={app._id}
                    className="block p-4 rounded-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-[#18436E] group-hover:text-blue-600 transition-colors line-clamp-2">
                        {app.lot.name || "Nomsiz lot"}
                      </h4>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${
                        app.status === 'approved' ? 'bg-green-100 text-green-700' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {app.status === 'approved' ? 'Tasdiqlangan' :
                         app.status === 'rejected' ? 'Rad etilgan' :
                         'Kutilmoqda'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2 border-t border-gray-200 pt-2 flex justify-between">
                      <span>Lot raqami:</span> 
                      <span className="font-semibold text-gray-700">{app.lot.lotNumber}</span>
                    </div>
                    <div className="text-xs text-gray-400 flex justify-between">
                      <span>Ariza berilgan:</span>
                      <span>{new Date(app.createdAt).toLocaleString("uz-UZ", { dateStyle: "short", timeStyle: "short" })}</span>
                    </div>
                  </Link>
                )
              ))}
            </div>
          )}
        </div>

        {/* Protocols Section */}
        <div className="bg-white mt-6 rounded-sm shadow-xl overflow-hidden border border-gray-100 p-4">
          <h3 className="text-xl font-black text-[#18436E] uppercase tracking-widest mb-6 flex items-center gap-2">
            Mening Bayonnomalarim
          </h3>
          
          {protocols.length === 0 ? (
            <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center font-medium">Sizda hozircha faol bayonnomalar mavjud emas.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {protocols.map((proto) => (
                <div
                  key={proto._id}
                  className="p-4 rounded-sm border border-gray-200 bg-gray-50 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-[#18436E] line-clamp-1">
                        {proto.lot?.name || "Nomsiz lot"}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">№: {proto.protocolNumber}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700 uppercase">
                      Faol
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-end">
                    <div className="text-xs text-gray-500">
                      <span>Sana:</span>
                      <p className="font-semibold text-gray-700">{new Date(proto.createdAt).toLocaleDateString("uz-UZ")}</p>
                    </div>
                    <a
                      href={protocolService.getDownloadUrl(proto._id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#18436E] text-white text-[10px] font-black uppercase px-4 py-2 rounded-sm shadow-md hover:bg-[#123354] transition-all"
                    >
                      Bayonnomani Yuklash (PDF)
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="mt-1 p-2 bg-gray-50 rounded-sm group-hover:bg-blue-50 transition-colors">
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
