import * as assert from 'assert';
import * as mocha from 'mocha';
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
                s0.rewrite = () => ({
                    stateKey: 's1'
                });
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r1');
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
                s0.rewrite = () => null;
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r0');
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
                s0.rewrite = () => undefined;
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r0');
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

    describe('Navigate Rewrite', () => {
        it('should populate context', () => {
            const stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
            ]);
            const {s0} = stateNavigator.states;
            s0.rewrite = () => ({
                stateKey: 's1'
            });
            stateNavigator.navigate('s0');
            assert.equal(stateNavigator.stateContext.state, s0);
            assert.equal(stateNavigator.stateContext.url, '/r0');
            assert.equal(stateNavigator.stateContext.crumbs.length, 0);
        });
    });

    describe('Rewrite Hash', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ]);
                const {s} = stateNavigator.states;
                s.rewrite = () => ({
                    stateKey: 's',
                    hash: 'f'
                });
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r#f');
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
                s.rewrite = () => ({
                    stateKey: 's',
                    hash: null
                });
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r');
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

    describe('Rewrite Empty Reserved Url Character Hash', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's', route: 'r' }
                ]);
                const {s} = stateNavigator.states;
                s.rewrite = () => ({
                    stateKey: 's',
                    hash: '*="/()\'-_+~@:?><.;[],{}!£$%^#&'
                });
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r#*="/()\'-_+~@:?><.;[],{}!£$%^#&');
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
                s.rewrite = () => ({
                    stateKey: 's0'
                });
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r');
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
                s1.rewrite = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2');
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

    describe('Navigate Transition Rewrite', () => {
        it('should populate context', () => {
            const stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' },
            ]);
            const {s1} = stateNavigator.states;
            s1.rewrite = () => ({
                stateKey: 's2'
            });
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            assert.equal(stateNavigator.stateContext.state, s1);
            assert.equal(stateNavigator.stateContext.url, '/r1');
            assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
                s1.rewrite = () => ({
                    stateKey: 's2',
                    hash: 'f'
                });
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2#f');
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
                s1.rewrite = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2');
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

    describe('Navigate Transition With Trail Rewrite', () => {
        it('should populate context', () => {
            const stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2' },
            ]);
            const {s0, s1} = stateNavigator.states;
            s1.rewrite = () => ({
                stateKey: 's2'
            });
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            assert.equal(stateNavigator.stateContext.state, s1);
            assert.equal(stateNavigator.stateContext.url, '/r1?crumb=%2Fr0');
            assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            assert.equal(stateNavigator.stateContext.crumbs[0].state, s0);
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
                s1.rewrite = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2?crumb=%2Fr0');
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
                s0.rewrite = () => ({
                    stateKey: 's1'
                });
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r1');
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

    describe('Navigate Refresh Rewrite', () => {
        it('should populate context', () => {
            const stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
            ]);
            const {s0} = stateNavigator.states;
            s0.rewrite = () => ({
                stateKey: 's1'
            });
            stateNavigator.navigate('s0');
            stateNavigator.refresh();
            assert.equal(stateNavigator.stateContext.state, s0);
            assert.equal(stateNavigator.stateContext.url, '/r0');
            assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
                s0.rewrite = () => ({
                    stateKey: 's1',
                    hash: 'f'
                });
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r1#f');
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
                s1.rewrite = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2');
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

    describe('Navigate Refresh With Trail Rewrite', () => {
        it('should populate href', () => {
            const stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2' },
            ]);
            const {s0, s1} = stateNavigator.states;
            s1.rewrite = () => ({
                stateKey: 's2'
            });
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            stateNavigator.refresh();
            assert.equal(stateNavigator.stateContext.state, s1);
            assert.equal(stateNavigator.stateContext.url, '/r1?crumb=%2Fr0');
            assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            assert.equal(stateNavigator.stateContext.crumbs[0].state, s0);
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
                s1.rewrite = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2?crumb=%2Fr0');
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
                s0.rewrite = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2');
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

    describe('Navigate Back Rewrite', () => {
        it('should populate href', () => {
            const stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2' },
            ]);
            const {s0} = stateNavigator.states;
            s0.rewrite = () => ({
                stateKey: 's2'
            });
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            stateNavigator.navigateBack(1);
            assert.equal(stateNavigator.stateContext.state, s0);
            assert.equal(stateNavigator.stateContext.url, '/r0');
            assert.equal(stateNavigator.stateContext.crumbs.length, 0);
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
                s0.rewrite = () => ({
                    stateKey: 's2',
                    hash: 'f'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2#f');
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
                s1.rewrite = () => ({
                    stateKey: 's3'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r3');
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

    describe('Navigate Back With Trail Rewrite', () => {
        it('should populate context', () => {
            const stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
                { key: 's3', route: 'r3' },
            ]);
            const {s0, s1} = stateNavigator.states;
            s1.rewrite = () => ({
                stateKey: 's3'
            });
            stateNavigator.navigate('s0');
            stateNavigator.navigate('s1');
            stateNavigator.navigate('s2');
            stateNavigator.navigateBack(1);
            assert.equal(stateNavigator.stateContext.state, s1);
            assert.equal(stateNavigator.stateContext.url, '/r1?crumb=%2Fr0');
            assert.equal(stateNavigator.stateContext.crumbs.length, 1);
            assert.equal(stateNavigator.stateContext.crumbs[0].state, s0);
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
                s1.rewrite = () => ({
                    stateKey: 's3'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r3?crumb=%2Fr0');
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

    describe('Transition Rewrite Transition With Trail', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewrite = () => ({
                    stateKey: 's1'
                });
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r1?crumb=%2Fr1');
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

    describe('Transition Rewrite Transition With Trail Rewrite With Trail', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                ]);
                const {s0, s1} = stateNavigator.states;
                s0.rewrite = () => ({
                    stateKey: 's1'
                });
                s1.rewrite = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2?crumb=%2Fr1');
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

    describe('Transition Rewrite Transition With Trail Rewrite Transition With Trail', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                ]);
                const {s1, s0} = stateNavigator.states;
                s0.rewrite = () => ({
                    stateKey: 's1'
                });
                s1.rewrite = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2?crumb=%2Fr1&crumb=%2Fr2');
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

    describe('Transition Rewrite Transition With Trail Transition With Trail', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewrite = () => ({
                    stateKey: 's1'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2?crumb=%2Fr1&crumb=%2Fr1');
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

    describe('Transition Transition With Trail Rewrite Transition With Trail', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                ]);
                const {s1} = stateNavigator.states;
                s1.rewrite = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2?crumb=%2Fr0&crumb=%2Fr2');
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

    describe('Transition Rewrite Transition With Trail Rewrite Transition With Trail Rewrite With Trail', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                    { key: 's3', route: 'r3', trackCrumbTrail: true },
                ]);
                const {s1, s0, s2} = stateNavigator.states;
                s0.rewrite = () => ({
                    stateKey: 's1'
                });
                s1.rewrite = () => ({
                    stateKey: 's2'
                });
                s2.rewrite = () => ({
                    stateKey: 's3'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r3?crumb=%2Fr1&crumb=%2Fr2');
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

    describe('Transition Rewrite Hash Transition With Trail Rewrite Hash Transition With Trail Rewrite With Trail Hash', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                    { key: 's3', route: 'r3', trackCrumbTrail: true },
                ]);
                const {s1, s0, s2} = stateNavigator.states;
                s0.rewrite = () => ({
                    stateKey: 's1',
                    hash: 'f0'
                });
                s1.rewrite = () => ({
                    stateKey: 's2',
                    hash: 'f1'
                });
                s2.rewrite = () => ({
                    stateKey: 's3',
                    hash: 'f2'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r3?crumb=%2Fr1%23f0&crumb=%2Fr2%23f1#f2');
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

    describe('Transition Rewrite Refresh With Trail', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewrite = () => ({
                    stateKey: 's1'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r1?crumb=%2Fr1');
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

    describe('Transition Rewrite Refresh With Trail Rewrite With Trail', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                ]);
                const {s0, s1} = stateNavigator.states;
                s0.rewrite = () => ({
                    stateKey: 's1'
                });
                s1.rewrite = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2?crumb=%2Fr1');
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

    describe('Transition Rewrite Transition With Trail Rewrite Refresh With Trail', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                ]);
                const {s1, s0} = stateNavigator.states;
                s0.rewrite = () => ({
                    stateKey: 's1'
                });
                s1.rewrite = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2?crumb=%2Fr1&crumb=%2Fr2');
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

    describe('Transition Rewrite Transition With Trail Refresh With Trail', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                ]);
                const {s0} = stateNavigator.states;
                s0.rewrite = () => ({
                    stateKey: 's1'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2?crumb=%2Fr1&crumb=%2Fr1');
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

    describe('Transition Transition With Trail Rewrite Refresh With Trail', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                ]);
                const {s1} = stateNavigator.states;
                s1.rewrite = () => ({
                    stateKey: 's2'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2?crumb=%2Fr0&crumb=%2Fr2');
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

    describe('Transition Rewrite Transition With Trail Rewrite Refresh With Trail Rewrite With Trail', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                    { key: 's3', route: 'r3', trackCrumbTrail: true },
                ]);
                const {s1, s0, s2} = stateNavigator.states;
                s0.rewrite = () => ({
                    stateKey: 's1'
                });
                s1.rewrite = () => ({
                    stateKey: 's2'
                });
                s2.rewrite = () => ({
                    stateKey: 's3'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r3?crumb=%2Fr1&crumb=%2Fr2');
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

    describe('Transition Rewrite Hash Transition With Trail Rewrite Hash Refresh With Trail Rewrite With Trail Hash', () => {
        const test = navigate => {
            it('should populate href', () => {
                const stateNavigator = new StateNavigator([
                    { key: 's0', route: 'r0' },
                    { key: 's1', route: 'r1', trackCrumbTrail: true },
                    { key: 's2', route: 'r2', trackCrumbTrail: true },
                    { key: 's3', route: 'r3', trackCrumbTrail: true },
                ]);
                const {s1, s0, s2} = stateNavigator.states;
                s0.rewrite = () => ({
                    stateKey: 's1',
                    hash: 'f0'
                });
                s1.rewrite = () => ({
                    stateKey: 's2',
                    hash: 'f1'
                });
                s2.rewrite = () => ({
                    stateKey: 's3',
                    hash: 'f2'
                });
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                stateNavigator.navigate('s2');
                const link = navigate(stateNavigator);
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r3?crumb=%2Fr1%23f0&crumb=%2Fr2%23f1#f2');
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
});
