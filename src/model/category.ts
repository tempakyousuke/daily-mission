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

interface Step {
	quantity: number;
	exp: number;
}
export class CategoryModel {
	id: string;
	name: string;
	uid: string;
	exp: number;
	created: Timestamp;
	modified: Timestamp;
	level = 1;
	nowExp: number;
	nextExp = 200;

	constructor(init: Required<CategoryModel>) {
		this.id = init.id;
		this.name = init.name;
		this.uid = init.uid;
		this.exp = init.exp ?? 0;
		this.created = init.created;
		this.modified = init.modified;
		this.nowExp = this.exp;
		this.calcLevel();
	}

	async update(data: any): Promise<void> {
		await updateDoc(doc(db, 'categories', this.id), {
			...data,
			modified: serverTimestamp()
		});
	}

	calcLevel(): void {
		const exp = this.exp;
		while (exp > 0) {
			const newExp = exp - this.nextExp;
			if (newExp > 0) {
				this.nowExp = newExp;
				this.nextExp = this.nextExp + 200;
				this.level++;
			}
		}
	}
}

export const CategoryModelFactory = {
	getFromUid(uid: string): Promise<CategoryModel[]> {
		const q = query(collection(db, 'categories'), where('uid', '==', uid));
		return this.getList(q);
	},
	getList: async (q: Query | null = null): Promise<CategoryModel[]> => {
		const query = q ? q : collection(db, 'categories');
		const snapshot = await getDocs(query);
		const categories: CategoryModel[] = [];
		snapshot.forEach((doc) => {
			const data = doc.data();
			const category = {
				id: doc.id,
				...data
			} as Required<CategoryModel>;
			categories.push(new CategoryModel(category));
		});
		return categories;
	},
	getDoc: async (id: string): Promise<CategoryModel> => {
		const categoryDoc = await getDoc(doc(db, 'categories', id));
		const category = categoryDoc.data();

		const data = {
			id,
			...category
		} as Required<CategoryModel>;
		return new CategoryModel(data);
	}
};
