// src/routes/api/internal/+server.ts
import { json, redirect } from '@sveltejs/kit';
import { BACKEND_APP_SCRIPT_ID } from '$env/static/private';

const appScriptID = BACKEND_APP_SCRIPT_ID;
const apiUrl = `https://script.google.com/macros/s/${appScriptID}/exec`;

export async function GET({ locals }) {

  // console.log('Entered internal API endpoint');
  const session = await locals.auth();
  const userToken = session?.fullToken;

  // console.log('Token:', userToken);

  if (!userToken) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }
  
      // const userToken = session.fullToken;
    
    // console.log(userToken);
    // Fetch data from the external API

  try {
    const response = await fetch(`${apiUrl}?token=${userToken}`);
    const apiData = await response.json();

    const isAdmin = apiData.Data?.isAdmin ?? false;
    // console.log('API Data:', apiData);
    // console.log('Is Admin:', isAdmin);
    
    const redirectPath = isAdmin ? '/admin/dashboard' : '/dashboard';

    return json({ redirectPath });
  } catch (err) {
    console.error('Admin check failed:', err);
    return json({ error: 'Failed to verify user.' }, { status: 500 });
  }
}
