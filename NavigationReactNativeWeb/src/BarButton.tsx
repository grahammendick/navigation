import React, { useContext, ReactElement } from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import NavigationBarContext from './NavigationBarContext';
import ActionBar from './ActionBar';

const BarButton = ({title, image, search, fontFamily, fontWeight, fontStyle, fontSize = 14, href, testID, onPress, children}) => {
    const tintColor = useContext(NavigationBarContext);
    const childrenArray = (React.Children.toArray(children) as ReactElement<any>[]);
    if (search) return null;
    const onButtonPress = (e) => {
        if (!href || (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button)) {
            if (href) e.preventDefault();
            onPress();
        }
    }
    return (childrenArray.length === 0 || childrenArray[0]?.type === ActionBar)
        ? (
            <TouchableOpacity href={href} testID={testID} onPress={onButtonPress} style={{marginStart: 24}}>
                {image
                    ? <Image source={image} style={{width: 24, height: 24, tintColor}} accessibilityLabel={title} />
                    : <Text style={{color: tintColor, fontFamily, fontWeight, fontStyle, fontSize, textTransform: 'uppercase'}}>{title}</Text>}
            </TouchableOpacity>
        ) : children;
}

export default BarButton;
