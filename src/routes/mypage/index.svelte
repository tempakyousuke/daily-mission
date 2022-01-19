<script lang="ts">
	import { user } from '$modules/store/store';
	import { getDocs } from 'firebase/firestore';
	import { query, collection, where } from 'firebase/firestore';
	import { db } from '$modules/firebase/firebase';

	let categories = [];

	user.subscribe(async (user) => {
		if (user.uid) {
			const q = query(collection(db, 'categories'), where('uid', '==', user.uid));
			const snapshot = await getDocs(q);
			const arr = [];
			snapshot.forEach((doc) => {
				arr.push({
					id: doc.id,
					...doc.data()
				});
			});
			categories = arr;
		}
	});
</script>

<a href="/mypage/mission/add">ミッション追加</a>
<div class="mt-5">
	{#each categories as category}
		<a href="/category/{category.id}">{category.name}</a><br />
	{/each}
</div>
