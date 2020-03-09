import React from "react";
import Header from './header';
import Content from './content';

/**
 * Main component for logged out content.
 */
export default () => {
    return (
        <div>
            <Header />
            <Content />
        </div>
    );
};
