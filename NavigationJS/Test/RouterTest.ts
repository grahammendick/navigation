module RouterTest {
    QUnit.test('a', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('a/{x}');
        assert.equal(router.match('a/b'), route);
    });
}
 