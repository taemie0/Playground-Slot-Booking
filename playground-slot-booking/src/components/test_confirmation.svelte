<script>
    import { Motion } from 'svelte-motion';
    
    let { showModal = $bindable(), selectedCell = $bindable(), date, studentEmail, token } = $props();
    let emailNotFound = $state(false);
    let bookingConfirmed = $state(false);
    let isLoading = $state(false);

    function closeModal() {
        selectedCell = '';
        bookingConfirmed = false;
        emailNotFound = false;
        showModal = false;
        isLoading = false;
    }

    async function handleBooking() {
        isLoading = true;
        try {
            const { row, column } = selectedCell;

            const response = await fetch('/api/book-slot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({isAdmin: false, token, row, col: column })
            });

            const result = await response.json();

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
        } finally {
            isLoading = false;
        }
    }

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8, y: -50 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { 
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.8, 
            y: 50,
            transition: { duration: 0.2 }
        }
    };

    const successVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: { 
            scale: 1, 
            rotate: 0,
            transition: { 
                type: "spring",
                stiffness: 200,
                damping: 15
            }
        }
    };
</script>

<dialog class="modal modal-bottom sm:modal-middle" class:modal-open={showModal}>
    {#if showModal}
        <Motion
            let:motion
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
        >
            <div class="modal-box max-w-md rounded-2xl bg-white p-4 sm:p-6 shadow-2xl" use:motion>
                {#if !bookingConfirmed}
                    <div class="mb-4 sm:mb-6 text-center">
                        <Motion
                            let:motion
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                        >
                            <div class="mx-auto mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg" use:motion>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </Motion>
                        <h3 class="text-xl sm:text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Confirm Booking</h3>
                        <p class="text-xs sm:text-sm text-gray-500 mt-1">Please review your booking details</p>
                    </div>

                    <div class="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                        <Motion
                            let:motion
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div class="flex justify-between py-2 sm:py-3 border-b border-gray-100 rounded-lg px-3 hover:bg-gray-50 transition-colors" use:motion>
                                <span class="font-medium text-gray-600 text-sm sm:text-base flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Date:
                                </span>
                                <span class="text-gray-800 font-semibold text-sm sm:text-base">{date}</span>
                            </div>
                        </Motion>
                        
                        <Motion
                            let:motion
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div class="flex justify-between py-2 sm:py-3 border-b border-gray-100 rounded-lg px-3 hover:bg-gray-50 transition-colors" use:motion>
                                <span class="font-medium text-gray-600 text-sm sm:text-base flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    Game:
                                </span>
                                <span class="text-gray-800 font-semibold text-sm sm:text-base">{selectedCell.gameName}</span>
                            </div>
                        </Motion>
                        
                        <Motion
                            let:motion
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div class="flex justify-between py-2 sm:py-3 border-b border-gray-100 rounded-lg px-3 hover:bg-gray-50 transition-colors" use:motion>
                                <span class="font-medium text-gray-600 text-sm sm:text-base flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Time:
                                </span>
                                <span class="text-gray-800 font-semibold text-sm sm:text-base">{selectedCell.timeSlot}</span>
                            </div>
                        </Motion>
                    </div>

                    <!-- Caution Message -->
                    <Motion
                        let:motion
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div class="mb-4 sm:mb-6 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 p-3 sm:p-4 border border-red-200 shadow-sm" use:motion>
                            <div class="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                                <div class="ml-3">
                                    <h4 class="text-sm font-semibold text-red-800">Important Notice</h4>
                                    <p class="text-xs sm:text-sm text-red-700 mt-1">Once confirmed, bookings cannot be canceled or modified.</p>
                                </div>
                            </div>
                        </div>
                    </Motion>

                    <div class="modal-action flex justify-between gap-3 mt-4">
                        <button
                            class="flex-1 rounded-lg bg-gray-200 px-4 py-2 sm:py-3 text-gray-800 font-medium shadow-sm hover:bg-gray-300 hover:shadow-md transition-all duration-300 text-sm sm:text-base"
                            onclick={closeModal}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            class="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 sm:py-3 text-white font-medium shadow-md hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center justify-center gap-2"
                            onclick={handleBooking}
                            disabled={isLoading}
                        >
                            {#if isLoading}
                                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Booking...
                            {:else}
                                Confirm Booking
                            {/if}
                        </button>
                    </div>
                {:else}
                    <Motion
                        let:motion
                        initial="hidden"
                        animate="visible"
                        variants={successVariants}
                    >
                        <div class="text-center py-4" use:motion>
                            <div class="mx-auto mb-5 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 sm:h-10 sm:w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            
                            <h3 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Booking Confirmed!</h3>
                            <p class="text-gray-600 mb-1 text-sm sm:text-base">A confirmation email has been sent to</p>
                            <p class="font-semibold text-gray-800 mb-6 text-sm sm:text-base break-all px-4">{studentEmail}</p>
                            
                            <div class="rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 p-4 mb-6 border border-blue-100 shadow-sm">
                                <div class="flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span class="text-xs sm:text-sm text-blue-700">Please check your inbox and spam folder</span>
                                </div>
                            </div>
                            
                            <button
                                class="w-full rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 text-white font-medium shadow-md hover:from-green-700 hover:to-emerald-700 hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                                onclick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </Motion>
                {/if}
            </div>
        </Motion>
    {/if}
    <form method="dialog" class="modal-backdrop bg-black/50 backdrop-blur-sm">
        <button onclick={closeModal}>close</button>
    </form>
</dialog>

<style>
    /* Smooth animations for modal */
    .modal-open {
        animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    /* Mobile optimization */
    @media (max-width: 640px) {
        .modal-box {
            max-height: 90vh;
            overflow-y: auto;
        }
    }
</style>