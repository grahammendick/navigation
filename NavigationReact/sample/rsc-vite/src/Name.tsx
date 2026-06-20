'use client'
import { useSceneView } from 'navigation-react';
import updateName from "./updateName";

const Name = ({ id, name }: { id: number, name: string }) => {
  const saveName = useSceneView(updateName);
  return (
    <form action={saveName}>
      <input type="hidden" name="id" value={id} />
      <input key={id} type="text" name="name" defaultValue={name} autoFocus />
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
    </form>
  )
}

export default Name;
