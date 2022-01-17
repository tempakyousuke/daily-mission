<script>
	import { user } from '$modules/store/store';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	user.subscribe((user) => {
		if (browser && user.loaded && user.uid === '') {
			goto('/');
		}
	});
</script>

<div>
	<slot />
</div>
