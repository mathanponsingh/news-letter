import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { db } from "../config/db.js";



export const auth = betterAuth({
    database: mongodbAdapter(db),
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
    trustedOrigins: ["http://localhost:5173"]
})