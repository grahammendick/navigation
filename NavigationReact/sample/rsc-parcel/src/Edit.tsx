'use client'
import { useEffect } from 'react';
import { useSceneView, usePrefetch } from 'navigation-react';
import updateName from "./updateName";

const Edit = ({ id, name }: { id: number, name: string }) => {
  const saveName = useSceneView(updateName);
  const prefetch = usePrefetch();
  useEffect(() => {
    prefetch.refresh({ id, show: true });
    prefetch.navigateBack(1);
  }, []);
  return (
    <form action={saveName}>
      <input type="hidden" name="id" value={id} />
      <input key={id} type="text" name="name" defaultValue={name} autoFocus />
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
    </form>
  )
}

export default Edit;
