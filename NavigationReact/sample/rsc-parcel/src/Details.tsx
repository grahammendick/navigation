import { useNavigationEvent } from 'navigation-react';
import { getPerson } from './data';
import Edit from './Edit';

const Details = async () => {
  const {data: {id}} = useNavigationEvent();
  const {name, dateOfBirth, email, phone} = await getPerson(id);
  return (
    <div>
      <Edit id={id} name={name} />
      <div>Date of Birth</div>
      <div>{dateOfBirth}</div>
      <div>Email</div>
      <div>{email}</div>
      <div>Phone</div>
      <div>{phone}</div>
    </div>
  )
}

export default Details;
