import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("RentPro");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      role: {
        type: ["customer", "owner", "admin"],
        required: false,
        defaultValue: "customer",
        input: true,
      },
    },
  },
  databaseHooks: {
  user: {
    create: {
      before: async (user) => {
        const role = user.role === "owner" ? "owner" : "customer";

        return {
          data: {
            ...user,
            role,
          },
        };
      },
    },
  },
},
  emailAndPassword: {
    enabled: true,
  },
});
