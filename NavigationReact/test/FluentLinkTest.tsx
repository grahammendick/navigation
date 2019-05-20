import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from 'navigation';
import { FluentLink, NavigationHandler, NavigationContext } from 'navigation-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
var { window } = new JSDOM('<!doctype html><html><body></body></html>');
window.addEventListener = () => {};
global.window = window;
global.document = window.document;

describe('FluentLinkTest', function () {
    describe('Fluent Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s0')
                            .navigate('s1')
                    )}>
                        <span>link text</span>
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r1?crumb=%2Fr0');
            assert.equal(link.innerHTML, '<span>link text</span>');
        })
    });

    describe('Without State Navigator Fluent Link', function () {
        it('should render', function(){
            var container = document.createElement('div');
            ReactDOM.render(
                <FluentLink navigate={fluentNavigator => (
                    fluentNavigator.navigate('s')
                )}>
                    link text
                </FluentLink>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Invalid Fluent Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s0')
                            .navigate('x')
                    )}>
                        link text
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Attributes Fluent Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink
                        navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s0')
                                .navigate('s1')
                        )}
                        historyAction='replace'
                        navigating={() => false}
                        aria-label="z"
                        target="_blank">
                        link text
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r1?crumb=%2Fr0');
            assert.equal(link.innerHTML, 'link text');
            assert.equal(link.getAttribute('aria-label'), 'z');
            assert.equal(link.target, '_blank');
            assert.equal(link.attributes.length, 3);
        })
    });

    describe('With Context Fluent Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink
                        withContext={true}
                        navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s1')
                                .navigate('s2')
                    )}>
                        link text
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r2?crumb=%2Fr0&crumb=%2Fr1');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Without Context Fluent Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink
                        withContext={false}
                        navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s1')
                                .navigate('s2')
                    )}>
                        link text
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r2?crumb=%2Fr1');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Click Fluent Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s0')
                            .navigate('s1')
                    )}>
                        link text
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link);
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        })
    });

    describe('Ctrl + Click Fluent Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s0')
                            .navigate('s1')
                    )}>
                        link text
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { ctrlKey: true });
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Shift + Click Fluent Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s0')
                            .navigate('s1')
                    )}>
                        link text
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { shiftKey: true });
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Meta + Click Fluent Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s0')
                            .navigate('s1')
                    )}>
                        link text
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { metaKey: true });
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Alt + Click Fluent Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s0')
                            .navigate('s1')
                    )}>
                        link text
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { altKey: true });
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Button + Click Fluent Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s0')
                            .navigate('s1')
                    )}>
                        link text
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { button: 1 });
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Navigating Click Fluent Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink
                        navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s0')
                            .navigate('s1')
                        )}
                        navigating={() => true}>
                        link text
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link);
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        })
    });

    describe('Not Navigating Click Fluent Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink
                        navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s0')
                            .navigate('s1')
                    )}
                        navigating={() => false}>
                        link text
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link);
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Navigating Params Click Fluent Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var navigatingEvt, navigatingLink;
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink
                        navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s0')
                            .navigate('s1')
                    )}
                        navigating={(e, link) => {
                            navigatingEvt = e;
                            navigatingLink = link;
                            return true;
                        }}>
                        link text
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { clientX: 224 });
            assert.strictEqual(navigatingEvt.clientX, 224);
            assert.equal(navigatingLink, '/r1?crumb=%2Fr0');
        })
    });

    describe('History Click Fluent Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s0')
                            .navigate('s1')
                    )}>
                        link text
                    </FluentLink>
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

    describe('Replace History Click Fluent Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink
                        navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s0')
                            .navigate('s1')
                    )}
                        historyAction="replace">
                        link text
                    </FluentLink>
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

    describe('None History Click Fluent Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink
                        navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s0')
                            .navigate('s1')
                    )}
                        historyAction="none">
                        link text
                    </FluentLink>
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

    describe('Crumb Trail Navigate Fluent Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink
                        withContext={true}
                        navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s1')
                    )}>
                        link text
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r1');
            stateNavigator.navigate('s0');
            assert.equal(link.hash, '#/r1?crumb=%2Fr0');
        })
    });

    describe('Click Custom Href Fluent Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.historyManager.getHref = () => '#/hello/world';
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s0')
                            .navigate('s1')
                    )}>
                        link text
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/hello/world');
            Simulate.click(link);
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        })
    });

    describe('Consumer Fluent Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var {s0, s1, s2} = stateNavigator.states;
            s0.renderView = () => (
                <FluentLink
                    withContext={true}
                    navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s1')
                            .navigate('s2', {hello: 'world'})
                )}>
                    link text
                </FluentLink>
            );
            s1.renderView = () => <h1>s1</h1>
            s2.renderView = ({hello}) => <h1>{hello}</h1>
            stateNavigator.navigate('s0');
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

    describe('On Before Cancel Fluent Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
            ]);
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <FluentLink
                        withContext={true}
                        navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s1')
                                .navigate('s1')
                    )}>
                        link text
                    </FluentLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelectorAll<HTMLAnchorElement>('a')[0];
            Simulate.click(link);
            assert.equal(stateNavigator.stateContext.crumbs.length, 2);
            assert.equal(stateNavigator.stateContext.state.key, 's1');
            stateNavigator.onBeforeNavigate(() => false);
            Simulate.click(link);
            assert.equal(stateNavigator.stateContext.crumbs.length, 2);
            assert.equal(stateNavigator.stateContext.state.key, 's1');
        })
    });

    describe('On Before Component Cancel Fluent Navigation', function () {
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
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationContext.Consumer>
                        {({ stateNavigator }) => <Blocker stateNavigator={stateNavigator} />}
                    </NavigationContext.Consumer>
                </NavigationHandler>,
                container
            );
            assert.equal(stateNavigator.stateContext.state.key, 's0');
            var link = stateNavigator.fluent(true).navigate('s1').url;
            stateNavigator.navigateLink(link);
            assert.equal(stateNavigator.stateContext.state.key, 's0');
        })
    });

    describe('Click Fluent Navigate', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationContext.Consumer>
                        {({stateNavigator}) => (
                            <div onClick={() => stateNavigator.navigateLink(stateNavigator.fluent()
                                .navigate('s0')
                                .navigate('s1').url)
                            } />
                        )}
                    </NavigationContext.Consumer>
                </NavigationHandler>,
                container
            );
            var div = container.querySelector<HTMLAnchorElement>('div');
            Simulate.click(div);
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        })
    });
});
