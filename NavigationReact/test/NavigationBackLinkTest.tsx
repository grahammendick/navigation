import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationBackLink, NavigationHandler, NavigationContext } from 'navigation-react';
import * as React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';

configure({ adapter: new Adapter() });
var { window } = new JSDOM('<!doctype html><html><body></body></html>');
window.addEventListener = () => {};
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
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r0');
            assert.equal(link.prop('children'), 'link text');
        })
    });

    describe('Without Context Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink distance={1}>
                    link text
                </NavigationBackLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), null);
            assert.equal(link.prop('children'), 'link text');
        })
    });

    describe('Without State Navigator Navigation Back Link', function () {
        it('should render', function(){
            var wrapper = mount(
                <NavigationBackLink distance={1}>
                    link text
                </NavigationBackLink>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), null);
            assert.equal(link.prop('children'), 'link text');
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
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={2}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), null);
            assert.equal(link.prop('children'), 'link text');
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
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink
                        distance={1}
                        acrossCrumbs={false}
                        historyAction='replace'
                        navigating={() => false}
                        aria-label="z"
                        target="_blank">
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r0');
            assert.equal(link.prop('children'), 'link text');
            assert.notEqual(link.prop('onClick'), null);
            assert.equal(link.prop('aria-label'), 'z');
            assert.equal(link.prop('target'), '_blank');
            assert.equal(Object.keys(link.props()).length, 5);
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
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            link.simulate('click');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
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
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            link.simulate('click', { ctrlKey: true });
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
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
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            link.simulate('click', { shiftKey: true });
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
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
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            link.simulate('click', { metaKey: true });
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
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
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            link.simulate('click', { altKey: true });
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
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
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            link.simulate('click', { button: true });
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
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
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink
                        distance={1}
                        navigating={() => true}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            link.simulate('click');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
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
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink
                        distance={1}
                        navigating={() => false}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            link.simulate('click');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
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
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink
                        distance={1}
                        navigating={(e, link) => {
                            navigatingEvt = e;
                            navigatingLink = link;
                            return true;
                        }}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            link.simulate('click', { hello: 'world' });
            assert.strictEqual(navigatingEvt.hello, 'world');
            assert.equal(navigatingLink, '/r0');
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
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            var addHistory;
            stateNavigator.historyManager.addHistory = (url, replace) => { addHistory = !replace };
            link.simulate('click');
            assert.strictEqual(addHistory, true);
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
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink
                        distance={1}
                        historyAction="replace">
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            var replaceHistory;
            stateNavigator.historyManager.addHistory = (url, replace) => { replaceHistory = replace };
            link.simulate('click');
            assert.strictEqual(replaceHistory, true);
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
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink
                        distance={1}
                        historyAction="none">
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            var noneHistory = true;
            stateNavigator.historyManager.addHistory = () => { noneHistory = false };
            link.simulate('click');
            assert.strictEqual(noneHistory, true);
        })
    });

    describe('Crumb Trail Navigate Navigation Back Link', function () {
        it('should not update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r0');
            stateNavigator.navigate('s1');
            wrapper.update();
            link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r0');
        })
    });

    describe('Across Crumbs Crumb Trail Navigate Navigation Back Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink
                        acrossCrumbs={true}
                        distance={1}
                        stateNavigator={stateNavigator}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r0');
            stateNavigator.navigate('s1');
            wrapper.update();
            link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r1?crumb=%2Fr0');
        })
    });

    describe('Context Across Crumbs Crumb Trail Navigate Navigation Back Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationBackLink
                    acrossCrumbs={true}
                    distance={1}>
                    link text
                </NavigationBackLink>,
                {
                    context: { stateNavigator: stateNavigator },
                    childContextTypes: { stateNavigator: () => {}}
                }
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r0');
            stateNavigator.navigate('s1');
            wrapper.update();
            link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/r1?crumb=%2Fr0');
        })
    });

    describe('Click Custom Href Navigation Back Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            stateNavigator.historyManager.getHref = () => '#/hello/world';
            var wrapper = mount(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            assert.equal(link.prop('href'), '#/hello/world');
            link.simulate('click');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        })
    });

    describe('Consumer Navigation Back Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var {s0, s1} = stateNavigator.states;
            s0.renderView = ({hello}) => <h1>{hello}</h1>
            s1.renderView = () => (
                <NavigationBackLink distance={1}>
                    link text
                </NavigationBackLink>
            );
            stateNavigator.navigate('s0', {hello: 'world'});
            stateNavigator.navigate('s1');
            var wrapper = mount(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationContext.Consumer>
                        {({state, data}) => state.renderView(data)}
                    </NavigationContext.Consumer>
                </NavigationHandler>
            );
            var link = wrapper.find('a');
            link.simulate('click');
            wrapper.update();
            var header = wrapper.find('h1');
            assert.equal(header.prop('children'), 'world');
        })
    });
});
