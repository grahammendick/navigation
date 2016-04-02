import ConverterFactory = require('./converter/ConverterFactory');
import NavigationDataManager = require('./NavigationDataManager');
import State = require('./config/State');
import StateInfo = require('./config/StateInfo');

class StateConfig {
    static build(states: StateInfo[], converterFactory: ConverterFactory): State[] {
        var builtStates: State[] = [];
        var stateKeys = {};
        for (var i = 0; i < states.length; i++) {
            var stateObject = states[i];
            var state = new State();
            for (var key in stateObject)
                state[key] = stateObject[key];
            if (!state.key)
                throw new Error('State key is mandatory');
            if (state.route == null)
                state.route = state.key;
            if (state.trackCrumbTrail) {
                state.trackCrumbTrail = true;
                var trackCrumbTrail = stateObject.trackCrumbTrail;
                if (typeof trackCrumbTrail === 'string')
                    state.crumbTrailKey = trackCrumbTrail;
                state.defaultTypes[state.crumbTrailKey] = 'stringarray';
            }
            for (var key in state.defaults) {
                if (!state.defaultTypes[key])
                    state.defaultTypes[key] = converterFactory.getConverter(state.defaults[key]).name;
                var formattedData = NavigationDataManager.formatURLObject(converterFactory, key, state.defaults[key], state); 
                state.formattedDefaults[key] = formattedData.val;
                if (formattedData.arrayVal)
                    state.formattedArrayDefaults[key] = formattedData.arrayVal;
            }
            for (var key in state.defaultTypes) {
                converterFactory.getConverterFromName(state.defaultTypes[key]);
            }
            if (stateKeys[state.key])
                throw new Error('A State with key ' + state.key + ' already exists');
            stateKeys[state.key] = true;
            builtStates.push(state);
        }
        return builtStates;
    }
}
export = StateConfig;
