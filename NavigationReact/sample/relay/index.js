import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import People from './People.js';
import Person from './Person.js';
import { StateNavigator } from 'Navigation';

var stateNavigator = new StateNavigator([
    {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1}},
    {key: 'person', route: 'person/{id}', defaults: {id: 0}, trackCrumbTrail: true}
]);

class PeopleRoute extends Relay.Route {
  static routeName = 'People';
  static queries = {
    people: (Component) => Relay.QL`
      query PeopleQuery {
        people(pageNumber: $pageNumber) { ${Component.getFragment('people')} },
      }
    `,
  };
  static paramDefinitions = {
    pageNumber: {required: true},
  };
}

class PersonRoute extends Relay.Route {
  static routeName = 'Person';
  static queries = {
    person: (Component) => Relay.QL`
      query PersonQuery {
        person(id: $id) { ${Component.getFragment('person')} },
      }
    `,
  };
  static paramDefinitions = {
    id: {required: true},
  };
}

stateNavigator.states.people.navigated = (data) => {
  var peopleRoute = new PeopleRoute({ pageNumber: data.pageNumber });
  ReactDOM.render(
    <Relay.RootContainer
      renderFetched={data =>
          <People {...data} stateNavigator={stateNavigator} />
        }
      Component={People}
      route={peopleRoute}
    />,
    document.getElementById('content')
  );
}

stateNavigator.states.person.navigated = (data) => {
  var personRoute = new PersonRoute({ id: data.id });
  ReactDOM.render(
    <Relay.RootContainer
      renderFetched={data =>
          <Person {...data} stateNavigator={stateNavigator} />
        }
      Component={Person}
      route={personRoute}
    />,
    document.getElementById('content')
  );
}

stateNavigator.start();

