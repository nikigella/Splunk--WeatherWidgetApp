import React, { Component } from 'react'
import CurrentWeatherComponent from './CurrentWeatherComponent'
import HourlyForecastWeatherComponent from './HourlyForecastWeatherComponent'
import DailyForecastWeatherComponent from './DailyForecastWeatherComponent'
import {Container} from 'react-bootstrap'

class FrontEndAssessment extends Component {
    render() {
        return (
            <Container>
                <div>
                    <CurrentWeatherComponent />
                    <HourlyForecastWeatherComponent />
                    <DailyForecastWeatherComponent />
                </div>
            </Container>
            
        )
    }

 }

export default FrontEndAssessment
