import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from 'navigation';
import { RefreshLink, NavigationHandler, NavigationContext, useNavigationEvent } from 'navigation-react';
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
global.IS_REACT_ACT_ENVIRONMENT = true;
var { window } = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://navigation.com' });
window.addEventListener = () => {};
global.window = window;
global.document = window.document;

describe('RefreshLinkTest', function () {
    describe('Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink>
                            <span>link text</span>
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r');
            assert.equal(link.innerHTML, '<span>link text</span>');
        })
    });

    describe('Without State Navigator Refresh Link', function () {
        it('should render', function(){
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <RefreshLink>
                        link text
                    </RefreshLink>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Missing Route Param Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r/{x}' }
            ]);
            stateNavigator.navigate('s', {x: 'a'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Invalid Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Attributes Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a'}}
                            includeCurrentData={true}
                            currentDataKeys="y"
                            hash='f'
                            activeStyle={{color: 'green', fontWeight: 'bold'}}
                            activeCssClass="active"
                            disableActive={true}
                            historyAction='replace'
                            navigating={() => false}
                            aria-label="z"
                            target="_blank">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a#f');
            assert.equal(link.innerHTML, 'link text');
            assert.equal(link.getAttribute('aria-label'), 'z');
            assert.equal(link.target, '_blank');
            assert.equal(link.attributes.length, 3);
        })
    });

    describe('Navigation Data Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink navigationData={{x: 'a'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Include Current Data Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a'}}
                            includeCurrentData={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=b&z=c&x=a');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Include Current Data Override Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{y: 'a'}}
                            includeCurrentData={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=a&z=c');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Current Data Key Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a'}}
                            currentDataKeys="y">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=b&x=a');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Current Data Key Array Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a'}}
                            currentDataKeys={['y']}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=b&x=a');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Current Data Keys Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c', w: 'd'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a'}}
                            currentDataKeys="y,z">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=b&z=c&x=a');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Current Data Keys Array Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c', w: 'd'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a'}}
                            currentDataKeys={['y','z']}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=b&z=c&x=a');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Current Data Keys Override Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c', w: 'd'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{y: 'a'}}
                            currentDataKeys="y,z">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=a&z=c');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Current Data Keys Array Override Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {y: 'b', z: 'c', w: 'd'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{y: 'a'}}
                            currentDataKeys={['y','z']}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=a&z=c');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Hash Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink hash='f'>
                            <span>link text</span>
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r#f');
            assert.equal(link.innerHTML, '<span>link text</span>');
        })
    });

    describe('Null Hash Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink hash={null}>
                            <span>link text</span>
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r');
            assert.equal(link.innerHTML, '<span>link text</span>');
        })
    });

    describe('Empty Hash Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink hash=''>
                            <span>link text</span>
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r');
            assert.equal(link.innerHTML, '<span>link text</span>');
        })
    });

    describe('Active Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b', z: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a', z: 'c'}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a&z=c');
            assert.equal(link.style.color, 'green');
            assert.equal(link.style.fontWeight, 'bold');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'b'}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=b');
            assert.equal(link.style.color, '');
            assert.equal(link.style.fontWeight, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b', z: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a', z: 'c'}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a&z=c');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'b'}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=b');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Active Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b', z: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a', z: 'c'}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'b'}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=b');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Click Disable Active Refresh Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a'}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var navigated = false;
            stateNavigator.onNavigate(() => {
                navigated = true;
            })
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
            assert.equal(navigated, false);
        })
    });

    describe('Null Active Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a', y: null}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
            assert.equal(link.style.color, 'green');
            assert.equal(link.style.fontWeight, 'bold');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Undefined Active Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a', y: undefined}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
            assert.equal(link.style.color, 'green');
            assert.equal(link.style.fontWeight, 'bold');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Empty String Inactive Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a', y: ''}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
            assert.equal(link.style.color, '');
            assert.equal(link.style.fontWeight, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Null Active Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a', y: null}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Undefined Active Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a', y: undefined}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Empty String Inactive Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a', y: ''}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Null Disable Active Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a', y: null}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Undefined Disable Active Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a', y: undefined}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Empty String Disable Inactive Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a', y: ''}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Number Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 1}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=1');
            assert.equal(link.style.color, 'green');
            assert.equal(link.style.fontWeight, 'bold');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Number Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 2}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2');
            assert.equal(link.style.color, '');
            assert.equal(link.style.fontWeight, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Boolean Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: true}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=true');
            assert.equal(link.style.color, 'green');
            assert.equal(link.style.fontWeight, 'bold');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Boolean Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: false}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=false');
            assert.equal(link.style.color, '');
            assert.equal(link.style.fontWeight, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Date Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: new Date(2011, 1, 3)}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2011-02-03');
            assert.equal(link.style.color, 'green');
            assert.equal(link.style.fontWeight, 'bold');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Date Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: new Date(2010, 1, 3)}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2010-02-03');
            assert.equal(link.style.color, '');
            assert.equal(link.style.fontWeight, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Number Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 1}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=1');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Number Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 2}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Boolean Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: true}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=true');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Boolean Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: false}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=false');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Date Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: new Date(2011, 1, 3)}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2011-02-03');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Date Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: new Date(2010, 1, 3)}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2010-02-03');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Active Number Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 1}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Number Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: 1, y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 2}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Active Boolean Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: true}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Boolean Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'boolean'} }
            ]);
            stateNavigator.navigate('s', {x: true, y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: false}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=false');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Active Date Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: new Date(2011, 1, 3)}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Date Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'date'} }
            ]);
            stateNavigator.navigate('s', {x: new Date(2011, 1, 3), y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: new Date(2010, 1, 3)}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2010-02-03');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Type Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: '1', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 1}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=1');
            assert.equal(link.style.color, '');
            assert.equal(link.style.fontWeight, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Type Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: '1', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 1}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=1');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Type Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'number'} }
            ]);
            stateNavigator.navigate('s', {x: '1', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 1}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=1');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Array Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: ['a', 'b']}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a&x=b');
            assert.equal(link.style.color, 'green');
            assert.equal(link.style.fontWeight, 'bold');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Array Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: ['a', 'd']}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a&x=d');
            assert.equal(link.style.color, '');
            assert.equal(link.style.fontWeight, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Number Array Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'numberarray'} }
            ]);
            stateNavigator.navigate('s', {x: [1, 2], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [1, 2]}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=1&x=2');
            assert.equal(link.style.color, 'green');
            assert.equal(link.style.fontWeight, 'bold');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Number Array Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'numberarray'} }
            ]);
            stateNavigator.navigate('s', {x: [1, 2], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [1, 3]}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=1&x=3');
            assert.equal(link.style.color, '');
            assert.equal(link.style.fontWeight, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Boolean Array Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'booleanarray'} }
            ]);
            stateNavigator.navigate('s', {x: [true, false], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [true, false]}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=true&x=false');
            assert.equal(link.style.color, 'green');
            assert.equal(link.style.fontWeight, 'bold');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Boolean Array Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'booleanarray'} }
            ]);
            stateNavigator.navigate('s', {x: [true, false], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [true, true]}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=true&x=true');
            assert.equal(link.style.color, '');
            assert.equal(link.style.fontWeight, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });


    describe('Active Date Array Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'datearray'} }
            ]);
            stateNavigator.navigate('s', {x: [new Date(2011, 1, 3), new Date(2012, 2, 4)], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [new Date(2011, 1, 3), new Date(2012, 2, 4)]}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2011-02-03&x=2012-03-04');
            assert.equal(link.style.color, 'green');
            assert.equal(link.style.fontWeight, 'bold');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Date Array Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'datearray'} }
            ]);
            stateNavigator.navigate('s', {x: [new Date(2011, 1, 3), new Date(2012, 2, 4)], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [new Date(2011, 1, 3), new Date(2010, 2, 4)]}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2011-02-03&x=2010-03-04');
            assert.equal(link.style.color, '');
            assert.equal(link.style.fontWeight, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Array Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: ['a', 'b']}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a&x=b');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Array Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: ['a', 'd']}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a&x=d');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Number Array Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'numberarray'} }
            ]);
            stateNavigator.navigate('s', {x: [1, 2], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [1, 2]}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=1&x=2');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Number Array Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'numberarray'} }
            ]);
            stateNavigator.navigate('s', {x: [1, 2], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [1, 3]}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=1&x=3');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Boolean Array Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'booleanarray'} }
            ]);
            stateNavigator.navigate('s', {x: [true, false], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [true, false]}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=true&x=false');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Boolean Array Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'booleanarray'} }
            ]);
            stateNavigator.navigate('s', {x: [true, false], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [true, true]}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=true&x=true');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });


    describe('Active Date Array Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'datearray'} }
            ]);
            stateNavigator.navigate('s', {x: [new Date(2011, 1, 3), new Date(2012, 2, 4)], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [new Date(2011, 1, 3), new Date(2012, 2, 4)]}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2011-02-03&x=2012-03-04');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Date Array Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'datearray'} }
            ]);
            stateNavigator.navigate('s', {x: [new Date(2011, 1, 3), new Date(2012, 2, 4)], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [new Date(2011, 1, 3), new Date(2010, 2, 4)]}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2011-02-03&x=2010-03-04');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Active Array Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: ['a', 'b']}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Array Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: ['a', 'd']}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a&x=d');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Active Number Array Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'numberarray'} }
            ]);
            stateNavigator.navigate('s', {x: [1, 2], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [1, 2]}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Number Array Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'numberarray'} }
            ]);
            stateNavigator.navigate('s', {x: [1, 2], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [1, 3]}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=1&x=3');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Active Boolean Array Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'booleanarray'} }
            ]);
            stateNavigator.navigate('s', {x: [true, false], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [true, false]}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Boolean Array Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'booleanarray'} }
            ]);
            stateNavigator.navigate('s', {x: [true, false], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [true, true]}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=true&x=true');
            assert.equal(link.innerHTML, 'link text');
        })
    });


    describe('Disable Active Date Array Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'datearray'} }
            ]);
            stateNavigator.navigate('s', {x: [new Date(2011, 1, 3), new Date(2012, 2, 4)], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [new Date(2011, 1, 3), new Date(2012, 2, 4)]}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Date Array Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'datearray'} }
            ]);
            stateNavigator.navigate('s', {x: [new Date(2011, 1, 3), new Date(2012, 2, 4)], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: [new Date(2011, 1, 3), new Date(2010, 2, 4)]}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2011-02-03&x=2010-03-04');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Array Length Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: ['a', 'b', 'c']}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a&x=b&x=c');
            assert.equal(link.style.color, '');
            assert.equal(link.style.fontWeight, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Array Length Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: ['a', 'b', 'c']}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a&x=b&x=c');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Array Length Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: {x: 'stringarray'} }
            ]);
            stateNavigator.navigate('s', {x: ['a', 'b'], y: 'c'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: ['a', 'b', 'c']}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a&x=b&x=c');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Add Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a'}}
                            activeCssClass="active"
                            activeStyle={{color: 'green', fontWeight: 'bold'}}
                            style={{color: 'red', fontSize: '14px'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
            assert.equal(link.style.color, 'green');
            assert.equal(link.style.fontWeight, 'bold');
            assert.equal(link.style.fontSize, '14px');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Add Style Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'c'}}
                            activeCssClass="active"
                            activeStyle={{color: 'green', fontWeight: 'bold'}}
                            style={{color: 'red', fontSize: '14px'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=c');
            assert.equal(link.style.color, 'red');
            assert.equal(link.style.fontWeight, '');
            assert.equal(link.style.fontSize, '14px');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Add Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a'}}
                            activeCssClass="active"
                            className="link">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
            assert.equal(link.className, 'link active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Add Css Class Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a', y: 'b'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'c'}}
                            activeCssClass="active"
                            className="link">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=c');
            assert.equal(link.className, 'link');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Click Refresh Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s']);
        })
    });

    describe('Ctrl + Click Refresh Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { ctrlKey: true }));
            assert.equal(stateNavigator.stateContext.oldState, null);
        })
    });

    describe('Shift + Click Refresh Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { shiftKey: true }));
            assert.equal(stateNavigator.stateContext.oldState, null);
        })
    });

    describe('Meta + Click Refresh Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { metaKey: true }));
            assert.equal(stateNavigator.stateContext.oldState, null);
        })
    });

    describe('Alt + Click Refresh Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { altKey: true }));
            assert.equal(stateNavigator.stateContext.oldState, null);
        })
    });

    describe('Button + Click Refresh Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { button: 1 }));
            assert.equal(stateNavigator.stateContext.oldState, null);
        })
    });

    describe('Navigating Click Refresh Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink navigating={() => true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s']);
        })
    });

    describe('Not Navigating Click Refresh Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink navigating={() => false}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.oldState, null);
        })
    });

    describe('Navigating Params Click Refresh Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var navigatingEvt, navigatingLink;
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigating={(e, link) => {
                                navigatingEvt = e;
                                navigatingLink = link;
                                return true;
                            }}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { clientX: 224 }));
            assert.strictEqual(navigatingEvt.clientX, 224);
            assert.equal(navigatingLink, '/r');
        })
    });

    describe('History Click Refresh Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink>
                            link text
                        </RefreshLink>
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

    describe('Replace History Click Refresh Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink historyAction="replace">
                            link text
                        </RefreshLink>
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

    describe('None History Click Refresh Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink historyAction="none">
                            link text
                        </RefreshLink>
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

    describe('Navigate Refresh Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a'}}
                            includeCurrentData={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0?x=a');
            act(() => stateNavigator.navigate('s1', {y: 'b'}));
            assert.equal(link.hash, '#/r1?y=b&x=a');
        })
    });

    describe('Crumb Trail Navigate Refresh Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a'}}
                            includeCurrentData={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0?x=a');
            act(() => stateNavigator.navigate('s1', {y: 'b'}));
            assert.equal(link.hash, '#/r1?y=b&x=a&crumb=%2Fr0');
        })
    });

    describe('Active Style Navigate Refresh Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0', {x: 'a'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a'}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.style.color, 'green');
            assert.equal(link.style.fontWeight, 'bold');
            act(() => stateNavigator.navigate('s1'));
            assert.equal(link.style.color, '');
            assert.equal(link.style.fontWeight, '');
        })
    });

    describe('Active Css Class Navigate Refresh Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0', {x: 'a'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a'}}
                            activeCssClass="active">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.className, 'active');
            act(() => stateNavigator.navigate('s1'));
            assert.equal(link.className, '');
        })
    });

    describe('Disable Active Navigate Refresh Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0', {x: 'a'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a'}}
                            disableActive={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            act(() => stateNavigator.navigate('s1'));
            assert.equal(link.hash, '#/r1?x=a&crumb=%2Fr0%3Fx%3Da');
        })
    });

    describe('Rewrite Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
            ]);
            const {s0} = stateNavigator.states;
            s0.rewriteNavigation = () => ({
                stateKey: 's1',
            });
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r1');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.state, s0);
        });
    });

    describe('Rewrite Refresh Link Data', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r/{x?}' }
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
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink navigationData={{x: 'y'}}>
                            link text
                        </RefreshLink>
                        <RefreshLink navigationData={{x: 'w'}}>
                            link text
                        </RefreshLink>
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

    describe('Rewrite Refresh Link Current Data', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r/{a}/{x?}' },
            ]);
            const {s} = stateNavigator.states;
            s.rewriteNavigation = ({a}) => ({
                stateKey: 's',
                navigationData: {
                    a,
                    x: 'z'
                }
            });
            stateNavigator.navigate('s', {a: 'b'})
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink navigationData={{x: 'y'}} includeCurrentData>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r/b/z');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.data.x, 'y');
            assert.equal(stateNavigator.stateContext.data.a, 'b');
        });
    });

    describe('Rewrite Refresh Link Current Data', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r/{a}/{x?}' },
            ]);
            const {s} = stateNavigator.states;
            s.rewriteNavigation = ({a}) => ({
                stateKey: 's',
                navigationData: {
                    a,
                    x: 'z'
                }
            });
            stateNavigator.navigate('s', {a: 'b'})
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink navigationData={{x: 'y'}} currentDataKeys="a">
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r/b/z');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.data.x, 'y');
            assert.equal(stateNavigator.stateContext.data.a, 'b');
        });
    });

    describe('Rewrite Active Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r/{x}' },
            ]);
            const {s} = stateNavigator.states;
            s.rewriteNavigation = () => ({
                stateKey: 's',
                navigationData: {
                    x: 'z'
                }
            });
            stateNavigator.navigate('s', {x: 'y'})
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink navigationData={{x: 'y'}} disableActive>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
        });
    });

    describe('Rewrite Click Refresh Link', function () {
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
            stateNavigator.navigate('s0')
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink
                            navigating={(_, link) => {
                                navigatingLink = link;
                                return true;
                            }}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r1');
            act(() => Simulate.click(link));
            assert.equal(navigatingLink, '/r0');
        });
    });

    describe('Modal/Details Refresh Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 'list', route: 'list' },
                { key: 'details', route: 'details/{id}', defaultTypes: {id: 'number'} }
            ]);
            var {list, details} = stateNavigator.states;
            var List = ({ id }) => (
                <>
                    <RefreshLink
                        navigationData={{id: 1}}>
                        Item 1
                    </RefreshLink>
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

    describe('Rewrite Refresh Link Navigate Outside', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
            ]);
            const {s0} = stateNavigator.states;
            s0.rewriteNavigation = () => ({stateKey: 's1'});
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <div />
                    </NavigationHandler>
                );
            });
            var url = stateNavigator.getRefreshLink();
            var href = stateNavigator.historyManager.getHref(url);
            assert.equal(href, '#/r1');
        });
    });

    describe('Rewrite Refresh Link Missing Route Param', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1/{x}' },
            ]);
            const {s0} = stateNavigator.states;
            s0.rewriteNavigation = () => ({
                stateKey: 's1',
            });
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0');
        });
    });

    describe('Rewrite Navigation Link Invalid', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' },
            ]);
            const {s} = stateNavigator.states;
            s.rewriteNavigation = () => ({
                stateKey: 'x',
            });
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r');
        });
    });

    describe('Click Custom Href Refresh Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.historyManager.getHref = () => '#/hello/world';
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink navigationData={{x: 'a'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/hello/world');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
            assert.equal(stateNavigator.stateContext.data.x, 'a');
        })
    });

    describe('Consumer Refresh Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var {s} = stateNavigator.states;
            s.renderScene = ({hello}) => (
                <div>
                    <h1>{hello}</h1>
                    <RefreshLink navigationData={{hello: 'world'}}>
                        link text
                    </RefreshLink>
                </div>
            );
            stateNavigator.navigate('s');
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

    describe('On Before Cancel Refresh Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' },
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <RefreshLink navigationData={{x: 'a'}}>
                            link text
                        </RefreshLink>
                        <RefreshLink  navigationData={{y: 'b'}}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            });
            var firstLink = container.querySelectorAll<HTMLAnchorElement>('a')[0];
            act(() => Simulate.click(firstLink));
            assert.equal(stateNavigator.stateContext.data.x, 'a');
            assert.equal(stateNavigator.stateContext.data.y, null);
            stateNavigator.onBeforeNavigate(() => false);
            var secondLink = container.querySelectorAll<HTMLAnchorElement>('a')[1];
            act(() => Simulate.click(secondLink));
            assert.equal(stateNavigator.stateContext.data.x, 'a');
            assert.equal(stateNavigator.stateContext.data.y, null);
        })
    });

    describe('On Before Component Cancel Refresh', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' },
            ]);
            class Blocker extends React.Component<{ stateNavigator: StateNavigator }> {
                componentDidMount() {
                    this.props.stateNavigator.onBeforeNavigate(() => false);
                }
                render() {
                    return null;
                }
            }
            stateNavigator.navigate('s', {x: 'a'});
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
            assert.equal(stateNavigator.stateContext.data.x, 'a');
            assert.equal(stateNavigator.stateContext.data.y, null);
            act(() => stateNavigator.refresh({y: 'b'}));
            assert.equal(stateNavigator.stateContext.data.x, 'a');
            assert.equal(stateNavigator.stateContext.data.y, null);
        })
    });

    describe('Click Refresh', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationContext.Consumer>
                            {({stateNavigator}) => (
                                <div onClick={() => stateNavigator.refresh({x: 'a'}, undefined)} />
                            )}
                        </NavigationContext.Consumer>
                    </NavigationHandler>
                );
            });
            var div = container.querySelector<HTMLDivElement>('div');
            act(() => Simulate.click(div));
            assert.equal(stateNavigator.stateContext.data.x, 'a');
        })
    });

    describe('Old Context Refresh Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0', trackCrumbTrail: true },
                { key: 's1', route: 'r1' },
            ]);
            const FirstContext = ({children}: any) => {
                const context = useContext(NavigationContext);
                const mountContext = useMemo(() => context, []);
                return (
                    <NavigationContext.Provider value={mountContext}>
                        {children}
                    </NavigationContext.Provider>
                );
            }
            stateNavigator.navigate('s0', {x: 'a'});
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <FirstContext>
                            <RefreshLink
                                navigationData={{z: 'c'}}>
                                link text
                            </RefreshLink>
                        </FirstContext>
                    </NavigationHandler>
                );
            });
            act(() => stateNavigator.navigate('s1', {y: 'b'}));
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.url, '/r0?z=c');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.data.z, 'c');
            assert.equal(stateNavigator.stateContext.oldUrl, '/r0?x=a');
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.oldData.x, 'a');
            assert.equal(stateNavigator.stateContext.previousUrl, null);
            assert.equal(stateNavigator.stateContext.previousState, null);
            assert.equal(stateNavigator.stateContext.previousData.x, undefined);
            assert.equal(stateNavigator.stateContext.crumbs.length, 0);
        })
    });

    describe('Batch Reresh', function () {
        it('should update once', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var {s} = stateNavigator.states;
            var Scene = () => {
                var { data, stateNavigator } = useContext(NavigationContext);
                return (
                    <>
                        <button onClick={() => {
                            stateNavigator.navigate('s', {x: 'a'});
                            stateNavigator.navigate('s', {x: 'b'});
                        }} />
                        <div>{data.x}</div>
                    </>
                );
            }
            s.renderScene = () => <Scene />;
            stateNavigator.navigate('s');
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
            var button = container.querySelector<HTMLButtonElement>('button');
            act(() => Simulate.click(button));
            var div = container.querySelector<HTMLDivElement>('div');
            assert.equal(div.innerHTML, 'b');
            assert.equal(stateNavigator.stateContext.oldData.x, undefined);
            assert.equal(stateNavigator.stateContext.data.x, 'b');
        })
    });

    describe('Start Transition Refresh Link', function () {
        it('should delay update', function(done: MochaDone){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var {s} = stateNavigator.states;
            var yVal = undefined;
            var stateContextVal;
            var Scene = () => {
                var [ y, setY ] = useState(null);
                const { data } = useContext(NavigationContext);
                useEffect(() => {
                    if (y) {
                        yVal = y;
                        stateContextVal = stateNavigator.stateContext;
                    }
                })
                return (
                    <>
                        <RefreshLink
                            navigationData={{x: 1}}
                            startTransition={(React as any).startTransition}
                            navigating={() => {
                                setY('a')
                                return true;
                            }}
                        />
                        <div>{data.x ? 'b' : null}</div>
                    </>
                );
            }
            s.renderScene = () => <Scene />;
            stateNavigator.navigate('s');
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
                assert.equal(stateContextVal.data.x, undefined)
                assert.equal(stateNavigator.stateContext.data.x, 1);
                done()
            })
        })
    });

    describe('Use Navigation Event', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
            ]);
            stateNavigator.navigate('s0', {x: 'a'});
            var container = document.createElement('div');
            var root = createRoot(container)
            let context;
            const Scene = () => {
                const {stateNavigator: {stateContext}} = useNavigationEvent();
                context = stateContext;
                return (
                    <RefreshLink
                        navigationData={{y: 'b'}}>
                        link text
                    </RefreshLink>
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
            assert.equal(context.state, stateNavigator.states.s0);
            assert.equal(context.data.x, undefined);
            assert.equal(context.data.y, 'b');
        })
    });

    describe('Change State Navigator Refresh Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            var root = createRoot(container);
            var updateStateNavigator;
            var App = () => {
                var [_stateNavigator, setStateNavigator] = useState(stateNavigator);
                updateStateNavigator = setStateNavigator;
                return (
                    <NavigationHandler stateNavigator={_stateNavigator}>
                        <RefreshLink
                            navigationData={{x: 'a'}}
                            includeCurrentData={true}>
                            link text
                        </RefreshLink>
                    </NavigationHandler>
                );
            }
            act(() => {
                root.render(<App />);
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0?x=a');
            act(() => {
                var anotherStateNavigator = new StateNavigator(stateNavigator);
                anotherStateNavigator.navigate('s1', {y: 'b'})
                updateStateNavigator(anotherStateNavigator);
            });
            assert.equal(link.hash, '#/r1?y=b&x=a');
        })
    });
});
