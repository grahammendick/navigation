/// <reference path="assert.d.ts" />
/// <reference path="mocha.d.ts" />
/// <reference path="react-addons-test-utils.d.ts" />
import assert = require('assert');
import Navigation = require('../../Navigation/src/Navigation');
import NavigationReact = require('../src/NavigationReact');
import React = require('react');
import ReactTestUtils = require('react-addons-test-utils');

describe('NavigationBackLinkTest', function () {
    describe('Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r0');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Context Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationBackLink
                    distance={1}>
                    link text
                </NavigationReact.NavigationBackLink>,
                { stateNavigator: stateNavigator }
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r0');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Invalid Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationBackLink
                    distance={2}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Attributes Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationBackLink
                    distance={1}
                    lazy={false}
                    historyAction='replace'
                    navigating={() => false}
                    aria-another="z"
                    target="_blank"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r0');
            assert.equal(link.props['children'], 'link text');
            assert.notEqual(link.props['onClick'], null);
            assert.equal(link.props['aria-another'], 'z');
            assert.equal(link.props['target'], '_blank');
            assert.equal(Object.keys(link.props).length, 5);
        })
    });
});
