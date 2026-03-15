"use server";
import { getPerson } from './data';

export async function doSomething(a: string, b: number, { stateNavigator, refetch }: any) {
  // stateNavigator.navigate('person', {id: 1});
  let person = (await getPerson(1));
  person.name = 'Bell Smith';
  refetch(true);
  await new Promise(res => {
    setTimeout(res, 300);
  });
  return `${a} world ${b}`;
}

export async function submitSomething(data: FormData) {
  await new Promise(res => {
    setTimeout(res, 300);
  });
  return `${data.get('a')} moon ${data.get('b')}`;
}

export async function actionSomething(prevState: string, data: FormData) {
  await new Promise(res => {
    setTimeout(res, 300);
  });
  return `${data.get('a')} ${prevState}`;
}
