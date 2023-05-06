import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from 'navigation';

describe('Rewrite Navigation', function () {
    describe('Rewrite State', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
            ]);
            var {s0} = stateNavigator.states;
            s0.rewrite = () => ({
                stateKey: 's1'
            });
        });

        describe('Navigate', function() {
            test(() => {
                stateNavigator.navigate('s0');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', function() {
            test(() => {
                return stateNavigator.getNavigationLink('s0');
            });
        });

        describe('Fluent Navigate', function() {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s0').url;
            });            
        });
        
        function test(navigate){
            it('should populate href', function() {
                var link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r1');
            });
        }
    });

    describe('Rewrite Hash', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var {s} = stateNavigator.states;
            s.rewrite = () => ({
                stateKey: 's',
                hash: 'f'
            });
        });

        describe('Navigate', function() {
            test(() => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', function() {
            test(() => {
                return stateNavigator.getNavigationLink('s');
            });
        });

        describe('Fluent Navigate', function() {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s').url;
            });            
        });
        
        function test(navigate){
            it('should populate href', function() {
                var link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r#f');
            });
        }
    });

    describe('Rewrite Null Hash', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var {s} = stateNavigator.states;
            s.rewrite = () => ({
                stateKey: 's',
                hash: null
            });
        });

        describe('Navigate', function() {
            test(() => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', function() {
            test(() => {
                return stateNavigator.getNavigationLink('s');
            });
        });

        describe('Fluent Navigate', function() {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s').url;
            });            
        });
        
        function test(navigate){
            it('should populate href', function() {
                var link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r');
            });
        }
    });

    describe('Rewrite Empty Reserved Url Character Hash', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var {s} = stateNavigator.states;
            s.rewrite = () => ({
                stateKey: 's',
                hash: '*="/()\'-_+~@:?><.;[],{}!£$%^#&'
            });
        });

        describe('Navigate', function() {
            test(() => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', function() {
            test(() => {
                return stateNavigator.getNavigationLink('s');
            });
        });

        describe('Fluent Navigate', function() {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s').url;
            });            
        });
        
        function test(navigate){
            it('should populate href', function() {
                var link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r#*="/()\'-_+~@:?><.;[],{}!£$%^#&');
            });
        }
    });

    describe('Rewrite Invalid State', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var {s} = stateNavigator.states;
            s.rewrite = () => ({
                stateKey: 's0'
            });
        });

        describe('Navigate', function() {
            test(() => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', function() {
            test(() => {
                return stateNavigator.getNavigationLink('s');
            });
        });

        describe('Fluent Navigate', function() {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s').url;
            });            
        });
        
        function test(navigate){
            it('should populate href', function() {
                var link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r');
            });
        }
    });

    describe('Transition Rewrite', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' },
            ]);
            var {s1} = stateNavigator.states;
            s1.rewrite = () => ({
                stateKey: 's2'
            });
        });

        describe('Navigate', function() {
            test(() => {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', function() {
            test(() => {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                return stateNavigator.getNavigationLink('s1');
            });
        });

        describe('Fluent Navigate', function() {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1').url;
            });            
        });
        
        function test(navigate){
            it('should populate href', function() {
                var link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2');
            });
        }
    });

    describe('Transition Rewrite Hash', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' },
            ]);
            var {s1} = stateNavigator.states;
            s1.rewrite = () => ({
                stateKey: 's2',
                hash: 'f'
            });
        });

        describe('Navigate', function() {
            test(() => {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', function() {
            test(() => {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                return stateNavigator.getNavigationLink('s1');
            });
        });

        describe('Fluent Navigate', function() {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1').url;
            });            
        });
        
        function test(navigate){
            it('should populate href', function() {
                var link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2#f');
            });
        }
    });

    describe('Transition With Trail Rewrite', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2' },
            ]);
            var {s1} = stateNavigator.states;
            s1.rewrite = () => ({
                stateKey: 's2'
            });
        });

        describe('Navigate', function() {
            test(() => {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', function() {
            test(() => {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                return stateNavigator.getNavigationLink('s1');
            });
        });

        describe('Fluent Navigate', function() {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1').url;
            });            
        });
        
        function test(navigate){
            it('should populate href', function() {
                var link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2');
            });
        }
    });

    describe('Transition With Trail Rewrite With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
            ]);
            var {s1} = stateNavigator.states;
            s1.rewrite = () => ({
                stateKey: 's2'
            });
        });

        describe('Navigate', function() {
            test(() => {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', function() {
            test(() => {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                return stateNavigator.getNavigationLink('s1');
            });
        });

        describe('Fluent Navigate', function() {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1').url;
            });            
        });
        
        function test(navigate){
            it('should populate href', function() {
                var link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2?crumb=%2Fr0');
            });
        }
    });
});
