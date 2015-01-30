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
            var dataArray = url ? url.split('&') : [];
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

    Navigation.StateInfoConfig.build([
        { key: 'd0', initial: 's0', states: [
            { key: 's0', route: 'r0', transitions: [
                { key: 't0', to : 's1' }] },
            { key: 's1', route: 'r1' }] }
    ]);
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
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs[0].states[0]);
    });

    QUnit.test("NavigateTransitionTest", function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig._dialogs['d0']._states['s1']);
        assert.equal(Navigation.StateContext.previousState, Navigation.StateInfoConfig.dialogs[0].states[0]);
        assert.equal(1, Navigation.StateController.crumbs.length);
    });

    QUnit.test("RefreshTest", function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.refresh();
        assert.equal(Navigation.StateContext.state, Navigation.StateInfoConfig.dialogs[0].states[1]);
    });

    QUnit.module('NavigationDataTest', {
    });

    QUnit.test("NavigateStringDataTest", function (assert) {
        Navigation.StateController.navigate('d0', { s: 'hello' });
        assert.equal(Navigation.StateContext.data.s, 'hello');
    });

    QUnit.test("NavigateNumberDataTest", function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0', { n: 1 });
        assert.equal(Navigation.StateContext.data.n, 1);
    });

    QUnit.test("NavigateRefreshDataTest", function (assert) {
        Navigation.StateController.navigate('d0');
        Navigation.StateController.navigate('t0');
        Navigation.StateController.refresh({ s: 'hello' });
        assert.equal(Navigation.StateContext.data.s, 'hello');
    });}
 