import { redirect } from '@sveltejs/kit';
import { BACKEND_APP_SCRIPT_ID } from '$env/static/private';

// SpreadSheet App Script ID
const appSciptID = BACKEND_APP_SCRIPT_ID; // SpreadSheet App Script ID
const apiUrl = `https://script.google.com/macros/s/${appSciptID}/exec`;

/** @type {import('../$types').PageServerLoad} */
export async function load(event) {
  try {
    // Check if the user is authenticated Via layout [[1]]
    const parentData = await event.parent(); // Get data from layout [[1]]
    const { session } = parentData; // Access session from parent data

    // Extract the access token from the session
    const userToken = session.fullToken;
    
    // console.log(userToken);
    // Fetch data from the external API

    const response = await fetch(`${apiUrl}?token=${userToken}`);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    // Parse the JSON response
    const jsonData = await response.json();
    // console.log(jsonData);
    
    // Return both session and API data
    return {
      apiData: jsonData,
    };
  } catch (error) {
    console.error("Error in load function:", error);

    // Handle errors gracefully
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    // Fallback for unexpected errors
    return {
      error: "An unexpected error occurred.",
    };
  }
}
