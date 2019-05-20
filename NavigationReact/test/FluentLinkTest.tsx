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
});
