/**
 * @flow
 * @relayHash 43a14c27c959c1bd291714967fb52e25
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type PeopleQueryResponse = {|
  +people: ?{| |};
|};
*/


/*
query PeopleQuery(
  $pageNumber: Int
) {
  people(pageNumber: $pageNumber) {
    ...People_people
  }
}

fragment People_people on People {
  persons {
    id
    name
    dateOfBirth
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "pageNumber",
        "type": "Int",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "PeopleQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "pageNumber",
            "variableName": "pageNumber",
            "type": "Int"
          }
        ],
        "concreteType": "People",
        "name": "people",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "People_people",
            "args": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "PeopleQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "pageNumber",
        "type": "Int",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "PeopleQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "pageNumber",
            "variableName": "pageNumber",
            "type": "Int"
          }
        ],
        "concreteType": "People",
        "name": "people",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Person",
            "name": "persons",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "name",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "dateOfBirth",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query PeopleQuery(\n  $pageNumber: Int\n) {\n  people(pageNumber: $pageNumber) {\n    ...People_people\n  }\n}\n\nfragment People_people on People {\n  persons {\n    id\n    name\n    dateOfBirth\n  }\n}\n"
};

module.exports = batch;
