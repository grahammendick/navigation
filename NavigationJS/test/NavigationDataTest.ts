/// <reference path="assert.d.ts" />
/// <reference path="mocha.d.ts" />
import assert = require('assert');
import Crumb = require('../src/Crumb');
import State = require('../src/config/State');
import initStateInfo = require('./initStateInfo');
import Navigation = require('../src/Navigation');

var individualNavigationData = {};
individualNavigationData['string'] = 'Hello';
individualNavigationData['boolean'] = true;
individualNavigationData['number'] = 0;

var arrayNavigationData = {};
arrayNavigationData['array_string'] = ['He-llo', 'World'];
arrayNavigationData['array_boolean'] = [true, false];
arrayNavigationData['array_number'] = [1, 2];

describe('Navigation Data', function () {
    beforeEach(function () {
        initStateInfo();
        Navigation.StateController.clearStateContext();
    });

    describe('Individual Data', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });
        var individualNavigationData = {};
        individualNavigationData['string'] = 'Hello';
        individualNavigationData['boolean'] = true;
        individualNavigationData['number'] = 0;
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', individualNavigationData);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', individualNavigationData);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                var i = 0;
                for (var key in Navigation.StateContext.data) {
                    i++;
                }
                assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
                assert.strictEqual(Navigation.StateContext.data['boolean'], true);
                assert.strictEqual(Navigation.StateContext.data['number'], 0);
                assert.equal(i, 3);
            });
        }
    });

    describe('Individual Data Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r/{string}/{number}' }]}
                ]);
        });
        var individualNavigationData = {};
        individualNavigationData['string'] = 'Hello';
        individualNavigationData['boolean'] = true;
        individualNavigationData['number'] = 0;
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', individualNavigationData);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', individualNavigationData);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                var i = 0;
                for (var key in Navigation.StateContext.data) {
                    i++;
                }
                assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
                assert.strictEqual(Navigation.StateContext.data['boolean'], true);
                assert.strictEqual(Navigation.StateContext.data['number'], 0);
                assert.equal(i, 3);
            });
        }
    });
    
    describe('Individual Data Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', trackCrumbTrail: false }]}
                ]);
        });
        var individualNavigationData = {};
        individualNavigationData['string'] = 'Hello';
        individualNavigationData['boolean'] = true;
        individualNavigationData['number'] = 0;
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', individualNavigationData);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', individualNavigationData);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                var i = 0;
                for (var key in Navigation.StateContext.data) {
                    i++;
                }
                assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
                assert.strictEqual(Navigation.StateContext.data['boolean'], true);
                assert.strictEqual(Navigation.StateContext.data['number'], 0);
                assert.equal(i, 3);
            });
        }
    });

    describe('Array Data', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var arrayNavigationData = {};
        arrayNavigationData['array_string'] = ['He-llo', 'World'];
        arrayNavigationData['array_boolean'] = [true, false];
        arrayNavigationData['array_number'] = [1, 2];
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', arrayNavigationData);
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', arrayNavigationData);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                var i = 0;
                for (var key in Navigation.StateContext.data) {
                    i++;
                }
                assert.strictEqual(Navigation.StateContext.data['array_string'][0], 'He-llo');
                assert.strictEqual(Navigation.StateContext.data['array_string'][1], 'World');
                assert.strictEqual(Navigation.StateContext.data['array_boolean'][0], true);
                assert.strictEqual(Navigation.StateContext.data['array_boolean'][1], false);
                assert.strictEqual(Navigation.StateContext.data['array_number'][0], 1);
                assert.strictEqual(Navigation.StateContext.data['array_number'][1], 2);
                assert.equal(i, 3);
            });
        }
    });

    describe('Invalid Data', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });
        var data = {};
        data['item'] = new Date();
        
        describe('Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => Navigation.StateController.navigate('d', data));
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function () {
                assert.throws(() => Navigation.StateController.getNavigationLink('d', data));
            });
        });
    });

    describe('Invalid Array Data', function () {
        it('should throw error', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.StateController.navigate('d');
            var data = {}
            data['item'] = [new Date()];
            assert.throws(() => Navigation.StateController.navigate('t', data));
        });
    });

    describe('Individual Data Refresh', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            Navigation.StateController.navigate('d');
            Navigation.StateContext.data['item'] = new Date();
        });
        
        describe('Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData(null)));
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function () {
                assert.throws(() => Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData(null)));
            });
        });
    });

    describe('Individual Refresh Data', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            Navigation.StateController.navigate('d');
        });
        
        describe('Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => Navigation.StateController.refresh({ item: new Date() }));
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function () {
                assert.throws(() => Navigation.StateController.getRefreshLink({ item: new Date() }));
            });
        });
    });

    describe('Invalid Types Array Data', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });
        var data = {};
        data['item0'] = ['0', 1];
        data['item1'] = [0, '1'];
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', data);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['item0'][0], '0');
                assert.strictEqual(Navigation.StateContext.data['item0'][1], '1');
                assert.strictEqual(Navigation.StateContext.data['item1'][0], 0);
                assert.strictEqual(Navigation.StateContext.data['item1'][1], 1);
            });
        }
    });

    describe('Invalid Context Data Without Trail', function() {
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
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateContext.data['item'] = new Date();
                Navigation.StateController.navigate('t', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.data['item'] = new Date();
                Navigation.StateController.navigate('t', data);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
            });
        }
    });

    describe('Invalid Context Data Refresh', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateContext.data['item'] = new Date();
                Navigation.StateController.refresh(data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.data['item'] = new Date();
                link = Navigation.StateController.getRefreshLink(data);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
            });
        }
    });

    describe('Invalid Data Without Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', trackCrumbTrail: false }]}
                ]);
        });
        var data = {};
        data['item'] = new Date();
        
        describe('Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => Navigation.StateController.getNavigationLink('d', data));
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function () {
                assert.throws(() => Navigation.StateController.getNavigationLink('d', data));
            });
        });
    });

    describe('Reserved Url Character Data', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data = {};
        data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', data);
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
            });
        }
    });

    describe('Reserved Url Character Route Data', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r/{string}/{number}' }]}
                ]);
        });
        var data = {};
        data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        data['string'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        data['_bool'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        data['number'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', data);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
                assert.strictEqual(Navigation.StateContext.data['string'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
                assert.strictEqual(Navigation.StateContext.data['_bool'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
                assert.strictEqual(Navigation.StateContext.data['number'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
            });
        }
    });

    describe('Separator Url Character Data', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data = {};
        data['_0_1_2_3_4_5_'] = '__00__11__22__33__44__55__';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', data);
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['_0_1_2_3_4_5_'], '__00__11__22__33__44__55__');
            });
        }
    });
    
    describe('Empty String Data', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });
        var data = {};
        data['s'] = '';
        data['t'] = '1';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', data);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], undefined);
                assert.strictEqual(Navigation.StateContext.data['t'], '1');
            });
        }
    });

    describe('Empty String Data', function () {
        it('should populate data', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.StateController.navigate('d');
            Navigation.StateController.navigate('t');
            Navigation.StateContext.data['s'] = '';
            Navigation.StateContext.data['t'] = '1';
            assert.strictEqual(Navigation.StateContext.data['s'], '');
            assert.strictEqual(Navigation.StateContext.data['t'], '1');
        });
    });

    describe('Empty String State Data Back', function() {
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
                Navigation.StateContext.data['s'] = '';
                Navigation.StateContext.data['t'] = '1';
                Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData({}))
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.data['s'] = '';
                Navigation.StateContext.data['t'] = '1';
                link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData({}));
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], undefined);
                assert.strictEqual(Navigation.StateContext.data['t'], '1');
            });
        }
    });

    describe('Navigate Data Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', data);
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
                assert.strictEqual(Navigation.StateContext.data['t'], undefined);
            });
        }
    });

    describe('Change Data Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', data);
                Navigation.StateContext.data['s'] = 'World';
                Navigation.StateContext.data['i'] = 2;
                Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData({}))
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', data);
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.data['s'] = 'World';
                Navigation.StateContext.data['i'] = 2;
                link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData({}));
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], 'World');
                assert.strictEqual(Navigation.StateContext.data['i'], 2);
            });
        }
    });
    
    describe('Blank Data Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', data);
                Navigation.StateContext.data['s'] = null;
                Navigation.StateContext.data['i'] = 2;
                Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData({}))
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', data);
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.data['s'] = null;
                Navigation.StateContext.data['i'] = 2;
                link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData({}));
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], undefined);
                assert.strictEqual(Navigation.StateContext.data['i'], 2);
            });
        }
    });

    describe('Clear Data Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', data);
                Navigation.StateContext.clear();
                Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData({}))
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', data);
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.clear();
                link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData({}));
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], undefined);
                assert.strictEqual(Navigation.StateContext.data['i'], undefined);
            });
        }
    });

    describe('Remove Data Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', data);
                Navigation.StateContext.clear('s');
                Navigation.StateContext.data['i'] = 2;
                Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData({}))
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', data);
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.clear('s');
                Navigation.StateContext.data['i'] = 2;
                link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData({}));
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], undefined);
                assert.strictEqual(Navigation.StateContext.data['i'], 2);
            });
        }
    });

    describe('Data Refresh', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData(null));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData(null));
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
            });
        }
    });

    describe('Refresh Data', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateController.refresh(data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink(data);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
            });
        }
    });

    describe('Refresh Data Override', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data1 = {};
        data1['s'] = 'Hello';
        var data2 = {};
        data2['s'] = 'World';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data1);
                Navigation.StateController.refresh(data2);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data1);
                Navigation.StateController.navigateLink(link);
                var link = Navigation.StateController.getRefreshLink(data2);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], 'World');
            });
        }
    });

    describe('Refresh Data Blank', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], undefined);
            });
        }
    });

    describe('Refresh Data Clear', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateContext.clear();
                Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData(null));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.clear();
                link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData(null));
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.equal(Navigation.StateContext.data['s'], undefined);
            });
        }
    });

    describe('Change Data Refresh', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateContext.data['s'] = 'World';
                Navigation.StateContext.data['n'] = 1;
                Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData(null));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.data['s'] = 'World';
                Navigation.StateContext.data['n'] = 1;
                link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData(null));
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.equal(Navigation.StateContext.data['s'], 'World');
                assert.equal(Navigation.StateContext.data['n'], 1);
            });
        }
    });

    describe('Change Refresh Data', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data1 = {};
        data1['s'] = 'Hello';
        data1['i'] = 3;
        var data2 = {};
        data2['s'] = 'World';
        data2['n'] = 4;
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data1);
                Navigation.StateController.refresh(data2);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data1);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink(data2);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], 'World');
                assert.strictEqual(Navigation.StateContext.data['n'], 4);
                assert.strictEqual(Navigation.StateContext.data['i'], undefined);
            });
        }
    });

    describe('Change Dynamic Data Refresh Override', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data: any = {};
        data.s = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateContext.data.s = 'World';
                Navigation.StateContext.data.d = '2000-1-3';
                Navigation.StateContext.data.i = 3;
                data = Navigation.StateContext.includeCurrentData({
                    s: 'Hello World',
                    i: null,
                    n: 2
                });
                Navigation.StateController.refresh(data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.data.s = 'World';
                Navigation.StateContext.data.d = '2000-1-3';
                Navigation.StateContext.data.i = 3;
                data = Navigation.StateContext.includeCurrentData({
                    s: 'Hello World',
                    i: null,
                    n: 2
                });
                link = Navigation.StateController.getRefreshLink(data);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data.s, 'Hello World');
                assert.strictEqual(Navigation.StateContext.data.d, '2000-1-3');
                assert.strictEqual(Navigation.StateContext.data.i, undefined);
                assert.strictEqual(Navigation.StateContext.data.n, 2);
                assert.strictEqual(Navigation.StateContext.data['n'], 2);
            });
        }
    });

    describe('Wizard Data', function() {
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
        var data = {
            s: 'Hello',
            n: 5
        };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t', Navigation.StateContext.includeCurrentData(null));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', Navigation.StateContext.includeCurrentData(null));
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 'Hello');
                assert.strictEqual(Navigation.StateController.crumbs[1].data['n'], 5);
                assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
                assert.strictEqual(Navigation.StateContext.data['n'], 5);
            });
        }
    });

    describe('Transition Transition', function() {
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
        var data1 = {};
        data1['s'] = 1;
        var data2 = {};
        data2['s'] = 2;
        data2['t'] = '2';
        var data3 = {};
        data3['s'] = 3;
        data3['t'] = '3';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', data1);
                Navigation.StateController.navigate('t', data2);
                Navigation.StateController.navigate('t', data3);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', data1);
                Navigation.StateController.navigateLink(link);
                assert.strictEqual(Navigation.StateContext.data['s'], 1);
                assert.strictEqual(Navigation.StateContext.data['t'], undefined);
                link = Navigation.StateController.getNavigationLink('t', data2);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data3);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 1);
                assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 2);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
                assert.strictEqual(Navigation.StateContext.data['s'], 3);
                assert.strictEqual(Navigation.StateContext.data['t'], '3');
            });
        }
    });

    describe('Dynamic Data Transition Transition', function() {
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
        var data1: any = {};
        data1.s = 1;
        var data2: any = {};
        data2.s = '2';
        var data3: any = {};
        data3.s = '3';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', data1);
                Navigation.StateController.navigate('t', data2);
                Navigation.StateController.navigate('t', data3);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', data1);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data2);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data3);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateController.crumbs[0].data.s, 1);
                assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 1);
                assert.strictEqual(Navigation.StateController.crumbs[1].data.s, '2');
                assert.strictEqual(Navigation.StateContext.data.s, '3');
            });
        }
    });

    describe('Change Data Transition Transition', function() {
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
        var data1 = {};
        data1['s'] = 1;
        var data2 = {};
        data2['s'] = 2;
        data2['t'] = '2';
        var data3 = {};
        data3['s'] = 3;
        data3['t'] = '3';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', data1);
                Navigation.StateContext.data['s'] = 11;
                Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData({}))
                Navigation.StateController.navigate('t', data2);
                Navigation.StateContext.data['s'] = '22';
                Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData({}))
                Navigation.StateController.navigate('t', data3);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', data1);
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.data['s'] = 11;
                link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData({}));
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data2);
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.data['s'] = '22';
                link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData({}));
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data3);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 11);
                assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], '22');
                assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
                assert.strictEqual(Navigation.StateContext.data['s'], 3);
                assert.strictEqual(Navigation.StateContext.data['t'], '3');
            });
        }
    });

    describe('Change Crumb Data Back', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d', data);
                Navigation.StateController.navigate('t');
                var crumb = Navigation.StateController.crumbs[0];
                crumb.data['s'] = 'Changed';
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                var crumb = Navigation.StateController.crumbs[0];
                crumb.data['s'] = 'Changed';
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
            });
        }
    });

    describe('Defaults', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }]}
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
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
                assert.strictEqual(Navigation.StateContext.data['_bool'], true);
                assert.strictEqual(Navigation.StateContext.data['number'], 1);
            });
        }
    });

    describe('Defaults Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }]}
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
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
                assert.strictEqual(Navigation.StateContext.data['_bool'], true);
                assert.strictEqual(Navigation.StateContext.data['number'], 1);
            });
        }
    });

    describe('Data Defaults', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateContext.data['string'] = null;
                Navigation.StateContext.data['number'] = 'Hello';
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.data['string'] = null;
                Navigation.StateContext.data['number'] = 'Hello';
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['string'], null);
                assert.strictEqual(Navigation.StateContext.data['_bool'], true);
                assert.strictEqual(Navigation.StateContext.data['number'], 'Hello');
            });
        }
    });

    describe('Data Defaults Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateContext.data['string'] = null;
                Navigation.StateContext.data['number'] = 'Hello';
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.data['string'] = null;
                Navigation.StateContext.data['number'] = 'Hello';
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['string'], null);
                assert.strictEqual(Navigation.StateContext.data['_bool'], true);
                assert.strictEqual(Navigation.StateContext.data['number'], 'Hello');
            });
        }
    });

    describe('Remove Defaults', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { emptyString: '', 'number': 4, char: 7 } }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateContext.clear('emptyString');
                Navigation.StateContext.clear('number');
                Navigation.StateContext.clear('char');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.clear('emptyString');
                Navigation.StateContext.clear('number');
                Navigation.StateContext.clear('char');
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
                assert.strictEqual(Navigation.StateContext.data['number'], 4);
                assert.strictEqual(Navigation.StateContext.data['char'], 7);
            });
        }
    });

    describe('Remove Defaults Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{char}/{number?}', defaults: { emptyString: '', 'number': 4, char: 7 } }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateContext.clear('emptyString');
                Navigation.StateContext.clear('number');
                Navigation.StateContext.clear('char');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.clear('emptyString');
                Navigation.StateContext.clear('number');
                Navigation.StateContext.clear('char');
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
                assert.strictEqual(Navigation.StateContext.data['number'], 4);
                assert.strictEqual(Navigation.StateContext.data['char'], 7);
            });
        }
    });

    describe('Data And Defaults', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { emptyString: '', 'number': 4, char: 7 } }]}
                ]);
        });
        var data = { s: 1, t: '', 'number': '' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
                assert.strictEqual(Navigation.StateContext.data['number'], 4);
                assert.strictEqual(Navigation.StateContext.data['char'], 7);
                assert.strictEqual(Navigation.StateContext.data['s'], 1);
                assert.strictEqual(Navigation.StateContext.data['t'], undefined);
            });
        }
    });

    describe('Data And Defaults Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{char}/{number?}', defaults: { emptyString: '', 'number': 4, char: 7 } }]}
                ]);
        });
        var data = { s: 1, t: '', 'number': '' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
                assert.strictEqual(Navigation.StateContext.data['number'], 4);
                assert.strictEqual(Navigation.StateContext.data['char'], 7);
                assert.strictEqual(Navigation.StateContext.data['s'], 1);
                assert.strictEqual(Navigation.StateContext.data['t'], undefined);
            });
        }
    });

    describe('Override Defaults', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { emptyString: '', 'number': 4, char: 7 } }]}
                ]);
        });
        var data = { emptyString: 2, 'number': 1, char: 5 };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], 2);
                assert.strictEqual(Navigation.StateContext.data['number'], 1);
                assert.strictEqual(Navigation.StateContext.data['char'], 5);
            });
        }
    });

    describe('Override Defaults Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{char}/{number?}', defaults: { emptyString: '', 'number': 4, char: 7 } }]}
                ]);
        });
        var data = { emptyString: 2, 'number': 1, char: 5 };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], 2);
                assert.strictEqual(Navigation.StateContext.data['number'], 1);
                assert.strictEqual(Navigation.StateContext.data['char'], 5);
            });
        }
    });

    describe('Defaults Override', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { emptyString: '', 'number': 4, char: 7 } }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateContext.data['emptyString'] = 'Hello';
                Navigation.StateContext.data['number'] = 4;
                Navigation.StateContext.data['char'] = 5;
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.data['emptyString'] = 'Hello';
                Navigation.StateContext.data['number'] = 4;
                Navigation.StateContext.data['char'] = 5;
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], 'Hello');
                assert.strictEqual(Navigation.StateContext.data['number'], 4);
                assert.strictEqual(Navigation.StateContext.data['char'], 5);
            });
        }
    });

    describe('Defaults Override Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{char}/{number?}', defaults: { emptyString: '', 'number': 4, char: 7 } }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t');
                Navigation.StateContext.data['emptyString'] = 'Hello';
                Navigation.StateContext.data['number'] = 4;
                Navigation.StateContext.data['char'] = 5;
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.data['emptyString'] = 'Hello';
                Navigation.StateContext.data['number'] = 4;
                Navigation.StateContext.data['char'] = 5;
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], 'Hello');
                assert.strictEqual(Navigation.StateContext.data['number'], 4);
                assert.strictEqual(Navigation.StateContext.data['char'], 5);
            });
        }
    });

    describe('Clear Data And Defaults', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { emptyString: '', 'number': 4, char: 7 } }]}
                ]);
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateContext.clear();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.clear();
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
                assert.strictEqual(Navigation.StateContext.data['number'], 4);
                assert.strictEqual(Navigation.StateContext.data['char'], 7);
                assert.strictEqual(Navigation.StateContext.data['s'], undefined);
                assert.strictEqual(Navigation.StateContext.data['t'], undefined);
            });
        }
    });

    describe('Clear Data And Defaults Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{char}/{number?}', defaults: { emptyString: '', 'number': 4, char: 7 } }]}
                ]);
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateContext.clear();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                Navigation.StateContext.clear();
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
                assert.strictEqual(Navigation.StateContext.data['number'], 4);
                assert.strictEqual(Navigation.StateContext.data['char'], 7);
                assert.strictEqual(Navigation.StateContext.data['s'], undefined);
                assert.strictEqual(Navigation.StateContext.data['t'], undefined);
            });
        }
    });

    describe('Back Defaults', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
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
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
                assert.strictEqual(Navigation.StateContext.data['_bool'], true);
                assert.strictEqual(Navigation.StateContext.data['number'], 1);
            });
        }
    });

    describe('Back Defaults Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
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
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
                assert.strictEqual(Navigation.StateContext.data['_bool'], true);
                assert.strictEqual(Navigation.StateContext.data['number'], 1);
            });
        }
    });

    describe('Back Data And Defaults', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
                assert.strictEqual(Navigation.StateContext.data['number'], 4);
                assert.strictEqual(Navigation.StateContext.data['char'], 7);
                assert.strictEqual(Navigation.StateContext.data['s'], 1);
                assert.strictEqual(Navigation.StateContext.data['t'], '2');
            });
        }
    });

    describe('Back Data And Defaults Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{char}/{number?}', defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
                assert.strictEqual(Navigation.StateContext.data['number'], 4);
                assert.strictEqual(Navigation.StateContext.data['char'], 7);
                assert.strictEqual(Navigation.StateContext.data['s'], 1);
                assert.strictEqual(Navigation.StateContext.data['t'], '2');
            });
        }
    });

    describe('Back Override Defaults', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], 'World');
                assert.strictEqual(Navigation.StateContext.data['number'], 1);
                assert.strictEqual(Navigation.StateContext.data['char'], 5);
            });
        }
    });

    describe('Back Override Defaults Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{char}/{number?}', defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], 'World');
                assert.strictEqual(Navigation.StateContext.data['number'], 1);
                assert.strictEqual(Navigation.StateContext.data['char'], 5);
            });
        }
    });

    describe('Crumb Defaults', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
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
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[0].data['_bool'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
                assert.strictEqual(Navigation.StateController.crumbs[2].data['emptyString'], '');
                assert.strictEqual(Navigation.StateController.crumbs[2].data['number'], 4);
                assert.strictEqual(Navigation.StateController.crumbs[2].data['char'], 7);
            });
        }
    });

    describe('Crumb Defaults Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1/{string}/{number}', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2/{char}/{number?}', defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3' }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
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
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[0].data['_bool'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
                assert.strictEqual(Navigation.StateController.crumbs[2].data['emptyString'], '');
                assert.strictEqual(Navigation.StateController.crumbs[2].data['number'], 4);
                assert.strictEqual(Navigation.StateController.crumbs[2].data['char'], 7);
            });
        }
    });

    describe('Crumb Data And Defaults', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 1);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
            });
        }
    });

    describe('Crumb Data And Defaults Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 1);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
            });
        }
    });

    describe('Crumb Data And Defaults', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'World');
                assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
            });
        }
    });

    describe('Crumb Data And Defaults Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'World');
                assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
            });
        }
    });

    describe('Override Crumb Defaults', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        var data = {};
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                var crumb = Navigation.StateController.crumbs[1];
                crumb.data['string'] = 'Hello';
                crumb.data['number'] = 0;
                assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
            });
        }
    });

    describe('Override Crumb Defaults Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
        });
        var data = {};
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                var crumb = Navigation.StateController.crumbs[1];
                crumb.data['string'] = 'Hello';
                crumb.data['number'] = 0;
                assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
            });
        }
    });

    describe('Back Defaults Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r4' }]}
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
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(3);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(3);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
                assert.strictEqual(Navigation.StateContext.data['_bool'], true);
                assert.strictEqual(Navigation.StateContext.data['number'], 1);
            });
        }
    });

    describe('Back Defaults Custom Trail Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r4' }]}
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
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(3);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(3);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
                assert.strictEqual(Navigation.StateContext.data['_bool'], true);
                assert.strictEqual(Navigation.StateContext.data['number'], 1);
            });
        }
    });

    describe('Back Data And Defaults Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3' }]}
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
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.refresh();
                Navigation.StateController.navigateBack(2);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(2);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
                assert.strictEqual(Navigation.StateContext.data['number'], 4);
                assert.strictEqual(Navigation.StateContext.data['char'], 7);
                assert.strictEqual(Navigation.StateContext.data['s'], 1);
                assert.strictEqual(Navigation.StateContext.data['t'], '2');
            });
        }
    });

    describe('Back Data And Defaults Custom Trail Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{char}/{number?}', defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3' }]}
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
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.refresh();
                Navigation.StateController.navigateBack(2);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getRefreshLink();
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(2);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
                assert.strictEqual(Navigation.StateContext.data['number'], 4);
                assert.strictEqual(Navigation.StateContext.data['char'], 7);
                assert.strictEqual(Navigation.StateContext.data['s'], 1);
                assert.strictEqual(Navigation.StateContext.data['t'], '2');
            });
        }
    });

    describe('Back Override Defaults Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r4' }]}
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
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
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
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], 'World');
                assert.strictEqual(Navigation.StateContext.data['number'], 1);
                assert.strictEqual(Navigation.StateContext.data['char'], 5);
            });
        }
    });

    describe('Back Override Defaults Custom Trail Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{char}/{number?}', defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r4' }]}
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
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.navigateBack(1);
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
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
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['emptyString'], 'World');
                assert.strictEqual(Navigation.StateContext.data['number'], 1);
                assert.strictEqual(Navigation.StateContext.data['char'], 5);
            });
        }
    });

    describe('Crumb Defaults Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', defaults: { emptyString: '', 'number': 4, char: 7 } }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r4' }]}
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
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[0].data['number'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
                assert.strictEqual(Navigation.StateController.crumbs[2].data['emptyString'], '');
                assert.strictEqual(Navigation.StateController.crumbs[2].data['number'], 4);
                assert.strictEqual(Navigation.StateController.crumbs[2].data['char'], 7);
            });
        }
    });

    describe('Crumb Defaults Custom Trail Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1/{string}/{number}', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2/{char}/{number?}', defaults: { emptyString: '', 'number': 4, char: 7 } }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r4' }]}
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
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
                Navigation.StateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[0].data['number'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
                assert.strictEqual(Navigation.StateController.crumbs[2].data['emptyString'], '');
                assert.strictEqual(Navigation.StateController.crumbs[2].data['number'], 4);
                assert.strictEqual(Navigation.StateController.crumbs[2].data['char'], 7);
            });
        }
    });

    describe('Back Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r1'}]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                return crumbs;
            };
        });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0', data);
                Navigation.StateController.navigate('d1');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
                assert.strictEqual(Navigation.StateContext.data['t'], undefined);
            });
        }
    });

    describe('Back Custom Trail Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r/{s}' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r1'}]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                return crumbs;
            };
        });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0', data);
                Navigation.StateController.navigate('d1');
                Navigation.StateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationBackLink(1);
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
                assert.strictEqual(Navigation.StateContext.data['t'], undefined);
            });
        }
    });

    describe('Crumb Data And Defaults Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                return crumbs;
            };
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 1);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
            });
        }
    });

    describe('Crumb Data And Defaults Custom Trail Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                return crumbs;
            };
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 1);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
            });
        }
    });

    describe('Override Crumb Defaults Custom Trail', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                return crumbs;
            };
        });
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'World');
                assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
            });
        }
    });

    describe('Override Crumb Defaults Custom Trail Route', function() {
        beforeEach(function() {
            Navigation.StateInfoConfig.build([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3' }]}
                ]);
            var state = Navigation.StateInfoConfig.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state: State, crumbs: Crumb[]): Crumb[] => {
                return crumbs;
            };
        });
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        
        describe('Navigate', function() {
            beforeEach(function() {
                Navigation.StateController.navigate('d0');
                Navigation.StateController.navigate('t', data);
                Navigation.StateController.navigate('t');
                Navigation.StateController.navigate('d1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = Navigation.StateController.getNavigationLink('d0');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t', data);
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('t');
                Navigation.StateController.navigateLink(link);
                link = Navigation.StateController.getNavigationLink('d1');
                Navigation.StateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'World');
                assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
                assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
            });
        }
    });

    describe('Link Defaults Navigate', function() {
        it('should not include defaults in link', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r', defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }]}
                ]);
            var data = {};
            data['_bool'] = null;
            data['string'] = 'Hello';
            data['number'] = 1;
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t', data);
            assert.equal(link.indexOf('string'), -1);
            assert.equal(link.indexOf('_bool'), -1);
            assert.equal(link.indexOf('number'), -1);
            assert.notEqual(link.indexOf('r?'), -1);
        });
    });

    describe('Link Defaults Route Navigate', function() {
        it('should not include defaults in link', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }]}
                ]);
            var data = {};
            data['_bool'] = null;
            data['string'] = 'Hello';
            data['number'] = 1;
            Navigation.StateController.navigate('d');
            var link = Navigation.StateController.getNavigationLink('t', data);
            assert.equal(link.indexOf('string'), -1);
            assert.equal(link.indexOf('_bool'), -1);
            assert.equal(link.indexOf('number'), -1);
            assert.notEqual(link.indexOf('r?'), -1);
        });
    });

    describe('Link Context Defaults Navigate', function() {
        it('should not include defaults in link', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r', defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d');
            Navigation.StateController.navigate('t');
            Navigation.StateContext.data['emptyString'] = 1;
            Navigation.StateContext.data['number'] = 4;
            Navigation.StateContext.data['char'] = null;
            Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData({}))
            var link = Navigation.StateController.getNavigationLink('t');
            assert.equal(link.indexOf('number'), -1);
            assert.equal(link.indexOf('char'), -1);
            assert.notEqual(link.indexOf('emptyString'), -1);
        });
    });

    describe('Link Context Defaults Route Navigate', function() {
        it('should not include defaults in link', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{char}/{number?}', defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d');
            Navigation.StateController.navigate('t');
            Navigation.StateContext.data['emptyString'] = 1;
            Navigation.StateContext.data['number'] = 4;
            Navigation.StateContext.data['char'] = null;
            Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData({}))
            var link = Navigation.StateController.getNavigationLink('t');
            assert.equal(link.indexOf('number'), -1);
            assert.equal(link.indexOf('char'), -1);
            assert.notEqual(link.indexOf('emptyString'), -1);
        });
    });

    describe('Refresh Link Defaults Navigate', function() {
        it('should not include defaults in link', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r', defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }]}
                ]);
            Navigation.StateController.navigate('d');
            Navigation.StateController.navigate('t');
            Navigation.StateContext.data['_bool'] = null;
            Navigation.StateContext.data['string'] = 'Hello';
            Navigation.StateContext.data['number'] = 0;
            var link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData({}));
            assert.equal(link.indexOf('string'), -1);
            assert.equal(link.indexOf('_bool'), -1);
            assert.notEqual(link.indexOf('number'), -1);
        });
    });

    describe('Back Link Defaults Navigate', function() {
        it('should not include defaults in link', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d');
            Navigation.StateController.navigate('t');
            Navigation.StateContext.data['_bool'] = null;
            Navigation.StateContext.data['string'] = 'Hello';
            Navigation.StateContext.data['number'] = 0;
            Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData({}))
            Navigation.StateController.navigate('t');
            var link = Navigation.StateController.getNavigationBackLink(1);
            assert.equal(link.indexOf('string'), -1);
            assert.equal(link.indexOf('_bool'), -1);
            assert.notEqual(link.indexOf('number'), -1);
        });
    });

    describe('Crumb Link Defaults Navigate', function() {
        it('should not include defaults in link', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            Navigation.StateController.navigate('d');
            Navigation.StateController.navigate('t');
            Navigation.StateContext.data['number'] = 1;
            Navigation.StateContext.data['_bool'] = '';
            Navigation.StateContext.data['string'] = 4;
            Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData({}))
            Navigation.StateController.navigate('t');
            var link = Navigation.StateController.crumbs[1].navigationLink;
            assert.equal(link.indexOf('_bool'), -1);
            assert.equal(link.indexOf('number'), -1);
            assert.notEqual(link.indexOf('string'), -1);
        });
    });

    describe('Link Navigate', function() {
        it('should include data in link', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            Navigation.StateController.navigate('d');
            Navigation.StateContext.data['_number'] = 1;
            Navigation.StateContext.data['string'] = 'Hello';
            Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData({}))
            var link = Navigation.StateController.getNavigationLink('t');
            assert.notEqual(link.indexOf('_number'), -1);
            assert.notEqual(link.indexOf('string'), -1);
        });
    });

    describe('Link Without Trail Navigate', function() {
        it('should include data but not crumb trail in link', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false }]}
                ]);
            Navigation.StateController.navigate('d');
            Navigation.StateContext.data['_number'] = 1;
            Navigation.StateContext.data['string'] = 'Hello';
            Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData({}))
            var link = Navigation.StateController.getNavigationLink('t');
            assert.equal(link.indexOf('c1'), -1);
            assert.equal(link.indexOf('_number'), -1);
            assert.equal(link.indexOf('string'), -1);
        });
    });

    describe('Link Default Types Navigate', function() {
        it('should populate data', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', defaultTypes: { 'string': 'string', 'number': 'number', 'boolean': 'boolean' } }]}
                ]);
            var individualNavigationData = {};
            individualNavigationData['string'] = 'Hello';
            individualNavigationData['boolean'] = true;
            individualNavigationData['number'] = 0;
            Navigation.StateController.navigate('d', individualNavigationData);
            var i = 0;
            for (var key in Navigation.StateContext.data) {
                i++;
            }
            assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
            assert.strictEqual(Navigation.StateContext.data['boolean'], true);
            assert.strictEqual(Navigation.StateContext.data['number'], 0);
            assert.equal(i, 3);
        });
    });

    describe('Link Default Types Navigate', function() {
        it('should not include default types in link', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', defaultTypes: { s1: 'string', s2: 'number' } }]}
                ]);
            var data = { s1: 'hello', s2: 'world' };
            var url = Navigation.StateController.getNavigationLink('d', data);
            assert.notEqual(url.indexOf('s1=hello&'), -1);
            assert.notEqual(url.indexOf('s2=world2_'), -1);
        });
    });

    describe('Link Default Types Bool Navigate', function() {
        it('should not include default types in link', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', defaultTypes: { b1: 'boolean' } }]}
                ]);
            var data = { b1: true, b2: false };
            var url = Navigation.StateController.getNavigationLink('d', data);
            assert.notEqual(url.indexOf('b1=true&'), -1);
            assert.notEqual(url.indexOf('b2=false2_'), -1);
        });
    });

    describe('Link Default Types Number Navigate', function() {
        it('should not include default types in link', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', defaultTypes: { n1: 'number' } }]}
                ]);
            var data = { n1: 0, n2: 1 };
            var url = Navigation.StateController.getNavigationLink('d', data);
            assert.notEqual(url.indexOf('n1=0&'), -1);
            assert.notEqual(url.indexOf('n2=12_'), -1);
        });
    });

    describe('Link Default Types Back Navigate', function() {
        it('should not include default types in link', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', defaultTypes: { s1: 'string', s2: 'number', n1: 'number' }, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            var data = {
                s2: 'world',
                n1: 0,
                n2: 1
            };
            data['s1'] = 'hello';
            Navigation.StateController.navigate('d', data);
            Navigation.StateController.navigate('t');
            var url = Navigation.StateController.getNavigationBackLink(1);
            assert.notEqual(url.indexOf('s1=hello&'), -1);
            assert.notEqual(url.indexOf('s2=world2_'), -1);
            assert.notEqual(url.indexOf('n1=0&'), -1);
            assert.notEqual(url.indexOf('n2=12_'), -1);
        });
    });

    describe('Link Default Types Refresh Navigate', function() {
        it('should not include default types in link', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', defaultTypes: { s1: 'string', s2: 'number', n1: 'number' } }]}
                ]);
            var data = {
                s1: 'hello',
                s2: 'world',
                n1: 0,
                n2: 1
            };
            Navigation.StateController.navigate('d', data);
            var url = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData(null));
            assert.notEqual(url.indexOf('s1=hello&'), -1);
            assert.notEqual(url.indexOf('s2=world2_'), -1);
            assert.notEqual(url.indexOf('n1=0&'), -1);
            assert.notEqual(url.indexOf('n2=12_'), -1);
        });
    });

    describe('Link Default Types Back Two Navigate', function() {
        it('should not include default types in link', function() {
            Navigation.StateInfoConfig.build([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', defaultTypes: { _bool: 'nsumber' }, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2' }]}
                ]);
            var data = {
                _bool: 1
            };
            Navigation.StateController.navigate('d', data);
            Navigation.StateController.navigate('t');
            Navigation.StateController.navigate('t');
            var url = Navigation.StateController.getNavigationBackLink(2);
            assert.notEqual(url.indexOf('_bool=1&'), -1);
        });
    });

    it('NavigateOverrideDefaultTypesTest', function () {
        Navigation.StateController.navigate('d1');
        var data = {};
        data['s1'] = true;
        data['b1'] = 0;
        data['n1'] = 'hello';
        Navigation.StateController.navigate('t0', data);
        assert.strictEqual(Navigation.StateContext.data['s1'], true);
        assert.strictEqual(Navigation.StateContext.data['b1'], 0);
        assert.strictEqual(Navigation.StateContext.data['n1'], 'hello');
    });

    it('NavigateOverrideDefaultTypesLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d1');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['s1'] = true;
        data['b1'] = 0;
        data['n1'] = 'hello';
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s1'], true);
        assert.strictEqual(Navigation.StateContext.data['b1'], 0);
        assert.strictEqual(Navigation.StateContext.data['n1'], 'hello');
    });

    it('NavigateRefreshOverrideDefaultTypesTest', function () {
        Navigation.StateController.navigate('d1');
        var data = {};
        data['s1'] = true;
        data['b1'] = 0;
        data['n1'] = 'hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData(null));
        assert.strictEqual(Navigation.StateContext.data['s1'], true);
        assert.strictEqual(Navigation.StateContext.data['b1'], 0);
        assert.strictEqual(Navigation.StateContext.data['n1'], 'hello');
    });

    it('NavigateRefreshOverrideDefaultTypesLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d1');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['s1'] = true;
        data['b1'] = 0;
        data['n1'] = 'hello';
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData(null));
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s1'], true);
        assert.strictEqual(Navigation.StateContext.data['b1'], 0);
        assert.strictEqual(Navigation.StateContext.data['n1'], 'hello');
    });

    it('NavigateBackOverrideDefaultTypesTest', function () {
        Navigation.StateController.navigate('d1');
        var data = {};
        data['s1'] = true;
        data['b1'] = 0;
        data['n1'] = 'hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(2);
        Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData({}));
        assert.strictEqual(Navigation.StateContext.data['s1'], true);
        assert.strictEqual(Navigation.StateContext.data['b1'], 0);
        assert.strictEqual(Navigation.StateContext.data['n1'], 'hello');
    });

    it('NavigateBackOverrideDefaultTypesLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d1');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['s1'] = true;
        data['b1'] = 0;
        data['n1'] = 'hello';
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(2);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData({}));
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s1'], true);
        assert.strictEqual(Navigation.StateContext.data['b1'], 0);
        assert.strictEqual(Navigation.StateContext.data['n1'], 'hello');
    });

    it('ReservedUrlCharacterDefaultTypesTest', function () {
        var data = {};
        data['*/()-_+~@:?><.;[]{}!£$%^#&'] = 0;
        data['**=/()-_+~@:?><.;[]{}!£$%^#&&'] = 1;
        Navigation.StateController.navigate('d1', data);
        var url = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData({}));
        assert.notEqual(url.indexOf('=0&'), -1);
        assert.notEqual(url.indexOf('=12_'), -1);
        assert.strictEqual(Navigation.StateContext.data['*/()-_+~@:?><.;[]{}!£$%^#&'], 0);
        assert.strictEqual(Navigation.StateContext.data['**=/()-_+~@:?><.;[]{}!£$%^#&&'], 1);
        Navigation.StateController.navigate('t0');
        url = Navigation.StateController.getNavigationBackLink(1);
        assert.notEqual(url.indexOf('=0&'), -1);
        assert.notEqual(url.indexOf('=12_'), -1);
    });

    it('SeparatorUrlCharacterDefaultTypesTest', function () {
        var data = {};
        data['_0_1_2_3_4_5_'] = 10;
        data['__0_1_2_3_4_5_'] = 20;
        Navigation.StateController.navigate('d1', data);
        var url = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData(null));
        assert.notEqual(url.indexOf('=10&'), -1);
        assert.notEqual(url.indexOf('=202_'), -1);
        assert.strictEqual(Navigation.StateContext.data['_0_1_2_3_4_5_'], 10);
        assert.strictEqual(Navigation.StateContext.data['__0_1_2_3_4_5_'], 20);
        Navigation.StateController.navigate('t0');
        url = Navigation.StateController.getNavigationBackLink(1);
        assert.notEqual(url.indexOf('=10&'), -1);
        assert.notEqual(url.indexOf('=202_'), -1);
    });

    it('NavigateRefreshCurrentDataTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        data['n'] = 1;
        data['c'] = '1';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData(null, ['s', 'c']));
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['c'], '1');
        assert.strictEqual(Navigation.StateContext.data['n'], undefined);
    });

    it('NavigateRefreshCurrentDataLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['s'] = 'Hello';
        data['n'] = 1;
        data['c'] = '1';
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData(null, ['s', 'c']));
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['c'], '1');
        assert.strictEqual(Navigation.StateContext.data['n'], undefined);
    });

    it('NavigateCurrentDataDefaultsTest', function () {
        var data = {};
        data['emptyString'] = 'Hello';
        data['number'] = 1;
        data['char'] = '6';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateController.navigate('t0', Navigation.StateContext.includeCurrentData(null));
        Navigation.StateController.navigate('t0', Navigation.StateContext.includeCurrentData({}, ['number', 'char']));
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], '6');
    });

    it('NavigateCurrentDataDefaultsLinkTest', function () {
        var data = {};
        data['emptyString'] = 'Hello';
        data['number'] = 1;
        data['char'] = '6';
        var link = Navigation.StateController.getNavigationLink('d0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0', Navigation.StateContext.includeCurrentData(null));
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0', Navigation.StateContext.includeCurrentData({}, ['number', 'char']));
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], '6');
    });

    it('NavigateMissingRouteDataTest', function () {
        Navigation.StateController.navigate('d4');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        assert.throws(() => Navigation.StateController.navigate('t0'));
    });

    it('NavigateMissingRouteDataLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d4');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.equal(Navigation.StateController.getNavigationLink('t0'), null);
    });

    it('NavigateRefreshMissingRouteDataTest', function () {
        Navigation.StateController.navigate('d4');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0', { s1: 1, s2: 2 });
        assert.throws(() => Navigation.StateController.refresh());
    });

    it('NavigateRefreshMissingRouteDataLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d4');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0', { s1: 1, s2: 2 });
        Navigation.StateController.navigateLink(link);
        assert.equal(Navigation.StateController.getRefreshLink(), null);
    });

    it('NavigateInvalidNumberTest', function () {
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t0', { 'number': 35 });
        link = link.replace('number=35', 'number=invalid');
        assert.throws(() => Navigation.StateController.navigateLink(link));
    });

    it('NavigateInvalidBooleanTest', function () {
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t0', { '_bool': false });
        link = link.replace('_bool=false', '_bool=invalid');
        assert.throws(() => Navigation.StateController.navigateLink(link));
    });

    it('WithoutTypesNavigateBackTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's0', states: [
                { key: 's0', route: 's0', trackTypes: false, trackCrumbTrail: false, transitions: [
                    { key: 't0', to: 's1' }
                ]},
                { key: 's1', route: 's1', transitions: [
                    { key: 't0', to: 's2' }
                ]},
                { key: 's2', route: 's2' }]}
            ]);
        Navigation.StateController.navigate('d', { x: '0_1_2_' });
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var link = Navigation.StateController.getNavigationBackLink(2);
        Navigation.StateController.navigateBack(2);
        assert.strictEqual ('/s0?x=0_1_2_', link);
        assert.strictEqual(Navigation.StateContext.data.x, '0_1_2_');
    });

    it('WithoutTypesDefaultNavigateBackTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's0', states: [
                { key: 's0', route: 's0', trackTypes: false, defaults: { x: 2 }, defaultTypes: { y: 'boolean' }, trackCrumbTrail: false, transitions: [
                    { key: 't0', to: 's1' }
                ]},
                { key: 's1', route: 's1', transitions: [
                    { key: 't0', to: 's2' }
                ]},
                { key: 's2', route: 's2' }]}
            ]);
        Navigation.StateController.navigate('d', { x: '3', y: 'true' });
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var link = Navigation.StateController.getNavigationBackLink(2);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data.x, 3);
        assert.strictEqual(Navigation.StateContext.data.y, true);
    });

    it('WithoutTypesArrayTypeTest', function () {
        Navigation.StateInfoConfig.build([
            { key: 'd', initial: 's', states: [
                { key: 's', route: '{x}', trackTypes: false, defaultTypes: { x: 'numberarray', y: 'stringarray' }, trackCrumbTrail: false }]}
            ]);
        Navigation.StateController.navigate('d', { x: [ 1, 2, '3' ], y: [ '_0_1', '-2-3', 4 ] });
        assert.strictEqual(Navigation.StateContext.data.x[0], 1);
        assert.strictEqual(Navigation.StateContext.data.x[1], 2);
        assert.strictEqual(Navigation.StateContext.data.x[2], 3);
        assert.strictEqual(Navigation.StateContext.data.y[0], '_0_1');
        assert.strictEqual(Navigation.StateContext.data.y[1], '-2-3');
        assert.strictEqual(Navigation.StateContext.data.y[2], '4');
    });
});