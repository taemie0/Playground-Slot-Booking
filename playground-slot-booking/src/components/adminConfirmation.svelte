<script lang="ts">
	import { fly, scale, fade } from 'svelte/transition';
	import { quintOut, backOut } from 'svelte/easing';

	export let showModal = false;
	type SelectedCell = {
		row?: number;
		column?: number;
		gameName?: string;
		timeSlot?: string;
		currentStatus?: string;
		bookedBy?: string;
		isForceBooking?: boolean;
		isCancellation?: boolean;
		isAdminBooking?: boolean;
		isToggleAvailability?: boolean;
	};

	export let selectedCell: SelectedCell = {};
	export let date = '';
	export let adminEmail = '';
	export let token = '';

	let isLoading = false;
	let bookingName = '';
	let bookingEmail = '';
	let forceReason = '';
	let showAdvanced = false;

	// Reactive properties based on selectedCell
	$: isForceBooking = selectedCell?.isForceBooking || false;
	$: isCancellation = selectedCell?.isCancellation || false;
	$: isAdminBooking = selectedCell?.isAdminBooking || false;
	$: isToggleAvailability = selectedCell?.isToggleAvailability || false;

	$: headerGradientClass = isCancellation
		? 'from-red-500 to-red-600'
		: isForceBooking
			? 'from-orange-500 to-orange-600'
			: isToggleAvailability
				? 'from-purple-500 to-purple-600'
				: 'from-blue-500 to-blue-600';

	$: modalTitle = getModalTitle();
	$: actionButtonText = getActionButtonText();
	$: actionButtonClass = getActionButtonClass();

	// Determine the toggle button text based on current status when in toggle mode
	$: toggleActionText = selectedCell?.currentStatus === 'Available' 
		? 'Make Unavailable' 
		: selectedCell?.bookedBy 
			? 'Cancel Booking' 
			: 'Make Available';

	$: toggleActionClass = selectedCell?.currentStatus === 'Available' 
		? 'btn-warning' 
		: selectedCell?.bookedBy 
			? 'btn-error' 
			: 'btn-success';

	function getModalTitle() {
		if (isCancellation) return 'Cancel Booking';
		if (isForceBooking) return 'Force Book Slot';
		if (isToggleAvailability) return 'Toggle Slot Availability';
		return 'Admin Booking';
	}

	function getActionButtonText() {
		if (isCancellation) return 'Confirm Cancellation';
		if (isForceBooking) return 'Force Book';
		if (isToggleAvailability) {
			return selectedCell?.currentStatus === 'Available' ? 'Make Unavailable' : 'Make Available';
		}
		return 'Confirm Booking';
	}

	function getActionButtonClass() {
		if (isCancellation) return 'btn-error';
		if (isForceBooking) return 'btn-warning';
		if (isToggleAvailability) {
			return selectedCell?.currentStatus === 'Available' ? 'btn-warning' : 'btn-success';
		}
		return 'btn-primary';
	}

	async function handleConfirm() {
		if (!selectedCell) return;

		// Validation
		if (isForceBooking && !forceReason.trim()) {
			alert('Please provide a reason for force booking');
			return;
		}

		isLoading = true;

		try {
			let endpoint = '/api/book-slot';
			let payload: any = {
				isAdmin: true,
				token: token,
				row: selectedCell.row,
				col: selectedCell.column
			};

			// Determine action type and endpoint
			if (isCancellation) {
				// endpoint = '/api/cancel-booking';
				// payload.action = 'cancel';
			} else if (isToggleAvailability) {
				endpoint = '/api/toggle-slot-availability';
				payload.action = 'toggleAvailability';
				payload.currentStatus = selectedCell.currentStatus;
			} else if (isForceBooking) {
				// endpoint = '/api/force-book';
				// payload.action = 'force-book';
				// payload.forceReason = forceReason;
				// payload.bookingName = bookingName || 'Admin Booking';
				// payload.bookingEmail = bookingEmail || adminEmail;
			} else {
				// Regular admin booking
				// payload.action = 'admin-book';
				// payload.isAdmin = true;
				// payload.bookingName = bookingName || 'Admin Booking';
				// payload.bookingEmail = bookingEmail || adminEmail;
			}

			console.log('Sending request to:', endpoint);
			console.log('Payload:', payload);

			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			const result = await response.json();
			console.log('Response:', result);

			if (response.ok) {
				alert(result.message || 'Operation successful!');
				closeModal();
				// Refresh the page to show updated data
				window.location.reload();
			} else {
				alert(`Error: ${result.message || 'Operation failed'}`);
			}
		} catch (error) {
			console.error('Operation error:', error);
			alert('An error occurred. Please try again.');
		} finally {
			isLoading = false;
		}
	}

	function closeModal() {
		isLoading = false;
		showModal = false;
		// Reset form
		bookingName = '';
		bookingEmail = '';
		forceReason = '';
		showAdvanced = false;
	}

	function handleBackdropClick(event) {
		if (event.target === event.currentTarget && !isLoading) {
			closeModal();
		}
	}

	function resetToMainModal() {
		selectedCell = {
			...selectedCell,
			isToggleAvailability: false,
			isCancellation: false,
			isForceBooking: false,
			isAdminBooking: true
		};
		// Reset form
		bookingName = '';
		bookingEmail = '';
		forceReason = '';
		showAdvanced = false;
	}
