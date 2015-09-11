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
    });

    describe('One Param Two Segment Default', function () {
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
                    { key: 's', route: 'a/{*="()\'-_+~@:?><.;[],!£$%^#&}', defaults: { '*="()\'-_+~@:?><.;[],!£$%^#&': '*="()\'-__+~@:?><.;[],!£$%^#&' }, trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigateLink('/a/*%3D%22()\'-0__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data['*="()\'-_+~@:?><.;[],!£$%^#&'], '*="()\'-__+~@:?><.;[],!£$%^#&');
            Navigation.StateController.navigateLink('/a/*%3D%22()\'-0__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26?*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data['*="()\'-_+~@:?><.;[],!£$%^#&'], '*="()\'-__+~@:?><.;[],!£$%^#&');
            assert.strictEqual(Navigation.StateContext.data['*="()\'-__+~@:?><.;[],!£$%^#&'], '*="()\'-_+~@:?><.;[],!£$%^#&');
            Navigation.StateController.navigateLink('/a');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
            assert.strictEqual(Navigation.StateContext.data['*="()\'-_+~@:?><.;[],!£$%^#&'], '*="()\'-__+~@:?><.;[],!£$%^#&');
            Navigation.StateController.navigateLink('/a?*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
            assert.strictEqual(Navigation.StateContext.data['*="()\'-_+~@:?><.;[],!£$%^#&'], '*="()\'-__+~@:?><.;[],!£$%^#&');
            assert.strictEqual(Navigation.StateContext.data['*="()\'-__+~@:?><.;[],!£$%^#&'], '*="()\'-_+~@:?><.;[],!£$%^#&');
        });
    });

    it('ReservedRegexCharacterMatchTest', function () {
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

    it('OneParamOptionalMandatoryOneMixedSegmentMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab{x?}', trackCrumbTrail: false }]}
            ]);
        Navigation.StateController.navigateLink('/abcde');
        assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 1);
        assert.strictEqual(Navigation.StateContext.data.x, 'cde');
        Navigation.StateController.navigateLink('/abcde?y=fg');
        assert.strictEqual(Object.keys(Navigation.StateContext.data).length, 2);
        assert.strictEqual(Navigation.StateContext.data.x, 'cde');
        assert.strictEqual(Navigation.StateContext.data.y, 'fg');
    });

    it('OneParamOptionalMandatoryOneMixedSegmentNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab{x?}', trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/ab/cde'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/abcd//'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
    });

    it('TwoParamOneOptionalMandatoryThreeSegmentMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x?}/{y}', trackCrumbTrail: false }]}
            ]);
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

    it('TwoParamOneOptionalMandatoryThreeSegmentNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x?}/{y}', trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/ ab/cd/efg'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/ab/cd/efg/h'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/ab//efg'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('//cd/efg'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/ab/cde'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
    });

    it('TwoParamTwoSegmentDefaultMandatoryMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}/{y}', defaults: { x: 'ab' }, trackCrumbTrail: false }]}
            ]);
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

    it('TwoParamTwoSegmentDefaultMandatoryNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}/{y}', defaults: { x: 'ab' }, trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/aa/bbb/e'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/aa//'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/aa'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
    });

    it('TwoParamOneOptionalMandatoryFourSegmentDefaultMandatoryMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x?}/{y}/c', defaults: { y: 'ee' }, trackCrumbTrail: false }]}
            ]);
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

    it('TwoParamOneOptionalMandatoryFourSegmentDefaultMandatoryNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x?}/{y}/c', defaults: { y: 'ee' }, trackCrumbTrail: false }]}
            ]);
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

    it('ExtraDefaultsMatchTest', function () {
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

    it('CaseInsensitiveMatchTest', function () {
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

    it('MultipleRoutesMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x}', trackCrumbTrail: false },
                { key: 's1', route: 'cd/{x}', trackCrumbTrail: false }]}
            ]);
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

    it('MultipleRoutesNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x}', trackCrumbTrail: false },
                { key: 's1', route: 'cd/{x}', trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/aa/bbb'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/ab'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/cd'), /Url is invalid/, '');
    });

    it('TwoRouteOneWithParamMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['', 'abc/{x}'], trackCrumbTrail: false }]}
            ]);
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

    it('TwoRouteOneWithParamNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['', 'abc/{x}'], trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/abc'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/ab/de'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/ abc/de'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('//abc/de'), /Url is invalid/, '');
    });

    it('TwoRouteParamMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['abc/{x}', 'def/{y}'], trackCrumbTrail: false }]}
            ]);
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

    it('TwoRouteParamNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['abc/{x}', 'def/{y}'], trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/abc'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/def'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/ abc/de'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/ def/gh'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/abd/ef'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/abc/de/f'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/def/gh/i'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
    });

    it('TwoRouteParentChildMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['abc/{x}', 'abc/{x}/def/{y}'], trackCrumbTrail: false }]}
            ]);
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

    it('TwoRouteParentChildNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['abc/{x}', 'abc/{x}/def/{y}'], trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/abc'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/abc/de/def'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/abc/de/def/gh/i'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/abd/de'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/abc/de/deg/gh'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/ abc/de'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/ abc/de/def/gh'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
    });

    it('TwoRouteDefaultMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['abc/{x}', 'def/{y}'], defaults: { x: 'd' }, trackCrumbTrail: false }]}
            ]);
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

    it('TwoRouteDefaultNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['abc/{x}', 'def/{y}'], defaults: { x: 'd' }, trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/def'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/ abc/de'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/ def/gh'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/abd/ef'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/abc/de/f'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/def/gh/i'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
    });

    it('TwoRouteOptionalMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['abc/{x?}', 'abc/{x}/def/{y}'], trackCrumbTrail: false }]}
            ]);
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

    it('TwoRouteOptionalNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['abc/{x?}', 'abc/{x}/def/{y}'], trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/abc/de/def'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/abc/de/def/gh/i'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/abd/de'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/abc/de/deg/gh'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/ abc/de'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/ abc/de/def/gh'), /Url is invalid/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/'), /Url is invalid/, '');
    });

    it('TwoRouteDefaultNumberMatchTest', function () {
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

    it('TwoRouteDefaultTypeNumberMatchTest', function () {
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

    it('WithoutTypesMatchTest', function () {
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

    it('WithoutTypesDefaultMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', trackTypes: false, defaults: { x: 2 }, trackCrumbTrail: false }]}
            ]);
        Navigation.StateController.navigateLink('/');
        assert.strictEqual(Navigation.StateContext.data.x, 2);
        Navigation.StateController.navigateLink('/3');
        assert.strictEqual(Navigation.StateContext.data.x, 3);
    });

    it('WithoutTypesDefaultNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', trackTypes: false, defaults: { x: 2 }, trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/a'), /not a valid number/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/true'), /not a valid number/, '');
    });

    it('WithoutTypesDefaultTypeMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', trackTypes: false, defaultTypes: { x: 'boolean' }, trackCrumbTrail: false }]}
            ]);
        Navigation.StateController.navigateLink('/true');
        assert.strictEqual(Navigation.StateContext.data.x, true);
        Navigation.StateController.navigateLink('/false');
        assert.strictEqual(Navigation.StateContext.data.x, false);
    });

    it('WithoutTypesDefaultTypeNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', trackTypes: false, defaultTypes: { x: 'boolean' }, trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/a'), /not a valid boolean/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/2'), /not a valid boolean/, '');
    });

    it('WithoutTypesDefaultAndDefaultTypeMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', trackTypes: false, defaults: { x: '2' }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
            ]);
        Navigation.StateController.navigateLink('/');
        assert.strictEqual(Navigation.StateContext.data.x, 2);
        Navigation.StateController.navigateLink('/3');
        assert.strictEqual(Navigation.StateContext.data.x, 3);
    });

    it('WithoutTypesDefaultAndDefaultTypeNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', trackTypes: false, defaults: { x: '2' }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/a'), /not a valid number/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/true'), /not a valid number/, '');
    });

    it('WithoutTypesConflicingDefaultAndDefaultTypeNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', trackTypes: false, defaults: { x: 'a' }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/'), /not a valid number/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/b'), /not a valid number/, '');
    });

    it('WithoutTypesQueryStringMatchTest', function () {
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

    it('WithoutTypesQueryStringDefaultMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '', trackTypes: false, defaults: { x: 2 }, trackCrumbTrail: false }]}
            ]);
        Navigation.StateController.navigateLink('/');
        assert.strictEqual(Navigation.StateContext.data.x, 2);
        Navigation.StateController.navigateLink('/?x=3');
        assert.strictEqual(Navigation.StateContext.data.x, 3);
    });

    it('WithoutTypesQueryStringDefaultNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '', trackTypes: false, defaults: { x: 2 }, trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/?x=a'), /not a valid number/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/?x=true'), /not a valid number/, '');
    });

    it('WithoutTypesQueryStringDefaultTypeMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '', trackTypes: false, defaultTypes: { x: 'boolean' }, trackCrumbTrail: false }]}
            ]);
        Navigation.StateController.navigateLink('/?x=true');
        assert.strictEqual(Navigation.StateContext.data.x, true);
        Navigation.StateController.navigateLink('/?x=false');
        assert.strictEqual(Navigation.StateContext.data.x, false);
    });

    it('WithoutTypesQueryStringDefaultTypeNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '', trackTypes: false, defaultTypes: { x: 'boolean' }, trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/?x=a'), /not a valid boolean/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/?x=2'), /not a valid boolean/, '');
    });

    it('WithoutTypesQueryStringDefaultAndDefaultTypeMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '', trackTypes: false, defaults: { x: '2' }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
            ]);
        Navigation.StateController.navigateLink('/');
        assert.strictEqual(Navigation.StateContext.data.x, 2);
        Navigation.StateController.navigateLink('/?x=3');
        assert.strictEqual(Navigation.StateContext.data.x, 3);
    });

    it('WithoutTypesQueryStringDefaultAndDefaultTypeNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '', trackTypes: false, defaults: { x: '2' }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/?x=a'), /not a valid number/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/?x=true'), /not a valid number/, '');
    });

    it('WithoutTypesQueryStringConflicingDefaultAndDefaultTypeNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '', trackTypes: false, defaults: { x: 'a' }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
            ]);
        assert.throws(() => Navigation.StateController.navigateLink('/'), /not a valid number/, '');
        assert.throws(() => Navigation.StateController.navigateLink('/?x=b'), /not a valid number/, '');
    });
});

