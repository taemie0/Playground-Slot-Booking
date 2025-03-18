import { redirect } from '@sveltejs/kit'; // Import the redirect function
/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  const session = await event.locals.auth();
  //  if (!session?.user?.email) {
  //   redirect(303, `/`)
  // }
  return {
    session,
  };
}


