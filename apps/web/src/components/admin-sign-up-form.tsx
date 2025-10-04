"use client";

import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const countries = [
  { value: "IN", label: "India", currency: "INR" },
  { value: "US", label: "United States", currency: "USD" },
  { value: "GB", label: "United Kingdom", currency: "GBP" },
  { value: "AU", label: "Australia", currency: "AUD" },
  { value: "CA", label: "Canada", currency: "CAD" },
  { value: "SG", label: "Singapore", currency: "SGD" },
  { value: "DE", label: "Germany", currency: "EUR" },
  { value: "FR", label: "France", currency: "EUR" },
  { value: "OTHER", label: "Other", currency: "" },
];

export default function AdminSignUpForm() {
  const router = useRouter();
  const { isPending } = authClient.useSession();
  const [selectedCountry, setSelectedCountry] = useState("");

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      companyName: "",
      country: "",
      currency: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const signUpResult = await authClient.signUp.email(
          {
            name: value.name,
            email: value.email,
            password: value.password,
          },
          {
            onError: (error) => {
              toast.error(error.error.message || "Sign up failed");
              throw new Error(error.error.message);
            },
          }
        );

        if (!signUpResult.data) {
          throw new Error("Sign up failed");
        }

        const orgResult = await authClient.organization.create({
          name: value.companyName,
          slug: value.companyName.toLowerCase().replace(/\s+/g, "-"),
        });

        toast.success("Account created successfully!");

        // Redirect to the organization dashboard
        router.push(`/company/${orgResult.data?.id}`);
      } catch (error) {
        console.error("Sign up error:", error);
        toast.error("Failed to create account. Please try again.");
      }
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        companyName: z
          .string()
          .min(2, "Company name must be at least 2 characters"),
        country: z.string().min(2, "Country must be at least 2 characters"),
        currency: z.string().min(1, "Currency is required"),
      }),
    },
  });

  useEffect(() => {
    const country = countries.find((c) => c.value === selectedCountry);
    if (country) {
      form.setFieldValue("currency", country.currency);
    }
  }, [selectedCountry, form]);

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="h-fit flex justify-center px-6 py-10 bg-background min-h-screen">
      <div className="w-full max-w-[520px] bg-muted rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-border p-10 mt-5">
        <h1 className="text-3xl font-semibold text-center border-b-2 pb-2 mb-3 tracking-wide">
          Sign up — Admin Account
        </h1>
        <p className="text-sm text-center mb-8 text-muted-foreground">
          Create your organization and become the owner.
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
            <form.Field name="companyName">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="font-semibold">
                    Company name
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Acme Pvt Ltd"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
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

          <div className="flex gap-4 items-start max-sm:flex-col max-sm:gap-3">
            <div className="flex-[2] sm:flex-1">
              <form.Field name="country">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className="font-semibold">
                      Country
                    </Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value);
                        setSelectedCountry(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="— select country —" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.state.meta.errors.map((error) => (
                      <p key={error?.message} className="text-red-500 text-sm">
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            <div className="flex-1">
              <form.Field name="currency">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className="font-semibold">
                      Currency
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="Auto"
                      value={field.state.value}
                      readOnly
                    />
                    <div className="text-xs mt-1">
                      Auto-filled based on country
                    </div>
                    {field.state.meta.errors.map((error) => (
                      <p key={error?.message} className="text-red-500 text-sm">
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          <div>
            <form.Field name="name">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="font-semibold">
                    Admin full name
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Rohan Sharma"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
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
                  <Label htmlFor={field.name} className="font-semibold">
                    Admin email
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="admin@company.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
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
                  <Label htmlFor={field.name} className="font-semibold">
                    Password
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="Choose a strong password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
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
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting
                  ? "Creating Account..."
                  : "Create Admin Account"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <div className="mt-5 p-3 border border-border rounded-lg">
          <p className="text-muted-foreground text-xs">
            💡 As the owner, you'll be able to invite team members, assign
            roles, and configure approval workflows after creating your
            organization.
          </p>
        </div>

        <div className="mt-5 flex justify-center items-center">
          <Button variant="link" onClick={() => router.push("/login")}>
            Already have an account? Login →
          </Button>
        </div>
      </div>
    </div>
  );
}
