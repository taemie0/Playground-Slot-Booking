<script>
	import { onMount } from 'svelte';
	import Confirmation from '../components/confirmation.svelte';
	// /** @type {import('./$types').PageProps} */
	let { data } = $props();
	let sheetData = data.slots;
	let bookingData = $state({
		date: '',
		timeSlots: [],
		indoorGames: {},
		outdoorGames: {}
	});
	let timeSlotsList = $state(['']);

	// 	async function fetchSlots() {
	// 		const res = await fetch('/page');
	// 		sheetData = await res.json();
	// 		console.log('Loaded Slots:', sheetData);  // ✅ Check API response

	// if (!sheetData || !sheetData.Date || !sheetData.Date.prevDay) {
	//   console.error("Invalid data format received:", data);
	//   return;
	// }

	// 	}

	if (sheetData.Date?.toDay) {
		bookingData = sheetData.Date.toDay;
		timeSlotsList = sheetData.Date.toDay.timeSlots;
	}

	let menuOpen = false;
	let hoveredCell = $state();
	let selectedCell = $state({gameName: '', timeSlot: ''});
	let showModal = $state(false);
    

	

	// onMount(() => {
	// 	fetchSlots();
	// });
</script>

<div class="overflow-x-auto">
	<h2 class="mb-4 text-center text-xl font-bold">
		<span class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-transparent"
			>Bookings for:
		</span>
		{bookingData.date}
	</h2>
	<table class="table w-full border-collapse border border-gray-300">
		<tbody>
			<tr class="border">
				<td
					class="border bg-fuchsia-200 p-4 text-center font-bold text-stone-950"
					colspan={Array.from(timeSlotsList).length + 1}
				>
					Indoor Games
				</td>
			</tr>

			<tr class=" bg-blue-100 text-black">
				<th class="border p-2">Game</th>
				{#each timeSlotsList as time}
					<th class="border p-2">{time}</th>
				{/each}
			</tr>

			{#each Object.entries(bookingData.indoorGames) as [gameName, slots]}
				<tr class="border">
					<td class="border p-0 font-bold">{gameName}</td>
					{#each Object.keys(slots) as index}
						<td class="border p-0">
							<button
								class="btn btn-ghost btn-accent h-full w-full p-2"
								onclick={() => (showModal = true, selectedCell = { gameName, timeSlot: timeSlotsList[index-1] })}
								disabled={slots[index].status === 'Not Available'}
								onmouseover={() => (hoveredCell = `${gameName}-${index}`)}
								onmouseout={() => (hoveredCell = null)}
								onfocus={() => (hoveredCell = `${gameName}-${index}`)}
								onblur={() => (hoveredCell = null)}
							>
								{#if slots[index]}
									{#if hoveredCell === `${gameName}-${index}`}
										Book
									{:else}
										{slots[index].status}
										{#if slots[index].bookedBy}
											({slots[index].bookedBy})
										{/if}
									{/if}
								{:else}
									N/A
								{/if}
							</button>
						</td>
					{/each}
				</tr>
			{/each}

			<tr class="border">
				<td
					class="border bg-fuchsia-200 p-4 text-center font-bold text-stone-950"
					colspan={Array.from(timeSlotsList).length + 1}
				>
					Outdoor Games
				</td>
			</tr>
			<tr class=" bg-blue-100 text-black">
				<th class="border p-2">Game</th>
				{#each timeSlotsList as time}
					<th class="border p-2">{time}</th>
				{/each}
			</tr>
			{#each Object.entries(bookingData.outdoorGames) as [gameName, slots]}
				<tr class="border">
					<td class="border p-0 font-bold">{gameName}</td>
					{#each Object.keys(slots) as index}
						<td class="border p-0">
							<button
								class="btn btn-ghost btn-accent h-full w-full p-2"
								disabled={slots[index].status === 'Not Available'}
							>
								{#if slots[index]}
									{slots[index].status}
									{#if slots[index].bookedBy}
										({slots[index].bookedBy})
									{/if}
								{:else}
									N/A
								{/if}
							</button>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
