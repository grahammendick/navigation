'use client'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const SharedElementAnimation = ({sharedElements: nextSharedElements, unmountStyle, duration: defaultDuration}: any) => {
    const [sharedElements, setSharedElements] = useState([]);
    const container = useRef(null);
    const {duration = defaultDuration, keyframes = unmountStyle} = unmountStyle || {};
    useLayoutEffect(() => {
        sharedElements.forEach(({oldElement, mountedElement, element, action}, i) => {
            const elementContainer = container.current.children[i];
            const from = oldElement.ref.getBoundingClientRect();
            const fromScene = oldElement.ref.closest('[data-scene="true"').getBoundingClientRect();
            const to = mountedElement.ref.getBoundingClientRect();
            const toScene = mountedElement.ref.closest('[data-scene="true"').getBoundingClientRect();
            if (action === 'play') {
                const toWidth = mountedElement.ref.offsetWidth;
                const toHeight = mountedElement.ref.offsetHeight;
                const fromLeft = from.left - fromScene.left;
                const fromTop = from.top - fromScene.top;
                const toLeft = (to.left - toScene.left) * (toWidth / to.width);
                const toTop = (to.top - toScene.top) * (toHeight / to.height);
                elementContainer.appendChild(element);
                oldElement.ref.style.visibility = 'hidden';
                mountedElement.ref.style.visibility = 'hidden';
                element.style.width = `${from.width}px`;
                element.style.height = `${from.height}px`;
                element.style.top = `${fromTop}px`;
                element.style.left = `${fromLeft}px`;
                element.transition = element.animate([
                    {transform: 'translate(0, 0) scale(1)', ...oldElement.data},
                    {transform: `translate(${toLeft - fromLeft}px, ${toTop - fromTop}px)
                        scale(${toWidth / from.width}, ${toHeight / from.height})`, ...mountedElement.data}
                ], {duration, fill: 'forwards'});
            } else {
                element.transition.reverse();
            }
        });
    }, [sharedElements]);
    useEffect(() => {
        const changed = sharedElements.reduce((changed, {oldElement}, i) => (
            changed || oldElement.ref !== nextSharedElements[i].oldElement.ref
        ), nextSharedElements.length !== sharedElements.length);
        if (changed) {
            if (nextSharedElements[0]?.oldElement.ref !== sharedElements[0]?.mountedElement.ref) {
                sharedElements.forEach(({oldElement, mountedElement}) => {
                    oldElement.ref.style.visibility = 'visible';
                    mountedElement.ref.style.visibility = 'visible';
                })
            }
            setSharedElements(sharedElements => {
                if (!duration || !keyframes) return [];
                return nextSharedElements.map((nextSharedElement, i) => {
                    if (nextSharedElement.oldElement.ref === sharedElements[i]?.mountedElement.ref)
                        return {...nextSharedElement, element: sharedElements[i].element, action: 'reverse'};
                    const element = nextSharedElement.oldElement.ref.cloneNode(true);
                    element.style.margin = '0';
                    element.style.position = 'fixed';
                    element.style.visibility = 'visible';
                    element.style.transformOrigin = 'top left';
                    [...element.querySelectorAll('[data-shared-element="true"')]
                        .forEach(subSharedElement => {subSharedElement.style.visibility = 'hidden';});
                    return {...nextSharedElement, element, action: 'play'};
                })
            });
        }
    }, [sharedElements, nextSharedElements])
    if (!sharedElements.length) return null;
    return <div ref={container}>{sharedElements.map(({name}) => <div key={name} />)}</div>;
};

export default SharedElementAnimation;
