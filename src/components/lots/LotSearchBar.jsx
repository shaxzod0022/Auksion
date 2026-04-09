"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Search, MapPin, Grid, RefreshCcw } from "lucide-react";
import lotTypeService from "@/services/lotTypeService";
import provinceService from "@/services/provinceService";
import regionService from "@/services/regionService";

export default function LotSearchBar({ onSearch, onClear, className }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams(); // To check if we are in a page with params

  const [lotTypes, setLotTypes] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [regions, setRegions] = useState([]);

  const [formData, setFormData] = useState({
    name: searchParams.get("name") || "",
    lotType: searchParams.get("lotType") || "",
    province: searchParams.get("province") || "",
    region: searchParams.get("region") || "",
  });

  useEffect(() => {
    // Fetch lotTypes and provinces once
    const fetchData = async () => {
      try {
        const [types, provs] = await Promise.all([
          lotTypeService.getAllLotTypes(),
          provinceService.getAllProvinces(),
        ]);
        setLotTypes(types);
        setProvinces(provs);
      } catch (err) {
        console.error("Error fetching search data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Fetch regions when province changes
    const fetchRegions = async () => {
      if (formData.province) {
        try {
          const regs = await regionService.getRegionsByProvince(
            formData.province,
          );
          setRegions(regs);
        } catch (err) {
          console.error("Error fetching regions:", err);
        }
      } else {
        setRegions([]);
      }
    };
    fetchRegions();
  }, [formData.province]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (onSearch) {
      onSearch(formData);
      return;
    }

    const query = new URLSearchParams();
    if (formData.name) query.set("name", formData.name);
    if (formData.lotType) query.set("lotType", formData.lotType);
    if (formData.province) query.set("province", formData.province);
    if (formData.region) query.set("region", formData.region);

    router.push(`/lots/lots?${query.toString()}`);
  };

  const handleClear = () => {
    const emptyState = {
      name: "",
      lotType: "",
      province: "",
      region: "",
    };
    setFormData(emptyState);

    if (onClear) {
      onClear();
      return;
    }

    router.push("/lots/lots");
  };

  return (
    <div
      className={
        className ||
        "w-full bg-white/80 backdrop-blur-md rounded-sm shadow-sm border border-gray-100 p-5"
      }
    >
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {/* Keyword Search */}
        <div className="relative">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
            Lot nomi
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="name"
              placeholder="Masalan: Uy, Mashina..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Lot Type Select */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
            Lot turi
          </label>
          <div className="relative">
            <Grid
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              name="lotType"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer"
              value={formData.lotType}
              onChange={handleChange}
            >
              <option value="">Barchasi</option>
              {lotTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Province Select */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
            Viloyat
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              name="province"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer"
              value={formData.province}
              onChange={handleChange}
            >
              <option value="">Barcha hududlar</option>
              {provinces.map((prov) => (
                <option key={prov._id} value={prov._id}>
                  {prov.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Region Select */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
            Tuman
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              name="region"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer disabled:opacity-50"
              value={formData.region}
              onChange={handleChange}
              disabled={!formData.province}
            >
              <option value="">Barcha tumanlar</option>
              {regions.map((reg) => (
                <option key={reg._id} value={reg._id}>
                  {reg.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="flex-1 bg-[#18436E] border-none text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-900/10 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Search size={18} />
            Qidirish
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="p-3 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 hover:text-gray-900 transition-all cursor-pointer"
            title="Tozalash"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
