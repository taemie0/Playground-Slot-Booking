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
		selectedCell = cellData;
		showModal = true;
	}
	let hoveredCell = $state();
	const setHoveredCell = (value: any) => {
		hoveredCell = value;
	};

	// Toggle function (no typos)
	function toggleDay(day: 'today' | 'tomorrow') {
		activeDay = day;
	}
</script>

<div class="mb-2 flex items-center justify-center gap-4">
	<!-- Left Arrow Icon (Today) -->
	<button
		class="btn btn-circle btn-outline h-8 w-8 hover:bg-sky-500"
		onclick={() => (activeDay = 'today')}
		disabled={activeDay === 'today'}
		aria-label="Switch to today's bookings"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			aria-hidden="true"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
	</button>

	<!-- Date Display -->
	<h2 class="text-xl font-bold">
		<span class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-transparent">
			Bookings for:
		</span>
		{bookingData.date}
	</h2>

	<!-- Right Arrow Icon (Next Day) -->
	<button
		class="btn btn-circle btn-outline h-8 w-8 hover:bg-emerald-500"
		onclick={() => (activeDay = 'tomorrow')}
		disabled={activeDay === 'tomorrow'}
		aria-label="Switch to next day's bookings"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			aria-hidden="true"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
		</svg>
	</button>
</div>
<div class="mb-2 text-center">
	{#if activeDay === 'today'}
		<span class="text-xs text-gray-500">You can only book slots for tomorrow</span>
	{:else}
		<span class="text-xs text-gray-500">Tomorrow</span>
	{/if}
</div>
<div class="overflow-x-auto">
	<!-- <h2 class="mb-4 text-center text-xl font-bold">
		<span class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-transparent">
			Bookings for:
		</span>
		{bookingData.date}
	</h2> -->

	<table class="table w-full border-collapse border border-gray-300">
		<tbody>
			<TableSection
				title="Indoor Games"
				games={bookingData.indoorGames}
				timeSlots={timeSlotsList}
				onBook={handleBook}
				{hoveredCell}
				{setHoveredCell}
				enableHover={true}
			/>
		</tbody>
		<!-- Divider Row -->
		<tbody class="h-4 border-white"> </tbody>

		<tbody>
			<TableSection
				title="Outdoor Games"
				games={bookingData.outdoorGames}
				timeSlots={timeSlotsList}
				onBook={handleBook}
				{hoveredCell}
				{setHoveredCell}
				enableHover={true}
			/>
		</tbody>
	</table>
</div>

<!-- <Confirmation bind:showModal bind:selectedCell date={bookingData.date} studentEmail={data.session.user.email} studentName={data.session.user.name} token={data.session.fullToken}/> -->

<TestConfirmation
	bind:showModal
	bind:selectedCell
	date={bookingData.date}
	studentEmail={data.session.user.email}
	token={data.session.fullToken}
/>
