<script lang="ts">
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let title: string;
	export let games: Record<
		string,
		{ [key: string]: { status: string; bookedBy?: string; row: number; col: number } }
	>;
	export let timeSlots: string[];
	export let onBook: (cellData: any) => void;
	export let onForceBook: (cellData: any) => void;
	export let onCancel: (cellData: any) => void;
	export let hoveredCell;
	export let setHoveredCell;
	export let adminMode: 'booking' | 'management';
	export let isScheduleLocked: boolean;
    // export let enableHover = false; 

	//  // Log the received props
    // console.log("AdminTableSection - Received Props:");
    // console.log("  Title:", title);
    // console.log("  Games:", games); // Log the full games object
    // console.log("  TimeSlots:", timeSlots);
    // console.log("  AdminMode:", adminMode);
    // console.log("  IsScheduleLocked:", isScheduleLocked);

    $: rows = Object.entries(games);
    // console.log("AdminTableSection - Calculated Rows:", rows); // Log the rows after Object.entries


	function getCellStatus(slot: any) {
		if (slot.status === 'Available') return 'available';
		if (slot.status?.includes('You')) return 'your-booking';
		return 'booked';
	}



	function getCellColor(slot: any) {
		const status = getCellStatus(slot);
		switch (status) {
			case 'available':
				return 'hover:bg-green-200';
			case 'your-booking':
				return 'bg-blue-100 hover:bg-blue-200 border-blue-300';
			case 'booked':
				return 'bg-red-100 hover:bg-red-200';
			default:
				return 'bg-gray-100 hover:bg-gray-200 border-gray-300';
		}
	}

	function handleCellClick(gameName: string, slot: any, row: number, col: number, indexStr: string, event: MouseEvent) {
		const cellData = {
			gameName,
			timeSlot: timeSlots[parseInt(indexStr) - 1],
			row: slot.row,
			column: slot.col,
			currentStatus: slot.status,
			bookedBy: slot.bookedBy
		};

		if (adminMode === 'management') {
			// In management mode, handle different actions based on current status
			if (slot.status === 'Available') {
				onBook(cellData);
			} else {
				// Show context menu or direct action
				if (event.ctrlKey || event.metaKey) {
					onForceBook(cellData);
				} else {
					onCancel(cellData);
				}
			}
		} else {
			// In booking mode, normal booking behavior with admin privileges
			if (slot.status === 'Available') {
				onBook(cellData);
			} else if (event.shiftKey) {
				onForceBook(cellData);
			}
		}
	}

	function getButtonText(slot: any, isHovered: boolean) {
		if (!isHovered) {
			return slot.status;
		}

		const status = getCellStatus(slot);
		if (adminMode === 'management') {
			switch (status) {
				case 'available':
					return 'Book Slot';
				case 'booked':
				case 'your-booking':
					return 'Cancel';
				default:
					return 'Manage';
			}
		} else {
			switch (status) {
				case 'available':
					return 'Book Now';
				case 'booked':
					return 'View/Cancel';
				case 'your-booking':
					return 'Your Booking';
				default:
					return 'Book';
			}
		}
	}

	function getHoverHint(slot: any) {
		const isAvailable = slot.status === 'Available';
		if (adminMode === 'management') {
			return isAvailable ? 'Click to book | Ctrl+Click to toggle' : 'Click to cancel | Ctrl+Click to toggle';
		} else {
			return isAvailable ? 'Click to book' : 'Click to view | Shift+Click to force book';
		}
	}
</script>

