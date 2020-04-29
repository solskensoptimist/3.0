import React, {useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';

/**
 * Used to render a popup.
 * Uses store to retrieve content and close/show.
 */
export default (props) => {
    const popupRef = useRef(null);

    useEffect(() => {
        /**
         * When clicking outside popup content, close it.
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
            <div className={'popupWrapper__popup ' + props.size} ref={popupRef}>
                {props.children}
            </div>
        </div>
    );
};
