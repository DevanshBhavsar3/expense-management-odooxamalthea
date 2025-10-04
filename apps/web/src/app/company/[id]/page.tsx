import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import AdminDashboard from "@/components/admin-dashboard";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data) {
    redirect("/login");
  }

  const employees = await authClient.organization.listMembers();

  console.log(employees);

  return (
    <AdminDashboard
      session={session.data}
      id={id}
      employees={employees.data?.members?.map((member) => ({
        ...member,
        role: member.role as "member" | "admin" | "owner",
        user: {
          ...member.user,
          image: member.user.image ?? undefined,
        },
      }))}
    />
  );
}
