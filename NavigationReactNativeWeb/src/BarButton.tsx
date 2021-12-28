import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';

const BarButton = ({title, image, testID, onPress}) => (
    <TouchableOpacity testID={testID} onPress={onPress}>
        {image
            ? <Image source={image} style={{width: 24, height: 24}} />
            : <Text>{title}</Text>}
    </TouchableOpacity>
);

export default BarButton;