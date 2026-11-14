'use client'
import * as React from 'react';
import { useEffect } from 'react';
import { useSceneView, usePrefetch, useInvalidate } from 'navigation-react';

const Edit = ({id, name, updateName}) => {
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
    </form>
  )
}

export default Edit;
