import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from 'navigation';

describe('MatchTest', function () {
    describe('Root', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '' }
            ]);
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/?x=ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
        });
        
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ '), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/a'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/?x=a&x=b'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab' }), '/?x=ab');
        });
    });

    describe('No Param One Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'abc' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/abc?x=ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc '), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/dbc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/adc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/aabc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/abc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab' }), '/abc?x=ab');
        });
    });

    describe('No Param Two Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/c' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('ab/c');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('ab/c?x=ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ ab/c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/c '), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/a/b/c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ad/c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/aab/c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ab/c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/ab/c');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab' }), '/ab/c?x=ab');
        });
    });

    describe('One Param One Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abcd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'abcd');
            var { data } = stateNavigator.parseLink('/ab?y=cd');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.y, 'cd');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//a'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/a?x=b'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'abcd' }), '/abcd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab', y: 'cd' }), '/ab?y=cd');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('One Param Two Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{x}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            var { data } = stateNavigator.parseLink('/ab/cd?y=ef');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'ef');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/d/e'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/a/b/d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/cab/d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd' }), '/ab/cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'ef' }), '/ab/cd?y=ef');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'ef' }), null);
        });
    });

    describe('Two Param Two Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}/{y}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/aa/bbb');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'bbb');
            var { data } = stateNavigator.parseLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'bbb');
            assert.strictEqual(data.z, 'cccc');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/aa/bbb/e'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/aa//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/aa'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//aa/bbb'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'bbb' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'cccc' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('Two Param Three Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{x}/{y}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'efg');
            var { data } = stateNavigator.parseLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'efg');
            assert.strictEqual(data.z, 'hi');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ ab/cd/efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cde'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd/efg/h'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab//efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//cd/efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ab/cd/efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'efg' }), '/ab/cd/efg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg?z=hi');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'efg' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'hi' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('Two Param Four Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{x}/c/{y}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/yy/c/xyz');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'yy');
            assert.strictEqual(data.y, 'xyz');
            var { data } = stateNavigator.parseLink('/ab/yy/c/xyz?z=xx');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'yy');
            assert.strictEqual(data.y, 'xyz');
            assert.strictEqual(data.z, 'xx');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ ab/yy/c/xyz'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/b/c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/b/c/d/e'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/b/c//d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab//b/c/d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ab/yy/c/xyz'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'yy', y: 'xyz' }), '/ab/yy/c/xyz');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'yy', y: 'xyz', z: 'xx' }), '/ab/yy/c/xyz?z=xx');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'yy' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'xyz' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'zz' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('One Optional Param One Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abcd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'abcd');
            var { data } = stateNavigator.parseLink('/abcd?y=ef');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'abcd');
            assert.strictEqual(data.y, 'ef');
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/?y=ef');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.y, 'ef');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'abcd' }), '/abcd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'abcd', y: 'ef' }), '/abcd?y=ef');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'ef' }), '/?y=ef');
        });
    });

    describe('One Optional Param Two Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{x?}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            var { data } = stateNavigator.parseLink('/ab/cd?y=ef');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'ef');
            var { data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/ab?y=ef');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.y, 'ef');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/d/e'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/a/b/d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/cab/d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd' }), '/ab/cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'ef' }), '/ab/cd?y=ef');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'ef' }), '/ab?y=ef');
        });
    });

    describe('Two Optional Param Two Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}/{y?}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/aa/bbb');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'bbb');
            var { data } = stateNavigator.parseLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'bbb');
            assert.strictEqual(data.z, 'cccc');
            var { data } = stateNavigator.parseLink('/aab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'aab');
            var { data } = stateNavigator.parseLink('/aab?z=cccc');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'aab');
            assert.strictEqual(data.z, 'cccc');
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/?z=cccc');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.z, 'cccc');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/aa/bbb/e'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/aa//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//aa/bbb'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//aa'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('///aa'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aab' }), '/aab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aab', z: 'cccc' }), '/aab?z=cccc');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'cccc' }), '/?z=cccc');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'bbb' }), null);
        });
    });

    describe('Two Optional Param Three Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{x?}/{y?}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'efg');
            var { data } = stateNavigator.parseLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'efg');
            assert.strictEqual(data.z, 'hi');
            var { data } = stateNavigator.parseLink('/ab/cde');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cde');
            var { data } = stateNavigator.parseLink('/ab/cde?z=fg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cde');
            assert.strictEqual(data.z, 'fg');
            var { data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/ab?z=cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.z, 'cd');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ ab/cd/efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd/efg/h'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab//efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//cd/efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'efg' }), '/ab/cd/efg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg?z=hi');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde' }), '/ab/cde');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde', z: 'fg' }), '/ab/cde?z=fg');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'cd' }), '/ab?z=cd');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'efg' }), null);
        });
    });

    describe('Two Param One Optional Two Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}/{y?}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/aa/bbb');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'bbb');
            var { data } = stateNavigator.parseLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'bbb');
            assert.strictEqual(data.z, 'cccc');
            var { data } = stateNavigator.parseLink('/aab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'aab');
            var { data } = stateNavigator.parseLink('/aab?z=ccd');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'aab');
            assert.strictEqual(data.z, 'ccd');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/aa/bbb/e'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/aa//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aab' }), '/aab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aab', z: 'ccd' }), '/aab?z=ccd');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'bbb' }), null);
        });
    });

    describe('Two Param One Optional Three Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{x}/{y?}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'efg');
            var { data } = stateNavigator.parseLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'efg');
            assert.strictEqual(data.z, 'hi');
            var { data } = stateNavigator.parseLink('/ab/cde');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cde');
            var { data } = stateNavigator.parseLink('/ab/cde?z=fg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cde');
            assert.strictEqual(data.z, 'fg');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ ab/cd/efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd/efg/h'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab//efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//cd/efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'efg' }), '/ab/cd/efg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg?z=hi');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde' }), '/ab/cde');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde', z: 'fg' }), '/ab/cde?z=fg');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'efg' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('Two Param One Optional Four Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{x}/c/{y?}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/yy/c/xyz');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'yy');
            assert.strictEqual(data.y, 'xyz');
            var { data } = stateNavigator.parseLink('/ab/yy/c/xyz?z=xx');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'yy');
            assert.strictEqual(data.y, 'xyz');
            assert.strictEqual(data.z, 'xx');
            var { data } = stateNavigator.parseLink('/ab/yy/c');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'yy');
            var { data } = stateNavigator.parseLink('/ab/yy/c?z=xx');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'yy');
            assert.strictEqual(data.z, 'xx');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ ab/yy/c/xyz'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/b/c/d/e'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/b/c//d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab//b/c/d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'yy', y: 'xyz' }), '/ab/yy/c/xyz');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'yy', y: 'xyz', z: 'xx' }), '/ab/yy/c/xyz?z=xx');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'yy' }), '/ab/yy/c');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'yy', z: 'xx' }), '/ab/yy/c?z=xx');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'xyz' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('One Param One Mixed Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab{x}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abcde');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cde');
            var { data } = stateNavigator.parseLink('/abcde?y=fg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cde');
            assert.strictEqual(data.y, 'fg');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ab/cde'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcd//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde' }), '/abcde');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde', y: 'fg' }), '/abcde?y=fg');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('Two Param One Mixed Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab{x}e{y}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abcdefgh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'fgh');
            var { data } = stateNavigator.parseLink('/abcdefgh?z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'fgh');
            assert.strictEqual(data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ abcdefgh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cdefgh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcdefgh//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcde'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abe'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'fgh' }), '/abcdefgh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'fgh', z: 'i' }), '/abcdefgh?z=i');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'fgh' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('Two Param One Optional One Mixed Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab{x?}e{y}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abcdefgh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'fgh');
            var { data } = stateNavigator.parseLink('/abcdefgh?z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'fgh');
            assert.strictEqual(data.z, 'i');
            var { data } = stateNavigator.parseLink('/abefgh');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.y, 'fgh');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ abcdefgh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cdefgh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcdefgh//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcde'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abe'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'fgh' }), '/abcdefgh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'fgh', z: 'i' }), '/abcdefgh?z=i');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'fgh' }), '/abefgh');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('Two Param One Optional Two Segment One Mixed', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}ab/{y?}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abcab/de');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'abc');
            assert.strictEqual(data.y, 'de');
            var { data } = stateNavigator.parseLink('/abcab/de?z=f');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'abc');
            assert.strictEqual(data.y, 'de');
            assert.strictEqual(data.z, 'f');
            var { data } = stateNavigator.parseLink('/abcab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'abc');
            var { data } = stateNavigator.parseLink('/abcab?z=de');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'abc');
            assert.strictEqual(data.z, 'de');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abcab /de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcab/de/fg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcab//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'abc', y: 'de' }), '/abcab/de');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'abc', y: 'de', z: 'f' }), '/abcab/de?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'abc' }), '/abcab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'abc', z: 'de' }), '/abcab?z=de');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'de' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('One Param Two Segment One Mixed', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab{x}/cd' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abcde/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cde');
            var { data } = stateNavigator.parseLink('/abcde/cd?y=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cde');
            assert.strictEqual(data.y, 'f');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde' }), '/abcde/cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde', y: 'f' }), '/abcde/cd?y=f');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'de' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('One Optional Param Two Segment One Mixed', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab{x?}/cd' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/cd');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/ab/cd?y=f');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.y, 'f');
            var { data } = stateNavigator.parseLink('/abcde/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cde');
            var { data } = stateNavigator.parseLink('/abcde/cd?y=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cde');
            assert.strictEqual(data.y, 'f');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/ab/cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'f' }), '/ab/cd?y=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde' }), '/abcde/cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde', y: 'f' }), '/abcde/cd?y=f');
        });
    });

    describe('One Param One Segment Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}', defaults: { x: 'cde' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            var { data } = stateNavigator.parseLink('/ab?z=cd');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.z, 'cd');
            var { data } = stateNavigator.parseLink('/cde');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cde');
            var { data } = stateNavigator.parseLink('/cde?z=fg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cde');
            assert.strictEqual(data.z, 'fg');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//cde'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab' }), '/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab', z: 'cd' }), '/ab?z=cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde' }), '/cde');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde', z: 'fg' }), '/cde?z=fg');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/cde');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'fg' }), '/cde?z=fg');
        });
    });

    describe('One Optional Param One Segment Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}', defaults: { x: 'cde' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            var { data } = stateNavigator.parseLink('/ab?z=cd');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.z, 'cd');
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cde');
            var { data } = stateNavigator.parseLink('/?z=fg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cde');
            assert.strictEqual(data.z, 'fg');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//cde'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab' }), '/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab', z: 'cd' }), '/ab?z=cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde' }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde', z: 'fg' }), '/?z=fg');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'fg' }), '/?z=fg');
        });
    });

    describe('One Optional Param One Segment Default Number', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}', defaults: { x: 345 } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/12');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 12);
            var { data } = stateNavigator.parseLink('/12?z=34');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 12);
            assert.strictEqual(data.z, '34');
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 345);
            var { data } = stateNavigator.parseLink('/?z=67');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 345);
            assert.strictEqual(data.z, '67');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/12/34'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/12//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/true'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/1a2'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/12?x=34'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 12 }), '/12');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 12, z: '34' }), '/12?z=34');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 345 }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 345, z: '67' }), '/?z=67');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: '67' }), '/?z=67');
        });
    });

    describe('One Optional Param One Segment Default Boolean', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}', defaults: { x: true } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/false');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, false);
            var { data } = stateNavigator.parseLink('/false?z=true');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, false);
            assert.strictEqual(data.z, 'true');
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, true);
            var { data } = stateNavigator.parseLink('/?z=false');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, true);
            assert.strictEqual(data.z, 'false');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/false/true'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/false//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/1'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/fals'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/false?x=true'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: false }), '/false');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: false, z: 'true' }), '/false?z=true');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: true }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: true, z: 'false' }), '/?z=false');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'false' }), '/?z=false');
        });
    });

    describe('One Optional Param One Segment Default Date', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}', defaults: { x: new Date(2010, 3, 7) } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/2011-08-03');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(+data.x, +new Date(2011, 7, 3));
            var { data } = stateNavigator.parseLink('/2011-12-31');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(+data.x, +new Date(2011, 11, 31));
            var { data } = stateNavigator.parseLink('/2011-8-3');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(+data.x, +new Date(2011, 7, 3));
            var { data } = stateNavigator.parseLink('/2011-08-03?z=2012-09-04');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(+data.x, +new Date(2011, 7, 3));
            assert.strictEqual(data.z, '2012-09-04');
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(+data.x, +new Date(2010, 3, 7));
            var { data } = stateNavigator.parseLink('/?z=2012-09-04');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(+data.x, +new Date(2010, 3, 7));
            assert.strictEqual(data.z, '2012-09-04');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/2011-08-03/2012-09-04'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/2011-08-03//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/true'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/2011/08/03'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/2011-08'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/2011-08-a'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/2011-08-03-01'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/2011-08-03?x=2012-09-04'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: new Date(2011, 7, 3) }), '/2011-08-03');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: new Date(2011, 11, 31) }), '/2011-12-31');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: new Date(2011, 7, 3), z: '2012-09-04' }), '/2011-08-03?z=2012-09-04');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: new Date(2010, 3, 7) }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: new Date(2010, 3, 7), z: '2012-09-04' }), '/?z=2012-09-04');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: '2012-09-04' }), '/?z=2012-09-04');
        });
    });

    describe('No Param One Segment Default Type Number', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'abc', defaultTypes: { x: 'number' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/abc?x=12');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 12);
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc '), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/dbc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/adc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/aabc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc?x=true'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc?x=1a2'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc?x=12&x=345'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/abc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 12 }), '/abc?x=12');
        });
    });

    describe('No Param One Segment Default Type Boolean', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'abc', defaultTypes: { x: 'boolean' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/abc?x=true');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, true);
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc '), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/dbc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/adc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/aabc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc?x=1'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc?x=tru'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc?x=true&x=false'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/abc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: true }), '/abc?x=true');
        });
    });

    describe('No Param One Segment Default Type Date', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'abc', defaultTypes: { x: 'date' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/abc?x=2011-08-03');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(+data.x, +new Date(2011, 7, 3));
            var { data } = stateNavigator.parseLink('/abc?x=2011-8-3');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(+data.x, +new Date(2011, 7, 3));
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc '), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/dbc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/adc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/aabc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc?x=true'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc?x=2011/08/03'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc?x=2011-08'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc?x=2011-08-a'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc?x=2011-08-03-01'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc?x=2011-08-03&x=2012-09-04'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/abc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: new Date(2011, 7, 3) }), '/abc?x=2011-08-03');
        });
    });

    describe('One Param Two Segment Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{x}', defaults: { x: 'ccdd' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/cde');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cde');
            var { data } = stateNavigator.parseLink('/ab/cde?y=fg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cde');
            assert.strictEqual(data.y, 'fg');
            var { data } = stateNavigator.parseLink('/ab/ccdd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ccdd');
            var { data } = stateNavigator.parseLink('/ab/ccdd?y=ee');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ccdd');
            assert.strictEqual(data.y, 'ee');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/d/e'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/a/b/d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/cab/d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde' }), '/ab/cde');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde', y: 'fg' }), '/ab/cde?y=fg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ccdd' }), '/ab/ccdd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ccdd', y: 'ee' }), '/ab/ccdd?y=ee');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/ab/ccdd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'ee' }), '/ab/ccdd?y=ee');
        });
    });

    describe('One Optional Param Two Segment Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{x?}', defaults: { x: 'ccdd' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/cde');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cde');
            var { data } = stateNavigator.parseLink('/ab/cde?y=fg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cde');
            assert.strictEqual(data.y, 'fg');
            var { data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ccdd');
            var { data } = stateNavigator.parseLink('/ab?y=ee');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ccdd');
            assert.strictEqual(data.y, 'ee');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/d/e'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/a/b/d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/cab/d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde' }), '/ab/cde');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde', y: 'fg' }), '/ab/cde?y=fg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ccdd' }), '/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ccdd', y: 'ee' }), '/ab?y=ee');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'ee' }), '/ab?y=ee');
        });
    });

    describe('Two Param Two Segment Two Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}/{y}', defaults: { x: 'ab', y: 'c' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/aa/bbb');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'bbb');
            var { data } = stateNavigator.parseLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'bbb');
            assert.strictEqual(data.z, 'cccc');
            var { data } = stateNavigator.parseLink('/aa/c');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'c');
            var { data } = stateNavigator.parseLink('/ab/bbb');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.y, 'bbb');
            var { data } = stateNavigator.parseLink('/ab/c');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.y, 'c');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/aa/bbb/e'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/aa'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });
   
        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'c' }), '/aa/c');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'c', z: 'd' }), '/aa/c?z=d');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'bbb' }), '/ab/bbb');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'bbb', z: 'cccc' }), '/ab/bbb?z=cccc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'c' }), '/ab/c');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'c', z: 'd' }), '/ab/c?z=d');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa' }), '/aa/c');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', z: 'd' }), '/aa/c?z=d');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab', y: 'c' }), '/ab/c');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab', y: 'c', z: 'd' }), '/ab/c?z=d');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab' }), '/ab/c');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab', z: 'd' }), '/ab/c?z=d');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/ab/c');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'd' }), '/ab/c?z=d');
        });
    });

    describe('Two Optional Param Two Segment Two Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}/{y?}', defaults: { x: 'ab', y: 'c' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/aa/bbb');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'bbb');
            var { data } = stateNavigator.parseLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'bbb');
            assert.strictEqual(data.z, 'cccc');
            var { data } = stateNavigator.parseLink('/aa');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'c');
            var { data } = stateNavigator.parseLink('/aa?z=d');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'c');
            assert.strictEqual(data.z, 'd');
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.y, 'c');
            var { data } = stateNavigator.parseLink('/?z=d');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.y, 'c');
            assert.strictEqual(data.z, 'd');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/aa/bbb/e'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/aa//'), /The Url .+ is invalid/);
        });
   
        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'c' }), '/aa');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'c', z: 'd' }), '/aa?z=d');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'bbb' }), '/ab/bbb');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'bbb', z: 'cccc' }), '/ab/bbb?z=cccc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'c' }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'c', z: 'd' }), '/?z=d');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa' }), '/aa');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', z: 'd' }), '/aa?z=d');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab', y: 'c' }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab', y: 'c', z: 'd' }), '/?z=d');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab' }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab', z: 'd' }), '/?z=d');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'd' }), '/?z=d');
        });
    });

    describe('Two Param Two Segment Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}/{y?}', defaults: { y: 'ab' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/aa/bbb');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'bbb');
            var { data } = stateNavigator.parseLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'bbb');
            assert.strictEqual(data.z, 'cccc');
            var { data } = stateNavigator.parseLink('/aa');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'ab');
            var { data } = stateNavigator.parseLink('/aa?z=bb');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'ab');
            assert.strictEqual(data.z, 'bb');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/aa/bbb/e'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/aa//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'ab' }), '/aa');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'ab', z: 'bb' }), '/aa?z=bb');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa' }), '/aa');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', z: 'bb' }), '/aa?z=bb');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'bbb' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('Two Param One Optional Two Segment Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}/{y?}', defaults: { x: 'abc' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/aa/bbb');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'bbb');
            var { data } = stateNavigator.parseLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'bbb');
            assert.strictEqual(data.z, 'cccc');
            var { data } = stateNavigator.parseLink('/aab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'aab');
            var { data } = stateNavigator.parseLink('/aab?z=ccd');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'aab');
            assert.strictEqual(data.z, 'ccd');
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'abc');
            var { data } = stateNavigator.parseLink('/?z=de');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'abc');
            assert.strictEqual(data.z, 'de');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/aa/bbb/e'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/aa//'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'abc', y: 'bbb' }), '/abc/bbb');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'abc', y: 'bbb', z: 'cccc' }), '/abc/bbb?z=cccc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'bbb' }), '/abc/bbb');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'bbb', z: 'cccc' }), '/abc/bbb?z=cccc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aab' }), '/aab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aab', z: 'ccd' }), '/aab?z=ccd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'abc' }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'abc', z: 'de' }), '/?z=de');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'de' }), '/?z=de');
        });
    });

    describe('Four Param Two Optional Five Segment Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{w?}/{x?}/{y?}/{z?}', defaults: { w: 'abc', x: 'de' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/cd/ef/hi/jk');
            assert.strictEqual(Object.keys(data).length, 4);
            assert.strictEqual(data.w, 'cd');
            assert.strictEqual(data.x, 'ef');
            assert.strictEqual(data.y, 'hi');
            assert.strictEqual(data.z, 'jk');
            var { data } = stateNavigator.parseLink('/ab/cd/ef/hi/jk?a=lm');
            assert.strictEqual(Object.keys(data).length, 5);
            assert.strictEqual(data.w, 'cd');
            assert.strictEqual(data.x, 'ef');
            assert.strictEqual(data.y, 'hi');
            assert.strictEqual(data.z, 'jk');
            assert.strictEqual(data.a, 'lm');
            var { data } = stateNavigator.parseLink('/ab/cde/fg/h');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.w, 'cde');
            assert.strictEqual(data.x, 'fg');
            assert.strictEqual(data.y, 'h');
            var { data } = stateNavigator.parseLink('/ab/cde/fg/h?a=i');
            assert.strictEqual(Object.keys(data).length, 4);
            assert.strictEqual(data.w, 'cde');
            assert.strictEqual(data.x, 'fg');
            assert.strictEqual(data.y, 'h');
            assert.strictEqual(data.a, 'i');
            var { data } = stateNavigator.parseLink('/ab/cc/def');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.w, 'cc');
            assert.strictEqual(data.x, 'def');
            var { data } = stateNavigator.parseLink('/ab/cc/def?a=gg');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.w, 'cc');
            assert.strictEqual(data.x, 'def');
            assert.strictEqual(data.a, 'gg');
            var { data } = stateNavigator.parseLink('/ab/ccdd');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.w, 'ccdd');
            assert.strictEqual(data.x, 'de');
            var { data } = stateNavigator.parseLink('/ab/ccdd?a=fg');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.w, 'ccdd');
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.a, 'fg');
            var { data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.w, 'abc');
            assert.strictEqual(data.x, 'de');
            var { data } = stateNavigator.parseLink('/ab?a=fg');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.w, 'abc');
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.a, 'fg');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ ab/cde/fg/h'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cde/fg/h/ij/k'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cde/fg/h//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cde/fg//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cd', x: 'ef', y: 'hi', z: 'jk' }), '/ab/cd/ef/hi/jk');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cd', x: 'ef', y: 'hi', z: 'jk', a: 'lm' }), '/ab/cd/ef/hi/jk?a=lm');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cd', x: 'de', y: 'hi', z: 'jk' }), '/ab/cd/de/hi/jk');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cd', x: 'de', y: 'hi', z: 'jk', a: 'lm' }), '/ab/cd/de/hi/jk?a=lm');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', x: 'ef', y: 'hi', z: 'jk' }), '/ab/abc/ef/hi/jk');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', x: 'ef', y: 'hi', z: 'jk', a: 'lm' }), '/ab/abc/ef/hi/jk?a=lm');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', x: 'de', y: 'hi', z: 'jk' }), '/ab/abc/de/hi/jk');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', x: 'de', y: 'hi', z: 'jk', a: 'lm' }), '/ab/abc/de/hi/jk?a=lm');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ef', y: 'hi', z: 'jk' }), '/ab/abc/ef/hi/jk');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ef', y: 'hi', z: 'jk', a: 'lm' }), '/ab/abc/ef/hi/jk?a=lm');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'hi', z: 'jk' }), '/ab/abc/de/hi/jk');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'hi', z: 'jk', a: 'lm' }), '/ab/abc/de/hi/jk?a=lm');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'hi' }), '/ab/abc/de/hi');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'hi', a: 'lm' }), '/ab/abc/de/hi?a=lm');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ef' }), '/ab/abc/ef');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ef', a: 'lm' }), '/ab/abc/ef?a=lm');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de' }), '/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', a: 'lm' }), '/ab?a=lm');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'hi', z: 'jk' }), '/ab/abc/de/hi/jk');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'hi', z: 'jk', a: 'lm' }), '/ab/abc/de/hi/jk?a=lm');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'hi' }), '/ab/abc/de/hi');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'hi', a: 'lm' }), '/ab/abc/de/hi?a=lm');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cde', x: 'fg', y: 'h' }), '/ab/cde/fg/h');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cde', x: 'fg', y: 'h', a: 'i' }), '/ab/cde/fg/h?a=i');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', x: 'de', y: 'h' }), '/ab/abc/de/h');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', x: 'de', y: 'h', a: 'i' }), '/ab/abc/de/h?a=i');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cde', y: 'h', z: 'jk' }), '/ab/cde/de/h/jk');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cde', y: 'h', z: 'jk', a: 'lm' }), '/ab/cde/de/h/jk?a=lm');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', y: 'h', z: 'jk' }), '/ab/abc/de/h/jk');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', y: 'h', z: 'jk', a: 'lm' }), '/ab/abc/de/h/jk?a=lm');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cde', y: 'h' }), '/ab/cde/de/h');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cde', y: 'h', a: 'i' }), '/ab/cde/de/h?a=i');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', y: 'h' }), '/ab/abc/de/h');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', y: 'h', a: 'i' }), '/ab/abc/de/h?a=i');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cc', x: 'def' }), '/ab/cc/def');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cc', x: 'def', a: 'gg' }), '/ab/cc/def?a=gg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cc', x: 'de' }), '/ab/cc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cc', x: 'de', a: 'gg' }), '/ab/cc?a=gg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', x: 'de' }), '/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', x: 'de', a: 'fg' }), '/ab?a=fg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', x: 'def' }), '/ab/abc/def');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', x: 'def', a: 'gg' }), '/ab/abc/def?a=gg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'ccdd' }), '/ab/ccdd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'ccdd', a: 'gg' }), '/ab/ccdd?a=gg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc' }), '/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', a: 'fg' }), '/ab?a=fg');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { a: 'fg' }), '/ab?a=fg');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'jk' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cde', z: 'jk' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', z: 'jk' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'fg', z: 'jk' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', z: 'jk' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', x: 'fg', z: 'jk' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cde', x: 'de', z: 'jk' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'cde', x: 'fg', z: 'jk' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { w: 'abc', x: 'de', z: 'jk' }), null);
        });
    });

    describe('Spaces', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}' }
            ]);
        });
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/   a  ');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, '   a  ');
            var { data } = stateNavigator.parseLink('/   a  ?y=   b  ');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, '   a  ');
            assert.strictEqual(data.y, '   b  ');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '   a  ' }), '/%20%20%20a%20%20');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '   a  ', y: '   b  ' }), '/%20%20%20a%20%20?y=%20%20%20b%20%20');
        });
    });

    describe('Multi Char Param', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'a/{someVar}' }
            ]);
        });
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a/someVal');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.someVar, 'someVal');
            var { data } = stateNavigator.parseLink('/a/someVal?anotherVar=anotherVal');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.someVar, 'someVal');
            assert.strictEqual(data.anotherVar, 'anotherVal');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { someVar: 'someVal' }), '/a/someVal');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { someVar: 'someVal', anotherVar: 'anotherVal' }), '/a/someVal?anotherVar=anotherVal');
        });
    });

    describe('Match Slash', function () {
        it('should match', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: '{x}' }
            ]);
            var { data } = stateNavigator.parseLink('abc/');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'abc');
        });
    });

    describe('Reserved Url Character', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'a/{=*"()\'-_~@:?><.;[],!£$%^#&?}', defaults: { '=*"()\'-_~@:?><.;[],!£$%^#&': 'x*="()\'-__+~@:?><.;[],!£$%^#&' } }
            ]);
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a/x*%3D%22()\'-0__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data['=*"()\'-_~@:?><.;[],!£$%^#&'], 'x*="()\'-__+~@:?><.;[],!£$%^#&');
            var { data } = stateNavigator.parseLink('/a/x*%3D%22()\'-0__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26?x*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=x*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data['=*"()\'-_~@:?><.;[],!£$%^#&'], 'x*="()\'-__+~@:?><.;[],!£$%^#&');
            assert.strictEqual(data['x*="()\'-__+~@:?><.;[],!£$%^#&'], 'x*="()\'-_+~@:?><.;[],!£$%^#&');
            var { data } = stateNavigator.parseLink('/a');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data['=*"()\'-_~@:?><.;[],!£$%^#&'], 'x*="()\'-__+~@:?><.;[],!£$%^#&');
            var { data } = stateNavigator.parseLink('/a?x*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=x*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data['=*"()\'-_~@:?><.;[],!£$%^#&'], 'x*="()\'-__+~@:?><.;[],!£$%^#&');
            assert.strictEqual(data['x*="()\'-__+~@:?><.;[],!£$%^#&'], 'x*="()\'-_+~@:?><.;[],!£$%^#&');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { '=*"()\'-_~@:?><.;[],!£$%^#&': 'x*="()\'-_+~@:?><.;[],!£$%^#&' }), '/a/x*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { '=*"()\'-_~@:?><.;[],!£$%^#&': 'x*="()\'-_+~@:?><.;[],!£$%^#&', 'x*="()\'-__+~@:?><.;[],!£$%^#&': 'x*="()\'-_+~@:?><.;[],!£$%^#&'}), '/a/x*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26?x*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=x*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { '=*"()\'-_~@:?><.;[],!£$%^#&': 'x*="()\'-__+~@:?><.;[],!£$%^#&' }), '/a');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { '=*"()\'-_~@:?><.;[],!£$%^#&': 'x*="()\'-__+~@:?><.;[],!£$%^#&', 'x*="()\'-__+~@:?><.;[],!£$%^#&': 'x*="()\'-_+~@:?><.;[],!£$%^#&'}), '/a?x*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=x*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/a');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { 'x*="()\'-__+~@:?><.;[],!£$%^#&': 'x*="()\'-_+~@:?><.;[],!£$%^#&' }), '/a?x*%3D%22()\'-__%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26=x*%3D%22()\'-0_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
        });
    });

    describe('Reserved Regex Character', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '.*\^$\[\]()\'/{x}' }
            ]);
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/.*\^$\[\]()\'/abc');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'abc');
            var { data } = stateNavigator.parseLink('/.*\^$\[\]()\'/abc?y=de');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'abc');
            assert.strictEqual(data.y, 'de');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'abc' }), '/.*\^$\[\]()\'/abc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'abc', y: 'de' }), '/.*\^$\[\]()\'/abc?y=de');
        });
    });

    describe('One Param Optional Mandatory One Mixed Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab{x?}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abcde');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cde');
            var { data } = stateNavigator.parseLink('/abcde?y=fg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cde');
            assert.strictEqual(data.y, 'fg');
            var { data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 0);
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ab/cde'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcd//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde' }), '/abcde');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cde', y: 'fg' }), '/abcde?y=fg');
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/ab');
        });
    });

    describe('Two Param One Optional Mandatory Three Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{x?}/{y}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'efg');
            var { data } = stateNavigator.parseLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'efg');
            assert.strictEqual(data.z, 'hi');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ ab/cd/efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd/efg/h'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab//efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//cd/efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cde'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'efg' }), '/ab/cd/efg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg?z=hi');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'efg' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('Two Param Two Segment Default Mandatory', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}/{y}', defaults: { x: 'ab' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/aa/bbb');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'bbb');
            var { data } = stateNavigator.parseLink('/aa/bbb?z=cccc');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'aa');
            assert.strictEqual(data.y, 'bbb');
            assert.strictEqual(data.z, 'cccc');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/aa/bbb/e'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/aa//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/aa'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'bbb' }), '/aa/bbb');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa', y: 'bbb', z: 'cccc' }), '/aa/bbb?z=cccc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'bbb' }), '/ab/bbb');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'bbb', z: 'cccc' }), '/ab/bbb?z=cccc');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'aa' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('Two Param One Optional Mandatory Four Segment Default Mandatory', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{x?}/{y}/c', defaults: { y: 'ee' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/cd/efg/c');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'efg');
            var { data } = stateNavigator.parseLink('/ab/cd/efg/c?z=hi');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'efg');
            assert.strictEqual(data.z, 'hi');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ ab/cd/efg/c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd/efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd/efg/c//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab//efg/c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd//c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab///c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/c'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'efg' }), '/ab/cd/efg/c');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'efg', z: 'hi' }), '/ab/cd/efg/c?z=hi');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd' }), '/ab/cd/ee/c');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', z: 'ef' }), '/ab/cd/ee/c?z=ef');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'efg' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('Extra Defaults', function () {
        it('should match', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}', defaults: { x: 'a', y: 'b' } }
            ]);
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'a');
            assert.strictEqual(data.y, 'b');
            var { data } = stateNavigator.parseLink('/?z=c');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'a');
            assert.strictEqual(data.y, 'b');
            assert.strictEqual(data.z, 'c');
        });
    });

    describe('Case Insensitive', function () {
        it('should match', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'abc/{x}' }
            ]);
            var { data } = stateNavigator.parseLink('/AbC/aBc');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'aBc');
            var { data } = stateNavigator.parseLink('/AbC/aBc?y=dE');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'aBc');
            assert.strictEqual(data.y, 'dE');
        });
    });

    describe('Multiple Routes', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{x}' },
                { key: 's1', route: 'cd/{x}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/ef');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ef');
            var { data } = stateNavigator.parseLink('/ab/ef?y=gh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ef');
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/cd/ef');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ef');
            var { data } = stateNavigator.parseLink('/cd/ef?y=gh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ef');
            assert.strictEqual(data.y, 'gh');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/aa/bbb'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/cd'), /The Url .+ is invalid/);
        });
    });

    describe('Two Route One With Param', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: ['', 'abc/{x}'] }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/?y=d');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.y, 'd');
            var { data } = stateNavigator.parseLink('/abc/de');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'de');
            var { data } = stateNavigator.parseLink('/abc/de?y=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'f');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//abc/de'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'd' }), '/?y=d');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'f' }), '/abc/de?y=f');
        });
    });

    describe('Expand Route One With Param', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '+abc/{x}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/?y=d');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.y, 'd');
            var { data } = stateNavigator.parseLink('/abc/de');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'de');
            var { data } = stateNavigator.parseLink('/abc/de?y=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'f');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//abc/de'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'd' }), '/?y=d');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'f' }), '/abc/de?y=f');
        });
    });

    describe('Two Route Param', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: ['abc/{x}', 'def/{y}'] }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc/de');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'de');
            var { data } = stateNavigator.parseLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.z, 'f');
            var { data } = stateNavigator.parseLink('/def/gh');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/def/gh?z=i');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
            var { data } = stateNavigator.parseLink('/abc/de?y=fg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'fg');
            var { data } = stateNavigator.parseLink('/abc/de?y=fg&z=h');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'fg');
            assert.strictEqual(data.z, 'h');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd/ef'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/f'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/def/gh/i'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh' }), '/def/gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh', z: 'i' }), '/def/gh?z=i');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh' }), '/abc/de?y=gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh', z: 'i' }), '/abc/de?y=gh&z=i');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'g' }), null);
        });
    });

    describe('Two Route Parent Child', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: ['abc/{x}', 'abc/{x}/def/{y}'] }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc/de');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'de');
            var { data } = stateNavigator.parseLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.z, 'f');
            var { data } = stateNavigator.parseLink('/abc/de/def/gh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/abc/de/def/gh?z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/def/gh/i'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/deg/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh' }), '/abc/de/def/gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh', z: 'f' }), '/abc/de/def/gh?z=f');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'g' }), null);
        });
    });

    describe('Expand Route', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'abc/{x}+/def/{y}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc/de');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'de');
            var { data } = stateNavigator.parseLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.z, 'f');
            var { data } = stateNavigator.parseLink('/abc/de/def/gh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/abc/de/def/gh?z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/def/gh/i'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/deg/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh' }), '/abc/de/def/gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh', z: 'f' }), '/abc/de/def/gh?z=f');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'g' }), null);
        });
    });

    describe('Expand Route Mixed', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'abc{x}+/def/{y}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abcde');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'de');
            var { data } = stateNavigator.parseLink('/abcde?z=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.z, 'f');
            var { data } = stateNavigator.parseLink('/abcde/def/gh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/abcde/def/gh?z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcde/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcde/def/gh/i'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abdde'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcde/deg/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abcde'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abcde/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de' }), '/abcde');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', z: 'f' }), '/abcde?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh' }), '/abcde/def/gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh', z: 'f' }), '/abcde/def/gh?z=f');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'g' }), null);
        });
    });

    describe('Expand Route Optional Mixed', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'abc{x?}+/def/{y}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/abcde');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'de');
            var { data } = stateNavigator.parseLink('/abc/def/gh');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/abcde?z=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.z, 'f');
            var { data } = stateNavigator.parseLink('/abcde/def/gh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/abcde/def/gh?z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcde/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcde/def/gh/i'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abdde'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcde/deg/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abcde'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abcde/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/abc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de' }), '/abcde');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', z: 'f' }), '/abcde?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh' }), '/abcde/def/gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh', z: 'f' }), '/abcde/def/gh?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'g' }), '/abc?z=g');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh' }), '/abc/def/gh');
        });
    });

    describe('Expand Route Expand Optional Mixed', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'abc+{x}+/def/{y}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/abcde');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'de');
            var { data } = stateNavigator.parseLink('/abcde?z=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.z, 'f');
            var { data } = stateNavigator.parseLink('/abcde/def/gh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/abcde/def/gh?z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcde/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcde/def/gh/i'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abdde'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abcde/deg/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abcde'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abcde/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/abc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de' }), '/abcde');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', z: 'f' }), '/abcde?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh' }), '/abcde/def/gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh', z: 'f' }), '/abcde/def/gh?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'g' }), '/abc?z=g');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh' }), '/abc?y=gh');
        });
    });

    describe('Expand Route Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'abc/{x}+/def/{y}', defaults: { y: 's' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc/de');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 's');
            var { data } = stateNavigator.parseLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 's');
            assert.strictEqual(data.z, 'f');
            var { data } = stateNavigator.parseLink('/abc/de/def/gh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/abc/de/def/gh?z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc/de/def/gh/i'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/deg/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh' }), '/abc/de/def/gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh', z: 'f' }), '/abc/de/def/gh?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 's' }), '/abc/de');
        });
        
        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh' }), null);
        });
    });

    describe('Two Route Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: ['abc/{x?}', 'def/{y}'], defaults: { x: 's' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 's');
            var { data } = stateNavigator.parseLink('/abc?z=e');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 's');
            assert.strictEqual(data.z, 'e');
            var { data } = stateNavigator.parseLink('/abc/de');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'de');
            var { data } = stateNavigator.parseLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.z, 'f');
            var { data } = stateNavigator.parseLink('/def/gh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 's');
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/def/gh?z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 's');
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
            var { data } = stateNavigator.parseLink('/abc/de?y=gh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/abc/de?y=gh&z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd/ef'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/f'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/def/gh/i'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/abc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'e' }), '/abc?z=e');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh' }), '/def/gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh', z: 'i' }), '/def/gh?z=i');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh' }), '/abc/de?y=gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh', z: 'i' }), '/abc/de?y=gh&z=i');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 's', y: 'gh' }), '/def/gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 's', y: 'gh', z: 'i' }), '/def/gh?z=i');
        });
    });

    describe('Two Route Reverse Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: ['{x}/{y}', '{x}'], defaults: { y: 's' } }
            ]);
        });
        
        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'a' }), '/a');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'a', y: 'b' }), '/a/b');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'a', y: 's' }), '/a');
        });
    });

    describe('Two Route Optional Parent Child', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: ['abc/{x?}', 'abc/{x}/def/{y}'] }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/abc?z=d');
            assert.strictEqual(data.z, 'd');
            assert.strictEqual(Object.keys(data).length, 1);
            var { data } = stateNavigator.parseLink('/abc/de');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'de');
            var { data } = stateNavigator.parseLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.z, 'f');
            var { data } = stateNavigator.parseLink('/abc/de/def/gh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/abc/de/def/gh?z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc/de/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/def/gh/i'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/deg/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/abc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'd' }), '/abc?z=d');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh' }), '/abc/de/def/gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh', z: 'f' }), '/abc/de/def/gh?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh' }), '/abc?y=gh');
        });
    });

    describe('Expand Route Optional', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: ['abc/{x?}+/def/{y}'] }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/abc?z=d');
            assert.strictEqual(data.z, 'd');
            assert.strictEqual(Object.keys(data).length, 1);
            var { data } = stateNavigator.parseLink('/abc/de');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'de');
            var { data } = stateNavigator.parseLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.z, 'f');
            var { data } = stateNavigator.parseLink('/abc/de/def/gh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/abc/de/def/gh?z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc/de/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/def/gh/i'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/deg/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/abc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'd' }), '/abc?z=d');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh' }), '/abc/de/def/gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh', z: 'f' }), '/abc/de/def/gh?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh' }), '/abc?y=gh');
        });
    });

    describe('Expand Route Expand Optional', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: ['abc+/{x}+/def/{y}'] }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/abc?z=d');
            assert.strictEqual(data.z, 'd');
            assert.strictEqual(Object.keys(data).length, 1);
            var { data } = stateNavigator.parseLink('/abc/de');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'de');
            var { data } = stateNavigator.parseLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.z, 'f');
            var { data } = stateNavigator.parseLink('/abc/de/def/gh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/abc/de/def/gh?z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc/de/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/def/gh/i'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/deg/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/abc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'd' }), '/abc?z=d');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh' }), '/abc/de/def/gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh', z: 'f' }), '/abc/de/def/gh?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh' }), '/abc?y=gh');
        });
    });

    describe('Two Route Default Number', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: ['def/{y}', 'abc/{x?}'], defaults: { x: 2 } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 2);
            var { data } = stateNavigator.parseLink('/abc?z=e');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 2);
            assert.strictEqual(data.z, 'e');
            var { data } = stateNavigator.parseLink('/abc/3');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 3);
            var { data } = stateNavigator.parseLink('/abc/3?z=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 3);
            assert.strictEqual(data.z, 'f');
            var { data } = stateNavigator.parseLink('/def/gh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 2);
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/def/gh?z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 2);
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
            var { data } = stateNavigator.parseLink('/def/gh?x=3');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 3);
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/def/gh?x=3&z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 3);
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/abc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'e' }), '/abc?z=e');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3 }), '/abc/3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3, z: 'f' }), '/abc/3?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh' }), '/def/gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh', z: 'i' }), '/def/gh?z=i');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3, y: 'gh' }), '/def/gh?x=3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3, y: 'gh', z: 'i' }), '/def/gh?x=3&z=i');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 2, y: 'gh' }), '/def/gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 2, y: 'gh', z: 'i' }), '/def/gh?z=i');
        });
    });

    describe('Expand Route Default Number', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'abc/{x}+/def/{y?}', defaults: { y: 2 } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc/de');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 2);
            var { data } = stateNavigator.parseLink('/abc/de?z=f');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 2);
            assert.strictEqual(data.z, 'f');
            var { data } = stateNavigator.parseLink('/abc/de/def/3');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 3);
            var { data } = stateNavigator.parseLink('/abc/de/def/3?z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 3);
            assert.strictEqual(data.z, 'i');
            var { data } = stateNavigator.parseLink('/abc/de/def');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 2);
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc/de/def/3/i'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/deg/3'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de/def/3'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', z: 'f' }), '/abc/de?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 3 }), '/abc/de/def/3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 3, z: 'f' }), '/abc/de/def/3?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 2 }), '/abc/de');
        });
        
        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 3 }), null);
        });
    });

    describe('Two Route Default Type Number', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: ['def/{y}', 'abc/{x}'], defaultTypes: { x: 'number' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc/3');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 3);
            var { data } = stateNavigator.parseLink('/abc/3?z=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 3);
            assert.strictEqual(data.z, 'f');
            var { data } = stateNavigator.parseLink('/def/gh');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/def/gh?z=i');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
            var { data } = stateNavigator.parseLink('/def/gh?x=3');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 3);
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/def/gh?x=3&z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 3);
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3 }), '/abc/3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3, z: 'f' }), '/abc/3?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh' }), '/def/gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh', z: 'i' }), '/def/gh?z=i');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3, y: 'gh' }), '/def/gh?x=3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3, y: 'gh', z: 'i' }), '/def/gh?x=3&z=i');
        });
    });

    describe('Expand Route Default Type Number', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'abc+/{x}+/def/{y}', defaultTypes: { x: 'number' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/abc?z=d');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.z, 'd');
            var { data } = stateNavigator.parseLink('/abc/3');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 3);
            var { data } = stateNavigator.parseLink('/abc/3?z=f');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 3);
            assert.strictEqual(data.z, 'f');
            var { data } = stateNavigator.parseLink('/abc/3/def/gh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 3);
            assert.strictEqual(data.y, 'gh');
            var { data } = stateNavigator.parseLink('/abc/3/def/gh?z=i');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 3);
            assert.strictEqual(data.y, 'gh');
            assert.strictEqual(data.z, 'i');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc/de/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/def/gh/i'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abd/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/de/deg/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ abc/de/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/def/gh'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/abc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { z: 'd' }), '/abc?z=d');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3 }), '/abc/3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3, z: 'f' }), '/abc/3?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3, y: 'gh' }), '/abc/3/def/gh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3, y: 'gh', z: 'f' }), '/abc/3/def/gh?z=f');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh' }), '/abc?y=gh');
        });
    });

    describe('Without Types', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}', trackTypes: false }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc');
            assert.strictEqual(data.x, 'abc');
            var { data } = stateNavigator.parseLink('/3');
            assert.strictEqual(data.x, '3');
            var { data } = stateNavigator.parseLink('/true');
            assert.strictEqual(data.x, 'true');
            var { data } = stateNavigator.parseLink('/0_1_2_');
            assert.strictEqual(data.x, '0_1_2_');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'abc' }), '/abc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3 }), '/3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: true }), '/true');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '0_1_2_' }), '/0_1_2_');
        });
    });

    describe('Without Types Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}', trackTypes: false, defaults: { x: 2 } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(data.x, 2);
            var { data } = stateNavigator.parseLink('/3');
            assert.strictEqual(data.x, 3);
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/a'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/true'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 2 }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '2' }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3 }), '/3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '3' }), '/3');
        });
    });

    describe('Without Types Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}', trackTypes: false, defaultTypes: { x: 'boolean' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/true');
            assert.strictEqual(data.x, true);
            var { data } = stateNavigator.parseLink('/false');
            assert.strictEqual(data.x, false);
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/a'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/2'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: true }), '/true');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'false' }), '/false');
        });
    });

    describe('Without Types Default And Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}', trackTypes: false, defaults: { x: '2' }, defaultTypes: { x: 'number' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(data.x, '2');
            var { data } = stateNavigator.parseLink('/3');
            assert.strictEqual(data.x, 3);
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/a'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/true'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 2 }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '2' }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3 }), '/3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '3' }), '/3');
        });
    });

    describe('Without Types Conflicting Default And Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}', trackTypes: false, defaults: { x: 'a' }, defaultTypes: { x: 'number' } }
            ]);
        });
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(data.x, 'a');
            var { data } = stateNavigator.parseLink('/a');
            assert.strictEqual(data.x, 'a');
        });
        
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/b'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'a' }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3 }), '/3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '3' }), '/3');
        });
    });

    describe('Without Types Query String', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', trackTypes: false }
            ]);
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(data.x, undefined);
            var { data } = stateNavigator.parseLink('/?x=3');
            assert.strictEqual(data.x, '3');
            var { data } = stateNavigator.parseLink('/?x=true');
            assert.strictEqual(data.x, 'true');
            var { data } = stateNavigator.parseLink('/?x=0_1_2_');
            assert.strictEqual(data.x, '0_1_2_');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'abc' }), '/?x=abc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3 }), '/?x=3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: true }), '/?x=true');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '0_1_2_' }), '/?x=0_1_2_');
        });
    });

    describe('Without Types Query String Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', trackTypes: false, defaults: { x: 2 } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(data.x, 2);
            var { data } = stateNavigator.parseLink('/?x=3');
            assert.strictEqual(data.x, 3);
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/?x=a'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/?x=true'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 2 }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '2' }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3 }), '/?x=3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '3' }), '/?x=3');
        });
    });

    describe('Without Types Query String Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', trackTypes: false, defaultTypes: { x: 'boolean' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=true');
            assert.strictEqual(data.x, true);
            var { data } = stateNavigator.parseLink('/?x=false');
            assert.strictEqual(data.x, false);
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/?x=a'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/?x=2'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: true }), '/?x=true');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'false' }), '/?x=false');
        });
    });

    describe('Without Types Query String Default And Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', trackTypes: false, defaults: { x: '2' }, defaultTypes: { x: 'number' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(data.x, '2');
            var { data } = stateNavigator.parseLink('/?x=3');
            assert.strictEqual(data.x, 3);
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/?x=a'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/?x=true'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 2 }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '2' }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3 }), '/?x=3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '3' }), '/?x=3');
        });
    });

    describe('Without Types Query String Conflicting Default And Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', trackTypes: false, defaults: { x: 'a' }, defaultTypes: { x: 'number' } }
            ]);
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(data.x, 'a');
            var { data } = stateNavigator.parseLink('/?x=a');
            assert.strictEqual(data.x, 'a');
        });
        
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/?x=b'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'a' }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3 }), '/?x=3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '3' }), '/?x=3');
        });
    });

    describe('Empty String', function () {
        it('should build', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: '{x}' }
            ]);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '' }), null);
        });
    });

    describe('Without Types Two Route Default', function () {
        it('should build', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: ['{x?}', 'a/{y}'], trackTypes: false, defaults: { x: 2 } }
            ]);
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 2, y: 1 }), '/a/1');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '2', y: 1 }), '/a/1');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 1 }), '/1');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '1' }), '/1');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 2 }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '2' }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 1 }), '/a/1');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 1, y: 2 }), '/1?y=2');
        });
    });

    describe('Without Types Expand Route Default', function () {
        it('should build', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: '+a/{x}+/b/{y}', trackTypes: false, defaults: { x: '3', y: 2 } }
            ]);
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 1 }), '/a/1');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '1' }), '/a/1');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3 }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '3' }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 1, y: 2 }), '/a/1');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 1, y: '2' }), '/a/1');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3, y: 2 }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '3', y: '2' }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 1, y: 3 }), '/a/1/b/3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 1, y: '3' }), '/a/1/b/3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3, y: 3 }), '/a/3/b/3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '3', y: '3' }), '/a/3/b/3');
        });
    });

    describe('Array Query String Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaultTypes: { x: 'stringarray' } }
            ]);
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=Hello&x=World');
            assert.strictEqual(data.x[0], 'Hello');
            assert.strictEqual(data.x[1], 'World');
            assert.strictEqual(data.x.length, 2);
            var { data } = stateNavigator.parseLink('/?x=H1-ello&x=W2-orld');
            assert.strictEqual(data.x[0], 'H1-ello');
            assert.strictEqual(data.x[1], 'W2-orld');
            assert.strictEqual(data.x.length, 2);
            var { data } = stateNavigator.parseLink('/?x=H1-ello');
            assert.strictEqual(data.x[0], 'H1-ello');
            assert.strictEqual(data.x.length, 1);
            var { data } = stateNavigator.parseLink('/?x=H2-ello');
            assert.strictEqual(data.x[0], 'H2-ello');
            assert.strictEqual(data.x.length, 1);
        });
        
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/?x='), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['Hello', 'World'] }), '/?x=Hello&x=World');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['H1-ello', 'W2-orld'] }), '/?x=H1-ello&x=W2-orld');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['H1-ello'] }), '/?x=H1-ello');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['H2-ello'] }), '/?x=H2-ello');
        });
    });

    describe('Array Param Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}', defaultTypes: { x: 'stringarray' } }
            ]);
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/Hello1-World');
            assert.strictEqual(data.x[0], 'Hello');
            assert.strictEqual(data.x[1], 'World');
            assert.strictEqual(data.x.length, 2);
            var { data } = stateNavigator.parseLink('/H10-ello1-W20-orld');
            assert.strictEqual(data.x[0], 'H1-ello');
            assert.strictEqual(data.x[1], 'W2-orld');
            assert.strictEqual(data.x.length, 2);
            var { data } = stateNavigator.parseLink('/H10-ello');
            assert.strictEqual(data.x[0], 'H1-ello');
            assert.strictEqual(data.x.length, 1);
            var { data } = stateNavigator.parseLink('/H20-ello');
            assert.strictEqual(data.x[0], 'H2-ello');
            assert.strictEqual(data.x.length, 1);
        });
        
        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['Hello', 'World'] }), '/Hello1-World');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['H1-ello', 'W2-orld'] }), '/H10-ello1-W20-orld');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['H1-ello'] }), '/H10-ello');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['H2-ello'] }), '/H20-ello');
        });
    });

    describe('Array Query String Default Type Number', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaultTypes: { x: 'numberarray' } }
            ]);
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=1&x=2&x=4');
            assert.strictEqual(data.x[0], 1);
            assert.strictEqual(data.x[1], 2);
            assert.strictEqual(data.x[2], 4);
            assert.strictEqual(data.x.length, 3);
        });
        
        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [1, 2, 4] }), '/?x=1&x=2&x=4');
        });
    });

    describe('Array Query String Default Type Boolean', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaultTypes: { x: 'booleanarray' } }
            ]);
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=true&x=false');
            assert.strictEqual(data.x[0], true);
            assert.strictEqual(data.x[1], false);
            assert.strictEqual(data.x.length, 2);
        });
        
        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [true, false] }), '/?x=true&x=false');
        });
    });

    describe('Without Types Array Query String Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', trackTypes: false, defaultTypes: { x: 'stringarray' } }
            ]);
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=He_llo&x=Wor-ld');
            assert.strictEqual(data.x[0], 'He_llo');
            assert.strictEqual(data.x[1], 'Wor-ld');
            assert.strictEqual(data.x.length, 2);
            var { data } = stateNavigator.parseLink('/?x=1&x=2&x=4');
            assert.strictEqual(data.x[0], '1');
            assert.strictEqual(data.x[1], '2');
            assert.strictEqual(data.x[2], '4');
            assert.strictEqual(data.x.length, 3);
        });
        
        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['He_llo', 'Wor-ld'] }), '/?x=He_llo&x=Wor-ld');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [1, 2, 4] }), '/?x=1&x=2&x=4');
        });
    });

    describe('Array Query String Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaults: { x: ['Hello', 'World'] } }
            ]);
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=Hello');
            assert.strictEqual(data.x[0], 'Hello');
            assert.strictEqual(data.x.length, 1);
            var { data } = stateNavigator.parseLink('/?x=World&x=Hello');
            assert.strictEqual(data.x[0], 'World');
            assert.strictEqual(data.x[1], 'Hello');
            assert.strictEqual(data.x.length, 2);
        });
        
        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['Hello'] }), '/?x=Hello');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['Hello', 'World'] }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['World', 'Hello'] }), '/?x=World&x=Hello');
        });
    });

    describe('Array Query String Default Number', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaults: { x: [1, 2, 4] } }
            ]);
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=1');
            assert.strictEqual(data.x[0], 1);
            assert.strictEqual(data.x.length, 1);
            var { data } = stateNavigator.parseLink('/?x=1&x=4&x=2');
            assert.strictEqual(data.x[0], 1);
            assert.strictEqual(data.x[1], 4);
            assert.strictEqual(data.x[2], 2);
            assert.strictEqual(data.x.length, 3);
        });
        
        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [1, 2] }), '/?x=1&x=2');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [1, 2, 4] }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [1, 4, 2] }), '/?x=1&x=4&x=2');
        });
    });

    describe('Array Query String Default Boolean', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaults: { x: [true, false] } }
            ]);
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=false');
            assert.strictEqual(data.x[0], false);
            assert.strictEqual(data.x.length, 1);
            var { data } = stateNavigator.parseLink('/?x=false&x=true');
            assert.strictEqual(data.x[0], false);
            assert.strictEqual(data.x[1], true);
            assert.strictEqual(data.x.length, 2);
        });
        
        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [false] }), '/?x=false');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [true, false] }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [false, true] }), '/?x=false&x=true');
        });
    });

    describe('Array Query String Default Date', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaults: { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] } }
            ]);
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=2011-08-03');
            assert.strictEqual(+data.x[0], +new Date(2011, 7, 3));
            assert.strictEqual(data.x.length, 1);
            var { data } = stateNavigator.parseLink('/?x=2011-08-03&x=2010-04-07');
            assert.strictEqual(+data.x[0], +new Date(2011, 7, 3));
            assert.strictEqual(+data.x[1], +new Date(2010, 3, 7));
            assert.strictEqual(data.x.length, 2);
        });
        
        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [new Date(2010, 3, 7)] }), '/?x=2010-04-07');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [new Date(2011, 7, 3), new Date(2010, 3, 7)] }), '/?x=2011-08-03&x=2010-04-07');
        });
    });

    describe('String Query String Default Type Number', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaultTypes: { x: 'number' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=ab1_0');
            assert.strictEqual(data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab' }), '/?x=ab1_0');
        });
    });

    describe('String Param Default Type Number', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}', defaultTypes: { x: 'number' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab1_0');
            assert.strictEqual(data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab' }), '/ab1_0');
        });
    });

    describe('Number Query String Default Type Boolean', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaultTypes: { x: 'boolean' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=1241_2');
            assert.strictEqual(data.x, 124);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 124 }), '/?x=1241_2');
        });
    });

    describe('Number Param Default Type Boolean', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}', defaultTypes: { x: 'boolean' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/1241_2');
            assert.strictEqual(data.x, 124);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 124 }), '/1241_2');
        });
    });

    describe('Boolean Query String Default Type Date', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaultTypes: { x: 'date' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=true1_1');
            assert.strictEqual(data.x, true);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: true }), '/?x=true1_1');
        });
    });

    describe('Boolean Param Default Type Date', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}', defaultTypes: { x: 'date' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/true1_1');
            assert.strictEqual(data.x, true);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: true }), '/true1_1');
        });
    });

    describe('Date Query String Default Type String', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaultTypes: { x: 'string' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=2010-04-071_3');
            assert.strictEqual(+data.x, +new Date(2010, 3, 7));
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: new Date(2010, 3, 7) }), '/?x=2010-04-071_3');
        });
    });

    describe('Date Param Default Type String', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}', defaultTypes: { x: 'string' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/2010-04-071_3');
            assert.strictEqual(+data.x, +new Date(2010, 3, 7));
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: new Date(2010, 3, 7) }), '/2010-04-071_3');
        });
    });

    describe('String Array Query String Default Type Number Array', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaultTypes: { x: 'numberarray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=ab1_a0&x=cde');
            assert.strictEqual(data.x[0], 'ab');
            assert.strictEqual(data.x[1], 'cde');
            assert.strictEqual(data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ab', 'cde'] }), '/?x=ab1_a0&x=cde');
        });
    });

    describe('String Array Param Default Type Number Array', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}', defaultTypes: { x: 'numberarray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab1-cde1_a0');
            assert.strictEqual(data.x[0], 'ab');
            assert.strictEqual(data.x[1], 'cde');
            assert.strictEqual(data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ab', 'cde'] }), '/ab1-cde1_a0');
        });
    });

    describe('Number Array Query String Default Type Boolean Array', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaultTypes: { x: 'booleanarray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=1241_a2&x=35');
            assert.strictEqual(data.x[0], 124);
            assert.strictEqual(data.x[1], 35);
            assert.strictEqual(data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [124, 35] }), '/?x=1241_a2&x=35');
        });
    });

    describe('Number Array Param Default Type Boolean Array', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}', defaultTypes: { x: 'booleanarray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/1241-351_a2');
            assert.strictEqual(data.x[0], 124);
            assert.strictEqual(data.x[1], 35);
            assert.strictEqual(data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [124, 35] }), '/1241-351_a2');
        });
    });

    describe('Boolean Array Query String Default Type Date Array', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaultTypes: { x: 'datearray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=true1_a1&x=false');
            assert.strictEqual(data.x[0], true);
            assert.strictEqual(data.x[1], false);
            assert.strictEqual(data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [true, false] }), '/?x=true1_a1&x=false');
        });
    });

    describe('Boolean Array Param Default Type Date Array', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}', defaultTypes: { x: 'datearray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/true1-false1_a1');
            assert.strictEqual(data.x[0], true);
            assert.strictEqual(data.x[1], false);
            assert.strictEqual(data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [true, false] }), '/true1-false1_a1');
        });
    });

    describe('Date Array Query String Default Type String Array', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaultTypes: { x: 'stringarray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=2010-04-071_a3&x=2011-08-03');
            assert.strictEqual(+data.x[0], +new Date(2010, 3, 7));
            assert.strictEqual(+data.x[1], +new Date(2011, 7, 3));
            assert.strictEqual(data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }), '/?x=2010-04-071_a3&x=2011-08-03');
        });
    });

    describe('Date Array Param Default Type String Array', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}', defaultTypes: { x: 'stringarray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/20100-040-071-20110-080-031_a3');
            assert.strictEqual(+data.x[0], +new Date(2010, 3, 7));
            assert.strictEqual(+data.x[1], +new Date(2011, 7, 3));
            assert.strictEqual(data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }), '/20100-040-071-20110-080-031_a3');
        });
    });

    describe('No Param One Segment Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'abc' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val.replace(' ', '+')  
            state.urlDecode = (state, key, val) => val.replace('+', ' ')  
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc?x=a+b');
            assert.strictEqual(data.x, 'a b');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'a b' }), '/abc?x=a+b');
        });
    });

    describe('One Param Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val.replace(' ', '+')  
            state.urlDecode = (state, key, val) => val.replace('+', ' ')  
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a+b');
            assert.strictEqual(data.x, 'a b');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'a b' }), '/a+b');
        });
    });

    describe('One Param Query String Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val, queryString) =>  {
                return queryString ? val.replace(' ', '+') : encodeURIComponent(val);
            }  
            state.urlDecode = (state, key, val, queryString) => {
                return queryString ? val.replace('+', ' ') : decodeURIComponent(val);
            }  
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a%20b?y=c+d');
            assert.strictEqual(data.x, 'a b');
            assert.strictEqual(data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'a b', y: 'c d' }), '/a%20b?y=c+d');
        });
    });

    describe('One Param Route Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val, queryString) => {
                return !queryString ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.urlDecode = (state, key, val, queryString) => {
                return !queryString ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a+b?y=c%20d');
            assert.strictEqual(data.x, 'a b');
            assert.strictEqual(data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'a b', y: 'c d' }), '/a+b?y=c%20d');
        });
    });

    describe('No Param One Segment State Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'a' },
                { key: 's1', route: 'b' }
            ]);
            for(var key in stateNavigator.states) {
                var state = stateNavigator.states[key];
                state.urlEncode = (state, key, val) => {
                    return state.key == 's0' ? val.replace(' ', '+') : encodeURIComponent(val);
                }
                state.urlDecode = (state, key, val) => {
                    return state.key == 's0' ? val.replace('+', ' ') : decodeURIComponent(val);
                }
            }
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a?x=c+d');
            assert.strictEqual(data.x, 'c d');
            var { data } = stateNavigator.parseLink('/b?x=c%20d');
            assert.strictEqual(data.x, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s0', { x: 'c d' }), '/a?x=c+d');
            assert.strictEqual(stateNavigator.getNavigationLink('s1', { x: 'c d' }), '/b?x=c%20d');
        });
    });

    describe('One Param State Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'a/{x}' },
                { key: 's1', route: 'b/{x}' }
            ]);
            for(var key in stateNavigator.states) {
                var state = stateNavigator.states[key];
                state.urlEncode = (state, key, val) => {
                    return state.key == 's0' ? val.replace(' ', '+') : encodeURIComponent(val);
                }
                state.urlDecode = (state, key, val) => {
                    return state.key == 's0' ? val.replace('+', ' ') : decodeURIComponent(val);
                }
            }
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a/c+d');
            assert.strictEqual(data.x, 'c d');
            var { data } = stateNavigator.parseLink('/b/c%20d');
            assert.strictEqual(data.x, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s0', { x: 'c d' }), '/a/c+d');
            assert.strictEqual(stateNavigator.getNavigationLink('s1', { x: 'c d' }), '/b/c%20d');
        });
    });

    describe('One Param Query String Key Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) =>  {
                return key === 'y' ? val.replace(' ', '+') : encodeURIComponent(val);
            }  
            state.urlDecode = (state, key, val) => {
                return key === 'y' ? val.replace('+', ' ') : decodeURIComponent(val);
            }  
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a%20b?y=c+d');
            assert.strictEqual(data.x, 'a b');
            assert.strictEqual(data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'a b', y: 'c d' }), '/a%20b?y=c+d');
        });
    });

    describe('One Param Route Key Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => {
                return key === 'x' ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.urlDecode = (state, key, val) => {
                return key === 'x' ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a+b?y=c%20d');
            assert.strictEqual(data.x, 'a b');
            assert.strictEqual(data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'a b', y: 'c d' }), '/a+b?y=c%20d');
        });
    });

    describe('Two Param Route Key Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}/{y}' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => {
                return key === 'x' ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.urlDecode = (state, key, val) => {
                return key === 'x' ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a+b/c%20d');
            assert.strictEqual(data.x, 'a b');
            assert.strictEqual(data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'a b', y: 'c d' }), '/a+b/c%20d');
        });
    });

    describe('One Optional Param Route Key Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => {
                return key === 'x' ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.urlDecode = (state, key, val) => {
                return key === 'x' ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a+b?y=c%20d');
            assert.strictEqual(data.x, 'a b');
            assert.strictEqual(data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'a b', y: 'c d' }), '/a+b?y=c%20d');
        });
    });

    describe('One Mixed Param Route Key Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab{x}' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => {
                return key === 'x' ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.urlDecode = (state, key, val) => {
                return key === 'x' ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/aba+b?y=c%20d');
            assert.strictEqual(data.x, 'a b');
            assert.strictEqual(data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'a b', y: 'c d' }), '/aba+b?y=c%20d');
        });
    });

    describe('No Param Two Query String Key Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) =>  {
                return key === 'y' ? val.replace(' ', '+') : encodeURIComponent(val);
            }  
            state.urlDecode = (state, key, val) => {
                return key === 'y' ? val.replace('+', ' ') : decodeURIComponent(val);
            }  
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=a%20b&y=c+d');
            assert.strictEqual(data.x, 'a b');
            assert.strictEqual(data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'a b', y: 'c d' }), '/?x=a%20b&y=c+d');
        });
    });

    describe('No Param Key Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) =>  {
                return !key ? val.replace(' ', '+') : encodeURIComponent(val);
            }  
            state.urlDecode = (state, key, val) => {
                return !key ? val.replace('+', ' ') : decodeURIComponent(val);
            }  
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?a+b=c%20d');
            assert.strictEqual(data['a b'], 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { 'a b': 'c d' }), '/?a+b=c%20d');
        });
    });

    describe('No Param Two Key Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) =>  {
                return (!key && val == 'a b') ? val.replace(' ', '+') : encodeURIComponent(val);
            }  
            state.urlDecode = (state, key, val) => {
                return (!key && val == 'a+b') ? val.replace('+', ' ') : decodeURIComponent(val);
            }  
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?a+b=c%20d&e%20f=g%20h');
            assert.strictEqual(data['a b'], 'c d');
            assert.strictEqual(data['e f'], 'g h');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { 'a b': 'c d', 'e f': 'g h' }), '/?a+b=c%20d&e%20f=g%20h');
        });
    });

    describe('One Param Empty Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}' }
            ]);
            var state = stateNavigator.states['s'];
            delete state.urlEncode;
            delete state.urlDecode;
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a%20b?y=c%20d');
            assert.strictEqual(data.x, 'a b');
            assert.strictEqual(data.y, 'c d');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'a b', y: 'c d' }), '/a%20b?y=c%20d');
        });
    });

    describe('No Param Array Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaultTypes: { x: 'stringarray' } }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val.replace(' ', '+')
            state.urlDecode = (state, key, val) => val.replace('+', ' ')
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=a+b&x=c+de');
            assert.strictEqual(data.x[0], 'a b');
            assert.strictEqual(data.x[1], 'c de');
            assert.strictEqual(data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['a b', 'c de'] }), '/?x=a+b&x=c+de');
        });
    });

    describe('No Param Array Query String Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaultTypes: { x: 'stringarray' } }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val, queryString) => {
                return queryString ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.urlDecode = (state, key, val, queryString) => {
                return queryString ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=a+b&x=c+de');
            assert.strictEqual(data.x[0], 'a b');
            assert.strictEqual(data.x[1], 'c de');
            assert.strictEqual(data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['a b', 'c de'] }), '/?x=a+b&x=c+de');
        });
    });

    describe('No Param Array Key Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '', defaultTypes: { x: 'stringarray', y: 'stringarray' } }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => {
                return key === 'x' ? val.replace(' ', '+') : encodeURIComponent(val);
            }
            state.urlDecode = (state, key, val) => {
                return key === 'x' ? val.replace('+', ' ') : decodeURIComponent(val);
            }
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/?x=a+b&x=c+de&y=f%20g');
            assert.strictEqual(data.x[0], 'a b');
            assert.strictEqual(data.x[1], 'c de');
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.y[0], 'f g');
            assert.strictEqual(data.y.length, 1);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['a b', 'c de'], y: ['f g'] }), '/?x=a+b&x=c+de&y=f%20g');
        });
    });

    describe('No Param One Segment Array State Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'a', defaultTypes: { x: 'stringarray' } },
                { key: 's1', route: 'b', defaultTypes: { x: 'stringarray' } }
            ]);
            for(var key in stateNavigator.states) {
                var state = stateNavigator.states[key];
                state.urlEncode = (state, key, val) => {
                    return state.key == 's0' ? val.replace(' ', '+') : encodeURIComponent(val);
                }
                state.urlDecode = (state, key, val) => {
                    return state.key == 's0' ? val.replace('+', ' ') : decodeURIComponent(val);
                }
            }
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a?x=a+b&x=c+de');
            assert.strictEqual(data.x[0], 'a b');
            assert.strictEqual(data.x[1], 'c de');
            assert.strictEqual(data.x.length, 2);
            var { data } = stateNavigator.parseLink('/b?x=a%20b&x=c%20de');
            assert.strictEqual(data.x[0], 'a b');
            assert.strictEqual(data.x[1], 'c de');
            assert.strictEqual(data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s0', { x: ['a b', 'c de'] }), '/a?x=a+b&x=c+de');
            assert.strictEqual(stateNavigator.getNavigationLink('s1', { x: ['a b', 'c de'] }), '/b?x=a%20b&x=c%20de');
        });
    });

    describe('One Optional Empty Param Route Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val.replace(' ', '+')
            state.urlDecode = (state, key, val) => val.replace('+', ' ')
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(data.x, undefined);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
        });
    });

    describe('One Empty Param Route Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val.replace(' ', '+')
            state.urlDecode = (state, key, val) => val.replace('+', ' ')
        });
        
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('One Empty Mixed Param Route Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab{x}' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val.replace(' ', '+')
            state.urlDecode = (state, key, val) => val.replace('+', ' ')
        });
        
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('Query String Blank Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => (key === 'y' && val === 'cd') ? '' : val
            state.urlDecode = (state, key, val) => (key === 'y' && val === '') ? 'cd' : val
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab?y');
            assert.strictEqual(data.y, 'cd');
            var { data } = stateNavigator.parseLink('/ab?y=efg');
            assert.strictEqual(data.y, 'efg');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'cd' }), '/ab?y');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'efg' }), '/ab?y=efg');
        });
    });

    describe('Query String Null Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val === 'cd' ? null : val
            state.urlDecode = (state, key, val) => val === ''? 'cd' : val
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab?y');
            assert.strictEqual(data.y, 'cd');
            var { data } = stateNavigator.parseLink('/ab?y=efg');
            assert.strictEqual(data.y, 'efg');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'cd' }), '/ab?y');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'efg' }), '/ab?y=efg');
        });
    });

    describe('Query String Undefined Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val === 'cd' ? undefined : val
            state.urlDecode = (state, key, val) => val === ''? 'cd' : val
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab?y');
            assert.strictEqual(data.y, 'cd');
            var { data } = stateNavigator.parseLink('/ab?y=efg');
            assert.strictEqual(data.y, 'efg');
            var { data } = stateNavigator.parseLink('/ab?x=efg&y');
            assert.strictEqual(data.x, 'efg');
            assert.strictEqual(data.y, 'cd');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'cd' }), '/ab?y');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'efg' }), '/ab?y=efg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'efg', y: 'cd' }), '/ab?x=efg&y');
        });
    });

    describe('Query String Default Type Boolean Blank Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab', defaultTypes: { x: 'boolean' } }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val === 'true' ? '' : val
            state.urlDecode = (state, key, val) => val === '' ? 'true' : val
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab?x');
            assert.strictEqual(data.x, true);
            var { data } = stateNavigator.parseLink('/ab?x=false');
            assert.strictEqual(data.x, false);
            var { data } = stateNavigator.parseLink('/ab?x&y=cd');
            assert.strictEqual(data.x, true);
            assert.strictEqual(data.y, 'cd');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: true }), '/ab?x');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: false }), '/ab?x=false');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: true, y: 'cd' }), '/ab?x&y=cd');
        });
    });

    describe('Query String Default Type Number Array Blank Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab', defaultTypes: { x: 'numberarray' } }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val === '3' ? '' : val
            state.urlDecode = (state, key, val) => val === '' ? '3' : val
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab?x');
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 3);
            var { data } = stateNavigator.parseLink('/ab?x=1');
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 1);
            var { data } = stateNavigator.parseLink('/ab?x&x=1');
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 3);
            assert.strictEqual(data.x[1], 1);
            var { data } = stateNavigator.parseLink('/ab?x=1&x');
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 1);
            assert.strictEqual(data.x[1], 3);
            var { data } = stateNavigator.parseLink('/ab?x=1&x&x=2&x');
            assert.strictEqual(data.x.length, 4);
            assert.strictEqual(data.x[0], 1);
            assert.strictEqual(data.x[1], 3);
            assert.strictEqual(data.x[2], 2);
            assert.strictEqual(data.x[3], 3);
            var { data } = stateNavigator.parseLink('/ab?x&y=cd');
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 3);
            assert.strictEqual(data.y, 'cd');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [3] }), '/ab?x');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [1] }), '/ab?x=1');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [3, 1] }), '/ab?x&x=1');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [1, 3] }), '/ab?x=1&x');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [1, 3, 2, 3] }), '/ab?x=1&x&x=2&x');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [3], y: 'cd' }), '/ab?x&y=cd');
        });
    });

    describe('Query String Default Boolean Blank Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab', defaults: { x: false } }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val === 'true' ? '' : val
            state.urlDecode = (state, key, val) => val === '' ? 'true' : val
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab?x');
            assert.strictEqual(data.x, true);
            var { data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(data.x, false);
            var { data } = stateNavigator.parseLink('/ab?x&y=cd');
            assert.strictEqual(data.x, true);
            assert.strictEqual(data.y, 'cd');
            var { data } = stateNavigator.parseLink('/ab?y=cd');
            assert.strictEqual(data.x, false);
            assert.strictEqual(data.y, 'cd');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: true }), '/ab?x');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: false }), '/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: true, y: 'cd' }), '/ab?x&y=cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: false, y: 'cd' }), '/ab?y=cd');
        });
    });

    describe('Param Blank Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val === 'cd' ? '' : val
            state.urlDecode = (state, key, val) => val === '' ? 'cd' : val
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/efg');
            assert.strictEqual(data.x, 'efg');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'efg' }), '/efg');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd' }), null);
        });
    });

    describe('Param Blank Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val === 'cd' ? '' : val
            state.urlDecode = (state, key, val) => val === '' ? 'cd' : val
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/efg');
            assert.strictEqual(data.x, 'efg');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'efg' }), '/efg');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd' }), null);
        });
    });

    describe('Optional Param Blank Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val === 'cd' ? '' : val
            state.urlDecode = (state, key, val) => val === '' ? 'cd' : val
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/efg');
            assert.strictEqual(data.x, 'efg');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'efg' }), '/efg');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd' }), null);
        });
    });

    describe('Optional Param Null Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val === 'cd' ? null : val
            state.urlDecode = (state, key, val) => val === '' ? 'cd' : val
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/efg');
            assert.strictEqual(data.x, 'efg');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'efg' }), '/efg');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd' }), null);
        });
    });

    describe('Optional Param Undefined Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x?}' }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val === 'cd' ? undefined : val
            state.urlDecode = (state, key, val) => val === '' ? 'cd' : val
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/efg');
            assert.strictEqual(data.x, 'efg');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'efg' }), '/efg');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd' }), null);
        });
    });

    describe('Optional Splat Param Blank Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x?}', defaultTypes: { x: 'stringarray' } }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val === 'cd' ? '' : val
            state.urlDecode = (state, key, val) => val === '' ? 'cd' : val
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/efg');
            assert.strictEqual(data.x[0], 'efg');
            assert.strictEqual(data.x.length, 1);
            var { data } = stateNavigator.parseLink('/efg/hi');
            assert.strictEqual(data.x[0], 'efg');
            assert.strictEqual(data.x[1], 'hi');
            assert.strictEqual(data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['efg'] }), '/efg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['efg', 'hi'] }), '/efg/hi');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd'] }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['efg', 'cd'] }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd', 'efg'] }), null);
        });
    });

    describe('Query String Default Type Number Array Index Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab', defaultTypes: { x: 'numberarray' } }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val, queryString, index) => (!key && val === 'x') ? `x[${index}]` : val
            state.urlDecode = (state, key, val) => (!key && val.indexOf('x') === 0)  ? 'x' : val
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab?x[0]=2');
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 2);
            var { data } = stateNavigator.parseLink('/ab?x[0]=2&x[1]=1');
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 2);
            assert.strictEqual(data.x[1], 1);
            var { data } = stateNavigator.parseLink('/ab?x[0]=3&y=cd');
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 3);
            assert.strictEqual(data.y, 'cd');
            var { data } = stateNavigator.parseLink('/ab?x[0]=2&x[1]=1&y=cd');
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 2);
            assert.strictEqual(data.x[1], 1);
            assert.strictEqual(data.y, 'cd');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [2] }), '/ab?x[0]=2');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [2, 1] }), '/ab?x[0]=2&x[1]=1');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [3], y: 'cd' }), '/ab?x[0]=3&y=cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [2, 1], y: 'cd' }), '/ab?x[0]=2&x[1]=1&y=cd');
        });
    });

    describe('Query String Default Type Number Array Blank Index Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab', defaultTypes: { x: 'numberarray' } }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val, queryString, index) => !key ? `x[${index}]` : (val === '3' ? '' : val)
            state.urlDecode = (state, key, val) => !key  ? 'x' : (val === '' ? '3' : val)
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab?x[0]');
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 3);
            var { data } = stateNavigator.parseLink('/ab?x[0]=2&x[1]');
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 2);
            assert.strictEqual(data.x[1], 3);
            var { data } = stateNavigator.parseLink('/ab?x[0]&x[1]=2');
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 3);
            assert.strictEqual(data.x[1], 2);
            var { data } = stateNavigator.parseLink('/ab?x[0]=2&x[1]&x[2]=1&x[3]');
            assert.strictEqual(data.x.length, 4);
            assert.strictEqual(data.x[0], 2);
            assert.strictEqual(data.x[1], 3);
            assert.strictEqual(data.x[2], 1);
            assert.strictEqual(data.x[3], 3);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [3] }), '/ab?x[0]');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [2, 3] }), '/ab?x[0]=2&x[1]');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [3, 2] }), '/ab?x[0]&x[1]=2');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [2, 3, 1, 3] }), '/ab?x[0]=2&x[1]&x[2]=1&x[3]');
        });
    });

    describe('One Splat Param One Segment Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x}', defaultTypes: { x: 'stringarray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abcd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'abcd');
            var { data } = stateNavigator.parseLink('/ab/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'ab');
            assert.strictEqual(data.x[1], 'cd');
            var { data } = stateNavigator.parseLink('/ab/cd?y=efg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'ab');
            assert.strictEqual(data.x[1], 'cd');
            assert.strictEqual(data.y, 'efg');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab//cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ab/cd/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ab'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['abcd'] }), '/abcd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ab', 'cd'] }), '/ab/cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ab', 'cd'], y: 'efg' }), '/ab/cd?y=efg');
        });
        
        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: [''] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: [null] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: [undefined] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: ['ab', '', 'cd'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: ['', 'ab', 'cd'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: ['ab', 'cd', ''] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: ['ab', null, 'cd'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: [null, 'ab', 'cd'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: ['ab', 'cd', null] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: ['ab', undefined, 'cd'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: [undefined, 'ab', 'cd'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: ['ab', 'cd', undefined] }));
        });
    });

    describe('One Splat Param One Segment Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x}', defaults: { x: ['ef', 'ghi'] } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ef/ghi');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'ef');
            assert.strictEqual(data.x[1], 'ghi');
            var { data } = stateNavigator.parseLink('/abcd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'abcd');
            var { data } = stateNavigator.parseLink('/ab/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'ab');
            assert.strictEqual(data.x[1], 'cd');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ef/ghi/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ab/cd/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ab'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/ef/ghi');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['abcd'] }), '/abcd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ab', 'cd'] }), '/ab/cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ef', 'ghi'] }), '/ef/ghi');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ghi', 'ef'] }), '/ghi/ef');
        });
    });

    describe('One Optional Splat Param One Segment Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x?}', defaults: { x: ['ef', 'ghi'] } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'ef');
            assert.strictEqual(data.x[1], 'ghi');
            var { data } = stateNavigator.parseLink('/abcd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'abcd');
            var { data } = stateNavigator.parseLink('/ab/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'ab');
            assert.strictEqual(data.x[1], 'cd');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('//ab/cd/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ef/ghi/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['abcd'] }), '/abcd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ab', 'cd'] }), '/ab/cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ef', 'ghi'] }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ghi', 'ef'] }), '/ghi/ef');
        });
    });
    
    describe('One Optional Splat Param One Segment Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x?}', defaultTypes: { x: 'stringarray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/abcd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'abcd');
            var { data } = stateNavigator.parseLink('/ab/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'ab');
            assert.strictEqual(data.x[1], 'cd');
            var { data } = stateNavigator.parseLink('/ab/cd?y=efg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'ab');
            assert.strictEqual(data.x[1], 'cd');
            assert.strictEqual(data.y, 'efg');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ab//cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd//'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//'), /The Url .+ is invalid/);
        });
        
        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [] }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['abcd'] }), '/abcd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ab', 'cd'] }), '/ab/cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ab', 'cd'], y: 'efg' }), '/ab/cd?y=efg');
        });
        
        it('should not build', function() {
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: [''] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: [null] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: [undefined] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: ['ab', '', 'cd'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: ['', 'ab', 'cd'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: ['ab', 'cd', ''] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: ['ab', null, 'cd'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: [null, 'ab', 'cd'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: ['ab', 'cd', null] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: ['ab', undefined, 'cd'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: [undefined, 'ab', 'cd'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: ['ab', 'cd', undefined] }));
        });
    });

    describe('One Splat Param Two Segment Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{*x}', defaultTypes: { x: 'stringarray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'cd');
            var { data } = stateNavigator.parseLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'cd');
            assert.strictEqual(data.x[1], 'efg');
            var { data } = stateNavigator.parseLink('/ab/cd/efg?y=hi');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'cd');
            assert.strictEqual(data.x[1], 'efg');
            assert.strictEqual(data.y, 'hi');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd//efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab//cd/efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd/efg//'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd'] }), '/ab/cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd', 'efg'] }), '/ab/cd/efg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd', 'efg'], y: 'hi' }), '/ab/cd/efg?y=hi');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: ['cd', null, 'efg'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: [null, 'cd', 'efg'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: ['cd', 'efg', null] }));
        });
    });

    describe('One Splat Param Two Segment Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{*x?}', defaults: { x: ['ef', 'ghi'] } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'ef');
            assert.strictEqual(data.x[1], 'ghi');
            var { data } = stateNavigator.parseLink('/ab/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'cd');
            var { data } = stateNavigator.parseLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'cd');
            assert.strictEqual(data.x[1], 'efg');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd'] }), '/ab/cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd', 'efg'] }), '/ab/cd/efg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ef', 'ghi'] }), '/ab');
        });
    });

    describe('Two Param One Splat Two Segment Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}/{*y}', defaultTypes: { y: 'stringarray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/cd');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.y.length, 1);
            assert.strictEqual(data.y[0], 'cd');
            var { data } = stateNavigator.parseLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.y.length, 2);
            assert.strictEqual(data.y[0], 'cd');
            assert.strictEqual(data.y[1], 'efg');
            var { data } = stateNavigator.parseLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.y.length, 2);
            assert.strictEqual(data.y[0], 'cd');
            assert.strictEqual(data.y[1], 'efg');
            assert.strictEqual(data.z, 'hi');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd//efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab//cd/efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd/efg//'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab', y: ['cd'] }), '/ab/cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab', y: ['cd', 'efg'] }), '/ab/cd/efg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab', y: ['cd', 'efg'], z: 'hi' }), '/ab/cd/efg?z=hi');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab' }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: ['cd'] }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: ['cd', 'efg'] }), null);
            assert.throws(() => stateNavigator.getNavigationLink('s', { y: ['cd', null, 'efg'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { y: [null, 'cd', 'efg'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { y: ['cd', 'efg', null] }));
        });
    });

    describe('Two Param One Optional Splat Two Segment Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{x}/{*y?}', defaultTypes: { y: 'stringarray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            var { data } = stateNavigator.parseLink('/ab/cd');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.y.length, 1);
            assert.strictEqual(data.y[0], 'cd');
            var { data } = stateNavigator.parseLink('/ab/cd/efg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.y.length, 2);
            assert.strictEqual(data.y[0], 'cd');
            assert.strictEqual(data.y[1], 'efg');
            var { data } = stateNavigator.parseLink('/ab/cd/efg?z=hi');
            assert.strictEqual(Object.keys(data).length, 3);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.y.length, 2);
            assert.strictEqual(data.y[0], 'cd');
            assert.strictEqual(data.y[1], 'efg');
            assert.strictEqual(data.z, 'hi');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd//efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab//cd/efg'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd/efg//'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab' }), '/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab', y: ['cd'] }), '/ab/cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab', y: ['cd', 'efg'] }), '/ab/cd/efg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab', y: ['cd', 'efg'], z: 'hi' }), '/ab/cd/efg?z=hi');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: ['cd'] }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: ['cd', 'efg'] }), null);
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: 'ab', y: ['cd', null, 'efg'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: 'ab', y: [null, 'cd', 'efg'] }));
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: 'ab', y: ['cd', 'efg', null] }));
        });
    });

    describe('Two Splat Param Three Segment Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x}/ab/{*y}', defaultTypes: { x: 'stringarray', y: 'stringarray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/cd/ab/efg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'cd');
            assert.strictEqual(data.y.length, 1);
            assert.strictEqual(data.y[0], 'efg');
            var { data } = stateNavigator.parseLink('/cd/efg/ab/hi');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'cd');
            assert.strictEqual(data.x[1], 'efg');
            assert.strictEqual(data.y.length, 1);
            assert.strictEqual(data.y[0], 'hi');
            var { data } = stateNavigator.parseLink('/cd/ab/efg/hi');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'cd');
            assert.strictEqual(data.y.length, 2);
            assert.strictEqual(data.y[0], 'efg');
            assert.strictEqual(data.y[1], 'hi');
            var { data } = stateNavigator.parseLink('/cd/efg/ab/hij/kl');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'cd');
            assert.strictEqual(data.x[1], 'efg');
            assert.strictEqual(data.y.length, 2);
            assert.strictEqual(data.y[0], 'hij');
            assert.strictEqual(data.y[1], 'kl');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/cd/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/cd/efg/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('//cd/ab/efg//'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd'], y: ['efg'] }), '/cd/ab/efg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd', 'efg'], y: ['hi'] }), '/cd/efg/ab/hi');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd'], y: ['efg', 'hi'] }), '/cd/ab/efg/hi');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd', 'efg'], y: ['hij', 'kl'] }), '/cd/efg/ab/hij/kl');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd'] }), null);
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: ['cd'] }), null);
            assert.throws(() => stateNavigator.getNavigationLink('s', { x: [null, 'cd'], y: ['efg', null] }));
        });
    });
    
    describe('Two Route Param Splat and Not Splat', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: ['a/{*x}', 'b/{x}/{y}'], defaultTypes: { x: 'stringarray' } }
            ]);
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a/cd/efg');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'cd');
            assert.strictEqual(data.x[1], 'efg');
            var { data } = stateNavigator.parseLink('/a/cd1_0');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            var { data } = stateNavigator.parseLink('/b/cd1_0/efg');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y, 'efg');
            var { data } = stateNavigator.parseLink('/b/cd1-efg/hi');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'cd');
            assert.strictEqual(data.x[1], 'efg');
            assert.strictEqual(data.y, 'hi');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd', 'efg'] }), '/a/cd/efg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd' }), '/a/cd1_0');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: 'efg' }), '/b/cd1_0/efg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd', 'efg'], y: 'hi' }), '/b/cd1-efg/hi');
        });
    })
    
    describe('Expand Param Splat and Not Splat', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'a/{x}+/b/{*y}', defaultTypes: { y: 'stringarray' } }
            ]);
        });
        
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            var { data } = stateNavigator.parseLink('/a/cd/b/ef');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y.length, 1);
            assert.strictEqual(data.y[0], 'ef');
            var { data } = stateNavigator.parseLink('/a/cd/b/ef/ghi');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(data.y.length, 2);
            assert.strictEqual(data.y[0], 'ef');
            assert.strictEqual(data.y[1], 'ghi');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/a'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/a/cd/b'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd' }), '/a/cd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: ['ef'] }), '/a/cd/b/ef');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'cd', y: ['ef', 'ghi'] }), '/a/cd/b/ef/ghi');
        });
    })

    describe('One Splat Param Two Segment Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x}/ab', defaults: { x: ['cde', 'fg'] } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/cd/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'cd');
            var { data } = stateNavigator.parseLink('/cd/efg/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'cd');
            assert.strictEqual(data.x[1], 'efg');
            var { data } = stateNavigator.parseLink('/cde/fg/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'cde');
            assert.strictEqual(data.x[1], 'fg');
            var { data } = stateNavigator.parseLink('/cde1-fg/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'cde1-fg');
            var { data } = stateNavigator.parseLink('/true1_1/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, true);
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/cd'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/cde/fg/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd'] }), '/cd/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd', 'efg'] }), '/cd/efg/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cde', 'fg'] }), '/cde/fg/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cde1-fg'] }), '/cde1-fg/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: true }), '/true1_1/ab');
        });
    });

    describe('One Splat Param One Mixed Segment Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab{*x}', defaults: { x: ['cde', 'fg'] } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abcde/fg');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'cde');
            assert.strictEqual(data.x[1], 'fg');
            var { data } = stateNavigator.parseLink('/abcd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'cd');
            var { data } = stateNavigator.parseLink('/abcd/efg');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'cd');
            assert.strictEqual(data.x[1], 'efg');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/acd'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/abcde/fg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cde', 'fg'] }), '/abcde/fg');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd'] }), '/abcd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd', 'efg'] }), '/abcd/efg');
        });
    });

    describe('One Optional Splat Param One Mixed Segment Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab{*x?}', defaults: { x: ['cde', 'fg'] } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'cde');
            assert.strictEqual(data.x[1], 'fg');
            var { data } = stateNavigator.parseLink('/abcde/fg');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'cde');
            assert.strictEqual(data.x[1], 'fg');
            var { data } = stateNavigator.parseLink('/abcd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'cd');
            var { data } = stateNavigator.parseLink('/abcd/efg');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'cd');
            assert.strictEqual(data.x[1], 'efg');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/acd'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cde', 'fg'] }), '/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd'] }), '/abcd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['cd', 'efg'] }), '/abcd/efg');
        });
    });

    describe('Without Types Splat Conflicting Default And Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x?}', trackTypes: false, defaults: { x: ['a', 'bc'] }, defaultTypes: { x: 'number' } }
            ]);
        });
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'a');
            assert.strictEqual(data.x[1], 'bc');
            var { data } = stateNavigator.parseLink('/a/bc');
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'a');
            assert.strictEqual(data.x[1], 'bc');
            var { data } = stateNavigator.parseLink('/3');
            assert.strictEqual(data.x, 3);
        });
        
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/1/2'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['a', 'bc'] }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3 }), '/3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '3' }), '/3');
        });
    });

    describe('Without Types Splat Conflicting Single Array Default And Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x?}', trackTypes: false, defaults: { x: ['a'] }, defaultTypes: { x: 'number' } }
            ]);
        });
        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'a');
            var { data } = stateNavigator.parseLink('/a');
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'a');
            var { data } = stateNavigator.parseLink('/3');
            assert.strictEqual(data.x, 3);
        });
        
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/b'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/1/2'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['a'] }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 3 }), '/3');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: '3' }), '/3');
        });
    });

    describe('One Splat Param One Segment Single Match Array Default', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x}', defaults: { x: ['a', 'b'] } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'ab');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ab'] }), '/ab');
        });
    });

    describe('Splat Param Array Encode', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x}', defaultTypes: { x: 'stringarray' } }
            ]);
            var state = stateNavigator.states['s'];
            state.urlEncode = (state, key, val) => val.replace(' ', '+')
            state.urlDecode = (state, key, val) => val.replace('+', ' ')
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a+b/c+de');
            assert.strictEqual(data.x[0], 'a b');
            assert.strictEqual(data.x[1], 'c de');
            assert.strictEqual(data.x.length, 2);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['a b', 'c de'] }), '/a+b/c+de');
        });
    });

    describe('One Splat Param One Segment Default Type Number Array', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x}', defaultTypes: { x: 'numberarray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/123');
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 123);
            var { data } = stateNavigator.parseLink('/12/345/67');
            assert.strictEqual(data.x.length, 3);
            assert.strictEqual(data.x[0], 12);
            assert.strictEqual(data.x[1], 345);
            assert.strictEqual(data.x[2], 67);
            var { data } = stateNavigator.parseLink('/ab1_0');
            assert.strictEqual(data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [123] }), '/123');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [12, 345, 67] }), '/12/345/67');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab' }), '/ab1_0');
        });
    });

    describe('One Splat Param One Segment Default Type Booelan Array', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x}', defaultTypes: { x: 'booleanarray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/true');
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], true);
            var { data } = stateNavigator.parseLink('/true/false/true');
            assert.strictEqual(data.x.length, 3);
            assert.strictEqual(data.x[0], true);
            assert.strictEqual(data.x[1], false);
            assert.strictEqual(data.x[2], true);
            var { data } = stateNavigator.parseLink('/ab1_0');
            assert.strictEqual(data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [true] }), '/true');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [true, false, true] }), '/true/false/true');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab' }), '/ab1_0');
        });
    });

    describe('One Splat Param One Segment Default Type Date Array', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x}', defaultTypes: { x: 'datearray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/2010-04-07');
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(+data.x[0], +new Date(2010, 3, 7));
            var { data } = stateNavigator.parseLink('/2010-04-07/2011-08-03');
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(+data.x[0], +new Date(2010, 3, 7));
            assert.strictEqual(+data.x[1], +new Date(2011, 7, 3));
            var { data } = stateNavigator.parseLink('/ab1_0');
            assert.strictEqual(data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [new Date(2010, 3, 7)] }), '/2010-04-07');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }), '/2010-04-07/2011-08-03');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab' }), '/ab1_0');
        });
    });

    describe('One Splat Param One Segment Default Date Array', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x?}', defaults: { x: [new Date(2011, 7, 3), new Date(2010, 3, 7)] } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/');
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(+data.x[0], +new Date(2011, 7, 3));
            assert.strictEqual(+data.x[1], +new Date(2010, 3, 7));
            var { data } = stateNavigator.parseLink('/2010-04-07');
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(+data.x[0], +new Date(2010, 3, 7));
            var { data } = stateNavigator.parseLink('/2010-04-07/2011-08-03');
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(+data.x[0], +new Date(2010, 3, 7));
            assert.strictEqual(+data.x[1], +new Date(2011, 7, 3));
            var { data } = stateNavigator.parseLink('/ab1_0');
            assert.strictEqual(data.x, 'ab');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [new Date(2011, 7, 3), new Date(2010, 3, 7)] }), '/');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [new Date(2010, 3, 7)] }), '/2010-04-07');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: [new Date(2010, 3, 7), new Date(2011, 7, 3)] }), '/2010-04-07/2011-08-03');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab' }), '/ab1_0');
        });
    });

    describe('Multiple Routes Splat and Not Splat', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{*x}', defaultTypes: { x: 'stringarray' } },
                { key: 's1', route: 'cd/{x}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/ef');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'ef');
            var { data } = stateNavigator.parseLink('/ab/ef/gh');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'ef');
            assert.strictEqual(data.x[1], 'gh');
            var { data } = stateNavigator.parseLink('/cd/ef');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ef');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/aa/bbb'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/cd/ef/gh'), /The Url .+ is invalid/);
        });
    });

    describe('One Splat Param One Segment', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abcd');
            assert.strictEqual(data.x, 'abcd');
            var { data } = stateNavigator.parseLink('/1231_2');
            assert.strictEqual(data.x, 123);
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'abcd' }), '/abcd');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 123 }), '/1231_2');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });

    describe('One Splat Param One Query String Default Type', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '{*x}', defaultTypes: { x: 'stringarray', y: 'stringarray' } }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/ab/cde?y=fgh&y=ij');
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'ab');
            assert.strictEqual(data.x[1], 'cde');
            assert.strictEqual(data.y.length, 2);
            assert.strictEqual(data.y[0], 'fgh');
            assert.strictEqual(data.y[1], 'ij');
            var { data } = stateNavigator.parseLink('/ab?y=fgh&y=ij');
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'ab');
            assert.strictEqual(data.y.length, 2);
            assert.strictEqual(data.y[0], 'fgh');
            assert.strictEqual(data.y[1], 'ij');
            var { data } = stateNavigator.parseLink('/ab/cde?y=fgh');
            assert.strictEqual(data.x.length, 2);
            assert.strictEqual(data.x[0], 'ab');
            assert.strictEqual(data.x[1], 'cde');
            assert.strictEqual(data.y.length, 1);
            assert.strictEqual(data.y[0], 'fgh');
            var { data } = stateNavigator.parseLink('/ab?y=fgh');
            assert.strictEqual(data.x.length, 1);
            assert.strictEqual(data.x[0], 'ab');
            assert.strictEqual(data.y.length, 1);
            assert.strictEqual(data.y[0], 'fgh');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ab', 'cde'], y: ['fgh', 'ij'] }), '/ab/cde?y=fgh&y=ij');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ab'], y: ['fgh', 'ij'] }), '/ab?y=fgh&y=ij');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ab', 'cde'], y: ['fgh'] }), '/ab/cde?y=fgh');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: ['ab'], y: ['fgh'] }), '/ab?y=fgh');
        });
    });

    describe('Reload Param', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'ab/{x}' }
            ]);
            stateNavigator.configure([
                { key: 's', route: 'cd/{x}' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/cd/efg');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'efg');
        });
        
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ab/cde'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'efg' }), '/cd/efg');
        });
    });

    describe('Two Controllers Param', function () {
        var stateNavigator0: StateNavigator;
        var stateNavigator1: StateNavigator;
        beforeEach(function () {
            stateNavigator0 = new StateNavigator([
                { key: 's', route: 'ab/{x}' }
            ]);
            stateNavigator1 = new StateNavigator([
                { key: 's', route: 'cd/{x}' }
            ]);
        });

        it('should match', function() {
            stateNavigator0.navigateLink('/ab/cde');
            assert.strictEqual(Object.keys(stateNavigator0.stateContext.data).length, 1);
            assert.strictEqual(stateNavigator0.stateContext.data.x, 'cde');
            stateNavigator1.navigateLink('/cd/efg');
            assert.strictEqual(Object.keys(stateNavigator1.stateContext.data).length, 1);
            assert.strictEqual(stateNavigator1.stateContext.data.x, 'efg');
        });
        
        it('should not match', function() {
            assert.throws(() => stateNavigator0.navigateLink('/cd/efg'), /Url .*is invalid/, '');
            assert.throws(() => stateNavigator1.navigateLink('/ab/cde'), /Url .*is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator0.getNavigationLink('s', { x: 'cde' }), '/ab/cde');
            assert.strictEqual(stateNavigator1.getNavigationLink('s', { x: 'efg' }), '/cd/efg');
        });
    });

    describe('Two Controllers Param Default', function () {
        var stateNavigator0: StateNavigator;
        var stateNavigator1: StateNavigator;
        beforeEach(function () {
            stateNavigator0 = new StateNavigator([
                { key: 's', route: 'ab/{x?}', defaults: { x: 'cd' } }
            ]);
            stateNavigator1 = new StateNavigator([
                { key: 's', route: 'cd/{x?}', defaults: { x: 12 } }
            ]);
        });

        it('should match', function() {
            stateNavigator0.navigateLink('/ab');
            assert.strictEqual(Object.keys(stateNavigator0.stateContext.data).length, 1);
            assert.strictEqual(stateNavigator0.stateContext.data.x, 'cd');
            stateNavigator0.navigateLink('/ab/1');
            assert.strictEqual(Object.keys(stateNavigator0.stateContext.data).length, 1);
            assert.strictEqual(stateNavigator0.stateContext.data.x, '1');
            stateNavigator1.navigateLink('/cd');
            assert.strictEqual(Object.keys(stateNavigator1.stateContext.data).length, 1);
            assert.strictEqual(stateNavigator1.stateContext.data.x, 12);
            stateNavigator1.navigateLink('/cd/1');
            assert.strictEqual(Object.keys(stateNavigator1.stateContext.data).length, 1);
            assert.strictEqual(stateNavigator1.stateContext.data.x, 1);         
        });
        
        it('should not match', function() {
            assert.throws(() => stateNavigator0.navigateLink('/cd'), /Url .*is invalid/, '');
            assert.throws(() => stateNavigator1.navigateLink('/ab'), /Url .*is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator0.getNavigationLink('s', { x: 'cd' }), '/ab');
            assert.strictEqual(stateNavigator0.getNavigationLink('s', { x: '1' }), '/ab/1');
            assert.strictEqual(stateNavigator1.getNavigationLink('s', { x: 12 }), '/cd');
            assert.strictEqual(stateNavigator1.getNavigationLink('s', { x: 1 }), '/cd/1');
        });
    });

    describe('Two Controllers Param Default Type', function () {
        var stateNavigator0: StateNavigator;
        var stateNavigator1: StateNavigator;
        beforeEach(function () {
            stateNavigator0 = new StateNavigator([
                { key: 's', route: 'ab/{x}' }
            ]);
            stateNavigator1 = new StateNavigator([
                { key: 's', route: 'cd/{x}', defaultTypes: { x: 'number' } }
            ]);
        });

        it('should match', function() {
            stateNavigator0.navigateLink('/ab/1');
            assert.strictEqual(Object.keys(stateNavigator0.stateContext.data).length, 1);
            assert.strictEqual(stateNavigator0.stateContext.data.x, '1');
            stateNavigator1.navigateLink('/cd/1');
            assert.strictEqual(Object.keys(stateNavigator1.stateContext.data).length, 1);
            assert.strictEqual(stateNavigator1.stateContext.data.x, 1);
        });
        
        it('should not match', function() {
            assert.throws(() => stateNavigator0.navigateLink('/cd/1'), /Url .*is invalid/, '');
            assert.throws(() => stateNavigator1.navigateLink('/ab/1'), /Url .*is invalid/, '');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator0.getNavigationLink('s', { x: '1' }), '/ab/1');
            assert.strictEqual(stateNavigator1.getNavigationLink('s', { x: 1 }), '/cd/1');
        });
    });

    describe('Two Controllers Param Encode', function () {
        var stateNavigator0: StateNavigator;
        var stateNavigator1: StateNavigator;
        beforeEach(function () {
            stateNavigator0 = new StateNavigator([
                { key: 's', route: '0/{x}' }
            ]);
            var state = stateNavigator0.states['s'];
            state.urlEncode = (state, key, val) => val.replace(' ', '0')  
            state.urlDecode = (state, key, val) => val.replace('0', ' ')  
            stateNavigator1 = new StateNavigator([
                { key: 's', route: '1/{x}' }
            ]);
            var state = stateNavigator1.states['s'];
            state.urlEncode = (state, key, val) => val.replace(' ', '1')  
            state.urlDecode = (state, key, val) => val.replace('1', ' ')  
        });

        it('should match', function() {
            stateNavigator0.navigateLink('/0/a0b');
            assert.strictEqual(stateNavigator0.stateContext.data.x, 'a b');
            stateNavigator1.navigateLink('/1/a1b');
            assert.strictEqual(stateNavigator1.stateContext.data.x, 'a b');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator0.getNavigationLink('s', { x: 'a b' }), '/0/a0b');
            assert.strictEqual(stateNavigator1.getNavigationLink('s', { x: 'a b' }), '/1/a1b');
        });
    });

    describe('Leading and Trailing Slash', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '/a/{x}/' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/a/b');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'b');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'b' }), '/a/b');
        });
    });

    describe('Expand Route Leading and Trailing Slash', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: '/abc/+{x}/+def/{y}/' }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc');
            assert.strictEqual(Object.keys(data).length, 0);
            var { data } = stateNavigator.parseLink('/abc/de');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'de');
            var { data } = stateNavigator.parseLink('/abc/de/def/gh');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'de');
            assert.strictEqual(data.y, 'gh');
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), '/abc');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de' }), '/abc/de');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'de', y: 'gh' }), '/abc/de/def/gh');
        });
    });

    describe('Expand and Two Route', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: ['abc/{x}+/def/{y}', 'ghi/{y}'] }
            ]);
        });

        it('should match', function() {
            var { data } = stateNavigator.parseLink('/abc/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            var { data } = stateNavigator.parseLink('/abc/ab/def/de');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.y, 'de');
            var { data } = stateNavigator.parseLink('/ghi/gh');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.y, 'gh');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc/ab/def'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ghi'), /The Url .+ is invalid/);
        });

        it('should build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab' }), '/abc/ab');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { x: 'ab', y: 'de' }), '/abc/ab/def/de');
            assert.strictEqual(stateNavigator.getNavigationLink('s', { y: 'gh' }), '/ghi/gh');
        });

        it('should not build', function() {
            assert.strictEqual(stateNavigator.getNavigationLink('s'), null);
        });
    });
    
    describe('Crumb Trail Malicious', function() {
        it ('should build', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: '{x}' },
                { key: 's1', route: 'ab/c', trackCrumbTrail: true }
            ]);
            stateNavigator.navigateLink('/ab/c?crumb=www.google.com');
            assert.strictEqual(stateNavigator.getNavigationBackLink(1), '/www.google.com');
        });
    });
    
    describe('Custom Crumb Trail Key Malicious', function() {
        it ('should build', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: '{x}' },
                { key: 's1', route: 'ab/c', trackCrumbTrail: 'xx' }
            ]);
            stateNavigator.navigateLink('/ab/c?xx=www.google.com');
            assert.strictEqual(stateNavigator.getNavigationBackLink(1), '/www.google.com');
        });
    });

    describe('Crumb Trail String Malicious', function() {
        it ('should build', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: '{x}' },
                { key: 's1', route: 'r/1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigateLink('/r/1?crumb=www.google.com');
            assert.strictEqual(stateNavigator.getNavigationBackLink(1), '/www.google.com');
        });
    });

    describe('Crumb Trail String Array Malicious', function() {
        it ('should not match', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: '{*x}/0', defaultTypes: { x: 'stringarray' } },
                { key: 's1', route: 'r/1', trackCrumbTrail: true }
            ]);
            assert.throws(() => stateNavigator.parseLink('/r/1?crumb=%2F%2Fwww.google.com/0'), /Url .*is invalid/);
        });
    });

    describe('Crumb Trail Blank', function() {
        it ('should not match', function() {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: '{x}' },
                { key: 's1', route: 'ab/c', trackCrumbTrail: true }
            ]);
            assert.throws(() => stateNavigator.parseLink('/ab/c?crumb=www.google.com&crumb='), /Url .*is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/c?crumb='), /Url .*is invalid/);
        });
    });
    
    describe('Param Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: '{x}' },
                { key: 's1', route: '{x}' }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x === 'ab';
            stateNavigator.states['s1'].validate = (data) => data.x === 'cd';
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's1');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ef'), /The Url .+ is invalid/);
        });
    });

    describe('Query String Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'abc' },
                { key: 's1', route: 'abc' }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x === 'ab';
            stateNavigator.states['s1'].validate = (data) => data.x === 'cd';
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/abc?x=ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/abc?x=cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's1');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc?x=ef'), /The Url .+ is invalid/);
        });
    });

    describe('Order Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: '{x}' },
                { key: 's1', route: '{x}' },
                { key: 's2', route: '{x}' }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x === 'ab';
            stateNavigator.states['s1'].validate = (data) => data.x === 'cd';
            stateNavigator.states['s2'].validate = (data) => data.x === 'ef';
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/ef');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ef');
            assert.strictEqual(state.key, 's2');
            var { state, data } = stateNavigator.parseLink('/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's1');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/gh'), /The Url .+ is invalid/);
        });
    });

    describe('Split Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: '{x}' },
                { key: 's1', route: 'a/{x}' },
                { key: 's2', route: '{x}' }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x === 'ab';
            stateNavigator.states['s2'].validate = (data) => data.x === 'cd';
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's2');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ef'), /The Url .+ is invalid/);
        });
    });

    describe('Param Default Type Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: '{x}', defaultTypes: { x: 'number' } },
                { key: 's1', route: '{x}', defaultTypes: { x: 'number' } }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x === 12;
            stateNavigator.states['s1'].validate = (data) => data.x === 34;
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/12');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 12);
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/34');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 34);
            assert.strictEqual(state.key, 's1');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/56'), /The Url .+ is invalid/);
        });
    });

    describe('Query String Default Type Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'abc', defaultTypes: { x: 'number' } },
                { key: 's1', route: 'abc', defaultTypes: { x: 'number' } }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x === 12;
            stateNavigator.states['s1'].validate = (data) => data.x === 34;
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/abc?x=12');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 12);
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/abc?x=34');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 34);
            assert.strictEqual(state.key, 's1');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc?x=56'), /The Url .+ is invalid/);
        });
    });

    describe('Param Default Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: '{x?}', defaults: { x: 12 } },
                { key: 's1', route: '{x?}', defaults: { x: 34 } }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x === 56;
            stateNavigator.states['s1'].validate = (data) => data.x === 34;
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 34);
            assert.strictEqual(state.key, 's1');
            var { state, data } = stateNavigator.parseLink('/56');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 56);
            assert.strictEqual(state.key, 's0');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/12'), /The Url .+ is invalid/);
        });
    });

    describe('Query String Default Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'abc', defaults: { x: 12 } },
                { key: 's1', route: 'abc', defaults: { x: 34 } }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x === 56;
            stateNavigator.states['s1'].validate = (data) => data.x === 34;
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/abc');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 34);
            assert.strictEqual(state.key, 's1');
            var { state, data } = stateNavigator.parseLink('/abc?x=56');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 56);
            assert.strictEqual(state.key, 's0');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc?x=12'), /The Url .+ is invalid/);
        });
    });

    describe('Splat Param Default Type Array Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: '{*x}', defaultTypes: { x: 'numberarray' } },
                { key: 's1', route: '{*x}', defaultTypes: { x: 'numberarray' } }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x[0] === 12;
            stateNavigator.states['s1'].validate = (data) => data.x[0] === 34;
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/12/34');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x[0], 12);
            assert.strictEqual(data.x[1], 34);
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/34/12');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x[0], 34);
            assert.strictEqual(data.x[1], 12);
            assert.strictEqual(state.key, 's1');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/56'), /The Url .+ is invalid/);
        });
    });

    describe('Query String Default Type Array Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'abc', defaultTypes: { x: 'numberarray' } },
                { key: 's1', route: 'abc', defaultTypes: { x: 'numberarray' } }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x[0] === 12;
            stateNavigator.states['s1'].validate = (data) => data.x[0] === 34;
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/abc?x=12&x=34');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x[0], 12);
            assert.strictEqual(data.x[1], 34);
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/abc?x=34&x=12');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x[0], 34);
            assert.strictEqual(data.x[1], 12);
            assert.strictEqual(state.key, 's1');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc?x=56'), /The Url .+ is invalid/);
        });
    });

    describe('Splat Param Default Array Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: '{*x?}', defaults: { x: [12, 34] } },
                { key: 's1', route: '{*x?}', defaults: { x: [34, 12] } }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x[0] === 56;
            stateNavigator.states['s1'].validate = (data) => data.x[0] === 34;
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x[0], 34);
            assert.strictEqual(data.x[1], 12);
            assert.strictEqual(state.key, 's1');
            var { state, data } = stateNavigator.parseLink('/56');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x[0], 56);
            assert.strictEqual(state.key, 's0');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/12'), /The Url .+ is invalid/);
        });
    });

    describe('Splat Query String Default Array Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'abc', defaults: { x: [12, 34] } },
                { key: 's1', route: 'abc', defaults: { x: [34, 12] } }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x[0] === 56;
            stateNavigator.states['s1'].validate = (data) => data.x[0] === 34;
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/abc');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x[0], 34);
            assert.strictEqual(data.x[1], 12);
            assert.strictEqual(state.key, 's1');
            var { state, data } = stateNavigator.parseLink('/abc?x=56');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x[0], 56);
            assert.strictEqual(state.key, 's0');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc?x=12'), /The Url .+ is invalid/);
        });
    });

    describe('Param and Query String Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: '{x}' },
                { key: 's1', route: 'ab' }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x === 'cd';
            stateNavigator.states['s1'].validate = (data) => data.y === 'cd';
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/ab?y=cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.y, 'cd');
            assert.strictEqual(state.key, 's1');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ef'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab?y=ef'), /The Url .+ is invalid/);
        });
    });

    describe('Expand Route Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'ab+/{x}' },
                { key: 's1', route: 'ab+/{x}' }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x === 'ab';
            stateNavigator.states['s1'].validate = (data) => !data.x || data.x === 'cd';
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 0);
            assert.strictEqual(state.key, 's1');
            var { state, data } = stateNavigator.parseLink('/ab/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/ab/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's1');
            var { state, data } = stateNavigator.parseLink('/ab?x=ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/ab?x=cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's1');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ab?x=ef'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/ef'), /The Url .+ is invalid/);
        });
    });

    describe('Two Route Param Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: ['{x}', 'ab/{x}'] },
                { key: 's1', route: ['{x}', 'ab/{x}'] }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x === 'ab';
            stateNavigator.states['s1'].validate = (data) => data.x === 'cd';
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's1');
            var { state, data } = stateNavigator.parseLink('/ab/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/ab/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's1');
        });
 
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ef'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/ef'), /The Url .+ is invalid/);
        });
   });

    describe('Two Route Query String Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: ['ab', 'ab/cd'] },
                { key: 's1', route: ['ab', 'ab/cd'] }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x === 'ab';
            stateNavigator.states['s1'].validate = (data) => data.x === 'cd';
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/ab?x=ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('ab?x=cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's1');
            var { state, data } = stateNavigator.parseLink('/ab/cd?x=ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/ab/cd?x=cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's1');
        });
 
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ab?x=ef'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd?x=ef'), /The Url .+ is invalid/);
        });
    });

    describe('Two Route Param and Query String Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: ['{x}', 'ab/cd'] },
                { key: 's1', route: ['{x}', 'ab/cd'] }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x === 'ab';
            stateNavigator.states['s1'].validate = (data) => data.x === 'cd';
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's1');
            var { state, data } = stateNavigator.parseLink('/ab/cd?x=ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/ab/cd?x=cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's1');
        });
 
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/ef'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ab/cd?x=ef'), /The Url .+ is invalid/);
        });
    });

    describe('Two Param Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: '{x}/{y}' },
                { key: 's1', route: '{x}/{y}' }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x === 'ab' && data.y === 'cd';
            stateNavigator.states['s1'].validate = (data) => data.x === 'ab' || data.y === 'cd';
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/ab/cd');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.y, 'cd');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('ab/ef');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.y, 'ef');
            assert.strictEqual(state.key, 's1');
            var { state, data } = stateNavigator.parseLink('ef/cd');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ef');
            assert.strictEqual(data.y, 'cd');
            assert.strictEqual(state.key, 's1');
        });
 
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('cd/ab'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('ef/ab'), /The Url .+ is invalid/);
        });
    });

    describe('Two Query String Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'abc' },
                { key: 's1', route: 'abc' }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x === 'ab' && data.y === 'cd';
            stateNavigator.states['s1'].validate = (data) => data.x === 'ab' || data.y === 'cd';
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('abc?x=ab&y=cd');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.y, 'cd');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('abc?x=ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(state.key, 's1');
            var { state, data } = stateNavigator.parseLink('abc?x=ab&y=ef');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(data.y, 'ef');
            assert.strictEqual(state.key, 's1');
            var { state, data } = stateNavigator.parseLink('abc?x=ef&y=cd');
            assert.strictEqual(Object.keys(data).length, 2);
            assert.strictEqual(data.x, 'ef');
            assert.strictEqual(data.y, 'cd');
            assert.strictEqual(state.key, 's1');
        });
 
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('abc?x=cd'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('abc?x=cd&y=ef'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('abc?y=ab'), /The Url .+ is invalid/);
        });
    });

    describe('Param Encode Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: '{x}' },
                { key: 's1', route: '{x}' }
            ]);
            var state = stateNavigator.states['s0'];
            state.urlDecode = (state, key, val) => val.replace('+', ' ')  
            stateNavigator.states['s0'].validate = (data) => data.x === 'a b';
            stateNavigator.states['s1'].validate = (data) => data.x === 'c+d';
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/a+b');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'a b');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/c+d');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'c+d');
            assert.strictEqual(state.key, 's1');
        });
 
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/c d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/ef'), /The Url .+ is invalid/);
        });
    });

    describe('Query String Encode Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'abc' },
                { key: 's1', route: 'abc' }
            ]);
            var state = stateNavigator.states['s0'];
            state.urlDecode = (state, key, val) => val.replace('+', ' ')  
            stateNavigator.states['s0'].validate = (data) => data.x === 'a b';
            stateNavigator.states['s1'].validate = (data) => data.x === 'c+d';
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/abc?x=a+b');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'a b');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/abc?x=c+d');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'c+d');
            assert.strictEqual(state.key, 's1');
        });
 
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abc?x=c d'), /The Url .+ is invalid/);
            assert.throws(() => stateNavigator.parseLink('/abc?x=ef'), /The Url .+ is invalid/);
        });
    });

    describe('Crumb Trail Excluded Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'ab' },
                { key: 's1', route: 'cd', trackCrumbTrail: true }
            ]);
            stateNavigator.states['s1'].validate = (data) => Object.keys(data).length === 0;
        });

        it('should match', function() {
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1');
            var { state, data } = stateNavigator.parseLink(link);
            assert.strictEqual(Object.keys(data).length, 0);
            assert.strictEqual(state.key, 's1');
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationBackLink(1);
            var { state, data } = stateNavigator.parseLink(link);
            assert.strictEqual(Object.keys(data).length, 0);
            assert.strictEqual(state.key, 's0');
        });
 
        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/cd?x=ab'), /The Url .+ is invalid/);
        });
    });

    describe('Same Route Different Param Defaults', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: '{x?}', defaults: { x: 1 } },
                { key: 's1', route: '{x?}' }
            ]);
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 1);
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/12');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 12);
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(state.key, 's1');
        });
    });

    describe('Same Route Different Query String Defaults', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'ab', defaults: { x: 1 } },
                { key: 's1', route: 'ab' }
            ]);
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 1);
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/ab?x=12');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 12);
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/ab?x=cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's1');
        });
    });

    describe('Error Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: '{x}' },
                { key: 's1', route: '{x}' }
            ]);
            stateNavigator.states['s0'].validate = (data) => { 
                if (data.x === 'ab')
                    throw new Error();
                return true;
            };
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(state.key, 's1');
            var { state, data } = stateNavigator.parseLink('/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's0');
        });
    });

    describe('Mixed Param Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'ab{x}' },
                { key: 's1', route: 'ab{x}' }
            ]);
            stateNavigator.states['s0'].validate = (data) => data.x === 'ab';
            stateNavigator.states['s1'].validate = (data) => data.x === 'cd';
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/abab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'ab');
            assert.strictEqual(state.key, 's0');
            var { state, data } = stateNavigator.parseLink('/abcd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's1');
        });

        it('should not match', function() {
            assert.throws(() => stateNavigator.parseLink('/abef'), /The Url .+ is invalid/);
        });
    });

    describe('Crumb Trail Error Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'ab', trackCrumbTrail: true },
                { key: 's1', route: 'ab' }
            ]);
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/ab?crumb=www.google.com');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.crumb, 'www.google.com');
            assert.strictEqual(state.key, 's1');
            var { state, data } = stateNavigator.parseLink('/ab?crumb=/abc');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.crumb, '/abc');
            assert.strictEqual(state.key, 's1');
            var { state, data } = stateNavigator.parseLink('/ab?crumb=/ab');
            assert.strictEqual(Object.keys(data).length, 0);
            assert.strictEqual(state.key, 's0');
        });
    });

    describe('Error Message', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: '{x?}', defaults: { x: 12 } },
                { key: 's1', route: 'ab{x?}', defaults: { x: true } }
            ]);
        });

        it('should match', function() {
            assert.throws(() => stateNavigator.parseLink('/ab/cd'), /The Url \/ab\/cd is invalid\nNo match found$/, '');
            assert.throws(() => stateNavigator.parseLink('ab/cd'), /The Url ab\/cd is invalid\nNo match found$/, '');
            assert.throws(() => stateNavigator.parseLink('/a'), /The Url \/a is invalid\na is not a valid number$/, '');
            assert.throws(() => stateNavigator.parseLink('/abc'), /The Url \/abc is invalid\nabc is not a valid number\nc is not a valid boolean$/, '');
            assert.throws(() => stateNavigator.start('/ab/cd'), /The Url \/ab\/cd is invalid\nNo match found$/, '');
            assert.throws(() => stateNavigator.start('ab/cd'), /The Url ab\/cd is invalid\nNo match found$/, '');
            assert.throws(() => stateNavigator.start('/a'), /The Url \/a is invalid\na is not a valid number$/, '');
            assert.throws(() => stateNavigator.start('/abc'), /The Url \/abc is invalid\nabc is not a valid number\nc is not a valid boolean$/, '');
        });
    });

    describe('Two Route Type Conflict', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: ['{x}', '{y}'], defaultTypes: { x: 'number' } }
            ]);
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.y, 'ab');
            assert.strictEqual(state.key, 's');
            var { state, data } = stateNavigator.parseLink('/12');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 12);
            assert.strictEqual(state.key, 's');
        });
    });

    describe('Two Route Constraint', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's', route: ['{x}', '{y}'] }
            ]);
            stateNavigator.states['s'].validate = (data) => data.x !== 'ab';
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/ab');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.y, 'ab');
            assert.strictEqual(state.key, 's');
            var { state, data } = stateNavigator.parseLink('/cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.x, 'cd');
            assert.strictEqual(state.key, 's');
        });
    });

    describe('Crumb Key Type Conflict', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'ab', trackCrumbTrail: true },
                { key: 's1', route: 'ab' }
            ]);
        });

        it('should match', function() {
            var { state, data } = stateNavigator.parseLink('/ab?crumb=cd');
            assert.strictEqual(Object.keys(data).length, 1);
            assert.strictEqual(data.crumb, 'cd');
            assert.strictEqual(state.key, 's1');
        });
    });

    describe('Crumb Trail Crumbs', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function () {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'a' },
                { key: 's1', route: 'b', trackCrumbTrail: true },
                { key: 's2', route: 'c', trackCrumbTrail: true },
            ]);
        });

        it('should match', function() {
            var { crumbs } = stateNavigator.parseLink('/a');
            assert.strictEqual(crumbs.length, 0);
            var link = stateNavigator.getNavigationLink('s0', { x: 0, y: '1' });
            ({ crumbs } = stateNavigator.parseLink(link));
            assert.strictEqual(crumbs.length, 0);
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s1', { x: 2, y: 3, z: '4' });
            ({ crumbs } = stateNavigator.parseLink(link));
            assert.strictEqual(crumbs.length, 1);
            assert.strictEqual(crumbs[0].state.key, 's0');
            assert.strictEqual(crumbs[0].data.x, 0);
            assert.strictEqual(crumbs[0].data.y, '1');
            assert.strictEqual(Object.keys(crumbs[0].data).length, 2);
            stateNavigator.navigateLink(link);
            link = stateNavigator.getNavigationLink('s2');
            var { crumbs } = stateNavigator.parseLink(link);
            assert.strictEqual(crumbs.length, 2);
            assert.strictEqual(crumbs[0].state.key, 's0');
            assert.strictEqual(crumbs[0].data.x, 0);
            assert.strictEqual(crumbs[0].data.y, '1');
            assert.strictEqual(Object.keys(crumbs[0].data).length, 2);
            assert.strictEqual(crumbs[1].state.key, 's1');
            assert.strictEqual(crumbs[1].data.x, 2);
            assert.strictEqual(crumbs[1].data.y, 3);
            assert.strictEqual(crumbs[1].data.z, '4');
            assert.strictEqual(Object.keys(crumbs[1].data).length, 3);
        });
    });
});
