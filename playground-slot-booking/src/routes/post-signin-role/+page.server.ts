import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();

    if (!session?.user?.id) {
        throw redirect(302, '/');
    }

    // Role and dashboardUrl are now already in the session from auth.ts
    // No need to make API call here anymore!
    const dashboardUrl = session.user.dashboardUrl || '/dashboard';
    
    // console.log(`Redirecting user ${session.user.email} (${session.user.role}) to: ${dashboardUrl}`);
    throw redirect(302, dashboardUrl);
};