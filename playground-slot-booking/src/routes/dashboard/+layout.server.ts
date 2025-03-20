// To protect this route - Only authenticated users can access this route

import { redirect } from '@sveltejs/kit'; // Import the redirect function
/** @type {import('./$types').PageServerLoad} */

export async function load(event) {
	const session = await event.locals.auth();
  // Redirect to login if user is not authenticated
  if (!session?.user?.id) {
    throw redirect(303, "/");
  }
	return {
		session
	};
}