// src/routes/api/session/+server.ts
// server endpoint to check the session endpoint
// this is a protected endpoint
import type { RequestHandler } from '@sveltejs/kit';
export const GET: RequestHandler = async ({ locals }) => {
    const session = await locals.auth();
    return new Response(JSON.stringify(session, null, 2));
  };