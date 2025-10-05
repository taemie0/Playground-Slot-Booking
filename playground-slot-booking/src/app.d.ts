// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface Locals {
			session?: {
				fullToken?: string;
				accessToken?: string;
				user?: {
					id?: string;
					email?: string;
					name?: string;
					image?: string;
					role?: string;
					dashboardUrl?: string;
				};
			};
		}
		
		interface PageData {
			session?: {
				user?: {
					id?: string;
					email?: string;
					name?: string;
					image?: string;
					role?: string;
					dashboardUrl?: string;
				} | null;
			};
		}
	}
}

export {};