<script lang="ts">
	import { MissionModelFactory } from '$model/mission';
	import type { MissionModel } from '$model/mission';
	import { user } from '$modules/store/store';
	let missions: MissionModel[] = [];

	user.subscribe(async (user) => {
		if (user.uid) {
			missions = await MissionModelFactory.getFromUid(user.uid);
		}
	});
</script>

<a href="/mypage/mission/add">ミッション追加</a>
{#each missions as mission}
	{mission.title}
{/each}
