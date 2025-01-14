'use client'
import {RefreshLink, useNavigationEvent} from 'navigation-react';

const Filter = () => {
    const {data, stateNavigator} = useNavigationEvent();
    return (
        <div>
            <div>
                <label htmlFor="name">Name</label>
                <input id="name" value={data.name || ''} onChange={({target}) => {
                    stateNavigator.refresh({...data, name: target.value, startRowIndex: null});
                }} />
            </div>
            Page size
            <RefreshLink
                navigationData={{maximumRows: 5, startRowIndex: null}}
                includeCurrentData>
                5
            </RefreshLink>
            <RefreshLink
                navigationData={{maximumRows: 10, startRowIndex: null}}
                includeCurrentData
            >
                10
            </RefreshLink>
        </div>
    );
}

export default Filter;
