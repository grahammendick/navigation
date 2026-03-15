"use server";

export async function doSomething(_sceneAction: any, a: string, b: number) {
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
