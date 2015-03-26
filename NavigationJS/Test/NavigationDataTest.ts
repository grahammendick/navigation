/// <reference path="assert.d.ts" />
/// <reference path="mocha.d.ts" />
import assert = require('assert');
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

describe('NavigationDataTest', function () {
    beforeEach(function () {
        initStateInfo();
        Navigation.StateContext.clear();
    });

    it('NavigateIndividualDataTest', function () {
        Navigation.StateController.navigate('d0', individualNavigationData);
        var i = 0;
        for (var key in Navigation.StateContext.data) {
            assert.strictEqual(Navigation.StateContext.data[key], individualNavigationData[key]);
            i++;
        }
        assert.strictEqual(Navigation.StateContext.data['boolean'], true);
        assert.equal(i, 3);
    });

    it('NavigateIndividualDataLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0', individualNavigationData);
        Navigation.StateController.navigateLink(link);
        var i = 0;
        for (var key in Navigation.StateContext.data) {
            assert.strictEqual(Navigation.StateContext.data[key], individualNavigationData[key]);
            i++;
        }
        assert.strictEqual(Navigation.StateContext.data['boolean'], true);
        assert.equal(i, 3);
    });

    it('NavigateIndividualDataWithoutTrailTest', function () {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0', individualNavigationData);
        var i = 0;
        for (var key in Navigation.StateContext.data) {
            assert.strictEqual(Navigation.StateContext.data[key], individualNavigationData[key]);
            i++;
        }
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['number'], 0);
        assert.equal(i, 3);
    });

    it('NavigateIndividualDataWithoutTrailLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d2');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0', individualNavigationData);
        Navigation.StateController.navigateLink(link);
        var i = 0;
        for (var key in Navigation.StateContext.data) {
            assert.strictEqual(Navigation.StateContext.data[key], individualNavigationData[key]);
            i++;
        }
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['number'], 0);
        assert.equal(i, 3);
    });

    it('NavigateArrayDataTest', function () {
        Navigation.StateController.navigate('d0', arrayNavigationData);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        var i = 0;
        for (var key in Navigation.StateContext.data) {
            assert.strictEqual(Navigation.StateContext.data[key][0], arrayNavigationData[key][0]);
            assert.strictEqual(Navigation.StateContext.data[key][1], arrayNavigationData[key][1]);
            i++;
        }
        assert.strictEqual(Navigation.StateContext.data['array_boolean'][0], true);
        assert.strictEqual(Navigation.StateContext.data['array_number'][1], 2);
        assert.equal(i, 3);
    });

    it('NavigateArrayDataLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0', arrayNavigationData);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        var i = 0;
        for (var key in Navigation.StateContext.data) {
            assert.strictEqual(Navigation.StateContext.data[key][0], arrayNavigationData[key][0]);
            assert.strictEqual(Navigation.StateContext.data[key][1], arrayNavigationData[key][1]);
            i++;
        }
        assert.strictEqual(Navigation.StateContext.data['array_boolean'][0], true);
        assert.strictEqual(Navigation.StateContext.data['array_number'][1], 2);
        assert.equal(i, 3);
    });

    it('NavigateArrayDataRouteTest', function () {
        Navigation.StateController.navigate('d3', arrayNavigationData);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        var i = 0;
        for (var key in Navigation.StateContext.data) {
            assert.strictEqual(Navigation.StateContext.data[key][0], arrayNavigationData[key][0]);
            assert.strictEqual(Navigation.StateContext.data[key][1], arrayNavigationData[key][1]);
            i++;
        }
        assert.strictEqual(Navigation.StateContext.data['array_boolean'][0], true);
        assert.strictEqual(Navigation.StateContext.data['array_number'][1], 2);
        assert.equal(i, 3);
    });

    it('NavigateArrayDataRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3', arrayNavigationData);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        var i = 0;
        for (var key in Navigation.StateContext.data) {
            assert.strictEqual(Navigation.StateContext.data[key][0], arrayNavigationData[key][0]);
            assert.strictEqual(Navigation.StateContext.data[key][1], arrayNavigationData[key][1]);
            i++;
        }
        assert.strictEqual(Navigation.StateContext.data['array_boolean'][0], true);
        assert.strictEqual(Navigation.StateContext.data['array_number'][1], 2);
        assert.equal(i, 3);
    });

    it('InvalidIndividualDataTest', function () {
        var data = {};
        data['item'] = new Date();
        assert.throws(() => Navigation.StateController.navigate('d0', data));
    });

    it('InvalidArrayDataTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateContext.data['item'] = [new Date()];
        assert.throws(() => Navigation.StateController.navigate('t0'));
    });

    it('InvalidDataGetNavigationLinkTest', function () {
        var data = {};
        data['item'] = new Date();
        assert.throws(() => Navigation.StateController.getNavigationLink('d0', data));
    });

    it('InvalidDataRefreshTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateContext.data['item'] = new Date();
        assert.throws(() => Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData(null)));
    });

    it('InvalidRefreshDataTest', function () {
        Navigation.StateController.navigate('d0');
        assert.throws(() => Navigation.StateController.refresh({ item: new Date() }));
    });

    it('InvalidDataGetRefreshLinkTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateContext.data['item'] = new Date();
        assert.throws(() => Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData(null)));
    });

    it('InvalidGetRefreshLinkDataTest', function () {
        Navigation.StateController.navigate('d0');
        assert.throws(() => Navigation.StateController.getRefreshLink({ item: new Date() }));
    });

    it('InvalidTypesArrayDataTest', function () {
        var data = {};
        data['item0'] = ['0', 1];
        data['item1'] = [0, '1'];
        Navigation.StateController.navigate('d0', data);
        assert.strictEqual(Navigation.StateContext.data['item0'][0], '0');
        assert.strictEqual(Navigation.StateContext.data['item0'][1], '1');
        assert.strictEqual(Navigation.StateContext.data['item1'][0], 0);
        assert.strictEqual(Navigation.StateContext.data['item1'][1], 1);
    });

    it('InvalidTypesArrayDataLinkTest', function () {
        var data = {};
        data['item0'] = ['0', 1];
        data['item1'] = [0, '1'];
        var link = Navigation.StateController.getNavigationLink('d0', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['item0'][0], '0');
        assert.strictEqual(Navigation.StateContext.data['item0'][1], '1');
        assert.strictEqual(Navigation.StateContext.data['item1'][0], 0);
        assert.strictEqual(Navigation.StateContext.data['item1'][1], 1);
    });

    it('NavigateInvalidContextDataWithoutTrailTest', function () {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateContext.data['item'] = new Date();
        Navigation.StateController.navigate('t0', data);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
    });

    it('NavigateInvalidContextDataWithoutTrailLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d2');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateContext.data['item'] = new Date();
        Navigation.StateController.navigate('t0', data);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
    });

    it('RefreshInvalidContextDataTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateContext.data['item'] = new Date();
        Navigation.StateController.refresh(data);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
    });

    it('RefreshInvalidContextDataLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateContext.data['item'] = new Date();
        link = Navigation.StateController.getRefreshLink(data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
    });

    it('NavigateInvalidDataWithoutTrailTest', function () {
        var data = {};
        data['item'] = new Date();
        assert.throws(() => Navigation.StateController.navigate('d2', data));
    });

    it('NavigateInvalidDataWithoutTrailLinkTest', function () {
        var data = {};
        data['item'] = new Date();
        assert.throws(() => Navigation.StateController.getNavigationLink('d2', data));
    });

    it('ReservedUrlCharacterDataTest', function () {
        var data = {};
        data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
    });

    it('ReservedUrlCharacterDataLinkTest', function () {
        var data = {};
        data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        var link = Navigation.StateController.getNavigationLink('d0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
    });

    it('ReservedUrlCharacterRouteDataTest', function () {
        var data = {};
        data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        data['string'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        data['_bool'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        data['number'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0', data);
        assert.strictEqual(Navigation.StateContext.data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
        assert.strictEqual(Navigation.StateContext.data['string'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
        assert.strictEqual(Navigation.StateContext.data['_bool'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
        assert.strictEqual(Navigation.StateContext.data['number'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
    });

    it('ReservedUrlCharacterRouteDataLinkTest', function () {
        var data = {};
        data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        data['string'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        data['_bool'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        data['number'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
        assert.strictEqual(Navigation.StateContext.data['string'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
        assert.strictEqual(Navigation.StateContext.data['_bool'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
        assert.strictEqual(Navigation.StateContext.data['number'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
    });

    it('SeparatorUrlCharacterDataTest', function () {
        var data = {};
        data['_0_1_2_3_4_5_'] = '__00__11__22__33__44__55__';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['_0_1_2_3_4_5_'], '__00__11__22__33__44__55__');
    });

    it('SeparatorUrlCharacterDataLinkTest', function () {
        var data = {};
        data['_0_1_2_3_4_5_'] = '__00__11__22__33__44__55__';
        var link = Navigation.StateController.getNavigationLink('d0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['_0_1_2_3_4_5_'], '__00__11__22__33__44__55__');
    });

    it('EmptyStringDataNavigateTest', function () {
        var data = {};
        data['s'] = '';
        data['t'] = '1';
        Navigation.StateController.navigate('d0', data);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['t'], '1');
    });

    it('EmptyStringDataNavigateLinkTest', function () {
        var data = {};
        data['s'] = '';
        data['t'] = '1';
        var link = Navigation.StateController.getNavigationLink('d0', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['t'], '1');
    });

    it('EmptyStringDataTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['s'] = '';
        Navigation.StateContext.data['t'] = '1';
        assert.strictEqual(Navigation.StateContext.data['s'], '');
        assert.strictEqual(Navigation.StateContext.data['t'], '1');
    });

    it('EmptyStringDataLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateContext.data['s'] = '';
        Navigation.StateContext.data['t'] = '1';
        assert.strictEqual(Navigation.StateContext.data['s'], '');
        assert.strictEqual(Navigation.StateContext.data['t'], '1');
    });

    it('EmptyStringStateDataNavigateBackTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateContext.data['s'] = '';
        Navigation.StateContext.data['t'] = '1';
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['t'], '1');
    });

    it('EmptyStringStateDataNavigateBackLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateContext.data['s'] = '';
        Navigation.StateContext.data['t'] = '1';
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['t'], '1');
    });

    it('NavigateDataNavigateBackTest', function () {
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    it('NavigateDataNavigateBackLinkTest', function () {
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        var link = Navigation.StateController.getNavigationLink('d0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    it('ChangeDataNavigateBackTest', function () {
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateContext.data['s'] = 'World';
        Navigation.StateContext.data['i'] = 2;
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 'World');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['i'], 2);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], 'World');
        assert.strictEqual(Navigation.StateContext.data['i'], 2);
    });

    it('ChangeDataNavigateBackLinkTest', function () {
        var data = {};
        data['s'] = 'Hello';
        var link = Navigation.StateController.getNavigationLink('d0', data);
        Navigation.StateController.navigateLink(link);
        Navigation.StateContext.data['s'] = 'World';
        Navigation.StateContext.data['i'] = 2;
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 'World');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['i'], 2);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], 'World');
        assert.strictEqual(Navigation.StateContext.data['i'], 2);
    });

    it('BlankDataNavigateBackTest', function () {
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateContext.data['s'] = null;
        Navigation.StateContext.data['i'] = 2;
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['i'], 2);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['i'], 2);
    });

    it('BlankDataNavigateBackLinkTest', function () {
        var data = {};
        data['s'] = 'Hello';
        var link = Navigation.StateController.getNavigationLink('d0', data);
        Navigation.StateController.navigateLink(link);
        Navigation.StateContext.data['s'] = null;
        Navigation.StateContext.data['i'] = 2;
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['i'], 2);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['i'], 2);
    });

    it('ClearDataNavigateBackTest', function () {
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateContext.clear();
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['i'], undefined);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['i'], undefined);
    });

    it('ClearDataNavigateBackLinkTest', function () {
        var data = {};
        data['s'] = 'Hello';
        var link = Navigation.StateController.getNavigationLink('d0', data);
        Navigation.StateController.navigateLink(link);
        Navigation.StateContext.clear();
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['i'], undefined);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['i'], undefined);
    });

    it('RemoveDataNavigateBackTest', function () {
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateContext.clear('s');
        Navigation.StateContext.data['i'] = 2;
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['i'], 2);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['i'], 2);
    });

    it('RemoveDataNavigateBackLinkTest', function () {
        var data = {};
        data['s'] = 'Hello';
        var link = Navigation.StateController.getNavigationLink('d0', data);
        Navigation.StateController.navigateLink(link);
        Navigation.StateContext.clear('s');
        Navigation.StateContext.data['i'] = 2;
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['i'], 2);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['i'], 2);
    });

    it('NavigateDataRefreshTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData(null));
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
    });

    it('NavigateDataRefreshLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['s'] = 'Hello';
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData(null));
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
    });

    it('NavigateRefreshDataTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0');
        Navigation.StateController.refresh(data);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
    });

    it('NavigateRefreshDataLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['s'] = 'Hello';
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getRefreshLink(data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
    });

    it('NavigateDataRefreshDataOverrideTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        data = {};
        data['s'] = 'World';
        Navigation.StateController.refresh(data);
        assert.strictEqual(Navigation.StateContext.data['s'], 'World');
    });

    it('NavigateDataRefreshDataOverrideLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['s'] = 'Hello';
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        data = {};
        data['s'] = 'World';
        var link = Navigation.StateController.getRefreshLink(data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], 'World');
    });

    it('NavigateDataRefreshDataBlankTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.refresh();
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
    });

    it('NavigateDataRefreshDataBlankLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['s'] = 'Hello';
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getRefreshLink();
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
    });

    it('NavigateDataRefreshDataClearTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateContext.clear();
        Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData(null));
        assert.equal(Navigation.StateContext.data['s'], undefined);
    });

    it('NavigateDataRefreshDataClearLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['s'] = 'Hello';
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        Navigation.StateContext.clear();
        link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData(null));
        Navigation.StateController.navigateLink(link);
        assert.equal(Navigation.StateContext.data['s'], undefined);
    });

    it('ChangeDataRefreshTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateContext.data['s'] = 'World';
        Navigation.StateContext.data['n'] = 1;
        Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData(null));
        assert.equal(Navigation.StateContext.data['s'], 'World');
        assert.equal(Navigation.StateContext.data['n'], 1);
    });

    it('ChangeDataRefreshLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['s'] = 'Hello';
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        Navigation.StateContext.data['s'] = 'World';
        Navigation.StateContext.data['n'] = 1;
        link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData(null));
        Navigation.StateController.navigateLink(link);
        assert.equal(Navigation.StateContext.data['s'], 'World');
        assert.equal(Navigation.StateContext.data['n'], 1);
    });

    it('ChangeRefreshDataTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        data['i'] = 3;
        Navigation.StateController.navigate('t0', data);
        data = {};
        data['s'] = 'World';
        data['n'] = 4;
        Navigation.StateController.refresh(data);
        assert.strictEqual(Navigation.StateContext.data['s'], 'World');
        assert.strictEqual(Navigation.StateContext.data['n'], 4);
        assert.strictEqual(Navigation.StateContext.data['i'], undefined);
    });

    it('ChangeRefreshDataLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['s'] = 'Hello';
        data['i'] = 3;
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        data = {};
        data['s'] = 'World';
        data['n'] = 4;
        link = Navigation.StateController.getRefreshLink(data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], 'World');
        assert.strictEqual(Navigation.StateContext.data['n'], 4);
        assert.strictEqual(Navigation.StateContext.data['i'], undefined);
    });

    it('ChangeDynamicDataRefreshRouteOverrideTest', function () {
        Navigation.StateController.navigate('d0');
        var data: any = {};
        data.s = 'Hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateContext.data.s = 'World';
        Navigation.StateContext.data.d = '2000-1-3';
        Navigation.StateContext.data.i = 3;
        data = Navigation.StateContext.includeCurrentData({
            s: 'Hello World',
            i: null,
            n: 2
        });
        Navigation.StateController.refresh(data);
        assert.strictEqual(Navigation.StateContext.data.s, 'Hello World');
        assert.strictEqual(Navigation.StateContext.data.d, '2000-1-3');
        assert.strictEqual(Navigation.StateContext.data.i, undefined);
        assert.strictEqual(Navigation.StateContext.data.n, 2);
        assert.strictEqual(Navigation.StateContext.data['n'], 2);
    });

    it('ChangeDynamicDataRefreshRouteOverrideLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data: any = {};
        data.s = 'Hello';
        link = Navigation.StateController.getNavigationLink('t0', data);
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
        assert.strictEqual(Navigation.StateContext.data.s, 'Hello World');
        assert.strictEqual(Navigation.StateContext.data.d, '2000-1-3');
        assert.strictEqual(Navigation.StateContext.data.i, undefined);
        assert.strictEqual(Navigation.StateContext.data.n, 2);
        assert.strictEqual(Navigation.StateContext.data['n'], 2);
    });

    it('NavigateWizardDataTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {
            s: 'Hello',
            n: 5
        };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t1', Navigation.StateContext.includeCurrentData(null));
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['n'], 5);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['n'], 5);
    });

    it('NavigateWizardDataLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = {
            s: 'Hello',
            n: 5
        };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t1', Navigation.StateContext.includeCurrentData(null));
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['n'], 5);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['n'], 5);
    });

    it('NavigateDataNavigateTransitionTransitionTest', function () {
        var data = {};
        data['s'] = 1;
        Navigation.StateController.navigate('d0', data);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
        data['s'] = 2;
        data['t'] = '2';
        Navigation.StateController.navigate('t1', data);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
        assert.strictEqual(Navigation.StateContext.data['s'], 2);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
        data['s'] = 3;
        data['t'] = '3';
        Navigation.StateController.navigate('t1', data);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 2);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
        assert.strictEqual(Navigation.StateContext.data['s'], 3);
        assert.strictEqual(Navigation.StateContext.data['t'], '3');
    });

    it('NavigateDataNavigateTransitionTransitionLinkTest', function () {
        var data = {};
        data['s'] = 1;
        var link = Navigation.StateController.getNavigationLink('d0', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
        data['s'] = 2;
        data['t'] = '2';
        link = Navigation.StateController.getNavigationLink('t1', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
        assert.strictEqual(Navigation.StateContext.data['s'], 2);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
        data['s'] = 3;
        data['t'] = '3';
        link = Navigation.StateController.getNavigationLink('t1', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 2);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
        assert.strictEqual(Navigation.StateContext.data['s'], 3);
        assert.strictEqual(Navigation.StateContext.data['t'], '3');
    });

    it('NavigateDynamicDataNavigateTransitionTransitionTest', function () {
        var data: any = {};
        data.s = 1;
        Navigation.StateController.navigate('d0', data);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        data.s = '2';
        Navigation.StateController.navigate('t1', data);
        assert.strictEqual(Navigation.StateController.crumbs[0].data.s, 1);
        assert.strictEqual(Navigation.StateContext.data.s, '2');
        data.s = '3';
        Navigation.StateController.navigate('t1', data);
        assert.strictEqual(Navigation.StateController.crumbs[0].data.s, 1);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data.s, '2');
        assert.strictEqual(Navigation.StateContext.data.s, '3');
    });

    it('NavigateDynamicDataNavigateTransitionTransitionLinkTest', function () {
        var data: any = {};
        data.s = 1;
        var link = Navigation.StateController.getNavigationLink('d0', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        data.s = '2';
        link = Navigation.StateController.getNavigationLink('t1', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data.s, 1);
        assert.strictEqual(Navigation.StateContext.data.s, '2');
        data.s = '3';
        link = Navigation.StateController.getNavigationLink('t1', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data.s, 1);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data.s, '2');
        assert.strictEqual(Navigation.StateContext.data.s, '3');
    });

    it('ChangeDataNavigateTransitionTransitionTest', function () {
        var data = {};
        data['s'] = 1;
        Navigation.StateController.navigate('d0', data);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        Navigation.StateContext.data['s'] = 11;
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
        data['s'] = 2;
        data['t'] = '2';
        Navigation.StateController.navigate('t1', data);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 11);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
        assert.strictEqual(Navigation.StateContext.data['s'], 2);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
        Navigation.StateContext.data['s'] = '22';
        data['s'] = 3;
        data['t'] = '3';
        Navigation.StateController.navigate('t1', data);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 11);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], '22');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
        assert.strictEqual(Navigation.StateContext.data['s'], 3);
        assert.strictEqual(Navigation.StateContext.data['t'], '3');
    });

    it('ChangeDataNavigateTransitionTransitionLinkTest', function () {
        var data = {};
        data['s'] = 1;
        var link = Navigation.StateController.getNavigationLink('d0', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        Navigation.StateContext.data['s'] = 11;
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
        data['s'] = 2;
        data['t'] = '2';
        link = Navigation.StateController.getNavigationLink('t1', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 11);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
        assert.strictEqual(Navigation.StateContext.data['s'], 2);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
        Navigation.StateContext.data['s'] = '22';
        data['s'] = 3;
        data['t'] = '3';
        link = Navigation.StateController.getNavigationLink('t1', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 11);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['t'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], '22');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
        assert.strictEqual(Navigation.StateContext.data['s'], 3);
        assert.strictEqual(Navigation.StateContext.data['t'], '3');
    });

    it('ChangeCrumbDataNavigateBackTest', function () {
        var data = {};
        data['s'] = 'Hello';
        Navigation.StateController.navigate('d0', data);
        Navigation.StateController.navigate('t0');
        var crumb = Navigation.StateController.crumbs[0];
        crumb.data['s'] = 'Changed';
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 'Changed');
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
    });

    it('ChangeCrumbDataNavigateBackLinkTest', function () {
        var data = {};
        data['s'] = 'Hello';
        var link = Navigation.StateController.getNavigationLink('d0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var crumb = Navigation.StateController.crumbs[0];
        crumb.data['s'] = 'Changed';
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], 'Changed');
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
    });

    it('NavigateDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    it('NavigateDefaultsLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    it('NavigateDefaultsRouteTest', function () {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    it('NavigateDefaultsRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    it('NavigationDataDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['string'] = null;
        Navigation.StateContext.data['number'] = 'Hello';
        assert.strictEqual(Navigation.StateContext.data['string'], null);
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 'Hello');
    });

    it('NavigationDataDefaultsLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateContext.data['string'] = null;
        Navigation.StateContext.data['number'] = 'Hello';
        assert.strictEqual(Navigation.StateContext.data['string'], null);
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 'Hello');
    });

    it('NavigationDataDefaultsRouteTest', function () {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['string'] = null;
        Navigation.StateContext.data['number'] = 'Hello';
        assert.strictEqual(Navigation.StateContext.data['string'], null);
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 'Hello');
    });

    it('NavigationDataDefaultsRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateContext.data['string'] = null;
        Navigation.StateContext.data['number'] = 'Hello';
        assert.strictEqual(Navigation.StateContext.data['string'], null);
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 'Hello');
    });

    it('RemoveDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.clear('emptyString');
        Navigation.StateContext.clear('number');
        Navigation.StateContext.clear('char');
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
    });

    it('RemoveDefaultsLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateContext.clear('emptyString');
        Navigation.StateContext.clear('number');
        Navigation.StateContext.clear('char');
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
    });

    it('RemoveDefaultsRouteTest', function () {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.clear('emptyString');
        Navigation.StateContext.clear('number');
        Navigation.StateContext.clear('char');
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
    });

    it('RemoveDefaultsRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateContext.clear('emptyString');
        Navigation.StateContext.clear('number');
        Navigation.StateContext.clear('char');
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
    });

    it('NavigateDataAndDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var data = { s: 1, t: '', 'number': '' };
        Navigation.StateController.navigate('t0', data);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    it('NavigateDataAndDefaultsLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var data = { s: 1, t: '', 'number': '' };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    it('NavigateDataAndDefaultsRouteTest', function () {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        var data = { s: 1, t: '', 'number': '' };
        Navigation.StateController.navigate('t0', data);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    it('NavigateDataAndDefaultsRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var data = { s: 1, t: '', 'number': '' };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    it('NavigateOverrideDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var data = { emptyString: 2, 'number': 1, char: 5 };
        Navigation.StateController.navigate('t0', data);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 2);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    it('NavigateOverrideDefaultsLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var data = { emptyString: 2, 'number': 1, char: 5 };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 2);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    it('NavigateOverrideDefaultsRouteTest', function () {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        var data = { emptyString: 2, 'number': 1, char: 5 };
        Navigation.StateController.navigate('t0', data);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 2);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    it('NavigateOverrideDefaultsRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var data = { emptyString: 2, 'number': 1, char: 5 };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 2);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    it('OverrideDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['emptyString'] = 'Hello';
        Navigation.StateContext.data['number'] = 4;
        Navigation.StateContext.data['char'] = 5;
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    it('OverrideDefaultsLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateContext.data['emptyString'] = 'Hello';
        Navigation.StateContext.data['number'] = 4;
        Navigation.StateContext.data['char'] = 5;
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    it('OverrideDefaultsRouteTest', function () {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['emptyString'] = 'Hello';
        Navigation.StateContext.data['number'] = 4;
        Navigation.StateContext.data['char'] = 5;
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    it('OverrideDefaultsRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        Navigation.StateContext.data['emptyString'] = 'Hello';
        Navigation.StateContext.data['number'] = 4;
        Navigation.StateContext.data['char'] = 5;
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    it('ClearDataAndDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateContext.clear();
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    it('ClearDataAndDefaultsLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var data = { s: 1, t: '2' };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        Navigation.StateContext.clear();
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    it('ClearDataAndDefaultsRouteTest', function () {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateContext.clear();
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    it('ClearDataAndDefaultsRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var data = { s: 1, t: '2' };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        Navigation.StateContext.clear();
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], undefined);
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    it('NavigateBackDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    it('NavigateBackDefaultsLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    it('NavigateBackDefaultsRouteTest', function () {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    it('NavigateBackDefaultsRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    it('NavigateBackDataAndDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(2);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
    });

    it('NavigateBackDataAndDefaultsLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var data = { s: 1, t: '2' };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(2);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
    });

    it('NavigateBackDataAndDefaultsRouteTest', function () {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(2);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
    });

    it('NavigateBackDataAndDefaultsRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var data = { s: 1, t: '2' };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(2);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
    });

    it('NavigateBackOverrideDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'World');
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    it('NavigateBackOverrideDefaultsLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'World');
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    it('NavigateBackOverrideDefaultsRouteTest', function () {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'World');
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    it('NavigateBackOverrideDefaultsRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'World');
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    it('CrumbDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['_bool'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['emptyString'], '');
        assert.strictEqual(Navigation.StateController.crumbs[2].data['number'], 4);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['char'], 7);
    });

    it('CrumbDefaultsLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['_bool'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['emptyString'], '');
        assert.strictEqual(Navigation.StateController.crumbs[2].data['number'], 4);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['char'], 7);
    });

    it('CrumbDefaultsRouteTest', function () {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['_bool'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['emptyString'], '');
        assert.strictEqual(Navigation.StateController.crumbs[2].data['number'], 4);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['char'], 7);
    });

    it('CrumbDefaultsRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['_bool'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['emptyString'], '');
        assert.strictEqual(Navigation.StateController.crumbs[2].data['number'], 4);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['char'], 7);
    });

    it('CrumbDataAndDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
    });

    it('CrumbDataAndDefaultsLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = { s: 1, t: '2' };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
    });

    it('CrumbDataAndDefaultsRouteTest', function () {
        Navigation.StateController.navigate('d3');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
    });

    it('CrumbDataAndDefaultsRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        var data = { s: 1, t: '2' };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
    });

    it('NavigateOverrideCrumbDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'World');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    it('NavigateOverrideCrumbDefaultsLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'World');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    it('NavigateOverrideCrumbDefaultsRouteTest', function () {
        Navigation.StateController.navigate('d3');
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'World');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    it('NavigateOverrideCrumbDefaultsRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'World');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    it('OverrideCrumbDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {};
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        var crumb = Navigation.StateController.crumbs[1];
        crumb.data['string'] = 'Hello';
        crumb.data['number'] = 0;
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    it('OverrideCrumbDefaultsLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = {};
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var crumb = Navigation.StateController.crumbs[1];
        crumb.data['string'] = 'Hello';
        crumb.data['number'] = 0;
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    it('OverrideCrumbDefaultsRouteTest', function () {
        Navigation.StateController.navigate('d3');
        var data = {};
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        var crumb = Navigation.StateController.crumbs[1];
        crumb.data['string'] = 'Hello';
        crumb.data['number'] = 0;
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    it('OverrideCrumbDefaultsRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        var data = {};
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var crumb = Navigation.StateController.crumbs[1];
        crumb.data['string'] = 'Hello';
        crumb.data['number'] = 0;
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    it('NavigateBackDefaultsCustomTrailTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(3);
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    it('NavigateBackDefaultsCustomTrailLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('d6');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(3);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    it('NavigateBackDefaultsCustomTrailRouteTest', function () {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(3);
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    it('NavigateBackDefaultsCustomTrailRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('d6');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(3);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['string'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['_bool'], true);
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
    });

    it('NavigateBackDataAndDefaultsCustomTrailTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.refresh();
        Navigation.StateController.navigateBack(3);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
    });

    it('NavigateBackDataAndDefaultsCustomTrailLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var data = { s: 1, t: '2' };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('d6');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getRefreshLink();
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(3);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
    });

    it('NavigateBackDataAndDefaultsCustomTrailRouteTest', function () {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.refresh();
        Navigation.StateController.navigateBack(3);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
    });

    it('NavigateBackDataAndDefaultsCustomTrailRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var data = { s: 1, t: '2' };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('d6');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getRefreshLink();
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(3);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], '');
        assert.strictEqual(Navigation.StateContext.data['number'], 4);
        assert.strictEqual(Navigation.StateContext.data['char'], 7);
        assert.strictEqual(Navigation.StateContext.data['s'], 1);
        assert.strictEqual(Navigation.StateContext.data['t'], '2');
    });

    it('NavigateBackOverrideDefaultsCustomTrailTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        Navigation.StateController.navigateBack(1);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'World');
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    it('NavigateBackOverrideDefaultsCustomTrailLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('d6');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'World');
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    it('NavigateBackOverrideDefaultsCustomTrailRouteTest', function () {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigateBack(1);
        Navigation.StateController.navigateBack(1);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'World');
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    it('NavigateBackOverrideDefaultsCustomTrailRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        var data = { emptyString: 'World', 'number': 1, char: 5 };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('d6');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['emptyString'], 'World');
        assert.strictEqual(Navigation.StateContext.data['number'], 1);
        assert.strictEqual(Navigation.StateContext.data['char'], 5);
    });

    it('CrumbDefaultsCustomTrailTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['number'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['emptyString'], '');
        assert.strictEqual(Navigation.StateController.crumbs[2].data['number'], 4);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['char'], 7);
    });

    it('CrumbDefaultsCustomTrailLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('d6');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['number'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['emptyString'], '');
        assert.strictEqual(Navigation.StateController.crumbs[2].data['number'], 4);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['char'], 7);
    });

    it('CrumbDefaultsCustomTrailRouteTest', function () {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['number'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['emptyString'], '');
        assert.strictEqual(Navigation.StateController.crumbs[2].data['number'], 4);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['char'], 7);
    });

    it('CrumbDefaultsCustomTrailRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('d6');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['number'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['emptyString'], '');
        assert.strictEqual(Navigation.StateController.crumbs[2].data['number'], 4);
        assert.strictEqual(Navigation.StateController.crumbs[2].data['char'], 7);
    });

    it('NavigateDataNavigateBackCustomTrailTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        Navigation.StateController.navigate('d6', data);
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], undefined);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    it('NavigateDataNavigateBackCustomTrailLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        link = Navigation.StateController.getNavigationLink('d6', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], undefined);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    it('NavigateDataNavigateBackCustomTrailRouteTest', function () {
        Navigation.StateController.navigate('d3');
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        Navigation.StateController.navigate('d6', data);
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], undefined);
        Navigation.StateController.navigateBack(1);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    it('NavigateDataNavigateBackCustomTrailRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['s'] = 'Hello';
        data['t'] = '';
        link = Navigation.StateController.getNavigationLink('d6', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], undefined);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateContext.data['s'], 'Hello');
        assert.strictEqual(Navigation.StateContext.data['t'], undefined);
    });

    it('CrumbDataAndDefaultsCustomTrailTest', function () {
        Navigation.StateController.navigate('d0');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
    });

    it('CrumbDataAndDefaultsCustomTrailLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = { s: 1, t: '2' };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('d6');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
    });

    it('CrumbDataAndDefaultsCustomTrailRouteTest', function () {
        Navigation.StateController.navigate('d3');
        var data = { s: 1, t: '2' };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
    });

    it('CrumbDataAndDefaultsCustomTrailRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        var data = { s: 1, t: '2' };
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('d6');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['string'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[0].data['s'], undefined);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['s'], 1);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['t'], '2');
    });

    it('NavigateOverrideCrumbDefaultsCustomTrailTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'World');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    it('NavigateOverrideCrumbDefaultsCustomTrailLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('d6');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'World');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    it('NavigateOverrideCrumbDefaultsCustomTrailRouteTest', function () {
        Navigation.StateController.navigate('d3');
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigate('t0');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'World');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    it('NavigateOverrideCrumbDefaultsCustomTrailRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        var data = {};
        data['string'] = 'World';
        data['number'] = 0;
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('d6');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'World');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    it('OverrideCrumbDefaultsCustomTrailTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {};
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigateBack(1);
        var crumb = Navigation.StateController.crumbs[1];
        crumb.data['string'] = 'Hello';
        crumb.data['number'] = 0;
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    it('OverrideCrumbDefaultsCustomTrailLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d0');
        Navigation.StateController.navigateLink(link);
        var data = {};
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('d6');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        var crumb = Navigation.StateController.crumbs[1];
        crumb.data['string'] = 'Hello';
        crumb.data['number'] = 0;
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    it('OverrideCrumbDefaultsCustomTrailRouteTest', function () {
        Navigation.StateController.navigate('d3');
        var data = {};
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('d6');
        Navigation.StateController.navigateBack(1);
        var crumb = Navigation.StateController.crumbs[1];
        crumb.data['string'] = 'Hello';
        crumb.data['number'] = 0;
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    it('OverrideCrumbDefaultsCustomTrailRouteLinkTest', function () {
        var link = Navigation.StateController.getNavigationLink('d3');
        Navigation.StateController.navigateLink(link);
        var data = {};
        link = Navigation.StateController.getNavigationLink('t0', data);
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('t0');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationLink('d6');
        Navigation.StateController.navigateLink(link);
        link = Navigation.StateController.getNavigationBackLink(1);
        Navigation.StateController.navigateLink(link);
        var crumb = Navigation.StateController.crumbs[1];
        crumb.data['string'] = 'Hello';
        crumb.data['number'] = 0;
        assert.strictEqual(Navigation.StateController.crumbs[1].data['string'], 'Hello');
        assert.strictEqual(Navigation.StateController.crumbs[1].data['_bool'], true);
        assert.strictEqual(Navigation.StateController.crumbs[1].data['number'], 0);
    });

    it('NavigateLinkDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {};
        data['_bool'] = null;
        data['string'] = 'Hello';
        data['number'] = 1;
        var link = Navigation.StateController.getNavigationLink('t0', data);
        assert.equal(link.indexOf('string'), -1);
        assert.equal(link.indexOf('_bool'), -1);
        assert.equal(link.indexOf('number'), -1);
    });

    it('NavigateLinkDefaultsRouteTest', function () {
        Navigation.StateController.navigate('d3');
        var data = {};
        data['_bool'] = null;
        data['string'] = 'Hello';
        data['number'] = 1;
        var link = Navigation.StateController.getNavigationLink('t0', data);
        assert.equal(link.indexOf('string'), -1);
        assert.equal(link.indexOf('_bool'), -1);
        assert.equal(link.indexOf('number'), -1);
    });

    it('NavigateLinkContextDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['emptyString'] = 1;
        Navigation.StateContext.data['number'] = 4;
        Navigation.StateContext.data['char'] = null;
        var link = Navigation.StateController.getNavigationLink('t0');
        assert.equal(link.indexOf('number'), -1);
        assert.equal(link.indexOf('char'), -1);
        assert.notEqual(link.indexOf('emptyString'), -1);
    });

    it('NavigateLinkContextDefaultsRouteTest', function () {
        Navigation.StateController.navigate('d3');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['emptyString'] = 1;
        Navigation.StateContext.data['number'] = 4;
        Navigation.StateContext.data['char'] = null;
        var link = Navigation.StateController.getNavigationLink('t0');
        assert.equal(link.indexOf('number'), -1);
        assert.equal(link.indexOf('char'), -1);
        assert.notEqual(link.indexOf('emptyString'), -1);
    });

    it('RefreshLinkDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['_bool'] = null;
        Navigation.StateContext.data['string'] = 'Hello';
        Navigation.StateContext.data['number'] = 0;
        var link = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData({}));
        assert.equal(link.indexOf('string'), -1);
        assert.equal(link.indexOf('_bool'), -1);
        assert.notEqual(link.indexOf('number'), -1);
    });

    it('BackLinkDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['_bool'] = null;
        Navigation.StateContext.data['string'] = 'Hello';
        Navigation.StateContext.data['number'] = 0;
        Navigation.StateController.navigate('t0');
        var link = Navigation.StateController.getNavigationBackLink(1);
        assert.equal(link.indexOf('string'), -1);
        assert.equal(link.indexOf('_bool'), -1);
        assert.notEqual(link.indexOf('number'), -1);
    });

    it('CrumbLinkDefaultsTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['number'] = 1;
        Navigation.StateContext.data['_bool'] = '';
        Navigation.StateContext.data['string'] = 4;
        Navigation.StateController.navigate('t0');
        var link = Navigation.StateController.crumbs[1].navigationLink;
        assert.equal(link.indexOf('_bool'), -1);
        assert.equal(link.indexOf('number'), -1);
        assert.notEqual(link.indexOf('string'), -1);
    });

    it('NavigateLinkTest', function () {
        Navigation.StateController.navigate('d2');
        Navigation.StateContext.data['_number'] = 1;
        Navigation.StateContext.data['string'] = 'Hello';
        var link = Navigation.StateController.getNavigationLink('t0');
        assert.notEqual(link.indexOf('c1'), -1);
        assert.notEqual(link.indexOf('_number'), -1);
        assert.notEqual(link.indexOf('string'), -1);
    });

    it('NavigateLinkWithoutTrailTest', function () {
        Navigation.StateController.navigate('d2');
        Navigation.StateController.navigate('t0');
        Navigation.StateContext.data['_number'] = 1;
        Navigation.StateContext.data['string'] = 'Hello';
        var link = Navigation.StateController.getNavigationLink('t0');
        assert.equal(link.indexOf('c1'), -1);
        assert.equal(link.indexOf('_number'), -1);
        assert.equal(link.indexOf('string'), -1);
    });

    it('NavigateDefaultTypesTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0', individualNavigationData);
        var i = 0;
        for (var key in Navigation.StateContext.data) {
            assert.strictEqual(Navigation.StateContext.data[key], individualNavigationData[key]);
            i++;
        }
        assert.equal(i, 3);
    });

    it('NavigateLinkDefaultTypesStringTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var data = { s1: 'hello', s2: 'world' };
        var url = Navigation.StateController.getNavigationLink('t0', data);
        assert.notEqual(url.indexOf('s1=hello&'), -1);
        assert.notEqual(url.indexOf('s2=world2_'), -1);
    });

    it('NavigateLinkDefaultTypesBoolTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var data = { b1: true, b2: false };
        var url = Navigation.StateController.getNavigationLink('t0', data);
        assert.notEqual(url.indexOf('b1=true&'), -1);
        assert.notEqual(url.indexOf('b2=false2_'), -1);
    });

    it('NavigateLinkDefaultTypesNumberTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var data = { n1: 0, n2: 1 };
        var url = Navigation.StateController.getNavigationLink('t0', data);
        assert.notEqual(url.indexOf('n1=0&'), -1);
        assert.notEqual(url.indexOf('n2=12_'), -1);
    });

    it('NavigateBackLinkDefaultTypesTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var data = {
            s2: 'world',
            n1: 0,
            n2: 1
        };
        data['s1'] = 'hello';
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        var url = Navigation.StateController.getNavigationBackLink(1);
        assert.notEqual(url.indexOf('s1=hello&'), -1);
        assert.notEqual(url.indexOf('s2=world2_'), -1);
        assert.notEqual(url.indexOf('n1=0&'), -1);
        assert.notEqual(url.indexOf('n2=12_'), -1);
    });

    it('NavigateRefreshLinkDefaultTypesTest', function () {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var data = {
            s2: 'world',
            n1: 0,
            n2: 1
        };
        data['s1'] = 'hello';
        Navigation.StateController.navigate('t0', data);
        var url = Navigation.StateController.getRefreshLink(Navigation.StateContext.includeCurrentData(null));
        assert.notEqual(url.indexOf('s1=hello&'), -1);
        assert.notEqual(url.indexOf('s2=world2_'), -1);
        assert.notEqual(url.indexOf('n1=0&'), -1);
        assert.notEqual(url.indexOf('n2=12_'), -1);
    });

    it('NavigateBack2LinkDefaultTypesTest', function () {
        Navigation.StateController.navigate('d0');
        var data = {
            _bool: 1
        };
        Navigation.StateController.navigate('t0', data);
        Navigation.StateController.navigate('t0');
        Navigation.StateController.navigate('t0');
        var url = Navigation.StateController.getNavigationBackLink(2);
        assert.notEqual(url.indexOf('_bool=1&'), -1);
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

    it('NavigateInvalilBooleanTest', function () {
        Navigation.StateController.navigate('d0');
        var link = Navigation.StateController.getNavigationLink('t0', { '_bool': false });
        link = link.replace('_bool=false', '_bool=invalid');
        assert.throws(() => Navigation.StateController.navigateLink(link));
    });
});