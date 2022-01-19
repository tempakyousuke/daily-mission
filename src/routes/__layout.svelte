<script>
	import 'virtual:windi.css';
	import { auth, db } from '$modules/firebase/firebase';
	import { doc, getDoc } from 'firebase/firestore';
	import { onAuthStateChanged } from 'firebase/auth';
	import { user } from '$modules/store/store';
	onAuthStateChanged(auth, async (firebaseUser) => {
		if (firebaseUser) {
			const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
			const userData = userDoc.data();
			user.set({
				uid: firebaseUser.uid,
				name: userData.name,
				loaded: true
			});
		} else {
			user.set({
				uid: '',
				name: '',
				loaded: true
			});
		}
	});
</script>

<div>
	<slot />
</div>
