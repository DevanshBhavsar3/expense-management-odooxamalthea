import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../db";
import { organization } from "better-auth/plugins";

export const auth = betterAuth<BetterAuthOptions>({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
	plugins: [
		organization({
			organizationHooks: {
				beforeAddMember: async ({ member, user, organization }) => {
					return {
						data: {
							...member,
							role: member.role === "admin" ? "manager" : "employee",
						},
					};
				},
			}
		})
	]
});
