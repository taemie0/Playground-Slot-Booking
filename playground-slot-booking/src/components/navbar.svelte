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
		<div class="navbar-start">
			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-ghost btn-circle">
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
							d="M4 6h16M4 12h16M4 18h7"
						/>
					</svg>
				</div>
			</div>
		</div>

		<!-- Navbar Center -->
		<div class="navbar-center flex flex-col items-center">
			<a class="btn btn-ghost text-xl" href="https://www.northsouth.edu/osa/"
				>Office of Student Affairs, North South University</a
			>

			<small class="ms-2 font-semibold text-gray-500 dark:text-gray-400"
				>Sports facilities reservation schedule</small
			>
		</div>

		<!-- Navbar End -->
		<div class="navbar-end flex items-center gap-4">
			<!-- User Information -->
			<div class="flex items-center gap-2">
				<!-- User Image -->
				<div class="avatar">
					<div class="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2">
						<img src={image || 'https://via.placeholder.com/40'} alt="User Profile" />
					</div>
				</div>

				<!-- User Name and Email -->
				<div class="text-right">
					<div class="font-bold">{name || 'Guest'}</div>
					<div class="text-sm text-gray-500">{email || 'guest@example.com'}</div>
				</div>
			</div>

			<!-- Dark Mode Button -->
			<button class="btn btn-ghost btn-circle" aria-label="Dark mode">
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
			</button>
		</div>
	</div>
</main>
