"use client";
import { useState } from "react";
import { styles } from "@/styles/styles";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import BtnBlue from "../helper/BtnBlue";
import contactService from "@/services/contactService";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    direction: "",
    topic: "",
    fullName: "",
    email: "",
    phoneNumber: "+998",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({ ...prev, phoneNumber: phone }));
  };

  const validatePhone = (phone) => {
    // Simple UZ phone regex: +998 followed by 9 digits
    const cleanPhone = phone.replace(/\D/g, "");
    return /^998\d{9}$/.test(cleanPhone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    // Validate phone number
    if (!validatePhone(formData.phoneNumber)) {
      setStatus({
        type: "error",
        message: "Iltimos, haqiqiy O'zbekiston telefon raqamini kiriting (+998 XX XXX XX XX)",
      });
      setLoading(false);
      return;
    }

    try {
      await contactService.submitContact(formData);
      setStatus({
        type: "success",
        message: "Xabaringiz yuborildi! Tez orada siz bilan bog'lanamiz.",
      });
      setFormData({
        direction: "",
        topic: "",
        fullName: "",
        email: "",
        phoneNumber: "+998",
        message: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Xabar yuborishda xatolik yuz berdi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.flexCol} items-start gap-4 w-full`}>
      {status.message && (
        <div
          className={`w-full p-4 rounded-md mb-2 text-sm font-bold ${
            status.type === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {status.message}
        </div>
      )}

      <label
        htmlFor="direction"
        className={`${styles.h2} font-normal text-gray-400`}
      >
        Yo'nalishni kiriting *
      </label>
      <input
        type="text"
        required
        id="direction"
        value={formData.direction}
        onChange={handleChange}
        className={`${styles.p} outline-none bg-white w-full border border-gray-300 rounded-md p-2`}
      />

      <label
        htmlFor="topic"
        className={`${styles.h2} font-normal text-gray-400`}
      >
        Mavzu *
      </label>
      <input
        required
        type="text"
        id="topic"
        value={formData.topic}
        onChange={handleChange}
        className={`${styles.p} outline-none bg-white w-full border border-gray-300 rounded-md p-2`}
      />

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 w-full`}>
        <div className={`${styles.flexCol} items-start gap-4`}>
          <label
            htmlFor="fullName"
            className={`${styles.h2} font-normal text-gray-400`}
          >
            Ism va Familiya *
          </label>
          <input
            type="text"
            required
            id="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`${styles.p} outline-none bg-white w-full border border-gray-300 rounded-md p-2`}
          />
        </div>
        <div className={`${styles.flexCol} items-start gap-4`}>
          <label
            htmlFor="email"
            className={`${styles.h2} font-normal text-gray-400`}
          >
            Email *
          </label>
          <input
            type="email"
            required
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.p} outline-none bg-white w-full border border-gray-300 rounded-md p-2`}
          />
        </div>
      </div>

      <label
        htmlFor="phone"
        className={`${styles.h2} font-normal text-gray-400`}
      >
        Telefon *
      </label>
      <PhoneInput
        defaultCountry="uz"
        value={formData.phoneNumber}
        onChange={handlePhoneChange}
        required
        inputClassName="!w-full !h-10 !border-[#e5e7eb] !rounded-md !text-base"
        containerClassName="!w-full"
      />

      <label
        htmlFor="message"
        className={`${styles.h2} font-normal text-gray-400`}
      >
        Habarnoma *
      </label>
      <textarea
        required
        id="message"
        value={formData.message}
        onChange={handleChange}
        rows={5}
        className={`${styles.p} outline-none bg-white w-full border border-gray-300 rounded-md p-2`}
      />

      <div className="mt-2">
        <BtnBlue 
          text={loading ? "Yuborilmoqda..." : "Yuborish"} 
          disabled={loading}
          type="submit"
        />
      </div>
    </form>
  );
}
