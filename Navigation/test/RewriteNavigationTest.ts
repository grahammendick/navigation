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
});
