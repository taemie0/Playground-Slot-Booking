<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import Confirmation from '../../components/confirmation.svelte';
	import TableSection from '../../components/TableSection.svelte';

	let { data } = $props();
	// console.log('Data:', data);
	let sheetData = data.apiData.Data;
	// console.log('Sheet Data:', sheetData);

	let bookingData = $state({
		date: '',
		timeSlots: [],
		indoorGames: {},
		outdoorGames: {}
	});

	let timeSlotsList = $state([]);
	let showModal = $state(false);
	let selectedCell = $state({});

	// Initialize data from server
	if (sheetData?.toDay) {
		bookingData = sheetData.toDay;
		timeSlotsList = sheetData.toDay.timeSlots;
	}

	// console.log('Booking Data:', bookingData);
	// console.log('Time Slots:', timeSlotsList);

	function handleBook(cellData) {
		selectedCell = cellData;
		showModal = true;
	}
	let hoveredCell = $state();
	const setHoveredCell = (value) => {
		hoveredCell = value;
	};


</script>

<div class="overflow-x-auto">
	<h2 class="mb-4 text-center text-xl font-bold">
		<span class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-transparent">
			Bookings for:
		</span>
		{bookingData.date}
	</h2>

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


<Confirmation bind:showModal bind:selectedCell date={bookingData.date} />


