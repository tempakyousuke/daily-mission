import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

initializeApp({
	apiKey: 'AIzaSyAcygNQzoN8TlYPbQkMGkeGK8ymoiYog2M',
	authDomain: 'dayly-mission.firebaseapp.com',
	projectId: 'dayly-mission',
	storageBucket: 'dayly-mission.appspot.com',
	messagingSenderId: '562363683471',
	appId: '1:562363683471:web:07188a0a31dfc5398cd6fa',
	measurementId: 'G-GZF8GQ313V'
});

export const auth = getAuth();
export const db = getFirestore();
