// npx tsc --project ./navigation-react-mobile-tests.json
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationEvent, NavigationLink } from 'navigation-react';
import { Scene, MobileHistoryManager, SharedElement, NavigationStack } from 'navigation-react-mobile';
import { useContext } from 'react';
import { createRoot } from 'react-dom/client';

type AppNavigation = {
    people: { page?: number },
    person: { id: string }
}

const stateNavigator: StateNavigator<AppNavigation> = new StateNavigator<AppNavigation>([
    { key: 'people', route: 'people/{page}' },
    { key: 'person', route: 'person/{id}', trackCrumbTrail: true }
], new MobileHistoryManager(url => {
    const { state, data } = stateNavigator.parseLink(url);
    return stateNavigator.fluent()
        .navigate('people')
        .navigate(state.key as any, data).url;
}));

const People = () => (
    <ul>
        {['Bob', 'Brenda'].map(id => (
            <li>
                <NavigationLink<AppNavigation, 'person'> stateKey="person" navigationData={{ id }}>
                    <SharedElement name={id} data={{ id }}>
                        <div>Bob</div>
                    </SharedElement>
                </NavigationLink>
            </li>
        ))}
    </ul>
);

const Person = () => {
    const { data } = useContext<NavigationEvent<AppNavigation, 'person'>>(NavigationContext);
    const { id } = data;
    return (
        <SharedElement name={id} data={{ id }}>
            <div>Bob</div>
        </SharedElement>    
    );
}

stateNavigator.start();

const root = createRoot(document.getElementById("root")!);
root.render(
    <NavigationStack
        unmountStyle={[
            {transform: 'translateX(100%)'},
            {transform: 'translateX(0)'}
          ]}
        crumbStyle={[
            {transform: 'translateX(-60%)'},
            {transform: 'translateX(0)'}
          ]}>
        <Scene stateKey="people" sharedElements={({id}) => [id]}><People /></Scene>
        <Scene stateKey="person"><Person /></Scene>
    </NavigationStack>
);
