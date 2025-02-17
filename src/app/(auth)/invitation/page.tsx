"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { acceptInvitationApi } from "@/store/user/user.store";

const Invitation = () => {
  const searchParams = useSearchParams();

  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {
    if (!searchParams.get("auth")) {
      router.push("/");
    }
  }, [searchParams, router]);

  const submitBtn = async () => {
    dispatch(
      acceptInvitationApi({
        token: searchParams.get("auth") as string,
      })
    );
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-800">
          Accept Invitation
        </h1>
        <p className="mb-6 text-gray-600 text-lg">
          You have been invited. Click below to accept.
        </p>
        <Button className="w-full text-lg py-3" onClick={submitBtn}>
          Accept Invitation
        </Button>
      </div>
    </div>
  );
};

export default Invitation;
