'use client'
import { RefreshLink, useNavigationEvent } from 'navigation-react';
import { useOptimistic } from 'react';

const Filter = () => {
    const {data, stateNavigator} = useNavigationEvent();
    const {name} = data;
    const [optimisticName, setOptimisticName] = useOptimistic(name || '', (_, newName) => newName);
    return (
        <div>
            <div>
                <label htmlFor="name">Name</label>
                <input id="name" value={optimisticName || ''} onChange={({target: {value}}) => {
                    setOptimisticName(value);
                    stateNavigator.refresh({...data, name: value, page: null});
                }} />
            </div>
            Page size
            <RefreshLink navigationData={{size: 5, page: null}} includeCurrentData>5</RefreshLink>
            <RefreshLink navigationData={{size: 10, page: null}} includeCurrentData>10</RefreshLink>
        </div>
    );
}

export default Filter;
