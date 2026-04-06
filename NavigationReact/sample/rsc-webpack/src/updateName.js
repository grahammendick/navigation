'use server'
import { getPerson } from './data.js';

export default async function updateName(data, { refetch }) {
	const person = await getPerson(+`${data.get('id')}`);
	person.name = `${data.get('name')}`;
	refetch();
}
