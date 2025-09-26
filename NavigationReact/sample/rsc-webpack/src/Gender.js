'use client'
import * as React from 'react';
import { useNavigationEvent, RefreshLink } from 'navigation-react';

const Gender = () => {
    const {data, stateNavigator} = useNavigationEvent();
    const {gender, show} = data;
    return (
        <>
            <RefreshLink navigationData={{show: !show}} includeCurrentData>{`${!show ? 'Show' : 'Hide'} Friends`}</RefreshLink>
            {show && (
                <div>
                    <label htmlFor="gender">Gender</label>
                    <select id="gender" value={gender || ''} onChange={({target: {value}}) => {
                        stateNavigator.refresh({...data, gender: value});
                    }}>
                        <option value=""></option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            )}
        </>
    );
}

export default Gender;
