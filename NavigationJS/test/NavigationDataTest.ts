/// <reference path="assert.d.ts" />
/// <reference path="mocha.d.ts" />
import assert = require('assert');
import Navigation = require('../src/Navigation');
import StateController = require('../src/StateController');

describe('Navigation Data', function () {
    describe('Individual Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });
        var individualNavigationData = {};
        individualNavigationData['string'] = 'Hello';
        individualNavigationData['boolean'] = true;
        individualNavigationData['number'] = 0;
        individualNavigationData['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', individualNavigationData);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', individualNavigationData);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['boolean'], true);
                assert.strictEqual(stateController.stateContext.data['number'], 0);
                assert.strictEqual(+stateController.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateController.stateContext.data).length, 4);
            });
        }
    });

    describe('Individual Data Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r/{string}/{boolean}/{number}/{date}' }]}
                ]);
        });
        var individualNavigationData = {};
        individualNavigationData['string'] = 'Hello';
        individualNavigationData['boolean'] = true;
        individualNavigationData['number'] = 0;
        individualNavigationData['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', individualNavigationData);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', individualNavigationData);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['boolean'], true);
                assert.strictEqual(stateController.stateContext.data['number'], 0);
                assert.strictEqual(+stateController.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateController.stateContext.data).length, 4);
            });
        }
    });
    
    describe('Individual Data Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', trackCrumbTrail: false }]}
                ]);
        });
        var individualNavigationData = {};
        individualNavigationData['string'] = 'Hello';
        individualNavigationData['boolean'] = true;
        individualNavigationData['number'] = 0;
        individualNavigationData['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', individualNavigationData);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', individualNavigationData);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['boolean'], true);
                assert.strictEqual(stateController.stateContext.data['number'], 0);
                assert.strictEqual(+stateController.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateController.stateContext.data).length, 4);
            });
        }
    });

    describe('Array Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });
        var arrayNavigationData = {};
        arrayNavigationData['array_string'] = ['He-llo', 'World'];
        arrayNavigationData['array_boolean'] = ['', true, false];
        arrayNavigationData['array_number'] = [1, null, undefined, 2];
        arrayNavigationData['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
        arrayNavigationData['array_blank'] = ['', null, undefined];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', arrayNavigationData);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', arrayNavigationData);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateController.stateContext.data['array_string'][1], 'World');
                assert.strictEqual(stateController.stateContext.data['array_string'].length, 2);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][0], null);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][1], true);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][2], false);
                assert.strictEqual(stateController.stateContext.data['array_boolean'].length, 3);
                assert.strictEqual(stateController.stateContext.data['array_number'][0], 1);
                assert.strictEqual(stateController.stateContext.data['array_number'][1], null);
                assert.strictEqual(stateController.stateContext.data['array_number'][2], null);
                assert.strictEqual(stateController.stateContext.data['array_number'][3], 2);
                assert.strictEqual(stateController.stateContext.data['array_number'].length, 4);
                assert.strictEqual(+stateController.stateContext.data['array_date'][0], +new Date(2010, 3, 7));
                assert.strictEqual(+stateController.stateContext.data['array_date'][1], +new Date(2011, 7, 3));
                assert.strictEqual(stateController.stateContext.data['array_date'].length, 2);
                assert.strictEqual(stateController.stateContext.data['array_blank'][0], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'][1], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'][2], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'].length, 3);
                assert.strictEqual(Object.keys(stateController.stateContext.data).length, 5);
            });
        }
    });

    describe('Array Data Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r0/{array_string}/{array_boolean}/{array_number}/{array_date}/{array_blank}' }]}
                ]);
        });
        var arrayNavigationData = {};
        arrayNavigationData['array_string'] = ['He-llo', 'World'];
        arrayNavigationData['array_boolean'] = ['', true, false];
        arrayNavigationData['array_number'] = [1, null, undefined, 2];
        arrayNavigationData['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
        arrayNavigationData['array_blank'] = ['', null, undefined];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', arrayNavigationData);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', arrayNavigationData);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateController.stateContext.data['array_string'][1], 'World');
                assert.strictEqual(stateController.stateContext.data['array_string'].length, 2);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][0], null);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][1], true);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][2], false);
                assert.strictEqual(stateController.stateContext.data['array_boolean'].length, 3);
                assert.strictEqual(stateController.stateContext.data['array_number'][0], 1);
                assert.strictEqual(stateController.stateContext.data['array_number'][1], null);
                assert.strictEqual(stateController.stateContext.data['array_number'][2], null);
                assert.strictEqual(stateController.stateContext.data['array_number'][3], 2);
                assert.strictEqual(stateController.stateContext.data['array_number'].length, 4);
                assert.strictEqual(+stateController.stateContext.data['array_date'][0], +new Date(2010, 3, 7));
                assert.strictEqual(+stateController.stateContext.data['array_date'][1], +new Date(2011, 7, 3));
                assert.strictEqual(stateController.stateContext.data['array_date'].length, 2);
                assert.strictEqual(stateController.stateContext.data['array_blank'][0], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'][1], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'][2], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'].length, 3);
                assert.strictEqual(Object.keys(stateController.stateContext.data).length, 5);
            });
        }
    });

    describe('Array Data Splat', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r0/{*array_string}/a/{*array_boolean}/b/{*array_number}/c/{*array_date}/d/{*array_blank}' }]}
                ]);
        });
        var arrayNavigationData = {};
        arrayNavigationData['array_string'] = ['He-llo', 'World'];
        arrayNavigationData['array_boolean'] = ['', true, false];
        arrayNavigationData['array_number'] = [1, null, undefined, 2];
        arrayNavigationData['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
        arrayNavigationData['array_blank'] = ['', null, undefined];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', arrayNavigationData);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', arrayNavigationData);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateController.stateContext.data['array_string'][1], 'World');
                assert.strictEqual(stateController.stateContext.data['array_string'].length, 2);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][0], null);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][1], true);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][2], false);
                assert.strictEqual(stateController.stateContext.data['array_boolean'].length, 3);
                assert.strictEqual(stateController.stateContext.data['array_number'][0], 1);
                assert.strictEqual(stateController.stateContext.data['array_number'][1], null);
                assert.strictEqual(stateController.stateContext.data['array_number'][2], null);
                assert.strictEqual(stateController.stateContext.data['array_number'][3], 2);
                assert.strictEqual(stateController.stateContext.data['array_number'].length, 4);
                assert.strictEqual(+stateController.stateContext.data['array_date'][0], +new Date(2010, 3, 7));
                assert.strictEqual(+stateController.stateContext.data['array_date'][1], +new Date(2011, 7, 3));
                assert.strictEqual(stateController.stateContext.data['array_date'].length, 2);
                assert.strictEqual(stateController.stateContext.data['array_blank'][0], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'][1], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'][2], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'].length, 3);
                assert.strictEqual(Object.keys(stateController.stateContext.data).length, 5);
            });
        }
    });

    describe('Invalid Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });
        var data = {};
        data['item'] = {};
        
        describe('Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateController.navigate('d', data));
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function () {
                assert.throws(() => stateController.getNavigationLink('d', data));
            });
        });
    });

    describe('Invalid Array Data', function () {
        it('should throw error', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            stateController.navigate('d');
            var data = {}
            data['item'] = [{}];
            assert.throws(() => stateController.navigate('t', data));
        });
    });

    describe('Individual Data Refresh', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            stateController.navigate('d');
            stateController.stateContext.data['item'] = {};
        });
        
        describe('Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateController.refresh(stateController.stateContext.includeCurrentData(null)));
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function () {
                assert.throws(() => stateController.getRefreshLink(stateController.stateContext.includeCurrentData(null)));
            });
        });
    });

    describe('Individual Refresh Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            stateController.navigate('d');
        });
        
        describe('Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateController.refresh({ item: {} }));
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function () {
                assert.throws(() => stateController.getRefreshLink({ item: {} }));
            });
        });
    });

    describe('Invalid Types Array Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });
        var data = {};
        data['item0'] = ['0', 1];
        data['item1'] = [0, '1'];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['item0'][0], '0');
                assert.strictEqual(stateController.stateContext.data['item0'][1], '1');
                assert.strictEqual(stateController.stateContext.data['item1'][0], 0);
                assert.strictEqual(stateController.stateContext.data['item1'][1], 1);
            });
        }
    });

    describe('Invalid Context Data Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
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
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.stateContext.data['item'] = new Date();
                stateController.navigate('t', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                stateController.stateContext.data['item'] = new Date();
                stateController.navigate('t', data);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], 'Hello');
            });
        }
    });

    describe('Invalid Data Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', trackCrumbTrail: false }]}
                ]);
        });
        var data = {};
        data['item'] = {};
        
        describe('Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateController.getNavigationLink('d', data));
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function () {
                assert.throws(() => stateController.getNavigationLink('d', data));
            });
        });
    });

    describe('Reserved Url Character Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        var data = {};
        data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
            });
        }
    });

    describe('Reserved Url Character Route Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
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
                stateController.navigate('d', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
                assert.strictEqual(stateController.stateContext.data['string'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
                assert.strictEqual(stateController.stateContext.data['_bool'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
                assert.strictEqual(stateController.stateContext.data['number'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
            });
        }
    });

    describe('Separator Url Character Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        var data = {};
        data['_0_1_2_3_4_5_'] = '__00__11__22__33__44__55__';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['_0_1_2_3_4_5_'], '__00__11__22__33__44__55__');
            });
        }
    });
    
    describe('Empty String Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });
        var data = {};
        data['s'] = '';
        data['t'] = '1';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t'], '1');
            });
        }
    });

    describe('Empty Array Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });
        var data = {};
        data['s'] = [];
        data['t'] = ['1'];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t'][0], '1');
            });
        }
    });

    describe('Empty String Data', function () {
        it('should populate data', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            stateController.navigate('d');
            stateController.navigate('t');
            stateController.stateContext.data['s'] = '';
            stateController.stateContext.data['t'] = '1';
            assert.strictEqual(stateController.stateContext.data['s'], '');
            assert.strictEqual(stateController.stateContext.data['t'], '1');
        });
    });

    describe('Empty String State Data Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.stateContext.data['s'] = '';
                stateController.stateContext.data['t'] = '1';
                stateController.refresh(stateController.stateContext.includeCurrentData({}))
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                stateController.stateContext.data['s'] = '';
                stateController.stateContext.data['t'] = '1';
                link = stateController.getRefreshLink(stateController.stateContext.includeCurrentData({}));
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t'], '1');
            });
        }
    });

    describe('Navigate Data Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        var data = {};
        data['string'] = 'Hello';
        data['boolean'] = true;
        data['number'] = 0;
        data['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['boolean'], true);
                assert.strictEqual(stateController.stateContext.data['number'], 0);
                assert.strictEqual(+stateController.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateController.stateContext.data).length, 4);
            });
        }
    });

    describe('Navigate Array Data Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        var data = {};
        data['array_string'] = ['He-llo', 'World'];
        data['array_boolean'] = ['', true, false];
        data['array_number'] = [1, null, undefined, 2];
        data['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
        data['array_blank'] = ['', null, undefined];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateController.stateContext.data['array_string'][1], 'World');
                assert.strictEqual(stateController.stateContext.data['array_string'].length, 2);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][0], null);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][1], true);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][2], false);
                assert.strictEqual(stateController.stateContext.data['array_boolean'].length, 3);
                assert.strictEqual(stateController.stateContext.data['array_number'][0], 1);
                assert.strictEqual(stateController.stateContext.data['array_number'][1], null);
                assert.strictEqual(stateController.stateContext.data['array_number'][2], null);
                assert.strictEqual(stateController.stateContext.data['array_number'][3], 2);
                assert.strictEqual(stateController.stateContext.data['array_number'].length, 4);
                assert.strictEqual(+stateController.stateContext.data['array_date'][0], +new Date(2010, 3, 7));
                assert.strictEqual(+stateController.stateContext.data['array_date'][1], +new Date(2011, 7, 3));
                assert.strictEqual(stateController.stateContext.data['array_date'].length, 2);
                assert.strictEqual(stateController.stateContext.data['array_blank'][0], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'][1], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'][2], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'].length, 3);
                assert.strictEqual(Object.keys(stateController.stateContext.data).length, 5);
            });
        }
    });

    describe('Navigate Array Data Route Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0/{array_string}/{array_boolean}/{array_number}/{array_date}/{array_blank}', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        var data = {};
        data['array_string'] = ['He-llo', 'World'];
        data['array_boolean'] = ['', true, false];
        data['array_number'] = [1, null, undefined, 2];
        data['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
        data['array_blank'] = ['', null, undefined];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateController.stateContext.data['array_string'][1], 'World');
                assert.strictEqual(stateController.stateContext.data['array_string'].length, 2);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][0], null);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][1], true);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][2], false);
                assert.strictEqual(stateController.stateContext.data['array_boolean'].length, 3);
                assert.strictEqual(stateController.stateContext.data['array_number'][0], 1);
                assert.strictEqual(stateController.stateContext.data['array_number'][1], null);
                assert.strictEqual(stateController.stateContext.data['array_number'][2], null);
                assert.strictEqual(stateController.stateContext.data['array_number'][3], 2);
                assert.strictEqual(stateController.stateContext.data['array_number'].length, 4);
                assert.strictEqual(+stateController.stateContext.data['array_date'][0], +new Date(2010, 3, 7));
                assert.strictEqual(+stateController.stateContext.data['array_date'][1], +new Date(2011, 7, 3));
                assert.strictEqual(stateController.stateContext.data['array_date'].length, 2);
                assert.strictEqual(stateController.stateContext.data['array_blank'][0], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'][1], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'][2], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'].length, 3);
                assert.strictEqual(Object.keys(stateController.stateContext.data).length, 5);
            });
        }
    });

    describe('Navigate Array Data Splat Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0/{*array_string}/a/{*array_boolean}/b/{*array_number}/c/{*array_date}/d/{*array_blank}', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        var data = {};
        data['array_string'] = ['He-llo', 'World'];
        data['array_boolean'] = ['', true, false];
        data['array_number'] = [1, null, undefined, 2];
        data['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
        data['array_blank'] = ['', null, undefined];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateController.stateContext.data['array_string'][1], 'World');
                assert.strictEqual(stateController.stateContext.data['array_string'].length, 2);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][0], null);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][1], true);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][2], false);
                assert.strictEqual(stateController.stateContext.data['array_boolean'].length, 3);
                assert.strictEqual(stateController.stateContext.data['array_number'][0], 1);
                assert.strictEqual(stateController.stateContext.data['array_number'][1], null);
                assert.strictEqual(stateController.stateContext.data['array_number'][2], null);
                assert.strictEqual(stateController.stateContext.data['array_number'][3], 2);
                assert.strictEqual(stateController.stateContext.data['array_number'].length, 4);
                assert.strictEqual(+stateController.stateContext.data['array_date'][0], +new Date(2010, 3, 7));
                assert.strictEqual(+stateController.stateContext.data['array_date'][1], +new Date(2011, 7, 3));
                assert.strictEqual(stateController.stateContext.data['array_date'].length, 2);
                assert.strictEqual(stateController.stateContext.data['array_blank'][0], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'][1], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'][2], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'].length, 3);
                assert.strictEqual(Object.keys(stateController.stateContext.data).length, 5);
            });
        }
    });

    describe('Navigate Empty String Data Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        var data = {};
        data['s'] = '';
        data['t'] = '1';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t'], '1');
            });
        }
    });

    describe('Navigate Empty Array Data Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        var data = {};
        data['s'] = [];
        data['t'] = ['1'];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t'][0], '1');
            });
        }
    });

    describe('Change Data Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.stateContext.data['s'] = 'World';
                stateController.stateContext.data['i'] = 2;
                stateController.refresh(stateController.stateContext.includeCurrentData({}))
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                stateController.stateContext.data['s'] = 'World';
                stateController.stateContext.data['i'] = 2;
                link = stateController.getRefreshLink(stateController.stateContext.includeCurrentData({}));
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], 'World');
                assert.strictEqual(stateController.stateContext.data['i'], 2);
            });
        }
    });
    
    describe('Blank Data Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.stateContext.data['s'] = null;
                stateController.stateContext.data['i'] = 2;
                stateController.refresh(stateController.stateContext.includeCurrentData({}))
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                stateController.stateContext.data['s'] = null;
                stateController.stateContext.data['i'] = 2;
                link = stateController.getRefreshLink(stateController.stateContext.includeCurrentData({}));
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['i'], 2);
            });
        }
    });

    describe('Data Refresh', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
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
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.refresh(stateController.stateContext.includeCurrentData(null));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink(stateController.stateContext.includeCurrentData(null));
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], 'Hello');
            });
        }
    });

    describe('Refresh Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data = {};
        data['string'] = 'Hello';
        data['boolean'] = true;
        data['number'] = 0;
        data['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.refresh(data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink(data);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['boolean'], true);
                assert.strictEqual(stateController.stateContext.data['number'], 0);
                assert.strictEqual(+stateController.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateController.stateContext.data).length, 4);
            });
        }
    });

    describe('Refresh Array Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data = {};
        data['array_string'] = ['He-llo', 'World'];
        data['array_boolean'] = ['', true, false];
        data['array_number'] = [1, null, undefined, 2];
        data['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
        data['array_blank'] = ['', null, undefined];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.refresh(data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink(data);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateController.stateContext.data['array_string'][1], 'World');
                assert.strictEqual(stateController.stateContext.data['array_string'].length, 2);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][0], null);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][1], true);
                assert.strictEqual(stateController.stateContext.data['array_boolean'][2], false);
                assert.strictEqual(stateController.stateContext.data['array_boolean'].length, 3);
                assert.strictEqual(stateController.stateContext.data['array_number'][0], 1);
                assert.strictEqual(stateController.stateContext.data['array_number'][1], null);
                assert.strictEqual(stateController.stateContext.data['array_number'][2], null);
                assert.strictEqual(stateController.stateContext.data['array_number'][3], 2);
                assert.strictEqual(stateController.stateContext.data['array_number'].length, 4);
                assert.strictEqual(+stateController.stateContext.data['array_date'][0], +new Date(2010, 3, 7));
                assert.strictEqual(+stateController.stateContext.data['array_date'][1], +new Date(2011, 7, 3));
                assert.strictEqual(stateController.stateContext.data['array_date'].length, 2);
                assert.strictEqual(stateController.stateContext.data['array_blank'][0], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'][1], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'][2], null);
                assert.strictEqual(stateController.stateContext.data['array_blank'].length, 3);
                assert.strictEqual(Object.keys(stateController.stateContext.data).length, 5);
            });
        }
    });

    describe('Refresh Data Override', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
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
                stateController.navigate('d');
                stateController.navigate('t', data1);
                stateController.refresh(data2);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data1);
                stateController.navigateLink(link);
                var link = stateController.getRefreshLink(data2);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], 'World');
            });
        }
    });

    describe('Refresh Data Blank', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
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
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
            });
        }
    });

    describe('Change Data Refresh', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
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
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.stateContext.data['s'] = 'World';
                stateController.stateContext.data['n'] = 1;
                stateController.refresh(stateController.stateContext.includeCurrentData(null));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                stateController.stateContext.data['s'] = 'World';
                stateController.stateContext.data['n'] = 1;
                link = stateController.getRefreshLink(stateController.stateContext.includeCurrentData(null));
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.equal(stateController.stateContext.data['s'], 'World');
                assert.equal(stateController.stateContext.data['n'], 1);
            });
        }
    });

    describe('Change Refresh Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
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
                stateController.navigate('d');
                stateController.navigate('t', data1);
                stateController.refresh(data2);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data1);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink(data2);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], 'World');
                assert.strictEqual(stateController.stateContext.data['n'], 4);
                assert.strictEqual(stateController.stateContext.data['i'], undefined);
            });
        }
    });

    describe('Change Dynamic Data Refresh Override', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
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
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.stateContext.data.s = 'World';
                stateController.stateContext.data.d = '2000-1-3';
                stateController.stateContext.data.i = 3;
                data = stateController.stateContext.includeCurrentData({
                    s: 'Hello World',
                    i: null,
                    n: 2
                });
                stateController.refresh(data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                stateController.stateContext.data.s = 'World';
                stateController.stateContext.data.d = '2000-1-3';
                stateController.stateContext.data.i = 3;
                data = stateController.stateContext.includeCurrentData({
                    s: 'Hello World',
                    i: null,
                    n: 2
                });
                link = stateController.getRefreshLink(data);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data.s, 'Hello World');
                assert.strictEqual(stateController.stateContext.data.d, '2000-1-3');
                assert.strictEqual(stateController.stateContext.data.i, undefined);
                assert.strictEqual(stateController.stateContext.data.n, 2);
                assert.strictEqual(stateController.stateContext.data['n'], 2);
            });
        }
    });

    describe('Wizard Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        var data = {
            s: 'Hello',
            n: 5
        };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.navigate('t', stateController.stateContext.includeCurrentData(null));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', stateController.stateContext.includeCurrentData(null));
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.oldData['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.oldData['n'], 5);
                assert.strictEqual(stateController.stateContext.previousData['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.previousData['n'], 5);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.crumbs[1].data['n'], 5);
                assert.strictEqual(stateController.stateContext.data['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['n'], 5);
            });
        }
    });

    describe('Transition Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
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
                stateController.navigate('d', data1);
                stateController.navigate('t', data2);
                stateController.navigate('t', data3);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data1);
                stateController.navigateLink(link);
                assert.strictEqual(stateController.stateContext.data['s'], 1);
                assert.strictEqual(stateController.stateContext.data['t'], undefined);
                link = stateController.getNavigationLink('t', data2);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data3);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.oldData['s'], 2);
                assert.strictEqual(stateController.stateContext.oldData['t'], '2');
                assert.strictEqual(stateController.stateContext.previousData['s'], 2);
                assert.strictEqual(stateController.stateContext.previousData['t'], '2');
                assert.strictEqual(stateController.stateContext.crumbs[0].data['s'], 1);
                assert.strictEqual(stateController.stateContext.crumbs[0].data['t'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['s'], 2);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['t'], '2');
                assert.strictEqual(stateController.stateContext.data['s'], 3);
                assert.strictEqual(stateController.stateContext.data['t'], '3');
            });
        }
    });

    describe('Dynamic Data Transition Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
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
                stateController.navigate('d', data1);
                stateController.navigate('t', data2);
                stateController.navigate('t', data3);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data1);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data2);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data3);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.oldData.s, '2');
                assert.strictEqual(stateController.stateContext.previousData.s, '2');
                assert.strictEqual(stateController.stateContext.crumbs[0].data.s, 1);
                assert.strictEqual(stateController.stateContext.crumbs[0].data['s'], 1);
                assert.strictEqual(stateController.stateContext.crumbs[1].data.s, '2');
                assert.strictEqual(stateController.stateContext.data.s, '3');
            });
        }
    });

    describe('Change Data Transition Transition', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
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
                stateController.navigate('d', data1);
                stateController.stateContext.data['s'] = 11;
                stateController.refresh(stateController.stateContext.includeCurrentData({}))
                stateController.navigate('t', data2);
                stateController.stateContext.data['s'] = '22';
                stateController.refresh(stateController.stateContext.includeCurrentData({}))
                stateController.navigate('t', data3);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data1);
                stateController.navigateLink(link);
                stateController.stateContext.data['s'] = 11;
                link = stateController.getRefreshLink(stateController.stateContext.includeCurrentData({}));
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data2);
                stateController.navigateLink(link);
                stateController.stateContext.data['s'] = '22';
                link = stateController.getRefreshLink(stateController.stateContext.includeCurrentData({}));
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data3);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.oldData['s'], '22');
                assert.strictEqual(stateController.stateContext.oldData['t'], '2');
                assert.strictEqual(stateController.stateContext.previousData['s'], '22');
                assert.strictEqual(stateController.stateContext.previousData['t'], '2');
                assert.strictEqual(stateController.stateContext.crumbs[0].data['s'], 11);
                assert.strictEqual(stateController.stateContext.crumbs[0].data['t'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['s'], '22');
                assert.strictEqual(stateController.stateContext.crumbs[1].data['t'], '2');
                assert.strictEqual(stateController.stateContext.data['s'], 3);
                assert.strictEqual(stateController.stateContext.data['t'], '3');
            });
        }
    });

    describe('Change Crumb Data Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.navigate('t');
                var crumb = stateController.stateContext.crumbs[0];
                crumb.data['s'] = 'Changed';
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                var crumb = stateController.stateContext.crumbs[0];
                crumb.data['s'] = 'Changed';
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], 'Hello');
            });
        }
    });

    describe('Defaults', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { 'string': 'Hello', _bool: true, 'number': 1, 'date': new Date(2010, 3, 7) } }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['_bool'], true);
                assert.strictEqual(stateController.stateContext.data['number'], 1);
                assert.strictEqual(+stateController.stateContext.data['date'], +new Date(2010, 3, 7));
            });
        }
    });

    describe('Defaults Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', defaults: { 'string': 'Hello', _bool: true, 'number': 1, 'date': new Date(2010, 3, 7) } }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['_bool'], true);
                assert.strictEqual(stateController.stateContext.data['number'], 1);
                assert.strictEqual(+stateController.stateContext.data['date'], +new Date(2010, 3, 7));
            });
        }
    });

    describe('Data Defaults', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.stateContext.data['string'] = null;
                stateController.stateContext.data['number'] = 'Hello';
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                stateController.stateContext.data['string'] = null;
                stateController.stateContext.data['number'] = 'Hello';
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['string'], null);
                assert.strictEqual(stateController.stateContext.data['_bool'], true);
                assert.strictEqual(stateController.stateContext.data['number'], 'Hello');
            });
        }
    });

    describe('Data Defaults Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.stateContext.data['string'] = null;
                stateController.stateContext.data['number'] = 'Hello';
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                stateController.stateContext.data['string'] = null;
                stateController.stateContext.data['number'] = 'Hello';
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['string'], null);
                assert.strictEqual(stateController.stateContext.data['_bool'], true);
                assert.strictEqual(stateController.stateContext.data['number'], 'Hello');
            });
        }
    });

    describe('Data And Defaults', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
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
                stateController.navigate('d');
                stateController.navigate('t', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['emptyString'], '');
                assert.strictEqual(stateController.stateContext.data['number'], 4);
                assert.strictEqual(stateController.stateContext.data['char'], 7);
                assert.strictEqual(stateController.stateContext.data['s'], 1);
                assert.strictEqual(stateController.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Data And Defaults Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
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
                stateController.navigate('d');
                stateController.navigate('t', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['emptyString'], '');
                assert.strictEqual(stateController.stateContext.data['number'], 4);
                assert.strictEqual(stateController.stateContext.data['char'], 7);
                assert.strictEqual(stateController.stateContext.data['s'], 1);
                assert.strictEqual(stateController.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Override Defaults', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
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
                stateController.navigate('d');
                stateController.navigate('t', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['emptyString'], 2);
                assert.strictEqual(stateController.stateContext.data['number'], 1);
                assert.strictEqual(stateController.stateContext.data['char'], 5);
            });
        }
    });

    describe('Override Defaults Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
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
                stateController.navigate('d');
                stateController.navigate('t', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['emptyString'], 2);
                assert.strictEqual(stateController.stateContext.data['number'], 1);
                assert.strictEqual(stateController.stateContext.data['char'], 5);
            });
        }
    });

    describe('Defaults Override', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { emptyString: '', 'number': 4, char: 7 } }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.stateContext.data['emptyString'] = 'Hello';
                stateController.stateContext.data['number'] = 4;
                stateController.stateContext.data['char'] = 5;
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                stateController.stateContext.data['emptyString'] = 'Hello';
                stateController.stateContext.data['number'] = 4;
                stateController.stateContext.data['char'] = 5;
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['emptyString'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['number'], 4);
                assert.strictEqual(stateController.stateContext.data['char'], 5);
            });
        }
    });

    describe('Defaults Override Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{char}/{number?}', defaults: { emptyString: '', 'number': 4, char: 7 } }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.stateContext.data['emptyString'] = 'Hello';
                stateController.stateContext.data['number'] = 4;
                stateController.stateContext.data['char'] = 5;
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                stateController.stateContext.data['emptyString'] = 'Hello';
                stateController.stateContext.data['number'] = 4;
                stateController.stateContext.data['char'] = 5;
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['emptyString'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['number'], 4);
                assert.strictEqual(stateController.stateContext.data['char'], 5);
            });
        }
    });

    describe('Back Defaults', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['_bool'], true);
                assert.strictEqual(stateController.stateContext.data['number'], 1);
            });
        }
    });

    describe('Back Defaults Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['_bool'], true);
                assert.strictEqual(stateController.stateContext.data['number'], 1);
            });
        }
    });

    describe('Back Data And Defaults', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['emptyString'], '');
                assert.strictEqual(stateController.stateContext.data['number'], 4);
                assert.strictEqual(stateController.stateContext.data['char'], 7);
                assert.strictEqual(stateController.stateContext.data['s'], 1);
                assert.strictEqual(stateController.stateContext.data['t'], '2');
            });
        }
    });

    describe('Back Data And Defaults Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{char}/{number?}', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['emptyString'], '');
                assert.strictEqual(stateController.stateContext.data['number'], 4);
                assert.strictEqual(stateController.stateContext.data['char'], 7);
                assert.strictEqual(stateController.stateContext.data['s'], 1);
                assert.strictEqual(stateController.stateContext.data['t'], '2');
            });
        }
    });

    describe('Back Override Defaults', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['emptyString'], 'World');
                assert.strictEqual(stateController.stateContext.data['number'], 1);
                assert.strictEqual(stateController.stateContext.data['char'], 5);
            });
        }
    });

    describe('Back Override Defaults Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{char}/{number?}', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['emptyString'], 'World');
                assert.strictEqual(stateController.stateContext.data['number'], 1);
                assert.strictEqual(stateController.stateContext.data['char'], 5);
            });
        }
    });

    describe('Crumb Defaults', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.previousData['emptyString'], '');
                assert.strictEqual(stateController.stateContext.previousData['number'], 4);
                assert.strictEqual(stateController.stateContext.previousData['char'], 7);
                assert.strictEqual(stateController.stateContext.crumbs[0].data['string'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[0].data['_bool'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['number'], 1);
                assert.strictEqual(stateController.stateContext.crumbs[2].data['emptyString'], '');
                assert.strictEqual(stateController.stateContext.crumbs[2].data['number'], 4);
                assert.strictEqual(stateController.stateContext.crumbs[2].data['char'], 7);
            });
        }
    });

    describe('Crumb Defaults Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2/{char}/{number?}', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', trackCrumbTrail: true }]}
                ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.previousData['emptyString'], '');
                assert.strictEqual(stateController.stateContext.previousData['number'], 4);
                assert.strictEqual(stateController.stateContext.previousData['char'], 7);
                assert.strictEqual(stateController.stateContext.crumbs[0].data['string'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[0].data['_bool'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['number'], 1);
                assert.strictEqual(stateController.stateContext.crumbs[2].data['emptyString'], '');
                assert.strictEqual(stateController.stateContext.crumbs[2].data['number'], 4);
                assert.strictEqual(stateController.stateContext.crumbs[2].data['char'], 7);
            });
        }
    });

    describe('Crumb Data And Defaults', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.previousData['number'], 1);
                assert.strictEqual(stateController.stateContext.previousData['s'], 1);
                assert.strictEqual(stateController.stateContext.previousData['t'], '2');
                assert.strictEqual(stateController.stateContext.crumbs[0].data['string'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[0].data['s'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['number'], 1);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['s'], 1);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['t'], '2');
            });
        }
    });

    describe('Crumb Data And Defaults Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.previousData['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.previousData['_bool'], true);
                assert.strictEqual(stateController.stateContext.previousData['number'], 1);
                assert.strictEqual(stateController.stateContext.previousData['s'], 1);
                assert.strictEqual(stateController.stateContext.previousData['t'], '2');
                assert.strictEqual(stateController.stateContext.crumbs[0].data['string'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[0].data['s'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['number'], 1);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['s'], 1);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['t'], '2');
            });
        }
    });

    describe('Crumb Data And Defaults', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.previousData['string'], 'World');
                assert.strictEqual(stateController.stateContext.previousData['_bool'], true);
                assert.strictEqual(stateController.stateContext.previousData['number'], 0);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['string'], 'World');
                assert.strictEqual(stateController.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['number'], 0);
            });
        }
    });

    describe('Crumb Data And Defaults Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
        });
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.previousData['string'], 'World');
                assert.strictEqual(stateController.stateContext.previousData['_bool'], true);
                assert.strictEqual(stateController.stateContext.previousData['number'], 0);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['string'], 'World');
                assert.strictEqual(stateController.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['number'], 0);
            });
        }
    });

    describe('Back Defaults Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r4', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigate('d1');
                stateController.navigate('t');
                stateController.navigateBack(3);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(3);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['_bool'], true);
                assert.strictEqual(stateController.stateContext.data['number'], 1);
            });
        }
    });

    describe('Back Defaults Custom Trail Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r4', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigate('d1');
                stateController.navigate('t');
                stateController.navigateBack(3);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(3);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['_bool'], true);
                assert.strictEqual(stateController.stateContext.data['number'], 1);
            });
        }
    });

    describe('Back Data And Defaults Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
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
                stateController.navigate('d0');
                stateController.navigate('t', data);
                stateController.navigate('t');
                stateController.navigate('d1');
                stateController.refresh();
                stateController.navigateBack(2);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(2);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['emptyString'], '');
                assert.strictEqual(stateController.stateContext.data['number'], 4);
                assert.strictEqual(stateController.stateContext.data['char'], 7);
                assert.strictEqual(stateController.stateContext.data['s'], 1);
                assert.strictEqual(stateController.stateContext.data['t'], '2');
            });
        }
    });

    describe('Back Data And Defaults Custom Trail Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{char}/{number?}', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
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
                stateController.navigate('d0');
                stateController.navigate('t', data);
                stateController.navigate('t');
                stateController.navigate('d1');
                stateController.refresh();
                stateController.navigateBack(2);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(2);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['emptyString'], '');
                assert.strictEqual(stateController.stateContext.data['number'], 4);
                assert.strictEqual(stateController.stateContext.data['char'], 7);
                assert.strictEqual(stateController.stateContext.data['s'], 1);
                assert.strictEqual(stateController.stateContext.data['t'], '2');
            });
        }
    });

    describe('Back Override Defaults Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r4', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
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
                stateController.navigate('d0');
                stateController.navigate('t', data);
                stateController.navigate('t');
                stateController.navigate('d1');
                stateController.navigate('t');
                stateController.navigateBack(1);
                stateController.navigateBack(1);
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['emptyString'], 'World');
                assert.strictEqual(stateController.stateContext.data['number'], 1);
                assert.strictEqual(stateController.stateContext.data['char'], 5);
            });
        }
    });

    describe('Back Override Defaults Custom Trail Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{char}/{number?}', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r4', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
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
                stateController.navigate('d0');
                stateController.navigate('t', data);
                stateController.navigate('t');
                stateController.navigate('d1');
                stateController.navigate('t');
                stateController.navigateBack(1);
                stateController.navigateBack(1);
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['emptyString'], 'World');
                assert.strictEqual(stateController.stateContext.data['number'], 1);
                assert.strictEqual(stateController.stateContext.data['char'], 5);
            });
        }
    });

    describe('Crumb Defaults Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 } }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r4', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigate('d1');
                stateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.crumbs[0].data['string'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[0].data['number'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['number'], 1);
                assert.strictEqual(stateController.stateContext.crumbs[2].data['emptyString'], '');
                assert.strictEqual(stateController.stateContext.crumbs[2].data['number'], 4);
                assert.strictEqual(stateController.stateContext.crumbs[2].data['char'], 7);
            });
        }
    });

    describe('Crumb Defaults Custom Trail Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2/{char}/{number?}', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 } }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r4', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigate('d1');
                stateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.crumbs[0].data['string'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[0].data['number'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['number'], 1);
                assert.strictEqual(stateController.stateContext.crumbs[2].data['emptyString'], '');
                assert.strictEqual(stateController.stateContext.crumbs[2].data['number'], 4);
                assert.strictEqual(stateController.stateContext.crumbs[2].data['char'], 7);
            });
        }
    });

    describe('Back Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r1', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0', data);
                stateController.navigate('d1');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Back Custom Trail Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r/{s}' }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r1', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0', data);
                stateController.navigate('d1');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Crumb Data And Defaults Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('t', data);
                stateController.navigate('t');
                stateController.navigate('d1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.crumbs[0].data['string'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[0].data['s'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['number'], 1);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['s'], 1);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['t'], '2');
            });
        }
    });

    describe('Crumb Data And Defaults Custom Trail Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('t', data);
                stateController.navigate('t');
                stateController.navigate('d1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.crumbs[0].data['string'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[0].data['s'], undefined);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['number'], 1);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['s'], 1);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['t'], '2');
            });
        }
    });

    describe('Override Crumb Defaults Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('t', data);
                stateController.navigate('t');
                stateController.navigate('d1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.crumbs[1].data['string'], 'World');
                assert.strictEqual(stateController.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['number'], 0);
            });
        }
    });

    describe('Override Crumb Defaults Custom Trail Route', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r3', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0');
                stateController.navigate('t', data);
                stateController.navigate('t');
                stateController.navigate('d1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.crumbs[1].data['string'], 'World');
                assert.strictEqual(stateController.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateController.stateContext.crumbs[1].data['number'], 0);
            });
        }
    });

    describe('Navigate Previous Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
         });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = 1;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old and previous data', function () {
                assert.strictEqual(stateController.stateContext.oldData['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.oldData['t'], 1);
                assert.strictEqual(stateController.stateContext.previousData['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.previousData['t'], 1);
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Navigate Previous Data Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false }]}
                ]);
         });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = 1;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old but not previous data', function () {
                assert.strictEqual(stateController.stateContext.oldData['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.oldData['t'], 1);
                assert.strictEqual(stateController.stateContext.previousData['s'], undefined);
                assert.strictEqual(stateController.stateContext.previousData['t'], undefined);
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Navigate Previous Data Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
         });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = 1;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old and previous data', function () {
                assert.strictEqual(stateController.stateContext.oldData['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.oldData['t'], 1);
                assert.strictEqual(stateController.stateContext.previousData['s'], undefined);
                assert.strictEqual(stateController.stateContext.previousData['t'], undefined);
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Navigate Previous Data Back Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
         });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = 1;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old but not previous data', function () {
                assert.strictEqual(stateController.stateContext.oldData['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.oldData['t'], 1);
                assert.strictEqual(stateController.stateContext.previousData['s'], undefined);
                assert.strictEqual(stateController.stateContext.previousData['t'], undefined);
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Navigate Previous Data Back Two', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', trackCrumbTrail: true }]}
                ]);
         });
        var data1 = {};
        data1['s'] = 'Hello';
        data1['t1'] = 1;
        var data2 = {};
        data2['s'] = 'World';
        data2['t2'] = 2;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data1);
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigate('t', data2);
                stateController.navigateBack(2);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data1);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data2);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(2);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old and previous data', function () {
                assert.strictEqual(stateController.stateContext.oldData['s'], 'World');
                assert.strictEqual(stateController.stateContext.oldData['t1'], undefined);
                assert.strictEqual(stateController.stateContext.oldData['t2'], 2);
                assert.strictEqual(stateController.stateContext.previousData['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.previousData['t1'], 1);
                assert.strictEqual(stateController.stateContext.previousData['t2'], undefined);
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t1'], undefined);
                assert.strictEqual(stateController.stateContext.data['t2'], undefined);
            });
        }
    });

    describe('Navigate Previous Data Back Two Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', trackCrumbTrail: true }]}
                ]);
         });
        var data1 = {};
        data1['s'] = 'Hello';
        data1['t1'] = 1;
        var data2 = {};
        data2['s'] = 'World';
        data2['t2'] = 2;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data1);
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigate('t', data2);
                stateController.navigateBack(2);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data1);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data2);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(2);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old but not previous data', function () {
                assert.strictEqual(stateController.stateContext.oldData['s'], 'World');
                assert.strictEqual(stateController.stateContext.oldData['t1'], undefined);
                assert.strictEqual(stateController.stateContext.oldData['t2'], 2);
                assert.strictEqual(stateController.stateContext.previousData['s'], undefined);
                assert.strictEqual(stateController.stateContext.previousData['t1'], undefined);
                assert.strictEqual(stateController.stateContext.previousData['t2'], undefined);
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t1'], undefined);
                assert.strictEqual(stateController.stateContext.data['t2'], undefined);
            });
        }
    });

    describe('Navigate Previous Data One By One', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', trackCrumbTrail: true }]}
                ]);
         });
        var data1 = {};
        data1['s'] = 'Hello';
        data1['t1'] = 1;
        var data2 = {};
        data2['s'] = 'World';
        data2['t2'] = 2;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data1);
                stateController.navigate('t');
                stateController.navigate('t', data2);
                stateController.navigate('t');
                stateController.navigateBack(1);
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data1);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data2);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old and previous data', function () {
                assert.strictEqual(stateController.stateContext.oldData['s'], 'World');
                assert.strictEqual(stateController.stateContext.oldData['t1'], undefined);
                assert.strictEqual(stateController.stateContext.oldData['t2'], 2);
                assert.strictEqual(stateController.stateContext.previousData['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.previousData['t1'], 1);
                assert.strictEqual(stateController.stateContext.previousData['t2'], undefined);
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t1'], undefined);
                assert.strictEqual(stateController.stateContext.data['t2'], undefined);
            });
        }
    });

    describe('Navigate Previous Data One By One Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', trackCrumbTrail: true }]}
                ]);
         });
        var data1 = {};
        data1['s'] = 'Hello';
        data1['t1'] = 1;
        var data2 = {};
        data2['s'] = 'World';
        data2['t2'] = 2;        
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data1);
                stateController.navigate('t');
                stateController.navigate('t', data2);
                stateController.navigate('t');
                stateController.navigateBack(1);
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data1);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data2);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old but not previous data', function () {
                assert.strictEqual(stateController.stateContext.oldData['s'], 'World');
                assert.strictEqual(stateController.stateContext.oldData['t1'], undefined);
                assert.strictEqual(stateController.stateContext.oldData['t2'], 2);
                assert.strictEqual(stateController.stateContext.previousData['s'], undefined);
                assert.strictEqual(stateController.stateContext.previousData['t1'], undefined);
                assert.strictEqual(stateController.stateContext.previousData['t2'], undefined);
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t2'], undefined);
                assert.strictEqual(stateController.stateContext.data['t1'], undefined);
            });
        }
    });

    describe('Navigate Previous Data One By One Custom Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]},
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r2', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d1'].states['s0'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
         });
        var data1 = {};
        data1['s'] = 'Hello';
        data1['t1'] = 1;
        var data2 = {};
        data2['s'] = 'World';
        data2['t2'] = 2;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d0', data1);
                stateController.navigate('t');
                stateController.navigate('t', data2);
                stateController.navigate('d1');
                stateController.navigateBack(1);
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d0', data1);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data2);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('d1');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old and previous data', function () {
                assert.strictEqual(stateController.stateContext.oldData['s'], 'World');
                assert.strictEqual(stateController.stateContext.oldData['t1'], undefined);
                assert.strictEqual(stateController.stateContext.oldData['t2'], 2);
                assert.strictEqual(stateController.stateContext.previousData['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.previousData['t1'], 1);
                assert.strictEqual(stateController.stateContext.previousData['t2'], undefined);
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t1'], undefined);
                assert.strictEqual(stateController.stateContext.data['t2'], undefined);
            });
        }
    });

    describe('Navigate Previous Data Refresh', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d'].states['s1'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
         });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = 1;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old and previous data', function () {
                assert.strictEqual(stateController.stateContext.oldData['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.oldData['t'], 1);
                assert.strictEqual(stateController.stateContext.previousData['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.previousData['t'], 1);
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Navigate Previous Data Refresh Without Trail', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false }]}
                ]);
            var state = stateController.dialogs['d'].states['s1'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
         });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = 1;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old but not previous data', function () {
                assert.strictEqual(stateController.stateContext.oldData['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.oldData['t'], 1);
                assert.strictEqual(stateController.stateContext.previousData['s'], undefined);
                assert.strictEqual(stateController.stateContext.previousData['t'], undefined);
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Navigate Previous Data Defaults', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { x: 2 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
         });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = 1;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.navigate('t');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old and previous data', function () {
                assert.strictEqual(stateController.stateContext.oldData['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.oldData['t'], 1);
                assert.strictEqual(stateController.stateContext.oldData['x'], 2);
                assert.strictEqual(stateController.stateContext.previousData['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.previousData['t'], 1);
                assert.strictEqual(stateController.stateContext.previousData['x'], 2);
                assert.strictEqual(stateController.stateContext.data['s'], undefined);
                assert.strictEqual(stateController.stateContext.data['t'], undefined);
                assert.strictEqual(stateController.stateContext.data['x'], undefined);
            });
        }
    });

    describe('Navigate Previous Data Bookmarked Link', function() {
        it('should populate old but not previous data', function () {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
            var data = {};
            data['s'] = 'Hello';
            data['t'] = 1;
            stateController.navigate('d');
            var link = stateController.getNavigationLink('t'); 
            stateController.navigate('t', data);
            stateController.navigateLink(link);
            assert.strictEqual(stateController.stateContext.oldData['s'], 'Hello');
            assert.strictEqual(stateController.stateContext.oldData['t'], 1);
            assert.strictEqual(stateController.stateContext.previousData['s'], undefined);
            assert.strictEqual(stateController.stateContext.previousData['t'], undefined);
            assert.strictEqual(stateController.stateContext.data['s'], undefined);
            assert.strictEqual(stateController.stateContext.data['t'], undefined);
        });
    });

    describe('Navigate Bookmarked Previous Data Link', function() {
        it('should populate previous but not old data', function () {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
            var data = {};
            data['s'] = 'Hello';
            data['t'] = 1;
            stateController.navigate('d', data);
            var link = stateController.getNavigationLink('t'); 
            stateController.navigate('t');
            stateController.navigateLink(link);
            assert.strictEqual(stateController.stateContext.oldData['s'], undefined);
            assert.strictEqual(stateController.stateContext.oldData['t'], undefined);
            assert.strictEqual(stateController.stateContext.previousData['s'], 'Hello');
            assert.strictEqual(stateController.stateContext.previousData['t'], 1);
            assert.strictEqual(stateController.stateContext.data['s'], undefined);
            assert.strictEqual(stateController.stateContext.data['t'], undefined);
        });
    });

    describe('Navigate Previous Data Bookmarked Previous Data Link', function() {
        it('should populate old and previous data', function () {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
            var data1 = {};
            data1['s'] = 'Hello';
            data1['t1'] = 1;
            var data2 = {};
            data2['s'] = 'World';
            data2['t2'] = 2;
            stateController.navigate('d', data1);
            var link = stateController.getNavigationLink('t'); 
            stateController.navigate('t', data2);
            stateController.navigateLink(link);
            assert.strictEqual(stateController.stateContext.oldData['s'], 'World');
            assert.strictEqual(stateController.stateContext.oldData['t1'], undefined);
            assert.strictEqual(stateController.stateContext.oldData['t2'], 2);
            assert.strictEqual(stateController.stateContext.previousData['s'], 'Hello');
            assert.strictEqual(stateController.stateContext.previousData['t1'], 1);
            assert.strictEqual(stateController.stateContext.previousData['t2'], undefined);
            assert.strictEqual(stateController.stateContext.data['s'], undefined);
            assert.strictEqual(stateController.stateContext.data['t1'], undefined);
            assert.strictEqual(stateController.stateContext.data['t2'], undefined);
        });
    });

    describe('Link Defaults Navigate', function() {
        it('should not include defaults in link', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }]}
                ]);
            var data = {};
            data['_bool'] = null;
            data['string'] = 'Hello';
            data['number'] = 1;
            stateController.navigate('d');
            var link = stateController.getNavigationLink('t', data);
            assert.equal(link.indexOf('string'), -1);
            assert.equal(link.indexOf('_bool'), -1);
            assert.equal(link.indexOf('number'), -1);
            assert.notEqual(link.indexOf('r?'), -1);
        });
    });

    describe('Link Defaults Navigate', function() {
        it('should not include defaults in link', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }]}
                ]);
            var data = {};
            data['_bool'] = null;
            data['string'] = 'Hello';
            data['number'] = 1;
            stateController.navigate('d');
            var link = stateController.getNavigationLink('t', data);
            assert.equal(link.indexOf('string'), -1);
            assert.equal(link.indexOf('_bool'), -1);
            assert.equal(link.indexOf('number'), -1);
            assert.notEqual(link.indexOf('r?'), -1);
        });
    });

    describe('Link Defaults Route Navigate', function() {
        it('should not include defaults in link', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }]}
                ]);
            var data = {};
            data['_bool'] = null;
            data['string'] = 'Hello';
            data['number'] = 1;
            stateController.navigate('d');
            var link = stateController.getNavigationLink('t', data);
            assert.equal(link.indexOf('string'), -1);
            assert.equal(link.indexOf('_bool'), -1);
            assert.equal(link.indexOf('number'), -1);
            assert.notEqual(link.indexOf('r?'), -1);
        });
    });

    describe('Link Context Defaults Navigate', function() {
        it('should not include defaults in link', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            stateController.navigate('t');
            stateController.stateContext.data['emptyString'] = 1;
            stateController.stateContext.data['number'] = 4;
            stateController.stateContext.data['char'] = null;
            stateController.refresh(stateController.stateContext.includeCurrentData({}))
            var link = stateController.getNavigationLink('t');
            assert.equal(link.indexOf('number'), -1);
            assert.equal(link.indexOf('char'), -1);
            assert.notEqual(link.indexOf('emptyString'), -1);
        });
    });

    describe('Link Context Defaults Route Navigate', function() {
        it('should not include defaults in link', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r/{char}/{number?}', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            stateController.navigate('t');
            stateController.stateContext.data['emptyString'] = 1;
            stateController.stateContext.data['number'] = 4;
            stateController.stateContext.data['char'] = null;
            stateController.refresh(stateController.stateContext.includeCurrentData({}))
            var link = stateController.getNavigationLink('t');
            assert.equal(link.indexOf('number'), -1);
            assert.equal(link.indexOf('char'), -1);
            assert.notEqual(link.indexOf('emptyString'), -1);
        });
    });

    describe('Refresh Link Defaults Navigate', function() {
        it('should not include defaults in link', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r', defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }]}
                ]);
            stateController.navigate('d');
            stateController.navigate('t');
            stateController.stateContext.data['_bool'] = null;
            stateController.stateContext.data['string'] = 'Hello';
            stateController.stateContext.data['number'] = 0;
            var link = stateController.getRefreshLink(stateController.stateContext.includeCurrentData({}));
            assert.equal(link.indexOf('string'), -1);
            assert.equal(link.indexOf('_bool'), -1);
            assert.notEqual(link.indexOf('number'), -1);
        });
    });

    describe('Back Link Defaults Navigate', function() {
        it('should not include defaults in link', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            stateController.navigate('t');
            stateController.stateContext.data['_bool'] = null;
            stateController.stateContext.data['string'] = 'Hello';
            stateController.stateContext.data['number'] = 0;
            stateController.refresh(stateController.stateContext.includeCurrentData({}))
            stateController.navigate('t');
            var link = stateController.getNavigationBackLink(1);
            assert.equal(link.indexOf('string'), -1);
            assert.equal(link.indexOf('_bool'), -1);
            assert.notEqual(link.indexOf('number'), -1);
        });
    });

    describe('Crumb Link Defaults Navigate', function() {
        it('should not include defaults in link', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            stateController.navigate('t');
            stateController.stateContext.data['number'] = 1;
            stateController.stateContext.data['_bool'] = '';
            stateController.stateContext.data['string'] = 4;
            stateController.refresh(stateController.stateContext.includeCurrentData({}))
            stateController.navigate('t');
            var link = stateController.stateContext.crumbs[1].navigationLink;
            assert.equal(link.indexOf('_bool'), -1);
            assert.equal(link.indexOf('number'), -1);
            assert.notEqual(link.indexOf('string'), -1);
        });
    });

    describe('Link Navigate', function() {
        it('should include data in link', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d');
            stateController.stateContext.data['_number'] = 1;
            stateController.stateContext.data['string'] = 'Hello';
            stateController.refresh(stateController.stateContext.includeCurrentData({}))
            var link = stateController.getNavigationLink('t');
            assert.notEqual(link.indexOf('_number'), -1);
            assert.notEqual(link.indexOf('string'), -1);
        });
    });

    describe('Link Without Trail Navigate', function() {
        it('should include data but not crumb trail in link', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: false }]}
                ]);
            stateController.navigate('d');
            stateController.stateContext.data['_number'] = 1;
            stateController.stateContext.data['string'] = 'Hello';
            stateController.refresh(stateController.stateContext.includeCurrentData({}))
            var link = stateController.getNavigationLink('t');
            assert.equal(link.indexOf('c1'), -1);
            assert.equal(link.indexOf('_number'), -1);
            assert.equal(link.indexOf('string'), -1);
        });
    });

    describe('Link Default Types Navigate', function() {
        it('should populate data', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', defaultTypes: { 'string': 'string', 'number': 'number', 'boolean': 'boolean' } }]}
                ]);
            var individualNavigationData = {};
            individualNavigationData['string'] = 'Hello';
            individualNavigationData['boolean'] = true;
            individualNavigationData['number'] = 0;
            stateController.navigate('d', individualNavigationData);
            var i = 0;
            for (var key in stateController.stateContext.data) {
                i++;
            }
            assert.strictEqual(stateController.stateContext.data['string'], 'Hello');
            assert.strictEqual(stateController.stateContext.data['boolean'], true);
            assert.strictEqual(stateController.stateContext.data['number'], 0);
            assert.equal(i, 3);
        });
    });

    describe('Link Default Types Navigate', function() {
        it('should not include default types in link', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', defaultTypes: { s1: 'string', s2: 'number' } }]}
                ]);
            var data = { s1: 'hello', s2: 'world' };
            var url = stateController.getNavigationLink('d', data);
            assert.notEqual(url.indexOf('s1=hello&'), -1);
            assert.notEqual(url.indexOf('s2=world1_'), -1);
        });
    });

    describe('Link Default Types Bool Navigate', function() {
        it('should not include default types in link', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', defaultTypes: { b1: 'boolean' } }]}
                ]);
            var data = { b1: true, b2: false };
            var url = stateController.getNavigationLink('d', data);
            assert.notEqual(url.indexOf('b1=true&'), -1);
            assert.notEqual(url.indexOf('b2=false1_'), -1);
        });
    });

    describe('Link Default Types Number Navigate', function() {
        it('should not include default types in link', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', defaultTypes: { n1: 'number' } }]}
                ]);
            var data = { n1: 0, n2: 1 };
            var url = stateController.getNavigationLink('d', data);
            assert.notEqual(url.indexOf('n1=0&'), -1);
            assert.notEqual(url.indexOf('n2=11_'), -1);
        });
    });

    describe('Link Default Types Refresh Navigate', function() {
        it('should not include default types in link', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', defaultTypes: { s1: 'string', s2: 'number', n1: 'number' } }]}
                ]);
            var data = {
                s1: 'hello',
                s2: 'world',
                n1: 0,
                n2: 1
            };
            stateController.navigate('d', data);
            var url = stateController.getRefreshLink(stateController.stateContext.includeCurrentData(null));
            assert.notEqual(url.indexOf('s1=hello&'), -1);
            assert.notEqual(url.indexOf('s2=world1_'), -1);
            assert.notEqual(url.indexOf('n1=0&'), -1);
            assert.notEqual(url.indexOf('n2=11_'), -1);
        });
    });

    describe('Override Default Types', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { s: 'b', b: true, n: 0 }, defaultTypes: { s: 'string', b: 'boolean', n: 'number' } }]}
                ]);
        });
        var data = {};
        data['s'] = true;
        data['b'] = 0;
        data['n'] = 'hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], true);
                assert.strictEqual(stateController.stateContext.data['b'], 0);
                assert.strictEqual(stateController.stateContext.data['n'], 'hello');
            });
        }
    });

    describe('Override Default Types Refresh', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { s: 'b', b: true, n: 0 }, defaultTypes: { s: 'string', b: 'boolean', n: 'number' } }]}
                ]);
        });
        var data = {};
        data['s'] = true;
        data['b'] = 0;
        data['n'] = 'hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.refresh(stateController.stateContext.includeCurrentData(null));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink(stateController.stateContext.includeCurrentData(null));
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], true);
                assert.strictEqual(stateController.stateContext.data['b'], 0);
                assert.strictEqual(stateController.stateContext.data['n'], 'hello');
            });
        }
    });

    describe('Override Default Types Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { s: 'b', b: true, n: 0 }, defaultTypes: { s: 'string', b: 'boolean', n: 'number' }, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's3' }
                    ]},
                    { key: 's3', route: 'r3', trackCrumbTrail: true }]}
                ]);
        });
        var data = {};
        data['s'] = true;
        data['b'] = 0;
        data['n'] = 'hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.navigate('t');
                stateController.navigate('t');
                stateController.navigateBack(2);
                stateController.refresh(stateController.stateContext.includeCurrentData({}));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink(stateController.stateContext.includeCurrentData(null));
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(2);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink(stateController.stateContext.includeCurrentData({}));
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], true);
                assert.strictEqual(stateController.stateContext.data['b'], 0);
                assert.strictEqual(stateController.stateContext.data['n'], 'hello');
            });
        }
    });

    describe('Reserved Url Character Default Types', function () {
        it('should not include default types in link', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', defaultTypes: { '*/()-_+~@:?><.;[]{}!£$%^#&': 'number' } }]}
                ]);
            var data = {};
            data['*/()-_+~@:?><.;[]{}!£$%^#&'] = 0;
            data['**=/()-_+~@:?><.;[]{}!£$%^#&&'] = 1;
            stateController.navigate('d', data);
            var url = stateController.getRefreshLink(stateController.stateContext.includeCurrentData({}));
            assert.notEqual(url.indexOf('=0&'), -1);
            assert.notEqual(url.indexOf('=11_'), -1);
            assert.strictEqual(stateController.stateContext.data['*/()-_+~@:?><.;[]{}!£$%^#&'], 0);
            assert.strictEqual(stateController.stateContext.data['**=/()-_+~@:?><.;[]{}!£$%^#&&'], 1);
        });
    });

    describe('Separator Url Character Default Types', function () {
        it('should not include default types in link', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', defaultTypes: { _0_1_2_3_4_5_: 'number' } }]}
                ]);
            var data = {};
            data['_0_1_2_3_4_5_'] = 10;
            data['__0_1_2_3_4_5_'] = 20;
            stateController.navigate('d', data);
            var url = stateController.getRefreshLink(stateController.stateContext.includeCurrentData(null));
            assert.notEqual(url.indexOf('=10&'), -1);
            assert.notEqual(url.indexOf('=201_'), -1);
            assert.strictEqual(stateController.stateContext.data['_0_1_2_3_4_5_'], 10);
            assert.strictEqual(stateController.stateContext.data['__0_1_2_3_4_5_'], 20);
        });
    });

    describe('Refresh Current Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';
        data['n'] = 1;
        data['c'] = '1';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.refresh(stateController.stateContext.includeCurrentData(null, ['s', 'c']));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink(stateController.stateContext.includeCurrentData(null, ['s', 'c']));
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['s'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['c'], '1');
                assert.strictEqual(stateController.stateContext.data['n'], undefined);
            });
        }
    });

    describe('Current Data Defaults', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', defaults: { emptyString: '', 'number': 4, char: 7 } }]}
                ]);
        });
        var data = {};
        data['emptyString'] = 'Hello';
        data['number'] = 1;
        data['char'] = '6';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.navigate('t', stateController.stateContext.includeCurrentData({}, ['number', 'char']));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', stateController.stateContext.includeCurrentData({}, ['number', 'char']));
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['emptyString'], '');
                assert.strictEqual(stateController.stateContext.data['number'], 1);
                assert.strictEqual(stateController.stateContext.data['char'], '6');
            });
        }
    });

    describe('Missing Route Data', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r/{s1}/{s2}' }]}
                ]);
        });
        
        describe('Navigate', function() {
            it('should throw error', function() {
                assert.throws(() => stateController.navigate('d'));
            });
        });

        describe('Navigate Link', function() {
            it('should be null', function() {
                assert.equal(stateController.getNavigationLink('d'), null);
            });
        });
    });

    describe('Missing Route Data Refresh', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r/{s1}/{s2}' }]}
                ]);
        });
        
        describe('Navigate', function() {
            it('should throw error', function() {
                stateController.navigate('d', { s1: 1, s2: 2 });
                assert.throws(() => stateController.refresh());
            });
        });

        describe('Navigate Link', function() {
            it('should be null', function() {
                var link = stateController.getNavigationLink('d', { s1: 1, s2: 2 });
                stateController.navigateLink(link);
                assert.equal(stateController.getRefreshLink(), null);
            });
        });
    });

    describe('Invalid Number Navigate', function () {
        it('should throw error', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r', defaultTypes: { 'number': 'number' } }]}
                ]);
            var link = stateController.getNavigationLink('d', { 'number': 35 });
            link = link.replace('number=35', 'number=invalid');
            assert.throws(() => stateController.navigateLink(link));
        });
    });

    describe('Invalid Boolean Navigate', function () {
        it('should throw error', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            var link = stateController.getNavigationLink('d', { '_bool': false });
            link = link.replace('_bool=false', '_bool=invalid');
            assert.throws(() => stateController.navigateLink(link));
        });
    });

    describe('Without Types Back Navigate', function () {
        it('should not track types', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 's0', trackTypes: false, trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 's1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 's2', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d', { x: '0_1_2_' });
            stateController.navigate('t');
            stateController.navigate('t');
            var link = stateController.getNavigationBackLink(2);
            stateController.navigateBack(2);
            assert.strictEqual ('/s0?x=0_1_2_', link);
            assert.strictEqual(stateController.stateContext.data.x, '0_1_2_');
        })
    });

    describe('Without Types Default Back Navigate', function () {
        it('should not track types', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 's0', trackTypes: false, defaults: { x: 2 }, defaultTypes: { y: 'boolean' }, trackCrumbTrail: false, transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 's1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 's2', trackCrumbTrail: true }]}
                ]);
            stateController.navigate('d', { x: '3', y: 'true' });
            stateController.navigate('t');
            stateController.navigate('t');
            var link = stateController.getNavigationBackLink(2);
            stateController.navigateLink(link);
            assert.strictEqual(stateController.stateContext.data.x, 3);
            assert.strictEqual(stateController.stateContext.data.y, true);
        });
    });

    describe('Without Types Array Type', function () {
        it('should not track types', function() {
            var stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: '{x}', trackTypes: false, defaultTypes: { x: 'numberarray', y: 'stringarray' }, trackCrumbTrail: false }]}
                ]);
            stateController.navigate('d', { x: [ 1, 2, '3' ], y: [ '_0_1', '-2-3', 4 ] });
            assert.strictEqual(stateController.stateContext.data.x[0], 1);
            assert.strictEqual(stateController.stateContext.data.x[1], 2);
            assert.strictEqual(stateController.stateContext.data.x[2], 3);
            assert.strictEqual(stateController.stateContext.data.y[0], '_0_1');
            assert.strictEqual(stateController.stateContext.data.y[1], '-2-3');
            assert.strictEqual(stateController.stateContext.data.y[2], '4');
        });
    });

    describe('Clear State Context', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });
        var data = {};
        data['s'] = 'Hello';

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.refresh(data);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink(data);
                stateController.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should clear State context', function() {
                stateController.clearStateContext();
                assert.strictEqual(Object.keys(stateController.stateContext.oldData).length, 0);
                assert.strictEqual(Object.keys(stateController.stateContext.previousData).length, 0);
                assert.strictEqual(Object.keys(stateController.stateContext.data).length, 0);
            });
        }
    });

    describe('Url Encode Data Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'a/{s}', transitions: [
                        { key: 't', to: 's1' }]},
                    { key: 's1', route: 'b', trackCrumbTrail: true }]},
                ]);
            var dialog = stateController.dialogs['d'];
            for(var key in dialog.states) {
                var state = dialog.states[key];
                state.stateHandler.urlEncode = (state, key, val) => {
                    return state == dialog.states['s0'] ? val.replace(' ', '+') : encodeURIComponent(val);
                }
                state.stateHandler.urlDecode = (state, key, val) => {
                    return state == dialog.states['s0'] ? val.replace('+', ' ') : decodeURIComponent(val);
                }
            }
        });
        var data = {};
        data['s'] = 'He llo';

        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });            
            test();
        });
        
        function test(){
            it('should populate data', function() {
                assert.strictEqual(stateController.stateContext.data.s, 'He llo');
            });
        }
    });

    describe('Two Controllers Data', function() {
        var stateController0: StateController;
        var stateController1: StateController;
        beforeEach(function() {
            stateController0 = new Navigation.StateController([
                { key: 'd0', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
            stateController1 = new Navigation.StateController([
                { key: 'd1', initial: 's', states: [
                    { key: 's', route: 'r' }]}
                ]);
        });
        var data0 = {};
        data0['string'] = 'Hello';
        data0['boolean'] = true;
        var data1 = {};
        data1['number'] = 0;
        data1['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController0.navigate('d0', data0);
                stateController1.navigate('d1', data1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController0.getNavigationLink('d0', data0);
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('d1', data1);
                stateController1.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController0.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController0.stateContext.data['boolean'], true);
                assert.strictEqual(stateController1.stateContext.data['number'], 0);
                assert.strictEqual(+stateController1.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateController0.stateContext.data).length, 2);
                assert.strictEqual(Object.keys(stateController1.stateContext.data).length, 2);
            });
        }
    });

    describe('Two Controllers Data Back', function() {
        var stateController0: StateController;
        var stateController1: StateController;
        beforeEach(function() {
            stateController0 = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
            stateController1 = new Navigation.StateController([
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
        });
        var data0 = {};
        data0['string'] = 'Hello';
        data0['boolean'] = true;
        var data1 = {};
        data1['number'] = 0;
        data1['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController0.navigate('d0', data0);
                stateController1.navigate('d1', data1);
                stateController0.navigate('t');
                stateController1.navigate('t');
                stateController0.navigateBack(1);
                stateController1.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController0.getNavigationLink('d0', data0);
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('d1', data1);
                stateController1.navigateLink(link);
                link = stateController0.getNavigationLink('t');
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('t');
                stateController1.navigateLink(link);
                link = stateController0.getNavigationBackLink(1);
                stateController0.navigateLink(link);
                link = stateController1.getNavigationBackLink(1);
                stateController1.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController0.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController0.stateContext.data['boolean'], true);
                assert.strictEqual(stateController1.stateContext.data['number'], 0);
                assert.strictEqual(+stateController1.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateController0.stateContext.data).length, 2);
                assert.strictEqual(Object.keys(stateController1.stateContext.data).length, 2);
            });
        }
    });

    describe('Two Controllers Refresh Data', function() {
        var stateController0: StateController;
        var stateController1: StateController;
        beforeEach(function() {
            stateController0 = new Navigation.StateController([
                { key: 'd0', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
            stateController1 = new Navigation.StateController([
                { key: 'd1', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1' }]}
                ]);
        });
        var data0 = {};
        data0['string'] = 'Hello';
        data0['boolean'] = true;
        var data1 = {};
        data1['number'] = 0;
        data1['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController0.navigate('d0');
                stateController0.navigate('t');
                stateController0.refresh(data0);
                stateController1.navigate('d1');
                stateController1.navigate('t');
                stateController1.refresh(data1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController0.getNavigationLink('d0');
                stateController0.navigateLink(link);
                link = stateController0.getNavigationLink('t');
                stateController0.navigateLink(link);
                link = stateController0.getRefreshLink(data0);
                stateController0.navigateLink(link);
                link = stateController1.getNavigationLink('d1');
                stateController1.navigateLink(link);
                link = stateController1.getNavigationLink('t');
                stateController1.navigateLink(link);
                link = stateController1.getRefreshLink(data1);
                stateController1.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController0.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController0.stateContext.data['boolean'], true);
                assert.strictEqual(stateController1.stateContext.data['number'], 0);
                assert.strictEqual(+stateController1.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateController0.stateContext.data).length, 2);
                assert.strictEqual(Object.keys(stateController1.stateContext.data).length, 2);
            });
        }
    });
    
    describe('Crumb Trail Route Param', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1/{crumb?}', trackCrumbTrail: true }]}
                ]);
        });
        var data = {};
        data['string'] = 'Hello';
        data['boolean'] = true;
        data['number'] = 0;
        data['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d', data);
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['boolean'], true);
                assert.strictEqual(stateController.stateContext.data['number'], 0);
                assert.strictEqual(+stateController.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateController.stateContext.data).length, 4);
            });
        }
    });
    
    describe('Crumb Trail Route Splat Param', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true, transitions: [
                        { key: 't', to: 's2' }
                    ]},
                    { key: 's2', route: 'r2/{*crumb?}', trackCrumbTrail: true }]}
                ]);
        });
        var data = {};
        data['string'] = 'Hello';
        data['boolean'] = true;
        data['number'] = 0;
        data['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.navigate('t');
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t');
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['boolean'], true);
                assert.strictEqual(stateController.stateContext.data['number'], 0);
                assert.strictEqual(+stateController.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateController.stateContext.data).length, 4);
            });
        }
    });
    
    describe('Repeated States Data Back', function() {
        var stateController: StateController;
        beforeEach(function() {
            stateController = new Navigation.StateController([
                { key: 'd', initial: 's0', states: [
                    { key: 's0', route: 'r0', transitions: [
                        { key: 't', to: 's1' }
                    ]},
                    { key: 's1', route: 'r1', trackCrumbTrail: true }]}
                ]);
            var state = stateController.dialogs['d'].states['s1'];
            state.stateHandler.truncateCrumbTrail = (state, crumbs) => {
                return crumbs;
            };
        });
        var data = {};
        data['string'] = 'Hello';
        data['boolean'] = true;
        data['number'] = 0;
        data['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateController.navigate('d');
                stateController.navigate('t', data);
                stateController.refresh();
                stateController.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateController.getNavigationLink('d');
                stateController.navigateLink(link);
                link = stateController.getNavigationLink('t', data);
                stateController.navigateLink(link);
                link = stateController.getRefreshLink();
                stateController.navigateLink(link);
                link = stateController.getNavigationBackLink(1);
                stateController.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateController.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateController.stateContext.data['boolean'], true);
                assert.strictEqual(stateController.stateContext.data['number'], 0);
                assert.strictEqual(+stateController.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateController.stateContext.data).length, 4);
            });
        }
    });
});
