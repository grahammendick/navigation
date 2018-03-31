import React from 'react';
import { NavigationBackLink } from 'navigation-react';
import { connect } from 'react-redux';

var mapStateToProps = (people, { id }) => ({
    person: people.filter((person) => person.id === id)[0]
});

var mapDispatchToProps = (dispatch, {id}) => {
    return {
      handleChange: name => {
        dispatch({
            type: 'EDIT',
            id: id,
            name: name
        })
      }
    }
  }

var Person = ({ person, handleChange }) => (
    <div>
        <NavigationBackLink
            distance={1}>
            Person Search
        </NavigationBackLink>
        <div>
            <h2>
                <input id="name"
                    value={person.name}
                    onChange={(event) => handleChange(event.target.value)} />
            </h2>
            <div className="label">Date of Birth</div>
            <div>{person.dateOfBirth}</div>
            <div className="label">Email</div>
            <div>{person.email}</div>
            <div className="label">Phone</div>
            <div>{person.phone}</div>
        </div>
    </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Person);
