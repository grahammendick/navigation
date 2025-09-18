'use client'
import * as React from 'react';
import { useNavigationEvent } from 'navigation-react';

const Gender = () => {
    const {data, stateNavigator} = useNavigationEvent();
    const {gender, show} = data;
    return show && (
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
    );
}

export default Gender;
