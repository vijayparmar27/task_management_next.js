// app/components/LoadingSpinner.jsx
"use client";
import { selectUserData } from "@/store/user/user.store";
import React from "react";
import { useSelector } from "react-redux";
import { Loader } from "./ui/Loader";

export default function LoadingSpinner() {
  const { isLoading } = useSelector(selectUserData);

  if (!isLoading) return null;

  return (
    <>
      <Loader />
    </>
  );
}
