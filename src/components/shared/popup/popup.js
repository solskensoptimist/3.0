import React, {useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';

/**
 * Used to render a popup.
 * Uses store to retrieve components and close/show.
 */
export default (props) => {
    const popupRef = useRef(null);
    const size = (props.size) ? props.size : 'medium';

    useEffect(() => {
        /**
         * When clicking outside popup components, close it.
         */
        const _closePopup = (e) => {
            if (popupRef && popupRef.current) {
                const node = ReactDOM.findDOMNode(popupRef.current);
                if (node && !node.contains(e.target)) {
                    props.close();
                }
            }
        };

        window.addEventListener('mousedown', _closePopup);
        return () => window.removeEventListener('mousedown', _closePopup);
    }, [props]);

    return (
        <div className='popupWrapper'>
            <div className={'popupWrapper__popup ' + size} ref={popupRef}>
                {props.children}
            </div>
        </div>
    );
};
