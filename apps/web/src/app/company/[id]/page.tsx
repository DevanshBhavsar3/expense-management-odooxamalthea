import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import Dashboard from "./dashboard";
import { headers } from "next/headers";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

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

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session.data.user.name}</p>
      <Dashboard session={session.data} id={id} />
    </div>
  );
}
