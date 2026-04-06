"use server";

export async function doSomething(formData) {
  const x = `${formData.get('a')} world ${formData.get('b')}`;
  console.log(x, 'xxx')
  return x;
}
