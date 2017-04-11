import * as React from 'react';
import { Motion } from 'react-motion';
import { View } from 'react-native';

class SharedElementMotion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onRegisterSharedElement = this.onRegisterSharedElement.bind(this);
        this.state = {url: this.getStateNavigator().stateContext.url, sharedElements: {}};
    }
    static contextTypes = {
        stateNavigator: React.PropTypes.object,
        onRegisterSharedElement: React.PropTypes.func
    }
    getStateNavigator() {
        return this.props.stateNavigator || this.context.stateNavigator;
    }
    componentDidMount() {
        this.context.onRegisterSharedElement(this.onRegisterSharedElement);
    }
    componentWillUnmount() {
        this.context.offRegisterSharedElement(this.onRegisterSharedElement);
    }
    onRegisterSharedElement(url, name, element, measurements) {
        this.setState(({sharedElements: prevSharedElements}) => {
            var sharedElements = {...prevSharedElements};
            var sharedElement = {element, measurements};
            sharedElements[url] = {...sharedElements[url], [name]: sharedElement};
            return {sharedElements};
        });
    }
    getSharedElements() {
        var {currentUrl, oldUrl} = this.getStateNavigator().stateContext;
        var {url, sharedElements} = this.state;
        var matchedSharedElements = [];
        if (url !== currentUrl) {
            for(var name in sharedElements[url]) {
                if ((sharedElements[oldUrl] || {})[name]) {
                    matchedSharedElements.push({
                        name,
                        from: sharedElements[oldUrl][name],
                        to: sharedElements[url][name]
                    })
                }
            }
        }
        return matchedSharedElements;
    }
    render() {
        var {children, fromStyle = m => m, toStyle = m => m} = this.props;
        return (
            <View>
                {this.getSharedElements().map(({name, from, to}) => (
                    <Motion key={name} defaultStyle={fromStyle(from.measurements)} style={toStyle(to.measurements)}>
                        {tweenStyle => children(tweenStyle, from.element, name)}
                    </Motion>
                ))}
            </View>
        );
    }
}

export default SharedElementMotion;
