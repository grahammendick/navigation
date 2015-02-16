module RouterTest {
    QUnit.test('a', function (assert) {
        var router = new Navigation.Router();
        router.addRoute('a/{x}');
        assert.ok(router.match('a/b'));
    });
}
 