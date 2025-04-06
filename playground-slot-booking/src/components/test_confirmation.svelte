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

	// ScrollBar effect Fix
	let scrollPosition = 0;
	$effect(() => {
		if (showModal) {
			const scrollPosition = window.scrollY;
			document.body.style.position = 'fixed';
			document.body.style.top = `-${scrollPosition}px`;
			document.body.style.width = '100%';
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.width = '';
			window.scrollTo(0, scrollPosition);
		}
	});
</script>

<dialog class="modal" class:modal-open={showModal}>
	<div class="modal-box">
		{#if !bookingConfirmed}
			<h3 class="mb-4 text-xl font-bold text-gray-800">Are you sure you want to book this slot?</h3>
			<h4 class="mb-2 text-lg font-semibold text-gray-700">
				Date: <span class="font-normal">{date}</span>
			</h4>
			<h4 class="mb-2 text-lg font-semibold text-gray-700">
				Game Name: <span class="font-normal">{selectedCell.gameName}</span>
			</h4>
			<h4 class="mb-4 text-lg font-semibold text-gray-700">
				Time: <span class="font-normal">{selectedCell.timeSlot}</span>
			</h4>

			<!-- Caution Message -->
			<p class="mb-6 text-sm italic text-red-500">
				⚠️ Once your booking is confirmed, you cannot cancel.
			</p>

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
