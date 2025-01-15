'use client'
import {RefreshLink, useNavigationEvent} from 'navigation-react';

const Filter = () => {
    const {data, stateNavigator} = useNavigationEvent();
    return (
        <div>
            <div>
                <label htmlFor="name">Name</label>
                <input id="name" value={data.name || ''} onChange={({target}) => {
                    stateNavigator.refresh({...data, name: target.value, page: 1});
                }} />
            </div>
            Page size
            <RefreshLink navigationData={{size: 5, page: 1}} includeCurrentData>5</RefreshLink>
            <RefreshLink navigationData={{size: 10, page: 1}} includeCurrentData>10</RefreshLink>
        </div>
    );
}

export default Filter;
