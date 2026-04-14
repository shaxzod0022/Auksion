"use client";
import { useState } from "react";
import { styles } from "@/styles/styles";
import BtnBlue from "../helper/BtnBlue";
import Link from "next/link";
import { useRouter } from "next/navigation";
import userService from "@/services/userService";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    jshshir: "",
    passportSeries: "",
    passportNumber: "",
    region: "",
    city: "",
    street: "",
    houseNumber: "",
    phoneNumber: "+998",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    if (name === "passportSeries") {
      sanitizedValue = value
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .slice(0, 2);
    } else if (name === "passportNumber") {
      sanitizedValue = value.replace(/\D/g, "").slice(0, 7);
    } else if (name === "jshshir") {
      sanitizedValue = value.replace(/\D/g, "").slice(0, 14);
    } else if (name === "phoneNumber") {
      if (!value.startsWith("+")) {
        sanitizedValue = "+" + value.replace(/\D/g, "");
      } else {
        sanitizedValue = "+" + value.slice(1).replace(/\D/g, "");
      }
      sanitizedValue = sanitizedValue.slice(0, 13);
    }

    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
  };

  const validate = () => {
    if (formData.passportSeries.length !== 2)
      return "Passport seriyasi 2 ta harf bo'lishi kerak";
    if (formData.passportNumber.length !== 7)
      return "Passport raqami 7 ta raqam bo'lishi kerak";
    if (formData.jshshir.length !== 14)
      return "JSHSHIR 14 ta raqam bo'lishi kerak";
    if (!formData.region || !formData.city || !formData.street || !formData.houseNumber)
      return "To'liq yashash manzilini kiritish majburiy!";
    if (formData.phoneNumber.length !== 13)
      return "Telefon raqami noto'g'ri (+998XXXXXXXXX)";

    // Password complexity: min 5 chars, letters + numbers
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{5,}$/;
    if (!passwordRegex.test(formData.password)) {
      return "Parol kamida 5 ta belgidan iborat bo'lishi hamda tarkibida harf va raqam bo'lishi shart!";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Parollar bir-biriga mos kelmadi";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, region, city, street, houseNumber, ...registerData } = formData;
      const fullAddress = { region, city, street, houseNumber };
      const result = await userService.register({
        ...registerData,
        fullAddress,
        role: "user",
      });

      if (result.message && result.message.includes("muvaffaqiyatli")) {
        setSuccess(
          "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi! Yo'naltirilmoqda...",
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(result.message || "Xatolik yuz berdi");
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
      className={`${styles.paddingCont} flex flex-col items-center mx-auto`}
    >
      <h2 className="text-2xl font-black text-[#18436E] uppercase mb-8 border-b-2 border-blue-100 pb-2">
        A'zo bo'lish
      </h2>

      {error && (
        <div className="w-full max-w-4xl p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="w-full max-w-4xl p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-200 text-center font-bold">
          {success}
        </div>
      )}

      <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 mb-8 w-full">
        <div className={`${styles.flexCol}`}>
          <label className={`${styles.p} font-semibold mb-1`}>Ism *</label>
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Ism"
            className="border border-gray-300 p-2 outline-none bg-white rounded focus:border-blue-500 transition-colors"
          />
        </div>
        <div className={`${styles.flexCol}`}>
          <label className={`${styles.p} font-semibold mb-1`}>Familiya *</label>
          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Familiya"
            className="border border-gray-300 p-2 outline-none bg-white rounded focus:border-blue-500 transition-colors"
          />
        </div>
        <div className={`${styles.flexCol}`}>
          <label className={`${styles.p} font-semibold mb-1`}>
            Otasining ismi *
          </label>
          <input
            type="text"
            name="middleName"
            required
            value={formData.middleName}
            onChange={handleChange}
            placeholder="Otasining ismi"
            className="border border-gray-300 p-2 outline-none bg-white rounded focus:border-blue-500 transition-colors"
          />
        </div>
        <div className={`${styles.flexCol}`}>
          <label className={`${styles.p} font-semibold mb-1`}>
            Tug'ilgan sana *
          </label>
          <input
            type="date"
            name="dateOfBirth"
            required
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="border border-gray-300 p-2 outline-none bg-white rounded focus:border-blue-500 transition-colors"
          />
        </div>
        <div className={`${styles.flexCol}`}>
          <label className={`${styles.p} font-semibold mb-1`}>JSHSHIR *</label>
          <input
            type="text"
            name="jshshir"
            required
            maxLength={14}
            value={formData.jshshir}
            onChange={handleChange}
            placeholder="14 ta raqam"
            className="border border-gray-300 p-2 outline-none bg-white rounded focus:border-blue-500 transition-colors"
          />
        </div>
        <div className={`${styles.flexCol}`}>
          <div className="flex gap-2 w-full">
            <div className="flex-1">
              <label
                className={`${styles.p} font-semibold mb-1 whitespace-nowrap overflow-hidden`}
              >
                Seriya *
              </label>
              <input
                type="text"
                name="passportSeries"
                required
                maxLength={2}
                value={formData.passportSeries}
                onChange={handleChange}
                placeholder="AA"
                className="border border-gray-300 p-2 outline-none bg-white rounded w-full focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex-[2]">
              <label
                className={`${styles.p} font-semibold mb-1 whitespace-nowrap overflow-hidden`}
              >
                Raqam *
              </label>
              <input
                type="text"
                name="passportNumber"
                required
                maxLength={7}
                value={formData.passportNumber}
                onChange={handleChange}
                placeholder="1234567"
                className="border border-gray-300 p-2 outline-none bg-white rounded w-full focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>
        <div className={`${styles.flexCol}`}>
          <label className={`${styles.p} font-semibold mb-1`}>Viloyat *</label>
          <input
            type="text"
            name="region"
            required
            value={formData.region}
            onChange={handleChange}
            placeholder="Viloyat"
            className="border border-gray-300 p-2 outline-none bg-white rounded focus:border-blue-500 transition-colors"
          />
        </div>
        <div className={`${styles.flexCol}`}>
          <label className={`${styles.p} font-semibold mb-1`}>Shahar/Tuman *</label>
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            placeholder="Shahar/Tuman"
            className="border border-gray-300 p-2 outline-none bg-white rounded focus:border-blue-500 transition-colors"
          />
        </div>
        <div className={`${styles.flexCol}`}>
          <label className={`${styles.p} font-semibold mb-1`}>Ko'cha *</label>
          <input
            type="text"
            name="street"
            required
            value={formData.street}
            onChange={handleChange}
            placeholder="Ko'cha"
            className="border border-gray-300 p-2 outline-none bg-white rounded focus:border-blue-500 transition-colors"
          />
        </div>
        <div className={`${styles.flexCol}`}>
          <label className={`${styles.p} font-semibold mb-1`}>Uy raqami *</label>
          <input
            type="text"
            name="houseNumber"
            required
            value={formData.houseNumber}
            onChange={handleChange}
            placeholder="Uy raqami"
            className="border border-gray-300 p-2 outline-none bg-white rounded focus:border-blue-500 transition-colors"
          />
        </div>
        <div className={`${styles.flexCol}`}>
          <label className={`${styles.p} font-semibold mb-1`}>Telefon *</label>
          <input
            type="text"
            name="phoneNumber"
            required
            maxLength={13}
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+998"
            className="border border-gray-300 p-2 outline-none bg-white rounded focus:border-blue-500 transition-colors"
          />
        </div>
        <div className={`${styles.flexCol}`}>
          <label className={`${styles.p} font-semibold mb-1`}>Email *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border border-gray-300 p-2 outline-none bg-white rounded focus:border-blue-500 transition-colors"
          />
        </div>
        <div className={`${styles.flexCol}`}>
          <label className={`${styles.p} font-semibold mb-1`}>Parol *</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Parol"
            className="border border-gray-300 p-2 outline-none bg-white rounded focus:border-blue-500 transition-colors"
          />
        </div>
        <div className={`${styles.flexCol}`}>
          <label className={`${styles.p} font-semibold mb-1`}>
            Parolni tasdiqlash *
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Parolni tasdiqlash"
            className="border border-gray-300 p-2 outline-none bg-white rounded focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-center">
        <p className={`${styles.p} text-red-500 font-semibold mb-1 text-center`}>
          Siz ro'yxatdan o'tish tugmasini bosgan zahoti passport
          ma'lumotlaringiz bilan ishlashimiz uchun ruxsat bergan bo'lasiz
        </p>
        <BtnBlue
          text={loading ? "Yuborilmoqda..." : "Ro'yxatdan o'tish"}
          disabled={loading}
          type="submit"
        />

        <Link
          href={"/login"}
          className="text-[#18436E] font-medium cursor-pointer hover:underline mt-6 transition-all"
        >
          Shaxsiy kabinetga kirish
        </Link>
      </div>
    </form>
  );
}
