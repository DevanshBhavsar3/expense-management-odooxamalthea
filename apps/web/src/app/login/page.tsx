"use client";

import SignInForm from "@/components/sign-in-form";
import { redirect } from "next/navigation";

export default function LoginPage() {
  return (
    <div className="w-full h-full flex justify-center items-center bg-background">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-stone-300 p-10 mt-5">
        <h1 className="text-3xl font-semibold text-blue-800 text-center border-b-2 border-blue-500 pb-2 mb-3 tracking-wide">
          Login
        </h1>
        <p className="text-stone-500 text-sm text-center mb-8">
          Access your company account
        </p>

        <SignInForm />

        <div
          className="mt-6 text-center"
          onClick={() => redirect("/signup/admin")}
        >
          <button className="text-blue-500 hover:text-blue-700 font-medium text-sm transition-colors">
            ← Signup as Admin
          </button>
        </div>
      </div>
    </div>
  );
}
