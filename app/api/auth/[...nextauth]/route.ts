import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        // Note: Email provider requires a database adapter (e.g., Prisma).
        // For MVP, we can use Google only. Email can be added later.
    ],
    pages: {
        signIn: '/auth/signin', // Custom sign-in page (optional)
    },
    callbacks: {
        async session({ session, token }) {
            // Attach user id to session if needed
            if (session.user && token.sub) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).id = token.sub;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };
