/// <reference path="assert.d.ts" />
/// <reference path="mocha.d.ts" />
/// <reference path="../src/react.d.ts" />
import assert = require('assert');
import NavigationReact = require('../src/NavigationReact');
import React = require('react');

describe('NavigationLinkTest', function () {
    describe('<>', function () {
        it('should work', function(){
            var x = <NavigationReact.NavigationLink />;
            assert.notEqual(null, x);
        })
    });  
});
