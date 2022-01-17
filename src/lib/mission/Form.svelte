<script lang="ts">
	import * as yup from 'yup';
	import Input from '$lib/forms/Input.svelte';
	import Textarea from '$lib/forms/Textarea.svelte';
	import Select from '$lib/forms/Select.svelte';
	import Button from '$lib/button/Button.svelte';
	import { user } from '$modules/store/store';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

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
				dispatch('submit', values);
			})
			.catch((err) => {
				err.inner.forEach((error) => {
					errors[error.path] = error.message;
				});
			});
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
