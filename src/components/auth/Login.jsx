"use client";
import { useState } from "react";
import { styles } from "@/styles/styles";
import BtnBlue from "../helper/BtnBlue";
import Link from "next/link";
import { useRouter } from "next/navigation";
import userService from "@/services/userService";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await userService.login(formData.email, formData.password);
      if (result.token) {
        sessionStorage.setItem("userToken", result.token);
        sessionStorage.setItem("userData", JSON.stringify(result.user));
        router.push("/profile");
      } else {
        setError(result.message || "Email yoki parol noto'g'ri");
      }
    } catch (err) {
      setError("Server bilan aloqa uzildi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.paddingCont} flex flex-col gap-5 md:w-1/2 xl:w-1/3 w-full mx-auto`}
    >
      <h2 className="text-2xl font-black text-[#18436E] uppercase mb-4 text-center">Tizimga kirish</h2>
      
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <input
        type="email"
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        className="border border-gray-300 p-2 outline-none bg-white rounded focus:border-blue-500 transition-colors"
      />
      <input
        type="password"
        required
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Parol"
        className="border border-gray-300 p-2 outline-none bg-white rounded focus:border-blue-500 transition-colors"
      />
      
      <BtnBlue 
        text={loading ? "Kirilmoqda..." : "Kirish"} 
        disabled={loading}
        type="submit"
      />
      
      <div className="flex items-center justify-center gap-2 text-sm mt-2">
        <span className="text-gray-500">Akkauntingiz yo'qmi?</span>
        <Link
          href={"/register"}
          className="text-[#18436E] font-bold cursor-pointer hover:underline"
        >
          Ro'yxatdan o'tish
        </Link>
      </div>
    </form>
  );
}
