<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { fly, fade, scale } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';
	import '../style.css';

	// Animation state management
	let mounted = false;
	let showSignInForm = false;
	let isSigningIn = false;
	
	// Reactive variables for staggered animations
	let showLogo = false;
	let showTitle = false;
	let showDescription = false;
	let showButton = false;

	// Form reference for submission
	let signInForm: HTMLFormElement;

	onMount(() => {
		mounted = true;
		// Staggered animation sequence
		setTimeout(() => showLogo = true, 100);
		setTimeout(() => showTitle = true, 300);
		setTimeout(() => showDescription = true, 500);
		setTimeout(() => showButton = true, 700);
	});

	const handleGetStarted = () => {
		showSignInForm = true;
	};

	const handleBackToMain = () => {
		showSignInForm = false;
		isSigningIn = false;
	};

	const handleGoogleSignIn = () => {
		isSigningIn = true;
		// Submit the form which will trigger the signIn action
		signInForm.submit();
	};
</script>

<!-- Root Container -->
<div
	class="flex min-h-screen flex-col items-center justify-center bg-gray-900 bg-cover bg-center bg-no-repeat relative overflow-hidden"
	style="background-image: url('/main-bg.jpg');"
>
	<!-- Animated Background Overlay -->
	{#if mounted}
		<div 
			class="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"
			in:fade={{ duration: 1000 }}
		></div>
	{/if}

	<!-- Main Content -->
	<main class="z-10 space-y-6 text-center relative w-full max-w-md px-6">
		
		{#if !showSignInForm}
			<!-- Welcome Screen -->
			<div class="space-y-6">
				<!-- Logo with bounce animation -->
				{#if showLogo}
					<div
						in:scale={{ 
							duration: 800, 
							easing: elasticOut,
							start: 0.3 
						}}
					>
						<img
							src="/nsu-logo-small.png"
							alt="Playground Logo"
							class="mx-auto mb-8 w-36 drop-shadow-2xl"
							aria-hidden="true"
						/>
					</div>
				{/if}

				<!-- Title with slide animation -->
				{#if showTitle}
					<div
						in:fly={{ 
							y: 50, 
							duration: 600, 
							easing: quintOut 
						}}
					>
						<h1
							class="text-4xl font-bold text-white sm:text-5xl drop-shadow-lg"
							aria-label="Welcome to Playground Slot Booking"
						>
							Welcome to Playground Slot Booking
						</h1>
					</div>
				{/if}

				<!-- Description with fade animation -->
				{#if showDescription}
					<div
						in:fly={{ 
							y: 30, 
							duration: 600, 
							delay: 100,
							easing: quintOut 
						}}
					>
						<p
							class="text-lg text-white opacity-90 sm:text-xl drop-shadow-md"
							aria-label="Book your slots easily and enjoy a seamless experience"
						>
							Book your slots easily and enjoy a seamless experience.
						</p>
					</div>
				{/if}

				<!-- Get Started Button -->
				{#if showButton}
					<div
						in:scale={{ 
							duration: 500, 
							delay: 200,
							easing: quintOut,
							start: 0.8
						}}
					>
						<button
							class="group relative overflow-hidden rounded-full bg-white bg-opacity-90 px-8 py-4 font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-opacity-100 hover:shadow-2xl active:scale-95"
							on:click={handleGetStarted}
							aria-label="Get started with Playground Slot Booking"
						>
							<span class="relative z-10">Get Started</span>
							<!-- Hover effect overlay -->
							<div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
						</button>
					</div>
				{/if}
			</div>

		{:else}
			<!-- Sign In Form Screen -->
			<div 
				class="w-full space-y-6"
				in:fly={{ x: 300, duration: 500, easing: quintOut }}
			>
				<!-- Back Button -->
				<div class="flex justify-start mb-4">
					<button
						on:click={handleBackToMain}
						class="flex items-center space-x-2 text-white opacity-70 hover:opacity-100 transition-opacity duration-200"
						in:fade={{ delay: 200 }}
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
						</svg>
						<span>Back</span>
					</button>
				</div>

				<!-- Sign In Form Container -->
				<div 
					class=" bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border-opacity-20 shadow-2xl"
					in:scale={{ duration: 400, delay: 100, easing: quintOut }}
				>
					<!-- Form Title -->
					<div
						in:fade={{ delay: 300 }}
					>
						<h2 class="text-2xl font-bold text-white mb-6 text-center">Sign In to Continue</h2>
					</div>

					<!-- Loading State -->
					{#if isSigningIn}
						<div 
							class="flex flex-col items-center space-y-4"
							in:scale={{ duration: 10 }}
						>
							<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
							<p class="text-white opacity-80">Signing you in...</p>
						</div>
					{:else}
						<!-- Sign In Form -->
						<div
							in:fade={{ delay: 400 }}
							class="space-y-4"
						>
							<!-- Hidden form that uses your auth action -->
							<form 
								bind:this={signInForm}
								method="POST" 
								action="/signin"
								use:enhance={() => {
									isSigningIn = true;
									return async ({ result }) => {
										if (result.type === 'redirect') {
											// Handle successful sign-in redirect
											window.location.href = result.location;
										} else {
											// Handle error
											isSigningIn = false;
										}
									};
								}}
								class="hidden"
							>
								<input type="hidden" name="providerId" value="google" />
								<input type="hidden" name="redirectTo" value={page.data.redirectTo || '/post-signin-role'} />
							</form>

							<!-- Visible Google Sign In Button -->
							<button
								type="button"
								on:click={handleGoogleSignIn}
								disabled={isSigningIn}
								class="w-full group relative overflow-hidden rounded-xl bg-white bg-opacity-90 px-6 py-4 font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-opacity-100 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
								aria-label="Sign in with Google"
							>
								<span class="relative z-10 flex items-center justify-center space-x-3">
									<svg class="w-5 h-5" viewBox="0 0 24 24">
										<path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
										<path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
										<path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
										<path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
									</svg>
									<span>Continue with Google</span>
								</span>
								<!-- Hover effect -->
								<div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 transition-opacity duration-300 group-hover:opacity-10 rounded-xl"></div>
							</button>

							<!-- Additional Info -->
							<p class="text-center text-white opacity-60 text-sm mt-4">
								By signing in, you agree to our terms of service
							</p>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</main>

	<!-- Floating Elements for Visual Interest -->
	{#if mounted}
		<div class="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-5 rounded-full blur-xl" 
			 in:scale={{ duration: 2000, delay: 1000 }}></div>
		<div class="absolute bottom-20 right-10 w-32 h-32 bg-blue-400 bg-opacity-10 rounded-full blur-2xl" 
			 in:scale={{ duration: 2500, delay: 1200 }}></div>
		<div class="absolute top-1/2 right-20 w-16 h-16 bg-purple-400 bg-opacity-10 rounded-full blur-xl" 
			 in:scale={{ duration: 2200, delay: 1400 }}></div>
	{/if}
</div>

<style>
	/* Custom animations */
	@keyframes float {
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-10px); }
	}
	
	/* .float {
		animation: float 3s ease-in-out infinite;
	} */
	
	/* Smooth transitions for all interactive elements */
	* {
		transition-property: transform, opacity, background-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}
	
	/* Backdrop blur support */
	@supports (backdrop-filter: blur(10px)) {
		.backdrop-blur-md {
			backdrop-filter: blur(12px);
		}
	}
</style>