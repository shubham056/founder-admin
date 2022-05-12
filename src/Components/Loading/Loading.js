import React, { Component } from 'react';
import './Loading.css';

export class Loading extends Component {
    render() {
        return (
            <div>
                <div className="loading-main">
                    <div className="spinner"></div>
                </div>
            </div>
        )
    }
}

export default Loading;
