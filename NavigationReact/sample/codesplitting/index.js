var Navigation = require('navigation');

var stateNavigator = new Navigation.StateNavigator([
    {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1 }},
    {key: 'person', route: 'person/{id}', defaults: {id: 0 }}
]);

stateNavigator.states.people.navigating = function(data, url, navigate) {
    require.ensure(['./People'], function(require) {
        var People = require('./People');
        People.createController(stateNavigator);
        navigate();
    });
}

stateNavigator.states.person.navigating = function(data, url, navigate) {
    require.ensure(['./Person'], function(require) {
        var Person = require('./Person');
        Person.createController(stateNavigator);
        navigate();
    });
}
