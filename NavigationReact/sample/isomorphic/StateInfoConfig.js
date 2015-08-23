var Navigation = require('../../../build/dist/Navigation');

exports.register = function() {
    Navigation.StateInfoConfig.build([
        { key: 'masterDetails', initial: 'listing', states: [
            { key: 'listing', route: '{pageNumber}', defaults: { pageNumber: 1 }, trackCrumbTrail: false, transitions: [
                { key: 'select', to: 'details' }]},
            { key: 'details', route: 'person/{id}', defaults: { id: 0 } }]
        }
    ]);
}