</script>

<dialog class="modal" class:modal-open={showModal}>
	<!-- Modal Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
		onclick={handleBackdropClick}
		in:fade={{ duration: 300 }}
		out:fade={{ duration: 200 }}
		role="presentation"
	>
		<!-- Modal Content -->
		<div
			class="mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
			in:scale={{ duration: 400, easing: backOut }}
			out:scale={{ duration: 200 }}
		>
			<!-- Header -->
			<div class="bg-gradient-to-r {headerGradientClass} px-6 py-4">
				<div class="flex items-center justify-between text-white">
					<h3 class="flex items-center gap-3 text-xl font-bold">
						{#if isCancellation}
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m0 6h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
								></path>
							</svg>
						{:else if isForceBooking}
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
								></path>
							</svg>
						{:else if isToggleAvailability}
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
								></path>
							</svg>
						{:else}
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								></path>
							</svg>
						{/if}
						{modalTitle}
					</h3>
					<button
						class="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/20"
						onclick={closeModal}
						disabled={isLoading}
						aria-label="Close modal"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</button>
				</div>
			</div>

			<!-- Body -->
			<div class="space-y-4 p-6">
				<!-- Booking Details -->
				<div class="space-y-2 rounded-lg bg-gray-50 p-4">
					<h4 class="font-semibold text-gray-800">Booking Details</h4>
					<div class="grid grid-cols-2 gap-2 text-sm">
						<div><span class="font-medium">Game:</span> {selectedCell.gameName || 'N/A'}</div>
						<div><span class="font-medium">Time:</span> {selectedCell.timeSlot || 'N/A'}</div>
						<div><span class="font-medium">Date:</span> {date}</div>
						<div>
							<span class="font-medium">Status:</span>
							<span
								class="rounded-full px-2 py-1 text-xs {selectedCell.currentStatus === 'Available'
									? 'bg-green-100 text-green-800'
									: 'bg-red-100 text-red-800'}"
							>
								{selectedCell.currentStatus || 'N/A'}
							</span>
						</div>
					</div>
					{#if selectedCell.bookedBy}
						<div class="text-sm">
							<span class="font-medium">Currently booked by:</span>
							<span class="text-orange-600">{selectedCell.bookedBy}</span>
						</div>
					{/if}
				</div>

				<!-- Action-specific forms -->
				{#if isToggleAvailability}
					<div class="rounded-lg border border-purple-200 bg-purple-50 p-4">
						<div class="mb-3 flex items-center gap-3">
							<svg
								class="h-6 w-6 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 9l4-4 4 4m0 6l-4 4-4-4"
								></path>
							</svg>
							<div>
								<p class="font-medium text-purple-800">Toggle Slot Availability</p>
								<p class="text-sm text-purple-600">This will change the slot status</p>
							</div>
						</div>

						<div class="rounded-md border border-purple-100 bg-white p-3">
							<p class="mb-2 text-sm text-gray-700">
								<strong>Current Status:</strong>
								<span
									class="rounded-full px-2 py-1 text-xs {selectedCell?.currentStatus === 'Available'
										? 'bg-green-100 text-green-800'
										: 'bg-red-100 text-red-800'}"
								>
									{selectedCell?.currentStatus || 'Unknown'}
								</span>
							</p>
							<p class="text-sm text-gray-700">
								<strong>New Status:</strong>
								<span
									class="rounded-full px-2 py-1 text-xs {selectedCell?.currentStatus === 'Available'
										? 'bg-red-100 text-red-800'
										: 'bg-green-100 text-green-800'}"
								>
									{selectedCell?.currentStatus === 'Available' ? 'Not Available' : 'Available'}
								</span>
							</p>
						</div>

						<div class="mt-3 text-sm text-purple-700">
							<p><strong>Note:</strong> This action will:</p>
							<ul class="mt-1 list-inside list-disc space-y-1">
								{#if selectedCell?.currentStatus === 'Available'}
									<li>Block this time slot from being booked</li>
									<li>Prevent users from selecting this slot</li>
								{:else}
									<li>Make this time slot available for booking</li>
									<li>Allow users to book this slot</li>
								{/if}
							</ul>
						</div>
					</div>
				{:else if isCancellation}
					<div class="rounded-lg border border-red-200 bg-red-50 p-4">
						<div class="flex items-start gap-3">
							<svg
								class="mt-1 h-6 w-6 flex-shrink-0 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
								></path>
							</svg>
							<div>
								<p class="mb-2 font-semibold text-red-800">Warning: Permanent Action</p>
								<p class="text-sm text-red-700">
									This will permanently cancel the booking and free up the slot.
								</p>
								{#if selectedCell.bookedBy}
									<p class="mt-2 text-sm text-gray-700">
										Cancelling booking for: <strong>{selectedCell.bookedBy}</strong>
									</p>
								{/if}
							</div>
						</div>
					</div>
				{:else}
					<!-- Booking form -->
					<div class="space-y-4">
						{#if isForceBooking}
							<div class="rounded-lg border border-orange-200 bg-orange-50 p-4">
								<div class="mb-3 flex items-start gap-3">
									<svg
										class="mt-1 h-6 w-6 flex-shrink-0 text-orange-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
										></path>
									</svg>
									<div>
										<p class="font-semibold text-orange-800">Force Booking</p>
										<p class="text-sm text-orange-700">This will override the existing booking</p>
									</div>
								</div>
								<div class="form-control">
									<label class="label" for="forceReason">
										<span class="label-text font-medium">Reason for override </span>
									</label>
									<textarea
										id="forceReason"
										class="textarea textarea-bordered w-full"
										placeholder="Enter reason for force booking..."
										bind:value={forceReason}
										rows="3"
									></textarea>
								</div>
							</div>
						{/if}

						<!-- Advanced Options Toggle -->
						<button
							class="btn btn-ghost btn-sm w-full"
							onclick={() => (showAdvanced = !showAdvanced)}
							type="button"
						>
							<svg
								class="mr-2 h-4 w-4 transition-transform {showAdvanced ? 'rotate-180' : ''}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
							Advanced Options
						</button>

						{#if showAdvanced}
							<!-- Booking details form -->
							<div class="grid grid-cols-1 gap-4">
								<div class="form-control">
									<label class="label" for="bookingName">
										<span class="label-text font-medium"
											>Name {isForceBooking ? '*' : '(Optional)'}</span
										>
									</label>
									<input
										id="bookingName"
										type="text"
										class="input input-bordered w-full"
										placeholder="Enter name for booking"
										bind:value={bookingName}
									/>
								</div>

								<div class="form-control">
									<label class="label" for="bookingEmail">
										<span class="label-text font-medium">Email (Optional)</span>
									</label>
									<input
										id="bookingEmail"
										type="email"
										class="input input-bordered w-full"
										placeholder="Enter email"
										bind:value={bookingEmail}
									/>
								</div>
							</div>
							<!-- Additional Options -->
							<div class="space-y-3 rounded-lg bg-gray-50 p-4" in:fly={{ y: -20, duration: 300 }}>
								<div class="form-control">
									<label class="label cursor-pointer">
										<span class="label-text">Send confirmation email</span>
										<input type="checkbox" class="checkbox checkbox-primary" />
									</label>
								</div>
								<div class="form-control">
									<label class="label cursor-pointer">
										<span class="label-text">Add to admin calendar</span>
										<input type="checkbox" class="checkbox checkbox-primary" checked />
									</label>
								</div>
								<div class="form-control">
									<label class="label cursor-pointer">
										<span class="label-text">Allow modifications</span>
										<input type="checkbox" class="checkbox checkbox-primary" checked />
									</label>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div class="bg-gray-50 px-6 py-4">
				{#if isAdminBooking && !isToggleAvailability && !isCancellation && !isForceBooking}
					<!-- Multiple action options for regular admin booking -->
					<div class="space-y-3">
						<div class="text-sm text-gray-600 text-center">Choose an action:</div>
						<div class="flex flex-wrap justify-center gap-2">
							<button class="btn btn-sm btn-primary rounded-lg" onclick={handleConfirm} disabled={isLoading}>
								<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
								Book Slot
							</button>
							<button
								class="btn btn-sm btn-warning"
								onclick={() => {
									selectedCell = {
										...selectedCell,
										isToggleAvailability: true,
										isCancellation: false,
										isForceBooking: false,
										isAdminBooking: false
									};
								}}
								disabled={isLoading}
							>
								<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
									></path>
								</svg>
								Toggle
							</button>
						</div>
						<div class="flex justify-center">
							<button class="btn btn-ghost btn-sm" onclick={closeModal} disabled={isLoading}>
								Close
							</button>
						</div>
					</div>
				{:else if isToggleAvailability}
					<!-- Toggle availability specific action -->
					<div class="flex justify-end gap-3">
						<button class="btn btn-ghost" onclick={resetToMainModal} disabled={isLoading}>
							<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								></path>
							</svg>
							Back
						</button>
						<button
							class="btn {selectedCell?.currentStatus === 'Available' ? 'btn-warning' : 'btn-success'} {isLoading ? 'loading' : ''}"
							onclick={handleConfirm}
							disabled={isLoading}
						>
							{#if isLoading}
								<span class="loading loading-spinner loading-sm"></span>
								Processing...
							{:else}
								<!-- <svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg> -->
								{toggleActionText}
							{/if}
						</button>
					</div>
				{:else}
					<!-- Single action for specific operations -->
					<div class="flex justify-end gap-3">
						<button class="btn btn-ghost" onclick={resetToMainModal} disabled={isLoading}>
							<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								></path>
							</svg>
							Back
						</button>
						<button
							class="btn {actionButtonClass} {isLoading ? 'loading' : ''}"
							onclick={handleConfirm}
							disabled={isLoading || (isForceBooking && !forceReason.trim())}
						>
							{#if isLoading}
								<span class="loading loading-spinner loading-sm"></span>
								Processing...
							{:else}
								<!-- <svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg> -->
								{actionButtonText}
							{/if}
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</dialog>