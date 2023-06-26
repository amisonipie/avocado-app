import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const URL = "https://api.avocadodelivers.app/v1.0/user/login";

axios.defaults["content-type"] = "application/json";

export default NextAuth({
  // Configure one or more authentication providers
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      async authorize(credentials, req) {
        const { email, password } = credentials;
        try {
          const response = await axios.post(
            URL,
            { email, password, platform: 'remote_terminal' },
            {
              headers: { "content-type": "application/json" },
            }
          );
          const user = response?.data;
          if (response.statusText === "OK" && response.status === 200) {
            return user;
          }
        } catch (error) {
          throw new Error(error?.response?.data?.error?.message);
        }
      },
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.result.data.token;
        token.userId = user.result.data.user_id;
        token.role = user?.result?.data?.role;
      }
      return token;
    },

    async session({ session, token, user }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.userId = token.userId;
        session.role = token?.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
