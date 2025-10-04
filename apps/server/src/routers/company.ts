import prisma from "@/db";
import { protectedProcedure, publicProcedure, router } from "@/lib/trpc";
import { z } from "zod";

export const companyRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findFirst({
      where: {
        id: ctx.session.user.id
      }, include: {
        company: true
      }
    })
    return {
      company: user?.company
    };
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100),
        country: z.string().min(2).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Create a new company
      const company = await prisma.company.create({
        data: {
          name: input.name,
          country: input.country,
        },
      });

      // Update user to admin
      await prisma.user.update({
        where: {
          id: ctx.session?.user.id
        },
        data: {
          role: "Admin",
          companyId: company.id,
        },
      })

      return {
        company,
      };
    }),
  getEmployees: protectedProcedure.input(z.object({ companyId: z.string() })).query(async ({ ctx, input }) => {
    const employees = await prisma.user.findMany({
      where: {
        companyId: input.companyId
      }
    })

    return employees
  })
});
