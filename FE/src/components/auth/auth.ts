import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { sendRequest } from "@/utils/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        const res = await sendRequest<any>({
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          body: {
            username: credentials?.username,
            password: credentials?.password,
          },
        });

        if (res?.statusCode === 201) {
          return {
            _id: res.data?.user?._id,
            name: res.data?.user?.name,
            email: res.data?.user?.email,
            access_token: res.data?.access_token,
            role: res.data?.user?.role || "USER",
          } as any;
        }

        return null;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials" && user) {
        token.access_token = (user as any).access_token;
        token.role = (user as any).role;
        token.user = user as any;
      }

      if (account && account.provider !== "credentials") {
        token.access_token = undefined;
        token.role = "USER";
        token.user = {
          name: (token as any).name,
          email: (token as any).email,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user as any;
      session.access_token = token.access_token as string | undefined; // Fix type
      session.role = token.role as string | undefined;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
});
