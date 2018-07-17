import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationBackLink, NavigationHandler, NavigationContext } from 'navigation-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
var { window } = new JSDOM('<!doctype html><html><body></body></html>');
window.addEventListener = () => {};
global.window = window;
global.document = window.document;

describe('NavigationBackLinkTest', function () {
    describe('Navigation Back Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        <span>link text</span>
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0');
            assert.equal(link.innerHTML, '<span>link text</span>');
        })
    });

    describe('Without State Navigator Navigation Back Link', function () {
        it('should render', function(){
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationBackLink distance={1}>
                    link text
                </NavigationBackLink>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
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
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={2}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
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
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink
                        distance={1}
                        historyAction='replace'
                        navigating={() => false}
                        aria-label="z"
                        target="_blank">
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0');
            assert.equal(link.innerHTML, 'link text');
            assert.equal(link.getAttribute('aria-label'), 'z');
            assert.equal(link.target, '_blank');
            assert.equal(link.attributes.length, 3);
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
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link);
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
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { ctrlKey: true });
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
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { shiftKey: true });
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
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { metaKey: true });
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
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { altKey: true });
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
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { button: 1 });
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
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink
                        distance={1}
                        navigating={() => true}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link);
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
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink
                        distance={1}
                        navigating={() => false}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link);
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
            var container = document.createElement('div');
            ReactDOM.render(
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
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { clientX: 224 });
            assert.strictEqual(navigatingEvt.clientX, 224);
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
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            var addHistory;
            stateNavigator.historyManager.addHistory = (url, replace) => { addHistory = !replace };
            Simulate.click(link);
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
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink
                        distance={1}
                        historyAction="replace">
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            var replaceHistory;
            stateNavigator.historyManager.addHistory = (url, replace) => { replaceHistory = replace };
            Simulate.click(link);
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
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink
                        distance={1}
                        historyAction="none">
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            var noneHistory = true;
            stateNavigator.historyManager.addHistory = () => { noneHistory = false };
            Simulate.click(link);
            assert.strictEqual(noneHistory, true);
        })
    });

    describe('Crumb Trail Navigate Navigation Back Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0');
            stateNavigator.navigate('s1');
            assert.equal(link.hash, '#/r1?crumb=%2Fr0');
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
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/hello/world');
            Simulate.click(link);
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
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationContext.Consumer>
                        {({state, data}) => state.renderView(data)}
                    </NavigationContext.Consumer>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link);
            var header = container.querySelector<HTMLHeadingElement>('h1');
            assert.equal(header.innerHTML, 'world');
        })
    });

    describe('On Before Cancel Navigation Back Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            stateNavigator.navigate('s2');
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelectorAll<HTMLAnchorElement>('a')[0];
            Simulate.click(link);
            assert.equal(stateNavigator.stateContext.state.key, 's1');
            stateNavigator.onBeforeNavigate(() => false);
            Simulate.click(link);
            assert.equal(stateNavigator.stateContext.state.key, 's1');
        })
    });

    describe('On Before Component Cancel Navigation Back', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            class Blocker extends React.Component<{ stateNavigator: StateNavigator }> {
                componentDidMount() {
                    this.props.stateNavigator.onBeforeNavigate(() => false);
                }
                render() {
                    return null;
                }
            }
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationContext.Consumer>
                        {({ stateNavigator }) => <Blocker stateNavigator={stateNavigator} />}
                    </NavigationContext.Consumer>
                </NavigationHandler>,
                container
            );
            assert.equal(stateNavigator.stateContext.state.key, 's1');
            stateNavigator.navigateBack(1);
            assert.equal(stateNavigator.stateContext.state.key, 's1');
        })
    });

    describe('Click Navigate Back', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationContext.Consumer>
                        {({stateNavigator}) => (
                            <div onClick={() => stateNavigator.navigateBack(1, undefined, false)} />
                        )}
                    </NavigationContext.Consumer>
                </NavigationHandler>,
                container
            );
            var div = container.querySelector<HTMLAnchorElement>('div');
            Simulate.click(div);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
        })
    });

    /*describe('Click Deferred Navigation Back Link', function () {
        it('should navigate async', function(done){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink
                        distance={1}
                        defer={true}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            stateNavigator.onNavigate(() => {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
                done();                                
            })
        })
    });

    describe('Next State and Data Deferred Navigation Back Link', function () {
        it('should update', function(done){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var {s0, s1} = stateNavigator.states;
            s0.renderView = ({hello}, nextState) => <h1>{hello} {(nextState && nextState.key) || 'first'}</h1>
            s1.renderView = (_, nextState, {hello}) => (
                <div>
                    <h1>{hello || 'empty'} {(nextState && nextState.key) || 'second'}</h1>
                    <NavigationBackLink
                        distance={1}
                        defer={true}>
                        link text
                    </NavigationBackLink>
                </div>
            );
            stateNavigator.navigate('s0', {hello: 'world'});
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationContext.Consumer>
                        {({state, data, nextState, nextData}) => state.renderView(data, nextState, nextData)}
                    </NavigationContext.Consumer>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            var header = container.querySelector<HTMLHeadingElement>('h1');
            assert.equal(header.innerHTML, 'empty second');
            Simulate.click(link);
            header = container.querySelector<HTMLHeadingElement>('h1');
            assert.equal(header.innerHTML, 'world s0');
            stateNavigator.onNavigate(() => {
                header = container.querySelector<HTMLHeadingElement>('h1');
                assert.equal(header.innerHTML, 'world first');
                done();                                
            })
        })
    });

    describe('Deferred Navigation Back Link', function () {
        it('should update async', function(done){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            stateNavigator.navigate('s2');
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink
                        distance={1}
                        defer={true}>
                        link text
                    </NavigationBackLink>
                    <NavigationBackLink distance={1}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var firstLink = container.querySelectorAll<HTMLAnchorElement>('a')[0];
            var secondLink = container.querySelectorAll<HTMLAnchorElement>('a')[1];
            assert.equal(secondLink.hash, '#/r1?crumb=%2Fr0');
            Simulate.click(firstLink);
            assert.equal(secondLink.hash, '#/r1?crumb=%2Fr0');
            stateNavigator.onNavigate(() => {
                assert.equal(secondLink.hash, '#/r0');
                done();
            })
        })
    });

    describe('Click Deferred Navigate Back', function () {
        it('should navigate async', function(done){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationContext.Consumer>
                        {({stateNavigator}) => (
                            <div onClick={() => stateNavigator.navigateBack(1, 'add', true)} />
                        )}
                    </NavigationContext.Consumer>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('div');
            Simulate.click(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
            stateNavigator.onNavigate(() => {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
                done();
            })
        })
    });

    describe('Multiple Deferred Navigation Back Link', function () {
        it('should update async', function(done){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            stateNavigator.navigate('s2');
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationBackLink
                        distance={2}
                        defer={true}>
                        link text
                    </NavigationBackLink>
                    <NavigationBackLink
                        distance={1}
                        defer={true}>
                        link text
                    </NavigationBackLink>
                </NavigationHandler>,
                container
            );
            var firstLink = container.querySelectorAll<HTMLAnchorElement>('a')[0];
            var secondLink = container.querySelectorAll<HTMLAnchorElement>('a')[1];
            Simulate.click(firstLink);
            Simulate.click(secondLink);
            stateNavigator.onNavigate(() => {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
                done();
            })
        })
    });

    describe('Next State and Data Navigate Back', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true },
            ]);
            var {s} = stateNavigator.states;
            s.renderView = (_, nextState, {hello}) => (
                <div>
                    <h1>{hello || 'empty'} {(nextState && nextState.key) || 'first'}</h1>
                    <NavigationBackLink
                        distance={1}
                        defer={true}>
                        link text
                    </NavigationBackLink>
                </div>
            );
            stateNavigator.navigate('s');
            stateNavigator.navigate('s', {hello: 'world'});
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationContext.Consumer>
                        {({state, data, nextState, nextData}) => state.renderView(data, nextState, nextData)}
                    </NavigationContext.Consumer>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            var header = container.querySelector<HTMLHeadingElement>('h1');
            assert.equal(header.innerHTML, 'empty first');
            Simulate.click(link);
            header = container.querySelector<HTMLHeadingElement>('h1');
            assert.equal(header.innerHTML, 'world s');
            stateNavigator.navigateBack(1);
            header = container.querySelector<HTMLHeadingElement>('h1');
            assert.equal(header.innerHTML, 'empty first');
        })
    });*/
});
