import * as assert from 'assert';
import { StateNavigator } from 'navigation';

describe('Rewrite Navigation', () => {
    describe('Rewrite State', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1' },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewriteNavigation = () => ({
                    stateKey: 's1'
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r1');
                assert.equal(stateContextRewritten.state.key, 's1');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r0');
                assert.equal(stateContext.state.key, 's0');
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s0');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s0'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s0').url);            
        });
    });

    describe('Rewrite Null', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1' },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewriteNavigation = () => null;
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r0');
                assert.equal(stateContextRewritten.state.key, 's0');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r0');
                assert.equal(stateContext.state.key, 's0');
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s0');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s0'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s0').url);            
        });
    });

    describe('Rewrite Undefined', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1' },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewriteNavigation = () => undefined;
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r0');
                assert.equal(stateContextRewritten.state.key, 's0');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r0');
                assert.equal(stateContext.state.key, 's0');
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s0');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s0'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s0').url);            
        });
    });

    describe('Rewrite Individual Data', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ]);
                const {s} = stateNavigator.states;
                var individualNavigationData = {};
                individualNavigationData['string'] = 'Hello';
                individualNavigationData['boolean'] = true;
                individualNavigationData['number'] = 0;
                individualNavigationData['date'] = new Date(2010, 3, 7);
                s.rewriteNavigation = () => ({
                    stateKey: 's',
                    navigationData: individualNavigationData
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.state.key, 's');
                assert.strictEqual(stateContextRewritten.data['string'], 'Hello');
                assert.strictEqual(stateContextRewritten.data['boolean'], true);
                assert.strictEqual(stateContextRewritten.data['number'], 0);
                assert.strictEqual(+stateContextRewritten.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateContextRewritten.data).length, 4);
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.state.key, 's');
                assert.strictEqual(Object.keys(stateContext.data).length, 0);
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s').url);
        });
    });

    describe('Rewrite Individual Data Route', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r/{string?}/{boolean?}/{number?}/{date?}' }
                ]);
                const {s} = stateNavigator.states;
                var individualNavigationData = {};
                individualNavigationData['string'] = 'Hello';
                individualNavigationData['boolean'] = true;
                individualNavigationData['number'] = 0;
                individualNavigationData['date'] = new Date(2010, 3, 7);
                s.rewriteNavigation = () => ({
                    stateKey: 's',
                    navigationData: individualNavigationData
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.state.key, 's');
                assert.strictEqual(stateContextRewritten.data['string'], 'Hello');
                assert.strictEqual(stateContextRewritten.data['boolean'], true);
                assert.strictEqual(stateContextRewritten.data['number'], 0);
                assert.strictEqual(+stateContextRewritten.data['date'], +new Date(2010, 3, 7));
                assert.strictEqual(Object.keys(stateContextRewritten.data).length, 4);
                assert.equal(stateContext.state.key, 's');
                assert.strictEqual(Object.keys(stateContext.data).length, 0);
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s').url);
        });
    });

    describe('Rewrite Array Data', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ]);
                const {s} = stateNavigator.states;
                var arrayNavigationData = {};
                arrayNavigationData['array_string'] = ['He-llo', 'World'];
                arrayNavigationData['array_boolean'] = [true, false];
                arrayNavigationData['array_number'] = [1, 2.5, -3];
                arrayNavigationData['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
                s.rewriteNavigation = () => ({
                    stateKey: 's',
                    navigationData: arrayNavigationData
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.state.key, 's');
                assert.strictEqual(stateContextRewritten.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateContextRewritten.data['array_string'][1], 'World');
                assert.strictEqual(stateContextRewritten.data['array_string'].length, 2);
                assert.strictEqual(stateContextRewritten.data['array_boolean'][0], true);
                assert.strictEqual(stateContextRewritten.data['array_boolean'][1], false);
                assert.strictEqual(stateContextRewritten.data['array_boolean'].length, 2);
                assert.strictEqual(stateContextRewritten.data['array_number'][0], 1);
                assert.strictEqual(stateContextRewritten.data['array_number'][1], 2.5);
                assert.strictEqual(stateContextRewritten.data['array_number'][2], -3);
                assert.strictEqual(stateContextRewritten.data['array_number'].length, 3);
                assert.strictEqual(+stateContextRewritten.data['array_date'][0], +new Date(2010, 3, 7));
                assert.strictEqual(+stateContextRewritten.data['array_date'][1], +new Date(2011, 7, 3));
                assert.strictEqual(stateContextRewritten.data['array_date'].length, 2);
                assert.strictEqual(Object.keys(stateContextRewritten.data).length, 4);
                assert.equal(stateContext.state.key, 's');
                assert.strictEqual(Object.keys(stateContext.data).length, 0);
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s').url);
        });
    });

    describe('Rewrite Array Data Route', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r0/{array_string?}/{array_boolean?}/{array_number?}/{array_date?}' }
                ]);
                const {s} = stateNavigator.states;
                var arrayNavigationData = {};
                arrayNavigationData['array_string'] = ['He-llo', 'World'];
                arrayNavigationData['array_boolean'] = [true, false];
                arrayNavigationData['array_number'] = [1, 2.5, -3];
                arrayNavigationData['array_date'] = [new Date(2010, 3, 7), new Date(2011, 7, 3)];
                s.rewriteNavigation = () => ({
                    stateKey: 's',
                    navigationData: arrayNavigationData
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.state.key, 's');
                assert.strictEqual(stateContextRewritten.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateContextRewritten.data['array_string'][1], 'World');
                assert.strictEqual(stateContextRewritten.data['array_string'].length, 2);
                assert.strictEqual(stateContextRewritten.data['array_boolean'][0], true);
                assert.strictEqual(stateContextRewritten.data['array_boolean'][1], false);
                assert.strictEqual(stateContextRewritten.data['array_boolean'].length, 2);
                assert.strictEqual(stateContextRewritten.data['array_number'][0], 1);
                assert.strictEqual(stateContextRewritten.data['array_number'][1], 2.5);
                assert.strictEqual(stateContextRewritten.data['array_number'][2], -3);
                assert.strictEqual(stateContextRewritten.data['array_number'].length, 3);
                assert.strictEqual(+stateContextRewritten.data['array_date'][0], +new Date(2010, 3, 7));
                assert.strictEqual(+stateContextRewritten.data['array_date'][1], +new Date(2011, 7, 3));
                assert.strictEqual(stateContextRewritten.data['array_date'].length, 2);
                assert.strictEqual(Object.keys(stateContextRewritten.data).length, 4);
                assert.equal(stateContext.state.key, 's');
                assert.strictEqual(Object.keys(stateContext.data).length, 0);
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s').url);
        });
    });

    describe('Rewrite Data Defaults', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r', defaults: {a: 'b'} }
                ]);
                const {s} = stateNavigator.states;
                s.rewriteNavigation = ({a}) => (a === 'b' ? {
                    stateKey: 's',
                    navigationData: {
                        a: 'c'
                    }
                } : null);
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r?a=c');
                assert.equal(stateContextRewritten.state.key, 's');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r');
                assert.equal(stateContext.state.key, 's');
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s').url);
        });
    });

    describe('Rewrite Data Null', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ]);
                const {s} = stateNavigator.states;
                s.rewriteNavigation = () => ({
                    stateKey: 's',
                    navigationData: null
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r');
                assert.equal(stateContextRewritten.state.key, 's');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r?a=b');
                assert.equal(stateContext.state.key, 's');
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s', {a: 'b'});
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s', {a: 'b'}));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s', {a: 'b'}).url);
        });
    });

    describe('Rewrite Array Data Splat', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r0/{*array_string?}' }
                ]);
                const {s} = stateNavigator.states;
                var arrayNavigationData = {};
                arrayNavigationData['array_string'] = ['He-llo', 'World'];
                s.rewriteNavigation = () => ({
                    stateKey: 's',
                    navigationData: arrayNavigationData
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.state.key, 's');
                assert.strictEqual(stateContextRewritten.data['array_string'][0], 'He-llo');
                assert.strictEqual(stateContextRewritten.data['array_string'][1], 'World');
                assert.strictEqual(stateContextRewritten.data['array_string'].length, 2);
                assert.strictEqual(Object.keys(stateContextRewritten.data).length, 1);
                assert.equal(stateContext.state.key, 's');
                assert.strictEqual(Object.keys(stateContext.data).length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s').url);
        });
    });

    describe('Rewrite Reserved Url Character Data', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ]);
                const {s} = stateNavigator.states;
                var data = {};
                data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
                s.rewriteNavigation = () => ({
                    stateKey: 's',
                    navigationData: data
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.state.key, 's');
                assert.strictEqual(stateContextRewritten.data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
                assert.equal(stateContext.state.key, 's');
                assert.strictEqual(stateContext.data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'], undefined);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s').url);
        });
    });

    describe('Rewrite Reserved Url Character Route Data', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r/{string?}/{number?}' }
                ]);
                const {s} = stateNavigator.states;
                var data = {};
                data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
                data['string'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
                data['_bool'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
                data['number'] = '!#="/£$%^&*()\'-_+~@:?><.;[],{}';
                s.rewriteNavigation = () => ({
                    stateKey: 's',
                    navigationData: data
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.state.key, 's');
                assert.strictEqual(stateContextRewritten.data['*="/()\'-_+~@:?><.;[],{}!£$%^#&'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
                assert.strictEqual(stateContextRewritten.data['string'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
                assert.strictEqual(stateContextRewritten.data['_bool'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
                assert.strictEqual(stateContextRewritten.data['number'], '!#="/£$%^&*()\'-_+~@:?><.;[],{}');
                assert.equal(stateContext.state.key, 's');
                assert.strictEqual(Object.keys(stateContext.data).length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s').url);
        });
    });

    describe('Rewrite Data Undefined', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ]);
                const {s} = stateNavigator.states;
                s.rewriteNavigation = () => ({
                    stateKey: 's',
                    navigationData: undefined
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r');
                assert.equal(stateContextRewritten.state.key, 's');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r?a=b');
                assert.equal(stateContext.state.key, 's');
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s', {a: 'b'});
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s', {a: 'b'}));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s', {a: 'b'}).url);
        });
    });

    describe('Rewrite Data Empty', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ]);
                const {s} = stateNavigator.states;
                s.rewriteNavigation = () => ({
                    stateKey: 's',
                    navigationData: {}
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r');
                assert.equal(stateContextRewritten.state.key, 's');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r?a=b');
                assert.equal(stateContext.state.key, 's');
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s', {a: 'b'});
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s', {a: 'b'}));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s', {a: 'b'}).url);
        });
    });

    describe('Rewrite Invalid Data', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r/{a}' }
                ]);
                const {s} = stateNavigator.states;
                s.rewriteNavigation = () => ({
                    stateKey: 's',
                    navigationData: {
                        c: 'd'
                    }
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r/b');
                assert.equal(stateContextRewritten.state.key, 's');
                assert.equal(stateContextRewritten.data.a, 'b');
                assert.equal(stateContextRewritten.data.c, undefined);
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r/b');
                assert.equal(stateContext.state.key, 's');
                assert.equal(stateContext.data.a, 'b');
                assert.equal(stateContext.data.c, undefined);
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s', {a: 'b'});
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s', {a: 'b'}));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s', {a: 'b'}).url);
        });
    });

    describe('Rewrite Hash', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ]);
                const {s} = stateNavigator.states;
                s.rewriteNavigation = () => ({
                    stateKey: 's',
                    hash: 'f'
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r#f');
                assert.equal(stateContextRewritten.state.key, 's');
                assert.equal(stateContextRewritten.hash, 'f');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r');
                assert.equal(stateContext.state.key, 's');
                assert.equal(stateContext.hash, null);
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s').url);
        });
    });

    describe('Rewrite Null Hash', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ]);
                const {s} = stateNavigator.states;
                s.rewriteNavigation = () => ({
                    stateKey: 's',
                    hash: null
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r');
                assert.equal(stateContextRewritten.state.key, 's');
                assert.equal(stateContextRewritten.hash, null);
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r');
                assert.equal(stateContext.state.key, 's');
                assert.equal(stateContext.hash, null);
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s').url);
        });
    });

    describe('Rewrite Reserved Url Character Hash', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ]);
                const {s} = stateNavigator.states;
                s.rewriteNavigation = () => ({
                    stateKey: 's',
                    hash: '*="/()\'-_+~@:?><.;[],{}!£$%^#&'
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r#*="/()\'-_+~@:?><.;[],{}!£$%^#&');
                assert.equal(stateContext.url, '/r');
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s').url);
        });
    });

    describe('Rewrite Invalid State', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ]);
                const {s} = stateNavigator.states;
                s.rewriteNavigation = () => ({
                    stateKey: 's0'
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r');
                assert.equal(stateContextRewritten.state.key, 's');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r');
                assert.equal(stateContext.state.key, 's');
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent().navigate('s').url);
        });
    });

    describe('Transition Rewrite', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1' },
                    { key: 's2', route: 'r2' },
                ]);
                const {s1} = stateNavigator.states;
                s1.rewriteNavigation = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r2');
                assert.equal(stateContextRewritten.state.key, 's2');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r1');
                assert.equal(stateContext.state.key, 's1');
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s1');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s1'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).navigate('s1').url);
        });
    });

    describe('Transition Rewrite Data', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1' },
                    { key: 's2', route: 'r2' },
                ]);
                const {s1} = stateNavigator.states;
                s1.rewriteNavigation = () => ({
                    stateKey: 's2',
                    navigationData: {a: 'b'}
                });
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r2?a=b');
                assert.equal(stateContextRewritten.state.key, 's2');
                assert.equal(stateContextRewritten.data.a, 'b');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r1');
                assert.equal(stateContext.state.key, 's1');
                assert.equal(stateContext.data.a, undefined);
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s1');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s1'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).navigate('s1').url);
        });
    });

    describe('Transition Rewrite Data Defaults', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', defaults: {a: 'b'} },
                    { key: 's2', route: 'r2' },
                ]);
                const {s1} = stateNavigator.states;
                s1.rewriteNavigation = ({a}) => (a === 'b' ? {
                    stateKey: 's2',
                    navigationData: {
                        a: 'c'
                    }
                } : null);
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r2?a=c');
                assert.equal(stateContextRewritten.state.key, 's2');
                assert.equal(stateContextRewritten.data.a, 'c');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r1');
                assert.equal(stateContext.state.key, 's1');
                assert.equal(stateContext.data.a, 'b');
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s1');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s1'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).navigate('s1').url);
        });
    });

    describe('Transition Rewrite Hash', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1' },
                    { key: 's2', route: 'r2' },
                ]);
                const {s1} = stateNavigator.states;
                s1.rewriteNavigation = () => ({
                    stateKey: 's2',
                    hash: 'f'
                });
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r2#f');
                assert.equal(stateContextRewritten.state.key, 's2');
                assert.equal(stateContextRewritten.hash, 'f');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r1');
                assert.equal(stateContext.state.key, 's1');
                assert.equal(stateContext.hash, undefined);
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s1');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s1'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).navigate('s1').url);
        });
    });

    describe('Transition With Trail Rewrite', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2' },
                ]);
                const {s1} = stateNavigator.states;
                s1.rewriteNavigation = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r2');
                assert.equal(stateContextRewritten.state.key, 's2');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r1?crumb=%2Fr0');
                assert.equal(stateContext.state.key, 's1');
                assert.equal(stateContext.crumbs.length, 1);
                assert.equal(stateContext.crumbs[0].state.key, 's0');
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s1');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s1'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).navigate('s1').url);
        });
    });

    describe('Transition With Trail Rewrite With Trail', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                ]);
                const {s1} = stateNavigator.states;
                s1.rewriteNavigation = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r2?crumb=%2Fr0');
                assert.equal(stateContextRewritten.state.key, 's2');
                assert.equal(stateContextRewritten.crumbs.length, 1);
                assert.equal(stateContextRewritten.crumbs[0].state.key, 's0');
                assert.equal(stateContext.url, '/r1?crumb=%2Fr0');
                assert.equal(stateContext.state.key, 's1');
                assert.equal(stateContext.crumbs.length, 1);
                assert.equal(stateContext.crumbs[0].state.key, 's0');
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s1');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s1'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).navigate('s1').url);
        });
    });

    describe('Refresh Rewrite', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1' },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewriteNavigation = () => ({
                    stateKey: 's1'
                });
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r1');
                assert.equal(stateContextRewritten.state.key, 's1');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r0');
                assert.equal(stateContext.state.key, 's0');
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.refresh();
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getRefreshLink());
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).refresh().url);
        });
    });

    describe('Refresh Rewrite Data', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1' },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewriteNavigation = () => ({
                    stateKey: 's1',
                    navigationData: { a: 'b' }
                });
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r1?a=b');
                assert.equal(stateContextRewritten.state.key, 's1');
                assert.equal(stateContextRewritten.data.a, 'b');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r0');
                assert.equal(stateContext.state.key, 's0');
                assert.equal(stateContext.data.a, undefined);
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.refresh();
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getRefreshLink());
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).refresh().url);
        });
    });

    describe('Refresh Rewrite Data Defaults', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0', defaults: {a: 'b'} },
                    { key: 's1', route: 'r1' },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewriteNavigation = ({a}) => (a === 'b' ? {
                    stateKey: 's1',
                    navigationData: {
                        a: 'c'
                    }
                } : null);
                stateNavigator.navigate('s0', {a: 'z'});
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r1?a=c');
                assert.equal(stateContextRewritten.state.key, 's1');
                assert.equal(stateContextRewritten.data.a, 'c');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r0');
                assert.equal(stateContext.state.key, 's0');
                assert.equal(stateContext.data.a, 'b');
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.refresh();
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getRefreshLink());
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).refresh().url);
        });
    });

    describe('Refresh Rewrite Hash', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1' },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewriteNavigation = () => ({
                    stateKey: 's1',
                    hash: 'f'
                });
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r1#f');
                assert.equal(stateContextRewritten.state.key, 's1');
                assert.equal(stateContextRewritten.hash, 'f');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r0');
                assert.equal(stateContext.state.key, 's0');
                assert.equal(stateContext.hash, null);
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.refresh();
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getRefreshLink());
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).refresh().url);
        });
    });

    describe('Refresh With Trail Rewrite', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2' },
                ]);
                const {s1} = stateNavigator.states;
                s1.rewriteNavigation = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r2');
                assert.equal(stateContextRewritten.state.key, 's2');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r1?crumb=%2Fr0');
                assert.equal(stateContext.state.key, 's1');
                assert.equal(stateContext.crumbs.length, 1);
                assert.equal(stateContext.crumbs[0].state.key, 's0');
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.refresh();
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getRefreshLink());
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).refresh().url);
        });
    });

    describe('Refresh With Trail Rewrite With Trail', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                ]);
                const {s1} = stateNavigator.states;
                s1.rewriteNavigation = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r2?crumb=%2Fr0');
                assert.equal(stateContextRewritten.state.key, 's2');
                assert.equal(stateContextRewritten.crumbs.length, 1);
                assert.equal(stateContextRewritten.crumbs[0].state.key, 's0');
                assert.equal(stateContext.url, '/r1?crumb=%2Fr0');
                assert.equal(stateContext.state.key, 's1');
                assert.equal(stateContext.crumbs.length, 1);
                assert.equal(stateContext.crumbs[0].state.key, 's0');
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.refresh();
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getRefreshLink());
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).refresh().url);
        });
    });

    describe('Back Rewrite', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2' },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewriteNavigation = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r2');
                assert.equal(stateContextRewritten.state.key, 's2');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r0');
                assert.equal(stateContext.state.key, 's0');
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigateBack(1);
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationBackLink(1));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).navigateBack(1).url);
        });
    });

    describe('Back Rewrite Data', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2' },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewriteNavigation = () => ({
                    stateKey: 's2',
                    navigationData: {a: 'b'}
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r2?a=b');
                assert.equal(stateContextRewritten.state.key, 's2');
                assert.equal(stateContextRewritten.data.a, 'b');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r0');
                assert.equal(stateContext.state.key, 's0');
                assert.equal(stateContext.data.a, undefined);
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigateBack(1);
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationBackLink(1));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).navigateBack(1).url);
        });
    });

    describe('Back Rewrite Hash', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2' },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewriteNavigation = () => ({
                    stateKey: 's2',
                    hash: 'f'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r2#f');
                assert.equal(stateContextRewritten.state.key, 's2');
                assert.equal(stateContextRewritten.hash, 'f');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r0');
                assert.equal(stateContext.state.key, 's0');
                assert.equal(stateContext.hash, null);
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigateBack(1);
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationBackLink(1));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).navigateBack(1).url);
        });
    });

    describe('Back With Trail Rewrite', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                    { key: 's3', route: 'r3' },
                ]);
                const {s1} = stateNavigator.states;
                s1.rewriteNavigation = () => ({
                    stateKey: 's3'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r3');
                assert.equal(stateContextRewritten.state.key, 's3');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r1?crumb=%2Fr0');
                assert.equal(stateContext.state.key, 's1');
                assert.equal(stateContext.crumbs.length, 1);
                assert.equal(stateContext.crumbs[0].state.key, 's0');
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigateBack(1);
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationBackLink(1));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).navigateBack(1).url);
        });
    });

    describe('Back With Trail Rewrite With Trail', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                    { key: 's3', route: 'r3', trackCrumbTrail: true },
                ]);
                const {s1} = stateNavigator.states;
                s1.rewriteNavigation = () => ({
                    stateKey: 's3'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r3?crumb=%2Fr0');
                assert.equal(stateContextRewritten.state.key, 's3');
                assert.equal(stateContextRewritten.crumbs.length, 1);
                assert.equal(stateContextRewritten.crumbs[0].state.key, 's0');
                assert.equal(stateContext.url, '/r1?crumb=%2Fr0');
                assert.equal(stateContext.state.key, 's1');
                assert.equal(stateContext.crumbs.length, 1);
                assert.equal(stateContext.crumbs[0].state.key, 's0');
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigateBack(1);
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationBackLink(1));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).navigateBack(1).url);
        });
    });

    describe('Back Twice With Trail Rewrite', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                    { key: 's3', route: 'r3' },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewriteNavigation = () => ({
                    stateKey: 's3'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r3');
                assert.equal(stateContextRewritten.state.key, 's3');
                assert.equal(stateContextRewritten.crumbs.length, 0);
                assert.equal(stateContext.url, '/r0');
                assert.equal(stateContext.state.key, 's0');
                assert.equal(stateContext.crumbs.length, 0);
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigateBack(2);
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationBackLink(2));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).navigateBack(2).url);
        });
    });

    describe('Back Twice With Trail Rewrite With Trail', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                    { key: 's3', route: 'r3', trackCrumbTrail: true },
                    { key: 's4', route: 'r4', trackCrumbTrail: true },
                ]);
                const {s1} = stateNavigator.states;
                s1.rewriteNavigation = () => ({
                    stateKey: 's4'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                stateNavigator.navigate('s3');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r4?crumb=%2Fr0');
                assert.equal(stateContextRewritten.state.key, 's4');
                assert.equal(stateContextRewritten.crumbs.length, 1);
                assert.equal(stateContextRewritten.crumbs[0].state.key, 's0');
                assert.equal(stateContext.url, '/r1?crumb=%2Fr0');
                assert.equal(stateContext.state.key, 's1');
                assert.equal(stateContext.crumbs.length, 1);
                assert.equal(stateContext.crumbs[0].state.key, 's0');
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigateBack(2);
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationBackLink(2));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).navigateBack(2).url);
        });
    });

    describe('Custom Trail Rewrite', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                    { key: 's3', route: 'r3', trackCrumbTrail: true },
                ]);
                const {s2} = stateNavigator.states;
                s2.rewriteNavigation = () => ({
                    stateKey: 's3'
                });
                s2.truncateCrumbTrail = (_state, _data, crumbs) => crumbs.slice(-1);
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r3?crumb=%2Fr1');
                assert.equal(stateContextRewritten.state.key, 's3');
                assert.equal(stateContextRewritten.crumbs.length, 1);
                assert.equal(stateContextRewritten.crumbs[0].state.key, 's1');
                assert.equal(stateContext.url, '/r2?crumb=%2Fr1');
                assert.equal(stateContext.state.key, 's2');
                assert.equal(stateContext.crumbs.length, 1);
                assert.equal(stateContext.crumbs[0].state.key, 's1');
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s2');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s2'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).navigate('s2').url);
        });
    });

    describe('Rewrite Custom Trail', () => {
        const test = navigate => {
            it('should populate context', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                    { key: 's3', route: 'r3', trackCrumbTrail: true },
                ]);
                const {s2, s3} = stateNavigator.states;
                s2.rewriteNavigation = () => ({
                    stateKey: 's3'
                });
                s3.truncateCrumbTrail = (_state, _data, crumbs) => crumbs.slice(-1);
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                const stateContextRewritten = stateNavigator.stateContext;
                stateNavigator.navigateLink(link);
                const stateContext = stateNavigator.stateContext;
                assert.equal(stateContextRewritten.url, '/r3?crumb=%2Fr1');
                assert.equal(stateContextRewritten.state.key, 's3');
                assert.equal(stateContextRewritten.crumbs.length, 1);
                assert.equal(stateContextRewritten.crumbs[0].state.key, 's1');
                assert.equal(stateContext.url, '/r2?crumb=%2Fr0&crumb=%2Fr1');
                assert.equal(stateContext.state.key, 's2');
                assert.equal(stateContext.crumbs.length, 2);
                assert.equal(stateContext.crumbs[0].state.key, 's0');
                assert.equal(stateContext.crumbs[1].state.key, 's1');
            });
        }

        describe('Navigate', () => {
            test(stateNavigator => {
                stateNavigator.navigate('s2');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(stateNavigator => stateNavigator.getNavigationLink('s2'));
        });

        describe('Fluent Navigate', () => {
            test(stateNavigator => stateNavigator.fluent(true).navigate('s2').url);
        });
    });

    describe('Rewrite State Twice With Different Crumbs', () => {
        it('should match hrefs', () => {
            const createStateNavigator = () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1' },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewriteNavigation = () => ({
                    stateKey: 's2'
                });
                return stateNavigator;
            }
            const stateNavigator1 = createStateNavigator();
            stateNavigator1.navigate('s1');
            const link1 = stateNavigator1.getNavigationLink('s0');
            const rewrittenLink1 = stateNavigator1.historyManager.getHref(link1).substring(1);

            const stateNavigator2 = createStateNavigator();
            stateNavigator2.navigate('s0');
            const link2 = stateNavigator2.getRefreshLink();
            const rewrittenLink2 = stateNavigator2.historyManager.getHref(link2).substring(1);

            assert.equal(link1, link2);
            assert.equal(link1, '/r0');
            assert.equal(rewrittenLink1, rewrittenLink2);
            assert.equal(rewrittenLink1, '/r2');
        });
    });
});
