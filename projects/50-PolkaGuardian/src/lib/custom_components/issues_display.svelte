<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ID_SELECTED_ISSUE } from '$lib/stores';

	import type { AnalysisResponse } from '$lib/typing';

	export let analysis_response: AnalysisResponse;
	export let selected_id: number;
	/*
    $: selected_id = 0;
    ID_SELECTED_ISSUE.subscribe((new_val) => selected_id = new_val);
    */
	function color_from_severity(severity: string): string {
		switch (severity.toLowerCase()) {
			case 'high':
				return 'bg-red-800';
			case 'medium':
				return 'bg-yellow-300';
			default:
				return 'bg-gray-800';
		}
	}
</script>

<div class="">
	<p class="text-md text-muted-foreground pb-8">Issues and Improvements</p>

	<div class="grid grid-flow-rows gap-4">
		{#each analysis_response.elements as elem, id}
			<Button
				on:click={() => ID_SELECTED_ISSUE.set(id)}
				variant={selected_id == id ? 'default' : 'outline'}
			>
				<div class="p-1 {color_from_severity(elem.severity)} rounded-xl m-2"></div>
				{elem.title.length > 20 ? elem.title.slice(0, 17) + '...' : elem.title}
			</Button>
		{/each}
	</div>
</div>
