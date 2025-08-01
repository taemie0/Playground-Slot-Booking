import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/sveltekit/providers/google"
import GoogleProvider from "@auth/core/providers/google"

// export const { handle, signIn, signOut } = SvelteKitAuth({
//   providers: [Google],
  
// })

// export const { handle, signIn, signOut } = SvelteKitAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.AUTH_GOOGLE_ID,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET,
//     }),
//   ],
import { type AdapterUser } from "@auth/core/adapters";

declare module "@auth/core" {
  interface User extends AdapterUser {
    id: string; // Ensure this matches your database schema
    email: string;
  }
}

declare module "@auth/sveltekit" {
  interface Session {
    user: {
      id?: string;
      email?: string;
      name?: string;
      image?: string;
    };
    accessToken?: string;
    refreshToken?: string;
    fullToken?: string;
  }
}

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [Google],
  trustHost: true, 
  callbacks: {
    async jwt({ token, user, account }) { // Add `account` parameter
      if (user) {
        token.userId = user.id; // Google uses `sub` for user ID [[1]]
      }
      if (account) {
        token.accessToken = account.access_token; // Add access token [[5]]
        token.idToken = account.id_token; // Add ID token [[5]]
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId as string ; // Ensure this matches the token property
      session.accessToken = token.accessToken as string; // Access Token
      session.fullToken = token.idToken as string; // ID Token
      return session;
    },
  }
})



