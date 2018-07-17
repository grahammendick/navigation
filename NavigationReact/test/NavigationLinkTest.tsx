import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from 'navigation';
import { NavigationLink, NavigationHandler, NavigationContext } from 'navigation-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';

declare var global: any;
var { window } = new JSDOM('<!doctype html><html><body></body></html>');
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink stateKey="s">
                        <span>link text</span>
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r');
            assert.equal(link.innerHTML, '<span>link text</span>');
        })
    });

    describe('Without State Navigator Navigation Link', function () {
        it('should render', function(){
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationLink stateKey="s">
                    link text
                </NavigationLink>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="x">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a'}}
                        includeCurrentData={true}
                        currentDataKeys="y"
                        activeStyle={{color: 'green', fontWeight: 'bold'}}
                        activeCssClass="active"
                        disableActive={true}
                        historyAction='replace'
                        navigating={() => false}
                        aria-label="z"
                        target="_blank">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?x=a');
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a'}}
                        includeCurrentData={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{y: 'a'}}
                        includeCurrentData={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a'}}
                        currentDataKeys="y">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a'}}
                        currentDataKeys={['y']}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a'}}
                        currentDataKeys="y,z">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a'}}
                        currentDataKeys={['y','z']}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{y: 'a'}}
                        currentDataKeys="y,z">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{y: 'a'}}
                        currentDataKeys={['y','z']}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r?y=a&z=c');
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a', z: 'c'}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'b'}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a', z: 'c'}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'b'}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a', z: 'c'}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'b'}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a'}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var navigated = false;
            stateNavigator.onNavigate(() => {
                navigated = true;
            })
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link);
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a', y: null}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a', y: undefined}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a', y: ''}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a', y: null}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a', y: undefined}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a', y: ''}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a', y: null}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a', y: undefined}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a', y: ''}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 1}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 2}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: true}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: false}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: new Date(2011, 1, 3)}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: new Date(2010, 1, 3)}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 1}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 2}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: true}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: false}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: new Date(2011, 1, 3)}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: new Date(2010, 1, 3)}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 1}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 2}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: true}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: false}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: new Date(2011, 1, 3)}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: new Date(2010, 1, 3)}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 1}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 1}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 1}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: ['a', 'b']}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: ['a', 'd']}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [1, 2]}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [1, 3]}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [true, false]}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [true, true]}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [new Date(2011, 1, 3), new Date(2012, 2, 4)]}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [new Date(2011, 1, 3), new Date(2010, 2, 4)]}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: ['a', 'b']}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: ['a', 'd']}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [1, 2]}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [1, 3]}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [true, false]}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [true, true]}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [new Date(2011, 1, 3), new Date(2012, 2, 4)]}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [new Date(2011, 1, 3), new Date(2010, 2, 4)]}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: ['a', 'b']}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: ['a', 'd']}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [1, 2]}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [1, 3]}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [true, false]}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [true, true]}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [new Date(2011, 1, 3), new Date(2012, 2, 4)]}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: [new Date(2011, 1, 3), new Date(2010, 2, 4)]}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: ['a', 'b', 'c']}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: ['a', 'b', 'c']}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: ['a', 'b', 'c']}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a'}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}
                        style={{color: 'red', fontSize: '14px'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'c'}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}
                        style={{color: 'red', fontSize: '14px'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a'}}
                        activeCssClass="active"
                        className="link">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'c'}}
                        activeCssClass="active"
                        className="link">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink stateKey="s">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
        })
    });

    describe('Ctrl + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink stateKey="s">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { ctrlKey: true });
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Shift + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink stateKey="s">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { shiftKey: true });
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Meta + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink stateKey="s">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { metaKey: true });
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Alt + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink stateKey="s">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { altKey: true });
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Button + Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink stateKey="s">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { button: 1 });
            assert.equal(stateNavigator.stateContext.state, null);
        })
    });

    describe('Navigating Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigating={() => true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
        })
    });

    describe('Not Navigating Click Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigating={() => false}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link);
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
            ReactDOM.render(
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
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link, { clientX: 224 });
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink stateKey="s">
                        link text
                    </NavigationLink>
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

    describe('Replace History Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        historyAction="replace">
                        link text
                    </NavigationLink>
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

    describe('None History Click Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        historyAction="none">
                        link text
                    </NavigationLink>
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

    describe('Navigate Navigation Link', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            stateNavigator.navigate('s0');
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s0"
                        navigationData={{x: 'a'}}
                        includeCurrentData={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0?x=a');
            stateNavigator.navigate('s1', {y: 'b'});
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s0"
                        navigationData={{x: 'a'}}
                        includeCurrentData={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/r0?x=a');
            stateNavigator.navigate('s1', {y: 'b'});
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s0"
                        navigationData={{x: 'a'}}
                        activeStyle={{color: 'green', fontWeight: 'bold'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.style.color, 'green');
            assert.equal(link.style.fontWeight, 'bold');
            stateNavigator.navigate('s1');
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s0"
                        navigationData={{x: 'a'}}
                        activeCssClass="active">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.className, 'active');
            stateNavigator.navigate('s1');
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s0"
                        navigationData={{x: 'a'}}
                        disableActive={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '');
            stateNavigator.navigate('s1');
            assert.equal(link.hash, '#/r0?x=a');
        })
    });

    describe('Click Custom Href Navigation Link', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.historyManager.getHref = () => '#/hello/world';
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{x: 'a'}}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            assert.equal(link.hash, '#/hello/world');
            Simulate.click(link);
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
            s0.renderView = () => (
                <NavigationLink
                    stateKey="s1"
                    navigationData={{hello: 'world'}}>
                    link text
                </NavigationLink>
            );
            s1.renderView = ({hello}) => <h1>{hello}</h1>
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

    describe('On Before Cancel Navigation Link', function () {
        it('should not navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink stateKey="s0">
                        link text
                    </NavigationLink>
                    <NavigationLink stateKey="s1">
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var firstLink = container.querySelectorAll<HTMLAnchorElement>('a')[0];
            Simulate.click(firstLink);
            assert.equal(stateNavigator.stateContext.state.key, 's0');
            stateNavigator.onBeforeNavigate(() => false);
            var secondLink = container.querySelectorAll<HTMLAnchorElement>('a')[1];
            Simulate.click(secondLink);
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
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationContext.Consumer>
                        {({ stateNavigator }) => <Blocker stateNavigator={stateNavigator} />}
                    </NavigationContext.Consumer>
                </NavigationHandler>,
                container
            );
            assert.equal(stateNavigator.stateContext.state.key, 's0');
            stateNavigator.navigate('s1');
            assert.equal(stateNavigator.stateContext.state.key, 's0');
        })
    });

    describe('Click Navigate', function () {
        it('should navigate', function(){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationContext.Consumer>
                        {({stateNavigator}) => (
                            <div onClick={() => stateNavigator.navigate('s', null, undefined, false)} />
                        )}
                    </NavigationContext.Consumer>
                </NavigationHandler>,
                container
            );
            var div = container.querySelector<HTMLAnchorElement>('div');
            Simulate.click(div);
            assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
        })
    });

    /*describe('Click Deferred Navigation Link', function () {
        it('should navigate async', function(done){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        defer={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('a');
            Simulate.click(link);
            assert.equal(stateNavigator.stateContext.state, null);
            stateNavigator.onNavigate(() => {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
                done();                                
            })
        })
    });

    describe('Next State and Data Deferred Navigation Link', function () {
        it('should update', function(done){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var {s0, s1} = stateNavigator.states;
            s0.renderView = (_, nextState, {hello}) => (
                <div>
                    <h1>{hello || 'empty'} {(nextState && nextState.key) || 'first'}</h1>
                    <NavigationLink
                        stateKey="s1"
                        navigationData={{hello: 'world'}}
                        defer={true}>
                        link text
                    </NavigationLink>
                </div>
            );
            s1.renderView = ({hello}, nextState) => <h1>{hello} {(nextState && nextState.key) || 'second'}</h1>
            stateNavigator.navigate('s0');
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
            assert.equal(header.innerHTML, 'world s1');
            stateNavigator.onNavigate(() => {
                header = container.querySelector<HTMLHeadingElement>('h1');
                assert.equal(header.innerHTML, 'world second');
                done();                                
            })
        })
    });

    describe('Include Current Data Deferred Navigation Link', function () {
        it('should update async', function(done){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s', {x: 'a'});
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{y: 'b'}}
                        defer={true}>
                        link text
                    </NavigationLink>
                    <NavigationLink
                        stateKey="s"
                        navigationData={{z: 'c'}}
                        includeCurrentData={true}>
                        link text
                    </NavigationLink>
                </NavigationHandler>,
                container
            );
            var firstLink = container.querySelectorAll<HTMLAnchorElement>('a')[0];
            var secondLink = container.querySelectorAll<HTMLAnchorElement>('a')[1];
            assert.equal(secondLink.hash, '#/r?x=a&z=c');
            Simulate.click(firstLink);
            assert.equal(secondLink.hash, '#/r?x=a&z=c');
            stateNavigator.onNavigate(() => {
                assert.equal(secondLink.hash, '#/r?y=b&z=c');
                done();
            })
        })
    });

    describe('Click Deferred Navigate', function () {
        it('should navigate async', function(done){
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationContext.Consumer>
                        {({stateNavigator}) => (
                            <div onClick={() => stateNavigator.navigate('s', null, 'add', true)} />
                        )}
                    </NavigationContext.Consumer>
                </NavigationHandler>,
                container
            );
            var link = container.querySelector<HTMLAnchorElement>('div');
            Simulate.click(link);
            assert.equal(stateNavigator.stateContext.state, null);
            stateNavigator.onNavigate(() => {
                assert.equal(stateNavigator.stateContext.state, stateNavigator.states['s']);
                done();
            })
        })
    });

    describe('Multiple Deferred Navigation Link', function () {
        it('should update async', function(done){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var container = document.createElement('div');
            ReactDOM.render(
                <NavigationHandler stateNavigator={stateNavigator}>
                    <NavigationLink
                        stateKey="s0"
                        defer={true}>
                        link text
                    </NavigationLink>
                    <NavigationLink
                        stateKey="s1"
                        defer={true}>
                        link text
                    </NavigationLink>
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

    describe('Next State and Data Navigate', function () {
        it('should update', function(){
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var {s0, s1} = stateNavigator.states;
            s0.renderView = (_, nextState, {hello}) => (
                <div>
                    <h1>{hello || 'empty'} {(nextState && nextState.key) || 'first'}</h1>
                    <NavigationLink
                        stateKey="s1"
                        navigationData={{hello: 'world'}}
                        defer={true}>
                        link text
                    </NavigationLink>
                </div>
            );
            s1.renderView = () => null;
            stateNavigator.navigate('s0');
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
            assert.equal(header.innerHTML, 'world s1');
            stateNavigator.navigate('s0', {x: 'a'});
            header = container.querySelector<HTMLHeadingElement>('h1');
            assert.equal(header.innerHTML, 'empty first');
        })
    });*/
});
