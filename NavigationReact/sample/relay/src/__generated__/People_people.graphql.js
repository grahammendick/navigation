/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from 'relay-runtime';
declare export opaque type People_people$ref: FragmentReference;
export type People_people = {|
  +persons: ?$ReadOnlyArray<?{|
    +id: ?string,
    +name: ?string,
    +dateOfBirth: ?string,
  |}>,
  +$refType: People_people$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "People_people",
  "type": "People",
  "metadata": null,
  "argumentDefinitions": [],
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
};
(node/*: any*/).hash = '248dd0f4828059bab45d651bfa9b88e1';
module.exports = node;
