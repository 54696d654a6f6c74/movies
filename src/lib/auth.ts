import CredentialsProvider from "next-auth/providers/credentials"
import { appRouter } from "~/server/api/root";

const BasicCredentialsAuthProvider = CredentialsProvider({
  name: "Username",
  credentials: {
    username: {
      label: "Username",
      type: "text",
      placeholder: "Your username please..."
    }
  },

  async authorize(credentials) {
    if (!credentials) return null;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      const caller = appRouter.createCaller({} as any);


      const user = await caller.user.get(credentials)

      if (!user) {
        return null;
      }

      return { id: user.username, ...user };

    } catch (e) {
      console.error(e);
    }

    return null;
  },
})

export default BasicCredentialsAuthProvider;
