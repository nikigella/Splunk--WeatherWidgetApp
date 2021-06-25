import React, { Component } from 'react';
import WeatherApp from './WeatherApp'
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
    render() {
        return (
            <div className="container">
                <WeatherApp />
            </div>
        );
    }
};

export default App;