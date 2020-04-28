import React, {useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';

/**
 * Used to render a popup.
 * Uses store to retrieve content and close/show.
 */
export default (props) => {
    const popupRef = useRef(null);

    const _closeComponent = () => {
        props.close();
    };

    useEffect(() => {
        /**
         * When clicking outside popup content, close it.
         */
        const _closePopup = (e) => {
            if (popupRef && popupRef.current) {
                const node = ReactDOM.findDOMNode(popupRef.current);
                if (node && !node.contains(e.target)) {
                    _closeComponent();
                }
            }
        };

        window.addEventListener('mousedown', _closePopup);
        return () => window.removeEventListener('mousedown', _closePopup);
    }, []);

    return (
        <div className='popupWrapper'>
            <div className={'popupWrapper__popup ' + props.size} ref={popupRef}>
                {props.children}
            </div>
        </div>
    );
};
