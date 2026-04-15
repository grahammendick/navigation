'use client'
import { useSceneView } from 'navigation-react';

const Name = ({id, name, updateName}) => {
  const saveName = useSceneView(updateName);
  return (
    <form action={saveName}>
      <input type="hidden" name="id" value={id} />
      <input key={id} type="text" name="name" defaultValue={name} />
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
    </form>
  )
}

export default Name;
