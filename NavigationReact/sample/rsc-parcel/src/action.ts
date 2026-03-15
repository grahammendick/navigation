"use server";

export async function doSomething(a: string, b: number, _scene: any) {
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
