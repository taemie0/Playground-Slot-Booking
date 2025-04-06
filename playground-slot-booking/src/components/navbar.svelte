<script>
	let {
		email = $bindable(),
		name = $bindable(),
		image = $bindable(),
		accessToken = $bindable()
	} = $props();
</script>

<main>
	<div class="navbar bg-base-100 bg-opacity-50 p-4 bg-blend-darken">
		<!-- Navbar Start -->
		<div class="navbar-start flex flex-row items-center space-x-4">
			<div class="flex items-center space-x-2">
				<a
					class="flex items-center space-x-3 transition-transform hover:scale-102"
					href="https://www.northsouth.edu/osa/"
				>
					<div class="h-10 w-10">
						<img src="/nsu-logo-small.png" alt="NSU Logo" class="h-full w-full object-contain" />
					</div>
					<span class="flex flex-col">
						<span class="font-bold">Office of Student Affairs</span>
						<small class="text-xs font-semibold text-gray-500 dark:text-gray-400">
							NSU Sports facilities reservation schedule
						</small>
					</span>
				</a>
			</div>
		</div>

		<!-- Navbar Center -->
		<div class="navbar-center flex flex-col items-center">
			<!-- <div class="flex items-center space-x-2">
				<a class="btn btn-ghost text-md max-sm:" href="https://www.northsouth.edu/osa/">
					<div class="h-6 w-6">
						<img src="/nsu-logo-small.png" alt="NSU Logo" class="h-full w-full object-contain" />
					</div>
					Office of Student Affairs, North South University
				</a>
			</div>

			<small class="ms-2 font-semibold text-gray-500 dark:text-gray-400">
				NSU Sports facilities reservation schedule
			</small> -->
		</div>

		<!-- Navbar End -->
		<div class="navbar-end flex items-center space-x-4 pr-4">
		
			<!-- User Informations -->
			<div
				class="flex items-center space-x-3 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
			>
				<!-- Frosted glass effect [[7]] -->
				<img
					src={image || 'https://via.placeholder.com/40'}
					alt="User"
					class="h-8 w-8 rounded-full object-cover ring-2 ring-blue-400"
				/>
				<div class="text-right">
					<div class="font-medium">{name || 'Guest'}</div>
					<small class="text-xs text-blue-100">{email || 'guest@example.com'}</small>
				</div>
			</div>

			<!-- Dropdown Menu -->
			<div class="dropdown dropdown-end">
				<button class="btn btn-circle btn-ghost transition-colors hover:bg-blue-700/50">
					<!-- Semi-transparent hover [[9]] -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-Linejoin="round"
							stroke-Width="2"
							d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
						/>
					</svg>
				</button>
			</div>

			<!-- Dark Mode Button -->
			<!-- <button class="btn btn-ghost btn-circle" aria-label="Dark mode">
				<div class="indicator">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
						/>
					</svg>
					<span class="badge badge-xs badge-primary indicator-item"></span>
				</div>
			</button> -->
		</div>
	</div>
</main>
