'use client'
import { useActionScene } from 'navigation-react';

const Name = ({id, name, updateName}) => {
  const saveName = useActionScene(updateName);
  return (
    <form action={saveName}>
      <input type="hidden" name="id" value={id} />
      <input type="text" name="name" defaultValue={name} />
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
    </form>
  )
}

export default Name;
