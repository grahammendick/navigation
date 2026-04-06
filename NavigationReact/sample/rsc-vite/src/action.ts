"use server";
import { getPerson } from '../../rsc-parcel/src/data';

export async function doSomething(a: string, b: number, /*{ stateNavigator, refetch }: any */) {
  // stateNavigator.navigate('person', {id: 1});
  /* await new Promise(res => {
    setTimeout(res, 4000);
  });
  let person = (await getPerson(1));
  person.name = 'Bell Smith';
  refetch(true); */
  return `${a} world ${b}`;
}
