<script lang="ts">
	import * as yup from 'yup';
	import Input from '$lib/forms/Input.svelte';
	import Textarea from '$lib/forms/Textarea.svelte';
	import Select from '$lib/forms/Select.svelte';
	import Button from '$lib/button/Button.svelte';
	import { user } from '$modules/store/store';
	import { db } from '$modules/firebase/firebase';
	import { addDoc, collection } from 'firebase/firestore';
	import { goto } from '$app/navigation';

	let uid: string;

	let values = {
		title: '',
		detail: '',
		point: '',
		type: 'dayly'
	};

	let errors = {
		title: '',
		detail: '',
		point: ''
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
		detail: yup.string(),
		point: yup
			.number()
			.nullable()
			.required('経験値は必須です')
			.positive('正の値を入力してください')
			.integer('整数値を入力してください')
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
				addMission();
			})
			.catch((err) => {
				err.inner.forEach((error) => {
					errors[error.path] = error.message;
				});
			});
	};

	const addMission = async () => {
		await addDoc(collection(db, 'missions'), values);
		goto('/mypage');
	};
</script>

<div class="min-w-md flex justify-center items-center self-center pt-20">
	<div class="flex flex-col px-4 py-6 bg-white rounded-lg shadow-md w-full max-w-md">
		<h1>新規登録</h1>
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
			<Input
				bind:value={values.point}
				type="number"
				label="ポイント"
				className="mt-6"
				error={errors.point}
				on:input={() => validate('point')}
			/>
			<Select bind:value={values.type} options={typeOptions} className="mt-5" />
			<Button block className="mt-5" on:click={submit}>登録</Button>
		</form>
	</div>
</div>
