<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { fly, scale, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';


	import AdminTableSection from '../../../components/adminTableSection.svelte';
	import AdminConfirmation from '../../../components/adminConfirmation.svelte';

	// import TestConfirmation from '../../components/test_confirmation.svelte';

	let { data } = $props();
	// console.log('Data:', data);
	let sheetData = data.apiData.Data;
	// console.log('Sheet Data:', sheetData);
	// console.log('1 Cell:', sheetData.nextDay.indoorGames['Badminton Court 1']['1']);
	// console.log('Sheet Data:', sheetData.toDay);
	let bookingData = $state({
		date: '',
		timeSlots: [],
		indoorGames: {},
		outdoorGames: {}
	});

	let timeSlotsList = $state([]);
	let showModal = $state(false);
	let selectedCell = $state({ gameName: '', row: 0, column: 0, timeSlot: '', currentStatus: '', bookedBy: '' });
	let activeDay = $state<'today' | 'tomorrow'>('tomorrow');
	let isScheduleLocked = $state(false);
	let adminMode = $state<'booking' | 'management'>('booking'); // 'booking' | 'management'
	let showAdminPanel = $state(false);

	// Admin statistics
	let stats = $state({
		totalSlots: 0,
		availableSlots: 0,
		bookedSlots: 0,
		occupancyRate: 0
	});

	// Update bookingData and timeSlotsList reactively
	$effect(() => {
		if (sheetData) {
			if (activeDay === 'today') {
				bookingData = sheetData.toDay;
				timeSlotsList = sheetData.toDay.timeSlots;
			} else {
				bookingData = sheetData.nextDay;
				timeSlotsList = sheetData.nextDay.timeSlots;
			}
		}
	});
	// // Initialize data from server
	// if (sheetData?.toDay) {
	// 	bookingData = sheetData.nextDay;
	// 	timeSlotsList = sheetData.nextDay.timeSlots;
	// }

	// Async Functions
	function handleAdminBook(cellData: any) {
		selectedCell = { ...cellData, isAdminBooking: true };
		showModal = true;
	}

	function handleForceBook(cellData: any) {
		selectedCell = { ...cellData, isForceBooking: true };
		showModal = true;
	}

	function handleCancelBooking(cellData: any) {
		selectedCell = { ...cellData, isCancellation: true };
		showModal = true;
	}

	async function toggleScheduleLock() {
		isScheduleLocked = !isScheduleLocked;
		// Here you would make an API call to update the schedule lock status
		console.log('Schedule lock toggled:', isScheduleLocked);
	}

	async function clearAllBookings() {
		if (
			confirm(
				'Are you sure you want to clear ALL bookings for this day? This action cannot be undone.'
			)
		) {
			// API call to clear all bookings
			console.log('Clearing all bookings for:', activeDay);
		}
	}

	function handleBook(cellData: any) {
		// Prevent booking if viewing today's schedule
		if (activeDay === 'today') {
			return;
		}
		selectedCell = cellData;
		showModal = true;
	}
	let hoveredCell = $state();
	const setHoveredCell = (value: any) => {
		// Disable hover effects for today's schedule
		if (activeDay === 'today') {
			hoveredCell = null;
			return;
		}
		hoveredCell = value;
	};

	function toggleAdminMode(mode: 'booking' | 'management') {
		adminMode = mode;
	}

	// Toggle function (no typos)
	function toggleDay(day: 'today' | 'tomorrow') {
		activeDay = day;
	}

	async function exportData() {
		try {
			const dataStr = JSON.stringify(bookingData, null, 2);
			const blob = new Blob([dataStr], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `bookings-${activeDay}-${new Date().toISOString()}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error exporting data:', error);
			alert('Failed to export data');
		}
	}

	function calculateStats() {
		// Initialize counters
		let total = 0;
		let available = 0;
		let booked = 0;

		// Safely access games data
		const indoorGames = bookingData?.indoorGames || {};
		const outdoorGames = bookingData?.outdoorGames || {};

		// Helper to process a games object
		const processGames = (games: Record<string, any>) => {
			Object.values(games).forEach((game) => {
				if (typeof game !== 'object' || game === null) return;
				Object.values(game).forEach((slot) => {
					if (typeof slot !== 'object' || slot === null) return;
					total++;
					if (slot.status === 'Available') {
						available++;
					} else if (slot.status === 'Not Available') {
						// Only count as "booked" if it's actually booked (optional)
						// For now, treat "Not Available" as booked (as per your original logic)
						booked++;
					}
					// If you later add statuses like "Blocked", you can handle them separately
				});
			});
		};

		processGames(indoorGames);
		processGames(outdoorGames);

		// Update stats object (ensure it exists)
		stats.totalSlots = total;
		stats.availableSlots = available;
		stats.bookedSlots = booked;
		stats.occupancyRate = total > 0 ? Math.round((booked / total) * 100) : 0;
	}

	// Calculate statistics whenever bookingData changes
	$effect(() => {
		if (bookingData) {
			calculateStats();
		}
	});
</script>

<div class="space-y-2">
	<!-- Admin Header -->
	<div
		class="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white shadow-lg"
		in:fly={{ y: -20, duration: 800, easing: quintOut }}
	>
		<div class="flex items-center justify-between">
			<div>
				<h1 class="flex items-center gap-3 text-3xl font-bold">
					<svg class="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
							clip-rule="evenodd"
						></path>
					</svg>
					Admin Dashboard
				</h1>
				<p class="mt-2 opacity-90">Advanced booking management & system control</p>
			</div>
			<button
				class="btn btn-ghost btn-circle"
				onclick={() => (showAdminPanel = !showAdminPanel)}
				aria-label="Toggle admin panel"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
					></path>
				</svg>
			</button>
		</div>
	</div>
	<!-- Admin Control Panel -->
	{#if showAdminPanel}
		<div
			class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
			in:fly={{ y: -30, duration: 500 }}
			out:fly={{ y: -30, duration: 300 }}
		>
			<div class="border-b bg-gray-50 px-6 py-4">
				<h3 class="text-lg font-semibold text-gray-800">Admin Controls</h3>
			</div>
			<div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-4">
				<button
					class="btn btn-outline btn-primary"
					onclick={() => toggleAdminMode(adminMode === 'booking' ? 'management' : 'booking')}
				>
					{adminMode === 'booking' ? 'Switch to Management' : 'Switch to Booking'}
				</button>
				<button
					class="btn btn-outline {isScheduleLocked ? 'btn-success' : 'btn-warning'}"
					onclick={toggleScheduleLock}
				>
					{isScheduleLocked ? 'Unlock Schedule' : 'Lock Schedule'}
				</button>
				<button class="btn btn-outline btn-error" onclick={() => clearAllBookings()}>
					Clear All Bookings
				</button>
				<button class="btn btn-outline btn-info" onclick={exportData}> Export Data </button>
			</div>
		</div>
	{/if}

	<!-- Statistics Cards -->
	{#if adminMode === 'management'}
	<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
		{#each [{ label: 'Total Slots', value: stats.totalSlots, color: 'bg-blue-500', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2' }, { label: 'Available', value: stats.availableSlots, color: 'bg-green-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }, { label: 'Booked', value: stats.bookedSlots, color: 'bg-orange-500', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }, { label: 'Occupancy', value: `${stats.occupancyRate}%`, color: 'bg-purple-500', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2' }] as stat, i}
			<div
				class="rounded-xl border border-gray-200 bg-white p-4 shadow-md"
				in:fly={{ x: -50, duration: 600, delay: i * 100 }}
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">{stat.label}</p>
						<p class="text-2xl font-bold text-gray-900">{stat.value}</p>
					</div>
					<div class="{stat.color} rounded-lg p-3">
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={stat.icon}
							></path>
						</svg>
					</div>
				</div>
			</div>
		{/each}
	</div>
    {/if}
	<!-- Day Toggle Section -->
	<div class="mt-4 flex items-center justify-center gap-6">
		<!-- Today Button -->
		<button
			class="btn btn-circle btn-outline transition-all duration-300 {activeDay === 'today'
				? 'border-sky-500 bg-sky-500 text-white hover:bg-sky-600'
				: 'hover:border-sky-500 hover:bg-sky-500 hover:text-white'}"
			onclick={() => toggleDay('today')}
			disabled={activeDay === 'today'}
			aria-label="Switch to today's bookings"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<!-- Date Display -->
		<div class="text-center">
			<h2
				class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent"
			>
				{bookingData.date}
			</h2>
			<p class="mt-1 text-sm text-gray-500">
				{#if activeDay === 'today'}
					Today's Schedule (View Only)
				{:else}
					Tomorrow's Schedule (Bookable)
				{/if}
			</p>
		</div>

		<!-- Tomorrow Button -->
		<button
			class="btn btn-circle btn-outline transition-all duration-300 {activeDay === 'tomorrow'
				? 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600'
				: 'hover:border-emerald-500 hover:bg-emerald-500 hover:text-white'}"
			onclick={() => toggleDay('tomorrow')}
			disabled={activeDay === 'tomorrow'}
			aria-label="Switch to tomorrow's bookings"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>

	<!-- Admin Mode Indicator -->
	<div class="flex justify-center">
		<div class="inline-flex rounded-lg border border-gray-300 bg-white p-1">
			<button
				class="rounded-md px-4 py-2 text-sm font-medium transition-all {adminMode === 'booking'
					? 'bg-blue-500 text-white shadow-sm'
					: 'text-gray-500 hover:text-gray-700'}"
				onclick={() => toggleAdminMode('booking')}
			>
				Booking Mode
			</button>
			<button
				class="rounded-md px-4 py-2 text-sm font-medium transition-all {adminMode === 'management'
					? 'bg-purple-500 text-white shadow-sm'
					: 'text-gray-500 hover:text-gray-700'}"
				onclick={() => toggleAdminMode('management')}
			>
				Management Mode
			</button>
		</div>
	</div>


	<!-- Booking Table Container -->
	<div class="relative overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
		<div class="overflow-x-auto">
			<table class="table w-full border-collapse bg-white">
								<!-- Legend Row -->
				<tbody>
					<tr class="bg-gray-50">
						<td colspan={timeSlotsList.length + 1} class="p-4">
							<div class="flex flex-wrap items-center justify-center gap-6 text-sm">
								<div class="flex items-center gap-2">
									<div class="h-3 w-3 rounded-full bg-green-500"></div>
									<span class="text-gray-700">Available</span>
								</div>
								<div class="flex items-center gap-2">
									<div class="h-3 w-3 rounded-full bg-red-500"></div>
									<span class="text-gray-700">Booked</span>
								</div>
								<div class="flex items-center gap-2">
									<div class="h-3 w-3 rounded-full bg-blue-500"></div>
									<span class="text-gray-700">Your Booking</span>
								</div>
								{#if adminMode === 'booking'}
									<div class="flex items-center gap-2">
										<svg class="h-3 w-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
												clip-rule="evenodd"
											></path>
										</svg>
										<span class="text-gray-700">Force Book (Shift+Click)</span>
									</div>
								{/if}
							</div>
						</td>
					</tr>
				</tbody>
				
				<tbody>
					<AdminTableSection
						title="Indoor Games"
						games={bookingData.indoorGames}
						timeSlots={timeSlotsList}
						onBook={handleAdminBook}
						onForceBook={handleForceBook}
						onCancel={handleCancelBooking}
						{hoveredCell}
						{setHoveredCell}
						{adminMode}
						{isScheduleLocked}
					/>
				</tbody>

				<!-- Divider -->
				<tbody>
					<tr class="bg-gray-50">
						<td colspan="100" class="h-4 border-0"></td>
					</tr>
				</tbody>

				<tbody>
					<AdminTableSection
						title="Outdoor Games"
						games={bookingData.outdoorGames}
						timeSlots={timeSlotsList}
						onBook={handleAdminBook}
						onForceBook={handleForceBook}
						onCancel={handleCancelBooking}
						{hoveredCell}
						{setHoveredCell}
						{adminMode}
						{isScheduleLocked}
					/>
				</tbody>

			</table>
		</div>

		<!-- Removed the overlay that was blocking the view for today's schedule -->
	</div>
</div>

<!-- <Confirmation bind:showModal bind:selectedCell date={bookingData.date} studentEmail={data.session.user.email} studentName={data.session.user.name} token={data.session.fullToken}/> -->

<AdminConfirmation
	bind:showModal
	bind:selectedCell
	date={bookingData.date}
	adminEmail={data.session.user.email}
	token={data.session.fullToken}
/>
