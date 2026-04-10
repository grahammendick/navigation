'use server'
import { getPerson } from './data';

export default async function updateName(data: FormData, { refetch }: any) {
	const person = await getPerson(+`${data.get('id')}`);
	person.name = `${data.get('name')}`;
	refetch();
}
