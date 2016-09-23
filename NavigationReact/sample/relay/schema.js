import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

const GAME = {
  scores: [
    {initials: 'SDL', score: 134812},
    {initials: '_TY', score: 897243},
    {initials: 'AAA', score: 348234},
    {initials: '_LK', score: 903244},
    {initials: '_JK', score: 890324},
    {initials: 'GLH', score: 248721},
    {initials: '_JS', score: 257893},
    {initials: 'Y~Z', score: 752323},
    {initials: 'J/D', score: 982354},
    {initials: 'L!B', score: 252432},
    {initials: 'N*S', score: 982523},
    {initials: '*DS', score: 278347},
    {initials: '+AZ', score: 178954},
    {initials: 'FC;', score: 897252},
    {initials: '#BK', score: 547840},
  ],
};

var ScoreType = new GraphQLObjectType({
  name: 'Score',
  fields: () => ({
    initials: {type: GraphQLString},
    score: {type: GraphQLInt},
  }),
});

var GameType = new GraphQLObjectType({
  name: 'Game',
  fields: () => ({
    scores: {
      args: {
        numToShow: {type: GraphQLInt},
        sortDirection: {type: GraphQLString},
      },
      type: new GraphQLList(ScoreType),
      resolve: (game, {numToShow, sortDirection}) => {
        if (numToShow == null) {
          numToShow = game.scores.length;
        }
        var sortMult = sortDirection === 'asc' ? 1 : -1;
        return game.scores
          .sort((a, b) =>
            sortMult * (a.score - b.score)
          )
          .slice(0, numToShow);
      },
    },
  }),
});

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      game: {
        type: GameType,
        resolve: () => GAME,
      },
    }),
  }),
});
