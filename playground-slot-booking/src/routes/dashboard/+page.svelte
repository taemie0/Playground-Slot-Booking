<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { Motion } from 'svelte-motion';
	import Confirmation from '../../components/confirmation.svelte';
	import TableSection from '../../components/TableSection.svelte';

	let { data } = $props();
	let sheetData = data.apiData.Data;
	
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
	let isLoaded = $state(false);

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

	onMount(() => {
		isLoaded = true;
	});

	function handleBook(cellData: any) {
		if (activeDay === 'today') return;
		selectedCell = cellData;
		showModal = true;
	}

	let hoveredCell = $state();
	const setHoveredCell = (value: any) => {
		if (activeDay === 'today') {
			hoveredCell = null;
			return;
		}
		hoveredCell = value;
	};

	function toggleDay(day: 'today' | 'tomorrow') {
		activeDay = day;
	}

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1, delayChildren: 0.2 }
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
	};
</script>

<Motion
	let:motion
	initial="hidden"
	animate={isLoaded ? "visible" : "hidden"}
	variants={containerVariants}
>
	<div class="space-y-4 md:space-y-6 px-2 sm:px-4" use:motion>
		<!-- Day Toggle Section -->
		<Motion let:motion variants={itemVariants}>
			<div class="flex items-center justify-center gap-4 sm:gap-6 mt-4 flex-wrap" use:motion>
				<!-- Today Button -->
				<button
					class="btn btn-circle btn-outline transition-all duration-300 transform hover:scale-110 {activeDay === 'today'
						? 'border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/50'
						: 'hover:border-sky-500 hover:bg-sky-500 hover:text-white'}"
					onclick={() => toggleDay('today')}
					disabled={activeDay === 'today'}
					aria-label="Switch to today's bookings"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 sm:h-6 sm:w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
				</button>

				<!-- Date Display -->
				<div class="text-center px-4">
					<h2
						class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl sm:text-2xl md:text-3xl font-bold text-transparent"
					>
						{bookingData.date}
					</h2>
					<p class="mt-1 text-xs sm:text-sm text-gray-500">
						{#if activeDay === 'today'}
							Today's Schedule (View Only)
						{:else}
							Tomorrow's Schedule (Bookable)
						{/if}
					</p>
				</div>

				<!-- Tomorrow Button -->
				<button
					class="btn btn-circle btn-outline transition-all duration-300 transform hover:scale-110 {activeDay === 'tomorrow'
						? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
						: 'hover:border-emerald-500 hover:bg-emerald-500 hover:text-white'}"
					onclick={() => toggleDay('tomorrow')}
					disabled={activeDay === 'tomorrow'}
					aria-label="Switch to tomorrow's bookings"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 sm:h-6 sm:w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		</Motion>

		<!-- Booking Status Alert -->
		<Motion let:motion variants={itemVariants}>
			<div use:motion>
				{#if activeDay === 'today'}
					<div
						class="alert flex items-center gap-3 rounded-xl sm:rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 p-3 sm:p-4 text-blue-700 shadow-md"
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
						<span class="text-sm sm:text-base">Today's bookings are locked. You can only view the schedule.</span>
					</div>
				{:else}
					<div
						class="alert flex items-center gap-3 rounded-xl sm:rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-3 sm:p-4 text-green-700 shadow-md"
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
						<span class="text-sm sm:text-base">Tomorrow's slots are available for booking. Click on available slots to book.</span>
					</div>
				{/if}
			</div>
		</Motion>

		<!-- Booking Table Container -->
		<Motion let:motion variants={itemVariants}>
			<div class="relative overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 shadow-xl bg-white" use:motion>
				<div class="overflow-x-auto">
					<table class="table w-full border-collapse bg-white min-w-full">
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
							<tr class="bg-gradient-to-r from-gray-50 to-gray-100">
								<td colspan="100" class="h-2 sm:h-4 border-0"></td>
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
			</div>
		</Motion>
	</div>
</Motion>

<Confirmation
	bind:showModal
	bind:selectedCell
	date={bookingData.date}
	studentEmail={data.session.user.email}
	token={data.session.fullToken}
/>

<style>
	:global(body) {
		overflow-x: hidden;
	}
</style>