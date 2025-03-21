<script lang="ts">
	// export let title;
	// export let games = {};
	// export let timeSlots = [];

	export let title: string;
	export let games: Record<string, any>;
	export let timeSlots: string[];
	export let onBook;
	export let hoveredCell; // Receive from parent
	export let setHoveredCell; // Function to update parent state
	export let enableHover = false; // Toggle hover effects

	// console.log('Timeslots:/n', timeSlots);
	// export let onBook: (game: string, slot: string) => void;

	$: rows = Object.entries(games);
</script>

<!-- table design begins here -->
<tr class="border bg-gray-800">
	<td
		colspan={timeSlots.length + 1}
		class="border bg-gradient-to-r from-sky-500 to-emerald-500 p-4 text-center text-xl font-bold uppercase tracking-wider text-white"
	>
		{title}
	</td>
</tr>

<tr class="bg-gray-800 text-white">
	<th class="border p-2">Game</th>
	{#each timeSlots as time}
		<th class="border p-2">{time}</th>
	{/each}
</tr>

{#each rows as [gameName, slots], rowIndex}
	<tr class="border">
		<td class="border p-2 font-bold">{gameName}</td>

		{#each Object.entries(slots) as [indexStr, slot], colIndex}
			<td class="border p-0">
				<button
					class="btn btn-ghost btn-accent h-full w-full p-2"
					onclick={() =>
						onBook({
							gameName,
							timeSlot: timeSlots[parseInt(indexStr) - 1],
							row: rowIndex + 1,
							column: colIndex + 1
						})}
					disabled={slot.status === 'Not Available'}
					onmouseover={enableHover ? () => setHoveredCell(`${gameName}-${indexStr}`) : undefined}
					onmouseout={enableHover ? () => setHoveredCell(null) : undefined}
					onfocus={enableHover ? () => setHoveredCell(`${gameName}-${indexStr}`) : undefined}
					onblur={enableHover ? () => setHoveredCell(null) : undefined}
				>
					{#if enableHover && hoveredCell === `${gameName}-${indexStr}`}
						<p class="font-bold text-white">Book</p>
					{:else}
						<span>
							{slot.status}
							{#if slot.bookedBy}
								<span>({slot.bookedBy})</span>
							{/if}
						</span>
					{/if}
				</button>
			</td>
		{/each}
	</tr>
{/each}
