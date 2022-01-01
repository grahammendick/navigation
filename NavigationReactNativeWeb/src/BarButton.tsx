import React, { useContext, ReactElement } from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import NavigationBarContext from './NavigationBarContext';
import ActionBar from './ActionBar';

const BarButton = ({title, image, search, href, testID, onPress, children}) => {
    const tintColor = useContext(NavigationBarContext);
    const childrenArray = (React.Children.toArray(children) as ReactElement<any>[]);
    if (search) return null;
    return (childrenArray.length === 0 || childrenArray[0]?.type === ActionBar)
        ? (
            <TouchableOpacity href={href} testID={testID} onPress={onPress} style={{marginStart: 24}}>
                {image
                    ? <Image source={image} style={{width: 24, height: 24, tintColor}} accessibilityLabel={title} />
                    : <Text style={{color: tintColor}}>{title}</Text>}
            </TouchableOpacity>
        ) : children;
}

export default BarButton;
