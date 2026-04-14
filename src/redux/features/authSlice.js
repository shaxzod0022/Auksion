import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  isAdmin: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.isAdmin = action.payload.isAdmin;
      state.isInitialized = true;
    },
    loginUser: (state) => {
      state.isLoggedIn = true;
      state.isAdmin = false;
    },
    loginAdmin: (state) => {
      state.isLoggedIn = true;
      state.isAdmin = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.isAdmin = false;
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("userToken");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("adminToken");
      }
    },
    initAuth: (state) => {
      if (typeof window !== "undefined") {
        const userToken = sessionStorage.getItem("userToken");
        const adminToken = sessionStorage.getItem("adminToken");

        state.isLoggedIn = !!userToken || !!adminToken;
        state.isAdmin = !!adminToken;
      }
      state.isInitialized = true;
    }
  },
});

export const { setAuth, loginUser, loginAdmin, logout, initAuth } = authSlice.actions;
export default authSlice.reducer;
