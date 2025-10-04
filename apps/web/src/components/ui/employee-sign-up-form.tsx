"use client";

import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

export default function EmployeeSignupPage() {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      company: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.fullName,
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
            toast.success("Employee account created successfully");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: z.object({
        fullName: z.string().min(1, "Full name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        company: z.string().min(1, "Company name is required"),
      }),
    },
  });

  const handleSwitchToAdminSignup = () => {
    router.push("/signup/admin");
  };

  const handleSwitchToLogin = () => {
    router.push("/login");
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-stone-200 flex justify-center items-center px-6">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen h-fit bg-stone-200 flex justify-center px-6 py-10">
      <div className="w-full max-w-[500px] bg-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-stone-300 p-10 mt-5">
        <h1 className="text-3xl font-semibold text-blue-800 text-center border-b-2 border-blue-500 pb-2 mb-3 tracking-wide">
          Sign up — Employee Account
        </h1>
        <p className="text-stone-500 text-sm text-center mb-8">
          Join your company to submit expenses.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <div>
            <form.Field name="fullName">
              {(field) => (
                <div className="space-y-2">
                  <Label
                    htmlFor={field.name}
                    className="text-stone-600 font-semibold"
                  >
                    Full name
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Your Name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-stone-50 border-stone-300 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white transition-all duration-200"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-red-500 text-sm">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label
                    htmlFor={field.name}
                    className="text-stone-600 font-semibold"
                  >
                    Email
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="you@company.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-stone-50 border-stone-300 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white transition-all duration-200"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-red-500 text-sm">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <form.Field name="password">
              {(field) => (
                <div className="space-y-2">
                  <Label
                    htmlFor={field.name}
                    className="text-stone-600 font-semibold"
                  >
                    Password
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="Choose a password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-stone-50 border-stone-300 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white transition-all duration-200"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-red-500 text-sm">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <form.Field name="company">
              {(field) => (
                <div className="space-y-2">
                  <Label
                    htmlFor={field.name}
                    className="text-stone-600 font-semibold"
                  >
                    Company
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Enter your company"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-stone-50 border-stone-300 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white transition-all duration-200"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-red-500 text-sm">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <form.Subscribe>
            {(state) => (
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 transition-all duration-300 hover:-translate-y-0.5"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting
                  ? "Creating Account..."
                  : "Create Employee Account"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <div className="mt-5 p-3 bg-stone-50 border border-stone-200 rounded-lg">
          <p className="text-stone-500 text-xs">
            After signup, your Admin will assign your role and permissions
            inside the app.
          </p>
        </div>

        <div className="mt-5 flex justify-between items-center">
          <Button
            variant="link"
            onClick={handleSwitchToAdminSignup}
            className="text-blue-500 hover:text-blue-700 font-medium p-0 h-auto"
          >
            ← Sign up as Admin
          </Button>
          <Button
            variant="link"
            onClick={handleSwitchToLogin}
            className="text-blue-500 hover:text-blue-700 font-medium p-0 h-auto"
          >
            Login →
          </Button>
        </div>
      </div>
    </div>
  );
}
