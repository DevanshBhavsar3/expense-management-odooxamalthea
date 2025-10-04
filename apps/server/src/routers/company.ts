import { z } from "zod";
import { auth } from "../lib/auth";
import { protectedProcedure, router } from "@/lib/trpc";
import prisma from "@/db";
import { randomUUID } from "crypto";

export const companyRouter = router({
  updateEmployee: protectedProcedure
    .input(
      z.object({
        companyId: z.string(),
        employeeId: z.string(),
        role: z.enum(["member", "admin"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await prisma.member.updateMany({
        where: {
          organizationId: input.companyId,
          userId: input.employeeId,
        },
        data: {
          role: input.role,
        },
      });

      return { success: true };
    }),
  createMember: protectedProcedure.input(z.object({
    name: z.string(),
    email: z.string()
  })).mutation(async ({ ctx, input }) => {
    let user = await prisma.user.findUnique({ where: { email: input.email } });

    if (!user) {
      await prisma.user.create({
        data: {
          id: randomUUID(),
          name: input.name,
          email: input.email
        }
      })
    }
  })
})