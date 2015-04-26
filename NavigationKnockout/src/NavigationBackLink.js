var LinkUtility = require('./LinkUtility');
var Navigation = require('navigation');
var ko = require('knockout');

var NavigationBackLink = ko.bindingHandlers['navigationBackLink'] = {
    init: function (element, valueAccessor) {
        LinkUtility.addClickListener(element);
        LinkUtility.addNavigateHandler(element, function () {
            return setNavigationBackLink(element, valueAccessor);
        });
    },
    update: function (element, valueAccessor) {
        element.removeAttribute('data-state-context-url');
        setNavigationBackLink(element, valueAccessor);
    }
};

function setNavigationBackLink(element, valueAccessor) {
    LinkUtility.setLink(element, function () {
        return Navigation.StateController.getNavigationBackLink(ko.unwrap(valueAccessor()));
    });
}
module.exports = NavigationBackLink;
//# sourceMappingURL=NavigationBackLink.js.map
