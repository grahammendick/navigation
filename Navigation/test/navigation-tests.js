"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
// tsc --target es3 --lib ES2015,DOM --noImplicitAny true navigation-tests.ts
var navigation_1 = require("navigation");
// History Manager
var LogHistoryManager = /** @class */ (function (_super) {
    __extends(LogHistoryManager, _super);
    function LogHistoryManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LogHistoryManager.prototype.addHistory = function (url) {
        console.log('add history');
        _super.prototype.addHistory.call(this, url, false);
    };
    return LogHistoryManager;
}(navigation_1.HashHistoryManager));
// Configuration
var stateNavigator = new navigation_1.StateNavigator([
    { key: 'people', route: ['people/{page}', 'people/{page}/sort/{sort}'], defaults: { page: 1 }, help: 'people.htm' },
    { key: 'person', route: 'person/{id}', trackTypes: false, defaultTypes: { id: 'number' }, trackCrumbTrail: true }
], new LogHistoryManager());
// States
var _a = stateNavigator.states, people = _a.people, person = _a.person;
var help = people['help'];
var pageDefault = people.defaults.page;
var idDefaultType = person.defaultTypes.id;
// State Controller
people.dispose = function () { };
people.navigating = function (data, url, navigate) {
    navigate([]);
};
people.navigated = function (data, asyncData) { };
person.navigating = function (data, url, navigate) {
    navigate();
};
person.navigated = function (data) { };
person.urlEncode = function urlEncode(state, key, val, queryString) {
    return queryString ? val.replace(/\s/g, '+') : encodeURIComponent(val);
};
person.urlDecode = function urlDecode(state, key, val, queryString) {
    return queryString ? val.replace(/\+/g, ' ') : decodeURIComponent(val);
};
person.validate = function (data) { return data.id > 0; };
person.truncateCrumbTrail = function (state, data, crumbs) { return crumbs; };
// Navigation Event
var navigationListener = function (oldState, state, data, asyncData) {
    stateNavigator.offNavigate(navigationListener);
};
stateNavigator.onNavigate(navigationListener);
// Navigation
stateNavigator.navigate('people');
stateNavigator.navigate('people', null, 'add');
stateNavigator.refresh();
stateNavigator.refresh({ page: 3 });
stateNavigator.refresh({ page: 2 }, 'replace');
stateNavigator.navigate('person', { id: 10 });
var canGoBack = stateNavigator.canNavigateBack(1);
stateNavigator.navigateBack(1);
stateNavigator.stateContext.clear();
// Navigation Link
var link = stateNavigator.getNavigationLink('people');
link = stateNavigator.getRefreshLink();
link = stateNavigator.getRefreshLink({ page: 2 });
stateNavigator.navigateLink(link);
link = stateNavigator.getNavigationLink('person', { id: 10 });
stateNavigator.navigateLink(link, 'replace');
link = stateNavigator.getNavigationBackLink(1);
var crumb = stateNavigator.stateContext.crumbs[0];
link = crumb.url;
stateNavigator.navigateLink(link, 'none', true);
// Fluent Navigation
link = stateNavigator.fluent()
    .navigate('people')
    .refresh()
    .refresh({ page: 3 })
    .navigate('person', { id: 10 })
    .navigateBack(1)
    .url;
// State Context
var state = stateNavigator.stateContext.state;
var url = stateNavigator.stateContext.url;
var title = stateNavigator.stateContext.title;
var page = stateNavigator.stateContext.data.page;
var peopleList = stateNavigator.stateContext.asyncData;
var history = stateNavigator.stateContext.history;
state = stateNavigator.stateContext.oldState;
url = stateNavigator.stateContext.oldUrl;
page = stateNavigator.stateContext.oldData.page;
state = stateNavigator.stateContext.previousState;
url = stateNavigator.stateContext.previousUrl;
page = stateNavigator.stateContext.previousData.page;
// Navigation Data
var data = stateNavigator.stateContext.includeCurrentData({ sort: 'name' }, ['page']);
stateNavigator.refresh(data);
data = stateNavigator.stateContext.includeCurrentData({ pageSize: 10 });
stateNavigator.refresh(data);
