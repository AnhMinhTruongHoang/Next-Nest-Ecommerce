import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { AuthOptions } from "next-auth";
import { sendRequest } from "@/utils/api";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    // local login
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const res = await sendRequest<IBackendRes<JWT>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          method: "POST",
          body: {
            username: credentials?.username,
            password: credentials?.password,
          },
        });

        if (res && res.data) {
          // Any object returned will be saved in `user` property of the JWT
          return res.data as any;
        } else {
          if (res?.message === "EMAIL_NOT_VERIFIED") {
            throw new Error("EMAIL_NOT_VERIFIED");
          }

          throw new Error(res?.message || "Invalid credentials");
        }
      },
    }),
    ////////// github login
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    /////////// google login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    ////////// facebook login
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID!,
      clientSecret: process.env.FACEBOOK_SECRET!,
    }),
  ],
  /////////// callback
  callbacks: {
    async jwt({ token, user, account }) {
      // Login bằng Credentials (Local Login) → Lấy role từ backend
      if (account?.provider === "credentials" && user) {
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
        token.user = user.user; // { _id, email, name, role, ... }

        // GÁN ROLE TỪ BACKEND
        token.role = user?.user?.role || "USER";
      }

      // Login bằng Social OAuth (GitHub/Google/Facebook)
      if (account && account.provider !== "credentials") {
        const res = await sendRequest<IBackendRes<JWT>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/social-media`,
          method: "POST",
          body: {
            type: account.provider.toUpperCase(),
            email: user?.email,
            name: user?.name,
          },
        });

        if (res.data) {
          token.access_token = res.data.access_token;
          token.refresh_token = res.data.refresh_token;
          token.user = res.data.user;

          // MẶC ĐỊNH NGƯỜI LOGIN SOCIAL LÀ USER
          token.role = res.data.user?.role || "USER";
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.access_token = token.access_token ?? "";
      session.refresh_token = token.refresh_token ?? "";
      session.user = token.user;

      // TRUYỀN ROLE VÀO SESSION
      session.role = token.role;
      return session;
    },
  },

  /////////////
};