describe('BuildTest', function () {
    it('RootBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), '/?x=ab');
    });

    it('NoParamOneSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'abc', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/abc');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), '/abc?x=ab');
    });

    it('NoParamTwoSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/c', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/ab/c');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), '/ab/c?x=ab');
    });

    it('OneParamOneSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abcd' }), '/abcd');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', y: 'cd' }), '/ab?y=cd');
    });

    it('OneParamOneSegmentNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
    });

    it('OneParamTwoSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd' }), '/ab/cd');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'ef' }), '/ab/cd?y=ef');
    });

    it('OneParamTwoSegmentNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'ef' }), null);
    });

    it('TwoParamTwoSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}/{y}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
    });

    it('TwoParamTwoSegmentNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}/{y}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'bbb' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'cccc' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
    });

    it('TwoParamThreeSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x}/{y}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/ab/cd/efg');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg?z=hi');
    });

    it('TwoParamThreeSegmentNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}/{y}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'efg' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'hi' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
    });

    it('TwoParamFourSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x}/c/{y}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'yy', y: 'xyz' }), '/ab/yy/c/xyz');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'yy', y: 'xyz', z: 'xx' }), '/ab/yy/c/xyz?z=xx');
    });

    it('TwoParamFourSegmentNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x}/c/{y}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'yy' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'xyz' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'zz' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
    });

    it('OneOptionalParamOneSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x?}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abcd' }), '/abcd');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abcd', y: 'ef' }), '/abcd?y=ef');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'ef' }), '/?y=ef');
    });

    it('OneOptionalParamTwoSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x?}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd' }), '/ab/cd');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'ef' }), '/ab/cd?y=ef');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/ab');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'ef' }), '/ab?y=ef');
    });

    it('TwoOptionalParamTwoSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x?}/{y?}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aab' }), '/aab');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aab', z: 'cccc' }), '/aab?z=cccc');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'cccc' }), '/?z=cccc');
    });

    it('TwoOptionalParamTwoSegmentNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x?}/{y?}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'bbb' }), null);
    });

    it('TwoOptionalParamThreeSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x?}/{y?}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/ab/cd/efg');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg?z=hi');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde' }), '/ab/cde');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde', z: 'fg' }), '/ab/cde?z=fg');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/ab');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'cd' }), '/ab?z=cd');
    });

    it('TwoOptionalParamThreeSegmentNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x?}/{y?}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'efg' }), null);
    });

    it('TwoParamOneOptionalTwoSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}/{y?}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aab' }), '/aab');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aab', z: 'ccd' }), '/aab?z=ccd');
    });

    it('TwoParamOneOptionalTwoSegmentNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}/{y?}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'bbb' }), null);
    });

    it('TwoParamOneOptionalThreeSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x}/{y?}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/ab/cd/efg');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg?z=hi');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde' }), '/ab/cde');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde', z: 'fg' }), '/ab/cde?z=fg');
    });

    it('TwoParamOneOptionalThreeSegmentNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x}/{y?}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'efg' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
    });

    it('TwoParamOneOptionalFourSegmentNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x}/c/{y?}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'yy', y: 'xyz' }), '/ab/yy/c/xyz');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'yy', y: 'xyz', z: 'xx' }), '/ab/yy/c/xyz?z=xx');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'yy' }), '/ab/yy/c');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'yy', z: 'xx' }), '/ab/yy/c?z=xx');
    });

    it('TwoParamOneOptionalFourSegmentNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x}/c/{y?}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'xyz' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
    });

    it('OneParamOneMixedSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab{x}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde' }), '/abcde');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde', y: 'fg' }), '/abcde?y=fg');
    });

    it('OneParamOneMixedSegmentNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab{x}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
    });

    it('OneParamOneMixedSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab{x}e{y}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'fgh' }), '/abcdefgh');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'fgh', z: 'i' }), '/abcdefgh?z=i');
    });

    it('TwoParamOneMixedSegmentNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab{x}e{y}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'fghh' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
    });

    it('TwoParamOneOptionalTwoSegmentOneMixedBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}ab/{y?}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc', y: 'de' }), '/abcab/de');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc', y: 'de', z: 'f' }), '/abcab/de?z=f');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc' }), '/abcab');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc', z: 'de' }), '/abcab?z=de');
    });

    it('TwoParamOneOptionalTwoSegmentOneMixedNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}ab/{y?}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'de' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
    });

    it('OneParamOneSegmentDefaultBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', defaults: { x: 'cde' }, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab' }), '/ab');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ab', z: 'cd' }), '/ab?z=cd');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde' }), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde', z: 'fg' }), '/?z=fg');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'fg' }), '/?z=fg');
    });

    it('OneParamTwoSegmentDefaultBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x}', defaults: { x: 'ccdd' }, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde' }), '/ab/cde');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde', y: 'fg' }), '/ab/cde?y=fg');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ccdd' }), '/ab');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'ccdd', y: 'ee' }), '/ab?y=ee');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/ab');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'ee' }), '/ab?y=ee');
    });

    it('TwoParamTwoSegmentTwoDefaultBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}/{y}', defaults: { x: 'ab', y: 'c' }, trackCrumbTrail: false }]}
            ]);
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

    it('OneParamTwoSegmentDefaultBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}/{y}', defaults: { y: 'ab' }, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'ab' }), '/aa');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'ab', z: 'bb' }), '/aa?z=bb');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa' }), '/aa');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', z: 'bb' }), '/aa?z=bb');
    });

    it('TwoParamTwoSegmentDefaultNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}/{y}', defaults: { y: 'ab' }, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'bbb' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
    });

    it('TwoParamOneOptionalTwoSegmentDefaultBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}/{y?}', defaults: { x: 'abc' }, trackCrumbTrail: false }]}
            ]);
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

    it('FourParamTwoOptionalFiveSegmentDefaultBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{w}/{x}/{y?}/{z?}', defaults: { w: 'abc', x: 'de' }, trackCrumbTrail: false }]}
            ]);
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

    it('FourParamTwoOptionalFiveSegmentDefaultNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{w}/{x}/{y?}/{z?}', defaults: { w: 'abc', x: 'de' }, trackCrumbTrail: false }]}
            ]);
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

    it('SpacesBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '   a  ' }), '/%20%20%20a%20%20');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '   a  ', y: '   b  ' }), '/%20%20%20a%20%20?y=%20%20%20b%20%20');
    });

    it('MultiCharParamBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'a/{someVar}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { someVar: 'someVal' }), '/a/someVal');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { someVar: 'someVal', anotherVar: 'anotherVal' }), '/a/someVal?anotherVar=anotherVal');
    });

    it('ReservedUrlCharacterBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'a/{*="()\'-_+~@:?><.;[],!£$%^#&}', defaults: { '*="()\'-_+~@:?><.;[],!£$%^#&': '*="()\'-__+~@:?><.;[],!£$%^#&' }, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { '*="()\'-_+~@:?><.;[],!£$%^#&': '*="()\'-_+~@:?><.;[],!£$%^#&' }), '/a/*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { '*="()\'-_+~@:?><.;[],!£$%^#&': '*="()\'-_+~@:?><.;[],!£$%^#&', '*="()\'-__+~@:?><.;[],!£$%^#&': '*="()\'-_+~@:?><.;[],!£$%^#&'}), '/a/*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26?*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { '*="()\'-_+~@:?><.;[],!£$%^#&': '*="()\'-__+~@:?><.;[],!£$%^#&' }), '/a');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { '*="()\'-_+~@:?><.;[],!£$%^#&': '*="()\'-__+~@:?><.;[],!£$%^#&', '*="()\'-__+~@:?><.;[],!£$%^#&': '*="()\'-_+~@:?><.;[],!£$%^#&'}), '/a?*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/a');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { '*="()\'-__+~@:?><.;[],!£$%^#&': '*="()\'-_+~@:?><.;[],!£$%^#&' }), '/a?*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
    });

    it('ReservedRegexCharacterBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '.+*\^$\[\]()\'/{x}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc' }), '/.+*\^$\[\]()\'/abc');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc', y: 'de' }), '/.+*\^$\[\]()\'/abc?y=de');
    });

    it('OneParamOptionalMandatoryOneMixedSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab{x?}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde' }), '/abcde');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cde', y: 'fg' }), '/abcde?y=fg');
    });

    it('OneParamOptionalMandatoryOneMixedSegmentNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab{x?}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
    });

    it('TwoParamOneOptionalMandatoryThreeSegmentBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x?}/{y}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/ab/cd/efg');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg?z=hi');
    });

    it('TwoParamOneOptionalMandatoryThreeSegmentNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x?}/{y}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'efg' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
    });

    it('TwoParamTwoSegmentDefaultMandatoryBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}/{y}', defaults: { x: 'ab' }, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb' }), '/aa/bbb');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'bbb' }), '/ab/bbb');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'bbb', z: 'cccc' }), '/ab/bbb?z=cccc');
    });

    it('TwoParamTwoSegmentDefaultMandatoryNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}/{y}', defaults: { x: 'ab' }, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'aa' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
    });

    it('TwoParamOneOptionalMandatoryFourSegmentDefaultMandatoryBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x?}/{y}/c', defaults: { y: 'ee' }, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg' }), '/ab/cd/efg/c');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg/c?z=hi');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd' }), '/ab/cd/ee/c');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'cd', z: 'ef' }), '/ab/cd/ee/c?z=ef');
    });

    it('TwoParamOneOptionalMandatoryFourSegmentDefaultMandatoryNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: 'ab/{x?}/{y}/c', defaults: { y: 'ee' }, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'efg' }), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
    });

    it('EmptyStringNonMatchTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '' }), null);
    });

    it('TwoRouteOneWithParamBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['', 'abc/{x}'], trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'd' }), '/?y=d');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de' }), '/abc/de');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'f' }), '/abc/de?y=f');
    });

    it('TwoRouteParamBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['abc/{x}', 'def/{y}'], trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de' }), '/abc/de');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', z: 'f' }), '/abc/de?z=f');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'gh' }), '/def/gh');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'gh', z: 'i' }), '/def/gh?z=i');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'gh' }), '/abc/de?y=gh');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'gh', z: 'i' }), '/abc/de?y=gh&z=i');
    });

    it('TwoRouteParamNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['abc/{x}', 'def/{y}'], trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'g' }), null);
    });

    it('TwoRouteParentChildBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['abc/{x}', 'abc/{x}/def/{y}'], trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de' }), '/abc/de');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', z: 'f' }), '/abc/de?z=f');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'gh' }), '/abc/de/def/gh');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'gh', z: 'f' }), '/abc/de/def/gh?z=f');
    });

    it('TwoRouteParentChildNonBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['abc/{x}', 'abc/{x}/def/{y}'], trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), null);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'g' }), null);
    });

    it('TwoRouteDefaultBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['abc/{x}', 'def/{y}'], defaults: { x: 'd' }, trackCrumbTrail: false }]}
            ]);
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

    it('TwoRouteOptionalBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['abc/{x?}', 'abc/{x}/def/{y}'], trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/abc');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { z: 'd' }), '/abc?z=d');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de' }), '/abc/de');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', z: 'f' }), '/abc/de?z=f');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'gh' }), '/abc/de/def/gh');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'de', y: 'gh', z: 'f' }), '/abc/de/def/gh?z=f');
    });

    it('TwoRouteDefaultNumberBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['def/{y}', 'abc/{x}'], defaults: { x: 2 }, trackCrumbTrail: false }]}
            ]);
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

    it('TwoRouteDefaultTypeNumberBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: ['def/{y}', 'abc/{x}'], defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/abc/3');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3, z: 'f' }), '/abc/3?z=f');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'gh' }), '/def/gh');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { y: 'gh', z: 'i' }), '/def/gh?z=i');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3, y: 'gh' }), '/def/gh?x=3');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3, y: 'gh', z: 'i' }), '/def/gh?x=3&z=i');
    });

    it('WithoutTypesBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', trackTypes: false, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc' }), '/abc');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/3');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: true }), '/true');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '0_1_2_' }), '/0_1_2_');
    });

    it('WithoutTypesDefaultBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', trackTypes: false, defaults: { x: 2 }, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 2 }), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '2' }), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/3');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '3' }), '/3');
    });

    it('WithoutTypesDefaultTypeBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', trackTypes: false, defaultTypes: { x: 'boolean' }, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: true }), '/true');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'false' }), '/false');
    });

    it('WithoutTypesDefaultAndDefaultTypeBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', trackTypes: false, defaults: { x: '2' }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 2 }), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '2' }), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/3');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '3' }), '/3');
    });

    it('WithoutTypesQueryStringBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '', trackTypes: false, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'abc' }), '/?x=abc');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/?x=3');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: true }), '/?x=true');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '0_1_2_' }), '/?x=0_1_2_');
    });

    it('WithoutTypesQueryStringDefaultBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '', trackTypes: false, defaults: { x: 2 }, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 2 }), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '2' }), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/?x=3');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '3' }), '/?x=3');
    });

    it('WithoutTypesQueryStringDefaultTypeBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '', trackTypes: false, defaultTypes: { x: 'boolean' }, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: true }), '/?x=true');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 'false' }), '/?x=false');
    });

    it('WithoutTypesQueryStringDefaultAndDefaultTypeBuildTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '', trackTypes: false, defaults: { x: '2' }, defaultTypes: { x: 'number' }, trackCrumbTrail: false }]}
            ]);
        assert.strictEqual(Navigation.StateController.getNavigationLink('d'), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 2 }), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '2' }), '/');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: 3 }), '/?x=3');
        assert.strictEqual(Navigation.StateController.getNavigationLink('d', { x: '3' }), '/?x=3');
    });

    it('WithoutTypesTwoRouteDefaultBuildTest', function () {
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
})
