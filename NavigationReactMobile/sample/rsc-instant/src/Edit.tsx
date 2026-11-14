'use client'
import { useEffect } from 'react';
import { FluentLink, useSceneView, usePrefetch, useInvalidate } from 'navigation-react';
import updateName from "./updateName";

const Edit = ({ id, name }: { id: number, name: string }) => {
  const saveName = useSceneView(updateName);
  const prefetch = usePrefetch();
  const invalidate = useInvalidate();
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
      <button type="button" onClick={() => invalidate(false)}>Refetch</button>
      <button type="button" onClick={() => prefetch.navigateBack(1)}>Prefetch Back</button>
      <FluentLink navigate={fluent => fluent.navigate('people', { size: 5 }).navigate('person', { id }).navigate('person', { id: 2 })}>Fluent</FluentLink>
    </form>
  )
}

export default Edit;
