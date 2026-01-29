import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                }) as any;

                if (!user || !user.password) {
                    throw new Error("User not found or no password set. Please use Google sign-in.");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    onboardingCompleted: user.onboardingCompleted,
                    currentStage: user.currentStage,
                };
            }
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user, account, profile }: any) {
            if (!user.email) return false;

            if (account?.provider === "google") {
                try {
                    await prisma.user.upsert({
                        where: { email: user.email },
                        update: {},
                        create: {
                            email: user.email,
                            name: user.name || "Student",
                            onboardingCompleted: false,
                            currentStage: 1,
                        },
                    });
                    return true;
                } catch (error) {
                    console.error("❌ [NextAuth] SignIn callback error:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                token.id = user.id;
                token.onboardingCompleted = user.onboardingCompleted;
                token.currentStage = user.currentStage;
            }

            if (trigger === "update" && session) {
                return { ...token, ...session };
            }

            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).onboardingCompleted = token.onboardingCompleted;
                (session.user as any).currentStage = token.currentStage;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
