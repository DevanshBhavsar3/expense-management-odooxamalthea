"use client";

import SignInForm from "@/components/sign-in-form";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function LoginPage() {
  return (
    <div className="w-full h-full flex justify-center items-center bg-background">
      <div className="bg-muted w-full max-w-[400px] rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-border p-10 mt-5">
        <h1 className="text-3xl font-semibold text-center border-b-2 pb-2 mb-3 tracking-wide">
          Login
        </h1>
        <p className="text-muted-foreground text-sm text-center mb-8">
          Access your company account
        </p>

        <SignInForm />

        <div
          className="mt-6 text-center"
          onClick={() => redirect("/signup/admin")}
        >
          <Button>← Signup as Admin</Button>
        </div>
      </div>
    </div>
  );
}
