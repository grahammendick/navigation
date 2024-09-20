import React, { useLayoutEffect, useRef, useState } from 'react';

const SharedElementAnimation = ({sharedElements: nextSharedElements}: any) => {
    const [sharedElements, setSharedElements] = useState([]);
    const container = useRef(null);
    useLayoutEffect(() => {
        sharedElements.forEach(({oldElement, mountedElement, element, action}, i) => {
            const elementContainer = container.current.children[i];
            const from = oldElement.ref.getBoundingClientRect();
            const to = mountedElement.ref.getBoundingClientRect();
            if (action === 'play') {
                elementContainer.appendChild(element);
                element.style.position = 'absolute';
                element.style.width = from.width;
                element.style.height = from.height;
                element.style.top = from.top;
                element.style.left = from.left;
                element.transition = element.animate([
                    {transform: 'translate(0, 0) scale(1)'},
                    {transform: `
                        translate(${to.left - from.left}, ${to.top - from.top})
                        scale(${to.width / from.width}, ${to.height / from.height})
                    `}
                ], {duration: 1000, fill: 'forwards'});
            } else {
                element.transition.reverse();
            }
        });
    }, [sharedElements]);
    const changed = sharedElements.reduce((changed, {oldElement}, i) => (
        changed || oldElement.ref !== nextSharedElements[i].oldElement.ref
    ), nextSharedElements.length !== sharedElements.length)
    if (changed) {
        setSharedElements(sharedElements => (
            nextSharedElements.map((nextSharedElement, i) => {
                if (nextSharedElement.oldElement.ref === sharedElements[i]?.mountedElement.ref)
                    return {...nextSharedElement, element: sharedElements[i].element, action: 'reverse'};
                // need to remove ids to prevent duplicates?!
                const element = nextSharedElement.oldElement.ref.cloneNode(true);
                return {...nextSharedElement, element, action: 'play'};
            })
        ));
    }
    return (
        <div ref={container}>
            {sharedElements.map(({name}) => <div key={name} style={{position: 'absolute'}} />)}
        </div>
    );
};

export default SharedElementAnimation;
