import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from '../../Navigation/src/Navigation';
import { NavigationLink } from '../src/NavigationReact';
import * as React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';

configure({ adapter: new Adapter() });
var { window } = new JSDOM('<!doctype html><html><body></body></html>');
(global as any).window = window;
(global as any).document = window.document;

describe('NavigationLinkTest', function () {
    describe('Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Context Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var wrapper = mount(
                <NavigationLink
                    stateKey="s">
                    link text
                </NavigationLink>,
                { context: { stateNavigator: stateNavigator }}
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Invalid Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var wrapper = mount(
                <NavigationLink
                    stateKey="x"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Attributes Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var wrapper = mount(
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
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=a');
            assert.equal(link.prop('children'), 'link text');
            assert.notEqual(link.prop('onClick'), null);
            assert.equal(link.prop('aria-label'), 'z');
            assert.equal(link.prop('target'), '_blank');
            assert.equal(Object.keys(link.props()).length, 5);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Navigation Data Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=a');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Include Current Data Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    includeCurrentData={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?y=b&z=c&x=a');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Include Current Data Override Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{y: 'a'}}
                    includeCurrentData={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?y=a&z=c');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Current Data Key Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    currentDataKeys="y"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?y=b&x=a');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Current Data Keys Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c', w: 'd'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    currentDataKeys="y,z"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?y=b&z=c&x=a');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Current Data Keys Override Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c', w: 'd'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{y: 'a'}}
                    currentDataKeys="y,z"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?y=a&z=c');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Active Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b', z: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', z: 'c'}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=a&z=c');
            assert.equal(link.prop('className'), 'active');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Inactive Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'b'}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=b');
            assert.equal(link.prop('className'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Active Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b', z: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', z: 'c'}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Inactive Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'b'}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=b');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Null Active Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: null}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=a');
            assert.equal(link.prop('className'), 'active');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Undefined Active Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: undefined}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=a');
            assert.equal(link.prop('className'), 'active');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Empty String Inactive Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: ''}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=a');
            assert.equal(link.prop('className'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Null Disable Active Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: null}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Undefined Disable Active Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: undefined}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Empty String Disable Inactive Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a', y: ''}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=a');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Active Number Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 1}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=1');
            assert.equal(link.prop('className'), 'active');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Inactive Number Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 2}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=2');
            assert.equal(link.prop('className'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Active Boolean Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: true}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=true');
            assert.equal(link.prop('className'), 'active');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Inactive Boolean Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: false}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=false');
            assert.equal(link.prop('className'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Active Date Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: new Date(2011, 1, 3)}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=2011-02-03');
            assert.equal(link.prop('className'), 'active');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Inactive Date Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: new Date(2010, 1, 3)}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=2010-02-03');
            assert.equal(link.prop('className'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Active Number Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 1}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Inactive Number Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 2}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=2');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Active Boolean Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: true}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Inactive Boolean Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: false}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=false');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Active Date Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: new Date(2011, 1, 3)}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Inactive Date Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: new Date(2010, 1, 3)}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=2010-02-03');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Inactive Type Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: '1', y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 1}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=1');
            assert.equal(link.prop('className'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Inactive Type Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: '1', y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 1}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=1');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Active Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: ['a', 'b']}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=a&x=b');
            assert.equal(link.prop('className'), 'active');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Inactive Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: ['a', 'd']}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=a&x=d');
            assert.equal(link.prop('className'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Active Number Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'numberarray'} }
            ]);
            stateNavigator.navigate('s', {x: [1, 2], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [1, 2]}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=1&x=2');
            assert.equal(link.prop('className'), 'active');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Inactive Number Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'numberarray'} }
            ]);
            stateNavigator.navigate('s', {x: [1, 2], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [1, 3]}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=1&x=3');
            assert.equal(link.prop('className'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Active Boolean Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'booleanarray'} }
            ]);
            stateNavigator.navigate('s', {x: [true, false], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [true, false]}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=true&x=false');
            assert.equal(link.prop('className'), 'active');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Inactive Boolean Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'booleanarray'} }
            ]);
            stateNavigator.navigate('s', {x: [true, false], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [true, true]}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=true&x=true');
            assert.equal(link.prop('className'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Active Date Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'datearray'} }
            ]);
            stateNavigator.navigate('s', {x: [new Date(2011, 1, 3), new Date(2012, 2, 4)], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [new Date(2011, 1, 3), new Date(2012, 2, 4)]}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=2011-02-03&x=2012-03-04');
            assert.equal(link.prop('className'), 'active');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Inactive Date Array Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'datearray'} }
            ]);
            stateNavigator.navigate('s', {x: [new Date(2011, 1, 3), new Date(2012, 2, 4)], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [new Date(2011, 1, 3), new Date(2010, 2, 4)]}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=2011-02-03&x=2010-03-04');
            assert.equal(link.prop('className'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Active Array Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: ['a', 'b']}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Inactive Array Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: ['a', 'd']}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=a&x=d');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Active Number Array Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'numberarray'} }
            ]);
            stateNavigator.navigate('s', {x: [1, 2], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [1, 2]}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Inactive Number Array Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'numberarray'} }
            ]);
            stateNavigator.navigate('s', {x: [1, 2], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [1, 3]}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=1&x=3');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Active Boolean Array Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'booleanarray'} }
            ]);
            stateNavigator.navigate('s', {x: [true, false], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [true, false]}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Inactive Boolean Array Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'booleanarray'} }
            ]);
            stateNavigator.navigate('s', {x: [true, false], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [true, true]}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=true&x=true');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });


    describe('Disable Active Date Array Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'datearray'} }
            ]);
            stateNavigator.navigate('s', {x: [new Date(2011, 1, 3), new Date(2012, 2, 4)], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [new Date(2011, 1, 3), new Date(2012, 2, 4)]}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Inactive Date Array Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'datearray'} }
            ]);
            stateNavigator.navigate('s', {x: [new Date(2011, 1, 3), new Date(2012, 2, 4)], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: [new Date(2011, 1, 3), new Date(2010, 2, 4)]}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=2011-02-03&x=2010-03-04');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Inactive Array Length Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: ['a', 'b', 'c']}}
                    activeCssClass="active"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=a&x=b&x=c');
            assert.equal(link.prop('className'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Disable Inactive Array Length Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: ['a', 'b', 'c']}}
                    disableActive={true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=a&x=b&x=c');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Active Add Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'a'}}
                    activeCssClass="active"
                    className="link"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=a');
            assert.equal(link.prop('className'), 'link active');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Inactive Add Css Class Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigationData={{x: 'c'}}
                    activeCssClass="active"
                    className="link"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r?x=c');
            assert.equal(link.prop('className'), 'link');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            link.simulate('click');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Ctrl + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            link.simulate('click', { ctrlKey: true });
            assert.equal(stateNavigator.stateContext.state, null);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Shift + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            link.simulate('click', { shiftKey: true });
            assert.equal(stateNavigator.stateContext.state, null);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Meta + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            link.simulate('click', { metaKey: true });
            assert.equal(stateNavigator.stateContext.state, null);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Alt + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            link.simulate('click', { altKey: true });
            assert.equal(stateNavigator.stateContext.state, null);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Button + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            link.simulate('click', { button: true });
            assert.equal(stateNavigator.stateContext.state, null);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Navigating Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigating={() => true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            link.simulate('click');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Not Navigating Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    navigating={() => false}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            link.simulate('click');
            assert.equal(stateNavigator.stateContext.state, null);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Navigating Params Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var navigatingEvt, navigatingLink;
            var wrapper = mount(
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
            var link = wrapper.find('a');
            link.simulate('click', { hello: 'world' });
            assert.strictEqual(navigatingEvt.hello, 'world');
            assert.equal(navigatingLink, '/r');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('History Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            var addHistory;
            stateNavigator.historyManager.addHistory = (url, replace) => { addHistory = !replace };
            link.simulate('click');
            assert.strictEqual(addHistory, true);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Replace History Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    historyAction="replace"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            var replaceHistory;
            stateNavigator.historyManager.addHistory = (url, replace) => { replaceHistory = replace };
            link.simulate('click');
            assert.strictEqual(replaceHistory, true);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('None History Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var wrapper = mount(
                <NavigationLink
                    stateKey="s"
                    historyAction="none"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationLink>
            );
            var link = wrapper.find('a');
            var noneHistory = true;
            stateNavigator.historyManager.addHistory = () => { noneHistory = false };
            link.simulate('click');
            assert.strictEqual(noneHistory, true);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });
});
