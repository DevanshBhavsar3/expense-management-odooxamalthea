import prisma from "@/db";
import { protectedProcedure, router } from "@/lib/trpc";
import { z } from "zod";

export const adminRouter = router({
    updateRole: protectedProcedure.input(z.object({
        email: z.string(),
        role: z.enum(["Employee", "Manager"])
    })).mutation(async ({ ctx, input }) => {
        await prisma.user.update({
            where: {
                email: input.email,
            }, data: {
                role: input.role
            }
        })

        return {
            success: true
        }
    })
}) 