<!-- Table Header -->
<tr class="border bg-gradient-to-r from-purple-600 to-indigo-600">
	<td
		colspan={timeSlots.length + 1}
		class="border p-4 text-center text-xl font-bold uppercase tracking-wider text-white"
		in:fly={{ x: -50, duration: 600 }}
	>
		<div class="flex items-center justify-center gap-3">
			<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
				<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
			</svg>
			{title}
			{#if adminMode === 'management'}
				<span class="text-sm bg-white/20 px-2 py-1 rounded-full">Management Mode</span>
			{/if}
		</div>
	</td>
</tr>

<!-- Time Slots Header -->
<tr class="bg-gray-800 text-white">
	<th class="border p-3 font-semibold">Game / Court</th>
	{#each timeSlots as time, i}
		<th class="border p-3 font-semibold text-center min-w-[120px]"
			in:fly={{ y: -20, duration: 400, delay: i * 50 }}>
			{time}
		</th>
	{/each}
</tr>

<!-- Game Rows -->
{#each rows as [gameName, slots], rowIndex}
	{#if Object.keys(slots).length > 0}
		<tr class="border hover:bg-gray-50 transition-colors duration-200">
			<td class="border p-2 font-bold text-gray-800 bg-gray-50 sticky left-0 z-10"
				in:fly={{ x: -30, duration: 500, delay: rowIndex * 100 }}>
				<div class="flex items-center gap-2">
					<svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					{gameName}
				</div>
			</td>

			{#each Object.entries(slots) as [indexStr, slot], colIndex}
				<td class="border p-0">
					<button
						class="btn btn-ghost btn-accent h-full w-full p-3 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 focus:scale-105 {getCellColor(slot)}"
						onclick={(e) => handleCellClick(gameName, slot, rowIndex+1, colIndex+1, indexStr, e)}
						onmouseover={() => setHoveredCell(`${gameName}-${indexStr}`)}
						onmouseout={() => setHoveredCell(null)}
						onfocus={() => setHoveredCell(`${gameName}-${indexStr}`)}
						onblur={() => setHoveredCell(null)}
						disabled={isScheduleLocked && adminMode !== 'management'}
						in:scale={{ duration: 300, delay: (rowIndex * Object.keys(slots).length + colIndex) * 50 }}
						title={getHoverHint(slot)}
					>
						<!-- Status Indicator -->
						<div class="absolute top-1 right-1">
							{#if getCellStatus(slot) === 'available'}
								<div class="w-2 h-2 bg-green-500 rounded-full"></div>
							{:else if getCellStatus(slot) === 'your-booking'}
								<div class="w-2 h-2 bg-blue-500 rounded-full"></div>
							{:else}
								<div class="w-2 h-2 bg-red-500 rounded-full"></div>
							{/if}
						</div>

						<!-- Main Content -->
						<div class="text-center">
							{#if hoveredCell === `${gameName}-${indexStr}`}
								<div class="font-semibold text-gray-800"
									 in:scale={{ duration: 150 }}>
									{getButtonText(slot, true)}
								</div>
								{#if adminMode === 'management' && slot.bookedBy}
									<div class="text-xs text-gray-600 mt-1">
										by {slot.bookedBy}
									</div>
								{/if}
							{:else}
								<div class="font-medium {getCellStatus(slot) === 'available' ? 'text-green-700' : 
									getCellStatus(slot) === "your-booking" ? 'text-blue-700' : 'text-red-700'}">
									{slot.status}
								</div>
								<!-- {#if slot.bookedBy && getCellStatus(slot) !== 'available'}
									<div class="text-xs text-gray-600 mt-1 truncate">
										{slot.bookedBy}
									</div>
								{/if} -->
							{/if}
						</div>

						

						<!-- Admin Mode Indicators -->
						{#if adminMode === 'management'}
							<div class="absolute bottom-1 left-1">
								<svg class="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path>
								</svg>
							</div>
						{/if}

						<!-- Force Booking Indicator -->
						{#if getCellStatus(slot) === 'booked' && adminMode === 'booking'}
							<div class="absolute bottom-1 right-1">
								<svg class="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd"></path>
								</svg>
							</div>
						{/if}
					</button>
				</td>
			{/each}
		</tr>
	{/if}
{/each}

<!-- Legend Row -->
<!-- <tr class="bg-gray-50">
	<td colspan={timeSlots.length + 1} class="p-4">
		<div class="flex flex-wrap items-center justify-center gap-6 text-sm">
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-green-500 rounded-full"></div>
				<span class="text-gray-700">Available</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-red-500 rounded-full"></div>
				<span class="text-gray-700">Booked</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-blue-500 rounded-full"></div>
				<span class="text-gray-700">Your Booking</span>
			</div>
			{#if adminMode === 'booking'}
				<div class="flex items-center gap-2">
					<svg class="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd"></path>
					</svg>
					<span class="text-gray-700">Force Book (Shift+Click)</span>
				</div>
			{/if}
		</div>
	</td>
</tr> -->