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
        assert.equal(router.match(''), null);
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
        assert.equal(router.match(''), null);
    });

    QUnit.test('OneParamOneSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}');
        var routeMatch = router.match('abcd');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'abcd');
    });

    QUnit.test('OneParamOneSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}');
        assert.equal(router.match('ab/cd'), null);
        assert.equal(router.match('ab//'), null);
        assert.equal(router.match(''), null);
    });

    QUnit.test('OneParamTwoSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x}');
        var routeMatch = router.match('ab/cd');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'cd');
    });

    QUnit.test('OneParamTwoSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x}');
        assert.equal(router.match(' ab/cd'), null);
        assert.equal(router.match('abc/d'), null);
        assert.equal(router.match('ab/d/e'), null);
        assert.equal(router.match('a/b/d'), null);
        assert.equal(router.match('abd'), null);
        assert.equal(router.match('cab/d'), null);
        assert.equal(router.match('ab'), null);
        assert.equal(router.match(''), null);
    });

    QUnit.test('TwoParamTwoSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}/{y}');
        var routeMatch = router.match('aa/bbb');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'aa');
        assert.equal(routeMatch.data.y, 'bbb');
    });

    QUnit.test('TwoParamTwoSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}/{y}');
        assert.equal(router.match('aa/bbb/e'), null);
        assert.equal(router.match('aa//'), null);
        assert.equal(router.match('aa'), null);
        assert.equal(router.match(''), null);
    });

    QUnit.test('TwoParamThreeSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x}/{y}');
        var routeMatch = router.match('ab/cd/efg');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'cd');
        assert.equal(routeMatch.data.y, 'efg');
    });

    QUnit.test('TwoParamThreeSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x}/{y}');
        assert.equal(router.match(' ab/cd/efg'), null);
        assert.equal(router.match('ab/cde'), null);
        assert.equal(router.match('ab/cd'), null);
        assert.equal(router.match('ab/cd/efg/h'), null);
        assert.equal(router.match('ab//efg'), null);
        assert.equal(router.match('/cd/efg'), null);
        assert.equal(router.match('ab'), null);
        assert.equal(router.match(''), null);
    });

    QUnit.test('TwoParamFourSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x}/c/{y}');
        var routeMatch = router.match('ab/yy/c/xyz');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'yy');
        assert.equal(routeMatch.data.y, 'xyz');
    });

    QUnit.test('TwoParamFourSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x}/c/{y}');
        assert.equal(router.match(' ab/yy/c/xyz'), null);
        assert.equal(router.match('ab/b/c'), null);
        assert.equal(router.match('ab/b/c/d/e'), null);
        assert.equal(router.match('ab/c'), null);
        assert.equal(router.match('ab/b/c//d'), null);
        assert.equal(router.match('ab//b/c/d'), null);
        assert.equal(router.match(''), null);
    });

    QUnit.test('OneOptionalParamOneSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x?}');
        var routeMatch = router.match('abcd');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'abcd');
        routeMatch = router.match('');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 0);
    });

    QUnit.test('OneOptionalParamOneSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x?}');
        assert.equal(router.match('ab/cd'), null);
        assert.equal(router.match('ab//'), null);
    });

    QUnit.test('OneOptionalParamTwoSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x?}');
        var routeMatch = router.match('ab/cd');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'cd');
        routeMatch = router.match('ab');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 0);
    });

    QUnit.test('OneOptionalParamTwoSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x?}');
        assert.equal(router.match(' ab/cd'), null);
        assert.equal(router.match('abc/d'), null);
        assert.equal(router.match('ab/d/e'), null);
        assert.equal(router.match('a/b/d'), null);
        assert.equal(router.match('abd'), null);
        assert.equal(router.match('cab/d'), null);
        assert.equal(router.match(''), null);
    });

    QUnit.test('TwoOptionalParamTwoSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x?}/{y?}');
        var routeMatch = router.match('aa/bbb');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'aa');
        assert.equal(routeMatch.data.y, 'bbb');
        var routeMatch = router.match('aab');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'aab');
        var routeMatch = router.match('');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 0);
    });

    QUnit.test('TwoOptionalParamTwoSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x?}/{y?}');
        assert.equal(router.match('aa/bbb/e'), null);
        assert.equal(router.match('aa//'), null);
    });

    QUnit.test('TwoOptionalParamThreeSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x?}/{y?}');
        var routeMatch = router.match('ab/cd/efg');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'cd');
        assert.equal(routeMatch.data.y, 'efg');
        var routeMatch = router.match('ab/cde');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'cde');
        var routeMatch = router.match('ab');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 0);
    });

    QUnit.test('TwoOptionalParamThreeSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x?}/{y?}');
        assert.equal(router.match(' ab/cd/efg'), null);
        assert.equal(router.match('ab/cd/efg/h'), null);
        assert.equal(router.match('ab//efg'), null);
        assert.equal(router.match('/cd/efg'), null);
        assert.equal(router.match(''), null);
    });

    QUnit.test('TwoParamOneOptionalTwoSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}/{y?}');
        var routeMatch = router.match('aa/bbb');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'aa');
        assert.equal(routeMatch.data.y, 'bbb');
        var routeMatch = router.match('aab');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'aab');
    });

    QUnit.test('TwoParamOneOptionalTwoSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}/{y?}');
        assert.equal(router.match('aa/bbb/e'), null);
        assert.equal(router.match('aa//'), null);
        assert.equal(router.match(''), null);
    });

    QUnit.test('TwoParamOneOptionalThreeSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x}/{y?}');
        var routeMatch = router.match('ab/cd/efg');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'cd');
        assert.equal(routeMatch.data.y, 'efg');
        var routeMatch = router.match('ab/cde');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'cde');
    });

    QUnit.test('TwoParamOneOptionalThreeSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x}/{y?}');
        assert.equal(router.match(' ab/cd/efg'), null);
        assert.equal(router.match('ab/cd/efg/h'), null);
        assert.equal(router.match('ab//efg'), null);
        assert.equal(router.match('/cd/efg'), null);
        assert.equal(router.match('ab'), null);
        assert.equal(router.match(''), null);
    });

    QUnit.test('TwoParamOneOptionalFourSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x}/c/{y?}');
        var routeMatch = router.match('ab/yy/c/xyz');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'yy');
        assert.equal(routeMatch.data.y, 'xyz');
        var routeMatch = router.match('ab/yy/c');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'yy');
    });

    QUnit.test('TwoParamOneOptionalFourSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x}/c/{y?}');
        assert.equal(router.match(' ab/yy/c/xyz'), null);
        assert.equal(router.match('ab/b/c/d/e'), null);
        assert.equal(router.match('ab/c'), null);
        assert.equal(router.match('ab/b/c//d'), null);
        assert.equal(router.match('ab//b/c/d'), null);
        assert.equal(router.match(''), null);
    });

    QUnit.test('OneParamOneMixedSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab{x}');
        var routeMatch = router.match('abcde');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'cde');
    });

    QUnit.test('OneParamOneMixedSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab{x}');
        assert.equal(router.match('ab/cde'), null);
        assert.equal(router.match('abcd//'), null);
        assert.equal(router.match('ab'), null);
        assert.equal(router.match(''), null);
    });

    QUnit.test('TwoParamOneMixedSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab{x}e{y}');
        var routeMatch = router.match('abcdefgh');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'cd');
        assert.equal(routeMatch.data.y, 'fgh');
    });

    QUnit.test('TwoParamOneMixedSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab{x}e{y}');
        assert.equal(router.match(' abcdefgh'), null);
        assert.equal(router.match('ab/cdefgh'), null);
        assert.equal(router.match('abcdefgh//'), null);
        assert.equal(router.match('abcde'), null);
        assert.equal(router.match('abc'), null);
        assert.equal(router.match('ab'), null);
        assert.equal(router.match(''), null);
    });
}
