import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from 'navigation';
import { FluentLink, NavigationHandler, NavigationContext, useNavigationEvent } from 'navigation-react';
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
global.IS_REACT_ACT_ENVIRONMENT = true;
var { window } = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://navigation.com' });
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
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s0')
                                .navigate('s1')
                        )}>
                            <span>link text</span>
                        </FluentLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r1?crumb=%2Fr0');
            assert.equal(link.innerHTML, '<span>link text</span>');
        })
    });

    describe('Without State Navigator Fluent Link', function () {
        it('should render', function(){
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <FluentLink navigate={fluentNavigator => (
                        fluentNavigator.navigate('s')
                    )}>
                        link text
                    </FluentLink>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Missing Route Param Fluent Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1/{x}', trackCrumbTrail: true }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s0')
                                .navigate('s1')
                        )}>
                            link text
                        </FluentLink>
                    </NavigationHandler>
                );
            });
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
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s0')
                                .navigate('x')
                        )}>
                            link text
                        </FluentLink>
                    </NavigationHandler>
                );
            });
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
            var root = createRoot(container)
            act(() => {
                root.render(
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
                    </NavigationHandler>
                );
            });
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
            var root = createRoot(container)
            act(() => {
                root.render(
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
                    </NavigationHandler>
                );
            });
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
            var root = createRoot(container)
            act(() => {
                root.render(
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
                    </NavigationHandler>
                );
            });
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
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s0')
                                .navigate('s1')
                        )}>
                            link text
                        </FluentLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
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
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s0')
                                .navigate('s1')
                        )}>
                            link text
                        </FluentLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { ctrlKey: true }));
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
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s0')
                                .navigate('s1')
                        )}>
                            link text
                        </FluentLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { shiftKey: true }));
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
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s0')
                                .navigate('s1')
                        )}>
                            link text
                        </FluentLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { metaKey: true }));
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
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s0')
                                .navigate('s1')
                        )}>
                            link text
                        </FluentLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { altKey: true }));
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
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s0')
                                .navigate('s1')
                        )}>
                            link text
                        </FluentLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { button: 1 }));
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
            var root = createRoot(container)
            act(() => {
                root.render(
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
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
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
            var root = createRoot(container)
            act(() => {
                root.render(
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
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
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
            var root = createRoot(container)
            act(() => {
                root.render(
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
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { clientX: 224 }));
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
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s0')
                                .navigate('s1')
                        )}>
                            link text
                        </FluentLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            var addHistory;
            stateNavigator.historyManager.addHistory = (url, replace) => { addHistory = !replace };
            act(() => Simulate.click(link));
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
            var root = createRoot(container)
            act(() => {
                root.render(
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
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            var replaceHistory;
            stateNavigator.historyManager.addHistory = (url, replace) => { replaceHistory = replace };
            act(() => Simulate.click(link));
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
            var root = createRoot(container)
            act(() => {
                root.render(
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
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            var noneHistory = true;
            stateNavigator.historyManager.addHistory = () => { noneHistory = false };
            act(() => Simulate.click(link));
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
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink
                            withContext={true}
                            navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s1')
                        )}>
                            link text
                        </FluentLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r1');
            act(() => stateNavigator.navigate('s0'));
            assert.equal(link.hash, '#/r1?crumb=%2Fr0');
        })
    });

    describe('Rewrite Fluent Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
            ]);
            const {s0} = stateNavigator.states;
            s0.rewriteNavigation = () => ({
                stateKey: 's1',
            });
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s0')
                        )}>
                            link text
                        </FluentLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r1');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.state, s0);
        });
    });

    describe('Rewrite Fluent Link Data', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r/{x}' },
            ]);
            const {s} = stateNavigator.states;
            s.rewriteNavigation = ({x}) => (
                x === 'y' ? {
                    stateKey: 's',
                    navigationData: {
                        x: 'z'
                    }
                } : null
            );
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s', {x: 'y'})
                        )}>
                            link text
                        </FluentLink>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s', {x: 'w'})
                        )}>
                            link text
                        </FluentLink>
                    </NavigationHandler>
                );
            });
            var links = container.querySelectorAll<HTMLAnchorElement>('a');
            assert.equal(links[0].hash, '#/r/z');
            assert.equal(links[1].hash, '#/r/w');
            act(() => Simulate.click(links[0]));
            assert.equal(stateNavigator.stateContext.data.x, 'y');
        });
    });

    describe('Rewrite Click Fluent Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
            ]);
            const {s0} = stateNavigator.states;
            s0.rewriteNavigation = () => ({
                stateKey: 's1',
            });
            var navigatingLink;
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s0')
                            )}
                            navigating={(_, link) => {
                                navigatingLink = link;
                                return true;
                            }}>
                            link text
                        </FluentLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r1');
            act(() => Simulate.click(link));
            assert.equal(navigatingLink, '/r0');
        });
    });

    describe('Modal/Details Fluent Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 'list', route: 'list' },
                { key: 'details', route: 'details/{id}', defaultTypes: {id: 'number'} }
            ]);
            var {list, details} = stateNavigator.states;
            var List = ({ id }) => (
                <>
                    <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('list', {id: 1})
                        )}>
                        Item 1
                    </FluentLink>
                    {id && <dialog>Modal {id}</dialog>}
                </>
            );
            list.renderScene = ({ id }) => <List id={id} />;
            details.renderScene = ({ id }) => <div>Details {id}</div>;
            list.rewriteNavigation = ({ id }) => (
                id ? {
                    stateKey: 'details',
                    navigationData: { id },
                } : null);
            stateNavigator.navigate('list');
            var container = document.createElement('div');
            var root = createRoot(container);
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationContext.Consumer>
                            {({state, data}) => state.renderScene(data)}
                        </NavigationContext.Consumer>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            var dialog = container.querySelector<HTMLDialogElement>('dialog');
            assert.equal(link.hash, '#/details/1');
            assert.equal(dialog, null);
            act(() => Simulate.click(link));
            var dialog = container.querySelector<HTMLDialogElement>('dialog');
            var div = container.querySelector<HTMLDivElement>('div');
            assert.equal(dialog.innerHTML, 'Modal 1');
            assert.equal(div, null);
        })
    });

    describe('Rewrite Fluent Link Navigate Outside', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
            ]);
            const {s0} = stateNavigator.states;
            s0.rewriteNavigation = () => ({stateKey: 's1'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <div />
                    </NavigationHandler>
                );
            });
            var url = stateNavigator.fluent().navigate('s0').url;
            var href = stateNavigator.historyManager.getHref(url);
            assert.equal(href, '#/r1');
        });
    });

    describe('Rewrite Fluent Link Missing Route Param', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1/{x}' },
            ]);
            const {s0} = stateNavigator.states;
            s0.rewriteNavigation = () => ({
                stateKey: 's1',
            });
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s0')
                        )}>
                            link text
                        </FluentLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0');
        });
    });

    describe('Rewrite Fluent Link Invalid', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' },
            ]);
            const {s} = stateNavigator.states;
            s.rewriteNavigation = () => ({
                stateKey: 'x',
            });
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s')
                        )}>
                            link text
                        </FluentLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r');
        });
    });

    describe('Click Custom Href Fluent Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.historyManager.getHref = () => '#/hello/world';
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FluentLink navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s0')
                                .navigate('s1')
                        )}>
                            link text
                        </FluentLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/hello/world');
            act(() => Simulate.click(link));
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
            s0.renderScene = () => (
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
            s1.renderScene = () => <h1>s1</h1>
            s2.renderScene = ({hello}) => <h1>{hello}</h1>
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationContext.Consumer>
                            {({state, data}) => state.renderScene(data)}
                        </NavigationContext.Consumer>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
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
            var root = createRoot(container)
            act(() => {
                root.render(
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
                    </NavigationHandler>
                );
            });
            var link = container.querySelectorAll<HTMLAnchorElement>('a')[0];
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.crumbs.length, 2);
            assert.equal(stateNavigator.stateContext.state.key, 's1');
            stateNavigator.onBeforeNavigate(() => false);
            act(() => Simulate.click(link));
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
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationContext.Consumer>
                            {({ stateNavigator }) => <Blocker stateNavigator={stateNavigator} />}
                        </NavigationContext.Consumer>
                    </NavigationHandler>
                );
            });
            assert.equal(stateNavigator.stateContext.state.key, 's0');
            var link = stateNavigator.fluent(true).navigate('s1').url;
            act(() => stateNavigator.navigateLink(link));
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
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationContext.Consumer>
                            {({stateNavigator}) => (
                                <div onClick={() => stateNavigator.navigateLink(stateNavigator.fluent()
                                    .navigate('s0')
                                    .navigate('s1').url)
                                } />
                            )}
                        </NavigationContext.Consumer>
                    </NavigationHandler>
                );
            });
            var div = container.querySelector<HTMLAnchorElement>('div');
            act(() => Simulate.click(div));
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s1']);
        })
    });

    describe('Start Transition Fluent Link', function () {
        it('should delay update', function(done: MochaDone){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var {s0, s1} = stateNavigator.states;
            var yVal = undefined;
            var stateContextVal;
            var Scene = () => {
                var [ y, setY ] = useState(null);
                useEffect(() => {
                    if (y) {
                        yVal = y;
                        stateContextVal = stateNavigator.stateContext;
                    }
                })
                return (
                    <FluentLink
                        withContext={true}
                        startTransition={(React as any).startTransition}
                        navigate={fluentNavigator => (
                            fluentNavigator
                                .navigate('s1', {x: 1})
                        )}
                        navigating={() => {
                            setY('a')
                            return true;
                        }}
                    >
                        link text
                    </FluentLink>
                );
            }
            s0.renderScene = () => <Scene />;
            s1.renderScene = () => <div>b</div>;
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationContext.Consumer>
                            {({state, data}) => state.renderScene(data)}
                        </NavigationContext.Consumer>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            var error = console.error;
            console.error = () => {};
            try {
                Simulate.click(link);
            } finally {
                console.error = error;
            }
            stateNavigator.onNavigate(() => {
                var div = container.querySelector<HTMLDivElement>('div');
                assert.equal(yVal, 'a');
                assert.equal(div.innerHTML, 'b');
                assert.equal(stateContextVal.state, s0)
                assert.equal(stateContextVal.data.x, undefined)
                assert.equal(stateNavigator.stateContext.state, s1);
                assert.equal(stateNavigator.stateContext.data.x, 1);
                done()
            })
        })
    });

    describe('Fluent Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            stateNavigator.navigate('s0', {x: 'a'});
            var container = document.createElement('div');
            var root = createRoot(container)
            let context;
            const Scene = () => {
                const {stateNavigator: {stateContext}} = useNavigationEvent();
                context = stateContext;
                return (
                    <FluentLink navigate={fluentNavigator => (
                        fluentNavigator
                            .navigate('s1', {y: 'b'})
                    )}>
                        link text
                    </FluentLink>
            )
            }
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <Scene />
                    </NavigationHandler>
                );
            });
            assert.equal(context, stateNavigator.stateContext);
            assert.equal(context.state, stateNavigator.states.s0);
            assert.equal(context.data.x, 'a');
            assert.equal(context.data.y, undefined);
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
            assert.equal(context, stateNavigator.stateContext);
            assert.equal(context.state, stateNavigator.states.s1);
            assert.equal(context.data.x, undefined);
            assert.equal(context.data.y, 'b');
        })
    });
});
