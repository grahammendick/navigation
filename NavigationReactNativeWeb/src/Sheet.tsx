import React, { useEffect, useState, useRef } from 'react';

const Sheet = ({detent, defaultDetent = 'collapsed', modal = true, onChangeDetent, children}) => {
    const [selectedDetent, setSelectedDetent]  = useState(detent || defaultDetent);
    const dialogEl = useRef<HTMLDialogElement | null>(null);
    if (detent != null && detent !== selectedDetent)
        setSelectedDetent(detent);
    useEffect(() => {
        if (selectedDetent !== 'hidden') {
            if (modal) dialogEl.current.showModal();
            else dialogEl.current.show();
        } else {
            dialogEl.current.close();
        }
    }, [selectedDetent, modal])
    const onClose = () => {
        if (selectedDetent !== 'hidden') {
            if (detent == null) setSelectedDetent('hidden');
            if (!!onChangeDetent) onChangeDetent('hidden');
        }
    };
    return (
        <dialog
            ref={dialogEl}
            onClose={onClose}
            style={{
                display: selectedDetent !== 'hidden' ? 'flex' : 'none',
                backgroundColor: 'transparent',
                width: '100%',
                height: '100%',
                border: 0,
                padding: 0,
                zIndex: 54,
            }}>
            {children}
        </dialog>
    );
}

export const BottomSheet = Sheet;
export default Sheet;
