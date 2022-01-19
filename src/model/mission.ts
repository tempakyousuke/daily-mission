import type { Timestamp } from 'firebase/firestore';
import { db } from '$modules/firebase/firebase';
import {
	doc,
	getDoc,
	getDocs,
	updateDoc,
	collection,
	serverTimestamp,
	query,
	where,
	deleteDoc
} from 'firebase/firestore';
import type { DocumentReference, DocumentData, Query } from 'firebase/firestore';
import dayjs from 'dayjs';

const today = dayjs().format('YYYY-MM-DD');
const weekStart = dayjs()
	.subtract((dayjs().day() + 1) % 7, 'day')
	.format();

interface Step {
	quantity: number;
	exp: number;
}
export class MissionModel {
	id: string;
	title: string;
	uid: string;
	detail: string;
	steps: Step[];
	type: string;
	category: string;
	created: Timestamp;
	modified: Timestamp;
	lastDay: string;
	lastWeek: string;
	progress: number;

	constructor(init: Required<MissionModel>) {
		this.id = init.id;
		this.title = init.title;
		this.uid = init.uid;
		this.detail = init.detail;
		this.steps = init.steps;
		this.type = init.type;
		this.category = init.category;
		this.created = init.created;
		this.modified = init.modified;
		if (this.type === 'dayly') {
			if (today !== init.lastDay) {
				this.progress = 0;
				this.update({
					lastDay: today,
					progress: 0
				});
				this.lastDay = today;
				this.progress = 0;
			} else {
				this.lastDay = init.lastDay;
				this.progress = init.progress;
			}
		}
		if (this.type === 'weekly') {
			if (weekStart !== init.lastWeek) {
				this.progress = 0;
				this.update({
					lastWeek: weekStart,
					progress: 0
				});
				this.lastDay = today;
				this.progress = 0;
			} else {
				this.lastDay = init.lastDay;
				this.progress = init.progress;
			}
		}
	}

	async update(data: any): Promise<void> {
		await updateDoc(doc(db, 'missions', this.id), {
			...data,
			modified: serverTimestamp()
		});
	}
}

export const MissionModelFactory = {
	getFromUid(uid: string): Promise<MissionModel[]> {
		const q = query(collection(db, 'missions'), where('uid', '==', uid));
		return this.getList(q);
	},
	getList: async (q: Query | null = null): Promise<MissionModel[]> => {
		const query = q ? q : collection(db, 'missions');
		const snapshot = await getDocs(query);
		const missions: MissionModel[] = [];
		snapshot.forEach((doc) => {
			const data = doc.data();
			const mission = {
				id: doc.id,
				...data
			} as Required<MissionModel>;
			missions.push(new MissionModel(mission));
		});
		return missions;
	},
	getDoc: async (id: string): Promise<MissionModel> => {
		const missionDoc = await getDoc(doc(db, 'missions', id));
		const mission = missionDoc.data();

		const data = {
			id,
			...mission
		} as Required<MissionModel>;
		return new MissionModel(data);
	}
};
