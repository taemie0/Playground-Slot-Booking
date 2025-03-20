<script>
	import { onMount } from 'svelte';
	const apiUrl = "https://script.google.com/macros/s/AKfycbx69PxpZfQkUYubTGHj5kFX1gtzvkkt7tZ8MBMnJ6NfUuzD4UNvbM_mYTaTjtfovGKk/exec";

	let { showModal = $bindable(), userToken=$bindable(), selectedCell, date } = $props();

	function closeModal() {
		showModal = false;
        userToken = '';
		selectedCell = '';
	}

	async function bookSlot() {
		if (!userToken) {
			alert('You must log in first!'); // Ensure the user is logged in
			return;
		}

		if (!selectedCell || !selectedCell.row || !selectedCell.column) {
			alert('Invalid selection! Please select a valid slot.');
			return;
		}
        console.log("Book request:");
        console.log(selectedCell);

		// Prepare booking request
		const requestData = {
			token: userToken, // User authentication
			row: selectedCell.row, // Row (game index)
			col: selectedCell.column, // Column (time slot index)
			action: 'bookSlot',
			force: false, // Optional, adjust as needed
		};

		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestData),
			});
			const data = await response.json();

			if (data.success) {
				alert('Slot booked successfully!');
				closeModal();
			} else {
				alert(`Booking failed: ${data.message}`);
			}
		} catch (error) {
			alert('Error booking slot. Please try again.');
			console.error(error);
		}
	}
</script>

<dialog class="modal" class:modal-open={showModal}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Are you sure you want to book this slot?</h3>
		<h4 class="text-lg font-bold">Date: {date}</h4>
		<h4 class="text-lg font-bold">Slot: {selectedCell.gameName}</h4>
		<h4 class="text-lg">Time: {selectedCell.timeSlot}</h4>
		<p class="py-4">Press ESC key or click the button below to close</p>

		<!-- Buttons aligned properly -->
		<div class="modal-action mt-4 flex justify-between">
			<button
				class="btn rounded-lg bg-gray-300 px-4 py-2 text-gray-800 shadow-md transition-all hover:bg-gray-400"
				onclick={closeModal}
			>
				❌ Cancel
			</button>
			<button
				class="btn rounded-lg bg-green-400 px-4 py-2 text-white shadow-md transition-all hover:bg-green-700"
				onclick={bookSlot}
			>
				📅 Book  
			</button>
		</div>
	</div>
</dialog>
