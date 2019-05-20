import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from 'navigation';

describe('Navigation Data', function () {
    describe('Individual Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
        });
        var individualNavigationData = {};
        individualNavigationData['string'] = 'Hello';
        individualNavigationData['boolean'] = true;
        individualNavigationData['number'] = 0;
        individualNavigationData['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', individualNavigationData);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s', individualNavigationData);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s', individualNavigationData)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['boolean'], true);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 0);
                assert.strictEqual(+stateNavigator.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 4);
            });
        }
    });

    describe('Individual Data Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r/{string}/{boolean}/{number}/{date}' }
            ]);
        });
        var individualNavigationData = {};
        individualNavigationData['string'] = 'Hello';
        individualNavigationData['boolean'] = true;
        individualNavigationData['number'] = 0;
        individualNavigationData['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', individualNavigationData);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s', individualNavigationData);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s', individualNavigationData)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['boolean'], true);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 0);
                assert.strictEqual(+stateNavigator.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 4);
            });
        }
    });
    
    describe('Individual Data Without Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: false }
            ]);
        });
        var individualNavigationData = {};
        individualNavigationData['string'] = 'Hello';
        individualNavigationData['boolean'] = true;
        individualNavigationData['number'] = 0;
        individualNavigationData['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', individualNavigationData);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s', individualNavigationData);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s', individualNavigationData)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['boolean'], true);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 0);
                assert.strictEqual(+stateNavigator.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 4);
            });
        }
    });

    describe('Array Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
        });
        var arrayNavigationData = {};
        arrayNavigationData['array_string'] = ['He-llo', 'World'];
        arrayNavigationData['array_boolean'] = [true, false];
        arrayNavigationData['array_number'] = [1, 2.5, -3];
        arrayNavigationData['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', arrayNavigationData);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s', arrayNavigationData);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s', arrayNavigationData)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateNavigator.stateContext.data['array_string'][1], 'World');
                assert.strictEqual(stateNavigator.stateContext.data['array_string'].length, 2);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'][0], true);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'][1], false);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'].length, 2);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][0], 1);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][1], 2.5);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][2], -3);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'].length, 3);
                assert.strictEqual(+stateNavigator.stateContext.data['array_date'][0], +new Date(2010, 3, 7));
                assert.strictEqual(+stateNavigator.stateContext.data['array_date'][1], +new Date(2011, 7, 3));
                assert.strictEqual(stateNavigator.stateContext.data['array_date'].length, 2);
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 4);
            });
        }
    });

    describe('Array Data Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r0/{array_string}/{array_boolean}/{array_number}/{array_date}' }
            ]);
        });
        var arrayNavigationData = {};
        arrayNavigationData['array_string'] = ['He-llo', 'World'];
        arrayNavigationData['array_boolean'] = [true, false];
        arrayNavigationData['array_number'] = [1, 2.5, -3];
        arrayNavigationData['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', arrayNavigationData);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s', arrayNavigationData);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s', arrayNavigationData)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateNavigator.stateContext.data['array_string'][1], 'World');
                assert.strictEqual(stateNavigator.stateContext.data['array_string'].length, 2);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'][0], true);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'][1], false);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'].length, 2);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][0], 1);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][1], 2.5);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][2], -3);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'].length, 3);
                assert.strictEqual(+stateNavigator.stateContext.data['array_date'][0], +new Date(2010, 3, 7));
                assert.strictEqual(+stateNavigator.stateContext.data['array_date'][1], +new Date(2011, 7, 3));
                assert.strictEqual(stateNavigator.stateContext.data['array_date'].length, 2);
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 4);
            });
        }
    });

    describe('Array Data Splat', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r0/{*array_string}/a/{*array_boolean}/b/{*array_number}/c/{*array_date}' }
            ]);
        });
        var arrayNavigationData = {};
        arrayNavigationData['array_string'] = ['He-llo', 'World'];
        arrayNavigationData['array_boolean'] = [true, false];
        arrayNavigationData['array_number'] = [1, 2.5, -3];
        arrayNavigationData['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', arrayNavigationData);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s', arrayNavigationData);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s', arrayNavigationData)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateNavigator.stateContext.data['array_string'][1], 'World');
                assert.strictEqual(stateNavigator.stateContext.data['array_string'].length, 2);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'][0], true);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'][1], false);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'].length, 2);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][0], 1);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][1], 2.5);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][2], -3);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'].length, 3);
                assert.strictEqual(+stateNavigator.stateContext.data['array_date'][0], +new Date(2010, 3, 7));
                assert.strictEqual(+stateNavigator.stateContext.data['array_date'][1], +new Date(2011, 7, 3));
                assert.strictEqual(stateNavigator.stateContext.data['array_date'].length, 2);
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 4);
            });
        }
    });

    describe('Invalid Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
        });
        var data = {};
        data['item'] = {};
        
        describe('Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.navigate('s', data));
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.getNavigationLink('s', data));
            });
        });

        describe('Fluent Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.fluent().navigate('s', data));
            });
        });
    });

    describe('Invalid Array Data', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            stateNavigator.navigate('s0');
        });
        var data = {}
        data['item'] = [{}];
    
        describe('Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.navigate('s1', data));
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.getNavigationLink('s1', data));
            });
        });

        describe('Fluent Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.fluent(true).navigate('s1', data));
            });
        });
    });

    describe('Blank Array Data', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            stateNavigator.navigate('s0');
        });

        describe('Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.navigate('s1', { item: [''] }));
                assert.throws(() => stateNavigator.navigate('s1', { item: [null] }));
                assert.throws(() => stateNavigator.navigate('s1', { item: [undefined] }));
                assert.throws(() => stateNavigator.navigate('s1', { item: ['a', ''] }));
                assert.throws(() => stateNavigator.navigate('s1', { item: ['a', null] }));
                assert.throws(() => stateNavigator.navigate('s1', { item: ['a', undefined] }));
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.getNavigationLink('s1', { item: [''] }));
                assert.throws(() => stateNavigator.getNavigationLink('s1', { item: [null] }));
                assert.throws(() => stateNavigator.getNavigationLink('s1', { item: [undefined] }));
                assert.throws(() => stateNavigator.getNavigationLink('s1', { item: ['a', ''] }));
                assert.throws(() => stateNavigator.getNavigationLink('s1', { item: ['a', null] }));
                assert.throws(() => stateNavigator.getNavigationLink('s1', { item: ['a', undefined] }));
            });
        });

        describe('Fluent Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.fluent(true).navigate('s1', { item: [''] }));
                assert.throws(() => stateNavigator.fluent(true).navigate('s1', { item: [null] }));
                assert.throws(() => stateNavigator.fluent(true).navigate('s1', { item: [undefined] }));
                assert.throws(() => stateNavigator.fluent(true).navigate('s1', { item: ['a', ''] }));
                assert.throws(() => stateNavigator.fluent(true).navigate('s1', { item: ['a', null] }));
                assert.throws(() => stateNavigator.fluent(true).navigate('s1', { item: ['a', undefined] }));
            });
        });
    });

    describe('Invalid Data Refresh', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
            stateNavigator.stateContext.data['item'] = {};
        });
        
        describe('Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.refresh(stateNavigator.stateContext.includeCurrentData(null)));
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.getRefreshLink(stateNavigator.stateContext.includeCurrentData(null)));
            });
        });

        describe('Fluent Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.fluent(true).refresh((currentData) => currentData));
            });
        });
    });

    describe('Invalid Refresh Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
        });
        
        describe('Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.refresh({ item: {} }));
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.getRefreshLink({ item: {} }));
            });
        });

        describe('Fluent Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.fluent(true).refresh({ item: {} }));
            });
        });
    });

    describe('Blank Array Refresh Data', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.navigate('s');
        });

        describe('Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.refresh({ item: [''] }));
                assert.throws(() => stateNavigator.refresh({ item: [null] }));
                assert.throws(() => stateNavigator.refresh({ item: [undefined] }));
                assert.throws(() => stateNavigator.refresh({ item: ['a', ''] }));
                assert.throws(() => stateNavigator.refresh({ item: ['a', null] }));
                assert.throws(() => stateNavigator.refresh({ item: ['a', undefined] }));
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.getRefreshLink({ item: [''] }));
                assert.throws(() => stateNavigator.getRefreshLink({ item: [null] }));
                assert.throws(() => stateNavigator.getRefreshLink({ item: [undefined] }));
                assert.throws(() => stateNavigator.getRefreshLink({ item: ['a', ''] }));
                assert.throws(() => stateNavigator.getRefreshLink({ item: ['a', null] }));
                assert.throws(() => stateNavigator.getRefreshLink({ item: ['a', undefined] }));
            });
        });

        describe('Fluent Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.fluent(true).refresh({ item: [''] }));
                assert.throws(() => stateNavigator.fluent(true).refresh({ item: [null] }));
                assert.throws(() => stateNavigator.fluent(true).refresh({ item: [undefined] }));
                assert.throws(() => stateNavigator.fluent(true).refresh({ item: ['a', ''] }));
                assert.throws(() => stateNavigator.fluent(true).refresh({ item: ['a', null] }));
                assert.throws(() => stateNavigator.fluent(true).refresh({ item: ['a', undefined] }));
            });
        });
    });

    describe('Invalid Types Array Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
        });
        var data = {};
        data['item0'] = ['0', 1];
        data['item1'] = [0, '1'];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s', data);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s', data)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['item0'][0], '0');
                assert.strictEqual(stateNavigator.stateContext.data['item0'][1], '1');
                assert.strictEqual(stateNavigator.stateContext.data['item1'][0], 0);
                assert.strictEqual(stateNavigator.stateContext.data['item1'][1], 1);
            });
        }
    });

    describe('Invalid Data With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['item'] = {};
        
        describe('Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.navigate('s', data));
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.getNavigationLink('s', data));
            });
        });

        describe('Fluent Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.fluent().navigate('s', data));
            });
        });
    });

    describe('Reserved Url Character Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .navigate('s1')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
            });
        }
    });

    describe('Reserved Url Character Route Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r/{string}/{number}' }
            ]);
        });
        var data = {};
        data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        data['string'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        data['_bool'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        data['number'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s', data);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s', data)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
                assert.strictEqual(stateNavigator.stateContext.data['string'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
                assert.strictEqual(stateNavigator.stateContext.data['_bool'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
                assert.strictEqual(stateNavigator.stateContext.data['number'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
            });
        }
    });

    describe('Separator Url Character Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['_0_1_2_3_4_5_'] = '__00__11__22__33__44__55__';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .navigate('s1')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['_0_1_2_3_4_5_'], '__00__11__22__33__44__55__');
            });
        }
    });
    
    describe('Empty String Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
        });
        var data = {};
        data['s'] = '';
        data['t'] = '1';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s', data);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s', data)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t'], '1');
            });
        }
    });

    describe('Empty Array Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
        });
        var data = {};
        data['s'] = [];
        data['t'] = ['1'];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s', data);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s', data)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t'][0], '1');
            });
        }
    });

    describe('Async Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.states.s.navigating = (data, url, navigate) => {
                navigate({s: 1});
            }
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.asyncData['s'], 1);
            });
        }
    });

    describe('No Async Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
            ]);
            stateNavigator.states.s0.navigating = (data, url, navigate) => {
                navigate({s: 1});
            }
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should not populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.asyncData, undefined);
            });
        }
    });

    describe('Navigate Data Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['string'] = 'Hello';
        data['boolean'] = true;
        data['number'] = 0;
        data['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .navigate('s1')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['boolean'], true);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 0);
                assert.strictEqual(+stateNavigator.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 4);
            });
        }
    });

    describe('Navigate Data Back Crumb Trail Key', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: 'xx' }
            ]);
        });
        var data = {};
        data['string'] = 'Hello';
        data['boolean'] = true;
        data['number'] = 0;
        data['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .navigate('s1')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['boolean'], true);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 0);
                assert.strictEqual(+stateNavigator.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 4);
            });
        }
    });

    describe('Navigate Array Data Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['array_string'] = ['He-llo', 'World'];
        data['array_boolean'] = [true, false];
        data['array_number'] = [1, 2.5, -3];
        data['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .navigate('s1')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateNavigator.stateContext.data['array_string'][1], 'World');
                assert.strictEqual(stateNavigator.stateContext.data['array_string'].length, 2);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'][0], true);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'][1], false);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'].length, 2);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][0], 1);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][1], 2.5);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][2], -3);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'].length, 3);
                assert.strictEqual(+stateNavigator.stateContext.data['array_date'][0], +new Date(2010, 3, 7));
                assert.strictEqual(+stateNavigator.stateContext.data['array_date'][1], +new Date(2011, 7, 3));
                assert.strictEqual(stateNavigator.stateContext.data['array_date'].length, 2);
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 4);
            });
        }
    });

    describe('Navigate Array Data Route Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0/{array_string}/{array_boolean}/{array_number}/{array_date}' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['array_string'] = ['He-llo', 'World'];
        data['array_boolean'] = [true, false];
        data['array_number'] = [1, 2.5, -3];
        data['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .navigate('s1')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateNavigator.stateContext.data['array_string'][1], 'World');
                assert.strictEqual(stateNavigator.stateContext.data['array_string'].length, 2);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'][0], true);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'][1], false);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'].length, 2);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][0], 1);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][1], 2.5);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][2], -3);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'].length, 3);
                assert.strictEqual(+stateNavigator.stateContext.data['array_date'][0], +new Date(2010, 3, 7));
                assert.strictEqual(+stateNavigator.stateContext.data['array_date'][1], +new Date(2011, 7, 3));
                assert.strictEqual(stateNavigator.stateContext.data['array_date'].length, 2);
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 4);
            });
        }
    });

    describe('Navigate Array Data Splat Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0/{*array_string}/a/{*array_boolean}/b/{*array_number}/c/{*array_date}' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['array_string'] = ['He-llo', 'World'];
        data['array_boolean'] = [true, false];
        data['array_number'] = [1, 2.5, -3];
        data['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .navigate('s1')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateNavigator.stateContext.data['array_string'][1], 'World');
                assert.strictEqual(stateNavigator.stateContext.data['array_string'].length, 2);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'][0], true);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'][1], false);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'].length, 2);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][0], 1);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][1], 2.5);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][2], -3);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'].length, 3);
                assert.strictEqual(+stateNavigator.stateContext.data['array_date'][0], +new Date(2010, 3, 7));
                assert.strictEqual(+stateNavigator.stateContext.data['array_date'][1], +new Date(2011, 7, 3));
                assert.strictEqual(stateNavigator.stateContext.data['array_date'].length, 2);
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 4);
            });
        }
    });

    describe('Navigate Empty String Data Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['s'] = '';
        data['t'] = '1';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .navigate('s1')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t'], '1');
            });
        }
    });

    describe('Navigate Empty Array Data Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['s'] = [];
        data['t'] = ['1'];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .navigate('s1')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t'][0], '1');
            });
        }
    });

    describe('Change Data Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.stateContext.data['s'] = 'World';
                stateNavigator.stateContext.data['i'] = 2;
                stateNavigator.refresh(stateNavigator.stateContext.includeCurrentData({}))
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                stateNavigator.stateContext.data['s'] = 'World';
                stateNavigator.stateContext.data['i'] = 2;
                link = stateNavigator.getRefreshLink(stateNavigator.stateContext.includeCurrentData({}));
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .url;
                stateNavigator.navigateLink(link);
                stateNavigator.stateContext.data['s'] = 'World';
                stateNavigator.stateContext.data['i'] = 2;
                link = stateNavigator.fluent(true)
                    .refresh((currentData) => currentData)
                    .navigate('s1')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], 'World');
                assert.strictEqual(stateNavigator.stateContext.data['i'], 2);
            });
        }
    });
    
    describe('Blank Data Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.stateContext.data['s'] = null;
                stateNavigator.stateContext.data['i'] = 2;
                stateNavigator.refresh(stateNavigator.stateContext.includeCurrentData({}))
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                stateNavigator.stateContext.data['s'] = null;
                stateNavigator.stateContext.data['i'] = 2;
                link = stateNavigator.getRefreshLink(stateNavigator.stateContext.includeCurrentData({}));
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .url;
                stateNavigator.navigateLink(link);
                stateNavigator.stateContext.data['s'] = null;
                stateNavigator.stateContext.data['i'] = 2;
                link = stateNavigator.fluent(true)
                    .refresh((currentData) => currentData)
                    .navigate('s1')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['i'], 2);
            });
        }
    });

    describe('Data Refresh', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.refresh(stateNavigator.stateContext.includeCurrentData(null));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink(stateNavigator.stateContext.includeCurrentData(null));
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .refresh((currentData) => currentData)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], 'Hello');
            });
        }
    });

    describe('Refresh Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
        });
        var data = {};
        data['string'] = 'Hello';
        data['boolean'] = true;
        data['number'] = 0;
        data['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.refresh(data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink(data);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1')
                    .refresh(data)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['boolean'], true);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 0);
                assert.strictEqual(+stateNavigator.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 4);
            });
        }
    });

    describe('Refresh Array Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
        });
        var data = {};
        data['array_string'] = ['He-llo', 'World'];
        data['array_boolean'] = [true, false];
        data['array_number'] = [1, 2.5, -3];
        data['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.refresh(data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink(data);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1')
                    .refresh(data)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateNavigator.stateContext.data['array_string'][1], 'World');
                assert.strictEqual(stateNavigator.stateContext.data['array_string'].length, 2);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'][0], true);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'][1], false);
                assert.strictEqual(stateNavigator.stateContext.data['array_boolean'].length, 2);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][0], 1);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][1], 2.5);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'][2], -3);
                assert.strictEqual(stateNavigator.stateContext.data['array_number'].length, 3);
                assert.strictEqual(+stateNavigator.stateContext.data['array_date'][0], +new Date(2010, 3, 7));
                assert.strictEqual(+stateNavigator.stateContext.data['array_date'][1], +new Date(2011, 7, 3));
                assert.strictEqual(stateNavigator.stateContext.data['array_date'].length, 2);
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 4);
            });
        }
    });

    describe('Refresh Data Override', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
        });
        var data1 = {};
        data1['s'] = 'Hello';
        var data2 = {};
        data2['s'] = 'World';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data1);
                stateNavigator.refresh(data2);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data1);
                stateNavigator.navigateLink(link);
                var link = stateNavigator.getRefreshLink(data2);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data1)
                    .refresh(data2)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], 'World');
            });
        }
    });

    describe('Refresh Data Blank', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
        });
        var data = {};
        data['s'] = 'Hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink();
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .refresh()
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
            });
        }
    });

    describe('Change Refresh Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
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
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data1);
                stateNavigator.refresh(data2);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink(data2);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data1)
                    .refresh(data2)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], 'World');
                assert.strictEqual(stateNavigator.stateContext.data['n'], 4);
                assert.strictEqual(stateNavigator.stateContext.data['i'], undefined);
            });
        }
    });

    describe('Wizard Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        var data = {
            s: 'Hello',
            n: 5
        };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2', stateNavigator.stateContext.includeCurrentData(null));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2', stateNavigator.stateContext.includeCurrentData(null));
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .url;
                stateNavigator.navigateLink(link);
                link = stateNavigator.fluent(true)
                    .navigate('s2', (currentData) => currentData)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.oldData['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.oldData['n'], 5);
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.previousData['n'], 5);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['n'], 5);
                assert.strictEqual(stateNavigator.stateContext.data['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['n'], 5);
            });
        }
    });

    describe('Wizard Data Defaults', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { b: true } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        var data = {
            s: 'Hello',
            n: 5
        };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2', stateNavigator.stateContext.includeCurrentData(null));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2', stateNavigator.stateContext.includeCurrentData(null));
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2', currentData => currentData)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.previousData['n'], 5);
                assert.strictEqual(stateNavigator.stateContext.previousData['b'], true);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['n'], 5);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['b'], true);
                assert.strictEqual(stateNavigator.stateContext.data['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['n'], 5);
                assert.strictEqual(stateNavigator.stateContext.data['b'], true);
            });
        }
    });

    describe('Wizard Refresh Data Defaults', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { b: true } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        var data = {
            s: 'Hello',
            n: 5
        };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s1');
                stateNavigator.refresh(data);
                stateNavigator.navigate('s2', stateNavigator.stateContext.includeCurrentData(null));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink(data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2', stateNavigator.stateContext.includeCurrentData(null));
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s1')
                    .refresh(data)
                    .navigate('s2', currentData => currentData)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.previousData['n'], 5);
                assert.strictEqual(stateNavigator.stateContext.previousData['b'], true);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['n'], 5);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['b'], true);
                assert.strictEqual(stateNavigator.stateContext.data['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['n'], 5);
                assert.strictEqual(stateNavigator.stateContext.data['b'], true);
            });
        }
    });

    describe('Transition Transition', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
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
                stateNavigator.navigate('s0', data1);
                stateNavigator.navigate('s1', data2);
                stateNavigator.navigate('s2', data3);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data2);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2', data3);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data1)
                    .navigate('s1', data2)
                    .url;
                stateNavigator.navigateLink(link);
                link = stateNavigator.fluent(true)
                    .navigate('s2', data3)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.oldData['s'], 2);
                assert.strictEqual(stateNavigator.stateContext.oldData['t'], '2');
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], 2);
                assert.strictEqual(stateNavigator.stateContext.previousData['t'], '2');
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['s'], 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['t'], undefined);
                assert.equal(Object.keys(stateNavigator.stateContext.crumbs[0].data).length, 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['s'], 2);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['t'], '2');
                assert.equal(Object.keys(stateNavigator.stateContext.crumbs[1].data).length, 2);
                assert.strictEqual(stateNavigator.stateContext.data['s'], 3);
                assert.strictEqual(stateNavigator.stateContext.data['t'], '3');
            });
        }
    });

    describe('Transition Transition Crumb Trail Key', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: 'xx' },
                { key: 's2', route: 'r2', trackCrumbTrail: 'yy' }
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
                stateNavigator.navigate('s0', data1);
                stateNavigator.navigate('s1', data2);
                stateNavigator.navigate('s2', data3);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data2);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2', data3);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data1)
                    .navigate('s1', data2)
                    .url;
                stateNavigator.navigateLink(link);
                link = stateNavigator.fluent(true)
                    .navigate('s2', data3)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.oldData['s'], 2);
                assert.strictEqual(stateNavigator.stateContext.oldData['t'], '2');
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], 2);
                assert.strictEqual(stateNavigator.stateContext.previousData['t'], '2');
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['s'], 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['t'], undefined);
                assert.equal(Object.keys(stateNavigator.stateContext.crumbs[0].data).length, 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['s'], 2);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['t'], '2');
                assert.equal(Object.keys(stateNavigator.stateContext.crumbs[1].data).length, 2);
                assert.strictEqual(stateNavigator.stateContext.data['s'], 3);
                assert.strictEqual(stateNavigator.stateContext.data['t'], '3');
            });
        }
    });

    describe('Dynamic Data Transition Transition', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
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
                stateNavigator.navigate('s0', data1);
                stateNavigator.navigate('s1', data2);
                stateNavigator.navigate('s2', data3);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data2);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2', data3);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data1)
                    .navigate('s1', data2)
                    .url;
                stateNavigator.navigateLink(link);
                link = stateNavigator.fluent(true)
                    .navigate('s2', data3)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.oldData.s, '2');
                assert.strictEqual(stateNavigator.stateContext.previousData.s, '2');
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data.s, 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['s'], 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data.s, '2');
                assert.strictEqual(stateNavigator.stateContext.data.s, '3');
            });
        }
    });

    describe('Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s'];
            state.truncateCrumbTrail = (state, data, crumbs) => {
                var lastCrumb = crumbs[crumbs.length - 1];
                return lastCrumb && lastCrumb.data.n === data.n ? crumbs.slice(0, -1) : crumbs;
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
                stateNavigator.navigate('s', { n: 1, t: 'a' });
                stateNavigator.navigate('s', { n: 1, t: 'b' });
                stateNavigator.navigate('s', { n: 2 });
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s', { n: 1, t: 'a' });
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s', { n: 1, t: 'b' });
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s', { n: 2 });
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s')
                    .navigate('s', { n: 1, t: 'a' })
                    .navigate('s', { n: 1, t: 'b' })
                    .navigate('s', { n: 2 })
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate crumb trail', function() {
                assert.equal(stateNavigator.stateContext.crumbs.length, 2);
                assert.equal(stateNavigator.stateContext.crumbs[0].state, stateNavigator.states['s']);
                assert.equal(stateNavigator.stateContext.crumbs[0].data.n, null);
                assert.equal(stateNavigator.stateContext.crumbs[1].state, stateNavigator.states['s']);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data.n, 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data.t, 'b');
            });
        }
    });

    describe('Individual Data Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s'];
            state.truncateCrumbTrail = (state, data, crumbs) => {
                if (data['string'] === 'Hello' && data['boolean'] === true
                    && data['number'] === 0 && +data['date'] === +new Date(2010, 3, 7))
                    return crumbs;
                return [];
            };
        });
        var individualNavigationData = {};
        individualNavigationData['string'] = 'Hello';
        individualNavigationData['boolean'] = true;
        individualNavigationData['number'] = 0;
        individualNavigationData['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
                stateNavigator.navigate('s', individualNavigationData);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s', individualNavigationData);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s')
                    .navigate('s', individualNavigationData)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate crumb trail', function() {
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('Refresh Individual Data Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s'];
            state.truncateCrumbTrail = (state, data, crumbs) => {
                if (data['string'] === 'Hello' && data['boolean'] === true
                    && data['number'] === 0 && +data['date'] === +new Date(2010, 3, 7))
                    return crumbs;
                return [];
            };
        });
        var individualNavigationData = {};
        individualNavigationData['string'] = 'Hello';
        individualNavigationData['boolean'] = true;
        individualNavigationData['number'] = 0;
        individualNavigationData['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
                stateNavigator.refresh();
                stateNavigator.refresh(individualNavigationData);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
                var link = stateNavigator.getRefreshLink();
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink(individualNavigationData);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s')
                    .refresh()
                    .refresh(individualNavigationData)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate crumb trail', function() {
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('Array Data Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s'];
            state.truncateCrumbTrail = (state, data, crumbs) => {
                if (data.array_string && data.array_string[0] === 'He-llo' && data.array_string[1] === 'World'
                    && data.array_boolean[0] === true && data.array_boolean[1] === false
                    && data.array_number[0] === 1 && data.array_number[1] === 2.5 && data.array_number[2] === -3
                    && +data.array_date[0] === +new Date(2010, 3, 7) && +data.array_date[1] === +new Date(2011, 7, 3))
                    return crumbs;
                return [];
            };
        });
        var arrayNavigationData = {};
        arrayNavigationData['array_string'] = ['He-llo', 'World'];
        arrayNavigationData['array_boolean'] = [true, false];
        arrayNavigationData['array_number'] = [1, 2.5, -3];
        arrayNavigationData['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
                stateNavigator.navigate('s', arrayNavigationData);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s', arrayNavigationData);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s')
                    .navigate('s', arrayNavigationData)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate crumb trail', function() {
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('Defaults', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', defaults: { 'string': 'Hello', _bool: true, 'number': 1, 'date': new Date(2010, 3, 7) } }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 1);
                assert.strictEqual(+stateNavigator.stateContext.data['date'], +new Date(2010, 3, 7));
            });
        }
    });

    describe('Defaults Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r/{string}/{number}', defaults: { 'string': 'Hello', _bool: true, 'number': 1, 'date': new Date(2010, 3, 7) } }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 1);
                assert.strictEqual(+stateNavigator.stateContext.data['date'], +new Date(2010, 3, 7));
            });
        }
    });

    describe('Data And Defaults', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', defaults: { emptyString: '', 'number': 4, char: 7 } }
            ]);
        });
        var data = { s: 1, t: '', 'number': '' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['emptyString'], '');
                assert.strictEqual(stateNavigator.stateContext.data['number'], 4);
                assert.strictEqual(stateNavigator.stateContext.data['char'], 7);
                assert.strictEqual(stateNavigator.stateContext.data['s'], 1);
                assert.strictEqual(stateNavigator.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Data And Defaults Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r/{char}/{number?}', defaults: { emptyString: '', 'number': 4, char: 7 } }
            ]);
        });
        var data = { s: 1, t: '', 'number': '' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['emptyString'], '');
                assert.strictEqual(stateNavigator.stateContext.data['number'], 4);
                assert.strictEqual(stateNavigator.stateContext.data['char'], 7);
                assert.strictEqual(stateNavigator.stateContext.data['s'], 1);
                assert.strictEqual(stateNavigator.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Override Defaults', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', defaults: { emptyString: '', 'number': 4, char: 7 } }
            ]);
        });
        var data = { emptyString: 2, 'number': 1, char: 5 };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['emptyString'], 2);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.data['char'], 5);
            });
        }
    });

    describe('Override Defaults Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r/{char}/{number?}', defaults: { emptyString: '', 'number': 4, char: 7 } }
            ]);
        });
        var data = { emptyString: 2, 'number': 1, char: 5 };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['emptyString'], 2);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.data['char'], 5);
            });
        }
    });

    describe('Back Defaults', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1')
                    .navigate('s2')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 1);
            });
        }
    });

    describe('Back Defaults Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1')
                    .navigate('s2')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 1);
            });
        }
    });

    describe('Back Data And Defaults', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['emptyString'], '');
                assert.strictEqual(stateNavigator.stateContext.data['number'], 4);
                assert.strictEqual(stateNavigator.stateContext.data['char'], 7);
                assert.strictEqual(stateNavigator.stateContext.data['s'], 1);
                assert.strictEqual(stateNavigator.stateContext.data['t'], '2');
            });
        }
    });

    describe('Back Data And Defaults Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r/{char}/{number?}', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['emptyString'], '');
                assert.strictEqual(stateNavigator.stateContext.data['number'], 4);
                assert.strictEqual(stateNavigator.stateContext.data['char'], 7);
                assert.strictEqual(stateNavigator.stateContext.data['s'], 1);
                assert.strictEqual(stateNavigator.stateContext.data['t'], '2');
            });
        }
    });

    describe('Back Override Defaults', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['emptyString'], 'World');
                assert.strictEqual(stateNavigator.stateContext.data['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.data['char'], 5);
            });
        }
    });

    describe('Back Override Defaults Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r/{char}/{number?}', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['emptyString'], 'World');
                assert.strictEqual(stateNavigator.stateContext.data['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.data['char'], 5);
            });
        }
    });

    describe('Crumb Defaults', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 } },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s3');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1')
                    .navigate('s2')
                    .navigate('s3')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.previousData['emptyString'], '');
                assert.strictEqual(stateNavigator.stateContext.previousData['number'], 4);
                assert.strictEqual(stateNavigator.stateContext.previousData['char'], 7);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['string'], undefined);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['_bool'], undefined);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[2].data['emptyString'], '');
                assert.strictEqual(stateNavigator.stateContext.crumbs[2].data['number'], 4);
                assert.strictEqual(stateNavigator.stateContext.crumbs[2].data['char'], 7);
            });
        }
    });

    describe('Crumb Defaults Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                { key: 's2', route: 'r2/{char}/{number?}', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 } },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s3');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1')
                    .navigate('s2')
                    .navigate('s3')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.previousData['emptyString'], '');
                assert.strictEqual(stateNavigator.stateContext.previousData['number'], 4);
                assert.strictEqual(stateNavigator.stateContext.previousData['char'], 7);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['string'], undefined);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['_bool'], undefined);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[2].data['emptyString'], '');
                assert.strictEqual(stateNavigator.stateContext.crumbs[2].data['number'], 4);
                assert.strictEqual(stateNavigator.stateContext.crumbs[2].data['char'], 7);
            });
        }
    });

    describe('Crumb Data And Defaults', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.previousData['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], 1);
                assert.strictEqual(stateNavigator.stateContext.previousData['t'], '2');
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['string'], undefined);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['s'], 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['t'], '2');
            });
        }
    });

    describe('Crumb Data And Defaults Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.previousData['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.previousData['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.previousData['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], 1);
                assert.strictEqual(stateNavigator.stateContext.previousData['t'], '2');
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['string'], undefined);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['s'], 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['t'], '2');
            });
        }
    });

    describe('Crumb Data Override Defaults', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.previousData['string'], 'World');
                assert.strictEqual(stateNavigator.stateContext.previousData['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.previousData['number'], 0);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['string'], 'World');
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['number'], 0);
            });
        }
    });

    describe('Crumb Data Override Defaults Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.previousData['string'], 'World');
                assert.strictEqual(stateNavigator.stateContext.previousData['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.previousData['number'], 0);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['string'], 'World');
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['number'], 0);
            });
        }
    });

    describe('Defaults Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }
            ]);
            var state = stateNavigator.states['s'];
            state.truncateCrumbTrail = (state, data, crumbs) => {
                if (data['string'] === 'Hello' && data._bool === true && data['number'] === 1)
                    return crumbs;
                return [];
            };
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
                stateNavigator.navigate('s');
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s')
                    .navigate('s')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate crumb trail', function() {
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('Override Defaults Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }
            ]);
            var state = stateNavigator.states['s'];
            state.truncateCrumbTrail = (state, data, crumbs) => {
                if (data.string === 'World' && data._bool === true && data.number === 2)
                    return crumbs;
                return [];
            };
        });
        var data = { 'string': 'World', 'number': 2 };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s');
                stateNavigator.navigate('s', data);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s', data);
                stateNavigator.navigateLink(link, );
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s')
                    .navigate('s', data)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test() {
            it('should populate crumb trail', function() {
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            });
        }
    });

    describe('Back Defaults Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => [];
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s3');
                stateNavigator.navigateBack(3);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(3);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1')
                    .navigate('s2')
                    .navigate('s2')
                    .navigate('s3')
                    .navigateBack(3)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 1);
            });
        }
    });

    describe('Back Defaults Custom Trail Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                    { key: 's3', route: 'r3', trackCrumbTrail: true },
                ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => [];
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s3');
                stateNavigator.navigateBack(3);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(3);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1')
                    .navigate('s2')
                    .navigate('s2')
                    .navigate('s3')
                    .navigateBack(3)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 1);
            });
        }
    });

    describe('Back Data And Defaults Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => [];
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(2);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(2);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .navigate('s2')
                    .navigateBack(2)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['emptyString'], '');
                assert.strictEqual(stateNavigator.stateContext.data['number'], 4);
                assert.strictEqual(stateNavigator.stateContext.data['char'], 7);
                assert.strictEqual(stateNavigator.stateContext.data['s'], 1);
                assert.strictEqual(stateNavigator.stateContext.data['t'], '2');
            });
        }
    });

    describe('Back Data And Defaults Custom Trail Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r/{char}/{number?}', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => [];
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(2);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(2);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .navigate('s2')
                    .navigateBack(2)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['emptyString'], '');
                assert.strictEqual(stateNavigator.stateContext.data['number'], 4);
                assert.strictEqual(stateNavigator.stateContext.data['char'], 7);
                assert.strictEqual(stateNavigator.stateContext.data['s'], 1);
                assert.strictEqual(stateNavigator.stateContext.data['t'], '2');
            });
        }
    });

    describe('Back Override Defaults Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => [];
        });
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .navigate('s2')
                    .navigateBack(1)
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['emptyString'], 'World');
                assert.strictEqual(stateNavigator.stateContext.data['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.data['char'], 5);
            });
        }
    });

    describe('Back Override Defaults Custom Trail Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r/{char}/{number?}', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => [];
        });
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .navigate('s2')
                    .navigateBack(1)
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['emptyString'], 'World');
                assert.strictEqual(stateNavigator.stateContext.data['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.data['char'], 5);
            });
        }
    });

    describe('Crumb Defaults Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                    { key: 's2', route: 'r2', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 } },
                    { key: 's3', route: 'r3', trackCrumbTrail: true }
                ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => [];
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s3');
                stateNavigator.navigate('s3');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1')
                    .navigate('s2')
                    .navigate('s3')
                    .navigate('s3')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['emptyString'], '');
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['number'], 4);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['char'], 7);
            });
        }
    });

    describe('Crumb Defaults Custom Trail Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                    { key: 's2', route: 'r2/{char}/{number?}', trackCrumbTrail: true, defaults: { emptyString: '', 'number': 4, char: 7 } },
                    { key: 's3', route: 'r3', trackCrumbTrail: true }
                ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => [];
        });
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s3');
                stateNavigator.navigate('s3');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1')
                    .navigate('s2')
                    .navigate('s3')
                    .navigate('s3')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['emptyString'], '');
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['number'], 4);
                assert.strictEqual(stateNavigator.stateContext.crumbs[1].data['char'], 7);
            });
        }
    });

    describe('Back Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s'];
            state.truncateCrumbTrail = (state, data, crumbs) => crumbs.concat(crumbs);
        });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', data);
                stateNavigator.navigate('s');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s', data)
                    .navigate('s')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Back Custom Trail Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r/{s?}', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s'];
            state.truncateCrumbTrail = (state, data, crumbs) => crumbs.concat(crumbs);
        });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', data);
                stateNavigator.navigate('s');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s', data)
                    .navigate('s')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Crumb Data And Defaults Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => [];
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s2');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .navigate('s2')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['s'], 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['t'], '2');
            });
        }
    });

    describe('Crumb Data And Defaults Custom Trail Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => [];
        });
        var data = { s: 1, t: '2' };
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s2');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .navigate('s2')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['s'], 1);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['t'], '2');
            });
        }
    });

    describe('Override Crumb Defaults Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                    { key: 's2', route: 'r2', trackCrumbTrail: true }
                ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => [];
        });
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s2');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .navigate('s2')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['string'], 'World');
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['number'], 0);
            });
        }
    });

    describe('Override Crumb Defaults Custom Trail Route', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r/{string}/{number}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                    { key: 's2', route: 'r2', trackCrumbTrail: true }
                ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => [];
        });
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s2');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .navigate('s2')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['string'], 'World');
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['_bool'], true);
                assert.strictEqual(stateNavigator.stateContext.crumbs[0].data['number'], 0);
            });
        }
    });

    describe('Navigate Previous Data With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0'},
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
         });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = 1;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.navigate('s1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .url;
                stateNavigator.navigateLink(link);
                link = stateNavigator.fluent(true)
                    .navigate('s1')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old and previous data', function () {
                assert.strictEqual(stateNavigator.stateContext.oldData['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.oldData['t'], 1);
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.previousData['t'], 1);
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Navigate Previous Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
         });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = 1;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.navigate('s1');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .url;
                stateNavigator.navigateLink(link);
                link = stateNavigator.fluent(true)
                    .navigate('s1')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old but not previous data', function () {
                assert.strictEqual(stateNavigator.stateContext.oldData['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.oldData['t'], 1);
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.previousData['t'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Navigate Previous Data Back With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
         });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = 1;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .url;
                stateNavigator.navigateLink(link);
                link = stateNavigator.fluent(true)
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old and previous data', function () {
                assert.strictEqual(stateNavigator.stateContext.oldData['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.oldData['t'], 1);
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.previousData['t'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Navigate Previous Data Back Two With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
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
                stateNavigator.navigate('s0', data1);
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s3', data2);
                stateNavigator.navigateBack(2);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3', data2);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(2);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data1)
                    .navigate('s1')
                    .navigate('s2')
                    .navigate('s3', data2)
                    .url;
                stateNavigator.navigateLink(link);
                link = stateNavigator.fluent(true)
                    .navigateBack(2)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old and previous data', function () {
                assert.strictEqual(stateNavigator.stateContext.oldData['s'], 'World');
                assert.strictEqual(stateNavigator.stateContext.oldData['t1'], undefined);
                assert.strictEqual(stateNavigator.stateContext.oldData['t2'], 2);
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.previousData['t1'], 1);
                assert.strictEqual(stateNavigator.stateContext.previousData['t2'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t1'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t2'], undefined);
            });
        }
    });

    describe('Navigate Previous Data Back Two', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
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
                stateNavigator.navigate('s0', data1);
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s3', data2);
                stateNavigator.navigateBack(2);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3', data2);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(2);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data1)
                    .navigate('s1')
                    .navigate('s2')
                    .navigate('s3', data2)
                    .url;
                stateNavigator.navigateLink(link);
                link = stateNavigator.fluent(true)
                    .navigateBack(2)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old but not previous data', function () {
                assert.strictEqual(stateNavigator.stateContext.oldData['s'], 'World');
                assert.strictEqual(stateNavigator.stateContext.oldData['t1'], undefined);
                assert.strictEqual(stateNavigator.stateContext.oldData['t2'], 2);
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.previousData['t1'], undefined);
                assert.strictEqual(stateNavigator.stateContext.previousData['t2'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t1'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t2'], undefined);
            });
        }
    });

    describe('Navigate Previous Data One By One With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
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
                stateNavigator.navigate('s0', data1);
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2', data2);
                stateNavigator.navigate('s3');
                stateNavigator.navigateBack(1);
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2', data2);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data1)
                    .navigate('s1')
                    .navigate('s2', data2)
                    .navigate('s3')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
                link = stateNavigator.fluent(true)
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old and previous data', function () {
                assert.strictEqual(stateNavigator.stateContext.oldData['s'], 'World');
                assert.strictEqual(stateNavigator.stateContext.oldData['t1'], undefined);
                assert.strictEqual(stateNavigator.stateContext.oldData['t2'], 2);
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.previousData['t1'], 1);
                assert.strictEqual(stateNavigator.stateContext.previousData['t2'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t1'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t2'], undefined);
            });
        }
    });

    describe('Navigate Previous Data One By One', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
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
                stateNavigator.navigate('s0', data1);
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2', data2);
                stateNavigator.navigate('s3');
                stateNavigator.navigateBack(1);
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2', data2);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data1)
                    .navigate('s1')
                    .navigate('s2', data2)
                    .navigate('s3')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
                link = stateNavigator.fluent(true)
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old but not previous data', function () {
                assert.strictEqual(stateNavigator.stateContext.oldData['s'], 'World');
                assert.strictEqual(stateNavigator.stateContext.oldData['t1'], undefined);
                assert.strictEqual(stateNavigator.stateContext.oldData['t2'], 2);
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.previousData['t1'], undefined);
                assert.strictEqual(stateNavigator.stateContext.previousData['t2'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t2'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t1'], undefined);
            });
        }
    });

    describe('Navigate Previous Data One By One Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s2'];
            state.truncateCrumbTrail = (state, data, crumbs) => crumbs.slice(0, 1);
         });
        var data1 = {};
        data1['s'] = 'Hello';
        data1['t1'] = 1;
        var data2 = {};
        data2['s'] = 'World';
        data2['t2'] = 2;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data1);
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2', data2);
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2', data2);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data1)
                    .navigate('s1')
                    .navigate('s2', data2)
                    .navigate('s1')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
                link = stateNavigator.fluent(true)
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old and previous data', function () {
                assert.strictEqual(stateNavigator.stateContext.oldData['s'], 'World');
                assert.strictEqual(stateNavigator.stateContext.oldData['t1'], undefined);
                assert.strictEqual(stateNavigator.stateContext.oldData['t2'], 2);
                assert.strictEqual(stateNavigator.stateContext.data['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['t1'], 1);
                assert.strictEqual(stateNavigator.stateContext.data['t2'], undefined);
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.previousData['t1'], undefined);
                assert.strictEqual(stateNavigator.stateContext.previousData['t2'], undefined);
            });
        }
    });

    describe('Navigate Previous Data Refresh With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0'},
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => crumbs.slice(-1);
         });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = 1;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink();
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .url;
                stateNavigator.navigateLink(link);
                link = stateNavigator.fluent(true)
                    .refresh()
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old and previous data', function () {
                assert.strictEqual(stateNavigator.stateContext.oldData['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.oldData['t'], 1);
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.previousData['t'], 1);
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Navigate Previous Data Refresh', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => [];
         });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = 1;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.refresh();
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink();
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .url;
                stateNavigator.navigateLink(link);
                link = stateNavigator.fluent(true)
                    .refresh()
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old but not previous data', function () {
                assert.strictEqual(stateNavigator.stateContext.oldData['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.oldData['t'], 1);
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.previousData['t'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t'], undefined);
            });
        }
    });

    describe('Navigate Previous Data Defaults', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { x: 2 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
         });
        var data = {};
        data['s'] = 'Hello';
        data['t'] = 1;
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .url;
                stateNavigator.navigateLink(link);
                link = stateNavigator.fluent(true)
                    .navigate('s2')
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate old and previous data', function () {
                assert.strictEqual(stateNavigator.stateContext.oldData['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.oldData['t'], 1);
                assert.strictEqual(stateNavigator.stateContext.oldData['x'], 2);
                assert.strictEqual(stateNavigator.stateContext.previousData['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.previousData['t'], 1);
                assert.strictEqual(stateNavigator.stateContext.previousData['x'], 2);
                assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['t'], undefined);
                assert.strictEqual(stateNavigator.stateContext.data['x'], undefined);
            });
        }
    });

    describe('Navigate Previous Data Bookmarked Link', function() {
        it('should populate old but not previous data', function () {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var data = {};
            data['s'] = 'Hello';
            data['t'] = 1;
            stateNavigator.navigate('s0');
            var link = stateNavigator.getNavigationLink('s1'); 
            stateNavigator.navigate('s1', data);
            stateNavigator.navigateLink(link);
            assert.strictEqual(stateNavigator.stateContext.oldData['s'], 'Hello');
            assert.strictEqual(stateNavigator.stateContext.oldData['t'], 1);
            assert.strictEqual(stateNavigator.stateContext.previousData['s'], undefined);
            assert.strictEqual(stateNavigator.stateContext.previousData['t'], undefined);
            assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
            assert.strictEqual(stateNavigator.stateContext.data['t'], undefined);
        });
    });

    describe('Navigate Bookmarked Previous Data Link', function() {
        it('should populate previous but not old data', function () {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var data = {};
            data['s'] = 'Hello';
            data['t'] = 1;
            stateNavigator.navigate('s0', data);
            var link = stateNavigator.getNavigationLink('s1'); 
            stateNavigator.navigate('s1');
            stateNavigator.navigateLink(link);
            assert.strictEqual(stateNavigator.stateContext.oldData['s'], undefined);
            assert.strictEqual(stateNavigator.stateContext.oldData['t'], undefined);
            assert.strictEqual(stateNavigator.stateContext.previousData['s'], 'Hello');
            assert.strictEqual(stateNavigator.stateContext.previousData['t'], 1);
            assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
            assert.strictEqual(stateNavigator.stateContext.data['t'], undefined);
        });
    });

    describe('Navigate Previous Data Bookmarked Previous Data Link', function() {
        it('should populate old and previous data', function () {
            var stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
            var data1 = {};
            data1['s'] = 'Hello';
            data1['t1'] = 1;
            var data2 = {};
            data2['s'] = 'World';
            data2['t2'] = 2;
            stateNavigator.navigate('s0', data1);
            var link = stateNavigator.getNavigationLink('s1'); 
            stateNavigator.navigate('s1', data2);
            stateNavigator.navigateLink(link);
            assert.strictEqual(stateNavigator.stateContext.oldData['s'], 'World');
            assert.strictEqual(stateNavigator.stateContext.oldData['t1'], undefined);
            assert.strictEqual(stateNavigator.stateContext.oldData['t2'], 2);
            assert.strictEqual(stateNavigator.stateContext.previousData['s'], 'Hello');
            assert.strictEqual(stateNavigator.stateContext.previousData['t1'], 1);
            assert.strictEqual(stateNavigator.stateContext.previousData['t2'], undefined);
            assert.strictEqual(stateNavigator.stateContext.data['s'], undefined);
            assert.strictEqual(stateNavigator.stateContext.data['t1'], undefined);
            assert.strictEqual(stateNavigator.stateContext.data['t2'], undefined);
        });
    });

    describe('Link Defaults Navigate', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }
            ]);
        });
        var data = {};
        data['_bool'] = null;
        data['string'] = 'Hello';
        data['number'] = 1;
        var link;

        describe('Navigate Link', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                link = stateNavigator.getNavigationLink('s1', data);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .url;
            });
            test();
        });

        function test() {
            it('should not include defaults in link', function() {
                assert.equal(link.indexOf('string'), -1);
                assert.equal(link.indexOf('_bool'), -1);
                assert.equal(link.indexOf('number'), -1);
                assert.notEqual(link.indexOf('r?'), -1);
            });
        }
    });

    describe('Link Defaults Route Navigate', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r/{string?}/{number?}', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }
            ]);
        });
        var data = {};
        data['_bool'] = null;
        data['string'] = 'Hello';
        data['number'] = 1;
        var link;

        describe('Navigate Link', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                link = stateNavigator.getNavigationLink('s1', data);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .url;
            });
            test();
        });

        function test() {
            it('should not include defaults in link', function() {
                assert.equal(link.indexOf('string'), -1);
                assert.equal(link.indexOf('_bool'), -1);
                assert.equal(link.indexOf('number'), -1);
                assert.notEqual(link.indexOf('r?'), -1);
            });
        }
    });

    describe('Refresh Link Defaults Navigate', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r', defaults: { 'string': 'Hello', _bool: true, 'number': 1 } }
            ]);
        });
        var data = {};
        data['_bool'] = null;
        data['string'] = 'Hello';
        data['number'] = 0;
        var link;

        describe('Navigate Link', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                link = stateNavigator.getRefreshLink(stateNavigator.stateContext.includeCurrentData({}));
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .refresh((currentData) => currentData)
                    .url;
            });
            test();
        });

        function test() {
            it('should not include defaults in link', function() {
                assert.equal(link.indexOf('string'), -1);
                assert.equal(link.indexOf('_bool'), -1);
                assert.notEqual(link.indexOf('number'), -1);
            });
        }
    });

    describe('Back Link Defaults Navigate', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['_bool'] = null;
        data['string'] = 'Hello';
        data['number'] = 0;
        var link;

        describe('Navigate Link', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.refresh(stateNavigator.stateContext.includeCurrentData({}))
                stateNavigator.navigate('s2');
                link = stateNavigator.getNavigationBackLink(1);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .refresh((currentData) => currentData)
                    .navigate('s2')
                    .navigateBack(1)
                    .url;
            });
            test();
        });

        function test() {
            it('should not include defaults in link', function() {
                assert.equal(link.indexOf('string'), -1);
                assert.equal(link.indexOf('_bool'), -1);
                assert.notEqual(link.indexOf('number'), -1);
            });
        }
    });

    describe('Crumb Link Defaults Navigate', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r', trackCrumbTrail: true, defaults: { 'string': 'Hello', _bool: true, 'number': 1 } },
                { key: 's2', route: 'r2', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['number'] = 1;
        data['_bool'] = '';
        data['string'] = 4;
        var link;

        describe('Navigate Link', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.refresh(stateNavigator.stateContext.includeCurrentData({}))
                stateNavigator.navigate('s2');
                link = stateNavigator.stateContext.crumbs[1].url;
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .refresh((currentData) => currentData)
                    .navigate('s2')
                    .url;
                stateNavigator.navigateLink(link);
                link = stateNavigator.stateContext.crumbs[1].url;
            });
            test();
        });

        function test() {
            it('should not include defaults in link', function() {
                assert.equal(link.indexOf('_bool'), -1);
                assert.equal(link.indexOf('number'), -1);
                assert.notEqual(link.indexOf('string'), -1);
            });
        }
    });

    describe('Link Navigate With Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0');
        });
        var data = {};
        data['_number'] = 1;
        data['string'] = 'Hello';
        var link;

        describe('Navigate Link', function() {
            beforeEach(function() {
                stateNavigator.refresh(data);
                link = stateNavigator.getNavigationLink('s1');
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                link = stateNavigator.fluent(true)
                    .refresh(data)
                    .navigate('s1')
                    .url;
            });
            test();
        });

        function test() {
            it('should include data in link', function() {
                assert.notEqual(link.indexOf('_number'), -1);
                assert.notEqual(link.indexOf('string'), -1);
            });
        }
    });

    describe('Link Navigate', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            stateNavigator.navigate('s0');
        });
        var data = {};
        data['_number'] = 1;
        data['string'] = 'Hello';
        var link;

        describe('Navigate Link', function() {
            beforeEach(function() {
                stateNavigator.refresh(data);
                link = stateNavigator.getNavigationLink('s1');
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                link = stateNavigator.fluent(true)
                    .refresh(data)
                    .navigate('s1')
                    .url;
            });
            test();
        });

        function test() {
            it('should not include data in link', function() {
                assert.equal(link.indexOf('_number'), -1);
                assert.equal(link.indexOf('string'), -1);
            });
        }
    });

    describe('Link Default Types Navigate', function() {
        it('should populate data', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: { 'string': 'string', 'number': 'number', 'boolean': 'boolean' } }
            ]);
            var individualNavigationData = {};
            individualNavigationData['string'] = 'Hello';
            individualNavigationData['boolean'] = true;
            individualNavigationData['number'] = 0;
            stateNavigator.navigate('s', individualNavigationData);
            assert.strictEqual(stateNavigator.stateContext.data['string'], 'Hello');
            assert.strictEqual(stateNavigator.stateContext.data['boolean'], true);
            assert.strictEqual(stateNavigator.stateContext.data['number'], 0);
            assert.equal(Object.keys(stateNavigator.stateContext.data).length, 3);
        });
    });

    describe('Link Default Types Navigate', function() {
        it('should not include default types in link', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: { s1: 'string', s2: 'number' } }
            ]);
            var data = { s1: 'hello', s2: 'world' };
            var url = stateNavigator.getNavigationLink('s', data);
            assert.notEqual(url.indexOf('s1=hello&'), -1);
            assert.notEqual(url.indexOf('s2=world1_'), -1);
        });
    });

    describe('Link Default Types Bool Navigate', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: { b1: 'boolean' } }
            ]);
        });
        var data = { b1: true, b2: false };
        var link;

        describe('Navigate Link', function() {
            beforeEach(function() {
                link = stateNavigator.getNavigationLink('s', data);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                link = stateNavigator.fluent()
                    .navigate('s', data)
                    .url;
            });
            test();
        });

        function test() {
            it('should not include default types in link', function() {
                assert.notEqual(link.indexOf('b1=true&'), -1);
                assert.notEqual(link.indexOf('b2=false1_'), -1);
            });
        }
    });

    describe('Link Default Types Number Navigate', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: { n1: 'number' } }
            ]);
        });
        var data = { n1: 0, n2: 1 };
        var link;

        describe('Navigate Link', function() {
            beforeEach(function() {
                link = stateNavigator.getNavigationLink('s', data);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                link = stateNavigator.fluent()
                    .navigate('s', data)
                    .url;
            });
            test();
        });

        function test() {
            it('should not include default types in link', function() {
                assert.notEqual(link.indexOf('n1=0&'), -1);
                assert.notEqual(link.indexOf('n2=11_'), -1);
            });
        }
    });

    describe('Link Default Types Refresh Navigate', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: { s1: 'string', s2: 'number', n1: 'number' } }
            ]);
        });
        var data = {
            s1: 'hello',
            s2: 'world',
            n1: 0,
            n2: 1
        };
        var link;

        describe('Navigate Link', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', data);
                link = stateNavigator.getRefreshLink(stateNavigator.stateContext.includeCurrentData(null));
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                link = stateNavigator.fluent()
                    .navigate('s', data)
                    .refresh((currentData) => currentData)
                    .url;
            });
            test();
        });

        function test() {
            it('should not include default types in link', function() {
                assert.notEqual(link.indexOf('s1=hello&'), -1);
                assert.notEqual(link.indexOf('s2=world1_'), -1);
                assert.notEqual(link.indexOf('n1=0&'), -1);
                assert.notEqual(link.indexOf('n2=11_'), -1);
            });
        }
    });

    describe('Override Default Types', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', defaults: { s: 'b', b: true, n: 0 }, defaultTypes: { s: 'string', b: 'boolean', n: 'number' } }
            ]);
        });
        var data = {};
        data['s'] = true;
        data['b'] = 0;
        data['n'] = 'hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], true);
                assert.strictEqual(stateNavigator.stateContext.data['b'], 0);
                assert.strictEqual(stateNavigator.stateContext.data['n'], 'hello');
            });
        }
    });

    describe('Override Default Types Refresh', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', defaults: { s: 'b', b: true, n: 0 }, defaultTypes: { s: 'string', b: 'boolean', n: 'number' } }
            ]);
        });
        var data = {};
        data['s'] = true;
        data['b'] = 0;
        data['n'] = 'hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s1');
                stateNavigator.refresh(data);
                stateNavigator.refresh(stateNavigator.stateContext.includeCurrentData(null));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink(data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink(stateNavigator.stateContext.includeCurrentData(null));
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s1')
                    .refresh(data)
                    .refresh((currentData) => currentData)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], true);
                assert.strictEqual(stateNavigator.stateContext.data['b'], 0);
                assert.strictEqual(stateNavigator.stateContext.data['n'], 'hello');
            });
        }
    });

    describe('Override Default Types Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true, defaults: { s: 'b', b: true, n: 0 }, defaultTypes: { s: 'string', b: 'boolean', n: 'number' } },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['s'] = true;
        data['b'] = 0;
        data['n'] = 'hello';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s3');
                stateNavigator.navigateBack(2);
                stateNavigator.refresh(stateNavigator.stateContext.includeCurrentData({}));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink(stateNavigator.stateContext.includeCurrentData(null));
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s3');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(2);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink(stateNavigator.stateContext.includeCurrentData({}));
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .navigate('s3')
                    .navigateBack(2)
                    .refresh((currentData) => currentData)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], true);
                assert.strictEqual(stateNavigator.stateContext.data['b'], 0);
                assert.strictEqual(stateNavigator.stateContext.data['n'], 'hello');
            });
        }
    });

    describe('Reserved Url Character Default Types', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: { '*/()-_+~@:?><.;[]{}!£$%^#&': 'number' } }
            ]);
            var data = {};
            data['*/()-_+~@:?><.;[]{}!£$%^#&'] = 0;
            data['**=/()-_+~@:?><.;[]{}!£$%^#&&'] = 1;
            stateNavigator.navigate('s', data);
        });
        var link;

        describe('Navigate Link', function() {
            beforeEach(function() {
                link = stateNavigator.getRefreshLink(stateNavigator.stateContext.includeCurrentData({}));
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                link = stateNavigator.fluent(true)
                    .refresh((currentData) => currentData)
                    .url;
            });
            test();
        });

        function test() {
            it('should not include default types in link', function() {
                assert.notEqual(link.indexOf('=0&'), -1);
                assert.notEqual(link.indexOf('=11_'), -1);
                assert.strictEqual(stateNavigator.stateContext.data['*/()-_+~@:?><.;[]{}!£$%^#&'], 0);
                assert.strictEqual(stateNavigator.stateContext.data['**=/()-_+~@:?><.;[]{}!£$%^#&&'], 1);
            });
        }
    });

    describe('Separator Url Character Default Types', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: { _0_1_2_3_4_5_: 'number' } }
            ]);
            var data = {};
            data['_0_1_2_3_4_5_'] = 10;
            data['__0_1_2_3_4_5_'] = 20;
            stateNavigator.navigate('s', data);
        });
        var link;

        describe('Navigate Link', function() {
            beforeEach(function() {
                link = stateNavigator.getRefreshLink(stateNavigator.stateContext.includeCurrentData(null));
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                link = stateNavigator.fluent(true)
                    .refresh((currentData) => currentData)
                    .url;
            });
            test();
        });

        function test() {
            it('should not include default types in link', function() {
                assert.notEqual(link.indexOf('=10&'), -1);
                assert.notEqual(link.indexOf('=201_'), -1);
                assert.strictEqual(stateNavigator.stateContext.data['_0_1_2_3_4_5_'], 10);
                assert.strictEqual(stateNavigator.stateContext.data['__0_1_2_3_4_5_'], 20);
            });
        }
    });

    describe('Refresh Current Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
        });
        var data = {};
        data['s'] = 'Hello';
        data['n'] = 1;
        data['c'] = '1';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.refresh(stateNavigator.stateContext.includeCurrentData({}));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink(stateNavigator.stateContext.includeCurrentData({}));
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .refresh((currentData) => currentData)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['c'], '1');
                assert.strictEqual(stateNavigator.stateContext.data['n'], 1);
            });
        }
    });

    describe('Refresh New And Current Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
        });
        var data = {};
        data['s'] = 'Hello';
        data['n'] = 1;
        data['c'] = '1';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.refresh(stateNavigator.stateContext.includeCurrentData({b: true, 'n': 2}));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink(stateNavigator.stateContext.includeCurrentData({b: true, 'n': 2}));
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .refresh(({s, n, c}) => ({b: true, 'n': 2, s, c}))
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['b'], true);
                assert.strictEqual(stateNavigator.stateContext.data['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['c'], '1');
                assert.strictEqual(stateNavigator.stateContext.data['n'], 2);
            });
        }
    });

    describe('Refresh Current Data Keys', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
        });
        var data = {};
        data['s'] = 'Hello';
        data['n'] = 1;
        data['c'] = '1';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.refresh(stateNavigator.stateContext.includeCurrentData(null, ['s', 'c']));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink(stateNavigator.stateContext.includeCurrentData(null, ['s', 'c']));
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .refresh(({s, c}) => ({s, c}))
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['c'], '1');
                assert.strictEqual(stateNavigator.stateContext.data['n'], undefined);
            });
        }
    });

    describe('Refresh New And Current Data Keys', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
        });
        var data = {};
        data['s'] = 'Hello';
        data['n'] = 1;
        data['c'] = '1';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.refresh(stateNavigator.stateContext.includeCurrentData({b: true, c: '2'}, ['s', 'c']));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink(stateNavigator.stateContext.includeCurrentData({b: true, c: '2'}, ['s', 'c']));
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .refresh(({s, c}) => ({b: true, c: '2', s}))
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['b'], true);
                assert.strictEqual(stateNavigator.stateContext.data['s'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['c'], '2');
                assert.strictEqual(stateNavigator.stateContext.data['n'], undefined);
            });
        }
    });

    describe('Current Data Defaults', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', defaults: { emptyString: '', 'number': 4, char: 7 } }
            ]);
        });
        var data = {};
        data['emptyString'] = 'Hello';
        data['number'] = 1;
        data['char'] = '6';
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.navigate('s1', stateNavigator.stateContext.includeCurrentData({}, ['number', 'char']));
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', stateNavigator.stateContext.includeCurrentData({}, ['number', 'char']));
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .navigate('s1', ({number, char}) => ({number, char}))
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['emptyString'], '');
                assert.strictEqual(stateNavigator.stateContext.data['number'], 1);
                assert.strictEqual(stateNavigator.stateContext.data['char'], '6');
            });
        }
    });

    describe('Missing Route Data', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r/{s1}/{s2}' }
            ]);
        });
        
        describe('Navigate', function() {
            it('should throw error', function() {
                assert.throws(() => stateNavigator.navigate('s'), /Invalid route data/);
            });
        });

        describe('Navigate Link', function() {
            it('should be null', function() {
                assert.equal(stateNavigator.getNavigationLink('s'), null);
            });
        });

        describe('Fluent Navigate', function() {
            it('should throw error', function () {
                assert.throws(() => stateNavigator.fluent().navigate('s'), /Invalid route data/);
            });
        });
    });

    describe('Missing Route Data Refresh', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r/{s1}/{s2}' }
            ]);
        });
        
        describe('Navigate', function() {
            it('should throw error', function() {
                stateNavigator.navigate('s', { s1: 1, s2: 2 });
                assert.throws(() => stateNavigator.refresh(), /Invalid route data/);
            });
        });

        describe('Navigate Link', function() {
            it('should be null', function() {
                var link = stateNavigator.getNavigationLink('s', { s1: 1, s2: 2 });
                stateNavigator.navigateLink(link);
                assert.equal(stateNavigator.getRefreshLink(), null);
            });
        });

        describe('Fluent Navigate Link', function() {
            it('should throw error', function() {
                var fluent = stateNavigator.fluent()
                    .navigate('s', { s1: 1, s2: 2 });
                assert.throws(() => fluent.refresh(), /Invalid route data/);
            });
        });
    });

    describe('Invalid Number Navigate', function () {
        it('should throw error', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: { 'number': 'number' } }
            ]);
            var link = stateNavigator.getNavigationLink('s', { 'number': 35 });
            link = link.replace('number=35', 'number=invalid');
            assert.throws(() => stateNavigator.navigateLink(link), /Url .*is invalid/);
        });
    });

    describe('Invalid Boolean Navigate', function () {
        it('should throw error', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            var link = stateNavigator.getNavigationLink('s', { '_bool': false });
            link = link.replace('_bool=false', '_bool=invalid');
            assert.throws(() => stateNavigator.navigateLink(link), /Url .*is invalid/);
        });
    });

    describe('Without Types Back Navigate', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 's0', trackTypes: false },
                { key: 's1', route: 's1', trackCrumbTrail: true },
                { key: 's2', route: 's2', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0', { x: '0_1_2_' });
            stateNavigator.navigate('s1');
            stateNavigator.navigate('s2');
        });
        var link;

        describe('Navigate Link', function() {
            beforeEach(function() {
                link = stateNavigator.getNavigationBackLink(2);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                link = stateNavigator.fluent(true)
                    .navigateBack(2)
                    .url;
            });
            test();
        });

        function test() {
            it('should not track types', function() {
                stateNavigator.navigateBack(2);
                assert.strictEqual ('/s0?x=0_1_2_', link);
                assert.strictEqual(stateNavigator.stateContext.data.x, '0_1_2_');
            })
        }
    });

    describe('Without Types Default Back Navigate', function () {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 's0', trackTypes: false, defaults: { x: 2 }, defaultTypes: { y: 'boolean' } },
                { key: 's1', route: 's1', trackCrumbTrail: true },
                { key: 's2', route: 's2', trackCrumbTrail: true }
            ]);
            stateNavigator.navigate('s0', { x: '3', y: 'true' });
            stateNavigator.navigate('s1');
            stateNavigator.navigate('s2');
        });
        var link;

        describe('Navigate Link', function() {
            beforeEach(function() {
                link = stateNavigator.getNavigationBackLink(2);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                link = stateNavigator.fluent(true)
                    .navigateBack(2)
                    .url;
            });
            test();
        });

        function test() {
            it('should not track types', function() {
                stateNavigator.navigateLink(link);
                assert.strictEqual(stateNavigator.stateContext.data.x, 3);
                assert.strictEqual(stateNavigator.stateContext.data.y, true);
            });
        }
    });

    describe('Without Types Array Type', function () {
        it('should not track types', function() {
            var stateNavigator = new StateNavigator([
                { key: 's', route: '{x}', trackTypes: false, defaultTypes: { x: 'numberarray', y: 'stringarray' } }
            ]);
            stateNavigator.navigate('s', { x: [ 1, 2, '3' ], y: [ '_0_1', '-2-3', 4 ] });
            assert.strictEqual(stateNavigator.stateContext.data.x[0], 1);
            assert.strictEqual(stateNavigator.stateContext.data.x[1], 2);
            assert.strictEqual(stateNavigator.stateContext.data.x[2], 3);
            assert.strictEqual(stateNavigator.stateContext.data.y[0], '_0_1');
            assert.strictEqual(stateNavigator.stateContext.data.y[1], '-2-3');
            assert.strictEqual(stateNavigator.stateContext.data.y[2], '4');
        });
    });

    describe('Clear State Context', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.states.s.navigating = (data, url, navigate) => {
                navigate({x: 'a'});
            };
        });
        var data = {};
        data['s'] = 'Hello';

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s', data);
                stateNavigator.refresh(data);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink(data);
                stateNavigator.navigateLink(link);
            });            
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s', data)
                    .refresh(data)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test(){
            it('should clear State context', function() {
                stateNavigator.stateContext.clear();
                assert.strictEqual(Object.keys(stateNavigator.stateContext.oldData).length, 0);
                assert.strictEqual(Object.keys(stateNavigator.stateContext.previousData).length, 0);
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 0);
                assert.strictEqual(stateNavigator.stateContext.asyncData, undefined);
            });
        }
    });

    describe('Url Encode Data Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'a/{s}' },
                { key: 's1', route: 'b', trackCrumbTrail: true }
            ]);
            for(var key in stateNavigator.states) {
                var state = stateNavigator.states[key];
                state.urlEncode = (state, key, val) => {
                    return state.key === 's0' ? val.replace(' ', '+') : encodeURIComponent(val);
                }
                state.urlDecode = (state, key, val) => {
                    return state.key === 's0' ? val.replace('+', ' ') : decodeURIComponent(val);
                }
            }
        });
        var data = {};
        data['s'] = 'He llo';

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });            
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .navigate('s1')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test(){
            it('should populate data', function() {
                assert.strictEqual(stateNavigator.stateContext.data.s, 'He llo');
            });
        }
    });

    describe('Url Blank Encode Data Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'a', defaults: {s: false} },
                { key: 's1', route: 'b', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states.s0;
            state.urlEncode = (state, key, val) => {
                return val === 'true' ? '' : encodeURIComponent(val);
            }
            state.urlDecode = (state, key, val) => {
                return val === '' ? 'true' : decodeURIComponent(val);
            }
        });
        var data = {};
        data['s'] = true;
        data['t'] = false;

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });            
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .navigate('s1')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test(){
            it('should populate data', function() {
                assert.strictEqual(stateNavigator.stateContext.data.s, true);
                assert.strictEqual(stateNavigator.stateContext.data.t, false);
            });
        }
    });

    describe('Url Array Index Encode Data Back', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'a' },
                { key: 's1', route: 'b', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states.s0;
            state.urlEncode = (state, key, val, queryString, index) => {
                return !key ? `${val}[${index}]` : encodeURIComponent(val);
            }
            state.urlDecode = (state, key, val) => {
                return !key ? val.substring(0, 1) : decodeURIComponent(val);
            }
        });
        var data = {};
        data['s'] = [3];
        data['t'] = [3,5,2];

        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
            });
            test();
        });
        
        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });            
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .navigate('s1')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });
        
        function test(){
            it('should populate data', function() {
                assert.strictEqual(stateNavigator.stateContext.data.s[0], 3);
                assert.strictEqual(stateNavigator.stateContext.data.s.length, 1);
                assert.strictEqual(stateNavigator.stateContext.data.t[0], 3);
                assert.strictEqual(stateNavigator.stateContext.data.t[1], 5);
                assert.strictEqual(stateNavigator.stateContext.data.t[2], 2);
                assert.strictEqual(stateNavigator.stateContext.data.t.length, 3);
            });
        }
    });

    describe('Two Controllers Data', function() {
        var stateNavigator0: StateNavigator;
        var stateNavigator1: StateNavigator;
        beforeEach(function() {
            stateNavigator0 = new StateNavigator([
                { key: 's0', route: 'r' }
            ]);
            stateNavigator1 = new StateNavigator([
                { key: 's1', route: 'r' }
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
                stateNavigator0.navigate('s0', data0);
                stateNavigator1.navigate('s1', data1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator0.getNavigationLink('s0', data0);
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.getNavigationLink('s1', data1);
                stateNavigator1.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator0.fluent()
                    .navigate('s0', data0)
                    .url;
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.fluent()
                    .navigate('s1', data1)
                    .url;
                stateNavigator1.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator0.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator0.stateContext.data['boolean'], true);
                assert.strictEqual(stateNavigator1.stateContext.data['number'], 0);
                assert.strictEqual(+stateNavigator1.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateNavigator0.stateContext.data).length, 2);
                assert.strictEqual(Object.keys(stateNavigator1.stateContext.data).length, 2);
            });
        }
    });

    describe('Two Controllers Data Back', function() {
        var stateNavigator0: StateNavigator;
        var stateNavigator1: StateNavigator;
        beforeEach(function() {
            stateNavigator0 = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            stateNavigator1 = new StateNavigator([
                { key: 's2', route: 'r0' },
                { key: 's3', route: 'r1', trackCrumbTrail: true }
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
                stateNavigator0.navigate('s0', data0);
                stateNavigator1.navigate('s2', data1);
                stateNavigator0.navigate('s1');
                stateNavigator1.navigate('s3');
                stateNavigator0.navigateBack(1);
                stateNavigator1.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator0.getNavigationLink('s0', data0);
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.getNavigationLink('s2', data1);
                stateNavigator1.navigateLink(link);
                link = stateNavigator0.getNavigationLink('s1');
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.getNavigationLink('s3');
                stateNavigator1.navigateLink(link);
                link = stateNavigator0.getNavigationBackLink(1);
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.getNavigationBackLink(1);
                stateNavigator1.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var fluent0 = stateNavigator0.fluent()
                    .navigate('s0', data0);
                var fluent1 = stateNavigator1.fluent()
                    .navigate('s2', data1);
                fluent0 = fluent0.navigate('s1');
                fluent1 = fluent1.navigate('s3');
                var link = fluent0
                    .navigateBack(1)
                    .url;
                stateNavigator0.navigateLink(link);
                link = fluent1
                    .navigateBack(1)
                    .url;
                stateNavigator1.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator0.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator0.stateContext.data['boolean'], true);
                assert.strictEqual(stateNavigator1.stateContext.data['number'], 0);
                assert.strictEqual(+stateNavigator1.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateNavigator0.stateContext.data).length, 2);
                assert.strictEqual(Object.keys(stateNavigator1.stateContext.data).length, 2);
            });
        }
    });

    describe('Two Controllers Refresh Data', function() {
        var stateNavigator0: StateNavigator;
        var stateNavigator1: StateNavigator;
        beforeEach(function() {
            stateNavigator0 = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' }
            ]);
            stateNavigator1 = new StateNavigator([
                { key: 's2', route: 'r0' },
                { key: 's3', route: 'r1' }
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
                stateNavigator0.navigate('s0');
                stateNavigator0.navigate('s1');
                stateNavigator0.refresh(data0);
                stateNavigator1.navigate('s2');
                stateNavigator1.navigate('s3');
                stateNavigator1.refresh(data1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator0.getNavigationLink('s0');
                stateNavigator0.navigateLink(link);
                link = stateNavigator0.getNavigationLink('s1');
                stateNavigator0.navigateLink(link);
                link = stateNavigator0.getRefreshLink(data0);
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.getNavigationLink('s2');
                stateNavigator1.navigateLink(link);
                link = stateNavigator1.getNavigationLink('s3');
                stateNavigator1.navigateLink(link);
                link = stateNavigator1.getRefreshLink(data1);
                stateNavigator1.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator0.fluent()
                    .navigate('s0')
                    .navigate('s1')
                    .refresh(data0)
                    .url;
                stateNavigator0.navigateLink(link);
                link = stateNavigator1.fluent()
                    .navigate('s2')
                    .navigate('s3')
                    .refresh(data1)
                    .url;
                stateNavigator1.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator0.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator0.stateContext.data['boolean'], true);
                assert.strictEqual(stateNavigator1.stateContext.data['number'], 0);
                assert.strictEqual(+stateNavigator1.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateNavigator0.stateContext.data).length, 2);
                assert.strictEqual(Object.keys(stateNavigator1.stateContext.data).length, 2);
            });
        }
    });
    
    describe('Crumb Trail Route Param', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1/{crumb?}', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['string'] = 'Hello';
        data['boolean'] = true;
        data['number'] = 0;
        data['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0', data);
                stateNavigator.navigate('s1');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0', data)
                    .navigate('s1')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['boolean'], true);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 0);
                assert.strictEqual(+stateNavigator.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 4);
            });
        }
    });
    
    describe('Crumb Trail Route Splat Param', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2/{*crumb?}', trackCrumbTrail: true }
            ]);
        });
        var data = {};
        data['string'] = 'Hello';
        data['boolean'] = true;
        data['number'] = 0;
        data['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.navigate('s2');
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s2');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .navigate('s2')
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['boolean'], true);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 0);
                assert.strictEqual(+stateNavigator.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 4);
            });
        }
    });
    
    describe('Refresh Data Back Custom Trail', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true }
            ]);
            var state = stateNavigator.states['s1'];
            state.truncateCrumbTrail = (state, data, crumbs) => crumbs.slice(-1);
        });
        var data = {};
        data['string'] = 'Hello';
        data['boolean'] = true;
        data['number'] = 0;
        data['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            beforeEach(function() {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1', data);
                stateNavigator.refresh();
                stateNavigator.navigateBack(1);
            });
            test();
        });

        describe('Navigate Link', function() {
            beforeEach(function() {
                var link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationLink('s1', data);
                stateNavigator.navigateLink(link);
                link = stateNavigator.getRefreshLink();
                stateNavigator.navigateLink(link);
                link = stateNavigator.getNavigationBackLink(1);
                stateNavigator.navigateLink(link);
            });
            test();
        });

        describe('Fluent Navigate', function() {
            beforeEach(function() {
                var link = stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1', data)
                    .refresh()
                    .navigateBack(1)
                    .url;
                stateNavigator.navigateLink(link);
            });
            test();
        });

        function test() {
            it('should populate data', function () {
                assert.strictEqual(stateNavigator.stateContext.data['string'], 'Hello');
                assert.strictEqual(stateNavigator.stateContext.data['boolean'], true);
                assert.strictEqual(stateNavigator.stateContext.data['number'], 0);
                assert.strictEqual(+stateNavigator.stateContext.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateNavigator.stateContext.data).length, 4);
            });
        }
    });

    describe('Invalid Default Type', function() {
        it('should throw error', function () {
            var stateNavigator = new StateNavigator([
                { key: 's', route: 'r', defaultTypes: { x: 'xxx' } }
            ]);
            assert.throws(() => stateNavigator.navigate('s', { x: 'ab' }), /No TypeConverter found/);
        });
    });

    describe('Individual Data Constraint', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.states['s'].validate = (data) => (
                data['string'] !== 'Hello' || data['boolean'] !== true
                || data['number'] !== 0 || +data['date'] !== +new Date(2010, 3, 7)
                || Object.keys(data).length !== 4
            );
        });
        var individualNavigationData = {};
        individualNavigationData['string'] = 'Hello';
        individualNavigationData['boolean'] = true;
        individualNavigationData['number'] = 0;
        individualNavigationData['date'] = new Date(2010, 3, 7);
        
        describe('Navigate', function() {
            it('should throw error', function() {
                assert.throws(() => stateNavigator.navigate('s', individualNavigationData), /The Url .+ is invalid/);
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function() {
                var link = stateNavigator.getNavigationLink('s', individualNavigationData);
                assert.throws(() => stateNavigator.navigateLink(link), /The Url .+ is invalid/);
            });
        });

        describe('Fluent Navigate', function() {
            it('should throw error', function() {
                var link = stateNavigator.fluent().navigate('s', individualNavigationData).url;
                assert.throws(() => stateNavigator.navigateLink(link), /The Url .+ is invalid/);
            });
        });
    });

    describe('Array Data Constraint', function() {
        var stateNavigator: StateNavigator;
        beforeEach(function() {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            stateNavigator.states['s'].validate = (data) => (
                data['array_string'].length !== 2 || data['array_string'][0] !== 'He-llo' || data['array_string'][1] !== 'World'
                || data['array_boolean'].length !== 2 || data['array_boolean'][0] !== true || data['array_boolean'][1] !== false
                || data['array_number'].length !== 3 || data['array_number'][0] !== 1 || data['array_number'][1] !== 2.5 || data['array_number'][2] !== -3
                || data['array_date'].length !== 2 || +data['array_date'][0] !== +new Date(2010, 3, 7) || +data['array_date'][1] !== +new Date(2011, 7, 3)
                || Object.keys(data).length !== 4
            );
        });
        var arrayNavigationData = {};
        arrayNavigationData['array_string'] = ['He-llo', 'World'];
        arrayNavigationData['array_boolean'] = [true, false];
        arrayNavigationData['array_number'] = [1, 2.5, -3];
        arrayNavigationData['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
        
        describe('Navigate', function() {
            it('should throw error', function() {
                assert.throws(() => stateNavigator.navigate('s', arrayNavigationData), /The Url .+ is invalid/);
            });
        });

        describe('Navigate Link', function() {
            it('should throw error', function() {
                var link = stateNavigator.getNavigationLink('s', arrayNavigationData);
                assert.throws(() => stateNavigator.navigateLink(link), /The Url .+ is invalid/);
            });
        });

        describe('Fluent Navigate', function() {
            it('should throw error', function() {
                var link = stateNavigator.fluent().navigate('s', arrayNavigationData).url;
                assert.throws(() => stateNavigator.navigateLink(link), /The Url .+ is invalid/);
            });
        });
    });
});
