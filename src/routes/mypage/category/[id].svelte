<script context="module">
	export async function load({ params }) {
		const id = params.id;
		return {
			props: {
				id
			}
		};
	}
</script>

<script lang="ts">
	import Button from '$lib/button/Button.svelte';
	import { MissionModelFactory } from '$model/mission';
	import type { MissionModel } from '$model/mission';
	import { user } from '$modules/store/store';
	import { doc, onSnapshot } from 'firebase/firestore';
	import { db } from '$modules/firebase/firebase';
	import { onDestroy } from 'svelte';
	import { CategoryModel } from '$model/category';
	let missions: MissionModel[] = [];

	export let id;
	let category = {} as CategoryModel;

	const unsub = onSnapshot(doc(db, 'categories', id), (doc) => {
		category = new CategoryModel({ id: doc.id, ...doc.data() } as CategoryModel);
	});

	user.subscribe(async (user) => {
		if (user.uid) {
			missions = await MissionModelFactory.getFromUid(user.uid);
		}
	});

	onDestroy(() => {
		unsub();
	});
</script>

<div class="container mx-auto mt-20">
	<div>
		{category.name}<br />
		Lv{category.level}<br />
		{category.nowExp}/{category.nextExp}exp
	</div>
	<div class="mt-5">
		{#each missions as mission}
			<div class="p-5 border rounded-full">
				<div>{mission.title}</div>
				{#if mission.nextStep}
					{#if mission.steps.length > 1 || mission.nextStep.quantity > 1}
						{mission.progress}/{mission.nextStep.quantity}
					{/if}
					<Button
						className="mt-2"
						on:click={() => {
							mission.increaseProgress();
							missions = missions;
						}}>進捗をすすめる</Button
					>
				{:else}
					完了
				{/if}
			</div>
		{/each}
	</div>
</div>
