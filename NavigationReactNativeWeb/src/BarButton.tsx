import React, { useContext } from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import NavigationBarContext from './NavigationBarContext';

const BarButton = ({title, image, testID, onPress}) => {
    const tintColor = useContext(NavigationBarContext);
    return (
        <TouchableOpacity testID={testID} onPress={onPress} style={{marginStart: 24}}>
            {image
                ? <Image source={image} style={{width: 24, height: 24, tintColor}} accessibilityLabel={title} />
                : <Text style={{color: tintColor}}>{title}</Text>}
        </TouchableOpacity>
    );
}

export default BarButton;
