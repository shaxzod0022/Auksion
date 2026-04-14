"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { initAuth } from "./features/authSlice";

export default function ReduxProvider({ children }) {
  useEffect(() => {
    store.dispatch(initAuth());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
