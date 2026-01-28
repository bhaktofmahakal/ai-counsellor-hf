import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        console.error("❌ [NextAuth] SignIn failed: No email provided");
        return false;
      }

      try {
        console.log(`🔍 [NextAuth] Processing sign-in for: ${user.email}`);

        const dbUser = await prisma.user.upsert({
          where: { email: user.email },
          update: {}, // Don't overwrite existing profile data on sign-in
          create: {
            email: user.email,
            name: user.name || "Student",
            onboardingCompleted: false,
            currentStage: 1,
          },
        });

        console.log(`✅ [NextAuth] User ready - ID: ${dbUser.id}, Email: ${dbUser.email}`);
        return true;
      } catch (error) {
        console.error("❌ [NextAuth] Error in signIn callback:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/dashboard";
    },
    async session({ session }) {
      if (session.user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
          });

          if (dbUser) {
            // @ts-ignore
            session.user.id = dbUser.id;
            // @ts-ignore
            session.user.onboardingCompleted = dbUser.onboardingCompleted;
            // @ts-ignore
            session.user.currentStage = dbUser.currentStage;
          } else {
            console.warn(`⚠️ [NextAuth] User not found in database: ${session.user.email}`);
          }
        } catch (error) {
          console.error("❌ [NextAuth] Session callback error:", error);
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
