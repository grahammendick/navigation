import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const SharedElementAnimation = ({sharedElements: nextSharedElements, unmountStyle, duration: defaultDuration}: any) => {
    const [sharedElements, setSharedElements] = useState([]);
    const container = useRef(null);
    const {duration = defaultDuration, keyframes = unmountStyle} = unmountStyle || {};
    useLayoutEffect(() => {
        sharedElements.forEach(({oldElement, mountedElement, element, action}, i) => {
            const elementContainer = container.current.children[i];
            const from = oldElement.getBoundingClientRect();
            const fromScene = oldElement.closest('[data-scene="true"').getBoundingClientRect();
            const to = mountedElement.getBoundingClientRect();
            const toScene = mountedElement.closest('[data-scene="true"').getBoundingClientRect();
            if (action === 'play') {
                const toWidth = mountedElement.offsetWidth;
                const toHeight = mountedElement.offsetHeight;
                const fromLeft = from.left - fromScene.left;
                const fromTop = from.top - fromScene.top;
                const toLeft = (to.left - toScene.left) * (toWidth / to.width);
                const toTop = (to.top - toScene.top) * (toHeight / to.height);
                elementContainer.appendChild(element);
                oldElement.style.visibility = 'hidden';
                mountedElement.style.visibility = 'hidden';
                element.style.position = 'fixed';
                element.style.visibility = 'visible';
                element.style.width = `${from.width}px`;
                element.style.height = `${from.height}px`;
                element.style.top = `${fromTop}px`;
                element.style.left = `${fromLeft}px`;
                element.style.transformOrigin = 'top left';
                element.transition = element.animate([
                    {transform: 'translate(0, 0) scale(1)'},
                    {transform: `translate(${toLeft - fromLeft}px, ${toTop - fromTop}px)
                        scale(${toWidth / from.width}, ${toHeight / from.height})`}
                ], {duration, fill: 'forwards'});
            } else {
                element.transition.reverse();
            }
        });
    }, [sharedElements]);
    useEffect(() => {
        const changed = sharedElements.reduce((changed, {oldElement}, i) => (
            changed || oldElement !== nextSharedElements[i].oldElement
        ), nextSharedElements.length !== sharedElements.length);
        if (changed) {
            if (nextSharedElements[0]?.oldElement !== sharedElements[0]?.mountedElement) {
                sharedElements.forEach(({oldElement, mountedElement}) => {
                    oldElement.style.visibility = 'visible';
                    mountedElement.style.visibility = 'visible';
                })
            }
            setSharedElements(sharedElements => {
                if (!duration || !keyframes) return [];
                return nextSharedElements.map((nextSharedElement, i) => {
                    if (nextSharedElement.oldElement === sharedElements[i]?.mountedElement)
                        return {...nextSharedElement, element: sharedElements[i].element, action: 'reverse'};
                    const element = nextSharedElement.oldElement.cloneNode(true);
                    return {...nextSharedElement, element, action: 'play'};
                })
            });
        }
    }, [sharedElements, nextSharedElements])
    if (!sharedElements.length) return null;
    return (
        <div ref={container} style={{display: 'flex', flexDirection: 'column', flex: 1}}>
            {sharedElements.map(({name}) => <div key={name} />)}
        </div>
    );
};

export default SharedElementAnimation;
