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
    // const appSciptID = BACKEND_APP_SCRIPT_ID; // SpreadSheet App Script ID
    // // console.log(appSciptID);
    // const apiUrl = `https://script.google.com/macros/s/${appSciptID}/exec`;

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

// /** @type {import('@sveltejs/kit').RequestHandler} */
// export async function _post({ request }) {
//   try {
//     // Parse the incoming request body
//     const requestBody = await request.json();
//     const { row, col, studentName, studentEmail } = requestBody;

//     // Validate required fields
//     if (!row || !col || !studentName || !studentEmail) {
//       return new Response(JSON.stringify({ error: "Missing required fields." }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
   
//     // Prepare the request payload
//     const requestData = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         action: "bookSlot", // Action identifier for the backend
//         row: row,
//         col: col,
//         studentName: studentName,
//         studentEmail: studentEmail,
//       }),
//     };

//     // Make the HTTP request to the backend
//     const response = await fetch(apiUrl, requestData);

//     // Check if the response is successful
//     if (!response.ok) {
//       throw new Error(`Failed to book slot: ${response.status}`);
//     }

//     // Parse the JSON response
//     const responseData = await response.json();

//     // Return the confirmation message from the backend
//     return new Response(JSON.stringify({ message: responseData.message }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error while booking slot:", error);

//     // Handle errors gracefully
//     return new Response(
//       JSON.stringify({
//         error: error instanceof Error ? error.message : "An unexpected error occurred.",
//       }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }