<script lang="ts">
	import { user } from '$modules/store/store';
	import { db } from '$modules/firebase/firebase';
	import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import MissionForm from '$lib/mission/Form.svelte';

	let uid: string;

	user.subscribe((user) => {
		uid = user.uid;
	});

	const addMission = async (event) => {
		await addDoc(collection(db, 'missions'), { ...event.detail, created: serverTimestamp(), uid });
		goto('/mypage');
	};
</script>

<div class="min-w-md flex justify-center items-center self-center pt-20">
	<div class="flex flex-col px-4 py-6 bg-white rounded-lg shadow-md w-full max-w-md">
		<h1>新規登録</h1>
		<MissionForm on:submit={addMission} />
	</div>
</div>
