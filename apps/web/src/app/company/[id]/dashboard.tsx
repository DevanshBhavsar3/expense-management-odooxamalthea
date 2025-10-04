"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

export default function Dashboard({
  session,
  id,
}: {
  session: typeof authClient.$Infer.Session;
  id: string;
}) {
  const employees = useQuery(
    trpc.company.getEmployees.queryOptions({ companyId: id })
  );

  return (
    <div>
      {employees.data?.map((e) => {
        return <p>{e.name}</p>;
      })}
    </div>
  );
}
