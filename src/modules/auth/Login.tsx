"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  loginApi,
  selectUserData,
  setIdelStatus,
} from "@/store/user/user.store";
import { useEffect } from "react";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type loginFormValues = z.infer<typeof loginSchema>;

export function Login() {
  const dispatch = useDispatch();
  const { status } = useSelector(selectUserData);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: loginFormValues) => {
    dispatch(
      loginApi({
        email: data.email,
        password: data.password,
      })
    );
  };

  useEffect(() => {
    console.log(`---- status : `, status);
    if (status === "succeeded") {
      dispatch(setIdelStatus());
      setTimeout(() => {
        router.push("/dashboard");
      }, 50);
    }
  }, [status, dispatch]);

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your credentials to access your account
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="m@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <Button className="w-full" type="submit">
          Sign In
        </Button>
      </form>
      <div className="text-center text-sm">
        Dont have an account?{" "}
        <Link className="underline" href="/signup">
          Sign up
        </Link>
      </div>
    </div>
  );
}
