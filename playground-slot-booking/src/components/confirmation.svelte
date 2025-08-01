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
</script>

<dialog class="modal" class:modal-open={showModal}>
    <div class="modal-box max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {#if !bookingConfirmed}
            <div class="mb-6 text-center">
                <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-800">Confirm Booking</h3>
                <p class="text-sm text-gray-500 mt-1">Please review your booking details</p>
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
            <div class="mb-6 rounded-lg bg-red-50 p-4 border border-red-100">
                <div class="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <div class="ml-3">
                        <h4 class="text-sm font-semibold text-red-800">Important Notice</h4>
                        <p class="text-sm text-red-700 mt-1">Once confirmed, bookings cannot be canceled or modified.</p>
                    </div>
                </div>
            </div>

            <div class="modal-action flex justify-between gap-3">
                <button
                    class="flex-1 rounded-lg bg-gray-200 px-4 py-3 text-gray-800 font-medium shadow-sm hover:bg-gray-300"
                    onclick={closeModal}
                >
                    Cancel
                </button>
                <button
                    class="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-white font-medium shadow-sm hover:bg-blue-700"
                    onclick={handleBooking}
                >
                    Confirm Booking
                </button>
            </div>
        {:else}
            <div class="text-center py-4">
                <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
                <p class="text-gray-600 mb-1">A confirmation email has been sent to</p>
                <p class="font-semibold text-gray-800 mb-6">{studentEmail}</p>
                
                <div class="rounded-lg bg-blue-50 p-4 mb-6">
                    <div class="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span class="text-sm text-blue-700">Please check your inbox and spam folder</span>
                    </div>
                </div>
                
                <button
                    class="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium shadow-sm hover:bg-blue-700"
                    onclick={closeModal}
                >
                    Close
                </button>
            </div>
        {/if}
    </div>
</dialog>