'use server';
import { getPerson } from './data';

export default async function updateName(id: number, name: string, {invalidate}: any) {
  const person = await getPerson(id);
  person.name = name;
  invalidate(true);
}
