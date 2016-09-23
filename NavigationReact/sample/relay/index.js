import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

class Score extends React.Component {
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
});

class GameHomeRoute extends Relay.Route {
  static routeName = 'Home';
  static queries = {
    game: (Component) => Relay.QL`
      query GameQuery {
        game { ${Component.getFragment('game')} },
      }
    `,
  };
}

ReactDOM.render(
  <Relay.RootContainer
    Component={Game}
    route={new GameHomeRoute()}
  />,
  document.getElementById('content')
);

