/**
 * @flow
 * @relayHash 6967d18647e14a90b75103dd6374c0cb
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type PersonQueryResponse = {|
  +person: ?{| |};
|};
*/


/*
query PersonQuery(
  $id: Int!
) {
  person(id: $id) {
    ...Person_person
  }
}

fragment Person_person on Person {
  name
  dateOfBirth
  email
  phone
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "id",
        "type": "Int!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "PersonQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "id",
            "variableName": "id",
            "type": "Int"
          }
        ],
        "concreteType": "Person",
        "name": "person",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Person_person",
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
  "name": "PersonQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "id",
        "type": "Int!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "PersonQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "id",
            "variableName": "id",
            "type": "Int"
          }
        ],
        "concreteType": "Person",
        "name": "person",
        "plural": false,
        "selections": [
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
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "email",
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "phone",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query PersonQuery(\n  $id: Int!\n) {\n  person(id: $id) {\n    ...Person_person\n  }\n}\n\nfragment Person_person on Person {\n  name\n  dateOfBirth\n  email\n  phone\n}\n"
};

module.exports = batch;
