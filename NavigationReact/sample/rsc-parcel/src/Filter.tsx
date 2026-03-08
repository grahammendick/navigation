'use client'
import { RefreshLink, useNavigationEvent } from 'navigation-react';
import { doSomething, submitSomething } from './action';

const Filter = () => {
  const { data, stateNavigator } = useNavigationEvent();
  const { name } = data;
  const submitAction = async (formData: FormData) => {
    const data = await submitSomething(formData);
    console.log(data, 'yyy');
  }
  return (
    <div>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" value={name || ''} onChange={({ target: { value } }) => {
          stateNavigator.refresh({ ...data, name: value, page: null });
        }} />
        <button onClick={async () => {
          const data = await doSomething('hello', 2);
          console.log(data, 'xxx');
        }}>Go</button>
        <form action={submitAction}>
          <input type="hidden" name="a" value="goodbye" />
          <input type="hidden" name="b" value="3" />
          <button type="submit">Submit</button>
        </form>
      </div>
      Page size
      <RefreshLink navigationData={{ size: 5, page: null }} includeCurrentData>5</RefreshLink>
      <RefreshLink navigationData={{ size: 10, page: null }} includeCurrentData>10</RefreshLink>
    </div>
  );
}

export default Filter;
