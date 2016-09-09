/// <reference path="assert.d.ts" />
/// <reference path="mocha.d.ts" />
/// <reference path="react-addons-test-utils.d.ts" />
import assert = require('assert');
import Navigation = require('../../Navigation/src/Navigation');
import NavigationReact = require('../src/NavigationReact');
import React = require('react');
import ReactTestUtils = require('react-addons-test-utils');

describe('NavigationLinkTest', function () {
    describe('Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Context Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s">
                    link text
                </NavigationReact.NavigationLink>,
                { stateNavigator: stateNavigator }
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Invalid Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="x"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Attributes Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    includeCurrentData={true}
                    currentDataKeys="y"
                    activeCssClass="active"
                    disableActive={true}
                    lazy={false}
                    historyAction='replace'
                    navigating={() => false}
                    aria-another="z"
                    target="_blank"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a');
            assert.equal(link.props['children'], 'link text');
            assert.notEqual(link.props['onClick'], null);
            assert.equal(link.props['aria-another'], 'z');
            assert.equal(link.props['target'], '_blank');
            assert.equal(Object.keys(link.props).length, 5);
        })
    });

    describe('<>', function () {
        it('should work', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: '' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator} />
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = () => link.props['href'].substring(1);
            link['ref']({ href: 'xxx' });
            link.props['onClick']({ preventDefault: () => {} });
            assert.equal(link.props['href'], '#/');
            assert.equal(stateNavigator.stateContext.state.key, 's');
        })
    });  
});
