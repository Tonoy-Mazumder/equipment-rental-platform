import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },
        phone: {
          type: "string",
          required: false,
        },
        location: {
          type: "string",
          required: false,
        },
      },
    }),
      jwtClient(),
  ],
});
