<script>
	import { onMount } from 'svelte';
	let { showModal = $bindable(), selectedCell = $bindable(), date } = $props();
	function closeModal() {
		showModal = false;
		selectedCell = '';
	}
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
		<h3 class="text-lg font-bold">Are you sure you want to book this slot?</h3>
		<h4 class="text-lg font-bold">Date: {date}</h4>
		<h4 class="text-lg font-bold">Game Name: {selectedCell.gameName}</h4>
		<h4 class="text-lg">Time: {selectedCell.timeSlot}</h4>
		<p class="py-4">Press ESC key or click the button below to close</p>
		<div class="modal-action mt-4 flex justify-between">
			<button
				class="btn rounded-lg bg-gray-300 px-4 py-2 text-gray-800 shadow-md transition-all hover:bg-gray-400"
				onclick={closeModal}
			>
				❌ Cancel
			</button>
			<button
				class="btn rounded-lg bg-green-400 px-4 py-2 text-white shadow-md transition-all hover:bg-green-700"
			>
				📅 Book
			</button>
		</div>
	</div>


</dialog>


