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

    var dialog: Navigation.Dialog = new Navigation.Dialog();
    dialog.key = 'd0';
    dialog.index = 0;
    var state1: Navigation.State = new Navigation.State();
    state1.key = 's0';
    state1.index = 0;
    state1.parent = dialog;
    var state2: Navigation.State = new Navigation.State();
    state2.key = 's1';
    state2.index = 1;
    state2.parent = dialog;
    dialog.states.push(state1);
    dialog._states[state1.key] = state1;
    dialog.states.push(state2);
    dialog._states[state2.key] = state2;
    dialog.initial = state1;
    var transition: Navigation.Transition = new Navigation.Transition();
    transition.key = 't0';
    transition.parent = state1;
    transition.to = state2;
    state1.transitions.push(transition);
    state1._transitions[transition.key] = transition;
    Navigation.StateInfoConfig.dialogs.push(dialog);
    Navigation.StateInfoConfig._dialogs[dialog.key] = dialog;
    for (var dialogKey in Navigation.StateInfoConfig._dialogs) {
        var dialog = Navigation.StateInfoConfig._dialogs[dialogKey];
        for (var stateKey in dialog._states) {
            dialog._states[stateKey].stateHandler = new StateHandler();
        }
    }

    QUnit.module('NavigationTest', {
    });

    QUnit.test("NavigateDialogTest", function (assert) {
        Navigation.StateController.navigate('d0');
        assert.equal(Navigation.StateContext.state, state1);
    });

    QUnit.test("NavigateTransitionTest", function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateContext.state, state2);
    });

    QUnit.module('NavigationDataTest', {
    });

    QUnit.test("NavigateStringDataTest", function (assert) {
        Navigation.StateController.navigate('d0', { 'string': 'hello' });
        assert.equal(Navigation.StateContext.data['string'], 'hello');
    });

    QUnit.test("NavigateNumberDataTest", function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0', { 'number': 1 });
        assert.equal(Navigation.StateContext.data['number'], 1);
    });
}
 