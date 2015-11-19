/// <reference path="assert.d.ts" />
/// <reference path="mocha.d.ts" />
import assert = require('assert');
import Crumb = require('../src/Crumb');
import State = require('../src/config/State');
import Navigation = require('../src/Navigation');

var settings = [false, true];
settings.forEach(function(setting) {
describe('Navigation', function () {
    beforeEach(function () {
        Navigation.StateController.clearStateContext();
        Navigation.settings.crumbTrailPersister = new Navigation.CrumbTrailPersister();
        Navigation.settings.combineCrumbTrail = setting;
    });

    describe('Dialog', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should go to initial State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].initial);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Invalid Dialog', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });

        describe('Navigate', function() {
            it('should throw error', function(){
                assert.throws(() => Navigation.StateController.navigate('d0'));
            });
        });
        
        describe('Navigate Link', function() {
            it('should throw error', function(){
                assert.throws(() => Navigation.StateController.getNavigationLink('d0'));
            });
        });
    });

    describe('Cross Dialog', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0' }]},
                { key: 'd1', initial: 's1', states: [
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('d1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to initial State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].initial);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d1']);
            });
            it('should populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d0']);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Cross Dialog Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0' }]},
                { key: 'd1', initial: 's1', states: [
                    { key: 's1', route: 'r1', trackCrumbTrail: false }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('d1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to initial State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].initial);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d1']);
            });
            it('should not populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, null);
                assert.equal(Navigation.StateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Dialog Dialog', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('d');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to initial State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].initial);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateContext.state);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateContext.dialog);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Dialog Dialog Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', trackCrumbTrail: false }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('d');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
            });
            test();            
        });
        
        function test() {
            it('should go to initial State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].initial);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should not populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, null);
                assert.equal(Navigation.StateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });
    
    describe('Transition', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s0']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateContext.dialog.initial);
                assert.ok(Navigation.StateController.crumbs[0].last);
            });
        }
    });

    describe('First Transition', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' },
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's1', route: 'r1' },
                    { key: 's2', route: 'r2' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t0');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s0']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateContext.dialog.initial);
                assert.ok(Navigation.StateController.crumbs[0].last);
            });
        }
    });

    describe('Second Transition', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' },
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's1', route: 'r1' },
                    { key: 's2', route: 'r2' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s0']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateContext.dialog.initial);
                assert.ok(Navigation.StateController.crumbs[0].last);
            });
        }
    });

    describe('Invalid Action', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });

        describe('Navigate', function() {
            it('should throw error', function() {
                Navigation.StateController.navigate('d');
                assert.throws(() => Navigation.StateController.navigate('t1'));            
            });
        });
        
        describe('Navigate Link', function() {
            it('should throw error', function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                assert.throws(() => Navigation.StateController.getNavigationLink('t1'));
            });
        });
    });

    describe('Null Action', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });

        describe('Navigate', function() {
            it('should throw error', function() {
                Navigation.StateController.navigate('d');
                assert.throws(() => Navigation.StateController.navigate(null));            
            });
        });
        
        describe('Navigate Link', function() {
            it('should throw error', function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                assert.throws(() => Navigation.StateController.getNavigationLink(null));
            });
        });
    });
    
    describe('Transition From Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                var link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
            });
            it('should populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateContext.dialog.initial);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateContext.dialog.initial);
                assert.ok(Navigation.StateController.crumbs[0].last);
            });
        }
    });

    describe('Transition Transition', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t0');
                Navigation.StateController.navigate('t1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
            });
            it('should populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
            });
            it('should have crumb trail of length 2', function() {
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateContext.dialog.initial);
                assert.equal(Navigation.StateController.crumbs[1].state, Navigation.StateContext.previousState);
                assert.ok(!Navigation.StateController.crumbs[0].last);
                assert.ok(Navigation.StateController.crumbs[1].last);
            });
        }
    });
    
    describe('Transition Transition Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: false }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t0');
                Navigation.StateController.navigate('t1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
            });
            it('should not populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, null);
                assert.equal(Navigation.StateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });
    
    describe('Dialog and Transition Match', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 'd', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('d');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s0']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateContext.dialog.initial);
                assert.ok(Navigation.StateController.crumbs[0].last);
            });
        }
    });
    
    describe('Refresh', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {            
            it('should go to current State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State with current State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should not change crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig.dialogs['d'].states['s0']);
                assert.ok(Navigation.StateController.crumbs[0].last);
            });
        }
    });

    describe('Refresh Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to current State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should not populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, null);
                assert.equal(Navigation.StateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });
    
    describe('Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t0');
                Navigation.StateController.navigate('t1');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State with current State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should reduce crumb trail by one', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig.dialogs['d'].states['s0']);
                assert.ok(Navigation.StateController.crumbs[0].last);
            });
        }
    });

    describe('Back Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false, transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t0');
                Navigation.StateController.navigate('t1');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should not populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, null);
                assert.equal(Navigation.StateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Back Two', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', transitions: [
                        { key: 't2', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', transitions: [
                        { key: 't3', to: 's4' }
                    ]},
                    { key: 's4', route: 'r4' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t0');
                Navigation.StateController.navigate('t1');
                Navigation.StateController.navigate('t2');
                Navigation.StateController.navigate('t3');
                Navigation.StateController.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t2');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t3');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(2);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[2]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should populate previous State with current State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[4]);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should reduce crumb trail by two', function() {
                assert.equal(Navigation.StateController.crumbs.length, 2);
                assert.ok(!Navigation.StateController.crumbs[0].last);
                assert.ok(Navigation.StateController.crumbs[1].last);
                for (var i = 0; i < Navigation.StateController.crumbs.length; i++) {
                    assert.equal(Navigation.StateController.crumbs[i].state, Navigation.StateInfoConfig._dialogs[0]._states[i]);
                }
            });
        }
    });

    describe('Back Two Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't0', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't1', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: false, transitions: [
                        { key: 't2', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', transitions: [
                        { key: 't3', to: 's4' }
                    ]},
                    { key: 's4', route: 'r4' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t0');
                Navigation.StateController.navigate('t1');
                Navigation.StateController.navigate('t2');
                Navigation.StateController.navigate('t3');
                Navigation.StateController.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t2');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t3');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(2);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[2]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should not populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, null);
                assert.equal(Navigation.StateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Back One By One', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[0]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should populate previous State with previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[1]);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Back One By One Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[0]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should not populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, null);
                assert.equal(Navigation.StateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Can Navigate Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should return false for 0', function() {
                assert.ok(!Navigation.StateController.canNavigateBack(0));
            });
            it('should return true for 1', function() {
                assert.ok(Navigation.StateController.canNavigateBack(1));
            });
            it('should return true for 2', function() {
                assert.ok(Navigation.StateController.canNavigateBack(2));
            });
            it('should return false for 3', function() {
                assert.ok(!Navigation.StateController.canNavigateBack(3));
            });
        }
    });

    describe('Without Trail Can Navigate Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: false }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should return false for 0', function() {
                assert.ok(!Navigation.StateController.canNavigateBack(0));
            });
            it('should return false for 1', function() {
                assert.ok(!Navigation.StateController.canNavigateBack(1));
            });
        }
    });

    describe('Invalid Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
            });
            it('should throw error', function() {
                assert.throws(() => Navigation.StateController.navigateBack(3));
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => Navigation.StateController.getNavigationBackLink(3));
            });
        });
    });

    describe('Without Trail Invalid Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: false }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
            });
            it('should throw error', function() {
                assert.throws(() => Navigation.StateController.navigateBack(1));
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => Navigation.StateController.getNavigationBackLink(1));
            });
        });
    });

    describe('Back Invalid Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            it('should throw error', function() {
                assert.throws(() => Navigation.StateController.navigateBack(2));
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => Navigation.StateController.getNavigationBackLink(2));
            });
        });
    });

    describe('Back Without Trail Invalid Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            it('should throw error', function() {
                assert.throws(() => Navigation.StateController.navigateBack(1));
            });
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            it('should throw error', function() {
                assert.throws(() => Navigation.StateController.getNavigationBackLink(1));
            });
        });
    });

    describe('Back Refresh', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.refresh();
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0].states['s0']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should populate previous State with previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0].states['s0']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Back Without Trail Refresh', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.refresh();
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0].states['s0']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should note populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, null);
                assert.equal(Navigation.StateContext.previousDialog, null);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Back Refresh Transition', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't0', to: 's2' },
                        { key: 't1', to: 's3' }
                    ]},
                    { key: 's2', route: 'r2' },
                    { key: 's3', route: 'r3' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t0');
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.refresh();
                Navigation.StateController.navigate('t1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s3']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State with previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should not change crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 2);
                assert.ok(!Navigation.StateController.crumbs[0].last);
                assert.ok(Navigation.StateController.crumbs[1].last);
                for (var i = 0; i < Navigation.StateController.crumbs.length; i++) {
                    assert.equal(Navigation.StateController.crumbs[i].state, Navigation.StateInfoConfig._dialogs[0]._states[i]);
                }
            });
        }
    });

    describe('Back Without Trail Refresh Transition', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false, transitions: [
                        { key: 't0', to: 's2' },
                        { key: 't1', to: 's3' }
                    ]},
                    { key: 's2', route: 'r2' },
                    { key: 's3', route: 'r3' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t0');
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.refresh();
                Navigation.StateController.navigate('t1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s3']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State with previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should not change crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.ok(Navigation.StateController.crumbs[0].last);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
            });
        }
    });

    describe('Transition Without Trail Transition', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to to State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should populate previous State', function() {
                assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateContext.previousDialog, Navigation.StateInfoConfig.dialogs['d']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.ok(Navigation.StateController.crumbs[0].last);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
            });
        }
    });

    describe('Crumb Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', transitions: [
                        { key: 't', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', transitions: [
                        { key: 't', to: 's4' }
                    ]},
                    { key: 's4', route: 'r4' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('t');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate crumb State', function() {
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig.dialogs['d'].states['s0']);
                assert.equal(Navigation.StateController.crumbs[1].state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
                assert.equal(Navigation.StateController.crumbs[2].state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
                assert.equal(Navigation.StateController.crumbs[3].state, Navigation.StateInfoConfig.dialogs['d'].states['s3']);
                assert.equal(Navigation.StateController.crumbs.length, 4);
            });
            it('should populate crumb last', function() {
                assert.ok(!Navigation.StateController.crumbs[0].last);
                assert.ok(!Navigation.StateController.crumbs[1].last);
                assert.ok(!Navigation.StateController.crumbs[2].last);
                assert.ok(Navigation.StateController.crumbs[3].last);
            });
        }
    });

    describe('Dialog Dialog Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's', states: [
                    { key: 's', route: 'r0' }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'r1' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('d1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig.dialogs['d0'].states['s']);
            });
        }
    });

    describe('Cross Dialog Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'r2' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should have crumb trail of length 2', function() {
                assert.equal(Navigation.StateController.crumbs.length, 2);
                assert.equal(Navigation.StateController.crumbs[0].state, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
                assert.equal(Navigation.StateController.crumbs[1].state, Navigation.StateInfoConfig.dialogs['d0']._states[1]);
            });
        }
    });

    describe('Dialog Dialog Back Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's', states: [
                    { key: 's', route: 'r0' }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'r1' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous Dialog', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0']._states[0]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d0']);
            });
            it('should have no crumb trail', function() {
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });

    describe('Cross Dialog Back Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'r2' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                var newCrumbs = [];
                for (var i = 0; i < crumbs.length; i++) {
                    if (crumbs[i].state === state)
                        break;
                    newCrumbs.push(crumbs[i]);
                }
                return newCrumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.refresh();
                Navigation.StateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous Dialog', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0']._states[1]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d0']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
            });
        }
    });

    describe('Cross Dialog Back Two Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r3' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(2);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(2);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous Dialog', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0']._states[1]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d0']);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
            });
        }
    });

    describe('Dialog Back Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r3' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                var newCrumbs = [];
                for (var i = 0; i < crumbs.length; i++) {
                    if (crumbs[i].state === state)
                        break;
                    newCrumbs.push(crumbs[i]);
                }
                return newCrumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1']._states[0]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig.dialogs['d1']);
            });
            it('should have crumb trail of length 2', function() {
                assert.equal(Navigation.StateController.crumbs.length, 2);
            });
        }
    });

    describe('Cross Dialog Back One By One Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r3' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                var newCrumbs = [];
                for (var i = 0; i < crumbs.length; i++) {
                    if (crumbs[i].state === state)
                        break;
                    newCrumbs.push(crumbs[i]);
                }
                return newCrumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should go to previous State', function() {
                assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
                assert.equal(Navigation.StateContext.dialog, Navigation.StateInfoConfig._dialogs[0]);
            });
            it('should have crumb trail of length 1', function() {
                assert.equal(Navigation.StateController.crumbs.length, 1);
            });
        }
    });

    describe('Dialog Next', function() {
        it ('should return initial State', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            assert.equal(Navigation.StateController.getNextState('d'), Navigation.StateInfoConfig.dialogs['d'].initial);
        })
    });

    describe('Transition Next', function() {
        it ('should return to State', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.StateController.navigate('d');
            assert.equal(Navigation.StateController.getNextState('t'), Navigation.StateInfoConfig.dialogs['d'].states['s1']);
        })
    });

    describe('Invalid Next', function() {
        it ('should throw error', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            assert.throws(() => Navigation.StateController.getNextState('d0'));
        })
    });

    describe('Dialog and Transition Match Next', function() {
        it ('should return to State', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 'd', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.StateController.navigate('d');
            assert.equal(Navigation.StateController.getNextState('d'), Navigation.StateInfoConfig.dialogs['d'].states['s1']);
        })
    });

    describe('Cross Dialog Navigated', function () {
        it('should call all lifecycle functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d0');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigated = () => navigated = true;
            Navigation.StateController.navigate('d1');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        })
    });

    describe('Cross Dialog Unloading', function () {
        it('should only call unloading function', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d0');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].unloading = (state, data, url, unload) => unloading = true;
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigated = () => navigated = true;
            Navigation.StateController.navigate('d1');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        });
    });

    describe('Cross Dialog Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d0');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigated = () => navigated = true;
            Navigation.StateController.navigate('d1');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        });
    });

    describe('Dialog Dialog Navigated', function () {
        it('should call all lifecycle functions apart from disposed', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            var link = Navigation.StateController.getNavigationLink('d');
            Navigation.StateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s'].navigated = () => navigated = true;
            Navigation.StateController.navigate('d');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s']);
        });
    });

    describe('Dialog Dialog Unloading', function () {
        it('should only call unloading function', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            var link = Navigation.StateController.getNavigationLink('d');
            Navigation.StateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s'].unloading = (state, data, url, unload) => unloading = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s'].navigated = () => navigated = true;
            Navigation.StateController.navigate('d');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s']);
        });
    });

    describe('Dialog Dialog Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            var link = Navigation.StateController.getNavigationLink('d');
            Navigation.StateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s'].navigated = () => navigated = true;
            Navigation.StateController.navigate('d');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s']);
        });
    });

    describe('Transition Navigated', function () {
        it('should call all lifecycle functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            var link = Navigation.StateController.getNavigationLink('d');
            Navigation.StateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s0'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s0'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigated = () => navigated = true;
            Navigation.StateController.navigate('t');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
        });
    });

    describe('Transition Unloading', function () {
        it('should only call unloading function', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            var link = Navigation.StateController.getNavigationLink('d');
            Navigation.StateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s0'].unloading = (state, data, url, unload) => unloading = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s0'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigated = () => navigated = true;
            Navigation.StateController.navigate('t');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s0']);
        });
    });

    describe('Transition Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            var link = Navigation.StateController.getNavigationLink('d');
            Navigation.StateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s0'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s0'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigated = () => navigated = true;
            Navigation.StateController.navigate('t');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s0']);
        });
    });

    describe('Transition Navigating Navigate', function () {
        it('should go to to State', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            var link = Navigation.StateController.getNavigationLink('d');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('t');
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigating = (data, url, navigate) => {
                Navigation.StateController.navigate('t');
            }
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
        });
    });

    describe('Transition Transition Navigated', function () {
        it('should call all lifecycle functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigated = () => navigated = true;
            Navigation.StateController.navigate('t');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
        });
    });

    describe('Transition Transition Unloading', function () {
        it('should only call unloading function', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].unloading = (state, data, url, unload) => unloading = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigated = () => navigated = true;
            Navigation.StateController.navigate('t');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
        });
    });

    describe('Transition Transition Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigated = () => navigated = true;
            Navigation.StateController.navigate('t');
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
        });
    });

    describe('Refresh Navigated', function () {
        it('should call all lifecycle functions apart from disposed', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            var link = Navigation.StateController.getNavigationLink('d');
            Navigation.StateController.navigateLink(link);
            link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigated = () => navigated = true;
            Navigation.StateController.refresh();
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
        });
    });

    describe('Refresh Unloading', function () {
        it('should only call unloading function', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            var link = Navigation.StateController.getNavigationLink('d');
            Navigation.StateController.navigateLink(link);
            link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].unloading = (state, data, url, unload) => unloading = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigated = () => navigated = true;
            Navigation.StateController.refresh();
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
        });
    });

    describe('Refresh Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            var link = Navigation.StateController.getNavigationLink('d');
            Navigation.StateController.navigateLink(link);
            link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigated = () => navigated = true;
            Navigation.StateController.refresh();
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
        });
    });

    describe('Back One Navigated', function () {
        it('should call all lifecycle functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.StateController.navigate('d');
            Navigation.StateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s0'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s0'].navigated = () => navigated = true;
            var link = Navigation.StateController.getNavigationBackLink(1);
            Navigation.StateController.navigateLink(link);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s0']);
        });
    });

    describe('Back One Unloading', function () {
        it('should only call unloading function', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.StateController.navigate('d');
            Navigation.StateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].unloading = (state, data, url, unload) => unloading = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s0'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s0'].navigated = () => navigated = true;
            var link = Navigation.StateController.getNavigationBackLink(1);
            Navigation.StateController.navigateLink(link);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
        });
    });

    describe('Back One Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.StateController.navigate('d');
            Navigation.StateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s0'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s0'].navigated = () => navigated = true;
            var link = Navigation.StateController.getNavigationBackLink(1);
            Navigation.StateController.navigateLink(link);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
        });
    });

    describe('Back Two Navigated', function () {
        it('should call all lifecycle functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2', transitions: [
                        { key: 't', to: 's3' },
                    ]},
                    { key: 's3', route: 'r3', transitions: [
                        { key: 't', to: 's4' },
                    ]},
                    { key: 's4', route: 'r4' }]}
                ]);
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('t');
            link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s4'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s4'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigated = () => navigated = true;
            Navigation.StateController.navigateBack(2);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
        });
    });

    describe('Back Two Unloading', function () {
        it('should only call unloading function', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2', transitions: [
                        { key: 't', to: 's3' },
                    ]},
                    { key: 's3', route: 'r3', transitions: [
                        { key: 't', to: 's4' },
                    ]},
                    { key: 's4', route: 'r4' }]}
                ]);
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('t');
            link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s4'].unloading = (state, data, url, unload) => unloading = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s4'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigated = () => navigated = true;
            Navigation.StateController.navigateBack(2);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s4']);
        });
    });

    describe('Back Two Navigating', function () {
        it('should only call unloading and navigating functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2', transitions: [
                        { key: 't', to: 's3' },
                    ]},
                    { key: 's3', route: 'r3', transitions: [
                        { key: 't', to: 's4' },
                    ]},
                    { key: 's4', route: 'r4' }]}
                ]);
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('t');
            link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s4'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s4'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigated = () => navigated = true;
            Navigation.StateController.navigateBack(2);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s4']);
        });
    });

    describe('Back One By One Navigated', function () {
        it('should twice call all lifecycle functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigated = () => navigated = true;
            Navigation.StateController.navigateBack(1);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s1']);
            unloading = undefined;
            disposed = undefined;
            navigating = undefined;
            navigated = undefined;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s0'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s0'].navigated = () => navigated = true;
            var link = Navigation.StateController.getNavigationBackLink(1);
            Navigation.StateController.navigateLink(link);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, true);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, true);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s0']);
        });
    });

    describe('Back One By One Unloading', function () {
        it('should twice only call unloading function', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].unloading = (state, data, url, unload) => unloading = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigated = () => navigated = true;
            Navigation.StateController.navigateBack(1);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
            unloading = undefined;
            disposed = undefined;
            navigating = undefined;
            navigated = undefined;
            var link = Navigation.StateController.getNavigationBackLink(1);
            Navigation.StateController.navigateLink(link);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, undefined);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
        });
    });

    describe('Back One By One Navigating', function () {
        it('should twice only call unloading and navigating functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('t');
            var unloading, disposed, navigating, navigated;
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].unloading = (state, data, url, unload) => {
                unloading = true;
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].dispose = () => disposed = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigating = (data, url, navigate) => navigating = true;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigated = () => navigated = true;
            Navigation.StateController.navigateBack(1);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
            unloading = undefined;
            disposed = undefined;
            navigating = undefined;
            navigated = undefined;
            var link = Navigation.StateController.getNavigationBackLink(1);
            Navigation.StateController.navigateLink(link);
            assert.strictEqual(unloading, true);
            assert.strictEqual(disposed, undefined);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated, undefined);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d'].states['s2']);
        });
    });

    describe('Unloading Navigate', function () {
        it('should go to to State instead of initial State', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3' }]}
                ]);
            Navigation.StateController.navigate('d0');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigate('t');
            Navigation.StateController.navigate('t');
            var disposed = 0, unloading, navigated10, navigated01;
            Navigation.StateInfoConfig.dialogs['d0'].states['s2'].unloading = (state, data, url, unload) => {
                if (!unloading) {
                    unloading = true;
                    Navigation.StateController.navigateLink(link);
                } else {
                    unload();
                }
            }
            Navigation.StateInfoConfig.dialogs['d0'].states['s2'].dispose = () => disposed++;
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigated = () => navigated10 = true;
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigated = () => navigated01 = true;
            Navigation.StateController.navigate('d1');
            assert.strictEqual(disposed, 1);
            assert.strictEqual(unloading, true);
            assert.strictEqual(navigated10, undefined);
            assert.strictEqual(navigated01, true);
            assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        });
    });

    describe('Navigating Navigate', function () {
        it('should go to to State instead of initial State', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3' }]}
                ]);
            Navigation.StateController.navigate('d0');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigate('t');
            Navigation.StateController.navigate('t');
            var disposed = 0, navigating, navigated10, navigated01;
            Navigation.StateInfoConfig.dialogs['d0'].states['s2'].dispose = () => disposed++;
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => {
                navigating = true;
                Navigation.StateController.navigateLink(link);
            }
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigated = () => navigated10 = true;
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigated = () => navigated01 = true;
            Navigation.StateController.navigate('d1');
            assert.strictEqual(disposed, 1);
            assert.strictEqual(navigating, true);
            assert.strictEqual(navigated10, undefined);
            assert.strictEqual(navigated01, true);
            assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
        });
    });

    describe('On Navigate', function () {
        it('should call onNavigate listener', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            var oldStates: Array<State> = [];
            var states: Array<State> = [];
            Navigation.StateController.navigate('d0');
            var navigatedHandler = (oldState, state, data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            Navigation.StateController.onNavigate(navigatedHandler);
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('d1');
            Navigation.StateController.offNavigate(navigatedHandler);
            assert.equal(oldStates[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
            assert.equal(states[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(oldStates[1], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(states[1], Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
            assert.equal(oldStates.length, 2);
            assert.equal(states.length, 2);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        });
    });

    describe('Duplicate On Navigate', function () {
        it('should not duplicate call onNavigate listener', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            var oldStates: Array<State> = [];
            var states: Array<State> = [];
            Navigation.StateController.navigate('d0');
            var navigatedHandler = (oldState, state, data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            Navigation.StateController.onNavigate(navigatedHandler);
            Navigation.StateController.onNavigate(navigatedHandler);
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('d1');
            Navigation.StateController.offNavigate(navigatedHandler);
            assert.equal(oldStates[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
            assert.equal(states[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(oldStates[1], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(states[1], Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
            assert.equal(oldStates.length, 2);
            assert.equal(states.length, 2);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        });
    });

    describe('Duplicate On Off Navigate', function () {
        it('should call onNavigate listener', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            var oldStates: Array<State> = [];
            var states: Array<State> = [];
            Navigation.StateController.navigate('d0');
            var navigatedHandler = (oldState, state, data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            Navigation.StateController.onNavigate(navigatedHandler);
            Navigation.StateController.offNavigate(navigatedHandler);
            Navigation.StateController.onNavigate(navigatedHandler);
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('d1');
            Navigation.StateController.offNavigate(navigatedHandler);
            assert.equal(oldStates[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
            assert.equal(states[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(oldStates[1], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(states[1], Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
            assert.equal(oldStates.length, 2);
            assert.equal(states.length, 2);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        });
    });

    describe('Copy On Navigate', function () {
        it('should call both onNavigate listeners', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            var oldStates: Array<State> = [];
            var states: Array<State> = [];
            Navigation.StateController.navigate('d0');
            var navigatedHandler1 = (oldState, state, data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            var navigatedHandler2 = (oldState, state, data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            Navigation.StateController.onNavigate(navigatedHandler1);
            Navigation.StateController.onNavigate(navigatedHandler2);
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('d1');
            Navigation.StateController.offNavigate(navigatedHandler1);
            Navigation.StateController.offNavigate(navigatedHandler2);
            assert.equal(oldStates[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
            assert.equal(states[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(oldStates[1], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
            assert.equal(states[1], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(oldStates[2], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(states[2], Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
            assert.equal(oldStates[3], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(states[3], Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
            assert.equal(oldStates.length, 4);
            assert.equal(states.length, 4);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        });
    });

    describe('Multiple On Navigate', function () {
        it('should call multiple onNavigate listeners', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            var oldStates1: Array<State> = [];
            var states1: Array<State> = [];
            var oldStates2: Array<State> = [];
            var states2: Array<State> = [];
            Navigation.StateController.navigate('d0');
            var navigatedHandler1 = (oldState, state, data) => {
                oldStates1.push(oldState);
                states1.push(state);
            };
            var navigatedHandler2 = (oldState, state, data) => {
                oldStates2.push(oldState);
                states2.push(state);
            };
            Navigation.StateController.onNavigate(navigatedHandler1);
            Navigation.StateController.onNavigate(navigatedHandler2);
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.navigate('d1');
            Navigation.StateController.offNavigate(navigatedHandler1);
            Navigation.StateController.offNavigate(navigatedHandler2);
            assert.equal(oldStates1[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
            assert.equal(states1[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(oldStates2[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
            assert.equal(states2[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(oldStates1[1], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(states1[1], Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
            assert.equal(oldStates2[1], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(states2[1], Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
            assert.equal(oldStates1.length, 2);
            assert.equal(states1.length, 2);
            assert.equal(oldStates2.length, 2);
            assert.equal(states2.length, 2);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        });
    });

    describe('Off Navigate', function () {
        it('should stop calling onNavigate listener', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            var oldStates: Array<State> = [];
            var states: Array<State> = [];
            Navigation.StateController.navigate('d0');
            var navigatedHandler = (oldState, state, data) => {
                oldStates.push(oldState);
                states.push(state);
            };
            Navigation.StateController.onNavigate(navigatedHandler);
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.offNavigate(navigatedHandler);
            Navigation.StateController.offNavigate(navigatedHandler);
            Navigation.StateController.navigate('d1');
            assert.equal(oldStates[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
            assert.equal(states[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(oldStates.length, 1);
            assert.equal(states.length, 1);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        });
    });

    describe('Multiple Off Navigate', function () {
        it('should individually stop calling onNavigate listeners', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            var oldStates1: Array<State> = [];
            var states1: Array<State> = [];
            var oldStates2: Array<State> = [];
            var states2: Array<State> = [];
            Navigation.StateController.navigate('d0');
            var navigatedHandler1 = (oldState, state, data) => {
                oldStates1.push(oldState);
                states1.push(state);
            };
            var navigatedHandler2 = (oldState, state, data) => {
                oldStates2.push(oldState);
                states2.push(state);
            };
            Navigation.StateController.onNavigate(navigatedHandler1);
            Navigation.StateController.onNavigate(navigatedHandler2);
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            Navigation.StateController.offNavigate(navigatedHandler1);
            Navigation.StateController.navigate('d1');
            Navigation.StateController.offNavigate(navigatedHandler2);
            assert.equal(oldStates1[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
            assert.equal(states1[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(oldStates2[0], Navigation.StateInfoConfig.dialogs['d0'].states['s0']);
            assert.equal(states2[0], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(oldStates2[1], Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(states2[1], Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
            assert.equal(oldStates1.length, 1);
            assert.equal(states1.length, 1);
            assert.equal(oldStates2.length, 2);
            assert.equal(states2.length, 2);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
        });
    });

    describe('Unloading Navigate And Continue', function () {
        it('should go to to State instead of initial State', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d0');
            Navigation.StateController.navigate('t');
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].unloading = (state, data, url, unload) => {
                if (data.x)
                    Navigation.StateController.navigate('t');
                unload();
            }
            var navigating;
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => {
                navigating = true;
                navigate();
            }
            Navigation.StateController.navigate('d1', { x: true });
            assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s2']);
            assert.strictEqual(navigating, undefined);
        });
    });

    describe('Unloading Navigate Url And Continue', function () {
        it('should go to State once', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d0');
            Navigation.StateController.navigate('t');
            var unloading;
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].unloading = (state, data, url, unload) => {
                if (!unloading) {
                    unloading = true;
                    Navigation.StateController.navigateLink(url);
                }
                unload();
            }
            var navigating = 0;
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => {
                navigating++;
                navigate();
            }
            Navigation.StateController.navigate('d1');
            assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
            assert.strictEqual(navigating, 1);
        });
    });

    describe('Navigating Navigate And Continue', function () {
        it('should go to to State instead of initial State', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d0');
            Navigation.StateController.navigate('t');
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigating = (data, url, navigate) => {
                Navigation.StateController.navigate('t');
                navigate();
            }
            Navigation.StateController.navigate('d1');
            assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d0'].states['s1']);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d0'].states['s2']);
        });
    });

    describe('Navigated Navigate On Navigate', function () {
        it('should call onNavigate listener once', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.StateController.navigate('d0');
            Navigation.StateController.navigate('t');
            Navigation.StateInfoConfig.dialogs['d1'].states['s0'].navigated = () => {
                Navigation.StateController.navigate('t');
            }
            var navigatedState;
            var hits = 0;
            var navigatedHandler = (oldState, state, data) => {
                navigatedState = state;
                hits++;
            };
            Navigation.StateController.onNavigate(navigatedHandler);
            Navigation.StateController.navigate('d1');
            Navigation.StateController.offNavigate(navigatedHandler);
            assert.equal(hits, 1);
            assert.equal(navigatedState, Navigation.StateContext.state);
            assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs['d1'].states['s0']);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs['d1'].states['s1']);
        });
    });

    describe('History Navigate', function () {
        it('should pass history flag to lifecycle functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d0');
            var link = Navigation.StateController.getNavigationLink('t');
            var unloadingHistory, navigatingHistory;
            Navigation.StateInfoConfig.dialogs['d0'].states['s0'].unloading = (state, data, url, unload, history) => {
                unloadingHistory = history; 
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigating = (data, url, navigate, history) => {
                navigatingHistory = history;
                navigate();
            }
            Navigation.StateController.navigateLink(link, true);
            assert.strictEqual(unloadingHistory, true);
            assert.strictEqual(navigatingHistory, true);
        });
    });

    describe('Non History Navigate', function () {
        it('should not pass history flag to lifecycle functions', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d0');
            var link = Navigation.StateController.getNavigationLink('t');
            var unloadingHistory, navigatingHistory;
            Navigation.StateInfoConfig.dialogs['d0'].states['s0'].unloading = (state, data, url, unload, history) => {
                unloadingHistory = history; 
                unload();
            }
            Navigation.StateInfoConfig.dialogs['d0'].states['s1'].navigating = (data, url, navigate, history) => {
                navigatingHistory = history;
                navigate();
            }
            Navigation.StateController.navigateLink(link);
            assert.strictEqual(unloadingHistory, false);
            assert.strictEqual(navigatingHistory, false);
        });
    });

    describe('Async Data Navigating', function () {
        it('should pass async data to navigated function', function(done: MochaDone) {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.StateController.navigate('d');
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigated = (data, asyncData) => {
                assert.equal(asyncData, 'hello');
                done();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigating = (data, url, navigate) => {
                setTimeout(() => navigate('hello'), 0);
            }
            Navigation.StateController.navigate('t');
        });
    });

    describe('Async Data Navigating Navigating', function () {
        it('should pass async data to navigated function once', function(done: MochaDone) {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.StateController.navigate('d');
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigated = (data, asyncData) => {
                assert.equal(asyncData, 0);
                done();
            }
            var i = 0;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigating = (data, url, navigate) => {
                ((count) => setTimeout(() => navigate(count), 0))(i);
                i++;
            }
            Navigation.StateController.navigate('t');
            Navigation.StateController.navigate('t');
        });
    });

    describe('Reversed Async Data Navigating Navigating', function () {
        it('should pass second async data to navigated function', function(done: MochaDone) {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.StateController.navigate('d');
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigated = (data, asyncData) => {
                assert.equal(asyncData, 1);
            }
            var i = 0;
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigating = (data, url, navigate) => {
                ((count) => setTimeout(() => { 
                    navigate(count);
                    if (count == 0)
                        done();
                }, 5 - 5 * count))(i);
                i++;
            }
            Navigation.StateController.navigate('t');
            Navigation.StateController.navigate('t');
        });
    });

    describe('No Async Data Navigating', function () {
        it('should not pass any async data', function(done: MochaDone) {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d');
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigated = (data, asyncData) => {
                Navigation.StateController.navigate('t');
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s2'].navigated = (data, asyncData) => {
                assert.equal(asyncData, undefined);
                done();
            }
            Navigation.StateInfoConfig.dialogs['d'].states['s1'].navigating = (data, url, navigate) => {
                setTimeout(() => navigate('hello'), 0);
            }
            Navigation.StateController.navigate('t');
        });
    });

    describe('Transition Storage Navigate', function () {
        it('should set crumb trail to aaa', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            assert.notEqual(link.indexOf('aaa'), -1);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
            assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[0]);
            assert.equal(Navigation.StateController.crumbs.length, 1);
        });
    });

    describe('Transition Transition Storage Navigate', function () {
        it('should set crumb trail to bbb', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
            Navigation.StateController.navigate('d1');
            Navigation.StateController.navigate('t');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            assert.notEqual(link.indexOf('bbb'), -1);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[1]._states[2]);
            assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[1]._states[1]);
            assert.equal(Navigation.StateController.crumbs.length, 2);
        });
    });

    describe('Storage Navigate 26 Times', function () {
        it('should set crumb trail to aaz', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
            for(var i = 0; i < 26; i++) {
                Navigation.StateController.navigate('d');
            }
            var link = Navigation.StateController.getRefreshLink();
            assert.notEqual(link.indexOf('aaz'), -1);
        });
    });

    describe('Storage Navigate 27 Times', function () {
        it('should set crumb trail to aaA', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
            for(var i = 0; i < 27; i++) {
                Navigation.StateController.navigate('d');
            }
            var link = Navigation.StateController.getRefreshLink();
            assert.notEqual(link.indexOf('aaA'), -1);
        });
    });

    describe('Storage Navigate 52 Times', function () {
        it('should set crumb trail to aaZ', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
            for(var i = 0; i < 52; i++) {
                Navigation.StateController.navigate('d');
            }
            var link = Navigation.StateController.getRefreshLink();
            assert.notEqual(link.indexOf('aaZ'), -1);
        });
    });

    describe('Storage Navigate 53 Times', function () {
        it('should set crumb trail to aaa1', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
            for(var i = 0; i < 53; i++) {
                Navigation.StateController.navigate('d');
            }
            var link = Navigation.StateController.getRefreshLink();
            assert.notEqual(link.indexOf('aaa1'), -1);
        });
    });

    describe('Storage Navigate 78 Times', function () {
        it('should set crumb trail to aaz1', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
            for(var i = 0; i < 78; i++) {
                Navigation.StateController.navigate('d');
            }
            var link = Navigation.StateController.getRefreshLink();
            assert.notEqual(link.indexOf('aaz1'), -1);
        });
    });

    describe('Storage Navigate 79 Times', function () {
        it('should set crumb trail to aaA1', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
            for(var i = 0; i < 79; i++) {
                Navigation.StateController.navigate('d');
            }
            var link = Navigation.StateController.getRefreshLink();
            assert.notEqual(link.indexOf('aaA1'), -1);
        });
    });

    describe('Storage Navigate 104 Times', function () {
        it('should set crumb trail to aaZ1', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
            for(var i = 0; i < 104; i++) {
                Navigation.StateController.navigate('d');
            }
            var link = Navigation.StateController.getRefreshLink();
            assert.notEqual(link.indexOf('aaZ1'), -1);
        });
    });

    describe('Storage Navigate 207 Times', function () {
        it('should set crumb trail to aaY3', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
            for(var i = 0; i < 207; i++) {
                Navigation.StateController.navigate('d');
            }
            var link = Navigation.StateController.getRefreshLink();
            assert.notEqual(link.indexOf('aaY3'), -1);
        });
    });

    describe('No Recycle Storage Navigate 50 Times', function () {
        it('should set crumb trail to aaX', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0, 5);
            for(var i = 0; i < 50; i++) {
                Navigation.StateController.navigate('d');
            }
            var link = Navigation.StateController.getRefreshLink();
            assert.notEqual(link.indexOf('aaX'), -1);
        });
    });

    describe('Recycle Storage Navigate 51 Times', function () {
        it('should set crumb trail to aaa', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0, 5);
            for(var i = 0; i < 51; i++) {
                Navigation.StateController.navigate('d');
            }
            var link = Navigation.StateController.getRefreshLink();
            assert.notEqual(link.indexOf('aaa'), -1);
        });
    });

    describe('No Empty Storage Navigate 4 Times', function () {
        it('should remember crumb trail', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0, 5);
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t');
            for(var i = 0; i < 4; i++) {
                Navigation.StateController.navigate('d');
            }
            Navigation.StateController.navigateLink(link);
            assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[0]);
            assert.equal(Navigation.StateController.crumbs.length, 1);
        });
    });

    describe('Navigate5TimesEmptyStorageTest', function () {
        it('should forget crumb trail', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0, 5);
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t');
            for(var i = 0; i < 5; i++) {
                Navigation.StateController.navigate('d');
            }
            Navigation.StateController.navigateLink(link);
            assert.equal(Navigation.StateContext.previousState, null);
            assert.equal(Navigation.StateController.crumbs.length, 0);
        });
    });

    describe('No Storage Length 7 Navigate', function () {
        it('should not set crumb trail to aaa', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(7, 5);
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            assert.equal(link.indexOf('aaa'), -1);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
            assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[0]);
            assert.equal(Navigation.StateController.crumbs.length, 1);
        });
    });

    describe('Storage Length 6 Navigate', function () {
        it('should set crumb trail to aaa', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(6, 5);
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            assert.notEqual(link.indexOf('aaa'), -1);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
            assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[0]);
            assert.equal(Navigation.StateController.crumbs.length, 1);
        });
    });

    describe('Storage Mismtach Navigate', function () {
        it('should forget crumb trail', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
            Navigation.StateController.navigate('d');
            Navigation.StateController.navigate('t');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.settings.crumbTrailPersister = new Navigation.StorageCrumbTrailPersister(0);
            Navigation.StateController.navigate('d');
            Navigation.StateController.navigate('d');
            Navigation.StateController.navigateLink(link);
            assert.equal(Navigation.StateController.crumbs.length, 0);
        });
    });
    
    describe('Transition Custom Persister Navigate', function() {
        it('should set crumb trail to start with x', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.settings.crumbTrailPersister = {
                load: crumbTrail => crumbTrail ? crumbTrail.substring(1) : crumbTrail,
                save: crumbTrail => 'x' + crumbTrail
            };
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.StateController.navigateLink(link);
            assert.notEqual(link.indexOf('c3=x'), -1);
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
            assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[0]);
            assert.equal(Navigation.StateController.crumbs.length, 1);
        });
    });

    describe('Uncombined To Combined Crumb Trail Navigate', function () {
        it('should remember crumb trail', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            Navigation.settings.combineCrumbTrail = false;
            Navigation.StateController.navigate('d');
            Navigation.StateController.navigate('t');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.settings.combineCrumbTrail = true;
            Navigation.StateController.navigateLink(link);
            assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[1]);
            assert.equal(Navigation.StateController.crumbs.length, 2);
        });
    });

    describe('Combined To Unombined Crumb Trail Navigate', function () {
        it('should remember crumb trail', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' },
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' },
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            Navigation.settings.combineCrumbTrail = true;
            Navigation.StateController.navigate('d');
            Navigation.StateController.navigate('t');
            var link = Navigation.StateController.getNavigationLink('t');
            Navigation.settings.combineCrumbTrail = false;
            Navigation.StateController.navigateLink(link);
            assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig._dialogs[0]._states[1]);
            assert.equal(Navigation.StateController.crumbs.length, 2);
        });
    });

    describe('Route Navigate', function () {
        it('should go to State', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 's', trackCrumbTrail: false },
                    { key: 's1', route: 'abc/{x}', trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigateLink('/abc/de');
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
            Navigation.StateController.navigateLink('/s');
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[0]);
        });
    });

    describe('Route Root Navigate', function () {
        it('should go to State', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: '{y}', trackCrumbTrail: false },
                    { key: 's1', route: 's', trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigateLink('/sa');
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[0]);
            Navigation.StateController.navigateLink('/s');
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
        });
    });

    describe('Two Route Navigate', function () {
        it('should go to State', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 's', trackCrumbTrail: false },
                    { key: 's1', route: ['abc/{x}', 'def/{y}'], trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigateLink('/abc/de');
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
            Navigation.StateController.navigateLink('/def/gh');
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
            Navigation.StateController.navigateLink('/s');
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[0]);
        });
    });

    describe('Two Route Root Navigate', function () {
        it('should go to State', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: ['abc/{x}', '{y}'], trackCrumbTrail: false },
                    { key: 's1', route: 's', trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigateLink('/abc/de');
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[0]);
            Navigation.StateController.navigateLink('/sa');
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[0]);
            Navigation.StateController.navigateLink('/s');
            assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs[0]._states[1]);
        });
    });

    describe('Clear State Context', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });

        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.refresh();
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should clear State context', function() {
                Navigation.StateController.clearStateContext();
                assert.strictEqual(Navigation.StateContext.oldState, null);
                assert.strictEqual(Navigation.StateContext.oldDialog, null);
                assert.deepEqual(Navigation.StateContext.oldData, {});
                assert.strictEqual(Navigation.StateContext.previousState, null);
                assert.strictEqual(Navigation.StateContext.previousDialog, null);
                assert.deepEqual(Navigation.StateContext.previousData, {});
                assert.strictEqual(Navigation.StateContext.state, null);
                assert.strictEqual(Navigation.StateContext.dialog, null);
                assert.deepEqual(Navigation.StateContext.data, {});
                assert.strictEqual(Navigation.StateContext.url, null);
                assert.equal(Navigation.StateController.crumbs.length, 0);
            });
        }
    });
});
});