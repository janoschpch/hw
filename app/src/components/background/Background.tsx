import React from 'react';

import './Background.css';

export default class BackgroundComponent extends React.Component {
    render() {
        return (
            <div className="background" style={{
                backgroundImage: `url('/assets/background.jpg')`
            }}>
            </div>
        );
    }
}