"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { login as loginService, verifyToken } from "@/services/adminService";
import { useDispatch } from "react-redux";
import { loginAdmin, logout as logoutAction } from "@/redux/features/authSlice";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem("adminToken");
      if (token) {
        try {
          const verifyResult = await verifyToken();
          if (verifyResult.isValid) {
            setAdmin(verifyResult.user);
            dispatch(loginAdmin());
          } else {
            sessionStorage.removeItem("adminToken");
            setAdmin(null);
            dispatch(logoutAction());
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          sessionStorage.removeItem("adminToken");
          setAdmin(null);
          dispatch(logoutAction());
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const result = await loginService(email, password);
    if (result.token) {
      sessionStorage.setItem("adminToken", result.token);
      setAdmin(result.user);
      dispatch(loginAdmin());
      router.push("/admin");
      return { success: true };
    }
    return { success: false, message: result.message };
  };

  const logout = () => {
    sessionStorage.removeItem("adminToken");
    setAdmin(null);
    dispatch(logoutAction());
    router.push("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
