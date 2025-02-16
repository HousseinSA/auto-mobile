// import CredentialsProvider from "next-auth/providers/credentials";
// import db from "@/lib/mongodb";
// import { AuthOptions } from "next-auth";

// export const authOptions: AuthOptions = {
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials) {
//                 if (!credentials?.password) {
//                     throw new Error("Password is required");
//                 }

//                 try {
//                     // Use your existing db utility to verify the password
//                     const isValidPassword = await db.verifyUserPassword(credentials.password);

//                     if (!isValidPassword) {
//                         throw new Error("Mot de passe incorrect.");
//                     }

//                     // Return a user object (required by NextAuth.js)
//                     return { id: "single-user" }; // Use the same ID as in your users collection
//                 } catch (err) {
//                     // @ts-expect-error fix
//                     throw new Error(err.message);
//                 }
//             },
//         }),
//     ],
//     session: {
//         strategy: "jwt", // Use JWT for sessions
//         maxAge: 12 * 60 * 60, // Session expires after 12 hours
//     },
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id;
//             }
//             return token;
//         },
//         async session({ session, token }) {
//             // @ts-expect-error fix later
//             session.user.id = token.id;
//             return session;
//         },
//     },
//     secret: process.env.NEXTAUTH_SECRET, // Required for JWT encryption
// };