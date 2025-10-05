// import type { LayoutServerData } from './$types';
import type { LayoutServerLoad } from './dashboard/$types';

export const load: LayoutServerLoad = async (event) => {
    const session = await event.locals.auth();
    
    return {
        session: {
            user: session?.user ? {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                image: session.user.image,
                role: session.user.role,
                dashboardUrl: session.user.dashboardUrl
            } : null
        }
    };
};