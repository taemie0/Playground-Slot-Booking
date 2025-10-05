import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/sveltekit/providers/google"
import { type AdapterUser } from "@auth/core/adapters";
import { BACKEND_APP_SCRIPT_ID } from '$env/static/private';

declare module "@auth/core" {
  interface User extends AdapterUser {
    id: string;
    email: string;
    role?: string;
  }
}

declare module "@auth/sveltekit" {
  interface Session {
    user: {
      id?: string;
      email?: string;
      name?: string;
      image?: string;
      role?: string;
      dashboardUrl?: string;
    };
    accessToken?: string;
    refreshToken?: string;
    fullToken?: string;
  }
}

// Helper function to check if user is admin using your existing API
async function checkUserRole(fullToken: string): Promise<{ role: string; dashboardUrl: string }> {
  try {
    const appScriptID = BACKEND_APP_SCRIPT_ID;
    const apiUrl = `https://script.google.com/macros/s/${appScriptID}/exec`;
    
    const response = await fetch(`${apiUrl}?token=${fullToken}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user role from backend');
    }
    
    const apiData = await response.json();
    const isAdmin = apiData.Data?.isAdmin ?? false;
    
    return {
      role: isAdmin ? 'admin' : 'user',
      dashboardUrl: isAdmin ? '/admin/dashboard' : '/dashboard'
    };
  } catch (error) {
    console.error('Error checking user role:', error);
    // Default to regular user if check fails
    return { role: 'user', dashboardUrl: '/dashboard' };
  }
}

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [Google],
  trustHost: true,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
        
        // Fetch user role immediately after authentication
        if (token.idToken) {
          const { role, dashboardUrl } = await checkUserRole(token.idToken as string);
          token.role = role;
          token.dashboardUrl = dashboardUrl;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId as string;
      session.user.role = token.role as string;
      session.user.dashboardUrl = token.dashboardUrl as string;
      session.accessToken = token.accessToken as string;
      session.fullToken = token.idToken as string;
      return session;
    },
  }
})