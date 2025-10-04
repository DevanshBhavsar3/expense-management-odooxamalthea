import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { redirect, useRouter } from "next/navigation";
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
  const createCompany = useMutation(trpc.company.create.mutationOptions());
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
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );

      createCompany.mutate({
        name: value.companyName,
        country: value.country,
      });

      if (createCompany.isSuccess) {
        redirect(`/company/${createCompany.data.company.id}`);
      }
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
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
    <div className="h-fit flex justify-center px-6 py-10 bg-stone-200 min-h-screen">
      <div className="w-full max-w-[520px] bg-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-stone-300 p-10 mt-5">
        <h1 className="text-3xl font-semibold text-blue-800 text-center border-b-2 border-blue-500 pb-2 mb-3 tracking-wide">
          Sign up — Admin Account
        </h1>
        <p className="text-sm text-center mb-8">
          The first user will automatically become the Admin.
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
                  <Label
                    htmlFor={field.name}
                    className="text-stone-600 font-semibold"
                  >
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
            <div className="flex-[2] max-sm:flex-1">
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
                      <SelectTrigger className="bg-stone-50 border-stone-300 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white">
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
                    <Label
                      htmlFor={field.name}
                      className="text-stone-600 font-semibold"
                    >
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
                    <div className="text-xs text-stone-500 mt-1">
                      Currency will auto-fill based on selected country
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
                  <Label
                    htmlFor={field.name}
                    className="text-stone-600 font-semibold"
                  >
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
                    className="bg-stone-50 border-stone-300 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white transition-all duration-200 text-foreground"
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
                    placeholder="Choose a strong password"
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
          {/* 
          <div>
            <form.Field name="">
              {(field) => (
                <div className="space-y-2">
                  <Label
                    htmlFor={field.name}
                    className="text-stone-600 font-semibold"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="Confirm password"
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
          </div> */}

          <form.Subscribe>
            {(state) => (
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 transition-all duration-300 hover:-translate-y-0.5"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting
                  ? "Creating Account..."
                  : "Create Admin Account"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <div className="mt-5 p-3 bg-stone-50 border border-stone-200 rounded-lg">
          <p className="text-stone-500 text-xs">
            Additional settings like roles, manager relationships, and approval
            rules can be configured later by the Admin inside the app.
          </p>
        </div>

        <div className="mt-5 flex justify-between items-center">
          <Button
            variant="link"
            onClick={() => redirect("/login")}
            className="text-blue-500 hover:text-blue-700 font-medium p-0 h-auto"
          >
            ← Login
          </Button>
        </div>
      </div>
    </div>
  );
}
