<script>
	import { onMount } from 'svelte';
	let { showModal = $bindable(), selectedCell = $bindable(), date, studentEmail, token } = $props();
	let emailNotFound = $state(false);
	let bookingConfirmed = $state(false);

	function closeModal() {
		selectedCell = '';
		bookingConfirmed = false;
		emailNotFound = false;
		showModal = false;
	}

	async function handleBooking() {
		try {
			const { row, column } = selectedCell;

			const response = await fetch('/api/book-slot', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, row, col: column })
			});

			const result = await response.json();
			console.log('Booking result:', result);

			if (response.ok) {
				if (result.message === 'Booking Successful ✅') {
					bookingConfirmed = true;
					emailNotFound = false;
				} else {
					alert(result.message);
					closeModal();
				}
			} else {
				if (result.error === 'Email not found') {
					emailNotFound = true;
				} else {
					alert(result.error);
					closeModal();
				}
			}
		} catch (error) {
			console.error('Error during booking:', error);
			alert('An unexpected error occurred.');
		}
	}

	function closeConfirmedModal() {
		closeModal();
	}

	// // ScrollBar effect Fix
	// let scrollPosition = 0;
	// $effect(() => {
	// 	if (showModal) {
	// 		const scrollPosition = window.scrollY;
	// 		document.body.style.position = 'fixed';
	// 		document.body.style.top = `-${scrollPosition}px`;
	// 		document.body.style.width = '100%';
	// 		document.body.style.overflow = 'hidden';
	// 	} else {
	// 		document.body.style.position = '';
	// 		document.body.style.top = '';
	// 		document.body.style.width = '';
	// 		window.scrollTo(0, scrollPosition);
	// 	}
	// });
</script>

<dialog class="modal" class:modal-open={showModal}>
	<div class="modal-box max-w-md rounded-2xl bg-white p-6 shadow-2xl">
		{#if !bookingConfirmed}
			<div class="mb-6 text-center">
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 text-blue-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
				</div>
				<h3 class="text-xl font-bold text-gray-800">Confirm Booking</h3>
				<p class="mt-1 text-sm text-gray-500">Please review your booking details</p>
			</div>

		  <div class="space-y-3 mb-6">
                <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="font-medium text-gray-600">Date:</span>
                    <span class="text-gray-800">{date}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="font-medium text-gray-600">Game:</span>
                    <span class="text-gray-800">{selectedCell.gameName}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="font-medium text-gray-600">Time:</span>
                    <span class="text-gray-800">{selectedCell.timeSlot}</span>
                </div>
            </div>

            <!-- Caution Message -->
            <div class="mb-6 rounded-lg bg-red-50 p-2 border border-red-100">
                <div class="flex mx-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <div class="ml-3">
                        <p class="text-sm text-red-700"> <strong>Notice: </strong> Once confirmed, bookings cannot be canceled or modified.</p>
                    </div>
                </div>
            </div>

			<!-- <p class="mb-6 text-sm text-gray-500">Press ESC key or click the button below to close</p> -->
			<div class="modal-action mt-4 flex justify-between">
				<button
					class="btn rounded-lg bg-gray-300 px-4 py-2 text-gray-800 shadow-md transition-all hover:bg-gray-400"
					onclick={closeModal}
				>
					❌ Close
				</button>
				<button
					class="btn rounded-lg bg-green-400 px-4 py-2 text-white shadow-md transition-all hover:bg-green-700"
					onclick={handleBooking}
				>
					📅 Book
				</button>
			</div>
		{:else}
			<div class="confirmation-container">
				<!-- <div class="email-animation">📧</div> -->
				<div class="mx-auto mb-2 mt-2 w-20">
					<img src="/animations/email.gif" alt="email" />
				</div>
				<h3 class="text-green-600">Booking Confirmed!</h3>
				<p class="text-sm text-gray-600">
					A confirmation email has been sent to<br />
					<strong>{studentEmail}</strong>.<br />
					Please check your inbox (and spam folder).
				</p>
				<button
					class="btn mt-6 rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md transition-all hover:bg-blue-700"
					onclick={closeModal}
				>
					Close
				</button>
			</div>
		{/if}
	</div>
</dialog>

<style>
	.confirmation-container {
		text-align: center;
		animation: fadeIn 0.3s ease-out;
	}

	/* .email-animation {
		font-size: 4rem;
		margin-bottom: 1rem;
		animation: bounce 1s infinite;
	} */

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>