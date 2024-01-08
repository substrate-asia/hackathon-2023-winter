<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	import type { AnalysisResponse } from '$lib/typing';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import IssuesDisplay from '$lib/custom_components/issues_display.svelte';
	import { ANALYSIS_RESPONSE, ID_SELECTED_ISSUE } from '$lib/stores';

	let analysis_response: AnalysisResponse | null = null; //debug_res;

	//ANALYSIS_RESPONSE.subscribe((new_val) => analysis_response = new_val);

	$: contract_link = ''; //'https://owasp.org/www-project-smart-contract-top-10/';

	$: selected_id = 0;
	ID_SELECTED_ISSUE.subscribe((new_val) => (selected_id = new_val));

	$: is_loading = false;

	async function onSubmitFile() {}

	async function onSubmitLink() {
		ID_SELECTED_ISSUE.set(0);
		analysis_response = null;
		//ANALYSIS_RESPONSE.set(null);

		if (contract_link == '') {
			return;
		}

		is_loading = true;

		try {
			let res = await fetch(`api/analyze?contracturl=${contract_link}`);
			analysis_response = await res.json();
		} catch (e) {
			console.log(e);
		}

		is_loading = false;
	}

	function useSample() {
		contract_link = window.location.href + 'samples/contract.html';
	}
</script>

<div class="h-screen font-mono flex">
	<div
		class="flex max-w-4xl m-auto border-2 border-primary-background rounded-xl p-8 grid grid-flow-row gap-8 w-xl"
	>
		<div class="grid grid-cols-2 gap-32">
			<div>
				<!--
				<p>Load contract from Disk</p>
				<form
					class="flex w-full max-w-sm items-center space-x-2"
					on:submit|preventDefault={onSubmitFile}
				>
					<Input
						id="contract_to_analyze_file"
						type="file"
					/>
					<Button type="submit" >Analyze</Button>
				</form>
			-->
			</div>

			<div class=" justify-end">
				<p>Load contract from URL</p>
				<form
					class="flex w-full max-w-sm items-center space-x-2"
					on:submit|preventDefault={onSubmitLink}
				>
					<Input
						bind:value={contract_link}
						id="contract_to_analyze"
						type="url"
						placeholder="Link to contract"
					/>
					<Button type="submit">Analyze</Button>
					<Button on:click={useSample}>Sample</Button>
				</form>
			</div>
		</div>

		<Separator />

		{#if analysis_response}
			<div class="flex w-full grid-flow-col gap-8">
				<div class="flex-none">
					<IssuesDisplay {analysis_response} {selected_id} />
				</div>
				<div class="border-r-2"></div>
				<div class="grow">
					<p class="text-muted-foreground pb-2">
						{analysis_response.elements[selected_id].title} - {analysis_response.elements[
							selected_id
						].severity} severity
					</p>

					<p>
						{analysis_response.elements[selected_id].description}
					</p>
				</div>
			</div>
		{:else}
			<div class="flex m-auto">
				{#if is_loading}
					Analyzing...
				{:else}
					Issues will be displayed here
				{/if}
			</div>
		{/if}
	</div>
</div>
