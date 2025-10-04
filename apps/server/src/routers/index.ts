import prisma from "@/db";
import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import z from "zod"
import { companyRouter } from "./company";
import { adminRouter } from "./admin";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	company: companyRouter,
	admin: adminRouter,
});
export type AppRouter = typeof appRouter;
