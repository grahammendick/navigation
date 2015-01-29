module NavigationTest {
    export class StateHandler implements Navigation.IStateHandler {
        getNavigationLink(state: Navigation.State, data: any): string {
            var dataArray: Array<string> = [];
            for (var key in data) {
                dataArray.push(key + '=' + data[key]);
            }
            return dataArray.join('&');
        }

        navigateLink(state: Navigation.State, url: string) {
            var data = {};
            var dataArray = url.split('&');
            var keyValue: Array<string>;
            for (var i = 0; i < dataArray.length; i++) {
                keyValue = dataArray[i].split('=');
                data[keyValue[0]] = keyValue[1];
            }
            Navigation.StateController.setStateContext(state, data);
        }

        getNavigationData(state: Navigation.State, data: any): any {
            return data;
        }
    }

    QUnit.module("", {
        setup: function () {
            for (var dialogKey in Navigation.StateInfoConfig._dialogs) {
                var dialog = Navigation.StateInfoConfig._dialogs[dialogKey];
                for (var stateKey in dialog._states) {
                    dialog._states[stateKey].stateHandler = new StateHandler();
                }
            }
        }
    });
        
}
 