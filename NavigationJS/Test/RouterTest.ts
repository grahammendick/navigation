module RouterTest {
    QUnit.test('RootMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('');
        var routeMatch = router.match('');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 0);
        assert.equal(route.params.length, 0);
    });

    QUnit.test('RootNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('');
        assert.equal(router.match(' '), null);
        assert.equal(router.match('a'), null);
        assert.equal(router.match('//'), null);
    });

    QUnit.test('NoParamOneSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('abc');
        var routeMatch = router.match('abc');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 0);
        assert.equal(route.params.length, 0);
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
        assert.equal(route.params.length, 0);
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
        assert.equal(route.params.length, 1);
        assert.equal(route.params[0].name, 'x');
    });

    QUnit.test('OneParamTwoSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x}');
        var routeMatch = router.match('ab/cd');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'cd');
        assert.equal(route.params.length, 1);
        assert.equal(route.params[0].name, 'x');
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
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
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
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
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
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
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
        assert.equal(route.params.length, 1);
        assert.equal(route.params[0].name, 'x');
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
        assert.equal(route.params.length, 1);
        assert.equal(route.params[0].name, 'x');
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
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
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
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
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
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
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
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
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
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
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
        assert.equal(route.params.length, 1);
        assert.equal(route.params[0].name, 'x');
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
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
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

    QUnit.test('TwoParamOneOptionalTwoSegmentOneMixedMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}ab/{y?}');
        var routeMatch = router.match('abcab/de');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'abc');
        assert.equal(routeMatch.data.y, 'de');
        routeMatch = router.match('abcab');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'abc');
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
    });

    QUnit.test('TwoParamOneOptionalTwoSegmentOneMixedNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}ab/{y?}');
        assert.equal(router.match('abcab /de'), null);
        assert.equal(router.match('abcab/de/fg'), null);
        assert.equal(router.match('abcab//'), null);
        assert.equal(router.match('ab/de'), null);
        assert.equal(router.match(''), null);
    });

    QUnit.test('OneParamOneSegmentDefaultMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}', { x: 'cde' });
        var routeMatch = router.match('ab');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'ab');
        routeMatch = router.match('');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'cde');
        assert.equal(route.params.length, 1);
        assert.equal(route.params[0].name, 'x');
    });

    QUnit.test('OneParamOneSegmentDefaultNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}', { x: 'cde' });
        assert.equal(router.match('ab/cd'), null);
        assert.equal(router.match('ab//'), null);
    });

    QUnit.test('OneParamTwoSegmentDefaultMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x}', { x: 'ccdd' });
        var routeMatch = router.match('ab/cde');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'cde');
        var routeMatch = router.match('ab');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'ccdd');
        assert.equal(route.params.length, 1);
        assert.equal(route.params[0].name, 'x');
    });

    QUnit.test('OneParamTwoSegmentDefaultNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x}', { x: 'ccdd' });
        assert.equal(router.match(' ab/cd'), null);
        assert.equal(router.match('abc/d'), null);
        assert.equal(router.match('ab/d/e'), null);
        assert.equal(router.match('a/b/d'), null);
        assert.equal(router.match('abd'), null);
        assert.equal(router.match('cab/d'), null);
        assert.equal(router.match(''), null);
    });

    QUnit.test('TwoParamTwoSegmentTwoDefaultMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}/{y}', { x: 'ab', y: 'c' });
        var routeMatch = router.match('aa/bbb');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'aa');
        assert.equal(routeMatch.data.y, 'bbb');
        routeMatch = router.match('aa');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'aa');
        assert.equal(routeMatch.data.y, 'c');
        routeMatch = router.match('');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'ab');
        assert.equal(routeMatch.data.y, 'c');
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
    });

    QUnit.test('TwoParamTwoSegmentTwoDefaultNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}/{y}', { x: 'ab', y: 'c' });
        assert.equal(router.match('aa/bbb/e'), null);
        assert.equal(router.match('aa//'), null);
    });

    QUnit.test('TwoParamTwoSegmentDefaultMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}/{y}', { y: 'ab' });
        var routeMatch = router.match('aa/bbb');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'aa');
        assert.equal(routeMatch.data.y, 'bbb');
        routeMatch = router.match('aa');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'aa');
        assert.equal(routeMatch.data.y, 'ab');
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
    });

    QUnit.test('TwoParamTwoSegmentDefaultNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}/{y}', { y: 'ab' });
        assert.equal(router.match('aa/bbb/e'), null);
        assert.equal(router.match('aa//'), null);
        assert.equal(router.match(''), null);
    });

    QUnit.test('TwoParamOneOptionalTwoSegmentDefaultMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}/{y?}', { x: 'abc' });
        var routeMatch = router.match('aa/bbb');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'aa');
        assert.equal(routeMatch.data.y, 'bbb');
        routeMatch = router.match('aab');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'aab');
        routeMatch = router.match('');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'abc');
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
    });

    QUnit.test('TwoParamOneOptionalTwoSegmentDefaultNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}/{y?}', { x: 'abc' });
        assert.equal(router.match('aa/bbb/e'), null);
        assert.equal(router.match('aa//'), null);
    });

    QUnit.test('FourParamTwoOptionalFiveSegmentDefaultMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{w}/{x}/{y?}/{z?}', { w: 'abc', x: 'de' });
        var routeMatch = router.match('ab/cd/ef/hi/jk');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 4);
        assert.equal(routeMatch.data.w, 'cd');
        assert.equal(routeMatch.data.x, 'ef');
        assert.equal(routeMatch.data.y, 'hi');
        assert.equal(routeMatch.data.z, 'jk');
        routeMatch = router.match('ab/cde/fg/h');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 3);
        assert.equal(routeMatch.data.w, 'cde');
        assert.equal(routeMatch.data.x, 'fg');
        assert.equal(routeMatch.data.y, 'h');
        routeMatch = router.match('ab/cc/def');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.w, 'cc');
        assert.equal(routeMatch.data.x, 'def');
        routeMatch = router.match('ab/ccdd');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.w, 'ccdd');
        assert.equal(routeMatch.data.x, 'de');
        routeMatch = router.match('ab');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.w, 'abc');
        assert.equal(routeMatch.data.x, 'de');
        assert.equal(route.params.length, 4);
        assert.equal(route.params[0].name, 'w');
        assert.equal(route.params[1].name, 'x');
        assert.equal(route.params[2].name, 'y');
        assert.equal(route.params[3].name, 'z');
    });

    QUnit.test('FourParamTwoOptionalFiveSegmentDefaultNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{w}/{x}/{y?}/{z?}', { w: 'abc', x: 'de' });
        assert.equal(router.match(' ab/cde/fg/h'), null);
        assert.equal(router.match('ab/cde/fg/h/ij/k'), null);
        assert.equal(router.match('ab/cde/fg/h//'), null);
        assert.equal(router.match('ab/cde/fg//'), null);
        assert.equal(router.match('ab/cd//'), null);
        assert.equal(router.match('ab//'), null);
        assert.equal(router.match(''), null);
    });

    QUnit.test('SpacesMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}');
        var routeMatch = router.match('   a  ');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, '   a  ');
        assert.equal(route.params.length, 1);
        assert.equal(route.params[0].name, 'x');
    });

    QUnit.test('MultiCharParamMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('a/{someVar}');
        var routeMatch = router.match('a/someVal');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.someVar, 'someVal');
        assert.equal(route.params.length, 1);
        assert.equal(route.params[0].name, 'someVar');
    });

    QUnit.test('SlashMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('/abc/');
        var routeMatch = router.match('abc');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 0);
        assert.equal(route.params.length, 0);
    });

    QUnit.test('MatchSlashTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('abc');
        var routeMatch = router.match('/abc/');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 0);
        assert.equal(route.params.length, 0);
    });

    QUnit.test('ReservedUrlCharacterMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('a/{*="()\'-_+~@:?><.;[],!£$%^#&}');
        var routeMatch = router.match('a/*%3D%22()\'-_%2B~%40%3A%3F%3E%3C.%3B%5B%5D%2C!%C2%A3%24%25%5E%23%26');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data['*="()\'-_+~@:?><.;[],!£$%^#&'], '*="()\'-_+~@:?><.;[],!£$%^#&');
        assert.equal(route.params.length, 1);
        assert.equal(route.params[0].name, '*="()\'-_+~@:?><.;[],!£$%^#&');
    });

    QUnit.test('ReservedRegexCharacterMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('.+*\^$\[\](){}\'\{x}');
        var routeMatch = router.match('.+*\^$\[\](){}\'\abc');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'abc');
        assert.equal(route.params.length, 1);
        assert.equal(route.params[0].name, 'x');
    });

    QUnit.test('OneParamOptionalMandatoryOneMixedSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab{x?}');
        var routeMatch = router.match('abcde');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'cde');
        assert.equal(route.params.length, 1);
        assert.equal(route.params[0].name, 'x');
    });

    QUnit.test('OneParamOptionalMandatoryOneMixedSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab{x}');
        assert.equal(router.match('ab/cde'), null);
        assert.equal(router.match('abcd//'), null);
        assert.equal(router.match('ab'), null);
        assert.equal(router.match(''), null);
        assert.equal(route.params.length, 1);
        assert.equal(route.params[0].name, 'x');
    });

    QUnit.test('TwoParamOneOptionalMandatoryThreeSegmentMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x?}/{y}');
        var routeMatch = router.match('ab/cd/efg');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'cd');
        assert.equal(routeMatch.data.y, 'efg');
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
    });

    QUnit.test('TwoParamOneOptionalMandatoryThreeSegmentNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x?}/{y}');
        assert.equal(router.match(' ab/cd/efg'), null);
        assert.equal(router.match('ab/cd/efg/h'), null);
        assert.equal(router.match('ab//efg'), null);
        assert.equal(router.match('/cd/efg'), null);
        assert.equal(router.match('ab/cde'), null);
        assert.equal(router.match('ab'), null);
        assert.equal(router.match(''), null);
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
    });

    QUnit.test('TwoParamTwoSegmentDefaultMandatoryMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}/{y}', { x: 'ab' });
        var routeMatch = router.match('aa/bbb');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'aa');
        assert.equal(routeMatch.data.y, 'bbb');
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
    });

    QUnit.test('TwoParamTwoSegmentDefaultMandatoryNonMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}/{y}', { x: 'ab' });
        assert.equal(router.match('aa/bbb/e'), null);
        assert.equal(router.match('aa//'), null);
        assert.equal(router.match('aa'), null);
        assert.equal(router.match(''), null);
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
    });

    QUnit.test('TwoParamOneOptionalMandatoryFourSegmentDefaultMandatoryMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x?}/{y}/c', { y: 'ee' });
        var routeMatch = router.match('ab/cd/efg/c');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'cd');
        assert.equal(routeMatch.data.y, 'efg');
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
    });

    QUnit.test('TwoParamOneOptionalMandatoryFourSegmentDefaultMandatoryMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/{x?}/{y}/c', { y: 'ee' });
        assert.equal(router.match(' ab/cd/efg/c'), null);
        assert.equal(router.match('ab/cd/efg'), null);
        assert.equal(router.match('ab/cd'), null);
        assert.equal(router.match('ab'), null);
        assert.equal(router.match('ab/cd/efg/c//'), null);
        assert.equal(router.match('ab//efg/c'), null);
        assert.equal(router.match('ab/cd//c'), null);
        assert.equal(router.match('ab///c'), null);
        assert.equal(router.match('ab/c'), null);
        assert.equal(router.match(''), null);
        assert.equal(route.params.length, 2);
        assert.equal(route.params[0].name, 'x');
        assert.equal(route.params[1].name, 'y');
    });

    QUnit.test('ExtraDefaultsMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}', { x: 'a', y: 'b' });
        var routeMatch = router.match('');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 2);
        assert.equal(routeMatch.data.x, 'a');
        assert.equal(routeMatch.data.y, 'b');
        assert.equal(route.params.length, 1);
        assert.equal(route.params[0].name, 'x');
    });

    QUnit.test('CaseInsensitiveMatchTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('abc/{x}');
        var routeMatch = router.match('AbC/aBc');
        assert.equal(routeMatch.route, route);
        assert.equal(Object.keys(routeMatch.data).length, 1);
        assert.equal(routeMatch.data.x, 'aBc');
        assert.equal(route.params.length, 1);
        assert.equal(route.params[0].name, 'x');
    });

    QUnit.test('RootBuildTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('');
        assert.equal(route.build(), '/');
    });

    QUnit.test('NoParamOneSegmentBuildTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('abc');
        assert.equal(route.build(), '/abc');
    });

    QUnit.test('NoParamTwoSegmentBuildTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('ab/c');
        assert.equal(route.build(), '/ab/c');
    });

    QUnit.test('OneParamOneSegmentBuildTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('{x}');
        assert.equal(route.build({ x: 'abcd' }), '/abcd');
    });

    QUnit.test('BuildTest', function (assert) {
        var router = new Navigation.Router();
        var route = router.addRoute('abc/{x}');
        assert.equal(route.build({ x: 'de' }), '/abc/de');
    });
}
