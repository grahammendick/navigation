module RouterTest {
    QUnit.test('NoParamOneSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('abc');
        var routeMatch = router.match('abc');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 0);
    });

    QUnit.test('NoParamOneSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('abc');
        assert.equal(router.match(' abc'), null);
        assert.equal(router.match('abc '), null);
        assert.equal(router.match('abd'), null);
        assert.equal(router.match('abcd'), null);
        assert.equal(router.match('dbc'), null);
        assert.equal(router.match('ab/c'), null);
        assert.equal(router.match('adc'), null);
        assert.equal(router.match('aabc'), null);
    });

    QUnit.test('NoParamTwoSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/c');
        var routeMatch = router.match('ab/c');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 0);
    });

    QUnit.test('NoParamTwoSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/c');
        assert.equal(router.match(' ab/c'), null);
        assert.equal(router.match('ab/c '), null);
        assert.equal(router.match('ab/d'), null);
        assert.equal(router.match('ab/cd'), null);
        assert.equal(router.match('a/b/c'), null);
        assert.equal(router.match('abc'), null);
        assert.equal(router.match('ad/c'), null);
        assert.equal(router.match('aab/c'), null);
    });

    QUnit.test('OneParamTwoSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x}');
        var routeMatch = router.match('ab/cd');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'cd');
    });

    QUnit.test('OneParamTwoSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x}');
        assert.equal(router.match(' ab/cd'), null);
        assert.equal(router.match('abc/d'), null);
        assert.equal(router.match('ab/d/e'), null);
        assert.equal(router.match('a/b/d'), null);
        assert.equal(router.match('abd'), null);
        assert.equal(router.match('cab/d'), null);
    });

    QUnit.test('TwoParamTwoSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x}/{y?}');
        var routeMatch = router.match('ab/cd/efg');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'cd');
        assert.equal(routeMatch.data.y, 'efg');
    });
}
 