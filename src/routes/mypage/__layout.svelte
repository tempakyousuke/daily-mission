<script>
	import { user } from '$modules/store/store';
	import { goto } from '$app/navigation';
	user.subscribe((user) => {
		if (user.uid === '') {
			goto('/');
		}
	});
</script>

<div>
	<slot />
</div>
