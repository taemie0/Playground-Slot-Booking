// src/routes/api/book-slot/+server.js
import { json } from '@sveltejs/kit';
import { BACKEND_APP_SCRIPT_ID } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */

// /** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }: { request: Request }) {
	try {
		// Parse the incoming request body
		const { token, row, col}  = await request.json();

		// Validate required fields
		if (!row || !col || !token) {
			return json({ error: 'Missing required fields.' }, { status: 400 });
		}

		// SpreadSheet App Script ID
		const appSciptID = BACKEND_APP_SCRIPT_ID;
		const apiUrl = `https://script.google.com/macros/s/${appSciptID}/exec`;

		// Prepare the request payload for Google Apps Script
		const requestData = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				token: token,
				row: row,
				col: col,
				action: 'bookSlot', // Action identifier for the backend
				force: false, 
			})
		};

		// Make the HTTP request to the Google Apps Script backend
		const response = await fetch(apiUrl, requestData);

		// Check if the response is successful
		if (!response.ok) {
			throw new Error(`Failed to book slot: ${response.status}`);
		}

		// Parse the JSON response from Google Apps Script
		const responseData = await response.json();

		// Return the confirmation message to the frontend
		return json(responseData, { status: 200 });
	} catch (error) {
		console.error('Error while booking slot:', error);

		// Handle errors gracefully
		return json(
			{
				error: error instanceof Error ? error.message : 'An unexpected error occurred.'
			},
			{ status: 500 }
		);
	}
}


