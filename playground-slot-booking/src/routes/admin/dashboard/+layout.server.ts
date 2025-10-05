import { redirect } from '@sveltejs/kit';

export async function load(event) {
    // console.log('ADMIN DASHBOARD SERVER LOAD CALLED');
    
    const session = await event.locals.auth();
    // console.log('Session in admin dashboard:', session);
    
    if (!session?.user?.id) {
        // console.log('NO USER ID - REDIRECTING TO HOME');
        throw redirect(303, "/");
    }

    if (session.user.role !== 'admin') {
        throw redirect(303, "/");
    }
    
    // console.log('ACCESS GRANTED TO ADMIN DASHBOARD');
    return {
        session
    };
}