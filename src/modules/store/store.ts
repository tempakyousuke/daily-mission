import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const user: Writable<{ uid: string; name: string }> = writable({
	uid: '',
	name: ''
});
