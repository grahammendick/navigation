import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from '../../Navigation/src/Navigation';
import { NavigationBackLink } from '../src/NavigationReact';
import * as React from 'react';
import * as ReactTestUtils from 'react-addons-test-utils';

describe('NavigationBackLinkTest', function () {
    describe('Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r0');
            assert.equal(link.props['children'], 'link text');
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
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationBackLink
                    distance={1}>
                    link text
                </NavigationBackLink>,
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
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationBackLink
                    distance={2}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], null);
            assert.equal(link.props['children'], 'link text');
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
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationBackLink
                    distance={1}
                    historyAction='replace'
                    navigating={() => false}
                    aria-label="z"
                    target="_blank"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            assert.equal(link.type, 'a');
            assert.equal(link.props['href'], '#/r0');
            assert.equal(link.props['children'], 'link text');
            assert.notEqual(link.props['onClick'], null);
            assert.equal(link.props['aria-label'], 'z');
            assert.equal(link.props['target'], '_blank');
            assert.equal(Object.keys(link.props).length, 5);
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
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, preventDefault: () => {} });
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
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, ctrlKey: true, preventDefault: () => {} });
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
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, shiftKey: true, preventDefault: () => {} });
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
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, metaKey: true, preventDefault: () => {} });
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
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, altKey: true, preventDefault: () => {} });
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
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, button: true, preventDefault: () => {} });
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
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationBackLink
                    distance={1}
                    navigating={() => true}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, preventDefault: () => {} });
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
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationBackLink
                    distance={1}
                    navigating={() => false}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, preventDefault: () => {} });
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
            var renderer = ReactTestUtils.createRenderer();
            var navigatingEvt, navigatingLink;
            renderer.render(
                <NavigationBackLink
                    distance={1}
                    navigating={(e, domId, link) => {
                        navigatingEvt = e;
                        navigatingLink = link;
                        return true;
                    }}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            var evt = { currentTarget: { href: link.props['href'] }, preventDefault: () => {} };
            link.props['onClick'](evt);
            assert.strictEqual(navigatingEvt, evt);
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
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationBackLink
                    distance={1}
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            var addHistory;
            stateNavigator.historyManager.addHistory = (url, replace) => { addHistory = !replace };
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, preventDefault: () => {} });
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
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationBackLink
                    distance={1}
                    historyAction="replace"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
            );
            var link = renderer.getRenderOutput();
            stateNavigator.historyManager.getUrl = (el) => el.href.substring(1);
            var replaceHistory;
            stateNavigator.historyManager.addHistory = (url, replace) => { replaceHistory = replace };
            link.props['onClick']({ currentTarget: { href: link.props['href'] }, preventDefault: () => {} });
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
            var renderer = ReactTestUtils.createRenderer();
            renderer.render(
                <NavigationBackLink
                    distance={1}
                    historyAction="none"
                    stateNavigator={stateNavigator}>
                    link text
                </NavigationBackLink>
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
