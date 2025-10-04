import prisma from "@/db";
import { protectedProcedure, router } from "@/lib/trpc";
import { z } from "zod";

export const adminRouter = router({
    updateDesignation: protectedProcedure.input(z.object({
        email: z.string(),
        designation: z.enum(["Employee", "Manager"])
    })).mutation(async ({ ctx, input }) => {
        await prisma.user.update({
            where: {
                email: input.email,
            }, data: {
                designation: input.designation
            }
        })

        return {
            success: true
        }
    }),
    assignManager: protectedProcedure.input(z.object({
        managerId: z.string(),
        userId: z.string()
    })).mutation(async ({ ctx, input }) => {
        await prisma.user.update({
            where: {
                id: input.userId
            }, data: {
                managerId: input.managerId
            }
        })

        return {
            success: true
        }
    }),
}) 