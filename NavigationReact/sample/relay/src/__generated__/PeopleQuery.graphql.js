/**
 * @flow
 * @relayHash 450faa00bdbdb5cbcad7afacd527287e
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type People_people$ref = any;
export type PeopleQueryVariables = {|
  pageNumber?: ?number,
|};
export type PeopleQueryResponse = {|
  +people: ?{|
    +$fragmentRefs: People_people$ref,
  |},
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

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "pageNumber",
    "type": "Int",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "pageNumber",
    "variableName": "pageNumber",
    "type": "Int"
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "PeopleQuery",
  "id": null,
  "text": "query PeopleQuery(\n  $pageNumber: Int\n) {\n  people(pageNumber: $pageNumber) {\n    ...People_people\n  }\n}\n\nfragment People_people on People {\n  persons {\n    id\n    name\n    dateOfBirth\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "PeopleQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "people",
        "storageKey": null,
        "args": v1,
        "concreteType": "People",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "People_people",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "PeopleQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "people",
        "storageKey": null,
        "args": v1,
        "concreteType": "People",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "persons",
            "storageKey": null,
            "args": null,
            "concreteType": "Person",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "name",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "dateOfBirth",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
(node/*: any*/).hash = 'c0efdf75db129973d7fbb57dc2b61e22';
module.exports = node;
