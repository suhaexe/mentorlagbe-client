import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [
    adminClient(),
    inferAdditionalFields({
      user: {
        role: { type: "string" },
        phone: { type: "string" },
        bio: { type: "string" },
        plan: { type: "string" },
        requestedRole: { type: "string" }, 
      },
    }),
  ],
});

export const { useSession, signIn, signUp, signOut } = authClient;