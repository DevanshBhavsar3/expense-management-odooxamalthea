import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { redirect, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

export default function SignInForm() {
  const router = useRouter();
  const companyQuery = useQuery(trpc.company.get.queryOptions());
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );

      companyQuery.refetch();
      redirect(`/company/${companyQuery.data?.company?.id}`);
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Welcome Back</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
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
                  placeholder="your@email.com"
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
                  placeholder="Enter your password"
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
              {state.isSubmitting ? "Logging in..." : "Login"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
