/// <reference path="assert.d.ts" />
/// <reference path="mocha.d.ts" />
/// <reference path="react-addons-test-utils.d.ts" />
import assert = require('assert');
import Navigation = require('../../Navigation/src/Navigation');
import NavigationReact = require('../src/NavigationReact');
import React = require('react');
import ReactTestUtils = require('react-addons-test-utils');

describe('RefreshLinkTest', function () {
    describe('Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.RefreshLink
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.RefreshLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r');
            assert.equal(link.props['children'], 'link text');
        })
    });
});
