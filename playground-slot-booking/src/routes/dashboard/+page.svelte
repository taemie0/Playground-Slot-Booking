<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import Confirmation from '../../components/confirmation.svelte';
	import TableSection from '../../components/TableSection.svelte';
	import TestConfirmation from '../../components/test_confirmation.svelte';

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
	let selectedCell = $state({});

	let activeDay = $state<'today' | 'tomorrow'>('tomorrow');

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

	// console.log('Booking Data:', bookingData);
	// console.log('Time Slots:', timeSlotsList);

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

	// Toggle function (no typos)
	function toggleDay(day: 'today' | 'tomorrow') {
		activeDay = day;
	}
</script>

<div class="space-y-6">
	<!-- Day Toggle Section -->
	<div
		class="flex items-center justify-center gap-6 mt-4"
	>
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

	<!-- Booking Status Alert -->
	{#if activeDay === 'today'}
		<div
			class="alert alert-info animate-fade-in flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-700"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 flex-shrink-0"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>Today's bookings are locked. You can only view the schedule.</span>
		</div>
	{:else}
		<div
			class="alert alert-success animate-fade-in flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 flex-shrink-0"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>Tomorrow's slots are available for booking. Click on available slots to book.</span>
		</div>
	{/if}

	<!-- Booking Table Container -->
	<div class="relative overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
		<div class="overflow-x-auto">
			<table class="table w-full border-collapse bg-white">
				<tbody>
					<TableSection
						title="Indoor Games"
						games={bookingData.indoorGames}
						timeSlots={timeSlotsList}
						onBook={handleBook}
						{hoveredCell}
						{setHoveredCell}
						enableHover={activeDay === 'tomorrow'}
					/>
				</tbody>

				<!-- Divider -->
				<tbody>
					<tr class="bg-gray-50">
						<td colspan="100" class="h-4 border-0"></td>
					</tr>
				</tbody>

				<tbody>
					<TableSection
						title="Outdoor Games"
						games={bookingData.outdoorGames}
						timeSlots={timeSlotsList}
						onBook={handleBook}
						{hoveredCell}
						{setHoveredCell}
						enableHover={activeDay === 'tomorrow'}
					/>
				</tbody>
			</table>
		</div>

		<!-- Removed the overlay that was blocking the view for today's schedule -->
	</div>
</div>

<!-- <Confirmation bind:showModal bind:selectedCell date={bookingData.date} studentEmail={data.session.user.email} studentName={data.session.user.name} token={data.session.fullToken}/> -->

<TestConfirmation
	bind:showModal
	bind:selectedCell
	date={bookingData.date}
	studentEmail={data.session.user.email}
	token={data.session.fullToken}
/>
