import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // ⚠️ abhi dummy login (baad me DB connect karenge)
        if (
          credentials.email === "test@gmail.com" &&
          credentials.password === "123456"
        ) {
          return {
            id: "1",
            email: "test@gmail.com",
          };
        }

        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };