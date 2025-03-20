<script lang="ts">
	// import { page } from '$app/stores';
	import { page } from '$app/state';
	import { SignIn } from '@auth/sveltekit/components';
	import '../style.css'; // Import the CSS file

	// Function to handle button click
	const redirectToSignIn = () => {
		window.location.href = '/signin'; // Redirect to the sign-in page
	};
</script>

<!-- Root Container -->
<div
	class="flex min-h-screen flex-col items-center justify-center bg-gray-900 bg-cover bg-center bg-no-repeat"
	style="background-image: url('/main-bg.jpg');"
>
	<!-- Main Content -->
	<main class="z-10 space-y-6 text-center">
		<!-- Logo -->
		<img
			src="/nsu-logo-small.png"
			alt="Playground Logo"
			class="bounce mx-auto mb-8 w-36"
			aria-hidden="true"
		/>

		<!-- Title -->
		<h1
			class="fade-in text-4xl font-bold text-white sm:text-5xl"
			aria-label="Welcome to Playground Slot Booking"
		>
			Welcome to Playground Slot Booking
		</h1>

		<!-- Description -->
		<p
			class="fade-in-slow text-lg text-white opacity-80 sm:text-xl"
			aria-label="Book your slots easily and enjoy a seamless experience"
		>
			Book your slots easily and enjoy a seamless experience.
		</p>

		<!-- Call-to-Action Button -->
		<!-- <button
      class="bg-white bg-opacity-80 hover:bg-opacity-100 text-black font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 fade-in-delayed"
      on:click={redirectToSignIn}
      aria-label="Get started with Playground Slot Booking"
    >
      Get Started
    </button> -->
	
		<SignIn
			options={{
				redirectTo: page.data.redirectTo
					? `/${decodeURIComponent(page.data.redirectTo).slice(1)}`
					: `/dashboard`
			}}
			class="w-full"
		>
			<button
				slot="submitButton"
				class="fade-in-delayed rounded-full bg-white bg-opacity-80 px-8 py-3 font-bold text-black transition-transform hover:scale-105 hover:bg-opacity-100"
				aria-label="Get started with Playground Slot Booking"
			>
				Sign In
			</button>
		</SignIn>
	</main>
</div>
