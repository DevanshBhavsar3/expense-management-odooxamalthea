"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

export default function AdminDashboard({
  session,
  id,
  employees,
}: {
  session: typeof authClient.$Infer.Session;
  id: string;
  employees: (typeof authClient.$Infer.Member)[] | undefined;
}) {
  const createMemberMutation = useMutation(
    trpc.company.createMember.mutationOptions()
  );

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "employee" as "employee" | "manager",
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Please enter a valid email"),
        role: z.enum(["employee", "manager"]),
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        createMemberMutation.mutate({
          name: value.name,
          email: value.email,
        });

        const { data, error } = await authClient.organization.inviteMember({
          organizationId: id,
          email: value.email,
          role: value.role === "manager" ? "admin" : "member",
        });

        if (!data?.id) {
          return;
        }

        await authClient.organization.acceptInvitation({
          invitationId: data?.id,
        });

        if (error) {
          toast.error(error || "Failed to invite employee");
          return;
        }

        toast.success("Employee invitation sent successfully");
        form.reset();
      } catch (err) {
        toast.error("Error while inviting employee");
        console.error(err);
      }
    },
  });

  const handleUpdateRole = async (
    userId: string,
    newRole: "manager" | "employee"
  ) => {
    try {
      await authClient.organization.updateMemberRole({
        organizationId: id,
        memberId: userId,
        role: newRole,
      });

      toast.success("Role updated successfully");
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await authClient.organization.removeMember({
        organizationId: id,
        memberIdOrEmail: userId,
      });

      toast.success("Member removed successfully");
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  return (
    <div className="min-h-screen bg-muted p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <Card className="bg-background backdrop-blur-sm shadow-xl border-0 animate-in fade-in-0 slide-in-from-bottom-4 duration-600">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl lg:text-4xl font-bold text-blue-700 relative">
              User Management
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-3 w-20 h-1 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-500 hover:to-blue-600">
                    <TableHead className="text-white font-semibold uppercase text-sm tracking-wide">
                      User
                    </TableHead>
                    <TableHead className="text-white font-semibold uppercase text-sm tracking-wide">
                      Email
                    </TableHead>
                    <TableHead className="text-white font-semibold uppercase text-sm tracking-wide">
                      Role
                    </TableHead>
                    <TableHead className="text-white font-semibold uppercase text-sm tracking-wide">
                      Status
                    </TableHead>
                    <TableHead className="text-white font-semibold uppercase text-sm tracking-wide">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees &&
                    employees.map((employee, index) => {
                      const isOwner = employee.role === "owner";

                      return (
                        <TableRow
                          key={employee.id}
                          className={`text-foreground
                        border-b border-blue-100 transition-all duration-200 hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-sm
                        ${index % 2 === 0 ? "bg-slate-50/50" : "bg-white"}
                      `}
                        >
                          <TableCell className="p-4">
                            <div className="font-medium">
                              {employee.user.name}
                            </div>
                          </TableCell>
                          <TableCell className="p-4">
                            <div className="text-slate-600">
                              {employee.user.email}
                            </div>
                          </TableCell>
                          <TableCell className="p-4">
                            <Select
                              value={employee.role}
                              onValueChange={(value: "manager" | "employee") =>
                                handleUpdateRole(employee.id, value)
                              }
                              disabled={isOwner}
                            >
                              <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="manger">Manger</SelectItem>
                                <SelectItem value="employee">
                                  Employee
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="p-4">
                            <div className="flex gap-2">
                              {!isOwner && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveMember(employee.id)
                                  }
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-700">
                  Invite New Employee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <form.Field
                      name="name"
                      children={(field) => (
                        <div>
                          <Label htmlFor={field.name}>Name</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Enter employee name"
                            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                          />
                          {field.state.meta.errors.map((error) => (
                            <p
                              key={error?.message}
                              className="text-red-500 text-sm"
                            >
                              {error?.message}
                            </p>
                          ))}
                        </div>
                      )}
                    />

                    <form.Field
                      name="email"
                      children={(field) => (
                        <div>
                          <Label htmlFor={field.name}>Email</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="employee@example.com"
                            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                          />
                          {field.state.meta.errors.map((error) => (
                            <p
                              key={error?.message}
                              className="text-red-500 text-sm"
                            >
                              {error?.message}
                            </p>
                          ))}
                        </div>
                      )}
                    />

                    <form.Field
                      name="role"
                      children={(field) => (
                        <div>
                          <Label htmlFor={field.name}>Role</Label>
                          <Select
                            value={field.state.value}
                            onValueChange={(value) =>
                              field.handleChange(
                                value as "manager" | "employee"
                              )
                            }
                          >
                            <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="employee">Employee</SelectItem>
                            </SelectContent>
                          </Select>
                          {field.state.meta.errors.map((error) => (
                            <p
                              key={error?.message}
                              className="text-red-500 text-sm"
                            >
                              {error?.message}
                            </p>
                          ))}
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <form.Subscribe
                      selector={(state) => [
                        state.canSubmit,
                        state.isSubmitting,
                      ]}
                      children={([canSubmit, isSubmitting]) => (
                        <Button
                          type="submit"
                          disabled={!canSubmit || isSubmitting}
                          className="bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                        >
                          {isSubmitting ? "Sending..." : "Send Invitation"}
                        </Button>
                      )}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
