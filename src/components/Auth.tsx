"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { userApi } from "@/store/user/user.store";
import { useDispatch } from "react-redux";

const Auth = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token && pathname !== "/login") {
      router.push("/login");
    } else {
      dispatch(userApi());
      setIsAuthenticated(true);
    }
  }, [router, pathname]);

  if (isAuthenticated === null) {
    return null; // Or show a loading spinner
  }

  return <>{children}</>;
};

export default Auth;
