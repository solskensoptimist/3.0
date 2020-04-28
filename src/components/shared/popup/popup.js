import React, {useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';

/**
 * Used to render content as a popup.
 *
 * @param props.close - func - function that closes popup
 * @param props.size - string - small|medium|big
 */
export default (props) => {
    const popupRef = useRef(null);

    const _closeComponent = () => {
        props.close();
    };

    useEffect(() => {
        /**
         * When clicking outside EditDeal, close it.
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
