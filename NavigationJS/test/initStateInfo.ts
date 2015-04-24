import Crumb = require('../src/Crumb');
import Navigation = require('../src/navigation');
import State = require('../src/config/State');
import StateHandler = require('../src/StateHandler');

class CustomStateHandler extends StateHandler {
    truncateCrumbTrail(state: State, crumbs: Array<Crumb>): Array<Crumb> {
        var newCrumbs: Array<Crumb> = [];
        var d6Crumbs: Array<Crumb> = [];
        for (var i = 0; i < crumbs.length; i++) {
            if (crumbs[i].state.parent.key === 'd0' || crumbs[i].state.parent.key === 'd3')
                newCrumbs.push(crumbs[i]);
            if (crumbs[i].state.parent.key === 'd6')
                d6Crumbs.push(crumbs[i]);
        }
        newCrumbs = newCrumbs.concat(super.truncateCrumbTrail(state, d6Crumbs));
        return newCrumbs;
    }
}

Navigation.historyManager.disabled = true;

function initStateInfo() {
    Navigation.StateInfoConfig.build([
        { key: 'd0', initial: 's0', title: 'd0', states: [
            { key: 's0', route: 'd0s0', title: 's0', transitions: [
                { key: 't0', to: 's1' },
                { key: 't1', to: 's2' },
                { key: 't2', to: 's3' },
                { key: 't3', to: 's4' }]},
            { key: 's1', route: 'd0s1', title: 's1', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, 
                defaultTypes: { _bool: 'number', 'number': 'number' }, transitions: [
                { key: 't0', to: 's2' },
                { key: 't1', to: 's3' },
                { key: 't2', to: 's4' }]},
            { key: 's2', route: 'd0s2', title: 's2', defaults: { emptyString: '', 'number': 4, char: 7 }, 
                defaultTypes: { 'string': 'string' }, transitions: [
                { key: 't0', to: 's3' },
                { key: 't1', to: 's4' }]},
            { key: 's3', route: 'd0s3', title: 's3', defaultTypes: { s1: 'string', s2: 'number', b1: 'boolean', n1: 'number' },
                    transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'd0s4', title: 's4', defaultTypes: { 'string': 'string', 'number': 'number', 'boolean': 'boolean' }}
        ]},
        { key: 'd1', initial: 's0', title: 'd1', states: [
            { key: 's0', route: 'd1s0', title: 's0', defaultTypes: { _0_1_2_3_4_5_ : 'number', '*/()-_+~@:?><.;[]{}!£$%^#&': 'number' }, 
                transitions: [
                { key: 't0', to: 's1' }]},
            { key: 's1', route: 'd1s1', title: 's1', defaults: { ' &s0': 'a', s1: 'b', s2: 'c', s3: 'd', b1: true, b2: false, b3: true, n1: 0, n2: 1, n3: 2 }, 
                defaultTypes: { s1: 'string', s2: 'boolean', b1: 'boolean', b2: 'number', n1: 'number', n2: 'string' },  transitions: [
                { key: 't0', to: 's2' }]},
            { key: 's2', route: 'd1s2', title: 's2', transitions: [
                { key: 't0', to: 's3' }]},
            { key: 's3', route: 'd1s3', title: 's3', transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'd1s4', title: 's4', transitions: [
                { key: 't0', to: 's5' }]},
            { key: 's5', route: 'd1s5', title: 's5', transitions: [
                { key: 't0', to: 's0' },
                { key: 't1', to: 's1' },
                { key: 't2', to: 's2' },
                { key: 't3', to: 's3' },
                { key: 't4', to: 's4' }]}
        ]},
        { key: 'd2', initial: 's0', title: 'd2', states: [
            { key: 's0', route: 'd2s0', title: 's0', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's1' }]},
            { key: 's1', route: 'd2s1', title: 's1', trackCrumbTrail: true, transitions: [
                { key: 't0', to: 's2' }]},
            { key: 's2', route: 'd2s2', title: 's2', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's3' }]},
            { key: 's3', route: 'd2s3', title: 's3', trackCrumbTrail: true, transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'd2s4', title: 's4', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's5' }]},
            { key: 's5', route: 'd2s5', title: 's5', transitions: [
                { key: 't0', to: 's6' }]},
            { key: 's6', route: 'd2s6', title: 's6', transitions: [
                { key: 't0', to: 's0' }]}
        ]},
        { key: 'd3', initial: 's0', title: 'd3', states: [
            { key: 's0', route: 'd3s0', title: 's0', transitions: [
                { key: 't0', to: 's1' },
                { key: 't1', to: 's2' },
                { key: 't2', to: 's3' },
                { key: 't3', to: 's4' }]},
            { key: 's1', route: 'd3s1/{string}/{number}', title: 's1', defaults: { 'string': 'Hello', _bool: true, 'number': 1 }, 
                defaultTypes: { _bool: 'number', 'number': 'number' }, transitions: [
                { key: 't0', to: 's2' },
                { key: 't1', to: 's3' },
                { key: 't2', to: 's4' }]},
            { key: 's2', route: 'd3s2/{char}/{number?}', title: 's2', defaults: { emptyString: '', 'number': 4, char: 7 }, 
                defaultTypes: { 'string': 'string' }, transitions: [
                { key: 't0', to: 's3' },
                { key: 't1', to: 's4' }]},
            { key: 's3', route: 'd3s3/{s?}', title: 's3', defaultTypes: { s1: 'string', s2: 'number', b1: 'boolean', n1: 'number' },
                    transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'd3s4', title: 's4', defaultTypes: { 'string': 'string', 'number': 'number', 'boolean': 'boolean' }}
        ]},
        { key: 'd4', initial: 's0', title: 'd4', states: [
            { key: 's0', route: 'd4s0', title: 's0', defaultTypes: { _0_1_2_3_4_5_ : 'number', '*/()-_+~@:?><.;[]{}!£$%^#&': 'number' }, 
                transitions: [
                { key: 't0', to: 's1' }]},
            { key: 's1', route: '{s1}/{s?}', title: 's1', defaults: { ' &s0': 'a', s1: 'b', s2: 'c', s3: 'd', b1: true, b2: false, b3: true, n1: 0, n2: 1, n3: 2 }, 
                defaultTypes: { s1: 'string', s2: 'boolean', b1: 'boolean', b2: 'number', n1: 'number', n2: 'string' },  transitions: [
                { key: 't0', to: 's2' }]},
            { key: 's2', route: 'd4s2', title: 's2', transitions: [
                { key: 't0', to: 's3' }]},
            { key: 's3', route: 'd4s3', title: 's3', transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'd4s4/{s1}/{s2}', title: 's4', transitions: [
                { key: 't0', to: 's5' }]},
            { key: 's5', route: 'd4s5', title: 's5', transitions: [
                { key: 't0', to: 's0' },
                { key: 't1', to: 's1' },
                { key: 't2', to: 's2' },
                { key: 't3', to: 's3' },
                { key: 't4', to: 's4' }]}
        ]},
        { key: 'd5', initial: 's0', title: 'd5', states: [
            { key: 's0', route: 'd5s0', title: 's0', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's1' }]},
            { key: 's1', route: 'd5s1', title: 's1', trackCrumbTrail: true, transitions: [
                { key: 't0', to: 's2' }]},
            { key: 's2', route: 'd5s2', title: 's2', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's3' }]},
            { key: 's3', route: 'd5s3', title: 's3', trackCrumbTrail: true, transitions: [
                { key: 't0', to: 's4' }]},
            { key: 's4', route: 'd5s4', title: 's4', trackCrumbTrail: false, transitions: [
                { key: 't0', to: 's5' }]},
            { key: 's5', route: 'd5s5', title: 's5', transitions: [
                { key: 't0', to: 's6' }]},
            { key: 's6', route: 'd5s6', title: 's6', transitions: [
                { key: 't0', to: 's0' }]}
        ]},
        { key: 'd6', initial: 's0', title: 'd6', other: true, path: ' d6', states: [
            { key: 's0', route: 'd6s0', title: 's0', handler: '~/d6/s0.aspx', transitions: [
                { key: 't0', to: 's1' }]},
            { key: 's1', route: 'd6s1', title: 's1'}
        ]}
    ]);
    var dialogs: any = Navigation.StateInfoConfig.dialogs;
    dialogs.d6.states.s0.stateHandler = new CustomStateHandler();
    dialogs.d6.states.s1.stateHandler = new CustomStateHandler();
}
export = initStateInfo;
