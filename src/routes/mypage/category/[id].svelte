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
	import { MissionModelFactory } from '$model/mission';
	import type { MissionModel } from '$model/mission';
	import { user } from '$modules/store/store';
	import { doc, getDoc, onSnapshot } from 'firebase/firestore';
	import { db } from '$modules/firebase/firebase';
	import { onDestroy } from 'svelte';
	let missions: MissionModel[] = [];

	export let id;
	let category = {};

	const unsub = onSnapshot(doc(db, 'categories', id), (doc) => {
		category = doc.data();
	});

	user.subscribe(async (user) => {
		if (user.uid) {
			missions = await MissionModelFactory.getFromUid(user.uid);
		}
	});

	onDestroy(() => unsub());
</script>

{category?.name}
{category?.exp}
<div class="mt-5">
	{#each missions as mission}
		{mission.title}
	{/each}
</div>
