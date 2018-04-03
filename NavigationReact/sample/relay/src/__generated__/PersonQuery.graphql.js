/**
 * @flow
 * @relayHash f41a8626833fb19c5f9e4859513580a1
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Person_person$ref = any;
export type PersonQueryVariables = {|
  id: number,
|};
export type PersonQueryResponse = {|
  +person: ?{|
    +$fragmentRefs: Person_person$ref,
  |},
|};
*/


/*
query PersonQuery(
  $id: Int!
) {
  person(id: $id) {
    ...Person_person
    id
  }
}

fragment Person_person on Person {
  name
  dateOfBirth
  email
  phone
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "id",
    "type": "Int!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id",
    "type": "Int"
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "PersonQuery",
  "id": null,
  "text": "query PersonQuery(\n  $id: Int!\n) {\n  person(id: $id) {\n    ...Person_person\n    id\n  }\n}\n\nfragment Person_person on Person {\n  name\n  dateOfBirth\n  email\n  phone\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "PersonQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "person",
        "storageKey": null,
        "args": v1,
        "concreteType": "Person",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Person_person",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "PersonQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "person",
        "storageKey": null,
        "args": v1,
        "concreteType": "Person",
        "plural": false,
        "selections": [
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
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "email",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "phone",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  }
};
})();
(node/*: any*/).hash = 'da6e83492141e1ca71180b85c883cfa6';
module.exports = node;
