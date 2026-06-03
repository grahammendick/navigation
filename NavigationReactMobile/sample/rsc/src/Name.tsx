'use client'
import { FluentLink, useSceneView } from 'navigation-react';
import updateName from "./updateName";

const Name = ({ id, name }: { id: number, name: string }) => {
  const saveName = useSceneView(updateName);
  return (
    <>
      <FluentLink withContext navigate={fluent => (
        fluent
          .navigate('person', {id: 5})
          .navigate('person', {id: 6})
          .navigate('person', {id: 7})
      )} >Fluent back</FluentLink>
      <form action={saveName}>
        <input type="hidden" name="id" value={id} />
        <input key={id} type="text" name="name" defaultValue={name} autoFocus />
        <button type="submit">Save</button>
        <button type="reset">Reset</button>
      </form>
    </>
  )
}

export default Name;
