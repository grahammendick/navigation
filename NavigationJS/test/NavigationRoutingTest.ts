/// <reference path="assert.d.ts" />
/// <reference path="mocha.d.ts" />
import assert = require('assert');
import Navigation = require('../src/Navigation');
import StateController = require('../src/StateController');

describe('MatchTest', function () {
    describe('Root', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            stateController.navigateLink('/');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 0);
            stateController.navigateLink('/?x=ab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
        });
        
        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ '), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/a'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/?x=a&x=b'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab' }), '/?x=ab');
        });
    });

    describe('No Param One Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'abc', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 0);
            stateController.navigateLink('/abc?x=ab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ abc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc '), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/dbc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/c'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/adc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/aabc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/abc');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab' }), '/abc?x=ab');
        });
    });

    describe('No Param Two Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/c', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('ab/c');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 0);
            stateController.navigateLink('ab/c?x=ab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ ab/c'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/c '), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/d'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/a/b/c'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ad/c'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/aab/c'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/ab/c');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab' }), '/ab/c?x=ab');
        });
    });

    describe('One Param One Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abcd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'abcd');
            stateController.navigateLink('/ab?y=cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            assert.strictEqual(stateController.stateContext.data.y, 'cd');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ab/cd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/a?x=b'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'abcd' }), '/abcd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', y: 'cd' }), '/ab?y=cd');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('One Param Two Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            stateController.navigateLink('/ab/cd?y=ef');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'ef');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ ab/cd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc/d'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/d/e'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/a/b/d'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/cab/d'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd' }), '/ab/cd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd', y: 'ef' }), '/ab/cd?y=ef');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), null);
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'ef' }), null);
        });
    });

    describe('Two Param Two Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{y}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/aa/bbb');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'bbb');
            stateController.navigateLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'bbb');
            assert.strictEqual(stateController.stateContext.data.z, 'cccc');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/aa/bbb/e'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/aa//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/aa'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'bbb' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { z: 'cccc' }), null);
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param Three Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}/{y}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'efg');
            stateController.navigateLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'efg');
            assert.strictEqual(stateController.stateContext.data.z, 'hi');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ ab/cd/efg'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cde'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cd/efg/h'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab//efg'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('//cd/efg'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/ab/cd/efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg?z=hi');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'efg' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { z: 'hi' }), null);
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param Four Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}/c/{y}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab/yy/c/xyz');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'yy');
            assert.strictEqual(stateController.stateContext.data.y, 'xyz');
            stateController.navigateLink('/ab/yy/c/xyz?z=xx');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'yy');
            assert.strictEqual(stateController.stateContext.data.y, 'xyz');
            assert.strictEqual(stateController.stateContext.data.z, 'xx');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ ab/yy/c/xyz'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/b/c'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/b/c/d/e'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/c'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/b/c//d'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab//b/c/d'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'yy', y: 'xyz' }), '/ab/yy/c/xyz');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'yy', y: 'xyz', z: 'xx' }), '/ab/yy/c/xyz?z=xx');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'yy' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'xyz' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { z: 'zz' }), null);
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('One Optional Param One Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abcd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'abcd');
            stateController.navigateLink('/abcd?y=ef');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'abcd');
            assert.strictEqual(stateController.stateContext.data.y, 'ef');
            stateController.navigateLink('/');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 0);
            stateController.navigateLink('/?y=ef');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.y, 'ef');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ab/cd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab//'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'abcd' }), '/abcd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'abcd', y: 'ef' }), '/abcd?y=ef');
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'ef' }), '/?y=ef');
        });
    });

    describe('One Optional Param Two Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            stateController.navigateLink('/ab/cd?y=ef');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'ef');
            stateController.navigateLink('/ab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 0);
            stateController.navigateLink('/ab?y=ef');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.y, 'ef');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ ab/cd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc/d'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/d/e'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/a/b/d'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/cab/d'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd' }), '/ab/cd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd', y: 'ef' }), '/ab/cd?y=ef');
            assert.strictEqual(stateController.getNavigationLink('d'), '/ab');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'ef' }), '/ab?y=ef');
        });
    });

    describe('Two Optional Param Two Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x?}/{y?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/aa/bbb');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'bbb');
            stateController.navigateLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'bbb');
            assert.strictEqual(stateController.stateContext.data.z, 'cccc');
            stateController.navigateLink('/aab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'aab');
            stateController.navigateLink('/aab?z=cccc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'aab');
            assert.strictEqual(stateController.stateContext.data.z, 'cccc');
            stateController.navigateLink('/');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 0);
            stateController.navigateLink('/?z=cccc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.z, 'cccc');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/aa/bbb/e'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/aa//'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aab' }), '/aab');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aab', z: 'cccc' }), '/aab?z=cccc');
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { z: 'cccc' }), '/?z=cccc');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'bbb' }), null);
        });
    });

    describe('Two Optional Param Three Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x?}/{y?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'efg');
            stateController.navigateLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'efg');
            assert.strictEqual(stateController.stateContext.data.z, 'hi');
            stateController.navigateLink('/ab/cde');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'cde');
            stateController.navigateLink('/ab/cde?z=fg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'cde');
            assert.strictEqual(stateController.stateContext.data.z, 'fg');
            stateController.navigateLink('/ab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 0);
            stateController.navigateLink('/ab?z=cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.z, 'cd');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ ab/cd/efg'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cd/efg/h'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab//efg'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('//cd/efg'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/ab/cd/efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg?z=hi');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cde' }), '/ab/cde');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cde', z: 'fg' }), '/ab/cde?z=fg');
            assert.strictEqual(stateController.getNavigationLink('d'), '/ab');
            assert.strictEqual(stateController.getNavigationLink('d', { z: 'cd' }), '/ab?z=cd');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'efg' }), null);
        });
    });

    describe('Two Param One Optional Two Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{y?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/aa/bbb');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'bbb');
            stateController.navigateLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'bbb');
            assert.strictEqual(stateController.stateContext.data.z, 'cccc');
            stateController.navigateLink('/aab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'aab');
            stateController.navigateLink('/aab?z=ccd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'aab');
            assert.strictEqual(stateController.stateContext.data.z, 'ccd');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/aa/bbb/e'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/aa//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aab' }), '/aab');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aab', z: 'ccd' }), '/aab?z=ccd');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'bbb' }), null);
        });
    });

    describe('Two Param One Optional Three Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}/{y?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'efg');
            stateController.navigateLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'efg');
            assert.strictEqual(stateController.stateContext.data.z, 'hi');
            stateController.navigateLink('/ab/cde');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'cde');
            stateController.navigateLink('/ab/cde?z=fg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'cde');
            assert.strictEqual(stateController.stateContext.data.z, 'fg');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ ab/cd/efg'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cd/efg/h'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab//efg'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('//cd/efg'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/ab/cd/efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg?z=hi');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cde' }), '/ab/cde');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cde', z: 'fg' }), '/ab/cde?z=fg');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'efg' }), null);
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param One Optional Four Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}/c/{y?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab/yy/c/xyz');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'yy');
            assert.strictEqual(stateController.stateContext.data.y, 'xyz');
            stateController.navigateLink('/ab/yy/c/xyz?z=xx');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'yy');
            assert.strictEqual(stateController.stateContext.data.y, 'xyz');
            assert.strictEqual(stateController.stateContext.data.z, 'xx');
            stateController.navigateLink('/ab/yy/c');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'yy');
            stateController.navigateLink('/ab/yy/c?z=xx');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'yy');
            assert.strictEqual(stateController.stateContext.data.z, 'xx');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ ab/yy/c/xyz'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/b/c/d/e'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/c'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/b/c//d'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab//b/c/d'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'yy', y: 'xyz' }), '/ab/yy/c/xyz');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'yy', y: 'xyz', z: 'xx' }), '/ab/yy/c/xyz?z=xx');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'yy' }), '/ab/yy/c');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'yy', z: 'xx' }), '/ab/yy/c?z=xx');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'xyz' }), null);
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('One Param One Mixed Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab{x}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abcde');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'cde');
            stateController.navigateLink('/abcde?y=fg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'cde');
            assert.strictEqual(stateController.stateContext.data.y, 'fg');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ab/cde'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abcd//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cde' }), '/abcde');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cde', y: 'fg' }), '/abcde?y=fg');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param One Mixed Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab{x}e{y}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abcdefgh');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'fgh');
            stateController.navigateLink('/abcdefgh?z=i');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'fgh');
            assert.strictEqual(stateController.stateContext.data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ abcdefgh'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cdefgh'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abcdefgh//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abcde'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd', y: 'fgh' }), '/abcdefgh');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd', y: 'fgh', z: 'i' }), '/abcdefgh?z=i');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'fghh' }), null);
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param One Optional Two Segment One Mixed', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}ab/{y?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abcab/de');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'abc');
            assert.strictEqual(stateController.stateContext.data.y, 'de');
            stateController.navigateLink('/abcab/de?z=f');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'abc');
            assert.strictEqual(stateController.stateContext.data.y, 'de');
            assert.strictEqual(stateController.stateContext.data.z, 'f');
            stateController.navigateLink('/abcab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'abc');
            stateController.navigateLink('/abcab?z=de');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'abc');
            assert.strictEqual(stateController.stateContext.data.z, 'de');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/abcab /de'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abcab/de/fg'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abcab//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/de'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'abc', y: 'de' }), '/abcab/de');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'abc', y: 'de', z: 'f' }), '/abcab/de?z=f');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'abc' }), '/abcab');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'abc', z: 'de' }), '/abcab?z=de');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'de' }), null);
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('One Param One Segment Default', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaults: { x: 'cde' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            stateController.navigateLink('/ab?z=cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            assert.strictEqual(stateController.stateContext.data.z, 'cd');
            stateController.navigateLink('/');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'cde');
            stateController.navigateLink('/?z=fg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'cde');
            assert.strictEqual(stateController.stateContext.data.z, 'fg');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ab/cd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab//'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab' }), '/ab');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', z: 'cd' }), '/ab?z=cd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cde' }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cde', z: 'fg' }), '/?z=fg');
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { z: 'fg' }), '/?z=fg');
        });
    });

    describe('One Param One Segment Default Number', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaults: { x: 345 }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/12');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 12);
            stateController.navigateLink('/12?z=34');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 12);
            assert.strictEqual(stateController.stateContext.data.z, '34');
            stateController.navigateLink('/');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 345);
            stateController.navigateLink('/?z=67');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 345);
            assert.strictEqual(stateController.stateContext.data.z, '67');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/12/34'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/12//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/true'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/1a2'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/12?x=34'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 12 }), '/12');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 12, z: '34' }), '/12?z=34');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 345 }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 345, z: '67' }), '/?z=67');
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { z: '67' }), '/?z=67');
        });
    });

    describe('One Param One Segment Default Boolean', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaults: { x: true }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/false');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, false);
            stateController.navigateLink('/false?z=true');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, false);
            assert.strictEqual(stateController.stateContext.data.z, 'true');
            stateController.navigateLink('/');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, true);
            stateController.navigateLink('/?z=false');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, true);
            assert.strictEqual(stateController.stateContext.data.z, 'false');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/false/true'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/false//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/1'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/fals'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/false?x=true'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: false }), '/false');
            assert.strictEqual(stateController.getNavigationLink('d', { x: false, z: 'true' }), '/false?z=true');
            assert.strictEqual(stateController.getNavigationLink('d', { x: true }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: true, z: 'false' }), '/?z=false');
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { z: 'false' }), '/?z=false');
        });
    });

    describe('One Param One Segment Default Date', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaults: { x: new Date(2010, 3, 7) }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/2011-08-03');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(+stateController.stateContext.data.x, +new Date(2011, 7, 3));
            stateController.navigateLink('/2011-12-31');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(+stateController.stateContext.data.x, +new Date(2011, 11, 31));
            stateController.navigateLink('/2011-8-3');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(+stateController.stateContext.data.x, +new Date(2011, 7, 3));
            stateController.navigateLink('/2011-08-03?z=2012-09-04');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(+stateController.stateContext.data.x, +new Date(2011, 7, 3));
            assert.strictEqual(stateController.stateContext.data.z, '2012-09-04');
            stateController.navigateLink('/');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(+stateController.stateContext.data.x, +new Date(2010, 3, 7));
            stateController.navigateLink('/?z=2012-09-04');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(+stateController.stateContext.data.x, +new Date(2010, 3, 7));
            assert.strictEqual(stateController.stateContext.data.z, '2012-09-04');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/2011-08-03/2012-09-04'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/2011-08-03//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/true'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/2011/08/03'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/2011-08'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/2011-08-a'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/2011-08-03-01'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/2011-08-03?x=2012-09-04'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: new Date(2011, 7, 3) }), '/2011-08-03');
            assert.strictEqual(stateController.getNavigationLink('d', { x: new Date(2011, 11, 31) }), '/2011-12-31');
            assert.strictEqual(stateController.getNavigationLink('d', { x: new Date(2011, 7, 3), z: '2012-09-04' }), '/2011-08-03?z=2012-09-04');
            assert.strictEqual(stateController.getNavigationLink('d', { x: new Date(2010, 3, 7) }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: new Date(2010, 3, 7), z: '2012-09-04' }), '/?z=2012-09-04');
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { z: '2012-09-04' }), '/?z=2012-09-04');
        });
    });

    describe('No Param One Segment Default Type Number', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'abc', defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 0);
            stateController.navigateLink('/abc?x=12');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 12);
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ abc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc '), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/dbc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/c'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/adc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/aabc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc?x=true'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc?x=1a2'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc?x=12&x=345'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/abc');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 12 }), '/abc?x=12');
        });
    });

    describe('No Param One Segment Default Type Boolean', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'abc', defaultTypes: { x: 'boolean' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 0);
            stateController.navigateLink('/abc?x=true');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, true);
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ abc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc '), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/dbc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/c'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/adc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/aabc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc?x=1'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc?x=tru'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc?x=true&x=false'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/abc');
            assert.strictEqual(stateController.getNavigationLink('d', { x: true }), '/abc?x=true');
        });
    });

    describe('No Param One Segment Default Type Date', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'abc', defaultTypes: { x: 'date' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 0);
            stateController.navigateLink('/abc?x=2011-08-03');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(+stateController.stateContext.data.x, +new Date(2011, 7, 3));
            stateController.navigateLink('/abc?x=2011-8-3');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(+stateController.stateContext.data.x, +new Date(2011, 7, 3));
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ abc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc '), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/dbc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/c'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/adc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/aabc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc?x=true'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc?x=2011/08/03'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc?x=2011-08'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc?x=2011-08-a'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc?x=2011-08-03-01'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc?x=2011-08-03&x=2012-09-04'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/abc');
            assert.strictEqual(stateController.getNavigationLink('d', { x: new Date(2011, 7, 3) }), '/abc?x=2011-08-03');
        });
    });

    describe('One Param Two Segment Default', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}', defaults: { x: 'ccdd' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab/cde');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'cde');
            stateController.navigateLink('/ab/cde?y=fg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'cde');
            assert.strictEqual(stateController.stateContext.data.y, 'fg');
            stateController.navigateLink('/ab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'ccdd');
            stateController.navigateLink('/ab?y=ee');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'ccdd');
            assert.strictEqual(stateController.stateContext.data.y, 'ee');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ ab/cd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc/d'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/d/e'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/a/b/d'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/cab/d'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cde' }), '/ab/cde');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cde', y: 'fg' }), '/ab/cde?y=fg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ccdd' }), '/ab');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ccdd', y: 'ee' }), '/ab?y=ee');
            assert.strictEqual(stateController.getNavigationLink('d'), '/ab');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'ee' }), '/ab?y=ee');
        });
    });

    describe('Two Param Two Segment Two Default', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{y}', defaults: { x: 'ab', y: 'c' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/aa/bbb');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'bbb');
            stateController.navigateLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'bbb');
            assert.strictEqual(stateController.stateContext.data.z, 'cccc');
            stateController.navigateLink('/aa');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'c');
            stateController.navigateLink('/aa?z=d');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'c');
            assert.strictEqual(stateController.stateContext.data.z, 'd');
            stateController.navigateLink('/');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            assert.strictEqual(stateController.stateContext.data.y, 'c');
            stateController.navigateLink('/?z=d');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            assert.strictEqual(stateController.stateContext.data.y, 'c');
            assert.strictEqual(stateController.stateContext.data.z, 'd');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/aa/bbb/e'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/aa//'), /Url is invalid/, '');
        });
   
        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'c' }), '/aa');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'c', z: 'd' }), '/aa?z=d');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'bbb' }), '/ab/bbb');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'bbb', z: 'cccc' }), '/ab/bbb?z=cccc');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'c' }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'c', z: 'd' }), '/?z=d');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa' }), '/aa');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', z: 'd' }), '/aa?z=d');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', y: 'c' }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', y: 'c', z: 'd' }), '/?z=d');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab' }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', z: 'd' }), '/?z=d');
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { z: 'd' }), '/?z=d');
        });
 });

    describe('Two Param Two Segment Default', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{y}', defaults: { y: 'ab' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/aa/bbb');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'bbb');
            stateController.navigateLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'bbb');
            assert.strictEqual(stateController.stateContext.data.z, 'cccc');
            stateController.navigateLink('/aa');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'ab');
            stateController.navigateLink('/aa?z=bb');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'ab');
            assert.strictEqual(stateController.stateContext.data.z, 'bb');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/aa/bbb/e'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/aa//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'ab' }), '/aa');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'ab', z: 'bb' }), '/aa?z=bb');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa' }), '/aa');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', z: 'bb' }), '/aa?z=bb');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'bbb' }), null);
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param One Optional Two Segment Default', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{y?}', defaults: { x: 'abc' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/aa/bbb');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'bbb');
            stateController.navigateLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'bbb');
            assert.strictEqual(stateController.stateContext.data.z, 'cccc');
            stateController.navigateLink('/aab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'aab');
            stateController.navigateLink('/aab?z=ccd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'aab');
            assert.strictEqual(stateController.stateContext.data.z, 'ccd');
            stateController.navigateLink('/');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'abc');
            stateController.navigateLink('/?z=de');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'abc');
            assert.strictEqual(stateController.stateContext.data.z, 'de');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/aa/bbb/e'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/aa//'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'abc', y: 'bbb' }), '/abc/bbb');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'abc', y: 'bbb', z: 'cccc' }), '/abc/bbb?z=cccc');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'bbb' }), '/abc/bbb');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'bbb', z: 'cccc' }), '/abc/bbb?z=cccc');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aab' }), '/aab');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aab', z: 'ccd' }), '/aab?z=ccd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'abc' }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'abc', z: 'de' }), '/?z=de');
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { z: 'de' }), '/?z=de');
        });
    });

    describe('Four Param Two Optional Five Segment Default', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{w}/{x}/{y?}/{z?}', defaults: { w: 'abc', x: 'de' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab/cd/ef/hi/jk');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 4);
            assert.strictEqual(stateController.stateContext.data.w, 'cd');
            assert.strictEqual(stateController.stateContext.data.x, 'ef');
            assert.strictEqual(stateController.stateContext.data.y, 'hi');
            assert.strictEqual(stateController.stateContext.data.z, 'jk');
            stateController.navigateLink('/ab/cd/ef/hi/jk?a=lm');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 5);
            assert.strictEqual(stateController.stateContext.data.w, 'cd');
            assert.strictEqual(stateController.stateContext.data.x, 'ef');
            assert.strictEqual(stateController.stateContext.data.y, 'hi');
            assert.strictEqual(stateController.stateContext.data.z, 'jk');
            assert.strictEqual(stateController.stateContext.data.a, 'lm');
            stateController.navigateLink('/ab/cde/fg/h');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.w, 'cde');
            assert.strictEqual(stateController.stateContext.data.x, 'fg');
            assert.strictEqual(stateController.stateContext.data.y, 'h');
            stateController.navigateLink('/ab/cde/fg/h?a=i');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 4);
            assert.strictEqual(stateController.stateContext.data.w, 'cde');
            assert.strictEqual(stateController.stateContext.data.x, 'fg');
            assert.strictEqual(stateController.stateContext.data.y, 'h');
            assert.strictEqual(stateController.stateContext.data.a, 'i');
            stateController.navigateLink('/ab/cc/def');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.w, 'cc');
            assert.strictEqual(stateController.stateContext.data.x, 'def');
            stateController.navigateLink('/ab/cc/def?a=gg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.w, 'cc');
            assert.strictEqual(stateController.stateContext.data.x, 'def');
            assert.strictEqual(stateController.stateContext.data.a, 'gg');
            stateController.navigateLink('/ab/ccdd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.w, 'ccdd');
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            stateController.navigateLink('/ab/ccdd?a=fg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.w, 'ccdd');
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            assert.strictEqual(stateController.stateContext.data.a, 'fg');
            stateController.navigateLink('/ab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.w, 'abc');
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            stateController.navigateLink('/ab?a=fg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.w, 'abc');
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            assert.strictEqual(stateController.stateContext.data.a, 'fg');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ ab/cde/fg/h'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cde/fg/h/ij/k'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cde/fg/h//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cde/fg//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cd//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cd', x: 'ef', y: 'hi', z: 'jk' }), '/ab/cd/ef/hi/jk');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cd', x: 'ef', y: 'hi', z: 'jk', a: 'lm' }), '/ab/cd/ef/hi/jk?a=lm');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cd', x: 'de', y: 'hi', z: 'jk' }), '/ab/cd/de/hi/jk');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cd', x: 'de', y: 'hi', z: 'jk', a: 'lm' }), '/ab/cd/de/hi/jk?a=lm');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', x: 'ef', y: 'hi', z: 'jk' }), '/ab/abc/ef/hi/jk');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', x: 'ef', y: 'hi', z: 'jk', a: 'lm' }), '/ab/abc/ef/hi/jk?a=lm');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', x: 'de', y: 'hi', z: 'jk' }), '/ab/abc/de/hi/jk');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', x: 'de', y: 'hi', z: 'jk', a: 'lm' }), '/ab/abc/de/hi/jk?a=lm');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ef', y: 'hi', z: 'jk' }), '/ab/abc/ef/hi/jk');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ef', y: 'hi', z: 'jk', a: 'lm' }), '/ab/abc/ef/hi/jk?a=lm');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', y: 'hi', z: 'jk' }), '/ab/abc/de/hi/jk');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', y: 'hi', z: 'jk', a: 'lm' }), '/ab/abc/de/hi/jk?a=lm');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', y: 'hi' }), '/ab/abc/de/hi');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', y: 'hi', a: 'lm' }), '/ab/abc/de/hi?a=lm');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ef' }), '/ab/abc/ef');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ef', a: 'lm' }), '/ab/abc/ef?a=lm');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de' }), '/ab');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', a: 'lm' }), '/ab?a=lm');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'hi', z: 'jk' }), '/ab/abc/de/hi/jk');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'hi', z: 'jk', a: 'lm' }), '/ab/abc/de/hi/jk?a=lm');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'hi' }), '/ab/abc/de/hi');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'hi', a: 'lm' }), '/ab/abc/de/hi?a=lm');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cde', x: 'fg', y: 'h' }), '/ab/cde/fg/h');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cde', x: 'fg', y: 'h', a: 'i' }), '/ab/cde/fg/h?a=i');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', x: 'de', y: 'h' }), '/ab/abc/de/h');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', x: 'de', y: 'h', a: 'i' }), '/ab/abc/de/h?a=i');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cde', y: 'h', z: 'jk' }), '/ab/cde/de/h/jk');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cde', y: 'h', z: 'jk', a: 'lm' }), '/ab/cde/de/h/jk?a=lm');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', y: 'h', z: 'jk' }), '/ab/abc/de/h/jk');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', y: 'h', z: 'jk', a: 'lm' }), '/ab/abc/de/h/jk?a=lm');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cde', y: 'h' }), '/ab/cde/de/h');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cde', y: 'h', a: 'i' }), '/ab/cde/de/h?a=i');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', y: 'h' }), '/ab/abc/de/h');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', y: 'h', a: 'i' }), '/ab/abc/de/h?a=i');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cc', x: 'def' }), '/ab/cc/def');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cc', x: 'def', a: 'gg' }), '/ab/cc/def?a=gg');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cc', x: 'de' }), '/ab/cc');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cc', x: 'de', a: 'gg' }), '/ab/cc?a=gg');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', x: 'de' }), '/ab');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', x: 'de', a: 'fg' }), '/ab?a=fg');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', x: 'def' }), '/ab/abc/def');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', x: 'def', a: 'gg' }), '/ab/abc/def?a=gg');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'ccdd' }), '/ab/ccdd');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'ccdd', a: 'gg' }), '/ab/ccdd?a=gg');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc' }), '/ab');
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', a: 'fg' }), '/ab?a=fg');
            assert.strictEqual(stateController.getNavigationLink('d'), '/ab');
            assert.strictEqual(stateController.getNavigationLink('d', { a: 'fg' }), '/ab?a=fg');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { z: 'jk' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cde', z: 'jk' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', z: 'jk' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'fg', z: 'jk' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', z: 'jk' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', x: 'fg', z: 'jk' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cde', x: 'de', z: 'jk' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'cde', x: 'fg', z: 'jk' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { w: 'abc', x: 'de', z: 'jk' }), null);
        });
    });

    describe('Spaces', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
        });
        it('should match', function() {
            stateController.navigateLink('/   a  ');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, '   a  ');
            stateController.navigateLink('/   a  ?y=   b  ');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, '   a  ');
            assert.strictEqual(stateController.stateContext.data.y, '   b  ');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: '   a  ' }), '/%20%20%20a%20%20');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '   a  ', y: '   b  ' }), '/%20%20%20a%20%20?y=%20%20%20b%20%20');
        });
    });

    describe('Multi Char Param', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'a/{someVar}', trackCrumbTrail: false }]}
                ]);
        });
        it('should match', function() {
            stateController.navigateLink('/a/someVal');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.someVar, 'someVal');
            stateController.navigateLink('/a/someVal?anotherVar=anotherVal');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.someVar, 'someVal');
            assert.strictEqual(stateController.stateContext.data.anotherVar, 'anotherVal');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { someVar: 'someVal' }), '/a/someVal');
            assert.strictEqual(stateController.getNavigationLink('d', { someVar: 'someVal', anotherVar: 'anotherVal' }), '/a/someVal?anotherVar=anotherVal');
        });
    });

    describe('Match Slash', function () {
        it('should match', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            stateController.navigateLink('abc/');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'abc');
        });
    });

    describe('Reserved Url Character', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'a/{=*"()\'-_+~@:?><.;[],!£$%^#&}', defaults: { '=*"()\'-_+~@:?><.;[],!£$%^#&': '*="()\'-__+~@:?><.;[],!£$%^#&' }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            stateController.navigateLink('/a/*%3D%22()\'-0__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data['=*"()\'-_+~@:?><.;[],!£$%^#&'], '*="()\'-__+~@:?><.;[],!£$%^#&');
            stateController.navigateLink('/a/*%3D%22()\'-0__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26?*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data['=*"()\'-_+~@:?><.;[],!£$%^#&'], '*="()\'-__+~@:?><.;[],!£$%^#&');
            assert.strictEqual(stateController.stateContext.data['*="()\'-__+~@:?><.;[],!£$%^#&'], '*="()\'-_+~@:?><.;[],!£$%^#&');
            stateController.navigateLink('/a');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data['=*"()\'-_+~@:?><.;[],!£$%^#&'], '*="()\'-__+~@:?><.;[],!£$%^#&');
            stateController.navigateLink('/a?*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data['=*"()\'-_+~@:?><.;[],!£$%^#&'], '*="()\'-__+~@:?><.;[],!£$%^#&');
            assert.strictEqual(stateController.stateContext.data['*="()\'-__+~@:?><.;[],!£$%^#&'], '*="()\'-_+~@:?><.;[],!£$%^#&');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { '=*"()\'-_+~@:?><.;[],!£$%^#&': '*="()\'-_+~@:?><.;[],!£$%^#&' }), '/a/*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(stateController.getNavigationLink('d', { '=*"()\'-_+~@:?><.;[],!£$%^#&': '*="()\'-_+~@:?><.;[],!£$%^#&', '*="()\'-__+~@:?><.;[],!£$%^#&': '*="()\'-_+~@:?><.;[],!£$%^#&'}), '/a/*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26?*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(stateController.getNavigationLink('d', { '=*"()\'-_+~@:?><.;[],!£$%^#&': '*="()\'-__+~@:?><.;[],!£$%^#&' }), '/a');
            assert.strictEqual(stateController.getNavigationLink('d', { '=*"()\'-_+~@:?><.;[],!£$%^#&': '*="()\'-__+~@:?><.;[],!£$%^#&', '*="()\'-__+~@:?><.;[],!£$%^#&': '*="()\'-_+~@:?><.;[],!£$%^#&'}), '/a?*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(stateController.getNavigationLink('d'), '/a');
            assert.strictEqual(stateController.getNavigationLink('d', { '*="()\'-__+~@:?><.;[],!£$%^#&': '*="()\'-_+~@:?><.;[],!£$%^#&' }), '/a?*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
        });
    });

    describe('Reserved Regex Character', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '.+*\^$\[\]()\'/{x}', trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            stateController.navigateLink('/.+*\^$\[\]()\'/abc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'abc');
            stateController.navigateLink('/.+*\^$\[\]()\'/abc?y=de');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'abc');
            assert.strictEqual(stateController.stateContext.data.y, 'de');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'abc' }), '/.+*\^$\[\]()\'/abc');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'abc', y: 'de' }), '/.+*\^$\[\]()\'/abc?y=de');
        });
    });

    describe('One Param Optional Mandatory One Mixed Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab{x?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abcde');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'cde');
            stateController.navigateLink('/abcde?y=fg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'cde');
            assert.strictEqual(stateController.stateContext.data.y, 'fg');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ab/cde'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abcd//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cde' }), '/abcde');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cde', y: 'fg' }), '/abcde?y=fg');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param One Optional Mandatory Three Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x?}/{y}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'efg');
            stateController.navigateLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'efg');
            assert.strictEqual(stateController.stateContext.data.z, 'hi');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ ab/cd/efg'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cd/efg/h'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab//efg'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('//cd/efg'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cde'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/ab/cd/efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg?z=hi');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'efg' }), null);
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param Two Segment Default Mandatory', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{y}', defaults: { x: 'ab' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/aa/bbb');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'bbb');
            stateController.navigateLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'aa');
            assert.strictEqual(stateController.stateContext.data.y, 'bbb');
            assert.strictEqual(stateController.stateContext.data.z, 'cccc');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/aa/bbb/e'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/aa//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/aa'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'bbb' }), '/ab/bbb');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'bbb', z: 'cccc' }), '/ab/bbb?z=cccc');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'aa' }), null);
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param One Optional Mandatory Four Segment Default Mandatory', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x?}/{y}/c', defaults: { y: 'ee' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab/cd/efg/c');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'efg');
            stateController.navigateLink('/ab/cd/efg/c?z=hi');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'efg');
            assert.strictEqual(stateController.stateContext.data.z, 'hi');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ ab/cd/efg/c'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cd/efg'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cd/efg/c//'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab//efg/c'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cd//c'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab///c'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/c'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/ab/cd/efg/c');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg/c?z=hi');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd' }), '/ab/cd/ee/c');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd', z: 'ef' }), '/ab/cd/ee/c?z=ef');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'efg' }), null);
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('Extra Defaults', function () {
        it('should match', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaults: { x: 'a', y: 'b' }, trackCrumbTrail: false }]}
                ]);
            stateController.navigateLink('/');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'a');
            assert.strictEqual(stateController.stateContext.data.y, 'b');
            stateController.navigateLink('/?z=c');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'a');
            assert.strictEqual(stateController.stateContext.data.y, 'b');
            assert.strictEqual(stateController.stateContext.data.z, 'c');
        });
    });

    describe('Case Insensitive', function () {
        it('should match', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'abc/{x}', trackCrumbTrail: false }]}
                ]);
            stateController.navigateLink('/AbC/aBc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'aBc');
            stateController.navigateLink('/AbC/aBc?y=dE');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'aBc');
            assert.strictEqual(stateController.stateContext.data.y, 'dE');
        });
    });

    describe('Multiple Routes', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}', trackCrumbTrail: false },
                    { key: 's1', route: 'cd/{x}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab/ef');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'ef');
            stateController.navigateLink('/ab/ef?y=gh');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'ef');
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            stateController.navigateLink('/cd/ef');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'ef');
            stateController.navigateLink('/cd/ef?y=gh');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'ef');
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/aa/bbb'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/cd'), /Url is invalid/, '');
        });
    });

    describe('Two Route One With Param', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['', 'abc/{x}'], trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 0);
            stateController.navigateLink('/?y=d');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.y, 'd');
            stateController.navigateLink('/abc/de');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            stateController.navigateLink('/abc/de?y=f');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            assert.strictEqual(stateController.stateContext.data.y, 'f');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/abc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/de'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ abc/de'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('//abc/de'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'd' }), '/?y=d');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', y: 'f' }), '/abc/de?y=f');
        });
    });

    describe('Two Route Param', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['abc/{x}', 'def/{y}'], trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abc/de');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            stateController.navigateLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            assert.strictEqual(stateController.stateContext.data.z, 'f');
            stateController.navigateLink('/def/gh');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            stateController.navigateLink('/def/gh?z=i');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            assert.strictEqual(stateController.stateContext.data.z, 'i');
            stateController.navigateLink('/abc/de?y=fg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            assert.strictEqual(stateController.stateContext.data.y, 'fg');
            stateController.navigateLink('/abc/de?y=fg&z=h');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            assert.strictEqual(stateController.stateContext.data.y, 'fg');
            assert.strictEqual(stateController.stateContext.data.z, 'h');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/abc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/def'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ abc/de'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ def/gh'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abd/ef'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc/de/f'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/def/gh/i'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'gh' }), '/def/gh');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'gh', z: 'i' }), '/def/gh?z=i');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', y: 'gh' }), '/abc/de?y=gh');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', y: 'gh', z: 'i' }), '/abc/de?y=gh&z=i');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), null);
            assert.strictEqual(stateController.getNavigationLink('d', { z: 'g' }), null);
        });
    });

    describe('Two Route Parent Child', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['abc/{x}', 'abc/{x}/def/{y}'], trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abc/de');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            stateController.navigateLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            assert.strictEqual(stateController.stateContext.data.z, 'f');
            stateController.navigateLink('/abc/de/def/gh');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            stateController.navigateLink('/abc/de/def/gh?z=i');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            assert.strictEqual(stateController.stateContext.data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/abc'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc/de/def'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc/de/def/gh/i'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abd/de'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc/de/deg/gh'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ abc/de'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ abc/de/def/gh'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', y: 'gh' }), '/abc/de/def/gh');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', y: 'gh', z: 'f' }), '/abc/de/def/gh?z=f');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), null);
            assert.strictEqual(stateController.getNavigationLink('d', { z: 'g' }), null);
        });
    });

    describe('Two Route Default', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['abc/{x}', 'def/{y}'], defaults: { x: 'd' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'd');
            stateController.navigateLink('/abc?z=e');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'd');
            assert.strictEqual(stateController.stateContext.data.z, 'e');
            stateController.navigateLink('/abc/de');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            stateController.navigateLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            assert.strictEqual(stateController.stateContext.data.z, 'f');
            stateController.navigateLink('/def/gh');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'd');
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            stateController.navigateLink('/def/gh?z=i');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'd');
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            assert.strictEqual(stateController.stateContext.data.z, 'i');
            stateController.navigateLink('/abc/de?y=gh');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            stateController.navigateLink('/abc/de?y=gh&z=i');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            assert.strictEqual(stateController.stateContext.data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/def'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ abc/de'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ def/gh'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abd/ef'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc/de/f'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/def/gh/i'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/abc');
            assert.strictEqual(stateController.getNavigationLink('d', { z: 'e' }), '/abc?z=e');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'gh' }), '/def/gh');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'gh', z: 'i' }), '/def/gh?z=i');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', y: 'gh' }), '/abc/de?y=gh');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', y: 'gh', z: 'i' }), '/abc/de?y=gh&z=i');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'd', y: 'gh' }), '/def/gh');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'd', y: 'gh', z: 'i' }), '/def/gh?z=i');
        });
    });

    describe('Two Route Optional', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['abc/{x?}', 'abc/{x}/def/{y}'], trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 0);
            stateController.navigateLink('/abc?z=d');
            assert.strictEqual(stateController.stateContext.data.z, 'd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            stateController.navigateLink('/abc/de');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            stateController.navigateLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            assert.strictEqual(stateController.stateContext.data.z, 'f');
            stateController.navigateLink('/abc/de/def/gh');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            stateController.navigateLink('/abc/de/def/gh?z=i');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'de');
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            assert.strictEqual(stateController.stateContext.data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/abc/de/def'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc/de/def/gh/i'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abd/de'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/abc/de/deg/gh'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ abc/de'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ abc/de/def/gh'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/abc');
            assert.strictEqual(stateController.getNavigationLink('d', { z: 'd' }), '/abc?z=d');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', y: 'gh' }), '/abc/de/def/gh');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'de', y: 'gh', z: 'f' }), '/abc/de/def/gh?z=f');
        });
    });

    describe('Two Route Default Number', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['def/{y}', 'abc/{x}'], defaults: { x: 2 }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abc');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 2);
            stateController.navigateLink('/abc?z=e');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 2);
            assert.strictEqual(stateController.stateContext.data.z, 'e');
            stateController.navigateLink('/abc/3');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 3);
            stateController.navigateLink('/abc/3?z=f');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 3);
            assert.strictEqual(stateController.stateContext.data.z, 'f');
            stateController.navigateLink('/def/gh');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 2);
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            stateController.navigateLink('/def/gh?z=i');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 2);
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            assert.strictEqual(stateController.stateContext.data.z, 'i');
            stateController.navigateLink('/def/gh?x=3');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 3);
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            stateController.navigateLink('/def/gh?x=3&z=i');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 3);
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            assert.strictEqual(stateController.stateContext.data.z, 'i');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/abc');
            assert.strictEqual(stateController.getNavigationLink('d', { z: 'e' }), '/abc?z=e');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3 }), '/abc/3');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3, z: 'f' }), '/abc/3?z=f');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'gh' }), '/def/gh');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'gh', z: 'i' }), '/def/gh?z=i');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3, y: 'gh' }), '/def/gh?x=3');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3, y: 'gh', z: 'i' }), '/def/gh?x=3&z=i');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 2, y: 'gh' }), '/def/gh');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 2, y: 'gh', z: 'i' }), '/def/gh?z=i');
        });
    });

    describe('Two Route Default Type Number', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['def/{y}', 'abc/{x}'], defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abc/3');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 3);
            stateController.navigateLink('/abc/3?z=f');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 3);
            assert.strictEqual(stateController.stateContext.data.z, 'f');
            stateController.navigateLink('/def/gh');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            stateController.navigateLink('/def/gh?z=i');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            assert.strictEqual(stateController.stateContext.data.z, 'i');
            stateController.navigateLink('/def/gh?x=3');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 3);
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            stateController.navigateLink('/def/gh?x=3&z=i');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 3);
            assert.strictEqual(stateController.stateContext.data.y, 'gh');
            assert.strictEqual(stateController.stateContext.data.z, 'i');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3 }), '/abc/3');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3, z: 'f' }), '/abc/3?z=f');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'gh' }), '/def/gh');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 'gh', z: 'i' }), '/def/gh?z=i');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3, y: 'gh' }), '/def/gh?x=3');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3, y: 'gh', z: 'i' }), '/def/gh?x=3&z=i');
        });
    });

    describe('Without Types', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackTypes: false, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abc');
            assert.strictEqual(stateController.stateContext.data.x, 'abc');
            stateController.navigateLink('/3');
            assert.strictEqual(stateController.stateContext.data.x, '3');
            stateController.navigateLink('/true');
            assert.strictEqual(stateController.stateContext.data.x, 'true');
            stateController.navigateLink('/0_1_2_');
            assert.strictEqual(stateController.stateContext.data.x, '0_1_2_');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'abc' }), '/abc');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3 }), '/3');
            assert.strictEqual(stateController.getNavigationLink('d', { x: true }), '/true');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '0_1_2_' }), '/0_1_2_');
        });
    });

    describe('Without Types Default', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackTypes: false, defaults: { x: 2 }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/');
            assert.strictEqual(stateController.stateContext.data.x, 2);
            stateController.navigateLink('/3');
            assert.strictEqual(stateController.stateContext.data.x, 3);
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/a'), /not a valid number/, '');
            assert.throws(() => stateController.navigateLink('/true'), /not a valid number/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 2 }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '2' }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3 }), '/3');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '3' }), '/3');
        });
    });

    describe('Without Types Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackTypes: false, defaultTypes: { x: 'boolean' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/true');
            assert.strictEqual(stateController.stateContext.data.x, true);
            stateController.navigateLink('/false');
            assert.strictEqual(stateController.stateContext.data.x, false);
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/a'), /not a valid boolean/, '');
            assert.throws(() => stateController.navigateLink('/2'), /not a valid boolean/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: true }), '/true');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'false' }), '/false');
        });
    });

    describe('Without Types Default And Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackTypes: false, defaults: { x: '2' }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/');
            assert.strictEqual(stateController.stateContext.data.x, '2');
            stateController.navigateLink('/3');
            assert.strictEqual(stateController.stateContext.data.x, 3);
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/a'), /not a valid number/, '');
            assert.throws(() => stateController.navigateLink('/true'), /not a valid number/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 2 }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '2' }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3 }), '/3');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '3' }), '/3');
        });
    });

    describe('Without Types Conflicting Default And Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackTypes: false, defaults: { x: 'a' }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });
        it('should match', function() {
            stateController.navigateLink('/');
            assert.strictEqual(stateController.stateContext.data.x, 'a');
            stateController.navigateLink('/a');
            assert.strictEqual(stateController.stateContext.data.x, 'a');
        });
        
        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/b'), /not a valid number/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'a' }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3 }), '/3');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '3' }), '/3');
        });
    });

    describe('Without Types Query String', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackTypes: false, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            stateController.navigateLink('/');
            assert.strictEqual(stateController.stateContext.data.x, undefined);
            stateController.navigateLink('/?x=3');
            assert.strictEqual(stateController.stateContext.data.x, '3');
            stateController.navigateLink('/?x=true');
            assert.strictEqual(stateController.stateContext.data.x, 'true');
            stateController.navigateLink('/?x=0_1_2_');
            assert.strictEqual(stateController.stateContext.data.x, '0_1_2_');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'abc' }), '/?x=abc');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3 }), '/?x=3');
            assert.strictEqual(stateController.getNavigationLink('d', { x: true }), '/?x=true');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '0_1_2_' }), '/?x=0_1_2_');
        });
    });

    describe('Without Types Query String Default', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackTypes: false, defaults: { x: 2 }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/');
            assert.strictEqual(stateController.stateContext.data.x, 2);
            stateController.navigateLink('/?x=3');
            assert.strictEqual(stateController.stateContext.data.x, 3);
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/?x=a'), /not a valid number/, '');
            assert.throws(() => stateController.navigateLink('/?x=true'), /not a valid number/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 2 }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '2' }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3 }), '/?x=3');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '3' }), '/?x=3');
        });
    });

    describe('Without Types Query String Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackTypes: false, defaultTypes: { x: 'boolean' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/?x=true');
            assert.strictEqual(stateController.stateContext.data.x, true);
            stateController.navigateLink('/?x=false');
            assert.strictEqual(stateController.stateContext.data.x, false);
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/?x=a'), /not a valid boolean/, '');
            assert.throws(() => stateController.navigateLink('/?x=2'), /not a valid boolean/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: true }), '/?x=true');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'false' }), '/?x=false');
        });
    });

    describe('Without Types Query String Default And Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackTypes: false, defaults: { x: '2' }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/');
            assert.strictEqual(stateController.stateContext.data.x, '2');
            stateController.navigateLink('/?x=3');
            assert.strictEqual(stateController.stateContext.data.x, 3);
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/?x=a'), /not a valid number/, '');
            assert.throws(() => stateController.navigateLink('/?x=true'), /not a valid number/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 2 }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '2' }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3 }), '/?x=3');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '3' }), '/?x=3');
        });
    });

    describe('Without Types Query String Conflicting Default And Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackTypes: false, defaults: { x: 'a' }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            stateController.navigateLink('/');
            assert.strictEqual(stateController.stateContext.data.x, 'a');
            stateController.navigateLink('/?x=a');
            assert.strictEqual(stateController.stateContext.data.x, 'a');
        });
        
        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/?x=b'), /not a valid number/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'a' }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3 }), '/?x=3');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '3' }), '/?x=3');
        });
    });

    describe('Empty String', function () {
        it('should build', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            assert.strictEqual(stateController.getNavigationLink('d', { x: '' }), null);
        });
    });

    describe('Without Types Two Route Default', function () {
        it('should build', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['{x}', 'a/{y}'], trackTypes: false, defaults: { x: 2 }, trackCrumbTrail: false }]}
                ]);
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 2, y: 1 }), '/a/1');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '2', y: 1 }), '/a/1');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 1 }), '/1');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '1' }), '/1');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 2 }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '2' }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { y: 1 }), '/a/1');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 1, y: 2 }), '/1?y=2');
        });
    });

    describe('Array Query String Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            stateController.navigateLink('/?x=Hello&x=World');
            assert.strictEqual(stateController.stateContext.data.x[0], 'Hello');
            assert.strictEqual(stateController.stateContext.data.x[1], 'World');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            stateController.navigateLink('/?x=H1-ello&x=W2-orld');
            assert.strictEqual(stateController.stateContext.data.x[0], 'H1-ello');
            assert.strictEqual(stateController.stateContext.data.x[1], 'W2-orld');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            stateController.navigateLink('/?x=H1-ello');
            assert.strictEqual(stateController.stateContext.data.x[0], 'H1-ello');
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            stateController.navigateLink('/?x=H2-ello');
            assert.strictEqual(stateController.stateContext.data.x[0], 'H2-ello');
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
        });
        
        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['Hello', 'World'] }), '/?x=Hello&x=World');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['H1-ello', 'W2-orld'] }), '/?x=H1-ello&x=W2-orld');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['H1-ello'] }), '/?x=H1-ello');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['H2-ello'] }), '/?x=H2-ello');
        });
    });

    describe('Array Param Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            stateController.navigateLink('/Hello1-World');
            assert.strictEqual(stateController.stateContext.data.x[0], 'Hello');
            assert.strictEqual(stateController.stateContext.data.x[1], 'World');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            stateController.navigateLink('/H12-ello1-W22-orld');
            assert.strictEqual(stateController.stateContext.data.x[0], 'H1-ello');
            assert.strictEqual(stateController.stateContext.data.x[1], 'W2-orld');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            stateController.navigateLink('/H12-ello');
            assert.strictEqual(stateController.stateContext.data.x[0], 'H1-ello');
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            stateController.navigateLink('/H22-ello');
            assert.strictEqual(stateController.stateContext.data.x[0], 'H2-ello');
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
        });
        
        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['Hello', 'World'] }), '/Hello1-World');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['H1-ello', 'W2-orld'] }), '/H12-ello1-W22-orld');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['H1-ello'] }), '/H12-ello');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['H2-ello'] }), '/H22-ello');
        });
    });

    describe('Array Query String Default Type Number', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'numberarray' }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            stateController.navigateLink('/?x=1&x=2&x=4');
            assert.strictEqual(stateController.stateContext.data.x[0], 1);
            assert.strictEqual(stateController.stateContext.data.x[1], 2);
            assert.strictEqual(stateController.stateContext.data.x[2], 4);
            assert.strictEqual(stateController.stateContext.data.x.length, 3);
        });
        
        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: [1, 2, 4] }), '/?x=1&x=2&x=4');
        });
    });

    describe('Array Query String Default Type Boolean', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'booleanarray' }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            stateController.navigateLink('/?x=true&x=false');
            assert.strictEqual(stateController.stateContext.data.x[0], true);
            assert.strictEqual(stateController.stateContext.data.x[1], false);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
        });
        
        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: [true, false] }), '/?x=true&x=false');
        });
    });

    describe('Without Types Array Query String Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackTypes: false, defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            stateController.navigateLink('/?x=He_llo&x=Wor-ld');
            assert.strictEqual(stateController.stateContext.data.x[0], 'He_llo');
            assert.strictEqual(stateController.stateContext.data.x[1], 'Wor-ld');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            stateController.navigateLink('/?x=1&x=2&x=4');
            assert.strictEqual(stateController.stateContext.data.x[0], '1');
            assert.strictEqual(stateController.stateContext.data.x[1], '2');
            assert.strictEqual(stateController.stateContext.data.x[2], '4');
            assert.strictEqual(stateController.stateContext.data.x.length, 3);
        });
        
        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['He_llo', 'Wor-ld'] }), '/?x=He_llo&x=Wor-ld');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [1, 2, 4] }), '/?x=1&x=2&x=4');
        });
    });

    describe('Array Query String Default', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaults: { x: ['Hello', 'World'] }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            stateController.navigateLink('/?x=Hello');
            assert.strictEqual(stateController.stateContext.data.x[0], 'Hello');
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            stateController.navigateLink('/?x=World&x=Hello');
            assert.strictEqual(stateController.stateContext.data.x[0], 'World');
            assert.strictEqual(stateController.stateContext.data.x[1], 'Hello');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
        });
        
        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['Hello'] }), '/?x=Hello');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['Hello', 'World'] }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['World', 'Hello'] }), '/?x=World&x=Hello');
        });
    });

    describe('Array Query String Default Number', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaults: { x: [1, 2, 4] }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            stateController.navigateLink('/?x=1');
            assert.strictEqual(stateController.stateContext.data.x[0], 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            stateController.navigateLink('/?x=1&x=4&x=2');
            assert.strictEqual(stateController.stateContext.data.x[0], 1);
            assert.strictEqual(stateController.stateContext.data.x[1], 4);
            assert.strictEqual(stateController.stateContext.data.x[2], 2);
            assert.strictEqual(stateController.stateContext.data.x.length, 3);
        });
        
        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: [1, 2] }), '/?x=1&x=2');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [1, 2, 4] }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [1, 4, 2] }), '/?x=1&x=4&x=2');
        });
    });

    describe('Array Query String Default Boolean', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaults: { x: [true, false] }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            stateController.navigateLink('/?x=false');
            assert.strictEqual(stateController.stateContext.data.x[0], false);
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            stateController.navigateLink('/?x=false&x=true');
            assert.strictEqual(stateController.stateContext.data.x[0], false);
            assert.strictEqual(stateController.stateContext.data.x[1], true);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
        });
        
        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: [false] }), '/?x=false');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [true, false] }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [false, true] }), '/?x=false&x=true');
        });
    });

    describe('Array Query String Default Date', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaults: { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            stateController.navigateLink('/?x=2011-08-03');
            assert.strictEqual(+stateController.stateContext.data.x[0], +new Date(2011, 7, 3));
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            stateController.navigateLink('/?x=2011-08-03&x=2010-04-07');
            assert.strictEqual(+stateController.stateContext.data.x[0], +new Date(2011, 7, 3));
            assert.strictEqual(+stateController.stateContext.data.x[1], +new Date(2010, 3, 7));
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
        });
        
        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: [new Date(2010, 3, 7)] }), '/?x=2010-04-07');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [new Date(2011, 7, 3), new Date(2010, 3, 7)] }), '/?x=2011-08-03&x=2010-04-07');
        });
    });

    describe('Combine Array Query String Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ],
                { combineArray: true }
            );
        });
        
        it('should match', function() {
            stateController.navigateLink('/?x=Hello1-World');
            assert.strictEqual(stateController.stateContext.data.x[0], 'Hello');
            assert.strictEqual(stateController.stateContext.data.x[1], 'World');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            stateController.navigateLink('/?x=H12-ello1-W22-orld');
            assert.strictEqual(stateController.stateContext.data.x[0], 'H1-ello');
            assert.strictEqual(stateController.stateContext.data.x[1], 'W2-orld');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            stateController.navigateLink('/?x=H12-ello');
            assert.strictEqual(stateController.stateContext.data.x[0], 'H1-ello');
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            stateController.navigateLink('/?x=H22-ello');
            assert.strictEqual(stateController.stateContext.data.x[0], 'H2-ello');
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
        });
        
        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['Hello', 'World'] }), '/?x=Hello1-World');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['H1-ello', 'W2-orld'] }), '/?x=H12-ello1-W22-orld');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['H1-ello'] }), '/?x=H12-ello');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['H2-ello'] }), '/?x=H22-ello');
        });
    });

    describe('String Query String Default Type Number', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/?x=ab2_0');
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab' }), '/?x=ab2_0');
        });
    });

    describe('String Param Default Type Number', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab2_0');
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab' }), '/ab2_0');
        });
    });

    describe('Number Query String Default Type Boolean', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'boolean' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/?x=1242_2');
            assert.strictEqual(stateController.stateContext.data.x, 124);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 124 }), '/?x=1242_2');
        });
    });

    describe('Number Param Default Type Boolean', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'boolean' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/1242_2');
            assert.strictEqual(stateController.stateContext.data.x, 124);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 124 }), '/1242_2');
        });
    });

    describe('Boolean Query String Default Type Date', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'date' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/?x=true2_1');
            assert.strictEqual(stateController.stateContext.data.x, true);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: true }), '/?x=true2_1');
        });
    });

    describe('Boolean Param Default Type Date', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'date' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/true2_1');
            assert.strictEqual(stateController.stateContext.data.x, true);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: true }), '/true2_1');
        });
    });

    describe('Date Query String Default Type String', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'string' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/?x=2010-04-072_3');
            assert.strictEqual(+stateController.stateContext.data.x, +new Date(2010, 3, 7));
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: new Date(2010, 3, 7) }), '/?x=2010-04-072_3');
        });
    });

    describe('Date Param Default Type String', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'string' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/2010-04-072_3');
            assert.strictEqual(+stateController.stateContext.data.x, +new Date(2010, 3, 7));
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: new Date(2010, 3, 7) }), '/2010-04-072_3');
        });
    });

    describe('String Array Query String Default Type Number Array', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'numberarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/?x=ab2_a0&x=cde');
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
            assert.strictEqual(stateController.stateContext.data.x[1], 'cde');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab', 'cde'] }), '/?x=ab2_a0&x=cde');
        });
    });

    describe('String Array Param Default Type Number Array', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'numberarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab1-cde2_a0');
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
            assert.strictEqual(stateController.stateContext.data.x[1], 'cde');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab', 'cde'] }), '/ab1-cde2_a0');
        });
    });

    describe('Number Array Query String Default Type Boolean Array', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'booleanarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/?x=1242_a2&x=35');
            assert.strictEqual(stateController.stateContext.data.x[0], 124);
            assert.strictEqual(stateController.stateContext.data.x[1], 35);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: [124, 35] }), '/?x=1242_a2&x=35');
        });
    });

    describe('Number Array Param Default Type Boolean Array', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'booleanarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/1241-352_a2');
            assert.strictEqual(stateController.stateContext.data.x[0], 124);
            assert.strictEqual(stateController.stateContext.data.x[1], 35);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: [124, 35] }), '/1241-352_a2');
        });
    });

    describe('Boolean Array Query String Default Type Date Array', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'datearray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/?x=true2_a1&x=false');
            assert.strictEqual(stateController.stateContext.data.x[0], true);
            assert.strictEqual(stateController.stateContext.data.x[1], false);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: [true, false] }), '/?x=true2_a1&x=false');
        });
    });

    describe('Boolean Array Param Default Type Date Array', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'datearray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/true1-false2_a1');
            assert.strictEqual(stateController.stateContext.data.x[0], true);
            assert.strictEqual(stateController.stateContext.data.x[1], false);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: [true, false] }), '/true1-false2_a1');
        });
    });

    describe('Date Array Query String Default Type String Array', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/?x=2010-04-072_a3&x=2011-08-03');
            assert.strictEqual(+stateController.stateContext.data.x[0], +new Date(2010, 3, 7));
            assert.strictEqual(+stateController.stateContext.data.x[1], +new Date(2011, 7, 3));
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }), '/?x=2010-04-072_a3&x=2011-08-03');
        });
    });

    describe('Date Array Param Default Type String Array', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/20102-042-071-20112-082-032_a3');
            assert.strictEqual(+stateController.stateContext.data.x[0], +new Date(2010, 3, 7));
            assert.strictEqual(+stateController.stateContext.data.x[1], +new Date(2011, 7, 3));
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }), '/20102-042-071-20112-082-032_a3');
        });
    });

    describe('No Param One Segment Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'abc', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => val.replace(' ', '+')  
            state.stateHandler.urlDecode = (state, key, val) => val.replace('+', ' ')  
        });

        it('should match', function() {
            stateController.navigateLink('/abc?x=a+b');
            assert.strictEqual(stateController.stateContext.data.x, 'a b');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'a b' }), '/abc?x=a+b');
        });
    });

    describe('One Param Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => val.replace(' ', '+')  
            state.stateHandler.urlDecode = (state, key, val) => val.replace('+', ' ')  
        });

        it('should match', function() {
            stateController.navigateLink('/a+b');
            assert.strictEqual(stateController.stateContext.data.x, 'a b');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'a b' }), '/a+b');
        });
    });

    describe('One Param Query String Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val, queryString) =>  {
                return queryString ? val.replace(' ', '+') : encodeURIComponent(val);
            }  
            state.stateHandler.urlDecode = (state, key, val, queryString) => {
                return queryString ? val.replace('+', ' ') : decodeURIComponent(val);
            }  
        });

        it('should match', function() {
            stateController.navigateLink('/a%20b?y=c+d');
            assert.strictEqual(stateController.stateContext.data.x, 'a b');
            assert.strictEqual(stateController.stateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/a%20b?y=c+d');
        });
    });

    describe('One Param Route Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val, queryString) => {
                return !queryString ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.stateHandler.urlDecode = (state, key, val, queryString) => {
                return !queryString ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            stateController.navigateLink('/a+b?y=c%20d');
            assert.strictEqual(stateController.stateContext.data.x, 'a b');
            assert.strictEqual(stateController.stateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/a+b?y=c%20d');
        });
    });

    describe('No Param One Segment State Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's', states: [
                    { key: 's', route: 'a', trackCrumbTrail: false }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'b', trackCrumbTrail: false }]}
                ]);
            var dialogs = stateController.dialogs;
            for(var key in dialogs) {
                var state = dialogs[key].states['s'];
                state.stateHandler.urlEncode = (state, key, val) => {
                    return state.parent == dialogs['d0'] ? val.replace(' ', '+') : encodeURIComponent(val);
                }
                state.stateHandler.urlDecode = (state, key, val) => {
                    return state.parent == dialogs['d0'] ? val.replace('+', ' ') : decodeURIComponent(val);
                }
            }
        });

        it('should match', function() {
            stateController.navigateLink('/a?x=c+d');
            assert.strictEqual(stateController.stateContext.data.x, 'c d');
            stateController.navigateLink('/b?x=c%20d');
            assert.strictEqual(stateController.stateContext.data.x, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d0', { x: 'c d' }), '/a?x=c+d');
            assert.strictEqual(stateController.getNavigationLink('d1', { x: 'c d' }), '/b?x=c%20d');
        });
    });

    describe('One Param State Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's', states: [
                    { key: 's', route: 'a/{x}', trackCrumbTrail: false }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'b/{x}', trackCrumbTrail: false }]}
                ]);
            var dialogs = stateController.dialogs;
            for(var key in dialogs) {
                var state = dialogs[key].states['s'];
                state.stateHandler.urlEncode = (state, key, val) => {
                    return state.parent == dialogs['d0'] ? val.replace(' ', '+') : encodeURIComponent(val);
                }
                state.stateHandler.urlDecode = (state, key, val) => {
                    return state.parent == dialogs['d0'] ? val.replace('+', ' ') : decodeURIComponent(val);
                }
            }
        });

        it('should match', function() {
            stateController.navigateLink('/a/c+d');
            assert.strictEqual(stateController.stateContext.data.x, 'c d');
            stateController.navigateLink('/b/c%20d');
            assert.strictEqual(stateController.stateContext.data.x, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d0', { x: 'c d' }), '/a/c+d');
            assert.strictEqual(stateController.getNavigationLink('d1', { x: 'c d' }), '/b/c%20d');
        });
    });

    describe('One Param One Dialog State Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'a/{x}', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's1' }]},
                    { key: 's1', route: 'b/{x}', trackCrumbTrail: false }]},
                ]);
            var dialog = stateController.dialogs['d'];
            for(var key in dialog.states) {
                var state = dialog.states[key];
                state.stateHandler.urlEncode = (state, key, val) => {
                    return state == dialog.states['s1'] ? val.replace(' ', '+') : encodeURIComponent(val);
                }
                state.stateHandler.urlDecode = (state, key, val) => {
                    return state == dialog.states['s1'] ? val.replace('+', ' ') : decodeURIComponent(val);
                }
            }
            stateController.navigate('d', { x: 'e'});
        });

        it('should match', function() {
            stateController.navigateLink('/a/c%20d');
            assert.strictEqual(stateController.stateContext.data.x, 'c d');
            stateController.navigateLink('/b/c+d');
            assert.strictEqual(stateController.stateContext.data.x, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'c d' }), '/a/c%20d');
            assert.strictEqual(stateController.getNavigationLink('t', { x: 'c d' }), '/b/c+d');
        });
    });

    describe('One Param Query String Key Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) =>  {
                return key === 'y' ? val.replace(' ', '+') : encodeURIComponent(val);
            }  
            state.stateHandler.urlDecode = (state, key, val) => {
                return key === 'y' ? val.replace('+', ' ') : decodeURIComponent(val);
            }  
        });

        it('should match', function() {
            stateController.navigateLink('/a%20b?y=c+d');
            assert.strictEqual(stateController.stateContext.data.x, 'a b');
            assert.strictEqual(stateController.stateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/a%20b?y=c+d');
        });
    });

    describe('One Param Route Key Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => {
                return key === 'x' ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.stateHandler.urlDecode = (state, key, val) => {
                return key === 'x' ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            stateController.navigateLink('/a+b?y=c%20d');
            assert.strictEqual(stateController.stateContext.data.x, 'a b');
            assert.strictEqual(stateController.stateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/a+b?y=c%20d');
        });
    });

    describe('Two Param Route Key Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{y}', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => {
                return key === 'x' ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.stateHandler.urlDecode = (state, key, val) => {
                return key === 'x' ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            stateController.navigateLink('/a+b/c%20d');
            assert.strictEqual(stateController.stateContext.data.x, 'a b');
            assert.strictEqual(stateController.stateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/a+b/c%20d');
        });
    });

    describe('One Optional Param Route Key Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x?}', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => {
                return key === 'x' ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.stateHandler.urlDecode = (state, key, val) => {
                return key === 'x' ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            stateController.navigateLink('/a+b?y=c%20d');
            assert.strictEqual(stateController.stateContext.data.x, 'a b');
            assert.strictEqual(stateController.stateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/a+b?y=c%20d');
        });
    });

    describe('One Mixed Param Route Key Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab{x}', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => {
                return key === 'x' ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.stateHandler.urlDecode = (state, key, val) => {
                return key === 'x' ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            stateController.navigateLink('/aba+b?y=c%20d');
            assert.strictEqual(stateController.stateContext.data.x, 'a b');
            assert.strictEqual(stateController.stateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/aba+b?y=c%20d');
        });
    });

    describe('No Param Two Query String Key Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) =>  {
                return key === 'y' ? val.replace(' ', '+') : encodeURIComponent(val);
            }  
            state.stateHandler.urlDecode = (state, key, val) => {
                return key === 'y' ? val.replace('+', ' ') : decodeURIComponent(val);
            }  
        });

        it('should match', function() {
            stateController.navigateLink('/?x=a%20b&y=c+d');
            assert.strictEqual(stateController.stateContext.data.x, 'a b');
            assert.strictEqual(stateController.stateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/?x=a%20b&y=c+d');
        });
    });

    describe('No Param Key Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) =>  {
                return !key ? val.replace(' ', '+') : encodeURIComponent(val);
            }  
            state.stateHandler.urlDecode = (state, key, val) => {
                return !key ? val.replace('+', ' ') : decodeURIComponent(val);
            }  
        });

        it('should match', function() {
            stateController.navigateLink('/?a+b=c%20d');
            assert.strictEqual(stateController.stateContext.data['a b'], 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { 'a b': 'c d' }), '/?a+b=c%20d');
        });
    });

    describe('No Param Two Key Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) =>  {
                return (!key && val == 'a b') ? val.replace(' ', '+') : encodeURIComponent(val);
            }  
            state.stateHandler.urlDecode = (state, key, val) => {
                return (!key && val == 'a+b') ? val.replace('+', ' ') : decodeURIComponent(val);
            }  
        });

        it('should match', function() {
            stateController.navigateLink('/?a+b=c%20d&e%20f=g%20h');
            assert.strictEqual(stateController.stateContext.data['a b'], 'c d');
            assert.strictEqual(stateController.stateContext.data['e f'], 'g h');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { 'a b': 'c d', 'e f': 'g h' }), '/?a+b=c%20d&e%20f=g%20h');
        });
    });

    describe('One Param Empty Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            delete state.stateHandler.urlEncode;
            delete state.stateHandler.urlDecode;
        });

        it('should match', function() {
            stateController.navigateLink('/a%20b?y=c%20d');
            assert.strictEqual(stateController.stateContext.data.x, 'a b');
            assert.strictEqual(stateController.stateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/a%20b?y=c%20d');
        });
    });

    describe('No Param Array Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => val.replace(' ', '+')
            state.stateHandler.urlDecode = (state, key, val) => val.replace('+', ' ')
        });

        it('should match', function() {
            stateController.navigateLink('/?x=a+b&x=c+de');
            assert.strictEqual(stateController.stateContext.data.x[0], 'a b');
            assert.strictEqual(stateController.stateContext.data.x[1], 'c de');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['a b', 'c de'] }), '/?x=a+b&x=c+de');
        });
    });

    describe('No Param Array Query String Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val, queryString) => {
                return queryString ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.stateHandler.urlDecode = (state, key, val, queryString) => {
                return queryString ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            stateController.navigateLink('/?x=a+b&x=c+de');
            assert.strictEqual(stateController.stateContext.data.x[0], 'a b');
            assert.strictEqual(stateController.stateContext.data.x[1], 'c de');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['a b', 'c de'] }), '/?x=a+b&x=c+de');
        });
    });

    describe('No Param Array Key Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'stringarray', y: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => {
                return key === 'x' ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.stateHandler.urlDecode = (state, key, val) => {
                return key === 'x' ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            stateController.navigateLink('/?x=a+b&x=c+de&y=f%20g');
            assert.strictEqual(stateController.stateContext.data.x[0], 'a b');
            assert.strictEqual(stateController.stateContext.data.x[1], 'c de');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.y[0], 'f g');
            assert.strictEqual(stateController.stateContext.data.y.length, 1);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['a b', 'c de'], y: ['f g'] }), '/?x=a+b&x=c+de&y=f%20g');
        });
    });

    describe('No Param One Segment Array State Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's', states: [
                    { key: 's', route: 'a', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'b', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
            var dialogs = stateController.dialogs;
            for(var key in dialogs) {
                var state = dialogs[key].states['s'];
                state.stateHandler.urlEncode = (state, key, val) => {
                    return state.parent == dialogs['d0'] ? val.replace(' ', '+') : encodeURIComponent(val);
                }
                state.stateHandler.urlDecode = (state, key, val) => {
                    return state.parent == dialogs['d0'] ? val.replace('+', ' ') : decodeURIComponent(val);
                }
            }
        });

        it('should match', function() {
            stateController.navigateLink('/a?x=a+b&x=c+de');
            assert.strictEqual(stateController.stateContext.data.x[0], 'a b');
            assert.strictEqual(stateController.stateContext.data.x[1], 'c de');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            stateController.navigateLink('/b?x=a%20b&x=c%20de');
            assert.strictEqual(stateController.stateContext.data.x[0], 'a b');
            assert.strictEqual(stateController.stateContext.data.x[1], 'c de');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d0', { x: ['a b', 'c de'] }), '/a?x=a+b&x=c+de');
            assert.strictEqual(stateController.getNavigationLink('d1', { x: ['a b', 'c de'] }), '/b?x=a%20b&x=c%20de');
        });
    });

    describe('Router Empty Decode', function () {
        it('should match', function() {
            var router = new Navigation.Router();
            var route = router.addRoute('{x}');
            assert.strictEqual(router.match('/a%20b').data.x, 'a b');
        })
    });

    describe('Router Empty Encode', function () {
        it('should build', function() {
            var router = new Navigation.Router();
            var route = router.addRoute('{x}');
            assert.strictEqual(route.build({ x: 'a b' }), '/a%20b');
        })
    });

    describe('One Optional Empty Param Route Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x?}', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => val.replace(' ', '+')
            state.stateHandler.urlDecode = (state, key, val) => val.replace('+', ' ')
        });
        
        it('should match', function() {
            stateController.navigateLink('/');
            assert.strictEqual(stateController.stateContext.data.x, undefined);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
        });
    });

    describe('One Empty Param Route Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => val.replace(' ', '+')
            state.stateHandler.urlDecode = (state, key, val) => val.replace('+', ' ')
        });
        
        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('One Empty Mixed Param Route Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab{x}', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => val.replace(' ', '+')
            state.stateHandler.urlDecode = (state, key, val) => val.replace('+', ' ')
        });
        
        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ab'), /Url is invalid/, '');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('One Splat Param One Segment Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abcd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'abcd');
            stateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
            assert.strictEqual(stateController.stateContext.data.x[1], 'cd');
            stateController.navigateLink('/ab/cd?y=efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
            assert.strictEqual(stateController.stateContext.data.x[1], 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'efg');
            stateController.navigateLink('/ab//cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 3);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
            assert.strictEqual(stateController.stateContext.data.x[1], null);
            assert.strictEqual(stateController.stateContext.data.x[2], 'cd');
            stateController.navigateLink('//ab/cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 3);
            assert.strictEqual(stateController.stateContext.data.x[0], null);
            assert.strictEqual(stateController.stateContext.data.x[1], 'ab');
            assert.strictEqual(stateController.stateContext.data.x[2], 'cd');
            stateController.navigateLink('/ab/cd//');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 3);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
            assert.strictEqual(stateController.stateContext.data.x[1], 'cd');
            assert.strictEqual(stateController.stateContext.data.x[2], null);
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['abcd'] }), '/abcd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab', 'cd'] }), '/ab/cd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab', 'cd'], y: 'efg' }), '/ab/cd?y=efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab', null, 'cd'] }), '/ab//cd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [null, 'ab', 'cd'] }), '//ab/cd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab', 'cd', null] }), '/ab/cd//');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('One Splat Param One Segment Default', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaults: { x: ['ef', 'ghi'] }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ef');
            assert.strictEqual(stateController.stateContext.data.x[1], 'ghi');
            stateController.navigateLink('/abcd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'abcd');
            stateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
            assert.strictEqual(stateController.stateContext.data.x[1], 'cd');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['abcd'] }), '/abcd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab', 'cd'] }), '/ab/cd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ef', 'ghi'] }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ghi', 'ef'] }), '/ghi/ef');
        });
    });
    
    describe('One Optional Splat Param One Segment Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x?}', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 0);
            stateController.navigateLink('/abcd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'abcd');
            stateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
            assert.strictEqual(stateController.stateContext.data.x[1], 'cd');
            stateController.navigateLink('/ab/cd?y=efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
            assert.strictEqual(stateController.stateContext.data.x[1], 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'efg');
            stateController.navigateLink('/ab//cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 3);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
            assert.strictEqual(stateController.stateContext.data.x[1], null);
            assert.strictEqual(stateController.stateContext.data.x[2], 'cd');
            stateController.navigateLink('//ab/cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 3);
            assert.strictEqual(stateController.stateContext.data.x[0], null);
            assert.strictEqual(stateController.stateContext.data.x[1], 'ab');
            assert.strictEqual(stateController.stateContext.data.x[2], 'cd');
            stateController.navigateLink('/ab/cd//');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 3);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
            assert.strictEqual(stateController.stateContext.data.x[1], 'cd');
            assert.strictEqual(stateController.stateContext.data.x[2], null);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [''] }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['abcd'] }), '/abcd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab', 'cd'] }), '/ab/cd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab', 'cd'], y: 'efg' }), '/ab/cd?y=efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab', null, 'cd'] }), '/ab//cd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [null, 'ab', 'cd'] }), '//ab/cd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab', 'cd', null] }), '/ab/cd//');
        });
    });

    describe('One Splat Param Two Segment Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{*x}', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            stateController.navigateLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.x[1], 'efg');
            stateController.navigateLink('/ab/cd/efg?y=hi');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.x[1], 'efg');
            assert.strictEqual(stateController.stateContext.data.y, 'hi');
            stateController.navigateLink('/ab/cd//efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 3);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.x[1], null);
            assert.strictEqual(stateController.stateContext.data.x[2], 'efg');
            stateController.navigateLink('/ab//cd/efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 3);
            assert.strictEqual(stateController.stateContext.data.x[0], null);
            assert.strictEqual(stateController.stateContext.data.x[1], 'cd');
            assert.strictEqual(stateController.stateContext.data.x[2], 'efg');
            stateController.navigateLink('/ab/cd/efg//');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 3);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.x[1], 'efg');
            assert.strictEqual(stateController.stateContext.data.x[2], null);
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd'] }), '/ab/cd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd', 'efg'] }), '/ab/cd/efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd', 'efg'], y: 'hi' }), '/ab/cd/efg?y=hi');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd', null, 'efg'] }), '/ab/cd//efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [null, 'cd', 'efg'] }), '/ab//cd/efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd', 'efg', null] }), '/ab/cd/efg//');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('One Splat Param Two Segment Default', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{*x}', defaults: { x: ['ef', 'ghi'] }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ef');
            assert.strictEqual(stateController.stateContext.data.x[1], 'ghi');
            stateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            stateController.navigateLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.x[1], 'efg');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/ab');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd'] }), '/ab/cd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd', 'efg'] }), '/ab/cd/efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ef', 'ghi'] }), '/ab');
        });
    });

    describe('Two Param One Splat Two Segment Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{*y}', defaultTypes: { y: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            assert.strictEqual(stateController.stateContext.data.y.length, 1);
            assert.strictEqual(stateController.stateContext.data.y[0], 'cd');
            stateController.navigateLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            assert.strictEqual(stateController.stateContext.data.y.length, 2);
            assert.strictEqual(stateController.stateContext.data.y[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.y[1], 'efg');
            stateController.navigateLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            assert.strictEqual(stateController.stateContext.data.y.length, 2);
            assert.strictEqual(stateController.stateContext.data.y[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.y[1], 'efg');
            assert.strictEqual(stateController.stateContext.data.z, 'hi');
            stateController.navigateLink('/ab/cd//efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            assert.strictEqual(stateController.stateContext.data.y.length, 3);
            assert.strictEqual(stateController.stateContext.data.y[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.y[1], null);
            assert.strictEqual(stateController.stateContext.data.y[2], 'efg');
            stateController.navigateLink('/ab//cd/efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            assert.strictEqual(stateController.stateContext.data.y.length, 3);
            assert.strictEqual(stateController.stateContext.data.y[0], null);
            assert.strictEqual(stateController.stateContext.data.y[1], 'cd');
            assert.strictEqual(stateController.stateContext.data.y[2], 'efg');
            stateController.navigateLink('/ab/cd/efg//');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            assert.strictEqual(stateController.stateContext.data.y.length, 3);
            assert.strictEqual(stateController.stateContext.data.y[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.y[1], 'efg');
            assert.strictEqual(stateController.stateContext.data.y[2], null);
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', y: ['cd'] }), '/ab/cd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', y: ['cd', 'efg'] }), '/ab/cd/efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', y: ['cd', 'efg'], z: 'hi' }), '/ab/cd/efg?z=hi');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', y: ['cd', null, 'efg'] }), '/ab/cd//efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', y: [null, 'cd', 'efg'] }), '/ab//cd/efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', y: ['cd', 'efg', null] }), '/ab/cd/efg//');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), null);
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab' }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { y: ['cd'] }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { y: ['cd', 'efg'] }), null);
        });
    });

    describe('Two Param One Optional Splat Two Segment Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{*y?}', defaultTypes: { y: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            stateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            assert.strictEqual(stateController.stateContext.data.y.length, 1);
            assert.strictEqual(stateController.stateContext.data.y[0], 'cd');
            stateController.navigateLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            assert.strictEqual(stateController.stateContext.data.y.length, 2);
            assert.strictEqual(stateController.stateContext.data.y[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.y[1], 'efg');
            stateController.navigateLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 3);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            assert.strictEqual(stateController.stateContext.data.y.length, 2);
            assert.strictEqual(stateController.stateContext.data.y[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.y[1], 'efg');
            assert.strictEqual(stateController.stateContext.data.z, 'hi');
            stateController.navigateLink('/ab/cd//efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            assert.strictEqual(stateController.stateContext.data.y.length, 3);
            assert.strictEqual(stateController.stateContext.data.y[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.y[1], null);
            assert.strictEqual(stateController.stateContext.data.y[2], 'efg');
            stateController.navigateLink('/ab//cd/efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            assert.strictEqual(stateController.stateContext.data.y.length, 3);
            assert.strictEqual(stateController.stateContext.data.y[0], null);
            assert.strictEqual(stateController.stateContext.data.y[1], 'cd');
            assert.strictEqual(stateController.stateContext.data.y[2], 'efg');
            stateController.navigateLink('/ab/cd/efg//');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
            assert.strictEqual(stateController.stateContext.data.y.length, 3);
            assert.strictEqual(stateController.stateContext.data.y[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.y[1], 'efg');
            assert.strictEqual(stateController.stateContext.data.y[2], null);
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab' }), '/ab');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', y: ['cd'] }), '/ab/cd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', y: ['cd', 'efg'] }), '/ab/cd/efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', y: ['cd', 'efg'], z: 'hi' }), '/ab/cd/efg?z=hi');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', y: ['cd', null, 'efg'] }), '/ab/cd//efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', y: [null, 'cd', 'efg'] }), '/ab//cd/efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab', y: ['cd', 'efg', null] }), '/ab/cd/efg//');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), null);
            assert.strictEqual(stateController.getNavigationLink('d', { y: ['cd'] }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { y: ['cd', 'efg'] }), null);
        });
    });

    describe('Two Splat Param Three Segment Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}/ab/{*y}', defaultTypes: { x: 'stringarray', y: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/cd/ab/efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.y.length, 1);
            assert.strictEqual(stateController.stateContext.data.y[0], 'efg');
            stateController.navigateLink('/cd/efg/ab/hi');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.x[1], 'efg');
            assert.strictEqual(stateController.stateContext.data.y.length, 1);
            assert.strictEqual(stateController.stateContext.data.y[0], 'hi');
            stateController.navigateLink('/cd/ab/efg/hi');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.y.length, 2);
            assert.strictEqual(stateController.stateContext.data.y[0], 'efg');
            assert.strictEqual(stateController.stateContext.data.y[1], 'hi');
            stateController.navigateLink('/cd/efg/ab/hij/kl');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.x[1], 'efg');
            assert.strictEqual(stateController.stateContext.data.y.length, 2);
            assert.strictEqual(stateController.stateContext.data.y[0], 'hij');
            assert.strictEqual(stateController.stateContext.data.y[1], 'kl');
            stateController.navigateLink('//cd/ab/efg//');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], null);
            assert.strictEqual(stateController.stateContext.data.x[1], 'cd');
            assert.strictEqual(stateController.stateContext.data.y.length, 2);
            assert.strictEqual(stateController.stateContext.data.y[0], 'efg');
            assert.strictEqual(stateController.stateContext.data.y[1], null);
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/cd/ab'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/cd/efg/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd'], y: ['efg'] }), '/cd/ab/efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd', 'efg'], y: ['hi'] }), '/cd/efg/ab/hi');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd'], y: ['efg', 'hi'] }), '/cd/ab/efg/hi');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd', 'efg'], y: ['hij', 'kl'] }), '/cd/efg/ab/hij/kl');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [null, 'cd'], y: ['efg', null] }), '//cd/ab/efg//');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), null);
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd'] }), null);
            assert.strictEqual(stateController.getNavigationLink('d', { y: ['cd'] }), null);
        });
    });
    
    describe('Two Route Param Splat and Not Splat', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['a/{*x}', 'b/{x}/{y}'], defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            stateController.navigateLink('/a/cd/efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.x[1], 'efg');
            stateController.navigateLink('/a/cd2_0');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            stateController.navigateLink('/b/cd2_0/efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x, 'cd');
            assert.strictEqual(stateController.stateContext.data.y, 'efg');
            stateController.navigateLink('/b/cd1-efg/hi');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 2);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.x[1], 'efg');
            assert.strictEqual(stateController.stateContext.data.y, 'hi');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd', 'efg'] }), '/a/cd/efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd' }), '/a/cd2_0');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/b/cd2_0/efg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd', 'efg'], y: 'hi' }), '/b/cd1-efg/hi');
        });
    })

    describe('One Splat Param Two Segment Default', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}/ab', defaults: { x: ['cde', 'fg'] }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/cd/ab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            stateController.navigateLink('/cd/efg/ab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.x[1], 'efg');
            stateController.navigateLink('/cde/fg/ab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cde');
            assert.strictEqual(stateController.stateContext.data.x[1], 'fg');
            stateController.navigateLink('/cde1-fg/ab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cde1-fg');
            stateController.navigateLink('/true2_1/ab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, true);
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/cd'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/cde/fg/ab');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd'] }), '/cd/ab');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd', 'efg'] }), '/cd/efg/ab');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cde', 'fg'] }), '/cde/fg/ab');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cde1-fg'] }), '/cde1-fg/ab');
            assert.strictEqual(stateController.getNavigationLink('d', { x: true }), '/true2_1/ab');
        });
    });

    describe('One Splat Param One Mixed Segment Default', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab{*x}', defaults: { x: ['cde', 'fg'] }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abcde/fg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cde');
            assert.strictEqual(stateController.stateContext.data.x[1], 'fg');
            stateController.navigateLink('/abcd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            stateController.navigateLink('/abcd/efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'cd');
            assert.strictEqual(stateController.stateContext.data.x[1], 'efg');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/acd'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/abcde/fg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cde', 'fg'] }), '/abcde/fg');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd'] }), '/abcd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['cd', 'efg'] }), '/abcd/efg');
        });
    });

    describe('Without Types Splat Conflicting Default And Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', trackTypes: false, defaults: { x: ['a', 'bc'] }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });
        it('should match', function() {
            stateController.navigateLink('/');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'a');
            assert.strictEqual(stateController.stateContext.data.x[1], 'bc');
            stateController.navigateLink('/a/bc');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'a');
            assert.strictEqual(stateController.stateContext.data.x[1], 'bc');
            stateController.navigateLink('/3');
            assert.strictEqual(stateController.stateContext.data.x, 3);
        });
        
        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/1/2'), /not a valid number/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['a', 'bc'] }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3 }), '/3');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '3' }), '/3');
        });
    });

    describe('Without Types Splat Conflicting Single Array Default And Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', trackTypes: false, defaults: { x: ['a'] }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });
        it('should match', function() {
            stateController.navigateLink('/');
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'a');
            stateController.navigateLink('/a');
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'a');
            stateController.navigateLink('/3');
            assert.strictEqual(stateController.stateContext.data.x, 3);
        });
        
        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/b'), /not a valid number/, '');
            assert.throws(() => stateController.navigateLink('/1/2'), /not a valid number/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['a'] }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 3 }), '/3');
            assert.strictEqual(stateController.getNavigationLink('d', { x: '3' }), '/3');
        });
    });

    describe('One Splat Param One Segment Single Match Array Default', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaults: { x: ['a', 'b'] }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab'] }), '/ab');
        });
    });
    
    describe('Combine Array One Splat Param One Segment Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ],
                { combineArray: true }
            );
        });

        it('should match', function() {
            stateController.navigateLink('/abcd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'abcd');
            stateController.navigateLink('/ab1-cd');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
            assert.strictEqual(stateController.stateContext.data.x[1], 'cd');
            stateController.navigateLink('/a12-b1-c22-d');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'a1-b');
            assert.strictEqual(stateController.stateContext.data.x[1], 'c2-d');
            stateController.navigateLink('/a12-b');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'a1-b');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['abcd'] }), '/abcd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab', 'cd'] }), '/ab1-cd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['a1-b', 'c2-d'] }), '/a12-b1-c22-d');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['a1-b'] }), '/a12-b');
        });
    });

    describe('Splat Param Array Encode', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => val.replace(' ', '+')
            state.stateHandler.urlDecode = (state, key, val) => val.replace('+', ' ')
        });

        it('should match', function() {
            stateController.navigateLink('/a+b/c+de');
            assert.strictEqual(stateController.stateContext.data.x[0], 'a b');
            assert.strictEqual(stateController.stateContext.data.x[1], 'c de');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['a b', 'c de'] }), '/a+b/c+de');
        });
    });

    describe('One Splat Param One Segment Default Type Number Array', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaultTypes: { x: 'numberarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/123');
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 123);
            stateController.navigateLink('/12/345/67');
            assert.strictEqual(stateController.stateContext.data.x.length, 3);
            assert.strictEqual(stateController.stateContext.data.x[0], 12);
            assert.strictEqual(stateController.stateContext.data.x[1], 345);
            assert.strictEqual(stateController.stateContext.data.x[2], 67);
            stateController.navigateLink('/ab2_0');
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: [123] }), '/123');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [12, 345, 67] }), '/12/345/67');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab' }), '/ab2_0');
        });
    });

    describe('One Splat Param One Segment Default Type Booelan Array', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaultTypes: { x: 'booleanarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/true');
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], true);
            stateController.navigateLink('/true/false/true');
            assert.strictEqual(stateController.stateContext.data.x.length, 3);
            assert.strictEqual(stateController.stateContext.data.x[0], true);
            assert.strictEqual(stateController.stateContext.data.x[1], false);
            assert.strictEqual(stateController.stateContext.data.x[2], true);
            stateController.navigateLink('/ab2_0');
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: [true] }), '/true');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [true, false, true] }), '/true/false/true');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab' }), '/ab2_0');
        });
    });

    describe('One Splat Param One Segment Default Type Date Array', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaultTypes: { x: 'datearray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/2010-04-07');
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(+stateController.stateContext.data.x[0], +new Date(2010, 3, 7));
            stateController.navigateLink('/2010-04-07/2011-08-03');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(+stateController.stateContext.data.x[0], +new Date(2010, 3, 7));
            assert.strictEqual(+stateController.stateContext.data.x[1], +new Date(2011, 7, 3));
            stateController.navigateLink('/ab2_0');
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: [new Date(2010, 3, 7)] }), '/2010-04-07');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }), '/2010-04-07/2011-08-03');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab' }), '/ab2_0');
        });
    });

    describe('One Splat Param One Segment Default Date Array', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaults: { x: [new Date(2011, 7, 3), new Date(2010, 3, 7)] }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(+stateController.stateContext.data.x[0], +new Date(2011, 7, 3));
            assert.strictEqual(+stateController.stateContext.data.x[1], +new Date(2010, 3, 7));
            stateController.navigateLink('/2010-04-07');
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(+stateController.stateContext.data.x[0], +new Date(2010, 3, 7));
            stateController.navigateLink('/2010-04-07/2011-08-03');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(+stateController.stateContext.data.x[0], +new Date(2010, 3, 7));
            assert.strictEqual(+stateController.stateContext.data.x[1], +new Date(2011, 7, 3));
            stateController.navigateLink('/ab2_0');
            assert.strictEqual(stateController.stateContext.data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: [new Date(2011, 7, 3), new Date(2010, 3, 7)] }), '/');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [new Date(2010, 3, 7)] }), '/2010-04-07');
            assert.strictEqual(stateController.getNavigationLink('d', { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }), '/2010-04-07/2011-08-03');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'ab' }), '/ab2_0');
        });
    });

    describe('Multiple Routes Splat and Not Splat', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{*x}', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false },
                    { key: 's1', route: 'cd/{x}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab/ef');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ef');
            stateController.navigateLink('/ab/ef/gh');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ef');
            assert.strictEqual(stateController.stateContext.data.x[1], 'gh');
            stateController.navigateLink('/cd/ef');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'ef');
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/aa/bbb'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/cd'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/cd/ef/gh'), /Url is invalid/, '');
        });
    });

    describe('One Splat Param One Segment', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/abcd');
            assert.strictEqual(stateController.stateContext.data.x, 'abcd');
            stateController.navigateLink('/1232_2');
            assert.strictEqual(stateController.stateContext.data.x, 123);
        });

        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => stateController.navigateLink('/ab/cd'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'abcd' }), '/abcd');
            assert.strictEqual(stateController.getNavigationLink('d', { x: 123 }), '/1232_2');
        });

        it('should not build', function() {
            assert.strictEqual(stateController.getNavigationLink('d'), null);
        });
    });

    describe('One Splat Param One Query String Default Type', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaultTypes: { x: 'stringarray', y: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/ab/cde?y=fgh&y=ij');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
            assert.strictEqual(stateController.stateContext.data.x[1], 'cde');
            assert.strictEqual(stateController.stateContext.data.y.length, 2);
            assert.strictEqual(stateController.stateContext.data.y[0], 'fgh');
            assert.strictEqual(stateController.stateContext.data.y[1], 'ij');
            stateController.navigateLink('/ab?y=fgh&y=ij');
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
            assert.strictEqual(stateController.stateContext.data.y.length, 2);
            assert.strictEqual(stateController.stateContext.data.y[0], 'fgh');
            assert.strictEqual(stateController.stateContext.data.y[1], 'ij');
            stateController.navigateLink('/ab/cde?y=fgh');
            assert.strictEqual(stateController.stateContext.data.x.length, 2);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
            assert.strictEqual(stateController.stateContext.data.x[1], 'cde');
            assert.strictEqual(stateController.stateContext.data.y.length, 1);
            assert.strictEqual(stateController.stateContext.data.y[0], 'fgh');
            stateController.navigateLink('/ab?y=fgh');
            assert.strictEqual(stateController.stateContext.data.x.length, 1);
            assert.strictEqual(stateController.stateContext.data.x[0], 'ab');
            assert.strictEqual(stateController.stateContext.data.y.length, 1);
            assert.strictEqual(stateController.stateContext.data.y[0], 'fgh');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab', 'cde'], y: ['fgh', 'ij'] }), '/ab/cde?y=fgh&y=ij');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab'], y: ['fgh', 'ij'] }), '/ab?y=fgh&y=ij');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab', 'cde'], y: ['fgh'] }), '/ab/cde?y=fgh');
            assert.strictEqual(stateController.getNavigationLink('d', { x: ['ab'], y: ['fgh'] }), '/ab?y=fgh');
        });
    });

    describe('Reload Param', function () {
        var stateController: StateController;
        beforeEach(function () {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}', trackCrumbTrail: false }]}
                ]);
            stateController.configure([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'cd/{x}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController.navigateLink('/cd/efg');
            assert.strictEqual(Object.keys(stateController.stateContext.data).length, 1);
            assert.strictEqual(stateController.stateContext.data.x, 'efg');
        });
        
        it('should not match', function() {
            assert.throws(() => stateController.navigateLink('/ab/cde'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateController.getNavigationLink('d', { x: 'efg' }), '/cd/efg');
        });
    });

    describe('Two Controllers Param', function () {
        var stateController0: StateController;
        var stateController1: StateController;
        beforeEach(function () {
            stateController0 = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}', trackCrumbTrail: false }]}
                ]);
            stateController1 = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'cd/{x}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController0.navigateLink('/ab/cde');
            assert.strictEqual(Object.keys(stateController0.stateContext.data).length, 1);
            assert.strictEqual(stateController0.stateContext.data.x, 'cde');
            stateController1.navigateLink('/cd/efg');
            assert.strictEqual(Object.keys(stateController1.stateContext.data).length, 1);
            assert.strictEqual(stateController1.stateContext.data.x, 'efg');
        });

        it('should build', function() {
            assert.strictEqual(stateController0.getNavigationLink('d', { x: 'cde' }), '/ab/cde');
            assert.strictEqual(stateController1.getNavigationLink('d', { x: 'efg' }), '/cd/efg');
        });
    });

    describe('Two Controllers Param Default', function () {
        var stateController0: StateController;
        var stateController1: StateController;
        beforeEach(function () {
            stateController0 = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}', defaults: { x: 'cd' }, trackCrumbTrail: false }]}
                ]);
            stateController1 = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'cd/{x}', defaults: { x: 12 }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController0.navigateLink('/ab');
            assert.strictEqual(Object.keys(stateController0.stateContext.data).length, 1);
            assert.strictEqual(stateController0.stateContext.data.x, 'cd');
            stateController0.navigateLink('/ab/1');
            assert.strictEqual(Object.keys(stateController0.stateContext.data).length, 1);
            assert.strictEqual(stateController0.stateContext.data.x, '1');
            stateController1.navigateLink('/cd');
            assert.strictEqual(Object.keys(stateController1.stateContext.data).length, 1);
            assert.strictEqual(stateController1.stateContext.data.x, 12);
            stateController1.navigateLink('/cd/1');
            assert.strictEqual(Object.keys(stateController1.stateContext.data).length, 1);
            assert.strictEqual(stateController1.stateContext.data.x, 1);
        });

        it('should build', function() {
            assert.strictEqual(stateController0.getNavigationLink('d', { x: 'cd' }), '/ab');
            assert.strictEqual(stateController0.getNavigationLink('d', { x: '1' }), '/ab/1');
            assert.strictEqual(stateController1.getNavigationLink('d', { x: 12 }), '/cd');
            assert.strictEqual(stateController1.getNavigationLink('d', { x: 1 }), '/cd/1');
        });
    });

    describe('Two Controllers Param Default Type', function () {
        var stateController0: StateController;
        var stateController1: StateController;
        beforeEach(function () {
            stateController0 = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}', trackCrumbTrail: false }]}
                ]);
            stateController1 = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'cd/{x}', defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            stateController0.navigateLink('/ab/1');
            assert.strictEqual(Object.keys(stateController0.stateContext.data).length, 1);
            assert.strictEqual(stateController0.stateContext.data.x, '1');
            stateController1.navigateLink('/cd/1');
            assert.strictEqual(Object.keys(stateController1.stateContext.data).length, 1);
            assert.strictEqual(stateController1.stateContext.data.x, 1);
        });

        it('should build', function() {
            assert.strictEqual(stateController0.getNavigationLink('d', { x: '1' }), '/ab/1');
            assert.strictEqual(stateController1.getNavigationLink('d', { x: 1 }), '/cd/1');
        });
    });
});
