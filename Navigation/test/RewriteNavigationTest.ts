import * as assert from 'assert';
import { StateNavigator } from 'navigation';

describe('Rewrite Navigation', () => {
    describe('Rewrite State', () => {
        const test = navigate => {
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r1');
                assert.equal(stateNavigator.stateContext.state.key, 's1');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1' },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewriteNavigation = () => null;
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                assert.equal(stateNavigator.stateContext.url, '/r0');
                assert.equal(stateNavigator.stateContext.state.key, 's0');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1' },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewriteNavigation = () => undefined;
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                assert.equal(stateNavigator.stateContext.url, '/r0');
                assert.equal(stateNavigator.stateContext.state.key, 's0');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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

    describe('Rewrite Data', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ]);
                const {s} = stateNavigator.states;
                s.rewriteNavigation = () => ({
                    stateKey: 's',
                    navigationData: {
                        a: 'b'
                    }
                });
                const link = navigate(stateNavigator);
                const rewrittenLink = stateNavigator.historyManager.getHref(link).substring(1);
                stateNavigator.navigateLink(rewrittenLink);
                assert.equal(stateNavigator.stateContext.url, '/r?a=b');
                assert.equal(stateNavigator.stateContext.state.key, 's');
                assert.equal(stateNavigator.stateContext.data.a, 'b');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
                assert.equal(stateNavigator.stateContext.url, '/r?a=c');
                assert.equal(stateNavigator.stateContext.state.key, 's');
                assert.equal(stateNavigator.stateContext.data.a, 'c');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r');
                assert.equal(stateNavigator.stateContext.state.key, 's');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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

    describe('Rewrite Data Undefined', () => {
        const test = navigate => {
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r');
                assert.equal(stateNavigator.stateContext.state.key, 's');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r');
                assert.equal(stateNavigator.stateContext.state.key, 's');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r/b');
                assert.equal(stateNavigator.stateContext.state.key, 's');
                assert.equal(stateNavigator.stateContext.data.a, 'b');
                assert.equal(stateNavigator.stateContext.data.c, undefined);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r#f');
                assert.equal(stateNavigator.stateContext.state.key, 's');
                assert.equal(stateNavigator.stateContext.hash, 'f');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r');
                assert.equal(stateNavigator.stateContext.state.key, 's');
                assert.equal(stateNavigator.stateContext.hash, null);
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r');
                assert.equal(stateNavigator.stateContext.state.key, 's');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r2');
                assert.equal(stateNavigator.stateContext.state.key, 's2');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r2#f');
                assert.equal(stateNavigator.stateContext.state.key, 's2');
                assert.equal(stateNavigator.stateContext.hash, 'f');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r2');
                assert.equal(stateNavigator.stateContext.state.key, 's2');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r2?crumb=%2Fr0');
                assert.equal(stateNavigator.stateContext.state.key, 's2');
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state.key, 's0');
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r1');
                assert.equal(stateNavigator.stateContext.state.key, 's1');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r1#f');
                assert.equal(stateNavigator.stateContext.state.key, 's1');
                assert.equal(stateNavigator.stateContext.hash, 'f');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r2');
                assert.equal(stateNavigator.stateContext.state.key, 's2');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r2?crumb=%2Fr0');
                assert.equal(stateNavigator.stateContext.state.key, 's2');
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state.key, 's0');
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r2');
                assert.equal(stateNavigator.stateContext.state.key, 's2');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r2#f');
                assert.equal(stateNavigator.stateContext.state.key, 's2');
                assert.equal(stateNavigator.stateContext.hash, 'f');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r3');
                assert.equal(stateNavigator.stateContext.state.key, 's3');
                assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r3?crumb=%2Fr0');
                assert.equal(stateNavigator.stateContext.state.key, 's3');
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state.key, 's0');
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

    describe('Rewrite Custom Trail', () => {
        const test = navigate => {
            it('should populate href', () => {
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
                assert.equal(stateNavigator.stateContext.url, '/r3?crumb=%2Fr1');
                assert.equal(stateNavigator.stateContext.state.key, 's3');
                assert.equal(stateNavigator.stateContext.crumbs.length, 1);
                assert.equal(stateNavigator.stateContext.crumbs[0].state.key, 's1');
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
});
