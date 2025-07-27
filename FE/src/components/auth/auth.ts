import NextAuth, { IUser } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { sendRequest } from "../../utils/api";
import {
  InActiveAccountError,
  InvalidEmailPasswordError,
} from "../../utils/errors";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {},
      },

      //@ts-ignore
      authorize: async (credentials) => {
        console.log(">>> check credentials: ", credentials);

        const res = await sendRequest<IBackendRes<ILogin>>({
          method: "POST",
          url: "http://localhost:8000/api/v1/auth/login",
          body: {
            username: credentials?.username,
            password: credentials?.password,
          },
        });

        if (res.statusCode === 201) {
          return {
            _id: res.data?.user?._id,
            name: res.data?.user?.name,
            email: res.data?.user?.email,
            access_token: res.data?.access_token,
          };
        } else if (+res.statusCode === 401) {
          throw new InvalidEmailPasswordError("Email or password is incorrect");
        } else if (+res.statusCode === 400) {
          throw new InActiveAccountError("Your account is not active yet");
        } else {
          throw new Error("Internal server errors");
        }
      },
    }),
  ],

  pages: {
    signIn: "auth/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.user = user as unknown as IUser;
      }
      return token;
    },
    session({ session, token }) {
      (session.user as IUser) = token.user;
      return session;
    },
  },
});
