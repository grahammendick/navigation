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

    describe('Navigation Data Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Include Current Data Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    includeCurrentData={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?y=b&z=c&x=a');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Include Current Data Override Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{y: 'a'}}
                    includeCurrentData={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?y=a&z=c');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Current Data Key Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    currentDataKeys="y"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?y=b&x=a');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Current Data Keys Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c', w: 'd'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    currentDataKeys="y,z"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?y=b&z=c&x=a');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Current Data Keys Override Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c', w: 'd'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{y: 'a'}}
                    currentDataKeys="y,z"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?y=a&z=c');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Active Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a');
            assert.equal(link.props['className'], 'active');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Inactive Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 'b'}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=b');
            assert.equal(link.props['className'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Active Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    disableActive={true}
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

    describe('Disable Inactive Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 'b'}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=b');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Null Active Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: null}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a');
            assert.equal(link.props['className'], 'active');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Undefined Active Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: undefined}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a');
            assert.equal(link.props['className'], 'active');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Empty String Inactive Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: ''}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a');
            assert.equal(link.props['className'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Null Disable Active Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: null}}
                    disableActive={true}
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

    describe('Undefined Disable Active Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: undefined}}
                    disableActive={true}
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

    describe('Empty String Disable Inactive Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: ''}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Active Number Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 1}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=1');
            assert.equal(link.props['className'], 'active');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Inactive Number Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 2}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=2');
            assert.equal(link.props['className'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Active Boolean Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: true}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=true');
            assert.equal(link.props['className'], 'active');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Inactive Boolean Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: false}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=false');
            assert.equal(link.props['className'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Active Date Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: new Date(2011, 1, 3)}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=2011-02-03');
            assert.equal(link.props['className'], 'active');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Inactive Date Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: new Date(2010, 1, 3)}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=2010-02-03');
            assert.equal(link.props['className'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Active Number Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 1}}
                    disableActive={true}
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

    describe('Disable Inactive Number Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 2}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=2');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Active Boolean Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: true}}
                    disableActive={true}
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

    describe('Disable Inactive Boolean Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: false}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=false');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Active Date Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: new Date(2011, 1, 3)}}
                    disableActive={true}
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

    describe('Disable Inactive Date Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: new Date(2010, 1, 3)}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=2010-02-03');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Inactive Type Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: '1', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 1}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=1');
            assert.equal(link.props['className'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Inactive Type Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: '1', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: 1}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=1');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Active Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: ['a', 'b']}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a&x=b');
            assert.equal(link.props['className'], 'active');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Inactive Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: ['a', 'd']}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a&x=d');
            assert.equal(link.props['className'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Active Number Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'numberarray'} }
            ]);
            stateNavigator.navigate('s', {x: [1, 2], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: [1, 2]}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=1&x=2');
            assert.equal(link.props['className'], 'active');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Inactive Number Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new Navigation.StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'numberarray'} }
            ]);
            stateNavigator.navigate('s', {x: [1, 2], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationReact.NavigationLink
                    stateKey="s"
                    navigationData={{x: [1, 3]}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationReact.NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=1&x=3');
            assert.equal(link.props['className'], null);
            assert.equal(link.props['children'], 'link text');
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
