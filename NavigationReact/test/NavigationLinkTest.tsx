import assert from 'assert';
import mocha from 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationLink, NavigationHandler, NavigationContext, useNavigationEvent } from 'navigation-react';
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

describe('NavigationLinkTest', function () {
    describe('Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink stateKey="s">
                            <span>link text</span>
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r');
            assert.equal(link.innerHTML, '<span>link text</span>');
        })
    });

    describe('Without State Navigator Navigation Link', function () {
        it('should render', function(){
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationLink stateKey="s">
                        link text
                    </NavigationLink>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Missing Route Param Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r/{x}' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink
                            stateKey="s">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Invalid Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink
                            stateKey="x">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Attributes Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink
                            stateKey="s"
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
                        </NavigationLink>
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

    describe('Navigation Data Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a'}}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Include Current Data Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a'}}
                            includeCurrentData={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=b&z=c&x=a');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Include Current Data Override Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{y: 'a'}}
                            includeCurrentData={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=a&z=c');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Current Data Key Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a'}}
                            currentDataKeys="y">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=b&x=a');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Current Data Key Array Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a'}}
                            currentDataKeys={['y']}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=b&x=a');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Current Data Keys Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a'}}
                            currentDataKeys="y,z">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=b&z=c&x=a');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Current Data Keys Array Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a'}}
                            currentDataKeys={['y','z']}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=b&z=c&x=a');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Current Data Keys Override Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{y: 'a'}}
                            currentDataKeys="y,z">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=a&z=c');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Current Data Keys Array Override Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{y: 'a'}}
                            currentDataKeys={['y','z']}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=a&z=c');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Hash Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink
                            stateKey="s"
                            hash='f'>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r#f');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Null Hash Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink
                            stateKey="s"
                            hash={null}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Empty Hash Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink
                            stateKey="s"
                            hash=''>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a', z: 'c'}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Inactive Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'b'}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Active Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a', z: 'c'}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a&z=c');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'b'}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=b');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Active Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a', z: 'c'}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'b'}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=b');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Click Disable Active Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a'}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
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

    describe('Null Active Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a', y: null}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Undefined Active Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a', y: undefined}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Empty String Inactive Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a', y: ''}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Null Active Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a', y: null}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Undefined Active Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a', y: undefined}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Empty String Inactive Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a', y: ''}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Null Disable Active Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a', y: null}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Undefined Disable Active Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a', y: undefined}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Empty String Disable Inactive Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a', y: ''}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Number Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 1}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Inactive Number Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 2}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Active Boolean Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: true}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Inactive Boolean Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: false}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Active Date Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: new Date(2011, 1, 3)}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Inactive Date Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: new Date(2010, 1, 3)}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Active Number Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 1}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=1');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Number Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 2}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Boolean Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: true}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=true');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Boolean Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: false}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=false');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Date Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: new Date(2011, 1, 3)}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2011-02-03');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Date Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: new Date(2010, 1, 3)}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2010-02-03');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Active Number Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 1}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Number Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 2}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Active Boolean Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: true}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Boolean Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: false}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=false');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Active Date Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: new Date(2011, 1, 3)}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Date Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: new Date(2010, 1, 3)}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2010-02-03');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Type Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 1}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Inactive Type Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 1}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=1');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Type Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 1}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=1');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Array Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: ['a', 'b']}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Inactive Array Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: ['a', 'd']}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Active Number Array Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [1, 2]}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Inactive Number Array Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [1, 3]}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Active Boolean Array Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [true, false]}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Inactive Boolean Array Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [true, true]}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Active Date Array Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [new Date(2011, 1, 3), new Date(2012, 2, 4)]}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Inactive Date Array Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [new Date(2011, 1, 3), new Date(2010, 2, 4)]}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Active Array Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: ['a', 'b']}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a&x=b');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Array Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: ['a', 'd']}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a&x=d');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Number Array Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [1, 2]}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=1&x=2');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Number Array Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [1, 3]}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=1&x=3');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Boolean Array Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [true, false]}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=true&x=false');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Boolean Array Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [true, true]}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=true&x=true');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Date Array Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [new Date(2011, 1, 3), new Date(2012, 2, 4)]}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2011-02-03&x=2012-03-04');
            assert.equal(link.className, 'active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Date Array Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [new Date(2011, 1, 3), new Date(2010, 2, 4)]}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2011-02-03&x=2010-03-04');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Active Array Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: ['a', 'b']}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Array Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: ['a', 'd']}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a&x=d');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Active Number Array Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [1, 2]}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Number Array Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [1, 3]}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=1&x=3');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Active Boolean Array Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [true, false]}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Boolean Array Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [true, true]}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=true&x=true');
            assert.equal(link.innerHTML, 'link text');
        })
    });


    describe('Disable Active Date Array Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [new Date(2011, 1, 3), new Date(2012, 2, 4)]}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Date Array Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: [new Date(2011, 1, 3), new Date(2010, 2, 4)]}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=2011-02-03&x=2010-03-04');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Array Length Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: ['a', 'b', 'c']}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Inactive Array Length Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: ['a', 'b', 'c']}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a&x=b&x=c');
            assert.equal(link.className, '');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Disable Inactive Array Length Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: ['a', 'b', 'c']}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a&x=b&x=c');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Active Add Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a'}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}
                            style={{color: 'red', fontSize: '14px'}}>
                            link text
                        </NavigationLink>
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

    describe('Inactive Add Style Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'c'}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}
                            style={{color: 'red', fontSize: '14px'}}>
                            link text
                        </NavigationLink>
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

    describe('Active Add Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a'}}
                            activeCssClass="active"
                            className="link">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
            assert.equal(link.className, 'link active');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Inactive Add Css Class Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'c'}}
                            activeCssClass="active"
                            className="link">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=c');
            assert.equal(link.className, 'link');
            assert.equal(link.innerHTML, 'link text');
        })
    });

    describe('Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink stateKey="s">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
        })
    });

    describe('Ctrl + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink stateKey="s">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { ctrlKey: true }));
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Shift + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink stateKey="s">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { shiftKey: true }));
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Meta + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink stateKey="s">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { metaKey: true }));
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Alt + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink stateKey="s">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { altKey: true }));
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Button + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink stateKey="s">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { button: 1 }));
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Navigating Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink
                            stateKey="s"
                            navigating={() => true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
        })
    });

    describe('Not Navigating Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink
                            stateKey="s"
                            navigating={() => false}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Navigating Params Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var navigatingEvt, navigatingLink;
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink
                            stateKey="s"
                            navigating={(e, link) => {
                                navigatingEvt = e;
                                navigatingLink = link;
                                return true;
                            }}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link, { clientX: 224 }));
            assert.strictEqual(navigatingEvt.clientX, 224);
            assert.equal(navigatingLink, '/r');
        })
    });

    describe('History Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink stateKey="s">
                            link text
                        </NavigationLink>
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

    describe('Replace History Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink
                            stateKey="s"
                            historyAction="replace">
                            link text
                        </NavigationLink>
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

    describe('None History Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink
                            stateKey="s"
                            historyAction="none">
                            link text
                        </NavigationLink>
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

    describe('Navigate Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s0"
                            navigationData={{x: 'a'}}
                            includeCurrentData={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0?x=a');
            act(() => stateNavigator.navigate('s1', {y: 'b'}));
            assert.equal(link.hash, '#/r0?y=b&x=a');
        })
    });

    describe('Crumb Trail Navigate Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s0"
                            navigationData={{x: 'a'}}
                            includeCurrentData={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0?x=a');
            act(() => stateNavigator.navigate('s1', {y: 'b'}));
            assert.equal(link.hash, '#/r0?y=b&x=a');
        })
    });

    describe('Active Style Navigate Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s0"
                            navigationData={{x: 'a'}}
                            activeStyle={{color: 'green', fontWeight: 'bold'}}>
                            link text
                        </NavigationLink>
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

    describe('Active Css Class Navigate Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s0"
                            navigationData={{x: 'a'}}
                            activeCssClass="active">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.className, 'active');
            act(() => stateNavigator.navigate('s1'));
            assert.equal(link.className, '');
        })
    });

    describe('Disable Active Navigate Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s0"
                            navigationData={{x: 'a'}}
                            disableActive={true}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            act(() => stateNavigator.navigate('s1'));
            assert.equal(link.hash, '#/r0?x=a');
        })
    });

    describe('Rewrite Navigation Link', function () {
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
                        <NavigationLink stateKey="s0">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r1');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.state, s0);
        });
    });

    describe('Rewrite Navigation Link Data', function () {
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
                        <NavigationLink stateKey="s" navigationData={{x: 'y'}}>
                            link text
                        </NavigationLink>
                        <NavigationLink stateKey="s" navigationData={{x: 'w'}}>
                            link text
                        </NavigationLink>
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

    describe('Rewrite Navigation Link Current Data', function () {
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
                        <NavigationLink stateKey="s" navigationData={{x: 'y'}} includeCurrentData>
                            link text
                        </NavigationLink>
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

    describe('Rewrite Navigation Link Current Data Keys', function () {
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
                        <NavigationLink stateKey="s" navigationData={{x: 'y'}} currentDataKeys="a">
                            link text
                        </NavigationLink>
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

    describe('Rewrite Active Navigation Link', function () {
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
                        <NavigationLink stateKey="s" navigationData={{x: 'y'}} disableActive>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
        });
    });

    describe('Rewrite Click Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s0"
                            navigating={(_, link) => {
                                navigatingLink = link;
                                return true;
                            }}>
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r1');
            act(() => Simulate.click(link));
            assert.equal(navigatingLink, '/r0');
        });
    });

    describe('Modal/Details Navigation Link', function () {
        it('should render', function(){
            var stateNavigator = new StateNavigator([
                { key: 'list', route: 'list' },
                { key: 'details', route: 'details/{id}', defaultTypes: {id: 'number'} }
            ]);
            var {list, details} = stateNavigator.states;
            var List = ({ id }) => (
                <>
                    <NavigationLink
                        stateKey='list'
                        navigationData={{id: 1}}>
                        Item 1
                    </NavigationLink>
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

    describe('Rewrite Navigation Link Navigate Outside', function () {
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
            var url = stateNavigator.getNavigationLink('s0');
            var href = stateNavigator.historyManager.getHref(url);
            assert.equal(href, '#/r1');
        });
    });

    describe('Rewrite Navigation Link Missing Route Param', function () {
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
                        <NavigationLink stateKey="s0">
                            link text
                        </NavigationLink>
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
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink stateKey="s">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r');
        });
    });

    describe('Click Custom Href Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.historyManager.getHref = () => '#/hello/world';
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink
                            stateKey="s"
                            navigationData={{x: 'a'}}>
                            link text
                        </NavigationLink>
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

    describe('Consumer Navigation Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var {s0, s1} = stateNavigator.states;
            s0.renderScene = () => (
                <NavigationLink
                    stateKey="s1"
                    navigationData={{hello: 'world'}}>
                    link text
                </NavigationLink>
            );
            s1.renderScene = ({hello}) => <h1>{hello}</h1>
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

    describe('On Before Cancel Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationLink stateKey="s0">
                            link text
                        </NavigationLink>
                        <NavigationLink stateKey="s1">
                            link text
                        </NavigationLink>
                    </NavigationHandler>
                );
            });
            var firstLink = container.querySelectorAll<HTMLAnchorElement>('a')[0];
            act(() => Simulate.click(firstLink));
            assert.equal(stateNavigator.stateContext.state.key, 's0');
            stateNavigator.onBeforeNavigate(() => false);
            var secondLink = container.querySelectorAll<HTMLAnchorElement>('a')[1];
            act(() => Simulate.click(secondLink));
            assert.equal(stateNavigator.stateContext.state.key, 's0');
        })
    });

    describe('On Before Component Cancel Navigation', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
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
            act(() => stateNavigator.navigate('s1'));
            assert.equal(stateNavigator.stateContext.state.key, 's0');
        })
    });

    describe('Click Navigate', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            var root = createRoot(container)
            act(() => {
                root.render(
                    <NavigationHandler stateNavigator={stateNavigator}>
                        <NavigationContext.Consumer>
                            {({stateNavigator}) => (
                                <div onClick={() => stateNavigator.navigate('s', null, undefined)} />
                            )}
                        </NavigationContext.Consumer>
                    </NavigationHandler>
                );
            });
            var div = container.querySelector<HTMLDivElement>('div');
            act(() => Simulate.click(div));
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
        })
    });

    describe('Old Context Navigation Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
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
                            <NavigationLink
                                stateKey="s2"
                                navigationData={{z: 'c'}}>
                                link text
                            </NavigationLink>
                        </FirstContext>
                    </NavigationHandler>
                );
            });
            act(() => stateNavigator.navigate('s1', {y: 'b'}));
            var link = container.querySelector<HTMLAnchorElement>('a');
            act(() => Simulate.click(link));
            assert.equal(stateNavigator.stateContext.url, '/r2?z=c&crumb=%2Fr0%3Fx%3Da');
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s2']);
            assert.equal(stateNavigator.stateContext.data.z, 'c');
            assert.equal(stateNavigator.stateContext.oldUrl, '/r0?x=a');
            assert.equal(stateNavigator.stateContext.oldState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.oldData.x, 'a');
            assert.equal(stateNavigator.stateContext.previousUrl, '/r0?x=a');
            assert.equal(stateNavigator.stateContext.previousState, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.previousData.x, 'a');
            assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            assert.equal(stateNavigator.stateContext.crumbs[0].url, '/r0?x=a');
            assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s0']);
            assert.equal(stateNavigator.stateContext.crumbs[0].data.x, 'a');
        })
    });

    describe('Batch Navigation', function () {
        it('should update once', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' }
            ]);
            var {s0, s1, s2} = stateNavigator.states;
            var Scene0 = () => {
                var { stateNavigator } = useContext(NavigationContext);
                return (
                    <button onClick={() => {
                        stateNavigator.navigate('s1', {x: 'a'});
                        stateNavigator.navigate('s2', {x: 'b'});
                    }} />
                );
            }
            var Scene = () => {
                var { data } = useContext(NavigationContext);
                return <div>{data.x}</div>
            }
            s0.renderScene = () => <Scene0 />;
            s1.renderScene = () => <Scene />;
            s2.renderScene = () => <Scene />;
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
            var button = container.querySelector<HTMLButtonElement>('button');
            act(() => Simulate.click(button));
            var div = container.querySelector<HTMLDivElement>('div');
            assert.equal(div.innerHTML, 'b');
            assert.equal(stateNavigator.stateContext.oldState, s0);
            assert.equal(stateNavigator.stateContext.data.x, 'b');
            assert.equal(stateNavigator.stateContext.state, s2);
        })
    });

    describe('Start Transition Navigation Link', function () {
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
                    <NavigationLink
                        stateKey='s1'
                        navigationData={{x: 1}}
                        startTransition={(React as any).startTransition}
                        navigating={() => {
                            setY('a')
                            return true;
                        }}
                    />
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
            act(() => {
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
            });
        })
    });

    describe('Use Navigation Event', function () {
        it('should update', function(){
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
                    <NavigationLink
                        stateKey="s1"
                        navigationData={{y: 'b'}}>
                        link text
                    </NavigationLink>
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

    describe('Change State Navigator Navigation Link', function () {
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
                        <NavigationLink
                            stateKey="s0"
                            navigationData={{x: 'a'}}
                            includeCurrentData={true}>
                            link text
                        </NavigationLink>
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
                anotherStateNavigator.navigate('s1', {y: 'b'});
                updateStateNavigator(anotherStateNavigator);
            });
            assert.equal(link.hash, '#/r0?y=b&x=a');
        })
    });
});
