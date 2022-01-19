<script lang="ts">
	import Modal from '$lib/modal/Modal.svelte';
	import Input from '$lib/forms/Input.svelte';
	import Button from '$lib/button/Button.svelte';
	export let open = false;
	let name = '';
	import { db } from '$modules/firebase/firebase';
	import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
	import { createEventDispatcher } from 'svelte';
	import { user } from '$modules/store/store';

	const dispatch = createEventDispatcher();
	let uid;

	user.subscribe((user) => {
		uid = user.uid;
	});

	const createTag = async () => {
		await addDoc(collection(db, 'categories'), {
			name,
			uid,
			created: serverTimestamp(),
			modified: serverTimestamp()
		});
		open = false;
		name = '';
		dispatch('complete');
	};
</script>

<Modal bind:open on:ok={createTag} hideOk hideCancel title="カテゴリー追加">
	<Input bind:value={name} label="カテゴリー名" />
	<Button className="mt-3" disabled={!name} on:click={createTag}>追加</Button>
</Modal>
