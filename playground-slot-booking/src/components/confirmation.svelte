<script>
	import { onMount } from 'svelte';
	let {
		showModal = $bindable(),
		selectedCell = $bindable(),
		date,
		studentName,
		studentEmail,
		token
	} = $props();
	function closeModal() {
		showModal = false;
		selectedCell = '';
	}

	// let token = localStorage.getItem('token');

	async function handleBooking() {
		try {
			// Extract necessary data from selectedCell
			const { row, column } = selectedCell;

			// console.log('row:', row);
			// console.log('column:', column);
			// console.log('studentName:', studentName);
			// console.log('studentEmail:', studentEmail);
			// console.log('token:', token);

			// Call the server-side API endpoint
			const response = await fetch('/api/book-slot', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					token: token,
					row: row,
					col: column
				})
			});

			// Parse the JSON response
			const result = await response.json();

			// Display the result to the user
			if (response.ok) {
				alert(result.message); // Success message
			} else {
				alert(result.error); // Error message
			}

			// Close the modal after booking
			closeModal();
		} catch (error) {
			console.error('Error during booking:', error);
			alert('An unexpected error occurred while booking the slot.');
		}
	}

	// ScrollBar effect Fix
	let scrollPosition = 0;
	$effect(() => {
		if (showModal) {
			// Save the current scroll position
			scrollPosition = window.scrollY;
			// Fix body position to disable scrolling without layout shifts
			document.body.style.position = 'fixed';
			document.body.style.top = `-${scrollPosition}px`;
			document.body.style.width = '100%';
			document.body.style.overflow = 'hidden';
		} else {
			// Restore body style and scroll position
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.width = '';
			window.scrollTo(0, scrollPosition);
		}
	});
</script>

<dialog class="modal" class:modal-open={showModal}>
	<div class="modal-box">
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

		<!-- Caution Message
		<p class="mb-2 text-sm italic text-red-500">
			⚠️ Once your booking is confirmed, you cannot cancel.
		</p> -->

		<p class="mb-6 text-sm text-gray-500">Press ESC key or click the button below to close</p>
		<div class="modal-action mt-4 flex justify-between">
			<button
				class="btn rounded-lg bg-gray-300 px-4 py-2 text-gray-800 shadow-md transition-all hover:bg-gray-400"
				onclick={closeModal}
			>
				❌ Cancel
			</button>
			<button
				class="btn rounded-lg bg-green-400 px-4 py-2 text-white shadow-md transition-all hover:bg-green-700"
				onclick={handleBooking}
			>
				📅 Book
			</button>
		</div>
	</div>
</dialog>
