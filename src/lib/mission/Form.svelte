<script lang="ts">
	import * as yup from 'yup';
	import Input from '$lib/forms/Input.svelte';
	import Textarea from '$lib/forms/Textarea.svelte';
	import Select from '$lib/forms/Select.svelte';
	import Button from '$lib/button/Button.svelte';
	import { user } from '$modules/store/store';
	import { createEventDispatcher } from 'svelte';
	import CategoryModal from '$lib/category/CategoryModal.svelte';
	import { collection, getDocs } from 'firebase/firestore';
	import { db } from '$modules/firebase/firebase';
	import { browser } from '$app/env';

	const dispatch = createEventDispatcher();

	let openCategory = false;

	let uid: string;
	let categoryOptions = [];

	let values = {
		title: '',
		detail: '',
		steps: [
			{
				quantity: 1,
				exp: 0
			}
		],
		type: 'dayly',
		category: ''
	};

	let errors = {
		title: '',
		detail: '',
		exp: ''
	};

	user.subscribe((user) => {
		uid = user.uid;
	});

	const typeOptions = [
		{ label: 'デイリー', value: 'dayly' },
		{ label: 'ウィークリー', value: 'weekly' }
	];

	const schema = yup.object().shape({
		title: yup.string().required('ミッション名は必須です'),
		detail: yup.string()
	});

	const validate = (path: string) => {
		schema
			.validateAt(path, values)
			.then(() => {
				errors[path] = '';
			})
			.catch((err) => {
				errors[path] = err.message;
			});
	};

	const submit = () => {
		schema
			.validate(values, { abortEarly: false })
			.then(() => {
				dispatch('submit', values);
			})
			.catch((err) => {
				err.inner.forEach((error) => {
					errors[error.path] = error.message;
				});
			});
	};

	const getCategories = async () => {
		if (!browser) {
			return;
		}
		const snapshots = await getDocs(collection(db, 'categories'));
		const categories = [];
		snapshots.forEach((doc) => {
			categories.push({
				label: doc.data().name,
				value: doc.id
			});
		});
		categoryOptions = categories;
	};

	getCategories();

	const addStep = () => {
		values.steps = [
			...values.steps,
			{
				quantity: 0,
				exp: 0
			}
		];
	};
</script>

<form>
	<Input
		bind:value={values.title}
		label="ミッション名"
		className="mt-2"
		error={errors.title}
		on:input={() => validate('title')}
	/>
	<Textarea
		bind:value={values.detail}
		label="詳細"
		className="mt-6"
		error={errors.detail}
		on:input={() => validate('detail')}
	/>
	<div class="border">
		<div class="grid grid-cols-2 px-2">
			{#each values.steps as step}
				<Input
					className="col-span-1 mt-3"
					bind:value={step.quantity}
					type="number"
					label="繰り返し数"
				/>
				<Input className="col-span-1 mt-3" bind:value={step.exp} type="number" label="ポイント" />
			{/each}
		</div>
		<div class="w-6/12 mx-auto my-5">
			<Button block on:click={addStep}>段階を追加</Button>
		</div>
	</div>

	<Select bind:value={values.type} options={typeOptions} className="mt-5" />
	<Select bind:value={values.category} options={categoryOptions} className="mt-5" />
	<div class="flex mt-5">
		<Button
			on:click={() => {
				openCategory = true;
			}}>カテゴリー追加</Button
		>
	</div>
	<Button block className="mt-5" on:click={submit}>登録</Button>
</form>
<CategoryModal bind:open={openCategory} on:complete={getCategories} />
