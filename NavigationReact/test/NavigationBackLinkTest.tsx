import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from '../../Navigation/src/Navigation';
import { NavigationBackLink } from '../src/NavigationReact';
import * as React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';

configure({ adapter: new Adapter() });
var { window } = new JSDOM('<!doctype html><html><body></body></html>');
(global as any).window = window;
(global as any).document = window.document;

describe('NavigationBackLinkTest', function () {
    describe('Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r0');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Context Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink
                    distance={1}>
                    link text
                </NavigationBackLink>,
                { context: { stateNavigator: stateNavigator }}
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r0');
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Invalid Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink
                    distance={2}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), null);
            assert.equal(link.prop('children'), 'link text');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Attributes Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink
                    distance={1}
                    acrossCrumbs={false}
                    historyAction='replace'
                    navigating={() => false}
                    aria-label="z"
                    target="_blank"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r0');
            assert.equal(link.prop('children'), 'link text');
            assert.notEqual(link.prop('onClick'), null);
            assert.equal(link.prop('aria-label'), 'z');
            assert.equal(link.prop('target'), '_blank');
            assert.equal(Object.keys(link.props()).length, 5);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Click Navigation Back Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = wrapper.find('a');
            link.simulate('click');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Ctrl + Click Navigation Back Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = wrapper.find('a');
            link.simulate('click', { ctrlKey: true });
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Shift + Click Navigation Back Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = wrapper.find('a');
            link.simulate('click', { shiftKey: true });
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Meta + Click Navigation Back Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = wrapper.find('a');
            link.simulate('click', { metaKey: true });
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Alt + Click Navigation Back Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = wrapper.find('a');
            link.simulate('click', { altKey: true });
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Button + Click Navigation Back Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = wrapper.find('a');
            link.simulate('click', { button: true });
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Navigating Click Navigation Back Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink
                    distance={1}
                    navigating={() => true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = wrapper.find('a');
            link.simulate('click');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Not Navigating Click Navigation Back Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink
                    distance={1}
                    navigating={() => false}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = wrapper.find('a');
            link.simulate('click');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('Navigating Params Click Navigation Back Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var navigatingEvt, navigatingLink;
            var wrapper = mount(
                <NavigationBackLink
                    distance={1}
                    navigating={(e, link) => {
                        navigatingEvt = e;
                        navigatingLink = link;
                        return true;
                    }}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = wrapper.find('a');
            link.simulate('click', { hello: 'world' });
            assert.strictEqual(navigatingEvt.hello, 'world');
            assert.equal(navigatingLink, '/r0');
            stateNavigator.historyManager.stop();
            wrapper.unmount();
        })
    });

    describe('History Click Navigation Back Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
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

    describe('Replace History Click Navigation Back Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink
                    distance={1}
                    historyAction="replace"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
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

    describe('None History Click Navigation Back Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink
                    distance={1}
                    historyAction="none"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
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
