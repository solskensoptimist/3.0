import React from 'react';
import Content from 'components/content';
import Footer from 'components/footer';
import Header from 'components/header';

/**
 * Root component which holds all other subcomponents.
 */
export const AppHolder = () => {
    return (
        <div>
            <Header />
            <Content />
            <Footer />
        </div>
    );
};
