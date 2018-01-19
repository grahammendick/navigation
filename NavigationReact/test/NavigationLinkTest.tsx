import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from '../../Navigation/src/Navigation';
import { NavigationLink } from '../src/NavigationReact';
import * as React from 'react';
import * as ReactTestUtils from 'react-addons-test-utils';

describe('NavigationLinkTest', function () {
    describe('Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Context Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s">
                    link text
                </NavigationLink>,
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
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="x"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Attributes Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    includeCurrentData={true}
                    currentDataKeys="y"
                    activeCssClass="active"
                    disableActive={true}
                    acrossCrumbs={false}
                    historyAction='replace'
                    navigating={() => false}
                    aria-label="z"
                    target="_blank"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a');
            assert.equal(link.props['children'], 'link text');
            assert.notEqual(link.props['onClick'], null);
            assert.equal(link.props['aria-label'], 'z');
            assert.equal(link.props['target'], '_blank');
            assert.equal(Object.keys(link.props).length, 5);
        })
    });

    describe('Navigation Data Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Include Current Data Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    includeCurrentData={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?y=b&z=c&x=a');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Include Current Data Override Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{y: 'a'}}
                    includeCurrentData={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?y=a&z=c');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Current Data Key Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    currentDataKeys="y"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?y=b&x=a');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Current Data Keys Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c', w: 'd'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    currentDataKeys="y,z"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?y=b&z=c&x=a');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Current Data Keys Override Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c', w: 'd'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{y: 'a'}}
                    currentDataKeys="y,z"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?y=a&z=c');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Active Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b', z: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', z: 'c'}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a&z=c');
            assert.equal(link.props['className'], 'active');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Inactive Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'b'}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
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
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b', z: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', z: 'c'}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Inactive Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'b'}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=b');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Null Active Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: null}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
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
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: undefined}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
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
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: ''}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
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
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: null}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Undefined Disable Active Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: undefined}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Empty String Disable Inactive Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: ''}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Active Number Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 1}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
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
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 2}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
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
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: true}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
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
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: false}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
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
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: new Date(2011, 1, 3)}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
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
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: new Date(2010, 1, 3)}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
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
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 1}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Inactive Number Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 2}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=2');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Active Boolean Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: true}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Inactive Boolean Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: false}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=false');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Active Date Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: new Date(2011, 1, 3)}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Inactive Date Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: new Date(2010, 1, 3)}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=2010-02-03');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Inactive Type Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: '1', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 1}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
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
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: '1', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 1}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=1');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Active Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: ['a', 'b']}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
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
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: ['a', 'd']}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
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
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'numberarray'} }
            ]);
            stateNavigator.navigate('s', {x: [1, 2], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [1, 2]}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
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
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'numberarray'} }
            ]);
            stateNavigator.navigate('s', {x: [1, 2], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [1, 3]}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=1&x=3');
            assert.equal(link.props['className'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Active Boolean Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'booleanarray'} }
            ]);
            stateNavigator.navigate('s', {x: [true, false], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [true, false]}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=true&x=false');
            assert.equal(link.props['className'], 'active');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Inactive Boolean Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'booleanarray'} }
            ]);
            stateNavigator.navigate('s', {x: [true, false], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [true, true]}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=true&x=true');
            assert.equal(link.props['className'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });


    describe('Active Date Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'datearray'} }
            ]);
            stateNavigator.navigate('s', {x: [new Date(2011, 1, 3), new Date(2012, 2, 4)], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [new Date(2011, 1, 3), new Date(2012, 2, 4)]}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=2011-02-03&x=2012-03-04');
            assert.equal(link.props['className'], 'active');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Inactive Date Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'datearray'} }
            ]);
            stateNavigator.navigate('s', {x: [new Date(2011, 1, 3), new Date(2012, 2, 4)], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [new Date(2011, 1, 3), new Date(2010, 2, 4)]}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=2011-02-03&x=2010-03-04');
            assert.equal(link.props['className'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Active Array Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: ['a', 'b']}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Inactive Array Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: ['a', 'd']}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a&x=d');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Active Number Array Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'numberarray'} }
            ]);
            stateNavigator.navigate('s', {x: [1, 2], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [1, 2]}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Inactive Number Array Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'numberarray'} }
            ]);
            stateNavigator.navigate('s', {x: [1, 2], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [1, 3]}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=1&x=3');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Active Boolean Array Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'booleanarray'} }
            ]);
            stateNavigator.navigate('s', {x: [true, false], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [true, false]}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Inactive Boolean Array Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'booleanarray'} }
            ]);
            stateNavigator.navigate('s', {x: [true, false], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [true, true]}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=true&x=true');
            assert.equal(link.props['children'], 'link text');
        })
    });


    describe('Disable Active Date Array Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'datearray'} }
            ]);
            stateNavigator.navigate('s', {x: [new Date(2011, 1, 3), new Date(2012, 2, 4)], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [new Date(2011, 1, 3), new Date(2012, 2, 4)]}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Inactive Date Array Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'datearray'} }
            ]);
            stateNavigator.navigate('s', {x: [new Date(2011, 1, 3), new Date(2012, 2, 4)], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [new Date(2011, 1, 3), new Date(2010, 2, 4)]}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=2011-02-03&x=2010-03-04');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Inactive Array Length Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: ['a', 'b', 'c']}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a&x=b&x=c');
            assert.equal(link.props['className'], null);
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Disable Inactive Array Length Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: ['a', 'b', 'c']}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a&x=b&x=c');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Active Add Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    activeCssClass="active"
                    className="link"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=a');
            assert.equal(link.props['className'], 'link active');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Inactive Add Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'c'}}
                    activeCssClass="active"
                    className="link"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r?x=c');
            assert.equal(link.props['className'], 'link');
            assert.equal(link.props['children'], 'link text');
        })
    });

    describe('Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, preventDefault: () => {} });
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
        })
    });

    describe('Ctrl + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, ctrlKey: true, preventDefault: () => {} });
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Shift + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, shiftKey: true, preventDefault: () => {} });
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Meta + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, metaKey: true, preventDefault: () => {} });
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Alt + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, altKey: true, preventDefault: () => {} });
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Button + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, button: true, preventDefault: () => {} });
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Navigating Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigating={() => true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, preventDefault: () => {} });
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
        })
    });

    describe('Not Navigating Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigating={() => false}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, preventDefault: () => {} });
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Navigating Params Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            var navigatingEvt, navigatingLink;
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    navigating={(e, link) => {
                        navigatingEvt = e;
                        navigatingLink = link;
                        return true;
                    }}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            var evt = { currentTarget: { href: link.props['href'] }, preventDefault: () => {} };
            link.props['onClick'](evt);
            assert.strictEqual(navigatingEvt, evt);
            assert.equal(navigatingLink, '/r');
        })
    });

    describe('History Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            var addHistory;
            stateNavigator.historyManager.addHistory = (url, replace) => { addHistory = !replace };
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, preventDefault: () => {} });
            assert.strictEqual(addHistory, true);
        })
    });

    describe('Replace History Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    historyAction="replace"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            var replaceHistory;
            stateNavigator.historyManager.addHistory = (url, replace) => { replaceHistory = replace };
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, preventDefault: () => {} });
            assert.strictEqual(replaceHistory, true);
        })
    });

    describe('None History Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationLink
                    stateKey="s"
                    historyAction="none"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            var noneHistory = true;
            stateNavigator.historyManager.addHistory = () => { noneHistory = false };
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, preventDefault: () => {} });
            assert.strictEqual(noneHistory, true);
        })
    });
});
