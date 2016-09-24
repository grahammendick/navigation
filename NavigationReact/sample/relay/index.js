import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Listing from './People.js';
import Details from './Person.js';
import { StateNavigator } from 'Navigation';

/*class Score extends React.Component {
  render() {
    var {initials, score} = this.props.score;
    return (
      <li key={initials}>
        <strong>{initials}</strong> {score}
      </li>
    );
  }
}
Score = Relay.createContainer(Score, {
  fragments: {
    score: () => Relay.QL`
      fragment on Score {
        initials,
        score,
      }
    `,
  },
});

class Game extends React.Component {
  _handleCountChange = (e) => {
    this.props.relay.setVariables({
      numToShow: e.target.value
        ? parseInt(e.target.value, 10)
        : 0,
    });
  }
  _handleSortChange = (e) => {
    this.props.relay.setVariables({
      sortDirection: e.target.value,
    });
  }
  render() {
    var {scores} = this.props.game;
    var {
      numToShow,
      sortDirection,
    } = this.props.relay.variables;
    return (
      <div>
        <h1>High Scores</h1>
        <select
          defaultValue={sortDirection}
          onChange={this._handleSortChange}>
          <option value="asc">Bottom</option>
          <option value="desc">Top</option>
        </select>{' '}
        <input
          onChange={this._handleCountChange}
          min="0"
          style={{width: 44}}
          type="number"
          value={numToShow}
        />
        <ul>
          {scores.map(
            score => <Score score={score} />
          )}
        </ul>
      </div>
    );
  }
}
Game = Relay.createContainer(Game, {
  initialVariables: {
    numToShow: 10,
    sortDirection: 'desc',
  },
  fragments: {
    game: () => Relay.QL`
      fragment on Game {
        scores(
          numToShow: $numToShow,
          sortDirection: $sortDirection
        ) {
          ${Score.getFragment('score')},
        },
      }
    `,
  },
});*/

var stateNavigator = new StateNavigator([
    {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1}},
    {key: 'person', route: 'person/{id}', defaults: {id: 0}, trackCrumbTrail: true}
]);


var Person = Relay.createContainer(Details, {
  fragments: {
    person: () => Relay.QL`
      fragment on Person {
        name,
        dateOfBirth,
        email,
        phone
      }
    `,
  },
});


var People = Relay.createContainer(Listing, {
  fragments: {
    people: () => Relay.QL`
      fragment on People {
        persons {
          id,
          name,
          dateOfBirth
        }
      }
    `,
  },
});

/*class GameHomeRoute extends Relay.Route {
  static routeName = 'Home';
  static queries = {
    game: (Component) => Relay.QL`
      query GameQuery {
        game { ${Component.getFragment('game')} },
      }
    `,
  };
}*/

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

