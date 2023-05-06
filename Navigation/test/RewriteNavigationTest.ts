import * as assert from 'assert';
import * as mocha from 'mocha';
import { StateNavigator } from 'navigation';

describe('Rewrite Navigation', () => {
    describe('Rewrite State', () => {
        let stateNavigator: StateNavigator;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
            ]);
            const {s0} = stateNavigator.states;
            s0.rewrite = () => ({
                stateKey: 's1'
            });
        });

        const test = navigate => {
            it('should populate href', () => {
                const link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r1');
            });
        }

        describe('Navigate', () => {
            test(() => {
                stateNavigator.navigate('s0');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(() => {
                return stateNavigator.getNavigationLink('s0');
            });
        });

        describe('Fluent Navigate', () => {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s0').url;
            });            
        });
    });

    describe('Rewrite Hash', () => {
        let stateNavigator: StateNavigator;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            const {s} = stateNavigator.states;
            s.rewrite = () => ({
                stateKey: 's',
                hash: 'f'
            });
        });

        const test = navigate => {
            it('should populate href', () => {
                const link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r#f');
            });
        }

        describe('Navigate', () => {
            test(() => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(() => {
                return stateNavigator.getNavigationLink('s');
            });
        });

        describe('Fluent Navigate', () => {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s').url;
            });            
        });
    });

    describe('Rewrite Null Hash', () => {
        let stateNavigator: StateNavigator;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            const {s} = stateNavigator.states;
            s.rewrite = () => ({
                stateKey: 's',
                hash: null
            });
        });

        const test = navigate => {
            it('should populate href', () => {
                const link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r');
            });
        }

        describe('Navigate', () => {
            test(() => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(() => {
                return stateNavigator.getNavigationLink('s');
            });
        });

        describe('Fluent Navigate', () => {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s').url;
            });            
        });
    });

    describe('Rewrite Empty Reserved Url Character Hash', () => {
        let stateNavigator: StateNavigator;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            const {s} = stateNavigator.states;
            s.rewrite = () => ({
                stateKey: 's',
                hash: '*="/()\'-_+~@:?><.;[],{}!£$%^#&'
            });
        });

        const test = navigate => {
            it('should populate href', () => {
                const link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r#*="/()\'-_+~@:?><.;[],{}!£$%^#&');
            });
        }

        describe('Navigate', () => {
            test(() => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(() => {
                return stateNavigator.getNavigationLink('s');
            });
        });

        describe('Fluent Navigate', () => {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s').url;
            });            
        });
    });

    describe('Rewrite Invalid State', () => {
        let stateNavigator: StateNavigator;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 's', route: 'r' }
            ]);
            const {s} = stateNavigator.states;
            s.rewrite = () => ({
                stateKey: 's0'
            });
        });

        const test = navigate => {
            it('should populate href', () => {
                const link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r');
            });
        }

        describe('Navigate', () => {
            test(() => {
                stateNavigator.navigate('s');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(() => {
                return stateNavigator.getNavigationLink('s');
            });
        });

        describe('Fluent Navigate', () => {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s').url;
            });            
        });
    });

    describe('Transition Rewrite', () => {
        let stateNavigator: StateNavigator;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' },
            ]);
            const {s1} = stateNavigator.states;
            s1.rewrite = () => ({
                stateKey: 's2'
            });
        });

        const test = navigate => {
            it('should populate href', () => {
                const link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2');
            });
        }

        describe('Navigate', () => {
            test(() => {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(() => {
                const link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                return stateNavigator.getNavigationLink('s1');
            });
        });

        describe('Fluent Navigate', () => {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1').url;
            });            
        });
    });

    describe('Transition Rewrite Hash', () => {
        let stateNavigator: StateNavigator;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1' },
                { key: 's2', route: 'r2' },
            ]);
            const {s1} = stateNavigator.states;
            s1.rewrite = () => ({
                stateKey: 's2',
                hash: 'f'
            });
        });

        const test = navigate => {
            it('should populate href', () => {
                const link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2#f');
            });
        }

        describe('Navigate', () => {
            test(() => {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(() => {
                const link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                return stateNavigator.getNavigationLink('s1');
            });
        });

        describe('Fluent Navigate', () => {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1').url;
            });            
        });
    });

    describe('Transition With Trail Rewrite', () => {
        let stateNavigator: StateNavigator;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2' },
            ]);
            const {s1} = stateNavigator.states;
            s1.rewrite = () => ({
                stateKey: 's2'
            });
        });

        const test = navigate => {
            it('should populate href', () => {
                const link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2');
            });
        }

        describe('Navigate', () => {
            test(() => {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(() => {
                const link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                return stateNavigator.getNavigationLink('s1');
            });
        });

        describe('Fluent Navigate', () => {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1').url;
            });            
        });
    });

    describe('Transition With Trail Rewrite Hash', () => {
        let stateNavigator: StateNavigator;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2' },
            ]);
            const {s1} = stateNavigator.states;
            s1.rewrite = () => ({
                stateKey: 's2',
                hash: 'f'
            });
        });

        const test = navigate => {
            it('should populate href', () => {
                const link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2#f');
            });
        }

        describe('Navigate', () => {
            test(() => {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(() => {
                const link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                return stateNavigator.getNavigationLink('s1');
            });
        });

        describe('Fluent Navigate', () => {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1').url;
            });            
        });
    });

    describe('Transition With Trail Rewrite With Trail', () => {
        let stateNavigator: StateNavigator;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
            ]);
            const {s1} = stateNavigator.states;
            s1.rewrite = () => ({
                stateKey: 's2'
            });
        });

        const test = navigate => {
            it('should populate href', () => {
                const link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2?crumb=%2Fr0');
            });
        }

        describe('Navigate', () => {
            test(() => {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(() => {
                const link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                return stateNavigator.getNavigationLink('s1');
            });
        });

        describe('Fluent Navigate', () => {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1').url;
            });            
        });
    });

    describe('Transition With Trail Rewrite With Trail Hash', () => {
        let stateNavigator: StateNavigator;
        beforeEach(() => {
            stateNavigator = new StateNavigator([
                { key: 's0', route: 'r0' },
                { key: 's1', route: 'r1', trackCrumbTrail: true },
                { key: 's2', route: 'r2', trackCrumbTrail: true },
            ]);
            const {s1} = stateNavigator.states;
            s1.rewrite = () => ({
                stateKey: 's2',
                hash: 'f'
            });
        });

        const test = navigate => {
            it('should populate href', () => {
                const link = navigate();
                assert.equal(stateNavigator.historyManager.getHref(link), '#/r2?crumb=%2Fr0#f');
            });
        }

        describe('Navigate', () => {
            test(() => {
                stateNavigator.navigate('s0');
                stateNavigator.navigate('s1');
                return stateNavigator.stateContext.url
            });
        });

        describe('Navigate Link', () => {
            test(() => {
                const link = stateNavigator.getNavigationLink('s0');
                stateNavigator.navigateLink(link);
                return stateNavigator.getNavigationLink('s1');
            });
        });

        describe('Fluent Navigate', () => {
            test(() => {
                return stateNavigator.fluent()
                    .navigate('s0')
                    .navigate('s1').url;
            });            
        });
    });
});
