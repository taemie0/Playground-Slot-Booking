<script>
	let {
		email = $bindable(),
		name = $bindable(),
		image = $bindable(),
		role = $bindable(),
		dashboardUrl = $bindable(),
		accessToken = $bindable()
	} = $props();

	import { SignOut } from '@auth/sveltekit/components';
	import { goto, invalidateAll } from '$app/navigation';
	import { signOut } from "@auth/sveltekit/client";
	
	let isSigningOut = $state(false);

	// Custom sign-out handler for better UX
	async function handleSignOut() {
		try {
			isSigningOut = true;
			
			// Immediately clear local state for instant feedback
			email = '';
			name = '';
			image = '';
			accessToken = '';
			
			// Perform the actual sign-out
			await signOut({ 
				callbackUrl: '/',
				redirect: false // Prevent automatic redirect
			});
			
			// Invalidate all data and manually redirect
			await invalidateAll();
			await goto('/', { replaceState: true });
			
		} catch (error) {
			console.error('Sign out error:', error);
			isSigningOut = false;
		}
	}
</script>

<main>
	<div class="navbar bg-base-100 bg-opacity-50 p-0 bg-blend-darken shadow-lg backdrop-blur-sm">
		<!-- Navbar Start -->
		<div class="navbar-start flex flex-row items-center space-x-4 mx-4">
			<div class="flex items-center space-x-2">
				<a
					class="flex items-center space-x-3 transition-transform duration-300 ease-in-out hover:scale-105"
					href="https://www.northsouth.edu/osa/ "
					aria-label="Office of Student Affairs"
				>
					<!-- NSU Logo -->
					<div class="h-10 w-10">
						<img src="/nsu-logo-small.png" alt="NSU Logo" class="h-full w-full object-contain" />
					</div>

					<!-- Text Content -->
					<span class="flex flex-col justify-center">
						<span class="text-base font-bold leading-tight">Office of Student Affairs</span>
						<small class="text-xs font-semibold leading-tight text-gray-500 dark:text-gray-400">
							NSU Sports Facilities Reservation Schedule
						</small>
					</span>
				</a>
			</div>
		</div>

		<!-- Navbar Center -->
		<div class="navbar-center hidden lg:flex">
			<div class="flex items-center space-x-2">
				<a href={dashboardUrl} class="btn btn-ghost text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012 2h4a2 2 0 012-2v0M8 5v0" />
					</svg>
					Dashboard
				</a>
				<a href="/facilities" class="btn btn-ghost text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
					</svg>
					Facilities
				</a>
				<a href="/bookings" class="btn btn-ghost text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
					</svg>
					My Bookings
				</a>
			</div>
		</div>

		<!-- Navbar End -->
		<div class="navbar-end flex items-center space-x-4 pr-4">
			<!-- User Information -->
			<div class="flex items-center space-x-3 bg-gradient-to-r from-blue-10 to-indigo-50 rounded-xl p-1 border border-blue-100 hover:shadow-md transition-all duration-300 {isSigningOut ? 'opacity-50' : ''}">
				<div class="relative">
					<img
						src={image || 'https://via.placeholder.com/40'}
						alt="User"
						class="h-10 w-10 rounded-full object-cover ring-2 ring-blue-200 transition-all duration-300"
					/>
					<div class="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white shadow-sm {isSigningOut ? 'bg-gray-400' : ''}"></div>
				</div>
				
				<div class="flex flex-col justify-center">
					<div class="text-sm font-semibold leading-tight text-gray-800">
						{name || 'Guest'}
					</div>
					<div class="text-xs leading-tight text-gray-500">
						{email || 'guest@example.com'}
					</div>
				</div>
			</div>

			<!-- Dropdown Menu -->
			<div class="dropdown dropdown-bottom dropdown-end">
				<button
					tabindex="0"
					class="btn btn-circle btn-ghost transition-colors hover:bg-blue-700/50 {isSigningOut ? 'loading' : ''}"
					disabled={isSigningOut}
				>
					{#if isSigningOut}
						<span class="loading loading-spinner loading-sm"></span>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
							/>
						</svg>
					{/if}
				</button>
				<ul
					tabindex="-1"
					class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
				>
					<!-- Custom sign-out button with better UX -->
					<li>
						<button 
							onclick={handleSignOut}
							disabled={isSigningOut}
							class="flex items-center gap-2 {isSigningOut ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50 hover:text-red-600'}"
						>
							{#if isSigningOut}
								<span class="loading loading-spinner loading-xs"></span>
								Signing out...
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
								</svg>
								Sign out
							{/if}
						</button>
					</li>
					
					<!-- Alternative: Keep the original SignOut component as fallback -->
					<!-- <li> 
						<SignOut>
							<span slot="submitButton" class="flex items-center gap-2">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
								</svg>
								Sign out
							</span>
						</SignOut>
					</li> -->
				</ul>
			</div>
		</div>
	</div>
</main>