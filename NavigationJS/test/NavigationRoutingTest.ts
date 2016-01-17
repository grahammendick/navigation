/// <reference path="assert.d.ts" />
/// <reference path="mocha.d.ts" />
import assert = require('assert');
import Navigation = require('../src/Navigation');

describe('MatchTest', function () {
    describe('Root', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 0);
            Navigation.StateController.navigateLink('/?x=ab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
        });
        
        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ '), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/a'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/?x=a&x=b'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), '/?x=ab');
        });
    });

    describe('No Param One Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'abc', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 0);
            Navigation.StateController.navigateLink('/abc?x=ab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ abc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc '), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/dbc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/c'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/adc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/aabc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/abc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), '/abc?x=ab');
        });
    });

    describe('No Param Two Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/c', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('ab/c');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 0);
            Navigation.StateController.navigateLink('ab/c?x=ab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ ab/c'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/c '), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/d'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/a/b/c'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ad/c'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/aab/c'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/ab/c');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), '/ab/c?x=ab');
        });
    });

    describe('One Param One Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abcd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'abcd');
            Navigation.StateController.navigateLink('/ab?y=cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            assert.strictEqual(Navigation.StateContext.data.y, 'cd');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/a?x=b'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abcd' }), '/abcd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', y: 'cd' }), '/ab?y=cd');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('One Param Two Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            Navigation.StateController.navigateLink('/ab/cd?y=ef');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'ef');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ ab/cd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc/d'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/d/e'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/a/b/d'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/cab/d'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd' }), '/ab/cd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'ef' }), '/ab/cd?y=ef');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'ef' }), null);
        });
    });

    describe('Two Param Two Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{y}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/aa/bbb');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'bbb');
            Navigation.StateController.navigateLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'bbb');
            assert.strictEqual(Navigation.StateContext.data.z, 'cccc');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/aa/bbb/e'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/aa//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/aa'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'bbb' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'cccc' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param Three Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}/{y}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'efg');
            Navigation.StateController.navigateLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'efg');
            assert.strictEqual(Navigation.StateContext.data.z, 'hi');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ ab/cd/efg'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cde'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cd/efg/h'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab//efg'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('//cd/efg'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/ab/cd/efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg?z=hi');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'efg' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'hi' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param Four Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}/c/{y}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab/yy/c/xyz');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'yy');
            assert.strictEqual(Navigation.StateContext.data.y, 'xyz');
            Navigation.StateController.navigateLink('/ab/yy/c/xyz?z=xx');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'yy');
            assert.strictEqual(Navigation.StateContext.data.y, 'xyz');
            assert.strictEqual(Navigation.StateContext.data.z, 'xx');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ ab/yy/c/xyz'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/b/c'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/b/c/d/e'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/c'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/b/c//d'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab//b/c/d'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'yy', y: 'xyz' }), '/ab/yy/c/xyz');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'yy', y: 'xyz', z: 'xx' }), '/ab/yy/c/xyz?z=xx');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'yy' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'xyz' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'zz' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('One Optional Param One Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abcd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'abcd');
            Navigation.StateController.navigateLink('/abcd?y=ef');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'abcd');
            assert.strictEqual(Navigation.StateContext.data.y, 'ef');
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 0);
            Navigation.StateController.navigateLink('/?y=ef');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.y, 'ef');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab//'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abcd' }), '/abcd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abcd', y: 'ef' }), '/abcd?y=ef');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'ef' }), '/?y=ef');
        });
    });

    describe('One Optional Param Two Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            Navigation.StateController.navigateLink('/ab/cd?y=ef');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'ef');
            Navigation.StateController.navigateLink('/ab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 0);
            Navigation.StateController.navigateLink('/ab?y=ef');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.y, 'ef');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ ab/cd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc/d'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/d/e'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/a/b/d'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/cab/d'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd' }), '/ab/cd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'ef' }), '/ab/cd?y=ef');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/ab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'ef' }), '/ab?y=ef');
        });
    });

    describe('Two Optional Param Two Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x?}/{y?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/aa/bbb');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'bbb');
            Navigation.StateController.navigateLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'bbb');
            assert.strictEqual(Navigation.StateContext.data.z, 'cccc');
            Navigation.StateController.navigateLink('/aab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'aab');
            Navigation.StateController.navigateLink('/aab?z=cccc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'aab');
            assert.strictEqual(Navigation.StateContext.data.z, 'cccc');
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 0);
            Navigation.StateController.navigateLink('/?z=cccc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.z, 'cccc');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/aa/bbb/e'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/aa//'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aab' }), '/aab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aab', z: 'cccc' }), '/aab?z=cccc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'cccc' }), '/?z=cccc');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'bbb' }), null);
        });
    });

    describe('Two Optional Param Three Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x?}/{y?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'efg');
            Navigation.StateController.navigateLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'efg');
            assert.strictEqual(Navigation.StateContext.data.z, 'hi');
            Navigation.StateController.navigateLink('/ab/cde');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'cde');
            Navigation.StateController.navigateLink('/ab/cde?z=fg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'cde');
            assert.strictEqual(Navigation.StateContext.data.z, 'fg');
            Navigation.StateController.navigateLink('/ab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 0);
            Navigation.StateController.navigateLink('/ab?z=cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.z, 'cd');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ ab/cd/efg'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cd/efg/h'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab//efg'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('//cd/efg'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/ab/cd/efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg?z=hi');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde' }), '/ab/cde');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde', z: 'fg' }), '/ab/cde?z=fg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/ab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'cd' }), '/ab?z=cd');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'efg' }), null);
        });
    });

    describe('Two Param One Optional Two Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{y?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/aa/bbb');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'bbb');
            Navigation.StateController.navigateLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'bbb');
            assert.strictEqual(Navigation.StateContext.data.z, 'cccc');
            Navigation.StateController.navigateLink('/aab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'aab');
            Navigation.StateController.navigateLink('/aab?z=ccd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'aab');
            assert.strictEqual(Navigation.StateContext.data.z, 'ccd');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/aa/bbb/e'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/aa//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aab' }), '/aab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aab', z: 'ccd' }), '/aab?z=ccd');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'bbb' }), null);
        });
    });

    describe('Two Param One Optional Three Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}/{y?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'efg');
            Navigation.StateController.navigateLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'efg');
            assert.strictEqual(Navigation.StateContext.data.z, 'hi');
            Navigation.StateController.navigateLink('/ab/cde');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'cde');
            Navigation.StateController.navigateLink('/ab/cde?z=fg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'cde');
            assert.strictEqual(Navigation.StateContext.data.z, 'fg');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ ab/cd/efg'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cd/efg/h'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab//efg'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('//cd/efg'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/ab/cd/efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg?z=hi');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde' }), '/ab/cde');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde', z: 'fg' }), '/ab/cde?z=fg');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'efg' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param One Optional Four Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}/c/{y?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab/yy/c/xyz');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'yy');
            assert.strictEqual(Navigation.StateContext.data.y, 'xyz');
            Navigation.StateController.navigateLink('/ab/yy/c/xyz?z=xx');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'yy');
            assert.strictEqual(Navigation.StateContext.data.y, 'xyz');
            assert.strictEqual(Navigation.StateContext.data.z, 'xx');
            Navigation.StateController.navigateLink('/ab/yy/c');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'yy');
            Navigation.StateController.navigateLink('/ab/yy/c?z=xx');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'yy');
            assert.strictEqual(Navigation.StateContext.data.z, 'xx');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ ab/yy/c/xyz'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/b/c/d/e'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/c'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/b/c//d'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab//b/c/d'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'yy', y: 'xyz' }), '/ab/yy/c/xyz');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'yy', y: 'xyz', z: 'xx' }), '/ab/yy/c/xyz?z=xx');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'yy' }), '/ab/yy/c');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'yy', z: 'xx' }), '/ab/yy/c?z=xx');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'xyz' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('One Param One Mixed Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab{x}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abcde');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'cde');
            Navigation.StateController.navigateLink('/abcde?y=fg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'cde');
            assert.strictEqual(Navigation.StateContext.data.y, 'fg');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cde'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abcd//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde' }), '/abcde');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde', y: 'fg' }), '/abcde?y=fg');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param One Mixed Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab{x}e{y}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abcdefgh');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'fgh');
            Navigation.StateController.navigateLink('/abcdefgh?z=i');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'fgh');
            assert.strictEqual(Navigation.StateContext.data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ abcdefgh'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cdefgh'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abcdefgh//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abcde'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'fgh' }), '/abcdefgh');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'fgh', z: 'i' }), '/abcdefgh?z=i');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'fghh' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param One Optional Two Segment One Mixed', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}ab/{y?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abcab/de');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'abc');
            assert.strictEqual(Navigation.StateContext.data.y, 'de');
            Navigation.StateController.navigateLink('/abcab/de?z=f');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'abc');
            assert.strictEqual(Navigation.StateContext.data.y, 'de');
            assert.strictEqual(Navigation.StateContext.data.z, 'f');
            Navigation.StateController.navigateLink('/abcab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'abc');
            Navigation.StateController.navigateLink('/abcab?z=de');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'abc');
            assert.strictEqual(Navigation.StateContext.data.z, 'de');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/abcab /de'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abcab/de/fg'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abcab//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/de'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc', y: 'de' }), '/abcab/de');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc', y: 'de', z: 'f' }), '/abcab/de?z=f');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc' }), '/abcab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc', z: 'de' }), '/abcab?z=de');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'de' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('One Param One Segment Default', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaults: { x: 'cde' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            Navigation.StateController.navigateLink('/ab?z=cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            assert.strictEqual(Navigation.StateContext.data.z, 'cd');
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'cde');
            Navigation.StateController.navigateLink('/?z=fg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'cde');
            assert.strictEqual(Navigation.StateContext.data.z, 'fg');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab//'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), '/ab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', z: 'cd' }), '/ab?z=cd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde' }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde', z: 'fg' }), '/?z=fg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'fg' }), '/?z=fg');
        });
    });

    describe('One Param One Segment Default Number', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaults: { x: 345 }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/12');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 12);
            Navigation.StateController.navigateLink('/12?z=34');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 12);
            assert.strictEqual(Navigation.StateContext.data.z, '34');
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 345);
            Navigation.StateController.navigateLink('/?z=67');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 345);
            assert.strictEqual(Navigation.StateContext.data.z, '67');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/12/34'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/12//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/true'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/1a2'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/12?x=34'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 12 }), '/12');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 12, z: '34' }), '/12?z=34');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 345 }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 345, z: '67' }), '/?z=67');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: '67' }), '/?z=67');
        });
    });

    describe('One Param One Segment Default Boolean', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaults: { x: true }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/false');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, false);
            Navigation.StateController.navigateLink('/false?z=true');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, false);
            assert.strictEqual(Navigation.StateContext.data.z, 'true');
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, true);
            Navigation.StateController.navigateLink('/?z=false');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, true);
            assert.strictEqual(Navigation.StateContext.data.z, 'false');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/false/true'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/false//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/1'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/fals'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/false?x=true'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: false }), '/false');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: false, z: 'true' }), '/false?z=true');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: true }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: true, z: 'false' }), '/?z=false');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'false' }), '/?z=false');
        });
    });

    describe('One Param One Segment Default Date', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaults: { x: new Date(2010, 3, 7) }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/2011-08-03');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(+Navigation.StateContext.data.x, +new Date(2011, 7, 3));
            Navigation.StateController.navigateLink('/2011-12-31');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(+Navigation.StateContext.data.x, +new Date(2011, 11, 31));
            Navigation.StateController.navigateLink('/2011-8-3');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(+Navigation.StateContext.data.x, +new Date(2011, 7, 3));
            Navigation.StateController.navigateLink('/2011-08-03?z=2012-09-04');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(+Navigation.StateContext.data.x, +new Date(2011, 7, 3));
            assert.strictEqual(Navigation.StateContext.data.z, '2012-09-04');
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(+Navigation.StateContext.data.x, +new Date(2010, 3, 7));
            Navigation.StateController.navigateLink('/?z=2012-09-04');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(+Navigation.StateContext.data.x, +new Date(2010, 3, 7));
            assert.strictEqual(Navigation.StateContext.data.z, '2012-09-04');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/2011-08-03/2012-09-04'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/2011-08-03//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/true'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/2011/08/03'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/2011-08'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/2011-08-a'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/2011-08-03-01'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/2011-08-03?x=2012-09-04'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: new Date(2011, 7, 3) }), '/2011-08-03');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: new Date(2011, 11, 31) }), '/2011-12-31');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: new Date(2011, 7, 3), z: '2012-09-04' }), '/2011-08-03?z=2012-09-04');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: new Date(2010, 3, 7) }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: new Date(2010, 3, 7), z: '2012-09-04' }), '/?z=2012-09-04');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: '2012-09-04' }), '/?z=2012-09-04');
        });
    });

    describe('No Param One Segment Default Type Number', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'abc', defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 0);
            Navigation.StateController.navigateLink('/abc?x=12');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 12);
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ abc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc '), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/dbc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/c'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/adc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/aabc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc?x=true'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc?x=1a2'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc?x=12&x=345'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/abc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 12 }), '/abc?x=12');
        });
    });

    describe('No Param One Segment Default Type Boolean', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'abc', defaultTypes: { x: 'boolean' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 0);
            Navigation.StateController.navigateLink('/abc?x=true');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, true);
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ abc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc '), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/dbc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/c'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/adc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/aabc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc?x=1'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc?x=tru'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc?x=true&x=false'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/abc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: true }), '/abc?x=true');
        });
    });

    describe('No Param One Segment Default Type Date', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'abc', defaultTypes: { x: 'date' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 0);
            Navigation.StateController.navigateLink('/abc?x=2011-08-03');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(+Navigation.StateContext.data.x, +new Date(2011, 7, 3));
            Navigation.StateController.navigateLink('/abc?x=2011-8-3');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(+Navigation.StateContext.data.x, +new Date(2011, 7, 3));
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ abc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc '), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/dbc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/c'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/adc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/aabc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc?x=true'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc?x=2011/08/03'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc?x=2011-08'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc?x=2011-08-a'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc?x=2011-08-03-01'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc?x=2011-08-03&x=2012-09-04'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/abc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: new Date(2011, 7, 3) }), '/abc?x=2011-08-03');
        });
    });

    describe('One Param Two Segment Default', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}', defaults: { x: 'ccdd' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab/cde');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'cde');
            Navigation.StateController.navigateLink('/ab/cde?y=fg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'cde');
            assert.strictEqual(Navigation.StateContext.data.y, 'fg');
            Navigation.StateController.navigateLink('/ab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'ccdd');
            Navigation.StateController.navigateLink('/ab?y=ee');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'ccdd');
            assert.strictEqual(Navigation.StateContext.data.y, 'ee');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ ab/cd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc/d'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/d/e'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/a/b/d'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/cab/d'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde' }), '/ab/cde');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde', y: 'fg' }), '/ab/cde?y=fg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ccdd' }), '/ab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ccdd', y: 'ee' }), '/ab?y=ee');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/ab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'ee' }), '/ab?y=ee');
        });
    });

    describe('Two Param Two Segment Two Default', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{y}', defaults: { x: 'ab', y: 'c' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/aa/bbb');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'bbb');
            Navigation.StateController.navigateLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'bbb');
            assert.strictEqual(Navigation.StateContext.data.z, 'cccc');
            Navigation.StateController.navigateLink('/aa');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'c');
            Navigation.StateController.navigateLink('/aa?z=d');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'c');
            assert.strictEqual(Navigation.StateContext.data.z, 'd');
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            assert.strictEqual(Navigation.StateContext.data.y, 'c');
            Navigation.StateController.navigateLink('/?z=d');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            assert.strictEqual(Navigation.StateContext.data.y, 'c');
            assert.strictEqual(Navigation.StateContext.data.z, 'd');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/aa/bbb/e'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/aa//'), /Url is invalid/, '');
        });
   
        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'c' }), '/aa');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'c', z: 'd' }), '/aa?z=d');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'bbb' }), '/ab/bbb');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'bbb', z: 'cccc' }), '/ab/bbb?z=cccc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'c' }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'c', z: 'd' }), '/?z=d');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa' }), '/aa');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', z: 'd' }), '/aa?z=d');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', y: 'c' }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', y: 'c', z: 'd' }), '/?z=d');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', z: 'd' }), '/?z=d');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'd' }), '/?z=d');
        });
 });

    describe('Two Param Two Segment Default', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{y}', defaults: { y: 'ab' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/aa/bbb');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'bbb');
            Navigation.StateController.navigateLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'bbb');
            assert.strictEqual(Navigation.StateContext.data.z, 'cccc');
            Navigation.StateController.navigateLink('/aa');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'ab');
            Navigation.StateController.navigateLink('/aa?z=bb');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'ab');
            assert.strictEqual(Navigation.StateContext.data.z, 'bb');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/aa/bbb/e'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/aa//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'ab' }), '/aa');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'ab', z: 'bb' }), '/aa?z=bb');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa' }), '/aa');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', z: 'bb' }), '/aa?z=bb');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'bbb' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param One Optional Two Segment Default', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{y?}', defaults: { x: 'abc' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/aa/bbb');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'bbb');
            Navigation.StateController.navigateLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'bbb');
            assert.strictEqual(Navigation.StateContext.data.z, 'cccc');
            Navigation.StateController.navigateLink('/aab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'aab');
            Navigation.StateController.navigateLink('/aab?z=ccd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'aab');
            assert.strictEqual(Navigation.StateContext.data.z, 'ccd');
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'abc');
            Navigation.StateController.navigateLink('/?z=de');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'abc');
            assert.strictEqual(Navigation.StateContext.data.z, 'de');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/aa/bbb/e'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/aa//'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc', y: 'bbb' }), '/abc/bbb');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc', y: 'bbb', z: 'cccc' }), '/abc/bbb?z=cccc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'bbb' }), '/abc/bbb');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'bbb', z: 'cccc' }), '/abc/bbb?z=cccc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aab' }), '/aab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aab', z: 'ccd' }), '/aab?z=ccd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc' }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc', z: 'de' }), '/?z=de');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'de' }), '/?z=de');
        });
    });

    describe('Four Param Two Optional Five Segment Default', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{w}/{x}/{y?}/{z?}', defaults: { w: 'abc', x: 'de' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab/cd/ef/hi/jk');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 4);
            assert.strictEqual(Navigation.StateContext.data.w, 'cd');
            assert.strictEqual(Navigation.StateContext.data.x, 'ef');
            assert.strictEqual(Navigation.StateContext.data.y, 'hi');
            assert.strictEqual(Navigation.StateContext.data.z, 'jk');
            Navigation.StateController.navigateLink('/ab/cd/ef/hi/jk?a=lm');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 5);
            assert.strictEqual(Navigation.StateContext.data.w, 'cd');
            assert.strictEqual(Navigation.StateContext.data.x, 'ef');
            assert.strictEqual(Navigation.StateContext.data.y, 'hi');
            assert.strictEqual(Navigation.StateContext.data.z, 'jk');
            assert.strictEqual(Navigation.StateContext.data.a, 'lm');
            Navigation.StateController.navigateLink('/ab/cde/fg/h');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.w, 'cde');
            assert.strictEqual(Navigation.StateContext.data.x, 'fg');
            assert.strictEqual(Navigation.StateContext.data.y, 'h');
            Navigation.StateController.navigateLink('/ab/cde/fg/h?a=i');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 4);
            assert.strictEqual(Navigation.StateContext.data.w, 'cde');
            assert.strictEqual(Navigation.StateContext.data.x, 'fg');
            assert.strictEqual(Navigation.StateContext.data.y, 'h');
            assert.strictEqual(Navigation.StateContext.data.a, 'i');
            Navigation.StateController.navigateLink('/ab/cc/def');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.w, 'cc');
            assert.strictEqual(Navigation.StateContext.data.x, 'def');
            Navigation.StateController.navigateLink('/ab/cc/def?a=gg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.w, 'cc');
            assert.strictEqual(Navigation.StateContext.data.x, 'def');
            assert.strictEqual(Navigation.StateContext.data.a, 'gg');
            Navigation.StateController.navigateLink('/ab/ccdd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.w, 'ccdd');
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            Navigation.StateController.navigateLink('/ab/ccdd?a=fg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.w, 'ccdd');
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            assert.strictEqual(Navigation.StateContext.data.a, 'fg');
            Navigation.StateController.navigateLink('/ab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.w, 'abc');
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            Navigation.StateController.navigateLink('/ab?a=fg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.w, 'abc');
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            assert.strictEqual(Navigation.StateContext.data.a, 'fg');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ ab/cde/fg/h'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cde/fg/h/ij/k'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cde/fg/h//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cde/fg//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cd//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cd', x: 'ef', y: 'hi', z: 'jk' }), '/ab/cd/ef/hi/jk');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cd', x: 'ef', y: 'hi', z: 'jk', a: 'lm' }), '/ab/cd/ef/hi/jk?a=lm');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cd', x: 'de', y: 'hi', z: 'jk' }), '/ab/cd/de/hi/jk');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cd', x: 'de', y: 'hi', z: 'jk', a: 'lm' }), '/ab/cd/de/hi/jk?a=lm');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', x: 'ef', y: 'hi', z: 'jk' }), '/ab/abc/ef/hi/jk');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', x: 'ef', y: 'hi', z: 'jk', a: 'lm' }), '/ab/abc/ef/hi/jk?a=lm');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', x: 'de', y: 'hi', z: 'jk' }), '/ab/abc/de/hi/jk');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', x: 'de', y: 'hi', z: 'jk', a: 'lm' }), '/ab/abc/de/hi/jk?a=lm');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ef', y: 'hi', z: 'jk' }), '/ab/abc/ef/hi/jk');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ef', y: 'hi', z: 'jk', a: 'lm' }), '/ab/abc/ef/hi/jk?a=lm');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'hi', z: 'jk' }), '/ab/abc/de/hi/jk');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'hi', z: 'jk', a: 'lm' }), '/ab/abc/de/hi/jk?a=lm');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'hi' }), '/ab/abc/de/hi');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'hi', a: 'lm' }), '/ab/abc/de/hi?a=lm');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ef' }), '/ab/abc/ef');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ef', a: 'lm' }), '/ab/abc/ef?a=lm');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de' }), '/ab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', a: 'lm' }), '/ab?a=lm');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'hi', z: 'jk' }), '/ab/abc/de/hi/jk');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'hi', z: 'jk', a: 'lm' }), '/ab/abc/de/hi/jk?a=lm');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'hi' }), '/ab/abc/de/hi');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'hi', a: 'lm' }), '/ab/abc/de/hi?a=lm');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cde', x: 'fg', y: 'h' }), '/ab/cde/fg/h');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cde', x: 'fg', y: 'h', a: 'i' }), '/ab/cde/fg/h?a=i');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', x: 'de', y: 'h' }), '/ab/abc/de/h');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', x: 'de', y: 'h', a: 'i' }), '/ab/abc/de/h?a=i');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cde', y: 'h', z: 'jk' }), '/ab/cde/de/h/jk');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cde', y: 'h', z: 'jk', a: 'lm' }), '/ab/cde/de/h/jk?a=lm');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', y: 'h', z: 'jk' }), '/ab/abc/de/h/jk');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', y: 'h', z: 'jk', a: 'lm' }), '/ab/abc/de/h/jk?a=lm');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cde', y: 'h' }), '/ab/cde/de/h');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cde', y: 'h', a: 'i' }), '/ab/cde/de/h?a=i');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', y: 'h' }), '/ab/abc/de/h');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', y: 'h', a: 'i' }), '/ab/abc/de/h?a=i');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cc', x: 'def' }), '/ab/cc/def');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cc', x: 'def', a: 'gg' }), '/ab/cc/def?a=gg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cc', x: 'de' }), '/ab/cc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cc', x: 'de', a: 'gg' }), '/ab/cc?a=gg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', x: 'de' }), '/ab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', x: 'de', a: 'fg' }), '/ab?a=fg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', x: 'def' }), '/ab/abc/def');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', x: 'def', a: 'gg' }), '/ab/abc/def?a=gg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'ccdd' }), '/ab/ccdd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'ccdd', a: 'gg' }), '/ab/ccdd?a=gg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc' }), '/ab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', a: 'fg' }), '/ab?a=fg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/ab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { a: 'fg' }), '/ab?a=fg');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'jk' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cde', z: 'jk' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', z: 'jk' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'fg', z: 'jk' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', z: 'jk' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', x: 'fg', z: 'jk' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cde', x: 'de', z: 'jk' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'cde', x: 'fg', z: 'jk' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { w: 'abc', x: 'de', z: 'jk' }), null);
        });
    });

    describe('Spaces', function () {
        it('should match', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigateLink('/   a  ');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, '   a  ');
            Navigation.StateController.navigateLink('/   a  ?y=   b  ');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, '   a  ');
            assert.strictEqual(Navigation.StateContext.data.y, '   b  ');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '   a  ' }), '/%20%20%20a%20%20');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '   a  ', y: '   b  ' }), '/%20%20%20a%20%20?y=%20%20%20b%20%20');
        });
    });

    describe('Multi Char Param', function () {
        it('should match', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'a/{someVar}', trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigateLink('/a/someVal');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.someVar, 'someVal');
            Navigation.StateController.navigateLink('/a/someVal?anotherVar=anotherVal');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.someVar, 'someVal');
            assert.strictEqual(Navigation.StateContext.data.anotherVar, 'anotherVal');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { someVar: 'someVal' }), '/a/someVal');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { someVar: 'someVal', anotherVar: 'anotherVal' }), '/a/someVal?anotherVar=anotherVal');
        });
    });

    describe('Match Slash', function () {
        it('should match', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigateLink('abc/');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'abc');
        });
    });

    describe('Reserved Url Character', function () {
        it('should match', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'a/{=*"()\'-_+~@:?><.;[],!£$%^#&}', defaults: { '=*"()\'-_+~@:?><.;[],!£$%^#&': '*="()\'-__+~@:?><.;[],!£$%^#&' }, trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigateLink('/a/*%3D%22()\'-0__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data['=*"()\'-_+~@:?><.;[],!£$%^#&'], '*="()\'-__+~@:?><.;[],!£$%^#&');
            Navigation.StateController.navigateLink('/a/*%3D%22()\'-0__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26?*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data['=*"()\'-_+~@:?><.;[],!£$%^#&'], '*="()\'-__+~@:?><.;[],!£$%^#&');
            assert.strictEqual(Navigation.StateContext.data['*="()\'-__+~@:?><.;[],!£$%^#&'], '*="()\'-_+~@:?><.;[],!£$%^#&');
            Navigation.StateController.navigateLink('/a');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data['=*"()\'-_+~@:?><.;[],!£$%^#&'], '*="()\'-__+~@:?><.;[],!£$%^#&');
            Navigation.StateController.navigateLink('/a?*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data['=*"()\'-_+~@:?><.;[],!£$%^#&'], '*="()\'-__+~@:?><.;[],!£$%^#&');
            assert.strictEqual(Navigation.StateContext.data['*="()\'-__+~@:?><.;[],!£$%^#&'], '*="()\'-_+~@:?><.;[],!£$%^#&');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { '=*"()\'-_+~@:?><.;[],!£$%^#&': '*="()\'-_+~@:?><.;[],!£$%^#&' }), '/a/*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { '=*"()\'-_+~@:?><.;[],!£$%^#&': '*="()\'-_+~@:?><.;[],!£$%^#&', '*="()\'-__+~@:?><.;[],!£$%^#&': '*="()\'-_+~@:?><.;[],!£$%^#&'}), '/a/*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26?*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { '=*"()\'-_+~@:?><.;[],!£$%^#&': '*="()\'-__+~@:?><.;[],!£$%^#&' }), '/a');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { '=*"()\'-_+~@:?><.;[],!£$%^#&': '*="()\'-__+~@:?><.;[],!£$%^#&', '*="()\'-__+~@:?><.;[],!£$%^#&': '*="()\'-_+~@:?><.;[],!£$%^#&'}), '/a?*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/a');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { '*="()\'-__+~@:?><.;[],!£$%^#&': '*="()\'-_+~@:?><.;[],!£$%^#&' }), '/a?*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
        });
    });

    describe('Reserved Regex Character', function () {
        it('should match', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '.+*\^$\[\]()\'/{x}', trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigateLink('/.+*\^$\[\]()\'/abc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'abc');
            Navigation.StateController.navigateLink('/.+*\^$\[\]()\'/abc?y=de');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'abc');
            assert.strictEqual(Navigation.StateContext.data.y, 'de');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc' }), '/.+*\^$\[\]()\'/abc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc', y: 'de' }), '/.+*\^$\[\]()\'/abc?y=de');
        });
    });

    describe('One Param Optional Mandatory One Mixed Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab{x?}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abcde');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'cde');
            Navigation.StateController.navigateLink('/abcde?y=fg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'cde');
            assert.strictEqual(Navigation.StateContext.data.y, 'fg');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cde'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abcd//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde' }), '/abcde');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde', y: 'fg' }), '/abcde?y=fg');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param One Optional Mandatory Three Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x?}/{y}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'efg');
            Navigation.StateController.navigateLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'efg');
            assert.strictEqual(Navigation.StateContext.data.z, 'hi');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ ab/cd/efg'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cd/efg/h'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab//efg'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('//cd/efg'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cde'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/ab/cd/efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg?z=hi');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'efg' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param Two Segment Default Mandatory', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{y}', defaults: { x: 'ab' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/aa/bbb');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'bbb');
            Navigation.StateController.navigateLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'aa');
            assert.strictEqual(Navigation.StateContext.data.y, 'bbb');
            assert.strictEqual(Navigation.StateContext.data.z, 'cccc');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/aa/bbb/e'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/aa//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/aa'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'bbb' }), '/ab/bbb');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'bbb', z: 'cccc' }), '/ab/bbb?z=cccc');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('Two Param One Optional Mandatory Four Segment Default Mandatory', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x?}/{y}/c', defaults: { y: 'ee' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab/cd/efg/c');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'efg');
            Navigation.StateController.navigateLink('/ab/cd/efg/c?z=hi');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'efg');
            assert.strictEqual(Navigation.StateContext.data.z, 'hi');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ ab/cd/efg/c'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cd/efg'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cd/efg/c//'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab//efg/c'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cd//c'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab///c'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/c'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/ab/cd/efg/c');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg/c?z=hi');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd' }), '/ab/cd/ee/c');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', z: 'ef' }), '/ab/cd/ee/c?z=ef');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'efg' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('Extra Defaults', function () {
        it('should match', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaults: { x: 'a', y: 'b' }, trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'a');
            assert.strictEqual(Navigation.StateContext.data.y, 'b');
            Navigation.StateController.navigateLink('/?z=c');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'a');
            assert.strictEqual(Navigation.StateContext.data.y, 'b');
            assert.strictEqual(Navigation.StateContext.data.z, 'c');
        });
    });

    describe('Case Insensitive', function () {
        it('should match', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'abc/{x}', trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigateLink('/AbC/aBc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'aBc');
            Navigation.StateController.navigateLink('/AbC/aBc?y=dE');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'aBc');
            assert.strictEqual(Navigation.StateContext.data.y, 'dE');
        });
    });

    describe('Multiple Routes', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{x}', trackCrumbTrail: false },
                    { key: 's1', route: 'cd/{x}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab/ef');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'ef');
            Navigation.StateController.navigateLink('/ab/ef?y=gh');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'ef');
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            Navigation.StateController.navigateLink('/cd/ef');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'ef');
            Navigation.StateController.navigateLink('/cd/ef?y=gh');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'ef');
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/aa/bbb'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/cd'), /Url is invalid/, '');
        });
    });

    describe('Two Route One With Param', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['', 'abc/{x}'], trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 0);
            Navigation.StateController.navigateLink('/?y=d');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.y, 'd');
            Navigation.StateController.navigateLink('/abc/de');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            Navigation.StateController.navigateLink('/abc/de?y=f');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            assert.strictEqual(Navigation.StateContext.data.y, 'f');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/abc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/de'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ abc/de'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('//abc/de'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'd' }), '/?y=d');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de' }), '/abc/de');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'f' }), '/abc/de?y=f');
        });
    });

    describe('Two Route Param', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['abc/{x}', 'def/{y}'], trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abc/de');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            Navigation.StateController.navigateLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            assert.strictEqual(Navigation.StateContext.data.z, 'f');
            Navigation.StateController.navigateLink('/def/gh');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            Navigation.StateController.navigateLink('/def/gh?z=i');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            assert.strictEqual(Navigation.StateContext.data.z, 'i');
            Navigation.StateController.navigateLink('/abc/de?y=fg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            assert.strictEqual(Navigation.StateContext.data.y, 'fg');
            Navigation.StateController.navigateLink('/abc/de?y=fg&z=h');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            assert.strictEqual(Navigation.StateContext.data.y, 'fg');
            assert.strictEqual(Navigation.StateContext.data.z, 'h');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/abc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/def'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ abc/de'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ def/gh'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abd/ef'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc/de/f'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/def/gh/i'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de' }), '/abc/de');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'gh' }), '/def/gh');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'gh', z: 'i' }), '/def/gh?z=i');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'gh' }), '/abc/de?y=gh');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'gh', z: 'i' }), '/abc/de?y=gh&z=i');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'g' }), null);
        });
    });

    describe('Two Route Parent Child', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['abc/{x}', 'abc/{x}/def/{y}'], trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abc/de');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            Navigation.StateController.navigateLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            assert.strictEqual(Navigation.StateContext.data.z, 'f');
            Navigation.StateController.navigateLink('/abc/de/def/gh');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            Navigation.StateController.navigateLink('/abc/de/def/gh?z=i');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            assert.strictEqual(Navigation.StateContext.data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/abc'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc/de/def'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc/de/def/gh/i'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abd/de'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc/de/deg/gh'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ abc/de'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ abc/de/def/gh'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de' }), '/abc/de');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'gh' }), '/abc/de/def/gh');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'gh', z: 'f' }), '/abc/de/def/gh?z=f');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'g' }), null);
        });
    });

    describe('Two Route Default', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['abc/{x}', 'def/{y}'], defaults: { x: 'd' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'd');
            Navigation.StateController.navigateLink('/abc?z=e');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'd');
            assert.strictEqual(Navigation.StateContext.data.z, 'e');
            Navigation.StateController.navigateLink('/abc/de');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            Navigation.StateController.navigateLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            assert.strictEqual(Navigation.StateContext.data.z, 'f');
            Navigation.StateController.navigateLink('/def/gh');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'd');
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            Navigation.StateController.navigateLink('/def/gh?z=i');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'd');
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            assert.strictEqual(Navigation.StateContext.data.z, 'i');
            Navigation.StateController.navigateLink('/abc/de?y=gh');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            Navigation.StateController.navigateLink('/abc/de?y=gh&z=i');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            assert.strictEqual(Navigation.StateContext.data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/def'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ abc/de'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ def/gh'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abd/ef'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc/de/f'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/def/gh/i'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/abc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'e' }), '/abc?z=e');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de' }), '/abc/de');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'gh' }), '/def/gh');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'gh', z: 'i' }), '/def/gh?z=i');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'gh' }), '/abc/de?y=gh');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'gh', z: 'i' }), '/abc/de?y=gh&z=i');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'd', y: 'gh' }), '/def/gh');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'd', y: 'gh', z: 'i' }), '/def/gh?z=i');
        });
    });

    describe('Two Route Optional', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['abc/{x?}', 'abc/{x}/def/{y}'], trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 0);
            Navigation.StateController.navigateLink('/abc?z=d');
            assert.strictEqual(Navigation.StateContext.data.z, 'd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            Navigation.StateController.navigateLink('/abc/de');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            Navigation.StateController.navigateLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            assert.strictEqual(Navigation.StateContext.data.z, 'f');
            Navigation.StateController.navigateLink('/abc/de/def/gh');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            Navigation.StateController.navigateLink('/abc/de/def/gh?z=i');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'de');
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            assert.strictEqual(Navigation.StateContext.data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/abc/de/def'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc/de/def/gh/i'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abd/de'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/abc/de/deg/gh'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ abc/de'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ abc/de/def/gh'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/abc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'd' }), '/abc?z=d');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de' }), '/abc/de');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'gh' }), '/abc/de/def/gh');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'gh', z: 'f' }), '/abc/de/def/gh?z=f');
        });
    });

    describe('Two Route Default Number', function () {
        it('should match', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['def/{y}', 'abc/{x}'], defaults: { x: 2 }, trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigateLink('/abc');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 2);
            Navigation.StateController.navigateLink('/abc?z=e');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 2);
            assert.strictEqual(Navigation.StateContext.data.z, 'e');
            Navigation.StateController.navigateLink('/abc/3');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 3);
            Navigation.StateController.navigateLink('/abc/3?z=f');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 3);
            assert.strictEqual(Navigation.StateContext.data.z, 'f');
            Navigation.StateController.navigateLink('/def/gh');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 2);
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            Navigation.StateController.navigateLink('/def/gh?z=i');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 2);
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            assert.strictEqual(Navigation.StateContext.data.z, 'i');
            Navigation.StateController.navigateLink('/def/gh?x=3');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 3);
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            Navigation.StateController.navigateLink('/def/gh?x=3&z=i');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 3);
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            assert.strictEqual(Navigation.StateContext.data.z, 'i');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/abc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'e' }), '/abc?z=e');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/abc/3');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3, z: 'f' }), '/abc/3?z=f');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'gh' }), '/def/gh');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'gh', z: 'i' }), '/def/gh?z=i');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3, y: 'gh' }), '/def/gh?x=3');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3, y: 'gh', z: 'i' }), '/def/gh?x=3&z=i');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 2, y: 'gh' }), '/def/gh');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 2, y: 'gh', z: 'i' }), '/def/gh?z=i');
        });
    });

    describe('Two Route Default Type Number', function () {
        it('should match', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['def/{y}', 'abc/{x}'], defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigateLink('/abc/3');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 3);
            Navigation.StateController.navigateLink('/abc/3?z=f');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 3);
            assert.strictEqual(Navigation.StateContext.data.z, 'f');
            Navigation.StateController.navigateLink('/def/gh');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            Navigation.StateController.navigateLink('/def/gh?z=i');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            assert.strictEqual(Navigation.StateContext.data.z, 'i');
            Navigation.StateController.navigateLink('/def/gh?x=3');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 3);
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            Navigation.StateController.navigateLink('/def/gh?x=3&z=i');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 3);
            assert.strictEqual(Navigation.StateContext.data.y, 'gh');
            assert.strictEqual(Navigation.StateContext.data.z, 'i');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/abc/3');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3, z: 'f' }), '/abc/3?z=f');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'gh' }), '/def/gh');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'gh', z: 'i' }), '/def/gh?z=i');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3, y: 'gh' }), '/def/gh?x=3');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3, y: 'gh', z: 'i' }), '/def/gh?x=3&z=i');
        });
    });

    describe('Without Types', function () {
        it('should match', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackTypes: false, trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigateLink('/abc');
            assert.strictEqual(Navigation.StateContext.data.x, 'abc');
            Navigation.StateController.navigateLink('/3');
            assert.strictEqual(Navigation.StateContext.data.x, '3');
            Navigation.StateController.navigateLink('/true');
            assert.strictEqual(Navigation.StateContext.data.x, 'true');
            Navigation.StateController.navigateLink('/0_1_2_');
            assert.strictEqual(Navigation.StateContext.data.x, '0_1_2_');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc' }), '/abc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/3');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: true }), '/true');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '0_1_2_' }), '/0_1_2_');
        });
    });

    describe('Without Types Default', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackTypes: false, defaults: { x: 2 }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Navigation.StateContext.data.x, 2);
            Navigation.StateController.navigateLink('/3');
            assert.strictEqual(Navigation.StateContext.data.x, 3);
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/a'), /not a valid number/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/true'), /not a valid number/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 2 }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '2' }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/3');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '3' }), '/3');
        });
    });

    describe('Without Types Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackTypes: false, defaultTypes: { x: 'boolean' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/true');
            assert.strictEqual(Navigation.StateContext.data.x, true);
            Navigation.StateController.navigateLink('/false');
            assert.strictEqual(Navigation.StateContext.data.x, false);
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/a'), /not a valid boolean/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/2'), /not a valid boolean/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: true }), '/true');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'false' }), '/false');
        });
    });

    describe('Without Types Default And Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackTypes: false, defaults: { x: '2' }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Navigation.StateContext.data.x, '2');
            Navigation.StateController.navigateLink('/3');
            assert.strictEqual(Navigation.StateContext.data.x, 3);
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/a'), /not a valid number/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/true'), /not a valid number/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 2 }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '2' }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/3');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '3' }), '/3');
        });
    });

    describe('Without Types Conflicting Default And Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackTypes: false, defaults: { x: 'a' }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });
        it('should match', function() {
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Navigation.StateContext.data.x, 'a');
            Navigation.StateController.navigateLink('/a');
            assert.strictEqual(Navigation.StateContext.data.x, 'a');
        });
        
        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/b'), /not a valid number/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'a' }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/3');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '3' }), '/3');
        });
    });

    describe('Without Types Query String', function () {
        it('should match', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackTypes: false, trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Navigation.StateContext.data.x, undefined);
            Navigation.StateController.navigateLink('/?x=3');
            assert.strictEqual(Navigation.StateContext.data.x, '3');
            Navigation.StateController.navigateLink('/?x=true');
            assert.strictEqual(Navigation.StateContext.data.x, 'true');
            Navigation.StateController.navigateLink('/?x=0_1_2_');
            assert.strictEqual(Navigation.StateContext.data.x, '0_1_2_');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc' }), '/?x=abc');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/?x=3');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: true }), '/?x=true');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '0_1_2_' }), '/?x=0_1_2_');
        });
    });

    describe('Without Types Query String Default', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackTypes: false, defaults: { x: 2 }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Navigation.StateContext.data.x, 2);
            Navigation.StateController.navigateLink('/?x=3');
            assert.strictEqual(Navigation.StateContext.data.x, 3);
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/?x=a'), /not a valid number/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/?x=true'), /not a valid number/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 2 }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '2' }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/?x=3');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '3' }), '/?x=3');
        });
    });

    describe('Without Types Query String Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackTypes: false, defaultTypes: { x: 'boolean' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=true');
            assert.strictEqual(Navigation.StateContext.data.x, true);
            Navigation.StateController.navigateLink('/?x=false');
            assert.strictEqual(Navigation.StateContext.data.x, false);
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/?x=a'), /not a valid boolean/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/?x=2'), /not a valid boolean/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: true }), '/?x=true');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'false' }), '/?x=false');
        });
    });

    describe('Without Types Query String Default And Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackTypes: false, defaults: { x: '2' }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Navigation.StateContext.data.x, '2');
            Navigation.StateController.navigateLink('/?x=3');
            assert.strictEqual(Navigation.StateContext.data.x, 3);
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/?x=a'), /not a valid number/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/?x=true'), /not a valid number/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 2 }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '2' }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/?x=3');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '3' }), '/?x=3');
        });
    });

    describe('Without Types Query String Conflicting Default And Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackTypes: false, defaults: { x: 'a' }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Navigation.StateContext.data.x, 'a');
            Navigation.StateController.navigateLink('/?x=a');
            assert.strictEqual(Navigation.StateContext.data.x, 'a');
        });
        
        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/?x=b'), /not a valid number/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'a' }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/?x=3');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '3' }), '/?x=3');
        });
    });

    describe('Empty String', function () {
        it('should build', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '' }), null);
        });
    });

    describe('Without Types Two Route Default', function () {
        it('should build', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['{x}', 'a/{y}'], trackTypes: false, defaults: { x: 2 }, trackCrumbTrail: false }]}
                ]);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 2, y: 1 }), '/a/1');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '2', y: 1 }), '/a/1');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 1 }), '/1');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '1' }), '/1');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 2 }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '2' }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 1 }), '/a/1');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 1, y: 2 }), '/1?y=2');
        });
    });

    describe('Array Query String Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=Hello&x=World');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'Hello');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'World');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            Navigation.StateController.navigateLink('/?x=H1-ello&x=W2-orld');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'H1-ello');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'W2-orld');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            Navigation.StateController.navigateLink('/?x=H1-ello');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'H1-ello');
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            Navigation.StateController.navigateLink('/?x=H2-ello');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'H2-ello');
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
        });
        
        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['Hello', 'World'] }), '/?x=Hello&x=World');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['H1-ello', 'W2-orld'] }), '/?x=H1-ello&x=W2-orld');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['H1-ello'] }), '/?x=H1-ello');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['H2-ello'] }), '/?x=H2-ello');
        });
    });

    describe('Array Param Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            Navigation.StateController.navigateLink('/Hello1-World');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'Hello');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'World');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            Navigation.StateController.navigateLink('/H12-ello1-W22-orld');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'H1-ello');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'W2-orld');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            Navigation.StateController.navigateLink('/H12-ello');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'H1-ello');
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            Navigation.StateController.navigateLink('/H22-ello');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'H2-ello');
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
        });
        
        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['Hello', 'World'] }), '/Hello1-World');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['H1-ello', 'W2-orld'] }), '/H12-ello1-W22-orld');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['H1-ello'] }), '/H12-ello');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['H2-ello'] }), '/H22-ello');
        });
    });

    describe('Array Query String Default Type Number', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'numberarray' }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=1&x=2&x=4');
            assert.strictEqual(Navigation.StateContext.data.x[0], 1);
            assert.strictEqual(Navigation.StateContext.data.x[1], 2);
            assert.strictEqual(Navigation.StateContext.data.x[2], 4);
            assert.strictEqual(Navigation.StateContext.data.x.length, 3);
        });
        
        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [1, 2, 4] }), '/?x=1&x=2&x=4');
        });
    });

    describe('Array Query String Default Type Boolean', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'booleanarray' }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=true&x=false');
            assert.strictEqual(Navigation.StateContext.data.x[0], true);
            assert.strictEqual(Navigation.StateContext.data.x[1], false);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
        });
        
        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [true, false] }), '/?x=true&x=false');
        });
    });

    describe('Without Types Array Query String Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackTypes: false, defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=He_llo&x=Wor-ld');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'He_llo');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'Wor-ld');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            Navigation.StateController.navigateLink('/?x=1&x=2&x=4');
            assert.strictEqual(Navigation.StateContext.data.x[0], '1');
            assert.strictEqual(Navigation.StateContext.data.x[1], '2');
            assert.strictEqual(Navigation.StateContext.data.x[2], '4');
            assert.strictEqual(Navigation.StateContext.data.x.length, 3);
        });
        
        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['He_llo', 'Wor-ld'] }), '/?x=He_llo&x=Wor-ld');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [1, 2, 4] }), '/?x=1&x=2&x=4');
        });
    });

    describe('Array Query String Default', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaults: { x: ['Hello', 'World'] }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=Hello');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'Hello');
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            Navigation.StateController.navigateLink('/?x=World&x=Hello');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'World');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'Hello');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
        });
        
        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['Hello'] }), '/?x=Hello');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['Hello', 'World'] }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['World', 'Hello'] }), '/?x=World&x=Hello');
        });
    });

    describe('Array Query String Default Number', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaults: { x: [1, 2, 4] }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=1');
            assert.strictEqual(Navigation.StateContext.data.x[0], 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            Navigation.StateController.navigateLink('/?x=1&x=4&x=2');
            assert.strictEqual(Navigation.StateContext.data.x[0], 1);
            assert.strictEqual(Navigation.StateContext.data.x[1], 4);
            assert.strictEqual(Navigation.StateContext.data.x[2], 2);
            assert.strictEqual(Navigation.StateContext.data.x.length, 3);
        });
        
        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [1, 2] }), '/?x=1&x=2');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [1, 2, 4] }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [1, 4, 2] }), '/?x=1&x=4&x=2');
        });
    });

    describe('Array Query String Default Boolean', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaults: { x: [true, false] }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=false');
            assert.strictEqual(Navigation.StateContext.data.x[0], false);
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            Navigation.StateController.navigateLink('/?x=false&x=true');
            assert.strictEqual(Navigation.StateContext.data.x[0], false);
            assert.strictEqual(Navigation.StateContext.data.x[1], true);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
        });
        
        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [false] }), '/?x=false');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [true, false] }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [false, true] }), '/?x=false&x=true');
        });
    });

    describe('Array Query String Default Date', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaults: { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=2011-08-03');
            assert.strictEqual(+Navigation.StateContext.data.x[0], +new Date(2011, 7, 3));
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            Navigation.StateController.navigateLink('/?x=2011-08-03&x=2010-04-07');
            assert.strictEqual(+Navigation.StateContext.data.x[0], +new Date(2011, 7, 3));
            assert.strictEqual(+Navigation.StateContext.data.x[1], +new Date(2010, 3, 7));
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
        });
        
        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [new Date(2010, 3, 7)] }), '/?x=2010-04-07');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [new Date(2011, 7, 3), new Date(2010, 3, 7)] }), '/?x=2011-08-03&x=2010-04-07');
        });
    });

    describe('Combine Array Query String Default Type', function () {
        beforeEach(function () {
            Navigation.settings.combineArray = true;
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });
        afterEach(function() {
            Navigation.settings.combineArray = false;
        });
        
        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=Hello1-World');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'Hello');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'World');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            Navigation.StateController.navigateLink('/?x=H12-ello1-W22-orld');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'H1-ello');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'W2-orld');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            Navigation.StateController.navigateLink('/?x=H12-ello');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'H1-ello');
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            Navigation.StateController.navigateLink('/?x=H22-ello');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'H2-ello');
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
        });
        
        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['Hello', 'World'] }), '/?x=Hello1-World');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['H1-ello', 'W2-orld'] }), '/?x=H12-ello1-W22-orld');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['H1-ello'] }), '/?x=H12-ello');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['H2-ello'] }), '/?x=H22-ello');
        });
    });

    describe('String Query String Default Type Number', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=ab2_0');
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), '/?x=ab2_0');
        });
    });

    describe('String Param Default Type Number', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab2_0');
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), '/ab2_0');
        });
    });

    describe('Number Query String Default Type Boolean', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'boolean' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=1242_2');
            assert.strictEqual(Navigation.StateContext.data.x, 124);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 124 }), '/?x=1242_2');
        });
    });

    describe('Number Param Default Type Boolean', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'boolean' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/1242_2');
            assert.strictEqual(Navigation.StateContext.data.x, 124);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 124 }), '/1242_2');
        });
    });

    describe('Boolean Query String Default Type Date', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'date' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=true2_1');
            assert.strictEqual(Navigation.StateContext.data.x, true);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: true }), '/?x=true2_1');
        });
    });

    describe('Boolean Param Default Type Date', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'date' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/true2_1');
            assert.strictEqual(Navigation.StateContext.data.x, true);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: true }), '/true2_1');
        });
    });

    describe('Date Query String Default Type String', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'string' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=2010-04-072_3');
            assert.strictEqual(+Navigation.StateContext.data.x, +new Date(2010, 3, 7));
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: new Date(2010, 3, 7) }), '/?x=2010-04-072_3');
        });
    });

    describe('Date Param Default Type String', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'string' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/2010-04-072_3');
            assert.strictEqual(+Navigation.StateContext.data.x, +new Date(2010, 3, 7));
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: new Date(2010, 3, 7) }), '/2010-04-072_3');
        });
    });

    describe('String Array Query String Default Type Number Array', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'numberarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=ab2_a0&x=cde');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'cde');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab', 'cde'] }), '/?x=ab2_a0&x=cde');
        });
    });

    describe('String Array Param Default Type Number Array', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'numberarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab1-cde2_a0');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'cde');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab', 'cde'] }), '/ab1-cde2_a0');
        });
    });

    describe('Number Array Query String Default Type Boolean Array', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'booleanarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=1242_a2&x=35');
            assert.strictEqual(Navigation.StateContext.data.x[0], 124);
            assert.strictEqual(Navigation.StateContext.data.x[1], 35);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [124, 35] }), '/?x=1242_a2&x=35');
        });
    });

    describe('Number Array Param Default Type Boolean Array', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'booleanarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/1241-352_a2');
            assert.strictEqual(Navigation.StateContext.data.x[0], 124);
            assert.strictEqual(Navigation.StateContext.data.x[1], 35);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [124, 35] }), '/1241-352_a2');
        });
    });

    describe('Boolean Array Query String Default Type Date Array', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'datearray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=true2_a1&x=false');
            assert.strictEqual(Navigation.StateContext.data.x[0], true);
            assert.strictEqual(Navigation.StateContext.data.x[1], false);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [true, false] }), '/?x=true2_a1&x=false');
        });
    });

    describe('Boolean Array Param Default Type Date Array', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'datearray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/true1-false2_a1');
            assert.strictEqual(Navigation.StateContext.data.x[0], true);
            assert.strictEqual(Navigation.StateContext.data.x[1], false);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [true, false] }), '/true1-false2_a1');
        });
    });

    describe('Date Array Query String Default Type String Array', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=2010-04-072_a3&x=2011-08-03');
            assert.strictEqual(+Navigation.StateContext.data.x[0], +new Date(2010, 3, 7));
            assert.strictEqual(+Navigation.StateContext.data.x[1], +new Date(2011, 7, 3));
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }), '/?x=2010-04-072_a3&x=2011-08-03');
        });
    });

    describe('Date Array Param Default Type String Array', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/20102-042-071-20112-082-032_a3');
            assert.strictEqual(+Navigation.StateContext.data.x[0], +new Date(2010, 3, 7));
            assert.strictEqual(+Navigation.StateContext.data.x[1], +new Date(2011, 7, 3));
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }), '/20102-042-071-20112-082-032_a3');
        });
    });

    describe('No Param One Segment Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'abc', trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => val.replace(' ', '+')  
            state.stateHandler.urlDecode = (state, key, val) => val.replace('+', ' ')  
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abc?x=a+b');
            assert.strictEqual(Navigation.StateContext.data.x, 'a b');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'a b' }), '/abc?x=a+b');
        });
    });

    describe('One Param Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => val.replace(' ', '+')  
            state.stateHandler.urlDecode = (state, key, val) => val.replace('+', ' ')  
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/a+b');
            assert.strictEqual(Navigation.StateContext.data.x, 'a b');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'a b' }), '/a+b');
        });
    });

    describe('One Param Query String Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val, queryString) =>  {
                return queryString ? val.replace(' ', '+') : encodeURIComponent(val);
            }  
            state.stateHandler.urlDecode = (state, key, val, queryString) => {
                return queryString ? val.replace('+', ' ') : decodeURIComponent(val);
            }  
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/a%20b?y=c+d');
            assert.strictEqual(Navigation.StateContext.data.x, 'a b');
            assert.strictEqual(Navigation.StateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/a%20b?y=c+d');
        });
    });

    describe('One Param Route Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val, queryString) => {
                return !queryString ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.stateHandler.urlDecode = (state, key, val, queryString) => {
                return !queryString ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/a+b?y=c%20d');
            assert.strictEqual(Navigation.StateContext.data.x, 'a b');
            assert.strictEqual(Navigation.StateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/a+b?y=c%20d');
        });
    });

    describe('No Param One Segment State Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's', states: [
                    { key: 's', route: 'a', trackCrumbTrail: false }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'b', trackCrumbTrail: false }]}
                ]);
            var dialogs = Navigation.StateInfoConfig.dialogs;
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
            Navigation.StateController.navigateLink('/a?x=c+d');
            assert.strictEqual(Navigation.StateContext.data.x, 'c d');
            Navigation.StateController.navigateLink('/b?x=c%20d');
            assert.strictEqual(Navigation.StateContext.data.x, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d0', { x: 'c d' }), '/a?x=c+d');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d1', { x: 'c d' }), '/b?x=c%20d');
        });
    });

    describe('One Param State Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's', states: [
                    { key: 's', route: 'a/{x}', trackCrumbTrail: false }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'b/{x}', trackCrumbTrail: false }]}
                ]);
            var dialogs = Navigation.StateInfoConfig.dialogs;
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
            Navigation.StateController.navigateLink('/a/c+d');
            assert.strictEqual(Navigation.StateContext.data.x, 'c d');
            Navigation.StateController.navigateLink('/b/c%20d');
            assert.strictEqual(Navigation.StateContext.data.x, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d0', { x: 'c d' }), '/a/c+d');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d1', { x: 'c d' }), '/b/c%20d');
        });
    });

    describe('One Param One Dialog State Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'a/{x}', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's1' }]},
                    { key: 's1', route: 'b/{x}', trackCrumbTrail: false }]},
                ]);
            var dialog = Navigation.StateInfoConfig.dialogs['d'];
            for(var key in dialog.states) {
                var state = dialog.states[key];
                state.stateHandler.urlEncode = (state, key, val) => {
                    return state == dialog.states['s1'] ? val.replace(' ', '+') : encodeURIComponent(val);
                }
                state.stateHandler.urlDecode = (state, key, val) => {
                    return state == dialog.states['s1'] ? val.replace('+', ' ') : decodeURIComponent(val);
                }
            }
            Navigation.StateController.navigate('d', { x: 'e'});
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/a/c%20d');
            assert.strictEqual(Navigation.StateContext.data.x, 'c d');
            Navigation.StateController.navigateLink('/b/c+d');
            assert.strictEqual(Navigation.StateContext.data.x, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'c d' }), '/a/c%20d');
            assert.strictEqual(Navigation.StateController.getNavigationLink('t', { x: 'c d' }), '/b/c+d');
        });
    });

    describe('One Param Query String Key Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) =>  {
                return key === 'y' ? val.replace(' ', '+') : encodeURIComponent(val);
            }  
            state.stateHandler.urlDecode = (state, key, val) => {
                return key === 'y' ? val.replace('+', ' ') : decodeURIComponent(val);
            }  
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/a%20b?y=c+d');
            assert.strictEqual(Navigation.StateContext.data.x, 'a b');
            assert.strictEqual(Navigation.StateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/a%20b?y=c+d');
        });
    });

    describe('One Param Route Key Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => {
                return key === 'x' ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.stateHandler.urlDecode = (state, key, val) => {
                return key === 'x' ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/a+b?y=c%20d');
            assert.strictEqual(Navigation.StateContext.data.x, 'a b');
            assert.strictEqual(Navigation.StateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/a+b?y=c%20d');
        });
    });

    describe('Two Param Route Key Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{y}', trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => {
                return key === 'x' ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.stateHandler.urlDecode = (state, key, val) => {
                return key === 'x' ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/a+b/c%20d');
            assert.strictEqual(Navigation.StateContext.data.x, 'a b');
            assert.strictEqual(Navigation.StateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/a+b/c%20d');
        });
    });

    describe('One Optional Param Route Key Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x?}', trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => {
                return key === 'x' ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.stateHandler.urlDecode = (state, key, val) => {
                return key === 'x' ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/a+b?y=c%20d');
            assert.strictEqual(Navigation.StateContext.data.x, 'a b');
            assert.strictEqual(Navigation.StateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/a+b?y=c%20d');
        });
    });

    describe('One Mixed Param Route Key Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab{x}', trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => {
                return key === 'x' ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.stateHandler.urlDecode = (state, key, val) => {
                return key === 'x' ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/aba+b?y=c%20d');
            assert.strictEqual(Navigation.StateContext.data.x, 'a b');
            assert.strictEqual(Navigation.StateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/aba+b?y=c%20d');
        });
    });

    describe('No Param Two Query String Key Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) =>  {
                return key === 'y' ? val.replace(' ', '+') : encodeURIComponent(val);
            }  
            state.stateHandler.urlDecode = (state, key, val) => {
                return key === 'y' ? val.replace('+', ' ') : decodeURIComponent(val);
            }  
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=a%20b&y=c+d');
            assert.strictEqual(Navigation.StateContext.data.x, 'a b');
            assert.strictEqual(Navigation.StateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/?x=a%20b&y=c+d');
        });
    });

    describe('No Param Key Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) =>  {
                return !key ? val.replace(' ', '+') : encodeURIComponent(val);
            }  
            state.stateHandler.urlDecode = (state, key, val) => {
                return !key ? val.replace('+', ' ') : decodeURIComponent(val);
            }  
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/?a+b=c%20d');
            assert.strictEqual(Navigation.StateContext.data['a b'], 'c d');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { 'a b': 'c d' }), '/?a+b=c%20d');
        });
    });

    describe('No Param Two Key Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) =>  {
                return (!key && val == 'a b') ? val.replace(' ', '+') : encodeURIComponent(val);
            }  
            state.stateHandler.urlDecode = (state, key, val) => {
                return (!key && val == 'a+b') ? val.replace('+', ' ') : decodeURIComponent(val);
            }  
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/?a+b=c%20d&e%20f=g%20h');
            assert.strictEqual(Navigation.StateContext.data['a b'], 'c d');
            assert.strictEqual(Navigation.StateContext.data['e f'], 'g h');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { 'a b': 'c d', 'e f': 'g h' }), '/?a+b=c%20d&e%20f=g%20h');
        });
    });

    describe('One Param Empty Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            delete state.stateHandler.urlEncode;
            delete state.stateHandler.urlDecode;
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/a%20b?y=c%20d');
            assert.strictEqual(Navigation.StateContext.data.x, 'a b');
            assert.strictEqual(Navigation.StateContext.data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'a b', y: 'c d' }), '/a%20b?y=c%20d');
        });
    });

    describe('No Param Array Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => val.replace(' ', '+')
            state.stateHandler.urlDecode = (state, key, val) => val.replace('+', ' ')
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=a+b&x=c+de');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'a b');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'c de');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['a b', 'c de'] }), '/?x=a+b&x=c+de');
        });
    });

    describe('No Param Array Query String Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val, queryString) => {
                return queryString ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.stateHandler.urlDecode = (state, key, val, queryString) => {
                return queryString ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=a+b&x=c+de');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'a b');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'c de');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['a b', 'c de'] }), '/?x=a+b&x=c+de');
        });
    });

    describe('No Param Array Key Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '', defaultTypes: { x: 'stringarray', y: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => {
                return key === 'x' ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.stateHandler.urlDecode = (state, key, val) => {
                return key === 'x' ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/?x=a+b&x=c+de&y=f%20g');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'a b');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'c de');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'f g');
            assert.strictEqual(Navigation.StateContext.data.y.length, 1);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['a b', 'c de'], y: ['f g'] }), '/?x=a+b&x=c+de&y=f%20g');
        });
    });

    describe('No Param One Segment Array State Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's', states: [
                    { key: 's', route: 'a', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'b', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
            var dialogs = Navigation.StateInfoConfig.dialogs;
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
            Navigation.StateController.navigateLink('/a?x=a+b&x=c+de');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'a b');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'c de');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            Navigation.StateController.navigateLink('/b?x=a%20b&x=c%20de');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'a b');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'c de');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d0', { x: ['a b', 'c de'] }), '/a?x=a+b&x=c+de');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d1', { x: ['a b', 'c de'] }), '/b?x=a%20b&x=c%20de');
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
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x?}', trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => val.replace(' ', '+')
            state.stateHandler.urlDecode = (state, key, val) => val.replace('+', ' ')
        });
        
        it('should match', function() {
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Navigation.StateContext.data.x, undefined);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
        });
    });

    describe('One Empty Param Route Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => val.replace(' ', '+')
            state.stateHandler.urlDecode = (state, key, val) => val.replace('+', ' ')
        });
        
        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('One Empty Mixed Param Route Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab{x}', trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => val.replace(' ', '+')
            state.stateHandler.urlDecode = (state, key, val) => val.replace('+', ' ')
        });
        
        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('One Splat Param One Segment Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abcd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'abcd');
            Navigation.StateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'cd');
            Navigation.StateController.navigateLink('/ab/cd?y=efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'efg');
            Navigation.StateController.navigateLink('/ab//cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 3);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
            assert.strictEqual(Navigation.StateContext.data.x[1], null);
            assert.strictEqual(Navigation.StateContext.data.x[2], 'cd');
            Navigation.StateController.navigateLink('//ab/cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 3);
            assert.strictEqual(Navigation.StateContext.data.x[0], null);
            assert.strictEqual(Navigation.StateContext.data.x[1], 'ab');
            assert.strictEqual(Navigation.StateContext.data.x[2], 'cd');
            Navigation.StateController.navigateLink('/ab/cd//');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 3);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'cd');
            assert.strictEqual(Navigation.StateContext.data.x[2], null);
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['abcd'] }), '/abcd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab', 'cd'] }), '/ab/cd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab', 'cd'], y: 'efg' }), '/ab/cd?y=efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab', null, 'cd'] }), '/ab//cd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [null, 'ab', 'cd'] }), '//ab/cd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab', 'cd', null] }), '/ab/cd//');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('One Splat Param One Segment Default', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaults: { x: ['ef', 'ghi'] }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ef');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'ghi');
            Navigation.StateController.navigateLink('/abcd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'abcd');
            Navigation.StateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'cd');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['abcd'] }), '/abcd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab', 'cd'] }), '/ab/cd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ef', 'ghi'] }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ghi', 'ef'] }), '/ghi/ef');
        });
    });
    
    describe('One Optional Splat Param One Segment Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x?}', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 0);
            Navigation.StateController.navigateLink('/abcd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'abcd');
            Navigation.StateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'cd');
            Navigation.StateController.navigateLink('/ab/cd?y=efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'efg');
            Navigation.StateController.navigateLink('/ab//cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 3);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
            assert.strictEqual(Navigation.StateContext.data.x[1], null);
            assert.strictEqual(Navigation.StateContext.data.x[2], 'cd');
            Navigation.StateController.navigateLink('//ab/cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 3);
            assert.strictEqual(Navigation.StateContext.data.x[0], null);
            assert.strictEqual(Navigation.StateContext.data.x[1], 'ab');
            assert.strictEqual(Navigation.StateContext.data.x[2], 'cd');
            Navigation.StateController.navigateLink('/ab/cd//');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 3);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'cd');
            assert.strictEqual(Navigation.StateContext.data.x[2], null);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [''] }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['abcd'] }), '/abcd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab', 'cd'] }), '/ab/cd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab', 'cd'], y: 'efg' }), '/ab/cd?y=efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab', null, 'cd'] }), '/ab//cd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [null, 'ab', 'cd'] }), '//ab/cd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab', 'cd', null] }), '/ab/cd//');
        });
    });

    describe('One Splat Param Two Segment Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{*x}', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            Navigation.StateController.navigateLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'efg');
            Navigation.StateController.navigateLink('/ab/cd/efg?y=hi');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'efg');
            assert.strictEqual(Navigation.StateContext.data.y, 'hi');
            Navigation.StateController.navigateLink('/ab/cd//efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 3);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.x[1], null);
            assert.strictEqual(Navigation.StateContext.data.x[2], 'efg');
            Navigation.StateController.navigateLink('/ab//cd/efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 3);
            assert.strictEqual(Navigation.StateContext.data.x[0], null);
            assert.strictEqual(Navigation.StateContext.data.x[1], 'cd');
            assert.strictEqual(Navigation.StateContext.data.x[2], 'efg');
            Navigation.StateController.navigateLink('/ab/cd/efg//');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 3);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'efg');
            assert.strictEqual(Navigation.StateContext.data.x[2], null);
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd'] }), '/ab/cd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd', 'efg'] }), '/ab/cd/efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd', 'efg'], y: 'hi' }), '/ab/cd/efg?y=hi');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd', null, 'efg'] }), '/ab/cd//efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [null, 'cd', 'efg'] }), '/ab//cd/efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd', 'efg', null] }), '/ab/cd/efg//');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('One Splat Param Two Segment Default', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{*x}', defaults: { x: ['ef', 'ghi'] }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ef');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'ghi');
            Navigation.StateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            Navigation.StateController.navigateLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'efg');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/ab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd'] }), '/ab/cd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd', 'efg'] }), '/ab/cd/efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ef', 'ghi'] }), '/ab');
        });
    });

    describe('Two Param One Splat Two Segment Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{*y}', defaultTypes: { y: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            assert.strictEqual(Navigation.StateContext.data.y.length, 1);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'cd');
            Navigation.StateController.navigateLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            assert.strictEqual(Navigation.StateContext.data.y.length, 2);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.y[1], 'efg');
            Navigation.StateController.navigateLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            assert.strictEqual(Navigation.StateContext.data.y.length, 2);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.y[1], 'efg');
            assert.strictEqual(Navigation.StateContext.data.z, 'hi');
            Navigation.StateController.navigateLink('/ab/cd//efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            assert.strictEqual(Navigation.StateContext.data.y.length, 3);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.y[1], null);
            assert.strictEqual(Navigation.StateContext.data.y[2], 'efg');
            Navigation.StateController.navigateLink('/ab//cd/efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            assert.strictEqual(Navigation.StateContext.data.y.length, 3);
            assert.strictEqual(Navigation.StateContext.data.y[0], null);
            assert.strictEqual(Navigation.StateContext.data.y[1], 'cd');
            assert.strictEqual(Navigation.StateContext.data.y[2], 'efg');
            Navigation.StateController.navigateLink('/ab/cd/efg//');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            assert.strictEqual(Navigation.StateContext.data.y.length, 3);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.y[1], 'efg');
            assert.strictEqual(Navigation.StateContext.data.y[2], null);
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', y: ['cd'] }), '/ab/cd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', y: ['cd', 'efg'] }), '/ab/cd/efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', y: ['cd', 'efg'], z: 'hi' }), '/ab/cd/efg?z=hi');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', y: ['cd', null, 'efg'] }), '/ab/cd//efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', y: [null, 'cd', 'efg'] }), '/ab//cd/efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', y: ['cd', 'efg', null] }), '/ab/cd/efg//');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: ['cd'] }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: ['cd', 'efg'] }), null);
        });
    });

    describe('Two Param One Optional Splat Two Segment Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}/{*y?}', defaultTypes: { y: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            Navigation.StateController.navigateLink('/ab/cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            assert.strictEqual(Navigation.StateContext.data.y.length, 1);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'cd');
            Navigation.StateController.navigateLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            assert.strictEqual(Navigation.StateContext.data.y.length, 2);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.y[1], 'efg');
            Navigation.StateController.navigateLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 3);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            assert.strictEqual(Navigation.StateContext.data.y.length, 2);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.y[1], 'efg');
            assert.strictEqual(Navigation.StateContext.data.z, 'hi');
            Navigation.StateController.navigateLink('/ab/cd//efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            assert.strictEqual(Navigation.StateContext.data.y.length, 3);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.y[1], null);
            assert.strictEqual(Navigation.StateContext.data.y[2], 'efg');
            Navigation.StateController.navigateLink('/ab//cd/efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            assert.strictEqual(Navigation.StateContext.data.y.length, 3);
            assert.strictEqual(Navigation.StateContext.data.y[0], null);
            assert.strictEqual(Navigation.StateContext.data.y[1], 'cd');
            assert.strictEqual(Navigation.StateContext.data.y[2], 'efg');
            Navigation.StateController.navigateLink('/ab/cd/efg//');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
            assert.strictEqual(Navigation.StateContext.data.y.length, 3);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.y[1], 'efg');
            assert.strictEqual(Navigation.StateContext.data.y[2], null);
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), '/ab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', y: ['cd'] }), '/ab/cd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', y: ['cd', 'efg'] }), '/ab/cd/efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', y: ['cd', 'efg'], z: 'hi' }), '/ab/cd/efg?z=hi');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', y: ['cd', null, 'efg'] }), '/ab/cd//efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', y: [null, 'cd', 'efg'] }), '/ab//cd/efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', y: ['cd', 'efg', null] }), '/ab/cd/efg//');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: ['cd'] }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: ['cd', 'efg'] }), null);
        });
    });

    describe('Two Splat Param Three Segment Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}/ab/{*y}', defaultTypes: { x: 'stringarray', y: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/cd/ab/efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.y.length, 1);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'efg');
            Navigation.StateController.navigateLink('/cd/efg/ab/hi');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'efg');
            assert.strictEqual(Navigation.StateContext.data.y.length, 1);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'hi');
            Navigation.StateController.navigateLink('/cd/ab/efg/hi');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.y.length, 2);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'efg');
            assert.strictEqual(Navigation.StateContext.data.y[1], 'hi');
            Navigation.StateController.navigateLink('/cd/efg/ab/hij/kl');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'efg');
            assert.strictEqual(Navigation.StateContext.data.y.length, 2);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'hij');
            assert.strictEqual(Navigation.StateContext.data.y[1], 'kl');
            Navigation.StateController.navigateLink('//cd/ab/efg//');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], null);
            assert.strictEqual(Navigation.StateContext.data.x[1], 'cd');
            assert.strictEqual(Navigation.StateContext.data.y.length, 2);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'efg');
            assert.strictEqual(Navigation.StateContext.data.y[1], null);
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/cd/ab'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/cd/efg/'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd'], y: ['efg'] }), '/cd/ab/efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd', 'efg'], y: ['hi'] }), '/cd/efg/ab/hi');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd'], y: ['efg', 'hi'] }), '/cd/ab/efg/hi');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd', 'efg'], y: ['hij', 'kl'] }), '/cd/efg/ab/hij/kl');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [null, 'cd'], y: ['efg', null] }), '//cd/ab/efg//');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd'] }), null);
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: ['cd'] }), null);
        });
    });
    
    describe('Two Route Param Splat and Not Splat', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: ['a/{*x}', 'b/{x}/{y}'], defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });
        
        it('should match', function() {
            Navigation.StateController.navigateLink('/a/cd/efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'efg');
            Navigation.StateController.navigateLink('/a/cd2_0');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            Navigation.StateController.navigateLink('/b/cd2_0/efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x, 'cd');
            assert.strictEqual(Navigation.StateContext.data.y, 'efg');
            Navigation.StateController.navigateLink('/b/cd1-efg/hi');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'efg');
            assert.strictEqual(Navigation.StateContext.data.y, 'hi');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd', 'efg'] }), '/a/cd/efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd' }), '/a/cd2_0');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/b/cd2_0/efg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd', 'efg'], y: 'hi' }), '/b/cd1-efg/hi');
        });
    })

    describe('One Splat Param Two Segment Default', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}/ab', defaults: { x: ['cde', 'fg'] }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/cd/ab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            Navigation.StateController.navigateLink('/cd/efg/ab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'efg');
            Navigation.StateController.navigateLink('/cde/fg/ab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cde');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'fg');
            Navigation.StateController.navigateLink('/cde1-fg/ab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cde1-fg');
            Navigation.StateController.navigateLink('/true2_1/ab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, true);
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/cd'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/cde/fg/ab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd'] }), '/cd/ab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd', 'efg'] }), '/cd/efg/ab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cde', 'fg'] }), '/cde/fg/ab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cde1-fg'] }), '/cde1-fg/ab');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: true }), '/true2_1/ab');
        });
    });

    describe('One Splat Param One Mixed Segment Default', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab{*x}', defaults: { x: ['cde', 'fg'] }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abcde/fg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cde');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'fg');
            Navigation.StateController.navigateLink('/abcd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            Navigation.StateController.navigateLink('/abcd/efg');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'cd');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'efg');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/acd'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/abcde/fg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cde', 'fg'] }), '/abcde/fg');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd'] }), '/abcd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['cd', 'efg'] }), '/abcd/efg');
        });
    });

    describe('Without Types Splat Conflicting Default And Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', trackTypes: false, defaults: { x: ['a', 'bc'] }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });
        it('should match', function() {
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'a');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'bc');
            Navigation.StateController.navigateLink('/a/bc');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'a');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'bc');
            Navigation.StateController.navigateLink('/3');
            assert.strictEqual(Navigation.StateContext.data.x, 3);
        });
        
        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/1/2'), /not a valid number/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['a', 'bc'] }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/3');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '3' }), '/3');
        });
    });

    describe('Without Types Splat Conflicting Single Array Default And Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', trackTypes: false, defaults: { x: ['a'] }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
                ]);
        });
        it('should match', function() {
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'a');
            Navigation.StateController.navigateLink('/a');
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'a');
            Navigation.StateController.navigateLink('/3');
            assert.strictEqual(Navigation.StateContext.data.x, 3);
        });
        
        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/b'), /not a valid number/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/1/2'), /not a valid number/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['a'] }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/3');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '3' }), '/3');
        });
    });

    describe('One Splat Param One Segment Single Match Array Default', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaults: { x: ['a', 'b'] }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab'] }), '/ab');
        });
    });
    
    describe('Combine Array One Splat Param One Segment Default Type', function () {
        beforeEach(function () {
            Navigation.settings.combineArray = true;
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });
        afterEach(function() {
            Navigation.settings.combineArray = false;
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abcd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'abcd');
            Navigation.StateController.navigateLink('/ab1-cd');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'cd');
            Navigation.StateController.navigateLink('/a12-b1-c22-d');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'a1-b');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'c2-d');
            Navigation.StateController.navigateLink('/a12-b');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'a1-b');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['abcd'] }), '/abcd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab', 'cd'] }), '/ab1-cd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['a1-b', 'c2-d'] }), '/a12-b1-c22-d');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['a1-b'] }), '/a12-b');
        });
    });

    describe('Splat Param Array Encode', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d'].states['s'];
            state.stateHandler.urlEncode = (state, key, val) => val.replace(' ', '+')
            state.stateHandler.urlDecode = (state, key, val) => val.replace('+', ' ')
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/a+b/c+de');
            assert.strictEqual(Navigation.StateContext.data.x[0], 'a b');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'c de');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['a b', 'c de'] }), '/a+b/c+de');
        });
    });

    describe('One Splat Param One Segment Default Type Number Array', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaultTypes: { x: 'numberarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/123');
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 123);
            Navigation.StateController.navigateLink('/12/345/67');
            assert.strictEqual(Navigation.StateContext.data.x.length, 3);
            assert.strictEqual(Navigation.StateContext.data.x[0], 12);
            assert.strictEqual(Navigation.StateContext.data.x[1], 345);
            assert.strictEqual(Navigation.StateContext.data.x[2], 67);
            Navigation.StateController.navigateLink('/ab2_0');
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [123] }), '/123');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [12, 345, 67] }), '/12/345/67');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), '/ab2_0');
        });
    });

    describe('One Splat Param One Segment Default Type Booelan Array', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaultTypes: { x: 'booleanarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/true');
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], true);
            Navigation.StateController.navigateLink('/true/false/true');
            assert.strictEqual(Navigation.StateContext.data.x.length, 3);
            assert.strictEqual(Navigation.StateContext.data.x[0], true);
            assert.strictEqual(Navigation.StateContext.data.x[1], false);
            assert.strictEqual(Navigation.StateContext.data.x[2], true);
            Navigation.StateController.navigateLink('/ab2_0');
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [true] }), '/true');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [true, false, true] }), '/true/false/true');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), '/ab2_0');
        });
    });

    describe('One Splat Param One Segment Default Type Date Array', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaultTypes: { x: 'datearray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/2010-04-07');
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(+Navigation.StateContext.data.x[0], +new Date(2010, 3, 7));
            Navigation.StateController.navigateLink('/2010-04-07/2011-08-03');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(+Navigation.StateContext.data.x[0], +new Date(2010, 3, 7));
            assert.strictEqual(+Navigation.StateContext.data.x[1], +new Date(2011, 7, 3));
            Navigation.StateController.navigateLink('/ab2_0');
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [new Date(2010, 3, 7)] }), '/2010-04-07');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }), '/2010-04-07/2011-08-03');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), '/ab2_0');
        });
    });

    describe('One Splat Param One Segment Default Date Array', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaults: { x: [new Date(2011, 7, 3), new Date(2010, 3, 7)] }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(+Navigation.StateContext.data.x[0], +new Date(2011, 7, 3));
            assert.strictEqual(+Navigation.StateContext.data.x[1], +new Date(2010, 3, 7));
            Navigation.StateController.navigateLink('/2010-04-07');
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(+Navigation.StateContext.data.x[0], +new Date(2010, 3, 7));
            Navigation.StateController.navigateLink('/2010-04-07/2011-08-03');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(+Navigation.StateContext.data.x[0], +new Date(2010, 3, 7));
            assert.strictEqual(+Navigation.StateContext.data.x[1], +new Date(2011, 7, 3));
            Navigation.StateController.navigateLink('/ab2_0');
            assert.strictEqual(Navigation.StateContext.data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [new Date(2011, 7, 3), new Date(2010, 3, 7)] }), '/');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [new Date(2010, 3, 7)] }), '/2010-04-07');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }), '/2010-04-07/2011-08-03');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), '/ab2_0');
        });
    });

    describe('Multiple Routes Splat and Not Splat', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'ab/{*x}', defaultTypes: { x: 'stringarray' }, trackCrumbTrail: false },
                    { key: 's1', route: 'cd/{x}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab/ef');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ef');
            Navigation.StateController.navigateLink('/ab/ef/gh');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ef');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'gh');
            Navigation.StateController.navigateLink('/cd/ef');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data.x, 'ef');
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/aa/bbb'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/cd'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/cd/ef/gh'), /Url is invalid/, '');
        });
    });

    describe('One Splat Param One Segment', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/abcd');
            assert.strictEqual(Navigation.StateContext.data.x, 'abcd');
            Navigation.StateController.navigateLink('/1232_2');
            assert.strictEqual(Navigation.StateContext.data.x, 123);
        });

        it('should not match', function() {
            assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
            assert.throws(() => Navigation.StateController.navigateLink('/ab/cd'), /Url is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abcd' }), '/abcd');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 123 }), '/1232_2');
        });

        it('should not build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        });
    });

    describe('One Splat Param One Query String Default Type', function () {
        beforeEach(function () {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{*x}', defaultTypes: { x: 'stringarray', y: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
        });

        it('should match', function() {
            Navigation.StateController.navigateLink('/ab/cde?y=fgh&y=ij');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'cde');
            assert.strictEqual(Navigation.StateContext.data.y.length, 2);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'fgh');
            assert.strictEqual(Navigation.StateContext.data.y[1], 'ij');
            Navigation.StateController.navigateLink('/ab?y=fgh&y=ij');
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
            assert.strictEqual(Navigation.StateContext.data.y.length, 2);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'fgh');
            assert.strictEqual(Navigation.StateContext.data.y[1], 'ij');
            Navigation.StateController.navigateLink('/ab/cde?y=fgh');
            assert.strictEqual(Navigation.StateContext.data.x.length, 2);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
            assert.strictEqual(Navigation.StateContext.data.x[1], 'cde');
            assert.strictEqual(Navigation.StateContext.data.y.length, 1);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'fgh');
            Navigation.StateController.navigateLink('/ab?y=fgh');
            assert.strictEqual(Navigation.StateContext.data.x.length, 1);
            assert.strictEqual(Navigation.StateContext.data.x[0], 'ab');
            assert.strictEqual(Navigation.StateContext.data.y.length, 1);
            assert.strictEqual(Navigation.StateContext.data.y[0], 'fgh');
        });

        it('should build', function() {
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab', 'cde'], y: ['fgh', 'ij'] }), '/ab/cde?y=fgh&y=ij');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab'], y: ['fgh', 'ij'] }), '/ab?y=fgh&y=ij');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab', 'cde'], y: ['fgh'] }), '/ab/cde?y=fgh');
            assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: ['ab'], y: ['fgh'] }), '/ab?y=fgh');
        });
    });
});
